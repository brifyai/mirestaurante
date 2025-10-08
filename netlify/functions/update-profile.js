const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Solo permitir POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userId, profileData } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID es requerido' })
      };
    }

    console.log('Updating profile for user:', userId);
    console.log('Profile data:', profileData);

    // Actualizar campos básicos en la tabla User
    const userUpdate = {
      name: profileData.name,
      updatedAt: new Date().toISOString()
    };

    // Solo incluir campos que existen en la tabla User
    if (profileData.image !== undefined) {
      userUpdate.image = profileData.image;
    }

    const { error: userError } = await supabase
      .from('User')
      .update(userUpdate)
      .eq('id', userId);

    if (userError) {
      console.error('Error updating user:', userError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error al actualizar usuario',
          details: userError.message
        })
      };
    }

    // Intentar actualizar campos adicionales con los nombres correctos de la base de datos
    const extendedUpdate = {};
    if (profileData.telefono !== undefined) extendedUpdate.telefono = profileData.telefono;
    if (profileData.ubicacion !== undefined) extendedUpdate.ubicacion = profileData.ubicacion;
    if (profileData.empresa !== undefined) extendedUpdate.empresa = profileData.empresa;
    if (profileData.sitio_web !== undefined) extendedUpdate.sitio_web = profileData.sitio_web;
    if (profileData.biografia !== undefined) extendedUpdate.biografia = profileData.biografia;

    if (Object.keys(extendedUpdate).length > 0) {
      const { error: extendedError } = await supabase
        .from('User')
        .update(extendedUpdate)
        .eq('id', userId);

      // Si hay error, registrarlo pero no es crítico
      if (extendedError) {
        console.log('Error actualizando campos adicionales:', extendedError.message);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Error al actualizar campos del perfil',
            details: extendedError.message
          })
        };
      }
    }

    // Campos de perfil guardados en la tabla User con nombres de base de datos
    // telefono, ubicacion, empresa, sitio_web, biografia

    console.log('Profile updated successfully for user:', userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Perfil actualizado exitosamente',
        updatedFields: {
          user: Object.keys(userUpdate),
          extended: Object.keys(extendedUpdate)
        }
      })
    };

  } catch (error) {
    console.error('Update profile error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};