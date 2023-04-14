export default {
    head() {
        const headerMeta = this.$store.getters.headerMeta;
        return {
            title: headerMeta.title,
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: headerMeta.ico,
                },
            ],
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: headerMeta.description,
                },
                {
                    hid: "keywords",
                    name: "keywords",
                    content: headerMeta.keywords,
                },
            ],
        };
    },
};
