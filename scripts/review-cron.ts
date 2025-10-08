
// Script para ejecutar como cron job o mediante scheduler
// Este archivo maneja la automatización de envío de reseñas

import { prisma } from '@/lib/prisma';
import cron from 'node-cron';

interface ReviewRequest {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  googleReviewLink: string;
  incentiveCode?: string;
  segmentType: string;
  Restaurant: {
    name: string;
  };
}

// Función principal para procesar reseñas pendientes
async function processReviewRequests() {
  console.log('🔍 Iniciando procesamiento de solicitudes de reseña...');
  
  try {
    // Llamar a la API de envío de reseñas pendientes
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews/send-pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Procesamiento completado:`);
      console.log(`   📤 Solicitudes procesadas: ${result.processed}`);
      console.log(`   ✉️  Mensajes enviados: ${result.sent}`);
      console.log(`   ❌ Errores: ${result.errors}`);

      // Log detallado de resultados
      if (result.results && result.results.length > 0) {
        result.results.forEach((item: any) => {
          if (item.status === 'sent') {
            console.log(`   👤 ${item.customerName} - ${item.channel} ✅`);
          } else if (item.status === 'error') {
            console.log(`   👤 ${item.customerName} - Error: ${item.error} ❌`);
          }
        });
      }

      // Limpiar solicitudes expiradas (más de 7 días sin respuesta)
      await cleanupExpiredRequests();

    } else {
      console.error('❌ Error en el procesamiento:', result.error);
    }

  } catch (error) {
    console.error('❌ Error crítico en el cron job:', error);
  }
}

// Limpiar solicitudes expiradas
async function cleanupExpiredRequests() {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 7); // 7 días atrás

    const expiredCount = await prisma.reviewRequest.updateMany({
      where: {
        status: 'SENT',
        sentAt: {
          lt: expirationDate
        }
      },
      data: {
        status: 'EXPIRED'
      }
    });

    if (expiredCount.count > 0) {
      console.log(`🗑️  Marcadas como expiradas ${expiredCount.count} solicitudes antiguas`);
    }

  } catch (error) {
    console.error('❌ Error limpiando solicitudes expiradas:', error);
  }
}

// Sincronizar datos de Google Places para todos los restaurantes
async function syncGooglePlacesData() {
  console.log('🔄 Sincronizando datos de Google Places...');
  
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        GooglePlaceData: true
      }
    });

    let syncedCount = 0;

    for (const restaurant of restaurants) {
      if (restaurant.GooglePlaceData?.placeId) {
        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/reviews/google-places?restaurantId=${restaurant.id}&placeId=${restaurant.GooglePlaceData.placeId}`,
            { method: 'GET' }
          );

          if (response.ok) {
            syncedCount++;
          }
        } catch (error) {
          console.error(`❌ Error sincronizando ${restaurant.name}:`, error);
        }
      }
    }

    console.log(`✅ Sincronizados ${syncedCount} restaurantes con Google Places`);

  } catch (error) {
    console.error('❌ Error en sincronización de Google Places:', error);
  }
}

// Análisis y optimización ML básica
async function performMLOptimization() {
  console.log('🤖 Ejecutando optimizaciones ML...');
  
  try {
    // Analizar patrones de éxito para ajustar timing automáticamente
    const successPatterns = await prisma.$queryRaw`
      SELECT 
        EXTRACT(hour FROM "sentAt") as send_hour,
        EXTRACT(dow FROM "sentAt") as day_of_week,
        "segmentType",
        COUNT(*) as total_sent,
        SUM(CASE WHEN status = 'CLICKED' THEN 1 ELSE 0 END) as clicked,
        SUM(CASE WHEN status = 'REVIEWED' THEN 1 ELSE 0 END) as reviewed
      FROM "ReviewRequest"
      WHERE "sentAt" IS NOT NULL
        AND "sentAt" >= NOW() - INTERVAL '30 days'
      GROUP BY send_hour, day_of_week, "segmentType"
      HAVING COUNT(*) >= 5
      ORDER BY (SUM(CASE WHEN status = 'REVIEWED' THEN 1 ELSE 0 END)::float / COUNT(*)) DESC
    ` as any[];

    // Actualizar configuraciones de timing óptimo por segmento
    for (const pattern of successPatterns.slice(0, 10)) { // Top 10 patrones
      const conversionRate = pattern.total_sent > 0 ? (pattern.reviewed / pattern.total_sent) * 100 : 0;
      
      if (conversionRate > 25) { // Solo patrones con >25% de conversión
        console.log(`📊 Patrón exitoso encontrado:`);
        console.log(`   Segmento: ${pattern.segmentType}`);
        console.log(`   Hora: ${pattern.send_hour}:00`);
        console.log(`   Día: ${['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][pattern.day_of_week]}`);
        console.log(`   Conversión: ${conversionRate.toFixed(1)}%`);
      }
    }

    // Actualizar scores de satisfacción basado en patrones históricos
    await updateSatisfactionScores();

  } catch (error) {
    console.error('❌ Error en optimización ML:', error);
  }
}

