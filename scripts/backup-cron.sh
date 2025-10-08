
#!/bin/bash
# Script para backup automático de AI Restaurante
# Creado automáticamente - Backup programado

# Configuración
BACKUP_DIR="/home/backup/ai_restaurante"
PROJECT_DIR="/path/to/your/ai_restaurante/app"
LOG_FILE="/var/log/ai_restaurante_backup.log"
RETENTION_DAYS=30

# Crear directorio de backup si no existe
mkdir -p "$BACKUP_DIR"

# Función de logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "🚀 Iniciando backup automático de AI Restaurante"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR" || {
    log "❌ Error: No se pudo acceder al directorio del proyecto: $PROJECT_DIR"
    exit 1
}

# Verificar que existe node_modules y Prisma
if [ ! -d "node_modules" ]; then
    log "❌ Error: node_modules no encontrado. Ejecutar 'npm install' primero."
    exit 1
fi

# Ejecutar backup
log "📊 Ejecutando backup de base de datos..."
if npx tsx scripts/backup-database.ts; then
    log "✅ Backup completado exitosamente"
    
    # Mover archivos de backup a directorio permanente
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_SUBDIR="$BACKUP_DIR/backup_$TIMESTAMP"
    
    mkdir -p "$BACKUP_SUBDIR"
    cp -r database-backup/* "$BACKUP_SUBDIR/"
    
    # Crear ZIP comprimido
    cd "$BACKUP_DIR"
    zip -r "ai_restaurante_backup_$TIMESTAMP.zip" "backup_$TIMESTAMP/"
    
    log "📦 Backup comprimido creado: ai_restaurante_backup_$TIMESTAMP.zip"
    
    # Limpiar backups antiguos
    find "$BACKUP_DIR" -name "backup_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    find "$BACKUP_DIR" -name "*.zip" -mtime +$RETENTION_DAYS -delete
    
    log "🧹 Backups antiguos limpiados (más de $RETENTION_DAYS días)"
    
else
    log "❌ Error durante el backup"
    exit 1
fi

log "🎉 Backup automático completado"

# Estadísticas de espacio en disco
log "💾 Uso de disco en $BACKUP_DIR:"
du -sh "$BACKUP_DIR" >> "$LOG_FILE"

# Enviar notificación (opcional)
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"✅ Backup de AI Restaurante completado exitosamente"}' \
#   YOUR_SLACK_WEBHOOK_URL
