// Script para convertir IDs de string a UUIDs válidos
const crypto = require('crypto');

// Función para convertir un string a un UUID válido
function stringToUUID(str) {
  // Si ya es un UUID válido, devolverlo tal cual
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }
  
  // Si no es un UUID, generar uno determinista basado en el string
  // Usamos el string como semilla para generar siempre el mismo UUID para el mismo input
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

// Función para procesar un archivo SQL
function processSQLFile(inputSQL) {
  // Expresión regular para encontrar INSERT INTO "User"
  const userInsertRegex = /INSERT INTO "User" \(([^)]+)\) VALUES \(([^)]+)\);/g;
  
  // Reemplazar cada INSERT INTO "User"
  const processedSQL = inputSQL.replace(userInsertRegex, (match, columns, values) => {
    // Dividir columnas y valores
    const columnList = columns.split(', ').map(col => col.trim());
    const valueList = values.split(', ').map(val => val.trim());
    
    // Encontrar el índice de la columna id
    const idIndex = columnList.findIndex(col => col === 'id');
    
    if (idIndex !== -1) {
      // Convertir el ID a UUID
      const originalId = valueList[idIndex].replace(/'/g, '');
      const newUUID = stringToUUID(originalId);
      valueList[idIndex] = `'${newUUID}'`;
    }
    
    // Reconstruir la consulta
    const newColumns = columnList.join(', ');
    const newValues = valueList.join(', ');
    
    return `INSERT INTO "User" (${newColumns}) VALUES (${newValues});`;
  });
  
  return processedSQL;
}

// Ejemplo de uso
// const fs = require('fs');
// const inputSQL = fs.readFileSync('misql.sql', 'utf8');
// const processedSQL = processSQLFile(inputSQL);
// fs.writeFileSync('misql-fixed.sql', processedSQL);

module.exports = { stringToUUID, processSQLFile };