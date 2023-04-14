import ms from '../lang/enms.js'
import zh from '../lang/zhcn.js'
import en from '../lang/enus.js'
import {
    state
} from '../store/index'

// import {
//     getLocale
// } from '../plugins/common'

let zhLang = 'zh';
let msLang = 'ms';
let enLang = 'en';

let defaultLocale = msLang;
const localearr = ['ms', 'zh', 'en']
export const locales = [{
        code: msLang,
        iso: 'ms',
        name: 'Malay'
    },
    {
        code: zhLang,
        iso: 'zh-CN',
        name: '中文'
    },
    {
        code: enLang,
        iso: 'en-US',
        name: 'English'
    }
];

console.log(state.langLocale)
let locale = state.langLocale || defaultLocale;
if (!locale) {
    let storage = process.BROWSER_BUILD ? sessionStorage.getItem('languageLocale') : '';
    locale = storage || defaultLocale
}

if (locale) {
    locale = locale.substr(0, 2).toLowerCase();
}
let arr = locales.filter(v => v.code == locale);
if (arr.length === 0) {
    locale = defaultLocale
}

// console.log('locale', locale)

export const I18N = {
    locales: localearr,
    defaultLocale: locale,
    // routes: {
    //   about: {
    //     fr: '/a-propos',
    //     en: '/about-us'
    //   },
    //   posts: {
    //     fr: '/articles'
    //   },
    //   'post/_id': {
    //     fr: '/article/:id?',
    //     es: '/articulo/:id?'
    //   },
    //   'dynamicNested/_category': {
    //     fr: 'imbrication-dynamique/:category'
    //   }
    // },
    vueI18n: {
        fallbackLocale: locale,
        messages: {
            ms,
            zh,
            en
        }
    }
}
