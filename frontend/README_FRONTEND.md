# 🖥️ MediCalendar Frontend

Interfaz de usuario para la aplicación MediCalendar, construida con React. Este proyecto proporciona una experiencia de usuario rica e interactiva para el seguimiento de la salud.

## ✨ Características

- **Dashboard Intuitivo:** Visualiza métricas de salud clave de un vistazo.
- **Autenticación Segura:** Flujo de registro e inicio de sesión manejado a través del componente `LoginPage`.
- **Componentes Reutilizables:** Una biblioteca de componentes para mantener la consistencia visual.
- **Visualización de Datos:** Gráficos dinámicos con `Chart.js` y calendarios con `React Calendar`.

## 💻 Tecnologías

- **React:** Biblioteca principal para la construcción de la UI.
- **React Router:** Para el enrutamiento del lado del cliente.
- **Axios:** Para la comunicación con la API del backend.
- **Chart.js & React Chart.js 2:** Para la visualización de datos.

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js y npm instalados.
- El backend de MediCalendar debe estar corriendo.

### Pasos
1. **Navega al directorio del frontend:**
   ```bash
   cd frontend
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```
La aplicación se abrirá en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
src/
├── components/   # Componentes reutilizables (ej. PrivateRoute)
├── hooks/        # Hooks personalizados (ej. useAuth)
├── pages/        # Componentes de página (Dashboard, LoginPage, etc.)
├── styles/       # Archivos CSS específicos de componentes
├── utils/        # Funciones de utilidad (ej. dateUtils)
└── App.js        # Componente raíz y definición de rutas
```

