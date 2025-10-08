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
    const { email, password } = JSON.parse(event.body);

    console.log('Test login attempt for email:', email);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email y contraseña son requeridos' })
      };
    }

    // Buscar usuario por email
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id, name, email, password, role, isActive')
      .eq('email', email)
      .single();

    console.log('Test login - User lookup result:', {
      found: !!user,
      error: userError?.message,
      userId: user?.id,
      userEmail: user?.email,
      hasPassword: !!user?.password,
      isActive: user?.isActive,
      role: user?.role
    });

    if (userError || !user) {
      console.log('Test login - User not found');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          error: 'Usuario no encontrado',
          debug: {
            emailProvided: email,
            userError: userError?.message
          }
        })
      };
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      console.log('Test login - User account is inactive');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          error: 'Cuenta desactivada',
          debug: { isActive: user.isActive }
        })
      };
    }

    // Verificar contraseña (sin bcrypt para testing)
    if (!user.password) {
      console.log('Test login - User has no password set');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          error: 'Usuario sin contraseña configurada',
          debug: { hasPassword: false }
        })
      };
    }

    // Comparación simple para testing (sin hashear)
    const passwordMatches = password === user.password;
    console.log('Test login - Password comparison result:', passwordMatches);

    if (!passwordMatches) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          error: 'Contraseña incorrecta',
          debug: {
            passwordProvided: password.substring(0, 3) + '...',
            storedPassword: user.password.substring(0, 10) + '...',
            passwordMatches
          }
        })
      };
    }

    console.log('Test login successful for user:', user.email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Login exitoso (modo test)',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        debug: {
          passwordMatches,
          isActive: user.isActive
        }
      })
    };

  } catch (error) {
    console.error('Test login server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};