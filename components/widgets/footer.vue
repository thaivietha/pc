<template>
  <footer class="footer-container" v-if="footer.show">
    <div class="footer-tags flex">
      <div
        class="tags-item flex flex-1 row-center"
        v-for="(item, index) in footer.content.data"
        :key="index"
      >
        <img class="tags-img" :src="$getImageUri(item.url)" alt="" />
        <div class="m-l-10 xxl">{{ item.name }}</div>
      </div>
    </div>
    <div class="copyright flex row-center">
      <a class="white xs" target="_blank" :href="shop.record_system_link"
        >{{ shop.copyright }} {{ shop.record_number }}</a
      >
    </div>
  </footer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState(["publicData"]),
    shop() {
      return this.publicData.shop || {};
    },
    footer() {
      return this.publicData.decoration.footer || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.footer-container {
  background-color: #101010;
  color: #ccc;
  min-width: 1180px;
  .footer-tags {
    width: 1180px;
    margin: 0 auto;
    padding: 35px 0;
    border-bottom: 1px solid #ccc;
    .tags-img {
      width: 50px;
      height: 50px;
    }
  }
  .copyright {
    margin: 0 auto;
    width: 1180px;
    height: 60px;
    color: #ccc;
  }
}
</style>