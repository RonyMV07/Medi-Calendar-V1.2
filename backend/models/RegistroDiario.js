const mongoose = require('mongoose');

const registroDiarioSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fecha_registro: {
    type: Date,
    required: true,
    index: true, // Añadido para optimizar búsquedas por fecha, como se sugiere en Tarea 3.2
  },
  modulos: {
    cardiovascular: {
      presion_sistolica: Number,
      presion_diastolica: Number,
      frecuencia_cardiaca: Number,
    },
    sueno: {
      duracion_horas: Number,
      calidad_percibida: { type: Number, min: 1, max: 5 },
      notas_sueno: String,
      usa_medicacion: { type: Boolean, default: false },
      medicamento_sueno: { 
        type: String, 
        trim: true,
        validate: {
          validator: function(v) {
            // Si usa_medicacion es true, medicamento_sueno debe tener valor
            if (this.parent().usa_medicacion && (!v || v.trim() === '')) {
              return false;
            }
            return true;
          },
          message: 'Medicamento es requerido cuando se indica uso de medicación'
        }
      },
      hora_medicamento_sueno: { 
        type: String,
        validate: {
          validator: function(v) {
            // Si usa_medicacion es true, hora_medicamento_sueno debe tener valor
            if (this.parent().usa_medicacion && !v) {
              return false;
            }
            return true;
          },
          message: 'Hora del medicamento es requerida cuando se indica uso de medicación'
        }
      },
    },
    ejercicios: {
      tipo_actividad: String,
      duracion_min: Number,
      esfuerzo_percibido: { type: Number, min: 1, max: 10 },
    },
    peso: {
      peso_kg: Number,
      imc: Number, // Calculado automáticamente en el backend
      objetivo_peso: Number,
      altura_m: { 
        type: Number, 
        min: 0.5, 
        max: 2.5, 
        default: 1.70 
      },
    },
    // El módulo de medicación general se mantiene como un array de objetos
    medicacion: [{
      medicamento_id: String, // Podría ser un ObjectId de un modelo de Medicamento
      dosis_tomada: Boolean,
      hora_registro: Date,
    }],
    citas: [{
      fecha_cita: Date,
      medico_especialidad: String,
      motivo: String,
      recordatorio_activo: Boolean, // Se mantiene por si es de utilidad básica
    }],
  },
  estado_emocional_dia: String,
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Middleware pre-save para calcular IMC automáticamente
registroDiarioSchema.pre('save', function(next) {
  if (this.modulos?.peso?.peso_kg && this.modulos?.peso?.altura_m) {
    const peso = this.modulos.peso.peso_kg;
    const altura = this.modulos.peso.altura_m;
    this.modulos.peso.imc = parseFloat((peso / (altura * altura)).toFixed(2));
  }
  next();
});

// Asegurarse de que no haya duplicados por usuario y fecha
registroDiarioSchema.index({ usuario_id: 1, fecha_registro: 1 }, { unique: true });

module.exports = mongoose.model('RegistroDiario', registroDiarioSchema);