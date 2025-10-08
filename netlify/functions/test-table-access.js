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
    console.log('Testing table access...');

    // Paso 1: Verificar conexión básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('User')
      .select('count')
      .limit(1);

    console.log('Connection test result:', { data: connectionTest, error: connectionError });

    if (connectionError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error de conexión a tabla User',
          details: connectionError.message,
          code: connectionError.code,
          hint: connectionError.hint
        })
      };
    }

    // Paso 2: Intentar obtener todos los usuarios sin filtros
    const { data: allUsers, error: allUsersError } = await supabase
      .from('User')
      .select('*')
      .limit(10);

    console.log('All users query result:', {
      count: allUsers?.length || 0,
      error: allUsersError?.message,
      firstUser: allUsers?.[0] ? {
        id: allUsers[0].id,
        email: allUsers[0].email,
        name: allUsers[0].name,
        hasPassword: !!allUsers[0].password,
        isActive: allUsers[0].isActive,
        role: allUsers[0].role
      } : null
    });

    if (allUsersError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error al consultar tabla User',
          details: allUsersError.message,
          code: allUsersError.code,
          hint: allUsersError.hint
        })
      };
    }

    // Paso 3: Intentar búsqueda específica por email
    const { data: specificUser, error: specificError } = await supabase
      .from('User')
      .select('*')
      .eq('email', 'john@doe.com')
      .single();

    console.log('Specific user query result:', {
      found: !!specificUser,
      error: specificError?.message,
      user: specificUser ? {
        id: specificUser.id,
        email: specificUser.email,
        name: specificUser.name,
        hasPassword: !!specificUser.password,
        isActive: specificUser.isActive,
        role: specificUser.role
      } : null
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        connection: 'OK',
        totalUsers: allUsers?.length || 0,
        users: allUsers?.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          hasPassword: !!u.password,
          isActive: u.isActive,
          role: u.role,
          createdAt: u.createdAt || u.created_at
        })) || [],
        specificUserSearch: {
          email: 'john@doe.com',
          found: !!specificUser,
          error: specificError?.message
        },
        tableSchema: allUsers?.[0] ? Object.keys(allUsers[0]) : []
      }, null, 2)
    };

  } catch (error) {
    console.error('Test table access error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message,
        stack: error.stack
      })
    };
  }
};