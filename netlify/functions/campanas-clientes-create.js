exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    if (method === 'POST') {
      const { nombre, apellido, email, telefono, fechaNacimiento, canal } = JSON.parse(event.body);

      if (!nombre || !apellido || !email) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Nombre, apellido y email son obligatorios' })
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Formato de email inválido' })
        };
      }

      const nuevoCliente = {
        id: 'cli_' + Math.random().toString(36).substr(2, 9),
        nombre,
        apellido,
        email,
        telefono: telefono || '',
        fechaNacimiento: fechaNacimiento || '',
        canal: canal || 'manual',
        fechaRegistro: new Date().toISOString(),
        ultimaInteraccion: new Date().toISOString(),
        totalReservas: 0,
        ticketPromedio: 0,
        estado: 'activo',
        etiquetas: []
      };

      console.log('Nuevo cliente agregado:', nuevoCliente);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          cliente: nuevoCliente,
          message: 'Cliente agregado exitosamente'
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