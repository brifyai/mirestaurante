const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configuración de Supabase con clave de servicio
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Endpoint para subir avatar
app.post("/upload-avatar", async (req, res) => {
  try {
    const { file, fileName, filePath, contentType, userId } = req.body;

    // Validar datos requeridos
    if (!file || !fileName || !filePath || !contentType || !userId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Convertir base64 a Buffer
    const fileBuffer = Buffer.from(file, "base64");

    // Validar tamaño (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 2MB",
      });
    }

    // Validar tipo de archivo
    if (!contentType.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        error: "Only image files are allowed",
      });
    }

    console.log("Uploading file to:", filePath);
    console.log("File size:", fileBuffer.length);

    // Subir a Supabase Storage con permisos de servicio
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("img")
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: contentType,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return res.status(500).json({
        success: false,
        error: "Failed to upload file",
        details: uploadError.message,
      });
    }

    console.log("File uploaded successfully:", uploadData);

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("img")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return res.status(500).json({
        success: false,
        error: "Failed to get public URL",
      });
    }

    console.log("Public URL:", urlData.publicUrl);

    // Actualizar el campo image en la tabla User
    const { error: updateError } = await supabase
      .from("User")
      .update({
        image: urlData.publicUrl,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      // Eliminar el archivo subido si no se puede actualizar la base de datos
      await supabase.storage.from("img").remove([filePath]);

      return res.status(500).json({
        success: false,
        error: "Failed to update user profile",
        details: updateError.message,
      });
    }

    console.log("User profile updated successfully");

    res.json({
      success: true,
      imageUrl: urlData.publicUrl,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Endpoint para obtener modelos de Groq
app.post("/api/groq/models", async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required" });
    }

    // Validar que la API key tenga el formato correcto de Groq
    if (!apiKey.startsWith("gsk_") || apiKey.length < 20) {
      return res.status(400).json({ error: "Invalid Groq API key format" });
    }

    // Hacer la llamada a la API de Groq para obtener los modelos disponibles
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error:
          errorData.error?.message || "Failed to fetch models from Groq API",
        details: errorData,
      });
    }

    const data = await response.json();

    // Procesar y filtrar los modelos relevantes de Groq
    const models = data.data || [];

    // Ordenar los modelos por nombre y priorizar los más comunes
    const sortedModels = models
      .filter((model) => {
        // Filtrar solo modelos de chat principales
        return (
          model.id.includes("llama") ||
          model.id.includes("mixtral") ||
          model.id.includes("gemma")
        );
      })
      .sort((a, b) => {
        // Priorizar modelos más nuevos y populares
        const priorityOrder = [
          "llama-3.3-70b",
          "llama-3.1-70b",
          "llama-3.1-8b",
          "llama-3-70b",
          "llama-3-8b",
          "mixtral-8x7b",
          "gemma-7b",
        ];

        const aPriority = priorityOrder.findIndex((prefix) =>
          a.id.includes(prefix),
        );
        const bPriority = priorityOrder.findIndex((prefix) =>
          b.id.includes(prefix),
        );

        if (aPriority === -1 && bPriority === -1)
          return a.id.localeCompare(b.id);
        if (aPriority === -1) return 1;
        if (bPriority === -1) return -1;
        return aPriority - bPriority;
      });

    res.json({
      models: sortedModels,
      total: sortedModels.length,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching Groq models:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Endpoint de salud
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Upload endpoint: http://localhost:3000/upload-avatar");
});
