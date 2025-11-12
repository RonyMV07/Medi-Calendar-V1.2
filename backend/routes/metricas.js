const express = require('express');
const router = express.Router();
const metricasController = require('../controllers/metricasController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// GET /api/metricas/evolucion - Obtener evolución de métricas
router.get('/evolucion', metricasController.obtenerEvolucion);

// GET /api/metricas/bienestar - Calcular índice de bienestar
router.get('/bienestar', metricasController.calcularIndiceBienestar);

// GET /api/metricas/reflexion - Verificar días sin registro
router.get('/reflexion', metricasController.verificarDiasSinRegistro);

// GET /api/metricas/notas - Obtener todas las notas de sueño
router.get('/notas', metricasController.obtenerNotas);

module.exports = router;
