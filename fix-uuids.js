const fs = require('fs');
const crypto = require('crypto');

// Función para convertir un string a un UUID válido
function stringToUUID(str) {
  // Si ya es un UUID válido, devolverlo tal cual
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }
  
  // Si no es un UUID, generar uno determinista basado en el string
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  
  // Formatear el hash como un UUID
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    hash.substring(12, 16),
    hash.substring(16, 20),
    hash.substring(20, 32)
  ].join('-');
}

// Leer el archivo SQL original
const inputSQL = fs.readFileSync('misql.sql', 'utf8');

// Expresión regular para encontrar todos los valores que parecen ser IDs
// Buscamos patrones como ('cmf1kenwz0000pzed8ryloofi', 'Paul', ...)
const idRegex = /\('([^']+)',/g;

// Reemplazar cada ID encontrado
const processedSQL = inputSQL.replace(idRegex, (match, id) => {
  // Verificar si es un ID que necesita conversión (no es un UUID válido)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    const newUUID = stringToUUID(id);
    return `('${newUUID}',`;
  }
  return match;
});

// Guardar el archivo procesado
fs.writeFileSync('misql-fixed.sql', processedSQL);

console.log('Archivo procesado guardado como misql-fixed.sql');