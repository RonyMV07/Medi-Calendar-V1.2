# Informe Detallado de Funcionalidades del Proyecto MediCalendar

A continuación se presenta un análisis exhaustivo de las funcionalidades, componentes y flujos de datos implementados en el proyecto `medicalendar`.

## 1. El Modelo de Datos: `RegistroDiario.js`

Todo comienza con cómo se organiza y guarda la información en la base de datos. El archivo `backend/models/RegistroDiario.js` define un "esquema" para cada registro diario que un usuario puede crear. Piensa en ello como el plano o la plantilla para los datos de cada día.

### Agregación de Campos de Medicación y Citas

Para poder registrar medicamentos y citas, se añadieron dos campos clave dentro del objeto `modulos` en el esquema. Ambos son *Arrays*, lo que significa que un usuario puede tener múltiples medicamentos y múltiples citas para un mismo día.

#### a) Campo `medicacion`

Este campo permite registrar los medicamentos que el usuario debe tomar.

*   **Código del Modelo:**
    ```javascript
    // ... (otros módulos)
    medicacion: [{
      medicamento_id: String, // Podría ser un ObjectId de un modelo de Medicamento
      dosis_tomada: Boolean,
      hora_registro: Date,
    }],
    // ...
    ```
*   **Explicación:**
    *   `medicacion`: Es un array de objetos. Cada objeto representa un medicamento a tomar.
    *   `medicamento_id`: Un identificador para el medicamento. Aunque actualmente es un `String`, está preparado para en el futuro poder relacionarlo con un catálogo de medicamentos más complejo.
    *   `dosis_tomada`: Un valor booleano (`true`/`false`) para marcar si el usuario ya tomó esa dosis.
    *   `hora_registro`: La hora en que se debe tomar o se tomó el medicamento.

#### b) Campo `citas`

Similar a la medicación, este campo permite agendar y llevar un control de las citas médicas.

*   **Código del Modelo:**
    ```javascript
    // ... (otros módulos)
    citas: [{
      fecha_cita: Date,
      medico_especialidad: String,
      motivo: String,
      recordatorio_activo: Boolean, // Se mantiene por si es de utilidad básica
    }],
    // ...
    ```
*   **Explicación:**
    *   `citas`: Es un array de objetos, donde cada objeto es una cita.
    *   `fecha_cita`: La fecha y hora exactas de la cita.
    *   `medico_especialidad`: El nombre del médico o su especialidad (ej. "Dr. Smith", "Cardiología").
    *   `motivo`: La razón de la cita (ej. "Control anual", "Dolor de espalda").
    *   `recordatorio_activo`: Un booleano para activar o desactivar recordatorios para esa cita.

## 2. Nuevos Endpoints en el Backend

El archivo `backend/routes/registros.js` define las "carreteras" o "endpoints" que el frontend utilizará para comunicarse con el servidor y manejar los registros diarios. Todas estas rutas están protegidas, lo que significa que un usuario debe haber iniciado sesión para poder usarlas (`router.use(auth);`).

*   **Código de las Rutas (`routes/registros.js`):**
    ```javascript
    const express = require('express');
    const router = express.Router();
    const registrosController = require('../controllers/registrosController');
    const auth = require('../middleware/auth');

    // Todas las rutas requieren autenticación
    router.use(auth);

    // POST /api/registros - Crear nuevo registro diario
    router.post('/', registrosController.crearRegistro);

    // GET /api/registros - Obtener todos los registros del usuario
    router.get('/', registrosController.obtenerRegistros);

    // GET /api/registros/:fecha - Obtener registro por fecha
    router.get('/:fecha', registrosController.obtenerRegistroPorFecha);

    // PUT /api/registros/:id - Actualizar registro existente
    router.put('/:id', registrosController.actualizarRegistro);

    // DELETE /api/registros/:id - Eliminar registro
    router.delete('/:id', registrosController.eliminarRegistro);

    module.exports = router;
    ```

