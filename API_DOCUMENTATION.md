# 📡 Documentación Completa de la API - MediCalendar

**Proyecto:** MediCalendar Demo 1.0  
**Fecha:** 2025-10-18  
**Versión del documento:** 1.0

---

## 📋 Índice

1. [Información General](#información-general)
2. [Endpoints de Autenticación](#endpoints-de-autenticación)
   - [POST /api/auth/register](#post-apiauthregister)
   - [POST /api/auth/login](#post-apiauthlogin)
3. [Endpoints de Registros Diarios](#endpoints-de-registros-diarios)
   - [POST /api/registros](#post-apiregistros)
   - [GET /api/registros](#get-apiregistros)
   - [GET /api/registros/:fecha](#get-apiregistrosfecha)
   - [DELETE /api/registros/:id](#delete-apiregistrosid)
4. [Endpoints de Métricas](#endpoints-de-métricas)
   - [GET /api/metricas/evolucion](#get-apimetricasevolucion)
   - [GET /api/metricas/bienestar](#get-apimetricasbienestar)
   - [GET /api/metricas/reflexion](#get-apimetricasreflexion)
5. [Modelos de Datos](#modelos-de-datos)
6. [Estructura de Errores](#estructura-de-errores)

---

## ℹ️ Información General

### URL Base

- **Desarrollo:** `http://localhost:5000`

### Autenticación

- **Tipo:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <token>`
- **Token:** Obtenido en los endpoints de `register` y `login`
- **Expiración:** 7 días

### Headers Comunes

```http
Content-Type: application/json
Accept: application/json
```

---

## 🔐 Endpoints de Autenticación

### `POST /api/auth/register`

**Descripción:** Registra un nuevo usuario.

**Autenticación:** No requerida

#### Request Body

```json
{
  "email": "usuario.nuevo@example.com",
  "password": "PasswordSeguro123!"
}
```

#### Response (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "654ac23f9876abcdef123456",
  "email": "usuario.nuevo@example.com"
}
```

#### Responses de Error

- **400 Bad Request (Usuario Existente):**
  ```json
  {
    "error": "El usuario ya existe"
  }
  ```
- **400 Bad Request (Campos Faltantes):**
  ```json
  {
    "error": "Email y contraseña son requeridos"
  }
  ```

---

### `POST /api/auth/login`

**Descripción:** Inicia sesión y obtiene un token JWT.

**Autenticación:** No requerida

#### Request Body

```json
{
  "email": "usuario.nuevo@example.com",
  "password": "PasswordSeguro123!"
}
```

#### Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "654ac23f9876abcdef123456",
  "email": "usuario.nuevo@example.com"
}
```

#### Responses de Error

- **401 Unauthorized (Credenciales Inválidas):**
  ```json
  {
    "error": "Credenciales inválidas"
  }
  ```
- **400 Bad Request (Campos Faltantes):**
  ```json
  {
    "error": "Email y contraseña son requeridos"
  }
  ```

---

## 📝 Endpoints de Registros Diarios

**Autenticación:** ✅ Requerida para todos los endpoints de esta sección.

### `POST /api/registros`

**Descripción:** Crea o actualiza un registro diario de salud.

#### Request Body

```json
{
  "fecha_registro": "2025-10-18T00:00:00.000Z",
  "modulos": {
    "cardiovascular": {
      "presion_sistolica": 120,
      "presion_diastolica": 80,
      "frecuencia_cardiaca": 72
    },
    "sueno": {
      "duracion_horas": 7.5,
      "calidad_percibida": 4,
      "notas_sueno": "Dormí bien, sin interrupciones"
    },
    "ejercicios": {
      "tipo_actividad": "Correr",
      "duracion_min": 30,
      "esfuerzo_percibido": 7
    },
    "peso": {
      "peso_kg": 70.5,
      "objetivo_peso": 68.0
    },
    "estado_emocional_dia": "Me siento motivado y con energía"
  }
}
```

#### Response (201 Created - Nuevo Registro)

```json
{
  "_id": "654ac23f9876abcdef123457",
  "usuario_id": "654ac23f9876abcdef123456",
  "fecha_registro": "2025-10-18T00:00:00.000Z",
  "modulos": {
    "cardiovascular": { ... },
    "sueno": { ... },
    "ejercicios": { ... },
    "peso": {
      "peso_kg": 70.5,
      "imc": "24.39",
      "objetivo_peso": 68.0
    },
    "estado_emocional_dia": "Me siento motivado y con energía"
  }
}
```

#### Response (200 OK - Registro Actualizado)

El mismo formato que la creación, pero con los datos actualizados.

**Notas:**
- `imc` se calcula automáticamente en el backend.
- Si ya existe un registro para la fecha, se actualiza.

---

### `GET /api/registros`

**Descripción:** Obtiene todos los registros del usuario, con opción de filtrar por rango de fechas.

#### Request

**Sin filtros:**
```http
GET http://localhost:5000/api/registros
Authorization: Bearer <token>
```

**Con filtros (Query Params):**
```http
GET http://localhost:5000/api/registros?fechaInicio=2025-10-01&fechaFin=2025-10-18
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
[
  {
    "_id": "654ac23f9876abcdef123458",
    "usuario_id": "654ac23f9876abcdef123456",
    "fecha_registro": "2025-10-18T00:00:00.000Z",
    "modulos": { ... }
  },
  {
    "_id": "654ac23f9876abcdef123457",
    "usuario_id": "654ac23f9876abcdef123456",
    "fecha_registro": "2025-10-17T00:00:00.000Z",
    "modulos": { ... }
  }
]
```

---

### `GET /api/registros/:fecha`

**Descripción:** Obtiene un registro para una fecha específica.

#### Request

```http
GET http://localhost:5000/api/registros/2025-10-18
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "_id": "654ac23f9876abcdef123458",
  "usuario_id": "654ac23f9876abcdef123456",
  "fecha_registro": "2025-10-18T00:00:00.000Z",
  "modulos": { ... }
}
```

#### Response (404 Not Found)

```json
{
  "message": "No hay registro para esta fecha"
}
```

---

### `DELETE /api/registros/:id`

**Descripción:** Elimina un registro por su ID.

#### Request

```http
DELETE http://localhost:5000/api/registros/654ac23f9876abcdef123458
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "message": "Registro eliminado exitosamente"
}
```

#### Response (404 Not Found)

```json
{
  "message": "Registro no encontrado"
}
```

---

## 📊 Endpoints de Métricas

**Autenticación:** ✅ Requerida para todos los endpoints de esta sección.

### `GET /api/metricas/evolucion`

**Descripción:** Obtiene la evolución de una métrica específica en un rango de fechas.

#### Request (Query Params)

```http
GET http://localhost:5000/api/metricas/evolucion?tipo=peso&fechaInicio=2025-09-01&fechaFin=2025-10-18
Authorization: Bearer <token>
```

**Valores para `tipo`:** `peso`, `cardiovascular`, `sueno`, `ejercicio`

#### Response (200 OK - tipo=peso)

```json
[
  {
    "fecha": "2025-09-15T00:00:00.000Z",
    "valor": 72.0,
    "imc": "24.91"
  },
  {
    "fecha": "2025-10-01T00:00:00.000Z",
    "valor": 71.5,
    "imc": "24.74"
  },
  {
    "fecha": "2025-10-18T00:00:00.000Z",
    "valor": 70.5,
    "imc": "24.39"
  }
]
```

#### Response (200 OK - tipo=cardiovascular)

```json
[
  {
    "fecha": "2025-10-17T00:00:00.000Z",
    "sistolica": 122,
    "diastolica": 81,
    "frecuencia": 74
  },
  {
    "fecha": "2025-10-18T00:00:00.000Z",
    "sistolica": 120,
    "diastolica": 80,
    "frecuencia": 72
  }
]
```

---

### `GET /api/metricas/bienestar`

**Descripción:** Calcula un índice de bienestar basado en los últimos 30 días.

#### Request

```http
GET http://localhost:5000/api/metricas/bienestar
Authorization: Bearer <token>
```

#### Response (200 OK - Con Datos)

```json
{
  "indice": 75.8,
  "consistencia": "80.0",
  "adherenciaMedicacion": "85.7",
  "calidadSueno": "76.0",
  "totalRegistros": 24,
  "mensaje": "¡Excelente trabajo!"
}
```

#### Response (200 OK - Sin Datos)

```json
{
  "indice": 0,
  "mensaje": "No hay datos suficientes. ¡Comienza a registrar tus datos!"
}
```

**Notas:**
- **Índice:** Promedio ponderado (40% consistencia, 30% adherencia, 30% sueño)
- **Consistencia:** % de días con registro en los últimos 30 días
- **Adherencia:** % de dosis de medicación tomadas
- **Calidad Sueño:** Promedio de calidad de sueño (escala 0-100)

---

### `GET /api/metricas/reflexion`

**Descripción:** Verifica los días sin registro para sugerir una reflexión.

#### Request

```http
GET http://localhost:5000/api/metricas/reflexion
Authorization: Bearer <token>
```

#### Response (200 OK - >3 días sin registro)

```json
{
  "diasSinRegistro": 5,
  "necesitaReflexion": true,
  "mensaje": "Es normal tener días difíciles. ¿Qué te ha impedido registrar tus datos?"
}
```

#### Response (200 OK - <3 días sin registro)

```json
{
  "diasSinRegistro": 1,
  "necesitaReflexion": false,
  "mensaje": "¡Sigue así! Mantén la consistencia."
}
```

---

## 📦 Modelos de Datos

### User

```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // Hasheada con bcrypt
  preferencias_ux: Object,
  fecha_registro: Date
}
```

### RegistroDiario

```javascript
{
  _id: ObjectId,
  usuario_id: ObjectId, // Ref: User
  fecha_registro: Date,
  modulos: {
    cardiovascular: {
      presion_sistolica: Number,
      presion_diastolica: Number,
      frecuencia_cardiaca: Number
    },
    sueno: {
      duracion_horas: Number,
      calidad_percibida: Number, // Rango: 1-5
      notas_sueno: String
    },
    ejercicios: {
      tipo_actividad: String,
      duracion_min: Number,
      esfuerzo_percibido: Number // Rango: 1-10
    },
    peso: {
      peso_kg: Number,
      imc: Number, // Calculado
      objetivo_peso: Number
    },
    medicacion: [{
      medicamento_id: String,
      dosis_tomada: Boolean,
      hora_registro: Date
    }],
    citas: [{
      fecha_cita: Date,
      medico_especialidad: String,
      motivo: String,
      recordatorio_activo: Boolean
    }],
    estado_emocional_dia: String
  }
}
```

---

## ❌ Estructura de Errores

### Formato General

```json
{
  "error": "Descripción del error"
}
```

Ocasionalmente:

```json
{
  "message": "Descripción del mensaje"
}
```

### Códigos de Estado HTTP Usados

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| **200** | OK | Operación exitosa (GET, actualización) |
| **201** | Created | Recurso creado exitosamente (POST) |
| **400** | Bad Request | Datos inválidos o faltantes |
| **401** | Unauthorized | Token inválido o faltante |
| **404** | Not Found | Recurso no encontrado |
| **500** | Server Error | Error interno del servidor |

---

**Versión:** 1.0  
**Última actualización:** 2025-10-18
