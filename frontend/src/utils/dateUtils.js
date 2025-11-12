// Utilidades para manejo consistente de fechas y evitar problemas de zona horaria

/**
 * Convierte una fecha del servidor (UTC) a formato YYYY-MM-DD usando componentes UTC
 * Esto evita que la zona horaria local afecte la visualización
 */
export const formatDateFromServer = (dateString) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Normaliza una fecha para comparación, extrayendo solo año, mes y día en UTC
 */
export const normalizeDateForComparison = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

/**
 * Compara dos fechas ignorando la hora y zona horaria
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};
