const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de Supabase con clave de servicio
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Endpoint para subir avatar
app.post('/upload-avatar', async (req, res) => {
  try {
    const { file, fileName, filePath, contentType, userId } = req.body;

    // Validar datos requeridos
    if (!file || !fileName || !filePath || !contentType || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Convertir base64 a Buffer
    const fileBuffer = Buffer.from(file, 'base64');

    // Validar tamaño (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 2MB'
      });
    }

    // Validar tipo de archivo
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        error: 'Only image files are allowed'
      });
    }

    console.log('Uploading file to:', filePath);
    console.log('File size:', fileBuffer.length);

    // Subir a Supabase Storage con permisos de servicio
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('img')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: contentType
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload file',
        details: uploadError.message
      });
    }

    console.log('File uploaded successfully:', uploadData);

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('img')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return res.status(500).json({
        success: false,
        error: 'Failed to get public URL'
      });
    }

    console.log('Public URL:', urlData.publicUrl);

    // Actualizar el campo image en la tabla User
    const { error: updateError } = await supabase
      .from('User')
      .update({
        image: urlData.publicUrl,
        updatedAt: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Update error:', updateError);
      // Eliminar el archivo subido si no se puede actualizar la base de datos
      await supabase.storage
        .from('img')
        .remove([filePath]);
      
      return res.status(500).json({
        success: false,
        error: 'Failed to update user profile',
        details: updateError.message
      });
    }

    console.log('User profile updated successfully');

    res.json({
      success: true,
      imageUrl: urlData.publicUrl,
      message: 'Avatar uploaded successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Upload endpoint: http://localhost:3000/upload-avatar');
});