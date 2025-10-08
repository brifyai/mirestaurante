exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    if (method === 'GET') {
      const params = event.queryStringParameters || {};
      const periodo = params.periodo || 'mes';

      const estadisticas = {
        totalClientes: 5016,
        clientesActivos: 3890,
        nuevosClientes: 156,
        clientesWhatsApp: 2340,
        clientesFacebook: 1450,
        clientesInstagram: 1226,
        clientesQR: 3290,
        clientesReservas: 1726,
        ingresosTotal: 48950000,
        ticketPromedio: 23500,
        reservasPendientes: 87,
        tasaConversion: 12.5,
        campanasEnviadas: 28,
        campanasActivas: 5
      };

      const datosIngresos = [
        { mes: 'Ene', ingresos: 4200000, reservas: 180, clientes: 890 },
        { mes: 'Feb', ingresos: 3800000, reservas: 165, clientes: 820 },
        { mes: 'Mar', ingresos: 4600000, reservas: 195, clientes: 950 },
        { mes: 'Abr', ingresos: 4100000, reservas: 175, clientes: 875 },
        { mes: 'May', ingresos: 4800000, reservas: 205, clientes: 985 },
        { mes: 'Jun', ingresos: 5200000, reservas: 220, clientes: 1050 },
        { mes: 'Jul', ingresos: 5600000, reservas: 240, clientes: 1120 },
        { mes: 'Ago', ingresos: 4900000, reservas: 210, clientes: 995 }
      ];

      const distribucionCanales = [
        { name: 'WhatsApp', value: estadisticas.clientesWhatsApp, color: '#10B981' },
        { name: 'Facebook', value: estadisticas.clientesFacebook, color: '#3B82F6' },
        { name: 'Instagram', value: estadisticas.clientesInstagram, color: '#F59E0B' },
        { name: 'QR Portal', value: estadisticas.clientesQR, color: '#8B5CF6' },
        { name: 'Reservas', value: estadisticas.clientesReservas, color: '#EF4444' }
      ];

      const rendimientoCanales = {
        whatsapp: { tasa_apertura: 94, tasa_respuesta: 67, conversiones: 156, ingresos: 3650000 },
        facebook: { tasa_apertura: 78, tasa_interaccion: 45, conversiones: 89, ingresos: 2100000 },
        instagram: { tasa_apertura: 82, tasa_interaccion: 56, conversiones: 102, ingresos: 2380000 }
      };

      const proyecciones = [
        { fecha: '2025-09-03', reservas: 28, ingresos: 658000 },
        { fecha: '2025-09-04', reservas: 32, ingresos: 752000 },
        { fecha: '2025-09-05', reservas: 41, ingresos: 963500 },
        { fecha: '2025-09-06', reservas: 45, ingresos: 1057500 },
        { fecha: '2025-09-07', reservas: 52, ingresos: 1222000 },
        { fecha: '2025-09-08', reservas: 38, ingresos: 893000 },
        { fecha: '2025-09-09', reservas: 35, ingresos: 822500 }
      ];

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: {
            estadisticas,
            datosIngresos,
            distribucionCanales,
            rendimientoCanales,
            proyecciones,
            periodo
          }
        })
      };
    } else {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Método no permitido' })
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};