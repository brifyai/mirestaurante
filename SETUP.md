
# 🚀 AI Restaurante - Guía de Configuración Completa

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL
- Cuentas en servicios externos (ver abajo)

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Copiar `.env.example` a `.env` y configurar todas las variables:

```bash
cp .env.example .env
```

### 2. Servicios Externos Requeridos

#### 🤖 Groq AI (OBLIGATORIO)
- Registrarse en: https://console.groq.com/
- Crear API Key
- Configurar `GROQ_API_KEY` en .env

#### 📱 WhatsApp Business API
- Meta Business Account: https://business.facebook.com/
- WhatsApp Business API
- Configurar webhook: `https://tu-dominio.com/api/webhooks/whatsapp`
- Variables necesarias:
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `WHATSAPP_VERIFY_TOKEN`

#### 📸 Instagram Messaging API
- Instagram Business Account vinculado a Facebook Page
- Configurar webhook: `https://tu-dominio.com/api/webhooks/instagram`
- Variables necesarias:
  - `INSTAGRAM_ACCESS_TOKEN`
  - `INSTAGRAM_BUSINESS_ACCOUNT_ID`

#### 👥 Facebook Messenger API
- Facebook Page
- Configurar webhook: `https://tu-dominio.com/api/webhooks/facebook`
- Variables necesarias:
  - `FACEBOOK_ACCESS_TOKEN`
  - `FACEBOOK_VERIFY_TOKEN`

#### 📅 Google Calendar API
1. Google Cloud Console: https://console.cloud.google.com/
2. Habilitar Calendar API
3. Crear Service Account
4. Descargar JSON key
5. Configurar `GOOGLE_SERVICE_ACCOUNT_KEY`

#### 📊 Google Analytics 4
- Google Analytics: https://analytics.google.com/
- Crear Property GA4
- Configurar `GOOGLE_ANALYTICS_PROPERTY_ID`

## 🏗️ Instalación

```bash
# Instalar dependencias
yarn install

# Configurar base de datos
yarn prisma generate
yarn prisma db push
yarn prisma db seed

# Ejecutar aplicación
yarn dev
```

## ⚙️ Configuración en la Aplicación

1. **Iniciar sesión** con las credenciales:
   - Email: `paul@jaraquemada.com`
   - Password: `password123`

2. **Ir a Configuración** en el sidebar

3. **Configurar APIs** en las pestañas:
   - **APIs Externas**: Configurar todas las integraciones
   - **Configuración IA**: Ajustar parámetros de Llama 3
   - **WhatsApp Features**: Habilitar funcionalidades
   - **Avanzado**: Configuraciones técnicas

4. **Probar Conexiones** con los botones "Probar Conexión"

5. **Guardar Configuración**

## 🔗 Webhooks

Configurar estos endpoints en cada plataforma:

- **WhatsApp**: `https://tu-dominio.com/api/webhooks/whatsapp`
- **Instagram**: `https://tu-dominio.com/api/webhooks/instagram`
- **Facebook**: `https://tu-dominio.com/api/webhooks/facebook`

## 📱 Funcionalidades de WhatsApp

Una vez configurado, los clientes podrán:

- ✅ **Solicitar carta/menú** completo
- ✅ **Crear reservas** automáticamente
- ✅ **Modificar reservas** existentes
- ✅ **Cancelar reservas**
- ✅ **Consultar horarios** de atención
- ✅ **Obtener ubicación** y contacto
- ✅ **Preguntar sobre alergias** (escalación automática)
- ✅ **Ver promociones** activas
- ✅ **Enviar quejas/sugerencias**

## 🧠 Motor de IA

El sistema usa **Groq AI con Llama 3 8B 8K** para:

- Procesamiento de lenguaje natural
- Detección de intenciones
- Generación de respuestas automáticas
- Escalación inteligente a humanos
- Integración con Google Calendar
- Análisis de sentimientos

## 🚨 Escalación Humana

La IA escala automáticamente cuando detecta:
- Palabras clave: "alergia", "severa", "urgente", "manager"
- Consultas médicas complejas
- Quejas graves
- Situaciones que requieren atención especial

## 📊 Bandeja de Entrada Unificada

Centraliza mensajes de:
- WhatsApp Business
- Instagram Direct
- Facebook Messenger

Con funciones:
- Respuesta automática de IA
- Detección de intenciones
- Estados de conversación
- Escalación manual
- Historial completo

## 🎯 Características Destacadas

- **🤖 IA Completamente Automática**: Respuestas 24/7
- **📅 Integración con Calendar**: Reservas sincronizadas
- **📱 Multi-canal**: WhatsApp, Instagram, Facebook
- **🔄 Escalación Inteligente**: Humano cuando es necesario
- **📊 Analytics**: Métricas completas de conversaciones
- **⚡ Tiempo Real**: Notificaciones instantáneas
- **🔒 Seguro**: Webhooks verificados y encriptados

## 🆘 Soporte

Para problemas técnicos:
1. Verificar logs en la consola del navegador
2. Probar conexiones en Configuración
3. Revivar variables de entorno
4. Consultar documentación de APIs externas

## 📈 Siguientes Pasos

1. Configurar dominio personalizado
2. SSL/HTTPS obligatorio para webhooks
3. Configurar backups automáticos
4. Monitoreo y alertas
5. Capacitación del equipo

---

🎉 **¡Tu AI Restaurante está listo para ser el mejor sistema del mercado!**
