<template>
  <div>
    <template v-if="$store.state.publicData.shop.pc_status">
      <div class="default-layout flex-col" v-if="loadingPage">
        <v-header></v-header>
        <main class="content-container wrapper1180 flex-1">
          <nuxt />
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
import FloatNav from "~/components/widgets/fixed";
import getI18n from "~/mixins/lang";
import { mapMutations } from "vuex";
export default {
  components: {
    VHeader,
    VFooter,
    FloatNav,
  },
  head() {
    return this.$nuxtI18nHead();
  },
  data() {
    return {
      loadingPage: false,
    };
  },
  created() {},
  mounted() {
    this.loadingPage = true;
  },
  methods: {
    ...mapMutations(["setlangLocale"]),
  },
};
</script>
<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  main {
    padding-bottom: 38px;
  }
}
</style>