*   **Explicación de los Endpoints:**
    *   `POST /api/registros`: Se usa para **crear** un nuevo registro diario.
    *   `GET /api/registros`: Obtiene **todos** los registros de un usuario.
    *   `GET /api/registros/:fecha`: Obtiene el registro de un día **específico**.
    *   `PUT /api/registros/:id`: Ruta clave para la **edición** de un registro existente.
    *   `DELETE /api/registros/:id`: Permite **eliminar** un registro completo.

## 3. Funciones de Creación, Edición y Eliminación

El archivo `registrosController.js` responde a las peticiones que llegan desde las rutas y realiza las operaciones en la base de datos.

### a) Creación y Actualización (`crearRegistro` y `actualizarRegistro`)

La función `crearRegistro` es "inteligente": si intentas crear un registro para una fecha que ya tiene uno, en lugar de dar un error, lo actualiza.

*   **Código del Controlador (`crearRegistro`):**
    ```javascript
    exports.crearRegistro = async (req, res) => {
      try {
        const { fecha_registro, modulos } = req.body;
        const usuario_id = req.userId;
        // ... (cálculo de IMC) ...

        // Verificar si ya existe un registro para esta fecha
        const registroExistente = await RegistroDiario.findOne({
          usuario_id,
          fecha_registro: { /* ...rango de fecha... */ }
        });

        if (registroExistente) {
          // Si existe, lo actualiza
          registroExistente.modulos = modulos;
          await registroExistente.save();
          return res.json(registroExistente);
        }

        // Si no existe, crea uno nuevo
        const nuevoRegistro = new RegistroDiario({ /* ...datos... */ });
        await nuevoRegistro.save();
        res.status(201).json(nuevoRegistro);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    };
    ```
*   **Flujo de Edición:**
    1.  El usuario modifica un dato en el frontend.
    2.  El frontend empaqueta todo el objeto `modulos` y lo envía con una petición `PUT` a `/api/registros/:id`.
    3.  La función `actualizarRegistro` en el backend recibe los datos y usa `RegistroDiario.findOneAndUpdate()` para actualizar el registro en la base de datos.
    4.  Devuelve el registro actualizado al frontend.

### b) Eliminación (`eliminarRegistro`)

Esta función busca un registro por su ID y lo borra.

*   **Código del Controlador (`eliminarRegistro`):**
    ```javascript
    exports.eliminarRegistro = async (req, res) => {
      try {
        const usuario_id = req.userId;
        const { id } = req.params;

        const registro = await RegistroDiario.findOneAndDelete({
          _id: id,
          usuario_id
        });

        if (!registro) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }

        res.json({ message: 'Registro eliminado exitosamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    ```
*   **Flujo de Eliminación:**
    1.  El usuario hace clic en "Eliminar" en el frontend.
    2.  El frontend envía una petición `DELETE` a `/api/registros/:id`.
    3.  El backend busca y elimina el registro si pertenece al usuario.
    4.  El frontend recibe una confirmación y actualiza la interfaz.

## 4. Conexión Frontend-Backend: `api.js`

El archivo `frontend/src/utils/api.js` traduce las acciones del usuario a peticiones que el backend puede entender, usando `axios`.

