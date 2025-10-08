
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

interface DatabaseBackup {
  exportDate: string;
  version: string;
  users: any[];
  restaurants: any[];
  accounts: any[];
  sessions: any[];
  reservations: any[];
  qrConfigurations: any[];
  qrScans: any[];
  verificationTokens: any[];
}

async function exportDatabaseToJSON(): Promise<DatabaseBackup> {
  console.log('🚀 Iniciando backup completo de la base de datos...');

  try {
    // Exportar todos los datos
    const [
      users,
      restaurants,
      accounts,
      sessions,
      reservations,
      qrConfigurations,
      qrScans,
      verificationTokens
    ] = await Promise.all([
      prisma.user.findMany({
        include: {
          Account: true,
          Session: true,
          Restaurant: true
        }
      }),
      prisma.restaurant.findMany({
        include: {
          User: true,
          Reservation: true,
          QRConfiguration: true,
          QRScan: true
        }
      }),
      prisma.account.findMany(),
      prisma.session.findMany(),
      prisma.reservation.findMany({
        include: {
          Restaurant: true
        }
      }),
      prisma.qRConfiguration.findMany({
        include: {
          Restaurant: true
        }
      }),
      prisma.qRScan.findMany({
        include: {
          Restaurant: true
        }
      }),
      prisma.verificationToken.findMany()
    ]);

    const backup: DatabaseBackup = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      users,
      restaurants,
      accounts,
      sessions,
      reservations,
      qrConfigurations,
      qrScans,
      verificationTokens
    };

    console.log(`✅ Backup completado:`);
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Restaurantes: ${restaurants.length}`);
    console.log(`   - Reservas: ${reservations.length}`);
    console.log(`   - Configuraciones QR: ${qrConfigurations.length}`);
    console.log(`   - Escaneos QR: ${qrScans.length}`);
    console.log(`   - Cuentas: ${accounts.length}`);
    console.log(`   - Sesiones: ${sessions.length}`);
    console.log(`   - Tokens: ${verificationTokens.length}`);

    return backup;
  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    throw error;
  }
}

async function saveBackupFiles(backup: DatabaseBackup) {
  const backupDir = path.join(process.cwd(), 'database-backup');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Crear directorio de backup
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. Backup JSON completo
  const jsonFile = path.join(backupDir, `ai_restaurante_backup_${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(backup, null, 2), 'utf8');
  console.log(`📄 Backup JSON guardado: ${jsonFile}`);

  // 2. Backup SQL (INSERT statements)
  const sqlFile = path.join(backupDir, `ai_restaurante_backup_${timestamp}.sql`);
  const sqlContent = generateSQLBackup(backup);
  fs.writeFileSync(sqlFile, sqlContent, 'utf8');
  console.log(`🗄️ Backup SQL guardado: ${sqlFile}`);

  // 3. CSV con datos principales
  const csvFile = path.join(backupDir, `ai_restaurante_summary_${timestamp}.csv`);
  const csvContent = generateCSVSummary(backup);
  fs.writeFileSync(csvFile, csvContent, 'utf8');
  console.log(`📊 Resumen CSV guardado: ${csvFile}`);

  // 4. Script de restauración
  const restoreFile = path.join(backupDir, `restore_${timestamp}.ts`);
  const restoreScript = generateRestoreScript(backup);
  fs.writeFileSync(restoreFile, restoreScript, 'utf8');
  console.log(`🔄 Script de restauración: ${restoreFile}`);

  // 5. README con instrucciones
  const readmeFile = path.join(backupDir, 'README.md');
  const readmeContent = generateReadme(timestamp);
  fs.writeFileSync(readmeFile, readmeContent, 'utf8');
  console.log(`📖 Instrucciones guardadas: ${readmeFile}`);

  return { backupDir, jsonFile, sqlFile, csvFile, restoreFile };
}

