export const getPreferredLanguage = (acceptLanguageHeader) => {
  if (!acceptLanguageHeader) {
    return 'en'
  }

  const primaryLanguage = acceptLanguageHeader.split(',')[0].split('-')[0].toLowerCase()

  return primaryLanguage
}
