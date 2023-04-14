export default function () {

    let locale = sessionStorage.getItem("languageLocale") ||
        navigator.language ||
        navigator.userLanguage
    locale = locale.substr(0, 2).toLowerCase();
    // sessionStorage.setItem("languageLocale", locale);
    return locale;
}
