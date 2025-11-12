# Español/Spanish
# Medi-Calendar Demo 1.0

¡Bienvenido a Medi-Calendar! Una aplicación de página única (SPA) diseñada para el autocuidado y la gestión de la salud personal.

## 📝 Descripción

Aplicación web desarrollada con el stack MERN (MongoDB, Express.js, React, Node.js) que permite a los usuarios:
- Registrar datos de salud diarios (cardiovascular, sueño, ejercicio y peso) próximamente se agregarán los registros de medicación y citas médicas
- Visualizar evolución de métricas en el tiempo
- Mantener adherencia a tratamientos y hábitos saludables
- Reflexionar sobre barreras y procrastinación

## Tecnologías

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, Chart.js, React Calendar, Axios
- **Base de datos**: MongoDB

## Instalación
Medi-Calendar es una herramienta intuitiva que te permite llevar un registro diario de tus datos de salud. El objetivo principal es ayudarte a visualizar la evolución de tus métricas a lo largo del tiempo, fomentar la adherencia a tratamientos y hábitos saludables, y reflexionar sobre las barreras y la procrastinación en tu camino hacia un mayor bienestar.

## ✨ Características

* **Registro de Salud Diario:** Anota tus datos de salud en diferentes categorías:
    * Cardiovascular
    * Sueño
    * Ejercicio
    * Peso
* **Visualización de Datos:** Observa el progreso de tus métricas a lo largo del tiempo a través de gráficos.
* **Próximas Funcionalidades:**
    * Registro de medicamentos.
    * Registro de citas médicas.

## 💻 Tecnologías Utilizadas

Este proyecto está construido utilizando las siguientes tecnologías:

### Backend

* **Node.js:** Entorno de ejecución para JavaScript.
* **Express:** Framework para la construcción de la API REST.
* **MongoDB:** Base de datos NoSQL para el almacenamiento de datos.
* **JWT (JSON Web Tokens):** Para la autenticación y autorización de usuarios.

### Frontend

* **React:** Biblioteca para la construcción de la interfaz de usuario.
* **Chart.js:** Para la visualización de datos en gráficos.
* **React Calendar:** Para la implementación de calendarios interactivos.
* **Axios:** Para realizar peticiones HTTP al backend.

## 🚀 Instalación y Puesta en Marcha

