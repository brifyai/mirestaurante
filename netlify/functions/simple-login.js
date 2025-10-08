const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    console.log('Simple login attempt for:', email);

    // Paso 1: Verificar si hay usuarios en la tabla
    const { data: allUsers, error: countError } = await supabase
      .from('User')
      .select('id, email, name, isActive')
      .limit(10);

    console.log('Total users in table:', allUsers?.length || 0);
    console.log('Users found:', allUsers?.map(u => ({ email: u.email, active: u.isActive })) || []);

    // Paso 2: Buscar usuario específico
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    console.log('User lookup result:', {
      found: !!user,
      error: userError?.message,
      userData: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        isActive: user.isActive,
        role: user.role
      } : null
    });

    if (userError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Usuario no encontrado',
          debug: {
            email: email,
            totalUsers: allUsers?.length || 0,
            availableEmails: allUsers?.map(u => u.email) || []
          }
        })
      };
    }

    // Paso 3: Verificar si está activo
    if (!user.isActive) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Cuenta desactivada' })
      };
    }

    // Paso 4: Verificar contraseña
    if (!user.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Usuario sin contraseña configurada',
          debug: { hasPassword: false }
        })
      };
    }

    // Intentar comparación con bcrypt
    let passwordValid = false;
    try {
      passwordValid = await bcrypt.compare(password, user.password);
      console.log('bcrypt comparison result:', passwordValid);
    } catch (bcryptError) {
      console.log('bcrypt error, trying plain text comparison:', bcryptError.message);
      // Si bcrypt falla, intentar comparación directa (para contraseñas no hasheadas)
      passwordValid = password === user.password;
      console.log('plain text comparison result:', passwordValid);
    }

    if (!passwordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Contraseña incorrecta',
          debug: {
            passwordLength: password.length,
            storedPasswordLength: user.password.length,
            storedPasswordStart: user.password.substring(0, 10) + '...',
            isBcryptHash: user.password.startsWith('$2')
          }
        })
      };
    }

    // Paso 5: Actualizar lastLoginAt
    await supabase
      .from('User')
      .update({ lastLoginAt: new Date().toISOString() })
      .eq('id', user.id);

    console.log('Login successful for:', user.email);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        session: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          loggedInAt: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('Simple login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};