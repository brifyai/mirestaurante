const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get userId from query parameters
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'userId parameter is required' })
      };
    }

    console.log('Testing profile fields for user:', userId);

    // Query user data with all profile fields
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select(`
        id,
        name,
        email,
        telefono,
        ubicacion,
        empresa,
        sitio_web,
        biografia,
        createdAt,
        updatedAt
      `)
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database error',
          details: userError.message,
          code: userError.code
        })
      };
    }

    console.log('User data found:', userData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        userData: userData,
        profileFields: {
          telefono: userData.telefono,
          ubicacion: userData.ubicacion,
          empresa: userData.empresa,
          sitio_web: userData.sitio_web,
          biografia: userData.biografia
        },
        hasData: {
          telefono: !!userData.telefono,
          ubicacion: !!userData.ubicacion,
          empresa: !!userData.empresa,
          sitio_web: !!userData.sitio_web,
          biografia: !!userData.biografia
        }
      }, null, 2)
    };

  } catch (error) {
    console.error('Test profile fields error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};