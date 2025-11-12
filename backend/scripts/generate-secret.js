#!/usr/bin/env node

/**
 * Generador de Claves Secretas Seguras
 * 
 * Este script genera claves secretas criptográficamente seguras
 * para usar como JWT_SECRET u otras claves de seguridad.
 * 
 * Uso:
 *   node scripts/generate-secret.js
 *   node scripts/generate-secret.js --length 128
 */

const crypto = require('crypto');

// Parsear argumentos de línea de comandos
const args = process.argv.slice(2);
let length = 64;

// Buscar argumento --length
const lengthIndex = args.indexOf('--length');
if (lengthIndex !== -1 && args[lengthIndex + 1]) {
  const customLength = parseInt(args[lengthIndex + 1]);
  if (!isNaN(customLength) && customLength > 0) {
    length = customLength;
  }
}

console.log('\nGenerador de Claves Secretas Seguras\n');
console.log('═'.repeat(60));
console.log('\nLongitud:', length, 'bytes (', length * 8, 'bits )');
console.log('\nClaves Generadas:\n');

// Generar clave en formato hexadecimal
const hexKey = crypto.randomBytes(length).toString('hex');
console.log('1️⃣  Formato Hexadecimal (recomendado para JWT_SECRET):');
console.log('   ', hexKey);
console.log('    Longitud:', hexKey.length, 'caracteres');

// Generar clave en formato base64
const base64Key = crypto.randomBytes(length).toString('base64');
console.log('\n2️⃣  Formato Base64:');
console.log('   ', base64Key);
console.log('    Longitud:', base64Key.length, 'caracteres');

// Generar clave en formato base64url (sin caracteres especiales)
const base64urlKey = crypto.randomBytes(length)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');
console.log('\n3️⃣  Formato Base64 URL-safe:');
console.log('   ', base64urlKey);
console.log('    Longitud:', base64urlKey.length, 'caracteres');

console.log('\n═'.repeat(60));
console.log('\n✅ Recomendaciones:\n');
console.log('   • Copia una de las claves generadas arriba');
console.log('   • Pégala en tu archivo .env como JWT_SECRET');
console.log('   • NUNCA compartas estas claves por medios inseguros');
console.log('   • Usa diferentes claves para desarrollo y producción');
console.log('   • Guarda una copia segura de la clave de producción\n');

// Información adicional de seguridad
console.log('Nivel de Seguridad:\n');
if (length >= 64) {
  console.log('   ✅ Excelente - Esta clave es muy segura');
} else if (length >= 32) {
  console.log('   ⚠️  Bueno - Esta clave es adecuada para la mayoría de casos');
} else {
  console.log('   ❌ Débil - Se recomienda usar al menos 32 bytes (256 bits)');
}

console.log('\n   Entropía: ~', (length * 8).toFixed(0), 'bits');
console.log('   Posibles combinaciones: 2^', (length * 8));
console.log('\n═'.repeat(60));
console.log('\n💡 Tip: Puedes cambiar la longitud con --length:');
console.log('   node scripts/generate-secret.js --length 128\n');