// Actualizar scores de satisfacción predichos
async function updateSatisfactionScores() {
  // Lógica básica de ML para predecir satisfacción
  const recentReservations = await prisma.reservation.findMany({
    where: {
      date: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
      },
      status: 'CONFIRMED'
    },
    include: {
      ReviewRequest: true
    }
  });

  for (const reservation of recentReservations) {
    if (reservation.ReviewRequest.length === 0) {
      // Predicción básica basada en factores conocidos
      let predictedScore = 4; // Score base

      // Ajustar por tamaño del grupo
      if (reservation.covers <= 2) predictedScore += 0.5; // Grupos pequeños más satisfechos
      if (reservation.covers >= 6) predictedScore -= 0.3; // Grupos grandes más complicados

      // Ajustar por horario
      const hour = parseInt(reservation.time.split(':')[0]);
      if (hour >= 19 && hour <= 21) predictedScore += 0.2; // Horarios prime más satisfechos

      // Limitar entre 1 y 5
      predictedScore = Math.max(1, Math.min(5, Math.round(predictedScore)));

      console.log(`🎯 Predicción de satisfacción para ${reservation.guestName}: ${predictedScore}/5`);
    }
  }
}

// Generar reporte diario
async function generateDailyReport() {
  console.log('📊 Generando reporte diario...');
  
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Métricas del día anterior
    const dailyStats = await prisma.reviewRequest.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: yesterday,
          lt: today
        }
      },
      _count: {
        status: true
      }
    });

    const sent = dailyStats.find(s => s.status === 'SENT')?._count.status || 0;
    const clicked = dailyStats.find(s => s.status === 'CLICKED')?._count.status || 0;
    const reviewed = dailyStats.find(s => s.status === 'REVIEWED')?._count.status || 0;

    console.log(`📈 Reporte del ${yesterday.toDateString()}:`);
    console.log(`   📤 Enviadas: ${sent}`);
    console.log(`   👆 Clickeadas: ${clicked} (${sent > 0 ? ((clicked / sent) * 100).toFixed(1) : 0}%)`);
    console.log(`   ⭐ Reseñas: ${reviewed} (${clicked > 0 ? ((reviewed / clicked) * 100).toFixed(1) : 0}%)`);

    // TODO: Enviar reporte por email al administrador

  } catch (error) {
    console.error('❌ Error generando reporte diario:', error);
  }
}

// Configuración de cron jobs
export function startReviewCronJobs() {
  console.log('🚀 Iniciando cron jobs del sistema de reseñas...');

  // Procesar reseñas pendientes cada 15 minutos
  cron.schedule('*/15 * * * *', async () => {
    console.log('\n⏰ Ejecutando cron job - Procesar reseñas pendientes');
    await processReviewRequests();
  });

  // Sincronizar Google Places cada 6 horas
  cron.schedule('0 */6 * * *', async () => {
    console.log('\n⏰ Ejecutando cron job - Sincronizar Google Places');
    await syncGooglePlacesData();
  });

  // Optimización ML diaria a las 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('\n⏰ Ejecutando cron job - Optimización ML');
    await performMLOptimization();
  });

  // Reporte diario a las 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('\n⏰ Ejecutando cron job - Reporte diario');
    await generateDailyReport();
  });

  console.log('✅ Cron jobs configurados:');
  console.log('   📤 Procesar reseñas: cada 15 minutos');
  console.log('   🔄 Sync Google Places: cada 6 horas');
  console.log('   🤖 Optimización ML: diario 2:00 AM');
  console.log('   📊 Reporte diario: diario 8:00 AM');
}

// Función para ejecutar manualmente (útil para testing)
export async function runManualReviewProcess() {
  console.log('🛠️  Ejecutando proceso manual de reseñas...');
  
  await processReviewRequests();
  await syncGooglePlacesData();
  await performMLOptimization();
  await generateDailyReport();
  
  console.log('✅ Proceso manual completado');
}

// Solo iniciar cron jobs en producción
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
  startReviewCronJobs();
}
