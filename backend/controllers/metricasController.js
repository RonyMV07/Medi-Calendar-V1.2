const RegistroDiario = require('../models/RegistroDiario');

// Obtener evolución de métricas
exports.obtenerEvolucion = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { fechaInicio, fechaFin, tipo } = req.query;

    let query = { usuario_id };
    
    if (fechaInicio || fechaFin) {
      query.fecha_registro = {};
      if (fechaInicio) query.fecha_registro.$gte = new Date(fechaInicio);
      if (fechaFin) query.fecha_registro.$lte = new Date(fechaFin);
    }

    const registros = await RegistroDiario.find(query).sort({ fecha_registro: 1 });

    let evolucion = [];

    switch(tipo) {
      case 'peso':
        evolucion = registros
          .filter(r => r.modulos?.peso?.peso_kg)
          .map(r => ({
            fecha: r.fecha_registro,
            valor: r.modulos.peso.peso_kg,
            imc: r.modulos.peso.imc
          }));
        break;
      
      case 'cardiovascular':
        evolucion = registros
          .filter(r => r.modulos?.cardiovascular)
          .map(r => ({
            fecha: r.fecha_registro,
            sistolica: r.modulos.cardiovascular.presion_sistolica,
            diastolica: r.modulos.cardiovascular.presion_diastolica,
            frecuencia: r.modulos.cardiovascular.frecuencia_cardiaca
          }));
        break;
      
      case 'sueno':
        evolucion = registros
          .filter(r => r.modulos?.sueno?.duracion_horas)
          .map(r => ({
            fecha: r.fecha_registro,
            duracion: r.modulos.sueno.duracion_horas,
            calidad: r.modulos.sueno.calidad_percibida
          }));
        break;
      
      case 'ejercicio':
        evolucion = registros
          .filter(r => r.modulos?.ejercicios?.duracion_min)
          .map(r => ({
            fecha: r.fecha_registro,
            duracion: r.modulos.ejercicios.duracion_min,
            tipo: r.modulos.ejercicios.tipo_actividad,
            esfuerzo: r.modulos.ejercicios.esfuerzo_percibido
          }));
        break;
      
      default:
        evolucion = registros.map(r => ({
          fecha: r.fecha_registro,
          modulos: r.modulos
        }));
    }

    res.json(evolucion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calcular índice de bienestar
exports.calcularIndiceBienestar = async (req, res) => {
  try {
    const usuario_id = req.userId;
    
    // Obtener últimos 30 días
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 30);

    const registros = await RegistroDiario.find({
      usuario_id,
      fecha_registro: { $gte: fechaInicio }
    });

    if (registros.length === 0) {
      return res.json({ 
        indice: 0, 
        mensaje: 'No hay datos suficientes. ¡Comienza a registrar tus datos!' 
      });
    }

    // Calcular consistencia (% de días con registro)
    const consistencia = (registros.length / 30) * 100;

    // Calcular adherencia a medicación
    let dosisTotales = 0;
    let dosisCompletadas = 0;
    
    registros.forEach(r => {
      if (r.modulos?.medicacion) {
        r.modulos.medicacion.forEach(med => {
          dosisTotales++;
          if (med.dosis_tomada) dosisCompletadas++;
        });
      }
    });

    const adherenciaMedicacion = dosisTotales > 0 ? (dosisCompletadas / dosisTotales) * 100 : 100;

    // Calcular promedio de calidad de sueño
    const registrosSueno = registros.filter(r => r.modulos?.sueno?.calidad_percibida);
    const promedioSueno = registrosSueno.length > 0
      ? registrosSueno.reduce((sum, r) => sum + r.modulos.sueno.calidad_percibida, 0) / registrosSueno.length
      : 0;

    // Calcular índice de bienestar (promedio ponderado)
    const indiceBienestar = (
      (consistencia * 0.4) +
      (adherenciaMedicacion * 0.3) +
      (promedioSueno * 20 * 0.3)
    ).toFixed(1);

    res.json({
      indice: parseFloat(indiceBienestar),
      consistencia: consistencia.toFixed(1),
      adherenciaMedicacion: adherenciaMedicacion.toFixed(1),
      calidadSueno: (promedioSueno * 20).toFixed(1),
      totalRegistros: registros.length,
      mensaje: indiceBienestar > 70 ? '¡Excelente trabajo!' : 
               indiceBienestar > 50 ? 'Vas por buen camino' : 
               'Cada día cuenta, sigue adelante'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verificar días sin registro (para reflexión)
exports.verificarDiasSinRegistro = async (req, res) => {
  try {
    const usuario_id = req.userId;
    
    const ultimoRegistro = await RegistroDiario.findOne({ usuario_id })
      .sort({ fecha_registro: -1 });

    if (!ultimoRegistro) {
      return res.json({ diasSinRegistro: 0, necesitaReflexion: false });
    }

    const hoy = new Date();
    const fechaUltimoRegistro = new Date(ultimoRegistro.fecha_registro);
    const diasSinRegistro = Math.floor((hoy - fechaUltimoRegistro) / (1000 * 60 * 60 * 24));

    res.json({
      diasSinRegistro,
      necesitaReflexion: diasSinRegistro > 3,
      mensaje: diasSinRegistro > 3 ? 
        'Es normal tener días difíciles. ¿Qué te ha impedido registrar tus datos?' :
        '¡Sigue así! Mantén la consistencia.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las notas de los registros
exports.obtenerNotas = async (req, res) => {
  try {
    const usuario_id = req.userId;

    const notas = await RegistroDiario.find({
      usuario_id,
      'modulos.sueno.notas_sueno': { $exists: true, $ne: '' } // Solo registros con notas de sueño
    })
    .select('fecha_registro modulos.sueno.notas_sueno') // Proyección para eficiencia
    .sort({ fecha_registro: -1 });

    const resultado = notas.map(n => ({
      fecha: n.fecha_registro,
      nota: n.modulos.sueno.notas_sueno
    }));

    res.json(resultado);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
