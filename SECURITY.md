# 🔐 Guía de Seguridad - MediCalendar Backend

## 📋 Índice
1. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
2. [Generación de Claves Seguras](#generación-de-claves-seguras)
3. [Mejores Prácticas](#mejores-prácticas)
4. [Checklist de Seguridad](#checklist-de-seguridad)

---

## 🔧 Configuración de Variables de Entorno

### Paso 1: Crear el archivo .env

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

### Paso 2: Configurar las variables

Edita el archivo `.env` y configura los siguientes valores:

#### MongoDB URI

**Para desarrollo local:**
```env
MONGODB_URI=mongodb://localhost:27017/medicalendar
```

**Para MongoDB Atlas (producción):**
```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/medicalendar?retryWrites=true&w=majority
```

⚠️ **Importante:** Nunca incluyas credenciales reales en el código fuente.

#### JWT Secret

**Generar una clave segura:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y pégalo en tu `.env`:
```env
JWT_SECRET=tu_clave_generada_aqui
```

---

## 🔑 Generación de Claves Seguras

### Método 1: Node.js (Recomendado)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Método 2: OpenSSL
```bash
openssl rand -hex 64
```

### Método 3: PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## ✅ Mejores Prácticas

### 1. Variables de Entorno

- ✅ **SÍ:** Usa diferentes valores para desarrollo, staging y producción
- ✅ **SÍ:** Genera JWT_SECRET único para cada entorno
- ✅ **SÍ:** Usa variables de entorno para datos sensibles
- ❌ **NO:** Nunca subas archivos `.env` al repositorio
- ❌ **NO:** No compartas claves secretas por email o chat

### 2. JWT Token

- ✅ **SÍ:** Usa claves de al menos 256 bits (64 caracteres hex)
- ✅ **SÍ:** Configura tiempo de expiración razonable (7 días por defecto)
- ✅ **SÍ:** Implementa refresh tokens para sesiones largas
- ❌ **NO:** No uses claves débiles como "secret123"

### 3. MongoDB

- ✅ **SÍ:** Usa MongoDB Atlas para producción
- ✅ **SÍ:** Habilita autenticación en MongoDB
- ✅ **SÍ:** Usa contraseñas fuertes para usuarios de BD
- ✅ **SÍ:** Configura IP whitelist en MongoDB Atlas
- ❌ **NO:** No expongas MongoDB directamente a internet

### 4. Contraseñas de Usuario

El proyecto ya usa bcrypt con factor 12:
```javascript
this.password = await bcrypt.hash(this.password, 12);
```

- ✅ Factor 12 es adecuado (puede subirse a 14 para mayor seguridad)
- ✅ Las contraseñas se hashean automáticamente antes de guardar

---

## 🔒 Checklist de Seguridad

### Antes de Desarrollar
- [ ] Archivo `.env` creado y configurado
- [ ] JWT_SECRET generado de forma segura
- [ ] MongoDB URI configurado correctamente
- [ ] Archivo `.env` añadido a `.gitignore`

### Antes de Desplegar a Producción
- [ ] Variables de entorno configuradas en el servidor
- [ ] JWT_SECRET diferente al de desarrollo
- [ ] MongoDB Atlas configurado con autenticación
- [ ] IP whitelist configurada en MongoDB Atlas
- [ ] CORS configurado solo para dominios permitidos
- [ ] HTTPS habilitado en el servidor
- [ ] Rate limiting implementado
- [ ] Headers de seguridad configurados (helmet.js)
- [ ] Logs configurados sin exponer datos sensibles
- [ ] Variables de entorno nunca en el código fuente

### Configuraciones Adicionales Recomendadas

#### 1. Instalar Helmet.js
```bash
npm install helmet
```

```javascript
// En server.js
const helmet = require('helmet');
app.use(helmet());
```

#### 2. Implementar Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
// En server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 peticiones por IP
});

app.use('/api/', limiter);
```

#### 3. Validación de Datos
```bash
npm install express-validator
```

---

## 🚨 En Caso de Compromiso de Seguridad

Si sospechas que una clave secreta ha sido comprometida:

1. **Genera una nueva JWT_SECRET inmediatamente**
2. **Actualiza la variable en todos los entornos**
3. **Invalida todos los tokens existentes** (los usuarios deberán iniciar sesión nuevamente)
4. **Revisa logs** para detectar accesos no autorizados
5. **Notifica a los usuarios** si es necesario

---

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 📝 Notas

- Este archivo debe mantenerse actualizado con las prácticas de seguridad del proyecto
- Revisa periódicamente las dependencias con `npm audit`
- Mantén Node.js y las dependencias actualizadas

---

**Última actualización:** 2025-10-17
**Versión del documento:** 1.0
