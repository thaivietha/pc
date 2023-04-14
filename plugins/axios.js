import {
    Message
} from "element-ui";
import {
    config,
    version
} from "@/config/app";
// import {
//     I18N
// } from '../config/i18n'

export default function ({
    $axios,
    redirect,
    store
}, inject) {
    $axios.setBaseURL(`${config.baseUrl}/shopapi/`);
    $axios.onRequest((config) => {
        config.params = config.params || {};
        let locale = sessionStorage.getItem('languageLocale') || navigator.language || navigator.userLanguage
        locale = locale.substr(0, 2).toLowerCase();
        config.params.lang = locale;
        config.headers.token = store.state.token;
        config.headers.version = version;
        // config.headers.lang = locale
    });
    $axios.onResponse((response) => {
        const {
            code,
            show,
            msg
        } = response.data;
        if (code == 0 && show && msg) {
            Message({
                message: msg,
                type: "error",
            });
        } else if (code == -1) {
            Message({
                message: msg,
                type: "error",
            });

            store.commit("logout");
            redirect("/account/login");
        }
    });
    $axios.onError((error) => {
        const code = parseInt(error.response && error.response.status);
        if (code === 400) {
            redirect("/404");
        } else if (code === 500) {
            redirect("/500");
        }
    });
    inject("get", $axios.$get);
    inject("post", $axios.$post);
}
