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
    const testUser = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'password123', // Contraseña sin hashear para testing
      role: 'USER',
      isActive: true
    };

    console.log('Inserting test user:', { name: testUser.name, email: testUser.email });

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(testUser.password, 8);
    console.log('Password hashed successfully');

    // Insertar usuario
    const { data: newUser, error: insertError } = await supabase
      .from('User')
      .insert({
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role,
        isActive: testUser.isActive
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error al insertar usuario',
          details: insertError.message,
          code: insertError.code
        })
      };
    }

    console.log('User inserted successfully:', newUser.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Usuario de prueba insertado exitosamente',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive
        },
        loginCredentials: {
          email: testUser.email,
          password: testUser.password
        }
      })
    };

  } catch (error) {
    console.error('Insert test user error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};