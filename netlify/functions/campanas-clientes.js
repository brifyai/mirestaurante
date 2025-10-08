const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Datos simulados de clientes
const clientesData = [
  {
    id: '1',
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    telefono: '+56 9 8765 4321',
    fechaNacimiento: '1988-03-15',
    canal: 'whatsapp',
    fechaRegistro: '2025-08-15',
    ultimaInteraccion: '2025-09-01',
    totalReservas: 8,
    ticketPromedio: 28500,
    estado: 'activo',
    etiquetas: ['VIP', 'Cumpleaños Sept']
  },
  // ... otros clientes (abreviado por brevedad)
];

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    // Skip auth
    if (method === 'GET') {
      const params = event.queryStringParameters || {};
      const busqueda = params.busqueda;
      const canal = params.canal;
      const page = parseInt(params.page || '1');
      const limit = parseInt(params.limit || '50');

      let clientesFiltrados = [...clientesData];

      if (busqueda) {
        clientesFiltrados = clientesFiltrados.filter(cliente =>
          cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
          cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
          cliente.telefono.includes(busqueda)
        );
      }

      if (canal && canal !== 'todos') {
        clientesFiltrados = clientesFiltrados.filter(cliente => cliente.canal === canal);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex);

      const estadisticas = {
        total: clientesData.length,
        filtrados: clientesFiltrados.length,
        activos: clientesData.filter(c => c.estado === 'activo').length,
        whatsapp: clientesData.filter(c => c.canal === 'whatsapp').length,
        facebook: clientesData.filter(c => c.canal === 'facebook').length,
        instagram: clientesData.filter(c => c.canal === 'instagram').length,
        qr: clientesData.filter(c => c.canal === 'qr').length,
        reserva: clientesData.filter(c => c.canal === 'reserva').length,
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: clientesPaginados,
          estadisticas,
          pagination: {
            page,
            limit,
            total: clientesFiltrados.length,
            pages: Math.ceil(clientesFiltrados.length / limit)
          }
        })
      };
    } else if (method === 'POST') {
      const { nombre, apellido, email, telefono, fechaNacimiento, canal, etiquetas } = JSON.parse(event.body);

      if (!nombre || !apellido || !email || !telefono) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Campos requeridos faltantes' })
        };
      }

      const emailExiste = clientesData.some(c => c.email === email);
      if (emailExiste) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'El email ya existe' })
        };
      }

      const nuevoCliente = {
        id: Date.now().toString(),
        nombre,
        apellido,
        email,
        telefono,
        fechaNacimiento,
        canal: canal || 'manual',
        fechaRegistro: new Date().toISOString().split('T')[0],
        ultimaInteraccion: new Date().toISOString().split('T')[0],
        totalReservas: 0,
        ticketPromedio: 0,
        estado: 'activo',
        etiquetas: etiquetas || []
      };

      clientesData.push(nuevoCliente);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Cliente creado exitosamente',
          data: nuevoCliente
        })
      };
    } else if (method === 'PUT') {
      const { id, ...updateData } = JSON.parse(event.body);

      const clienteIndex = clientesData.findIndex(c => c.id === id);
      if (clienteIndex === -1) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Cliente no encontrado' })
        };
      }

      clientesData[clienteIndex] = { ...clientesData[clienteIndex], ...updateData };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Cliente actualizado exitosamente',
          data: clientesData[clienteIndex]
        })
      };
    } else if (method === 'DELETE') {
      const params = event.queryStringParameters || {};
      const id = params.id;

      if (!id) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'ID requerido' })
        };
      }

      const clienteIndex = clientesData.findIndex(c => c.id === id);
      if (clienteIndex === -1) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Cliente no encontrado' })
        };
      }

      clientesData.splice(clienteIndex, 1);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Cliente eliminado exitosamente'
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