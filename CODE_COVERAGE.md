# 📊 Documentación de Cobertura de Código - MediCalendar

**Proyecto:** MediCalendar Demo 1.0  
**Fecha:** 2025-10-17  
**Versión del documento:** 1.0

---

## 📋 Índice

1. [¿Qué es la Cobertura de Código?](#qué-es-la-cobertura-de-código)
2. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
3. [Configuración Existente](#configuración-existente)
4. [Cómo Generar Reportes](#cómo-generar-reportes)
5. [Interpretación de Métricas](#interpretación-de-métricas)
6. [Archivos de Test Existentes](#archivos-de-test-existentes)
7. [Roadmap de Testing](#roadmap-de-testing)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🔍 ¿Qué es la Cobertura de Código?

La **cobertura de código** (code coverage) es una métrica que mide qué porcentaje del código fuente es ejecutado cuando se ejecutan las pruebas automatizadas.

### Tipos de Cobertura

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Statement Coverage** | % de sentencias ejecutadas | `const x = 5;` |
| **Branch Coverage** | % de ramas if/else ejecutadas | `if (x > 0) {...} else {...}` |
| **Function Coverage** | % de funciones llamadas | `function calcular() {...}` |
| **Line Coverage** | % de líneas de código ejecutadas | Total de líneas |

### ¿Por qué es importante?

✅ **Calidad del software** - Detecta código no probado  
✅ **Confianza en despliegues** - Menos bugs en producción  
✅ **Refactoring seguro** - Cambios con red de seguridad  
✅ **Documentación viva** - Los tests documentan el comportamiento esperado  

---

## 🎯 Punto de Partida

Actualmente, el proyecto cuenta con la infraestructura de testing proporcionada por `create-react-app` (Jest y React Testing Library), pero aún no se han implementado tests específicos para los componentes y la lógica de la aplicación.

El objetivo es seguir el **Roadmap de Testing** para construir una suite de pruebas robusta que garantice la calidad y estabilidad de MediCalendar.

---

## ⚙️ Configuración Existente

### Frontend
El proyecto está configurado con las herramientas estándar de `create-react-app`:

- **Jest:** Framework de testing.
- **React Testing Library:** Para probar componentes de React de manera centrada en el usuario.

**Dependencias de desarrollo relevantes:**
```json
{
  "@testing-library/dom": "^10.4.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^13.5.0"
}
```

#### 3. Configuración de Cobertura (Implícita)

Jest usa Istanbul bajo el capó para generar reportes. La configuración por defecto incluye:

```javascript
// Configuración implícita de Jest en react-scripts
{
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.js",
    "!src/reportWebVitals.js"
  ],
  coverageThreshold: undefined, // No hay umbrales definidos
  coverageReporters: ["text", "lcov"] // Formatos de reporte
}
```

### Backend

**Estado:** Sin configuración de testing.

**Recomendación:** Instalar Jest o Mocha + Chai + Supertest.

---

## 🚀 Cómo Generar Reportes

### Frontend

#### Método 1: Reporte en Terminal

```bash
cd frontend
npm test -- --coverage --watchAll=false
```

**Salida esperada:**
```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files            |       0 |        0 |       0 |       0 |                   
 src                 |       0 |        0 |       0 |       0 |                   
  App.js             |       0 |        0 |       0 |       0 | 1-10             
  index.js           |       0 |        0 |       0 |       0 | 1-18             
 src/pages           |       0 |        0 |       0 |       0 |                   
  CalendarPage.js    |       0 |        0 |       0 |       0 | 1-261            
  LoginPage.js       |       0 |        0 |       0 |       0 | 1-100            
----------------------|---------|----------|---------|---------|-------------------
```

#### Método 2: Reporte HTML Interactivo

```bash
cd frontend
npm test -- --coverage --watchAll=false

# Abrir reporte en navegador
# Windows:
start coverage\lcov-report\index.html

# El reporte se genera en: frontend/coverage/lcov-report/
```

**Características del reporte HTML:**
- ✅ Vista navegable por archivos
- ✅ Código coloreado (verde=cubierto, rojo=no cubierto)
- ✅ Métricas detalladas por archivo
- ✅ Identificación de líneas no cubiertas

#### Método 3: Agregar Script Personalizado

Editar `frontend/package.json`:
```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:coverage:open": "npm run test:coverage && start coverage/lcov-report/index.html"
  }
}
```

Luego ejecutar:
```bash
npm run test:coverage:open
```

### Backend (Cuando se implemente)

```bash
# Ejemplo con Jest (futuro)
cd backend
npm test -- --coverage

# Ejemplo con NYC + Mocha (futuro)
npx nyc mocha
```

---

## 📊 Interpretación de Métricas

### Ejemplo de Reporte

```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
CalendarPage.js       |   45.2  |   30.5   |   52.1  |   44.8  |
```

### ¿Qué significa cada métrica?

#### % Stmts (Statements)
**45.2%** de las sentencias fueron ejecutadas por los tests.

```javascript
const x = 5;           // ✅ Cubierta
const y = 10;          // ❌ No cubierta
const total = x + y;   // ❌ No cubierta
```

#### % Branch (Ramas)
**30.5%** de las ramas condicionales fueron probadas.

```javascript
if (usuario) {         // ✅ Rama true probada
  login();             // ✅ Cubierta
} else {               // ❌ Rama false NO probada
  mostrarError();      // ❌ No cubierta
}
```

#### % Funcs (Funciones)
**52.1%** de las funciones fueron llamadas.

```javascript
function guardar() { }      // ✅ Llamada en tests
function eliminar() { }     // ✅ Llamada en tests
function exportar() { }     // ❌ Nunca llamada
function importar() { }     // ❌ Nunca llamada
```

#### % Lines (Líneas)
**44.8%** de las líneas de código fueron ejecutadas.

Similar a Statements pero cuenta líneas físicas.

### Umbrales Recomendados

| Nivel | % Cobertura | Interpretación |
|-------|-------------|----------------|
| 🔴 Crítico | < 40% | Cobertura muy baja, alto riesgo |
| 🟡 Bajo | 40% - 60% | Cobertura insuficiente |
| 🟢 Aceptable | 60% - 80% | Cobertura buena |
| ✅ Excelente | 80% - 90% | Cobertura muy buena |
| 🏆 Excepcional | > 90% | Cobertura excelente |

**Nota:** 100% no siempre es necesario ni práctico.

---

## 📁 Archivos de Test Existentes

### Frontend

#### `frontend/src/App.test.js`

**Ubicación:** `/frontend/src/App.test.js`  
**Estado:** ⚠️ Obsoleto  
**Última modificación:** Archivo template de Create React App

**Contenido actual:**
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

**Problema:** Busca texto "learn react" que no existe en la aplicación real.

**Estado del test:** ❌ Fallará si se ejecuta

**Acción requerida:** Actualizar o eliminar este test.

---

### Backend

#### Estado: Sin archivos de test

**Archivos que necesitan tests:**

```
backend/
├── controllers/
│   ├── authController.js        ❌ Sin tests
│   ├── metricasController.js    ❌ Sin tests
│   └── registrosController.js   ❌ Sin tests
├── models/
│   ├── User.js                  ❌ Sin tests
│   └── RegistroDiario.js        ❌ Sin tests
├── routes/
│   ├── auth.js                  ❌ Sin tests
│   ├── metricas.js              ❌ Sin tests
│   └── registros.js             ❌ Sin tests
└── middleware/
    └── auth.js                  ❌ Sin tests
```

---

## 🗺️ Roadmap de Testing

### Fase 1: Fundamentos (Corto Plazo)

**Objetivo:** Establecer infraestructura básica

**Frontend:**
- [ ] Actualizar/eliminar `App.test.js`
- [ ] Crear tests para `utils/api.js`
- [ ] Configurar umbrales mínimos de cobertura
- [ ] Documentar convenciones de testing

**Backend:**
- [ ] Instalar Jest + Supertest
- [ ] Configurar entorno de testing
- [ ] Crear primeros tests de integración de endpoints
- [ ] Configurar base de datos de testing

**Meta de cobertura:** 30%

---

### Fase 2: Componentes Críticos (Mediano Plazo)

**Objetivo:** Cubrir funcionalidad principal

**Frontend:**
- [ ] Tests para `LoginPage.js`
- [ ] Tests para `CalendarPage.js` (básicos)
- [ ] Tests para formularios de registro
- [ ] Tests de integración de rutas

**Backend:**
- [ ] Tests unitarios de controladores
- [ ] Tests de modelos (validaciones)
- [ ] Tests de middleware de autenticación
- [ ] Tests de endpoints protegidos

**Meta de cobertura:** 60%

---

### Fase 3: Cobertura Completa (Largo Plazo)

**Objetivo:** Cobertura robusta del sistema

**Frontend:**
- [ ] Tests de componentes visuales
- [ ] Tests de interacción de usuario
- [ ] Tests de manejo de errores
- [ ] Tests de estados de carga

**Backend:**
- [ ] Tests de casos edge
- [ ] Tests de manejo de errores
- [ ] Tests de validación de datos
- [ ] Tests de performance

**Meta de cobertura:** 80%+

---

### Fase 4: Testing Avanzado (Futuro)

**Objetivo:** Testing completo end-to-end

- [ ] Tests E2E con Cypress/Playwright
- [ ] Tests de regresión visual
- [ ] Tests de accesibilidad
- [ ] Tests de carga y performance
- [ ] Integración con CI/CD

**Meta de cobertura:** 85%+

---

## ✅ Mejores Prácticas

### 1. Convenciones de Nombres

```
# Archivos de test deben estar junto al código o en __tests__/

src/
├── components/
│   ├── Button.js
│   └── Button.test.js           ✅ Junto al componente
├── pages/
│   ├── LoginPage.js
│   └── __tests__/
│       └── LoginPage.test.js    ✅ En carpeta __tests__
```

### 2. Estructura de Tests

```javascript
describe('CalendarPage', () => {
  describe('cuando el usuario está autenticado', () => {
    it('debe mostrar el calendario', () => {
      // Arrange - Preparar
      // Act - Ejecutar
      // Assert - Verificar
    });
  });
  
  describe('cuando el usuario no está autenticado', () => {
    it('debe redirigir al login', () => {
      // ...
    });
  });
});
```

### 3. Qué Testear

**Prioridad Alta (Testear siempre):**
- ✅ Lógica de negocio crítica
- ✅ Funciones de utilidad
- ✅ Endpoints de API
- ✅ Validaciones de datos
- ✅ Autenticación y autorización

**Prioridad Media:**
- ⚠️ Componentes de UI
- ⚠️ Integraciones de terceros
- ⚠️ Manejo de estados

**Prioridad Baja:**
- 📌 Código trivial (getters/setters)
- 📌 Configuración
- 📌 Constantes

### 4. Qué NO Testear

❌ Código de terceros (React, Express, etc.)  
❌ Configuración obvia  
❌ Getters/setters simples sin lógica  

### 5. Mantener Tests Mantenibles

```javascript
// ❌ MAL - Test frágil
test('form validation', () => {
  const input = screen.getByTestId('email-input-field-123');
  // ...
});

// ✅ BIEN - Test robusto
test('form validation', () => {
  const input = screen.getByLabelText('Email');
  // ...
});
```

### 6. Tests Independientes

```javascript
// ❌ MAL - Tests dependientes
let user;
test('create user', () => {
  user = createUser();
});
test('update user', () => {
  updateUser(user); // Depende del test anterior
});

// ✅ BIEN - Tests independientes
test('create user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});
test('update user', () => {
  const user = createUser(); // Cada test se prepara solo
  updateUser(user);
});
```

---

## 📋 Checklist de Cobertura

### Antes de Cada Pull Request
- [ ] Ejecutar tests: `npm test`
- [ ] Generar reporte de cobertura: `npm run test:coverage`
- [ ] Verificar que no baja la cobertura
- [ ] Agregar tests para código nuevo

### Antes de Cada Release
- [ ] Cobertura mínima cumplida (definir %)
- [ ] Todos los tests pasan
- [ ] Reporte de cobertura generado y revisado
- [ ] Casos edge documentados y probados

### Mensualmente
- [ ] Revisar tendencia de cobertura
- [ ] Identificar áreas sin cobertura
- [ ] Actualizar roadmap de testing
- [ ] Revisar y actualizar esta documentación

---

## 🔗 Recursos Adicionales

### Documentación
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Istanbul/NYC](https://istanbul.js.org/)

### Tutoriales
- [Testing React Apps - Official Docs](https://reactjs.org/docs/testing.html)
- [Testing Node.js APIs](https://www.testim.io/blog/nodejs-api-testing/)

### Herramientas
- [Codecov](https://codecov.io/) - Servicio de cobertura en la nube
- [Coveralls](https://coveralls.io/) - Alternativa a Codecov
- [SonarQube](https://www.sonarqube.org/) - Análisis de calidad de código

---

## 📝 Notas Finales

### Estado Actual: ⚠️ Testing Infraestructure Ready, Tests Needed

El proyecto tiene toda la infraestructura necesaria para testing y cobertura de código en el frontend, pero **carece de tests reales**. El backend no tiene ninguna configuración de testing.

### Próximos Pasos Recomendados

1. **Inmediato:** Actualizar o eliminar `App.test.js`
2. **Corto plazo:** Crear tests para `utils/api.js` (frontend)
3. **Mediano plazo:** Configurar testing en backend
4. **Largo plazo:** Alcanzar 60-80% de cobertura

### Meta del Proyecto

**Objetivo:** Alcanzar y mantener **80% de cobertura** en código crítico para garantizar calidad y confiabilidad antes del despliegue a producción.

---

**Última actualización:** 2025-10-17  
**Mantenido por:** MediCalendar Team  
**Versión:** 1.0