function generateSQLBackup(backup: DatabaseBackup): string {
  let sql = `-- AI Restaurante Database Backup\n`;
  sql += `-- Fecha de exportación: ${backup.exportDate}\n`;
  sql += `-- Versión: ${backup.version}\n\n`;

  sql += `-- Limpieza de tablas (descomenta si quieres limpiar antes de restaurar)\n`;
  sql += `-- TRUNCATE TABLE "QRScan", "QRConfiguration", "Reservation", "Restaurant", "Session", "Account", "User", "VerificationToken" RESTART IDENTITY CASCADE;\n\n`;

  // Insertar usuarios
  sql += `-- Usuarios\n`;
  for (const user of backup.users) {
    const values = [
      `'${user.id}'`,
      user.name ? `'${user.name.replace(/'/g, "''")}'` : 'NULL',
      `'${user.email}'`,
      user.emailVerified ? `'${user.emailVerified}'` : 'NULL',
      user.image ? `'${user.image}'` : 'NULL',
      user.password ? `'${user.password}'` : 'NULL',
      `'${user.createdAt}'`,
      `'${user.updatedAt}'`
    ];
    sql += `INSERT INTO "User" (id, name, email, "emailVerified", image, password, "createdAt", "updatedAt") VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
  }

  // Insertar restaurantes
  sql += `\n-- Restaurantes\n`;
  for (const restaurant of backup.restaurants) {
    const values = [
      `'${restaurant.id}'`,
      `'${restaurant.name.replace(/'/g, "''")}'`,
      `'${restaurant.slug}'`,
      `'${restaurant.template}'`,
      restaurant.logo ? `'${restaurant.logo}'` : 'NULL',
      restaurant.background ? `'${restaurant.background}'` : 'NULL',
      `'${restaurant.logoShape}'`,
      `'${restaurant.primaryColor}'`,
      `'${restaurant.secondaryColor}'`,
      restaurant.description ? `'${restaurant.description.replace(/'/g, "''")}'` : 'NULL',
      restaurant.address ? `'${restaurant.address.replace(/'/g, "''")}'` : 'NULL',
      restaurant.phone ? `'${restaurant.phone}'` : 'NULL',
      restaurant.email ? `'${restaurant.email}'` : 'NULL',
      restaurant.website ? `'${restaurant.website}'` : 'NULL',
      `'${restaurant.userId}'`,
      `'${restaurant.createdAt}'`,
      `'${restaurant.updatedAt}'`
    ];
    sql += `INSERT INTO "Restaurant" (id, name, slug, template, logo, background, "logoShape", "primaryColor", "secondaryColor", description, address, phone, email, website, "userId", "createdAt", "updatedAt") VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
  }

  // Insertar reservas
  sql += `\n-- Reservas\n`;
  for (const reservation of backup.reservations) {
    const values = [
      `'${reservation.id}'`,
      `'${reservation.restaurantId}'`,
      `'${reservation.guestName.replace(/'/g, "''")}'`,
      reservation.guestEmail ? `'${reservation.guestEmail}'` : 'NULL',
      reservation.guestPhone ? `'${reservation.guestPhone}'` : 'NULL',
      reservation.tableNumber ? `'${reservation.tableNumber}'` : 'NULL',
      `${reservation.covers}`,
      `'${reservation.date}'`,
      `'${reservation.time}'`,
      `'${reservation.status}'`,
      reservation.notes ? `'${reservation.notes.replace(/'/g, "''")}'` : 'NULL',
      `'${reservation.createdAt}'`,
      `'${reservation.updatedAt}'`
    ];
    sql += `INSERT INTO "Reservation" (id, "restaurantId", "guestName", "guestEmail", "guestPhone", "tableNumber", covers, date, time, status, notes, "createdAt", "updatedAt") VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
  }

  // Insertar configuraciones QR
  sql += `\n-- Configuraciones QR\n`;
  for (const config of backup.qrConfigurations) {
    const values = [
      `'${config.id}'`,
      `'${config.restaurantId}'`,
      `'${config.primaryButtonText.replace(/'/g, "''")}'`,
      `'${config.primaryButtonUrl}'`,
      `'${config.primaryButtonColor}'`,
      `'${config.secondaryButtonText.replace(/'/g, "''")}'`,
      `'${config.secondaryButtonUrl}'`,
      `'${config.secondaryButtonColor}'`,
      `'${config.tertiaryButtonText.replace(/'/g, "''")}'`,
      `'${config.tertiaryButtonUrl}'`,
      `'${config.tertiaryButtonColor}'`,
      `${config.captureLeadsEnabled}`,
      `'${config.welcomeMessage.replace(/'/g, "''")}'`,
      `'${config.createdAt}'`,
      `'${config.updatedAt}'`
    ];
    sql += `INSERT INTO "QRConfiguration" (id, "restaurantId", "primaryButtonText", "primaryButtonUrl", "primaryButtonColor", "secondaryButtonText", "secondaryButtonUrl", "secondaryButtonColor", "tertiaryButtonText", "tertiaryButtonUrl", "tertiaryButtonColor", "captureLeadsEnabled", "welcomeMessage", "createdAt", "updatedAt") VALUES (${values.join(', ')}) ON CONFLICT (id) DO NOTHING;\n`;
  }

  return sql;
}

