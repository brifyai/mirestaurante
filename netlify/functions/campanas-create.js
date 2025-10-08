exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    if (method === 'POST') {
      const { tipo, titulo, asunto, contenido, mensaje, fechaEnvio, horaEnvio, segmento, incluirImagen, urlImagen } = JSON.parse(event.body);

      const nuevaCampana = {
        id: 'camp_' + Math.random().toString(36).substr(2, 9),
        tipo,
        titulo,
        asunto,
        contenido,
        mensaje,
        fechaEnvio,
        horaEnvio,
        segmento,
        incluirImagen,
        urlImagen,
        estado: 'borrador',
        fechaCreacion: new Date().toISOString()
      };

      console.log('Nueva campaña creada:', nuevaCampana);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          campana: nuevaCampana,
          message: 'Campaña creada exitosamente'
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