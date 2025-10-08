exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    // Skip auth
    if (method === 'GET') {
      const horarios = [
        { dia: 'Lunes', activo: true, horaInicio: '12:00', horaFin: '22:00' },
        { dia: 'Martes', activo: true, horaInicio: '12:00', horaFin: '22:00' },
        { dia: 'Miércoles', activo: true, horaInicio: '12:00', horaFin: '22:00' },
        { dia: 'Jueves', activo: true, horaInicio: '12:00', horaFin: '22:00' },
        { dia: 'Viernes', activo: true, horaInicio: '12:00', horaFin: '22:00' },
        { dia: 'Sábado', activo: true, horaInicio: '12:00', horaFin: '22:00' },
        { dia: 'Domingo', activo: true, horaInicio: '12:00', horaFin: '22:00' },
      ];

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horarios })
      };
    } else if (method === 'POST') {
      const { horarios } = JSON.parse(event.body);

      console.log('Guardando horarios del catálogo:', horarios);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Horarios guardados exitosamente',
          horarios
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