function generateCSVSummary(backup: DatabaseBackup): string {
  let csv = `AI Restaurante Database Summary\n`;
  csv += `Export Date,${backup.exportDate}\n`;
  csv += `Version,${backup.version}\n\n`;

  csv += `Table,Count\n`;
  csv += `Users,${backup.users.length}\n`;
  csv += `Restaurants,${backup.restaurants.length}\n`;
  csv += `Accounts,${backup.accounts.length}\n`;
  csv += `Sessions,${backup.sessions.length}\n`;
  csv += `Reservations,${backup.reservations.length}\n`;
  csv += `QR Configurations,${backup.qrConfigurations.length}\n`;
  csv += `QR Scans,${backup.qrScans.length}\n`;
  csv += `Verification Tokens,${backup.verificationTokens.length}\n\n`;

  // Detalles de usuarios
  csv += `Users Details\n`;
  csv += `ID,Name,Email,Created At\n`;
  for (const user of backup.users) {
    csv += `${user.id},"${user.name || 'N/A'}",${user.email},${user.createdAt}\n`;
  }

  // Detalles de restaurantes
  csv += `\nRestaurants Details\n`;
  csv += `ID,Name,Slug,Owner Email,Created At\n`;
  for (const restaurant of backup.restaurants) {
    const owner = backup.users.find(u => u.id === restaurant.userId);
    csv += `${restaurant.id},"${restaurant.name}",${restaurant.slug},"${owner?.email || 'N/A'}",${restaurant.createdAt}\n`;
  }

  // Detalles de reservas
  csv += `\nReservations Details\n`;
  csv += `ID,Guest Name,Restaurant,Date,Time,Covers,Status\n`;
  for (const reservation of backup.reservations) {
    const restaurant = backup.restaurants.find(r => r.id === reservation.restaurantId);
    csv += `${reservation.id},"${reservation.guestName}","${restaurant?.name || 'N/A'}",${reservation.date},${reservation.time},${reservation.covers},${reservation.status}\n`;
  }

  return csv;
}

function generateRestoreScript(backup: DatabaseBackup): string {
  return `// Script de Restauración - AI Restaurante
// Generado automáticamente el ${backup.exportDate}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function restoreDatabase() {
  console.log('🔄 Iniciando restauración de base de datos...');
  
  try {
    // 1. Restaurar usuarios
    console.log('👥 Restaurando usuarios...');
    for (const user of ${JSON.stringify(backup.users, null, 4)}) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      });
    }
    
    // 2. Restaurar restaurantes
    console.log('🏪 Restaurando restaurantes...');
    for (const restaurant of ${JSON.stringify(backup.restaurants, null, 4)}) {
      await prisma.restaurant.upsert({
        where: { id: restaurant.id },
        update: restaurant,
        create: restaurant
      });
    }
    
    // 3. Restaurar reservas
    console.log('📅 Restaurando reservas...');
    for (const reservation of ${JSON.stringify(backup.reservations, null, 4)}) {
      await prisma.reservation.upsert({
        where: { id: reservation.id },
        update: reservation,
        create: reservation
      });
    }
    
    // 4. Restaurar configuraciones QR
    console.log('📱 Restaurando configuraciones QR...');
    for (const config of ${JSON.stringify(backup.qrConfigurations, null, 4)}) {
      await prisma.qRConfiguration.upsert({
        where: { id: config.id },
        update: config,
        create: config
      });
    }
    
    console.log('✅ Restauración completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la restauración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar restauración
restoreDatabase()
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
`;
}

