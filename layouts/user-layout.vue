<template>
  <div>
    <template v-if="$store.state.publicData.shop.pc_status">
      <div class="default-layout flex-col" v-if="loadingPage">
        <v-header></v-header>
        <main class="content-container flex flex-1">
          <aslide-nav />
          <div class="content bg-white flex-1 m-l-10">
            <nuxt />
          </div>
        </main>
        <v-footer></v-footer>
        <float-nav></float-nav>
      </div>
    </template>
    <template v-else>
      <div class="default-layout flex row-center muted xxl">
        {{ $t("商城已关闭") }}
      </div>
    </template>
  </div>
</template>
<script>
import VHeader from "~/components/widgets/header/index";
import VFooter from "~/components/widgets/footer";
import AslideNav from "~/components/layout/aslideNav";
import FloatNav from "~/components/widgets/fixed";
import getI18n from "~/mixins/lang";
import { mapMutations, mapState } from "vuex";

export default {
  components: {
    VHeader,
    VFooter,
    AslideNav,
    FloatNav,
  },
  data() {
    return {
      loadingPage: false,
    };
  },
  created() {},
  watch: {
    $route: {
      immediate: true,
      handler: function (val) {
        let _this = this;
        this.$i18n.locale = this.langLocale;
        _this.loadingPage = true;
      },
    },
  },
  mounted() {},
  methods: {
    ...mapMutations(["setlangLocale"]),
  },
  computed: {
    ...mapState(["publicData", "langLocale"]),
  },
};
</script>
<style scoped>
.default-layout {
  min-height: 100vh;
}
.content-container {
  padding: 24px 0;
  width: 1180px;
  margin: 0 auto;
  align-items: flex-start;
}
.content-container > .content {
  width: 100%;
  min-height: 680px;
}
</style>
