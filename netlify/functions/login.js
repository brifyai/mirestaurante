const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

// Configuración de Supabase - Usar variables de entorno o valores por defecto
const supabaseUrl =
  process.env.SUPABASE_URL || "https://pmpbwtxcwlmjprfmnpny.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcGJ3dHhjd2xtanByZm1ucG55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDExODIxMCwiZXhwIjoyMDc1Njk0MjEwfQ.paste_your_service_role_key_here";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("🔍 Función login.js inicializada con Supabase");

exports.handler = async (event, context) => {
  // Solo permitir POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email y contraseña son requeridos" }),
      };
    }

    // Buscar usuario por email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, password, role, is_active, image")
      .eq("email", email)
      .single();

    console.log("User lookup result:", {
      found: !!user,
      error: userError?.message,
    });

    if (userError || !user) {
      console.log("User not found or error:", userError);
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Credenciales inválidas" }),
      };
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      console.log("User account is inactive");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Cuenta desactivada" }),
      };
    }

    // Verificar contraseña
    if (!user.password) {
      console.log("User has no password set");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Credenciales inválidas" }),
      };
    }

    console.log("Attempting password verification...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password verification result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password verification failed");
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Credenciales inválidas" }),
      };
    }

    console.log("Login successful for user:", user.email);

    // Actualizar last_login_at
    await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id);

    // Crear sesión (simulada, ya que no usamos Supabase Auth)
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        session: sessionData,
      }),
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  }
};