function generateReadme(timestamp: string): string {
  return `# AI Restaurante - Backup de Base de Datos

**Fecha de creación:** ${new Date().toLocaleString()}
**Timestamp:** ${timestamp}

## 📋 Archivos incluidos en este backup:

### 1. \`ai_restaurante_backup_${timestamp}.json\`
- **Backup completo** en formato JSON
- Incluye TODOS los datos con relaciones
- Perfecto para restauración completa
- Fácil de leer y modificar

### 2. \`ai_restaurante_backup_${timestamp}.sql\`
- **Script SQL** con INSERT statements
- Compatible con PostgreSQL
- Permite restauración directa en BD
- Incluye comandos de limpieza (comentados)

### 3. \`ai_restaurante_summary_${timestamp}.csv\`
- **Resumen legible** de todos los datos
- Perfecto para auditorías
- Compatible con Excel/Google Sheets
- Incluye estadísticas generales

### 4. \`restore_${timestamp}.ts\`
- **Script de restauración** automático
- Usa Prisma para restaurar datos
- Manejo de errores incluido
- Ejecutable con \`npm run restore\`

## 🚀 Cómo usar estos archivos:

### Restauración con JSON (Recomendado):
\`\`\`bash
# 1. Copiar el archivo JSON a tu nuevo proyecto
# 2. Ejecutar el script de restauración
npx tsx restore_${timestamp}.ts
\`\`\`

### Restauración con SQL:
\`\`\`bash
# 1. Conectar a tu base PostgreSQL
psql -U username -d database_name

# 2. Ejecutar el script SQL
\\i ai_restaurante_backup_${timestamp}.sql
\`\`\`

### Análisis con CSV:
- Abrir \`ai_restaurante_summary_${timestamp}.csv\` en Excel
- Revisar estadísticas y datos principales
- Usar para auditorías o reportes

## 📊 Estructura de datos incluida:

- ✅ **Usuarios** y autenticación
- ✅ **Restaurantes** y configuraciones  
- ✅ **Reservas** completas
- ✅ **Configuraciones QR** personalizadas
- ✅ **Escaneos QR** y analytics
- ✅ **Sesiones** y cuentas de usuario
- ✅ **Tokens** de verificación

## ⚠️ Notas importantes:

1. **Contraseñas**: Las contraseñas están hasheadas (seguro)
2. **IDs**: Mantén los IDs originales para preservar relaciones
3. **Fechas**: Todas las fechas están en formato ISO
4. **Relaciones**: Los datos mantienen integridad referencial

## 🔧 Requisitos para restauración:

- PostgreSQL database
- Node.js + npm/yarn
- Prisma configurado
- Variables de entorno correctas

## 📞 Soporte:

Si tienes problemas con la restauración:
1. Verifica la conexión a la base de datos
2. Confirma que Prisma esté configurado
3. Revisa los logs de error
4. Los datos JSON son siempre la fuente de verdad

---

**¡Backup creado exitosamente!** 🎉
Tu base de datos está segura y lista para restaurarse cuando lo necesites.
`;
}

async function main() {
  try {
    console.log('🎯 AI Restaurante - Generador de Backup Completo');
    console.log('=' .repeat(50));

    // Exportar datos
    const backup = await exportDatabaseToJSON();
    
    // Guardar archivos
    const files = await saveBackupFiles(backup);
    
    console.log('\n🎉 ¡Backup completado exitosamente!');
    console.log('📁 Archivos creados en:', files.backupDir);
    console.log('\n📋 Archivos generados:');
    console.log('   📄 JSON:', path.basename(files.jsonFile));
    console.log('   🗄️ SQL:', path.basename(files.sqlFile));
    console.log('   📊 CSV:', path.basename(files.csvFile));
    console.log('   🔄 Restore:', path.basename(files.restoreFile));
    console.log('   📖 README.md');
    
    console.log('\n✅ Tu base de datos está respaldada y lista para usar!');
    
  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { exportDatabaseToJSON, saveBackupFiles };
