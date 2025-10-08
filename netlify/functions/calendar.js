const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  try {
    // For simplicity, skip auth check for now
    // In production, verify JWT from Authorization header

    if (method === 'GET') {
      const events = await getCalendarEvents();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: events
        })
      };
    } else if (method === 'POST') {
      const { title, description, startTime, endTime, attendees } = JSON.parse(event.body);
      const eventData = await createCalendarEvent({
        title,
        description,
        startTime,
        endTime,
        attendees
      });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: eventData,
          message: 'Reserva creada exitosamente'
        })
      };
    } else if (method === 'PUT') {
      const { eventId, ...updateData } = JSON.parse(event.body);
      const updatedEvent = await updateCalendarEvent(eventId, updateData);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: updatedEvent,
          message: 'Reserva actualizada exitosamente'
        })
      };
    } else if (method === 'DELETE') {
      const params = new URLSearchParams(event.queryStringParameters || {});
      const eventId = params.get('eventId');
      if (!eventId) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Event ID requerido' })
        };
      }
      await cancelCalendarEvent(eventId);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Reserva cancelada exitosamente'
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

async function getCalendarEvents() {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error('Google Service Account Key no configurado');
    }

    // Por ahora, retornar datos simulados
    return [
      {
        id: '1',
        title: 'Reserva - Mesa para 4',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        description: 'Reserva para Juan Pérez'
      }
    ];
  } catch (error) {
    console.error('Error obteniendo eventos de calendario:', error);
    return [];
  }
}

async function createCalendarEvent(eventData) {
  try {
    console.log('Creando evento en calendar:', eventData);

    const event = {
      id: Date.now().toString(),
      title: eventData.title,
      description: eventData.description,
      start: eventData.startTime,
      end: eventData.endTime,
      attendees: eventData.attendees || [],
      status: 'confirmed',
      htmlLink: `https://calendar.google.com/calendar/event?eid=${Date.now()}`
    };

    return event;
  } catch (error) {
    console.error('Error creando evento en calendar:', error);
    throw error;
  }
}

async function updateCalendarEvent(eventId, updateData) {
  console.log('Actualizando evento:', eventId, updateData);
  
  return {
    id: eventId,
    ...updateData,
    updated: new Date().toISOString()
  };
}

async function cancelCalendarEvent(eventId) {
  console.log('Cancelando evento:', eventId);
  
  return { success: true };
}