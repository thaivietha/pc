<template>
  <div class="error404 flex-col col-center row-center">
    <div>
      <div class="font-size-30 weight-600">
        {{ $t("抱歉，您访问的页面出错了") }}
      </div>
      <div class="lg lighter m-t-30 m-b-30">
        {{ $t("你可能输错了网址。或该网页已被删除、不存在等") }}
      </div>
      <el-button type="primary" size="small" @click="$router.push('/')"
        >{{ second }} {{ $t("秒后返回首页") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import getI18n from "~/mixins/lang";
import { mapMutations } from "vuex";
export default {
  layout: "Error",

  data() {
    return {
      timer: 0,
      second: 5,
    };
  },
  created() {},
  methods: {
    ...mapMutations(["setlangLocale"]),
  },

  mounted() {
    this.timer = setInterval(() => {
      if (this.second === 0) this.$router.push("/");
      else this.second--;
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.error404 {
  text-align: center;
  height: 92vh;
  img {
    width: 232px;
  }
  .el-button {
    width: 176px;
  }
}
</style>

