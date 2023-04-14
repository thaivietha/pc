<template>
  <div>
    <template v-if="$store.state.publicData.shop.pc_status">
      <div class="default-layout flex-col">
        <nuxt-link class="default-header" to="/" v-if="publicData.shop.logo">
          <img class="header-logo" :src="publicData.shop.logo" />
        </nuxt-link>
        <div class="default-main flex-1">
          <nuxt />
        </div>
        <v-footer />
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
import VFooter from "~/components/layout/footer_login";
import { mapState, mapMutations } from "vuex";

import getI18n from "~/mixins/lang";
export default {
  components: {
    VFooter,
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapState(["publicData"]),
  },
  methods: {
    ...mapMutations(["setlangLocale"]),
  },
  mounted() {
  
  },
};
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  .default-header {
    padding: 22px 0;
    background-color: white;
    min-width: 1180px;
    border-bottom: 1px solid #e5e5e5;
    .header-logo {
      margin-left: 370px;
      height: 56px;
    }
  }
  .default-main {
    display: flex;
    flex-direction: column;
  }
}
</style>