*   **Código de `api.js` (Funciones de Registros):**
    ```javascript
    // Registros diarios
    export const crearRegistro = async (fecha_registro, modulos) => {
      const response = await axios.post(
        `${API_URL}/registros`,
        { fecha_registro, modulos },
        { headers: getAuthHeader() }
      );
      return response.data;
    };

    export const actualizarRegistro = async (registroId, modulos) => {
      const response = await axios.put(
        `${API_URL}/registros/${registroId}`,
        { modulos },
        { headers: getAuthHeader() }
      );
      return response.data;
    };

    export const eliminarRegistro = async (registroId) => {
      const response = await axios.delete(`${API_URL}/registros/${registroId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    };
    ```

### Descubrimiento: Endpoints Dedicados para Citas

Además de los endpoints de registros, existe un sistema más avanzado para gestionar citas a través de `/api/citas`.

*   **Código de `api.js` (Funciones de Citas):**
    ```javascript
    // Gestión de Citas
    export const obtenerCitas = async (fechaInicio, fechaFin, filtros = {}) => {
      const response = await axios.get(`${API_URL}/citas`, { /* ... */ });
      return response.data;
    };

    export const crearCita = async (citaData) => {
      const response = await axios.post(`${API_URL}/citas`, citaData, { /* ... */ });
      return response.data;
    };

    export const actualizarCita = async (id, citaData) => {
      const response = await axios.put(`${API_URL}/citas/${id}`, citaData, { /* ... */ });
      return response.data;
    };

    export const eliminarCita = async (id) => {
      const response = await axios.delete(`${API_URL}/citas/${id}`, { /* ... */ });
      return response.data;
    };
    ```

## 5. El Flujo de Entrada de Datos: `Dashboard.js` y `ReflectionModal.js`

El sistema utiliza un enfoque proactivo para solicitar al usuario su registro diario.

### a) El `Dashboard` como Punto de Partida

El `Dashboard` muestra un resumen del bienestar y es el centro de navegación. No contiene el formulario directamente, pero invoca a un modal cuando es necesario.

*   **Flujo de Interacción:**
    1.  El usuario llega al `Dashboard`.
    2.  La página llama a `verificarReflexion()`.
    3.  Si el backend indica que se necesita un registro, se muestra el componente `ReflectionModal`.

### b) Propósito Real de `ReflectionModal.js`

Este componente **no es un formulario**, sino una ventana motivacional que aparece cuando un usuario ha pasado varios días sin hacer un registro, animándolo a retomar el hábito.

*   **Código de `ReflectionModal.js`:**
    ```javascript
    const ReflectionModal = ({ onClose, diasSinRegistro }) => {
      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" /* ... */>
            <h2>💭 Momento de Reflexión</h2>
            <p>Han pasado {diasSinRegistro} días desde tu último registro.</p>
            <h3>Sugerencias para retomar el hábito:</h3>
            <ul>
              <li>📱 Configura una alarma diaria como recordatorio</li>
              {/* ... más sugerencias ... */}
            </ul>
            <button className="btn-close" onClick={onClose}>Entendido</button>
          </div>
        </div>
      );
    };
    ```

## 6. El Formulario de Registro en `CalendarPage.js`

`CalendarPage.js` es el verdadero centro de operaciones para la gestión de los registros diarios.

### a) Estructura y Estado del Formulario

La página utiliza `useState` para mantener el estado de todo el formulario en un objeto `formData` que refleja el modelo del backend.

*   **Código del Estado del Formulario (`CalendarPage.js`):**
    ```javascript
    const [formData, setFormData] = useState({
      cardiovascular: { /* ... */ },
      sueno: { /* ... */ },
      // ...
      medicacion: [
        { medicamento_id: '', dosis_tomada: false, hora_registro: '' }
      ],
      citas: [
        { fecha_cita: '', medico_especialidad: '', motivo: '', recordatorio_activo: false }
      ],
      estado_emocional_dia: ''
    });
    ```

### b) Agregación Dinámica de Medicamentos y Citas

El formulario permite al usuario añadir y quitar campos de medicación y citas dinámicamente.

*   **Código del Formulario (Sección de Medicación):**
    ```javascript
    <div className="form-section">
      <h3>💊 Medicación</h3>
      {(formData.medicacion || []).map((m, idx) => (
        <div key={idx} className="form-row" /* ... */>
          <input type="text" placeholder="Medicamento" /* ... */ />
          <input type="time" placeholder="Hora" /* ... */ />
          <label>
            <input type="checkbox" /* ... */ />
            <span>Dosis tomada</span>
          </label>
          <button type="button" onClick={() => /* ...eliminar... */}>
            Eliminar
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setFormData(prev => ({
          ...prev,
          medicacion: [...(prev.medicacion || []), { /* nuevo objeto vacío */ }]
        }))}
      >
        + Agregar medicamento
      </button>
    </div>
    ```
*   **Flujo de Interacción en el Formulario:**
    1.  El formulario usa `.map()` para renderizar una fila por cada entrada en los arrays `formData.medicacion` y `formData.citas`.
    2.  El botón **"+ Agregar"** añade un nuevo objeto al array en el estado, renderizando una nueva fila.
    3.  El botón **"Eliminar"** quita el elemento del array, eliminando la fila.

### c) Flujo Completo de Edición y Eliminación
1.  **Selección de Fecha:** El usuario hace clic en un día del calendario.
2.  **Carga de Datos:** Se llama a `obtenerRegistroPorFecha(fecha)`. Si existe un registro, se carga en el formulario y se muestran los botones "Editar" y "Eliminar". Si no, se muestra el botón "Registrar Datos".
3.  **Edición:** Al hacer clic en "Editar", se muestra el formulario poblado. Al guardar, se llama a `actualizarRegistro(id, formData)`.
4.  **Eliminación:** Al hacer clic en "Eliminar" y confirmar, se llama a `eliminarRegistro(id)`.

## 7. Nueva Pantalla: `CitasPage.js`

Esta pantalla actúa como un "centro de control" de solo lectura para visualizar y buscar todas las citas médicas.

*   **Propósito:** Ofrecer una vista consolidada y con capacidad de búsqueda de todas las citas médicas registradas.
*   **Funcionalidades:**
    *   **Listado Centralizado:** Reúne las citas de todos los registros diarios en una única lista.
    *   **Búsqueda:** Permite buscar por médico, especialidad o motivo.
    *   **Filtro por Fechas:** Permite acotar la lista a un rango de fechas.
    *   **Vista de Solo Lectura:** No permite editar ni crear citas. Para ello, el usuario debe ir al Calendario.

## 8. Nueva Pantalla: `MedicacionPage.js`

Similar a la de Citas, esta pantalla se especializa en visualizar y filtrar el historial de medicación.

*   **Propósito:** Centralizar en una sola lista todos los registros de tomas de medicamentos para ver la adherencia al tratamiento.
*   **Funcionalidades:**
    *   Reúne todas las tomas de medicamentos en una lista cronológica.
    *   Permite filtrar por rango de fechas.
    *   Muestra la fecha, hora, nombre del medicamento y si la dosis fue tomada.
    *   Es una vista de solo lectura.

## 9. Nueva Funcionalidad: `NotesBookPage.js` (El Libro de Notas)

Esta pantalla consolida todas las "Notas sobre el sueño" que el usuario ha registrado.

*   **Propósito:** Crear un diario cronológico de las reflexiones del usuario sobre su descanso.
*   **Endpoint Específico:** Utiliza un endpoint dedicado, `GET /api/notas`, para recopilar esta información.
*   **Funcionalidad:**
    *   Llama al endpoint para traer todas las notas de sueño del usuario.
    *   Presenta las notas en una lista ordenada por fecha.
    *   Es una vista de solo lectura; las notas se añaden y editan en la página del Calendario.

## Resumen General

El sistema ha sido expandido con robustas funcionalidades para el seguimiento de la salud. La `CalendarPage` sirve como el núcleo para la entrada y modificación de datos diarios, incluyendo módulos dinámicos para citas y medicación. Las nuevas pantallas (`CitasPage`, `MedicacionPage`, `NotesBookPage`) actúan como vistas especializadas y de solo lectura que permiten al usuario consultar y filtrar su historial de forma eficiente, mejorando significativamente la usabilidad y el análisis de datos personales de salud.
