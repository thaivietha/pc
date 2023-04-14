export const getLocale = () => {
    let locale = sessionStorage.getItem('languageLocale') || (navigator.language || navigator.userLanguage);
    return locale
}
