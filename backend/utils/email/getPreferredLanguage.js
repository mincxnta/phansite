/**
 * Obtiene el código del idioma preferido a partir del header 'Accept-Language'.
 * Si no se proporciona el header, devuelve 'en' por defecto.
 *
 * @param {string | undefined} acceptLanguageHeader - El valor del header 'Accept-Language'.
 * @returns {string} Código del idioma preferido en formato ISO.
 */
export const getPreferredLanguage = (acceptLanguageHeader) => {
  if (!acceptLanguageHeader) {
    return 'en'
  }

  const primaryLanguage = acceptLanguageHeader.split(',')[0].split('-')[0].toLowerCase()

  return primaryLanguage
}
