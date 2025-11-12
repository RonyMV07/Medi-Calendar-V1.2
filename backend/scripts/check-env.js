#!/usr/bin/env node

/**
 * Verificador de Configuración de Variables de Entorno
 * 
 * Este script verifica que las variables de entorno estén
 * correctamente configuradas antes de ejecutar la aplicación.
 * 
 * Uso:
 *   node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificador de Configuración - MediCalendar\n');
console.log('═'.repeat(60));

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

let errors = 0;
let warnings = 0;
let passed = 0;

// 1. Verificar si existe el archivo .env
console.log('\nVerificando archivos...\n');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envPath)) {
  log('   ✅ Archivo .env encontrado', 'green');
  passed++;
} else {
  log('   ❌ Archivo .env NO encontrado', 'red');
  log('      Ejecuta: cp .env.example .env', 'yellow');
  errors++;
}

if (fs.existsSync(envExamplePath)) {
  log('   ✅ Archivo .env.example encontrado', 'green');
  passed++;
} else {
  log('   ⚠️  Archivo .env.example NO encontrado', 'yellow');
  warnings++;
}

// 2. Si existe .env, cargar y verificar variables
if (fs.existsSync(envPath)) {
  console.log('\nVerificando variables de entorno...\n');
  
  require('dotenv').config({ path: envPath });
  
  // MONGODB_URI
  if (process.env.MONGODB_URI) {
    log('   ✅ MONGODB_URI configurada', 'green');
    
    if (process.env.MONGODB_URI.includes('localhost')) {
      log('      ℹ️  Usando MongoDB local', 'blue');
    } else if (process.env.MONGODB_URI.includes('mongodb+srv')) {
      log('      ℹ️  Usando MongoDB Atlas', 'blue');
    }
    
    if (process.env.MONGODB_URI.includes('<') || process.env.MONGODB_URI.includes('GENERA')) {
      log('      ⚠️  Parece contener valores de placeholder', 'yellow');
      warnings++;
    } else {
      passed++;
    }
  } else {
    log('   ❌ MONGODB_URI NO configurada', 'red');
    errors++;
  }
  
  // PORT
  if (process.env.PORT) {
    log('   ✅ PORT configurado: ' + process.env.PORT, 'green');
    passed++;
  } else {
    log('   ⚠️  PORT no configurado (usará default: 5000)', 'yellow');
    warnings++;
  }
  
  // JWT_SECRET
  if (process.env.JWT_SECRET) {
    const secretLength = process.env.JWT_SECRET.length;
    
    if (secretLength >= 64) {
      log(`   ✅ JWT_SECRET configurado (${secretLength} caracteres - Excelente)`, 'green');
      passed++;
    } else if (secretLength >= 32) {
      log(`   ⚠️  JWT_SECRET configurado (${secretLength} caracteres - Aceptable)`, 'yellow');
      log('      Se recomienda usar al menos 64 caracteres', 'yellow');
      warnings++;
    } else {
      log(`   ❌ JWT_SECRET MUY DÉBIL (${secretLength} caracteres)`, 'red');
      log('      Se requieren al menos 32 caracteres', 'red');
      errors++;
    }
    
    // Verificar si es un valor de ejemplo/inseguro
    const insecureValues = [
      'secret',
      'secret123',
      'mysecret',
      'GENERA_UNA_CLAVE',
      'tu_clave_secreta',
      'cambiar_en_produccion'
    ];
    
    const isInsecure = insecureValues.some(val => 
      process.env.JWT_SECRET.toLowerCase().includes(val.toLowerCase())
    );
    
    if (isInsecure) {
      log('   ❌ JWT_SECRET contiene valores inseguros de ejemplo', 'red');
      log('      Genera una clave segura con: node scripts/generate-secret.js', 'yellow');
      errors++;
    }
  } else {
    log('   ❌ JWT_SECRET NO configurado', 'red');
    log('      Genera una con: node scripts/generate-secret.js', 'yellow');
    errors++;
  }
  
  // NODE_ENV
  if (process.env.NODE_ENV) {
    log('   ✅ NODE_ENV configurado: ' + process.env.NODE_ENV, 'green');
    passed++;
    
    if (process.env.NODE_ENV === 'production' && 
        process.env.JWT_SECRET && 
        process.env.JWT_SECRET.length < 64) {
      log('      ⚠️  En producción se recomienda JWT_SECRET de 64+ caracteres', 'yellow');
      warnings++;
    }
  } else {
    log('   ℹ️  NODE_ENV no configurado (opcional)', 'blue');
  }
}

// 3. Verificar .gitignore
console.log('\nVerificando seguridad...\n');

const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  if (gitignoreContent.includes('.env')) {
    log('   ✅ .env protegido en .gitignore', 'green');
    passed++;
  } else {
    log('   ❌ .env NO está en .gitignore', 'red');
    log('      ¡PELIGRO! El archivo .env podría subirse a Git', 'red');
    errors++;
  }
  
  if (gitignoreContent.includes('*.key') || gitignoreContent.includes('*.pem')) {
    log('   ✅ Certificados y claves protegidos', 'green');
    passed++;
  } else {
    log('   ⚠️  Certificados no están explícitamente en .gitignore', 'yellow');
    warnings++;
  }
} else {
  log('   ❌ .gitignore NO encontrado', 'red');
  errors++;
}

// 4. Verificar que node_modules esté instalado
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  log('   ✅ node_modules instalado', 'green');
  passed++;
} else {
  log('   ⚠️  node_modules no encontrado', 'yellow');
  log('      Ejecuta: npm install', 'yellow');
  warnings++;
}

// 5. Resumen final
console.log('\n' + '═'.repeat(60));
console.log('\n📊 Resumen de Verificación:\n');

log(`   ✅ Verificaciones exitosas: ${passed}`, 'green');
if (warnings > 0) {
  log(`   ⚠️  Advertencias: ${warnings}`, 'yellow');
}
if (errors > 0) {
  log(`   ❌ Errores críticos: ${errors}`, 'red');
}

console.log('\n' + '═'.repeat(60));

// Conclusión
if (errors === 0 && warnings === 0) {
  log('\n🎉 ¡Perfecto! La configuración está completamente lista.\n', 'green');
  process.exit(0);
} else if (errors === 0) {
  log('\n✅ La configuración es funcional pero hay advertencias.\n', 'yellow');
  log('   Revisa las advertencias arriba para mejorar la seguridad.\n', 'yellow');
  process.exit(0);
} else {
  log('\n❌ Se encontraron errores críticos.\n', 'red');
  log('   Corrige los errores antes de ejecutar la aplicación.\n', 'red');
  log('💡 Ayuda rápida:', 'blue');
  log('   • Crear .env:          cp .env.example .env', 'blue');
  log('   • Generar JWT_SECRET:  node scripts/generate-secret.js', 'blue');
  log('   • Ver guía completa:   cat SECURITY.md\n', 'blue');
  process.exit(1);
}
