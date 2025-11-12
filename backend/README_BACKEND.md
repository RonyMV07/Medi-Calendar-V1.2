# 🏥 MediCalendar Backend

Backend API RESTful para la aplicación MediCalendar, construido con Node.js, Express y MongoDB.

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Seguridad](#seguridad)
- [Scripts Disponibles](#scripts-disponibles)

---

## 🔧 Requisitos

- **Node.js** >= 14.x
- **npm** >= 6.x
- **MongoDB** >= 4.x

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install
```

---

## ⚙️ Configuración

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

### 2. Generar JWT Secret

**Opción A: Usar el script incluido (Recomendado)**
```bash
node scripts/generate-secret.js
```

**Opción B: Generar manualmente**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Editar el archivo .env

```env
MONGODB_URI=mongodb://localhost:27017/medicalendar
PORT=5000
JWT_SECRET=<pega_aqui_la_clave_generada>
```

### 4. Configurar MongoDB

**Desarrollo Local:**
```bash
# Asegúrate de que MongoDB esté corriendo
mongod
```

**Producción (MongoDB Atlas):**
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster
3. Obtener la cadena de conexión
4. Configurar IP whitelist
5. Actualizar MONGODB_URI en .env

---

## 📁 Estructura del Proyecto

```
backend/
├── config/              # Configuraciones (vacío por ahora)
├── controllers/         # Lógica de negocio
│   ├── authController.js
│   ├── metricasController.js
│   └── registrosController.js
├── middleware/          # Middlewares personalizados
│   └── auth.js         # Verificación de JWT
├── models/             # Modelos de Mongoose
│   ├── User.js
│   └── RegistroDiario.js
├── routes/             # Definición de rutas
│   ├── auth.js
│   ├── metricas.js
│   └── registros.js
├── scripts/            # Scripts de utilidad
│   └── generate-secret.js
├── .env                # Variables de entorno (NO subir a Git)
├── .env.example        # Plantilla de variables
├── .gitignore          # Archivos ignorados por Git
├── server.js           # Punto de entrada
├── package.json        # Dependencias y scripts
├── README.md           # Este archivo
└── SECURITY.md         # Guía de seguridad
```

---

## 🌐 API Endpoints

### Autenticación

**Request Body (para ambos endpoints):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_password"
}
```

**Response (en caso de éxito):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "60d5ecb4...", "email": "usuario@ejemplo.com" }
}
```

### Registros Diarios
| Método | Endpoint | Descripción | Auth Requerida |
|--------|----------|-------------|:---:|
| POST | `/api/auth/register` | Registrar un nuevo usuario. | No |
| POST | `/api/auth/login` | Iniciar sesión y obtener un token. | No |

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/registros` | Crear registro | Sí |
| GET | `/api/registros` | Obtener todos los registros | Sí |
| GET | `/api/registros/:fecha` | Obtener registro por fecha | Sí |
| DELETE | `/api/registros/:id` | Eliminar registro | Sí |

### Métricas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/metricas/evolucion` | Obtener evolución de métricas | Sí |
| GET | `/api/metricas/bienestar` | Calcular índice de bienestar | Sí |
| GET | `/api/metricas/reflexion` | Verificar días sin registro | Sí |

---

## 🔐 Seguridad

El proyecto implementa las siguientes medidas de seguridad:

- ✅ **Autenticación JWT** - Tokens seguros con expiración
- ✅ **Bcrypt** - Contraseñas hasheadas con factor 12
- ✅ **CORS** - Configurado para peticiones cross-origin
- ✅ **Variables de Entorno** - Datos sensibles protegidos
- ✅ **Middleware de Autenticación** - Rutas protegidas

### Recomendaciones Adicionales para Producción

```bash
# Instalar paquetes de seguridad adicionales
npm install helmet express-rate-limit express-validator
```

Ver [SECURITY.md](./SECURITY.md) para más detalles.

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo (con nodemon - hot reload)
npm run dev

# Producción
npm start

# Generar clave secreta
node scripts/generate-secret.js

# Auditoría de seguridad
npm audit

# Actualizar dependencias
npm update
```

---

## 🔍 Modelos de Datos

### User
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,        // Hasheada con bcrypt
  preferencias_ux: Object,
  fecha_registro: Date
}
```

### RegistroDiario
```javascript
{
  _id: ObjectId,
  usuario_id: ObjectId,    // Ref: User
  fecha_registro: Date,
  modulos: {
    cardiovascular: {...},
    sueno: {...},
    ejercicios: {...},
    peso: {...},
    medicacion: [{...}],
    citas: [{...}]
  },
  estado_emocional_dia: String
}
```

Ver modelos completos en `/models`

---

## 🐛 Debugging

### Logs
El servidor muestra logs en consola:
```
MongoDB conectado
Servidor en puerto 5000
```

### Errores Comunes

**Error: "MongoDB connection failed"**
- Verificar que MongoDB esté corriendo
- Revisar MONGODB_URI en .env

**Error: "jwt malformed"**
- JWT_SECRET no configurado correctamente
- Token expirado o inválido

**Error: "Access denied"**
- Token no proporcionado en headers
- Token inválido o expirado

---

## 📝 Notas de Desarrollo

### Añadir un Nuevo Endpoint

1. Crear controlador en `/controllers`
2. Definir ruta en `/routes`
3. Registrar ruta en `server.js`
4. (Opcional) Añadir middleware de autenticación

### Buenas Prácticas

- ✅ Usar async/await para operaciones asíncronas
- ✅ Validar datos de entrada
- ✅ Manejar errores apropiadamente
- ✅ Documentar código con comentarios
- ✅ Usar nombres descriptivos para variables

---

## 🤝 Contribuir

1. Crear una rama para tu feature
2. Hacer commits descriptivos
3. Asegurar que no se suban archivos .env
4. Probar los cambios localmente
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto es parte de MediCalendar Demo 1.0

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa la [Guía de Seguridad](SECURITY.md)
- Verifica la configuración de variables de entorno
- Consulta los logs del servidor

---

**Versión:** 1.0.0  
**Última actualización:** 2025-10-17
