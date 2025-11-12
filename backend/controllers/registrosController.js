const RegistroDiario = require('../models/RegistroDiario');

// Crear o actualizar registro diario
exports.crearRegistro = async (req, res) => {
  try {
    const { fecha_registro, modulos } = req.body;
    const usuario_id = req.userId;

    // Calcular IMC si hay datos de peso
    if (modulos?.peso?.peso_kg) {
      // Asegurar que hay altura, usar default si no se proporciona
      if (!modulos.peso.altura_m) {
        modulos.peso.altura_m = 1.70;
      }
      const altura = modulos.peso.altura_m;
      modulos.peso.imc = parseFloat((modulos.peso.peso_kg / (altura * altura)).toFixed(2));
    }

    // Verificar si ya existe un registro para esta fecha usando rangos amplios
    // Usar rango completo del día en UTC para capturar el registro sin importar la hora
    const fechaInicio = new Date(fecha_registro + 'T00:00:00.000Z');
    const fechaFin = new Date(fecha_registro + 'T23:59:59.999Z');
    
    const registroExistente = await RegistroDiario.findOne({
      usuario_id,
      fecha_registro: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    });

    if (registroExistente) {
      // Actualizar registro existente
      registroExistente.modulos = modulos;
      await registroExistente.save();
      return res.json(registroExistente);
    }

    // Crear nuevo registro con fecha UTC explícita para evitar problemas de zona horaria
    const nuevoRegistro = new RegistroDiario({
      usuario_id,
      fecha_registro: new Date(fecha_registro + 'T12:00:00.000Z'),
      modulos
    });

    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener registros del usuario
exports.obtenerRegistros = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { fechaInicio, fechaFin } = req.query;

    let query = { usuario_id };

    if (fechaInicio || fechaFin) {
      query.fecha_registro = {};
      if (fechaInicio) query.fecha_registro.$gte = new Date(fechaInicio);
      if (fechaFin) query.fecha_registro.$lte = new Date(fechaFin);
    }

    const registros = await RegistroDiario.find(query).sort({ fecha_registro: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener registro por fecha específica
exports.obtenerRegistroPorFecha = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { fecha } = req.params;

    // Usar rangos de fecha para evitar problemas de zona horaria
    const fechaInicio = new Date(fecha + 'T00:00:00.000Z');
    const fechaFin = new Date(fecha + 'T23:59:59.999Z');

    const registro = await RegistroDiario.findOne({
      usuario_id,
      fecha_registro: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    });

    if (!registro) {
      return res.status(404).json({ message: 'No hay registro para esta fecha' });
    }

    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar registro
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

// Actualizar un registro existente
exports.actualizarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const { modulos } = req.body;
    const usuario_id = req.userId;

    // Calcular IMC si hay datos de peso
    if (modulos?.peso?.peso_kg) {
      // Asegurar que hay altura, usar default si no se proporciona
      if (!modulos.peso.altura_m) {
        modulos.peso.altura_m = 1.70;
      }
      const altura = modulos.peso.altura_m;
      modulos.peso.imc = parseFloat((modulos.peso.peso_kg / (altura * altura)).toFixed(2));
    }

    const registroActualizado = await RegistroDiario.findOneAndUpdate(
      { _id: id, usuario_id },
      { $set: { modulos } },
      { new: true } // Devuelve el documento actualizado
    );

    if (!registroActualizado) {
      return res.status(404).json({ message: 'Registro no encontrado o no tienes permiso para editarlo.' });
    }

    res.json(registroActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las notas de sueño
exports.obtenerNotas = async (req, res) => {
  try {
    const usuario_id = req.userId;

    // Buscar registros que tengan el campo de notas de sueño no vacío
    const registrosConNotas = await RegistroDiario.find({
      usuario_id,
      'modulos.sueno.notas_sueno': { $exists: true, $ne: '' }
    }).sort({ fecha_registro: -1 });

    // Mapear los resultados al formato esperado por el frontend
    const notas = registrosConNotas.map(registro => ({
      fecha: registro.fecha_registro,
      nota: registro.modulos.sueno.notas_sueno
    }));

    res.json(notas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