Para clonar y ejecutar este proyecto en tu máquina local, sigue estos pasos:

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* Node.js (que incluye npm)
* MongoDB

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/RonyMV07/Medi-Calendar_Demo_1.0.git](https://github.com/RonyMV07/Medi-Calendar_Demo_1.0.git)
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd Medi-Calendar_Demo_1.0
    ```

3.  **Configura el Backend:**
    * Navega a la carpeta del backend:
        ```bash
        cd backend
        ```
    * Instala las dependencias:
        ```bash
        npm install
        ```
    * Inicia el servidor de desarrollo del backend:
        ```bash
        npm run dev
        ```

4.  **Configura el Frontend:**
    * En una **nueva terminal**, navega a la carpeta del frontend desde el directorio raíz del proyecto:
        ```bash
        cd frontend
        ```
    * Instala las dependencias:
        ```bash
        npm install
        ```
    * Inicia la aplicación de React:
        ```bash
        npm start
        ```

Una vez completados estos pasos, la aplicación debería estar corriendo en tu entorno local.

##  Uso

Una vez que la aplicación esté en funcionamiento, puedes registrarte como un nuevo usuario y comenzar a registrar tus datos de salud diarios. Navega a través de las diferentes secciones para registrar y visualizar tus métricas.

## ⚠️ Advertencias y Consideraciones

* **Versión de Demostración:** Esta es la versión 1.0 y es una demostración. Algunas funcionalidades pueden estar en desarrollo o sujetas a cambios.
* **Configuración de la Base de Datos:** Asegúrate de que tu instancia de MongoDB esté corriendo antes de iniciar el backend. Es posible que necesites configurar la cadena de conexión a la base de datos en los archivos del backend para que coincida con tu configuración local.
* **Variables de Entorno:** Para un entorno de producción, se recomienda el uso de variables de entorno para manejar datos sensibles como las claves secretas de JWT y la configuración de la base de datos.

## 🔐 Configuración de Seguridad

### Configuración Rápida

1. **Crear archivo de variables de entorno:**
```bash
cd backend
cp .env.example .env
```

2. **Generar clave secreta JWT:**
```bash
npm run generate-secret
```

3. **Verificar configuración:**
```bash
npm run check-env
```

4. **Editar `.env` con tus valores:**
```env
MONGODB_URI=mongodb://localhost:27017/medicalendar
PORT=5000
JWT_SECRET=<pega_aqui_la_clave_generada>
```

### Documentación de Seguridad

📚 **Guías disponibles:**
- [`backend/SECURITY.md`](backend/SECURITY.md) - Guía completa de seguridad
- [`backend/README.md`](backend/README.md) - Documentación del backend
- [`SECURITY_IMPROVEMENTS.md`](SECURITY_IMPROVEMENTS.md) - Resumen de mejoras implementadas

🔧 **Scripts útiles:**
- `npm run generate-secret` - Genera claves JWT seguras
- `npm run check-env` - Verifica la configuración
- `npm run setup` - Validación antes de iniciar

# English/Ingles
# Medi-Calendar Demo 1.0

Welcome to Medi-Calendar! A Single Page Application (SPA) designed for self-care and personal health management.

## 📝 Description

Medi-Calendar is an intuitive tool that allows you to keep a daily record of your health data. The main goal is to help you visualize the evolution of your metrics over time, encourage adherence to treatments and healthy habits, and reflect on the barriers and procrastination on your path to greater well-being.

## ✨ Features

* **Daily Health Logging:** Record your health data across different categories:
    * Cardiovascular
    * Sleep
    * Exercise
    * Weight
* **Data Visualization:** Track the progress of your metrics over time through graphs.
* **Upcoming Features:**
    * Medication logging.
    * Medical appointment logging.

## 💻 Technologies Used

This project is built using the following technologies:

### Backend

* **Node.js:** JavaScript runtime environment.
* **Express:** Framework for building the REST API.
* **MongoDB:** NoSQL database for data storage.
* **JWT (JSON Web Tokens):** For user authentication and authorization.

### Frontend

* **React:** Library for building the user interface.
* **Chart.js:** For data visualization in charts.
* **React Calendar:** For implementing interactive calendars.
* **Axios:** For making HTTP requests to the backend.

## 🚀 Installation and Setup

To clone and run this project on your local machine, follow these steps:

### Prerequisites

Ensure you have the following installed:

* Node.js (which includes npm)
* MongoDB

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/RonyMV07/Medi-Calendar_Demo_1.0.git](https://github.com/RonyMV07/Medi-Calendar_Demo_1.0.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Medi-Calendar_Demo_1.0
    ```

3.  **Set up the Backend:**
    * Navigate to the backend folder:
        ```bash
        cd backend
        ```
    * Install the dependencies:
        ```bash
        npm install
        ```
    * Start the backend development server:
        ```bash
        npm run dev
        ```

4.  **Set up the Frontend:**
    * In a **new terminal**, navigate to the frontend folder from the project's root directory:
        ```bash
        cd frontend
        ```
    * Install the dependencies:
        ```bash
        npm install
        ```
    * Start the React application:
        ```bash
        npm start
        ```

After completing these steps, the application should be running in your local environment.

##  Usage

Once the application is running, you can register as a new user and start logging your daily health data. Navigate through the different sections to record and visualize your metrics.

## ⚠️ Warnings and Considerations

* **Demo Version:** This is version 1.0 and is a demonstration. Some features may be under development or subject to change.
* **Database Configuration:** Make sure your MongoDB instance is running before starting the backend. You may need to configure the database connection string in the backend files to match your local setup.
* **Environment Variables:** For a production environment, it is recommended to use environment variables to handle sensitive data such as JWT secret keys and database configurations.
