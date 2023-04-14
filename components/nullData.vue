<template>
  <div class="bg-white flex-col col-center null-data">
    <img :style="imgStyle" class="img-null" :src="img" alt="" />
    <div class="muted m-t-8">{{ text ||$t('暂无数据')}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    img: {
      type: String,
    },
    text: {
      type: String,
    },
    imgStyle: {
      type: String,
      default: ''
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.null-data {
  padding: 100px;
  .img-null {
    width: 150px;
    height: 150px;
  }
}
</style>