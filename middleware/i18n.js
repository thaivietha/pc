import {
    I18N
} from "~/config/i18n";
export default function (context) {
    console.log(context);
    let locale = sessionStorage.getItem('languageLocale') || (navigator.language || navigator.userLanguage);
    locale = locale.substr(0, 2).toLowerCase();
    context.i18n.locale = locale;
    context.i18n.defaultLocale = locale;
    I18N.locale = locale;
    I18N.defaultLocale = locale;
    I18N.vueI18n.fallbackLocale = locale;
}
