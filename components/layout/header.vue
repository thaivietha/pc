<template>
  <header>
    <div class="header-wrap">
      <div class="header-con xs">
        <div class="wrapper1180 flex row-between">
          <div class="flex" style="height: 100%">
            <div v-if="publicData.shop.name">
              {{ $t("您好，欢迎来到") }} {{ publicData.shop.name }}！
            </div>
            <template v-if="publicData.article && publicData.article.length">
              <!-- <img style="width: 16px; height: 16px; margin-right: 10px"
                                src="~/assets/images/header_notice.png" /> -->
              <client-only>
                <swiper ref="headerSwiper" :options="swiperOptions">
                  <swiper-slide
                    class="swiper-item"
                    v-for="(item, index) in publicData.article"
                    :key="index"
                  >
                    <nuxt-link
                      class="column"
                      style="height: 100%"
                      :to="'/news_list/news_list_detail?id=' + item.id"
                    >
                      <div class="line1">{{ item.title }}</div>
                    </nuxt-link>
                  </swiper-slide>
                </swiper>
              </client-only>
            </template>
          </div>
          <div class="user flex">
            <ul class="flex flex-1">
              <li v-if="publicData.my.nickname">
                <el-popover placement="bottom" trigger="hover">
                  <div class="user-nav">
                    <nuxt-link class="lighter xs item" to="/user/user_wallet">{{
                      $t("我的钱包")
                    }}</nuxt-link>
                    <nuxt-link class="lighter xs item" to="/user/coupons">
                      {{ $t("优惠券") }}({{ publicData.coupon_num }})</nuxt-link
                    >
                    <nuxt-link class="lighter xs item" to="/user/collection">{{
                      $t("我的收藏")
                    }}</nuxt-link>
                    <div class="lighter xs item" @click="onLogout">
                      {{ $t("退出登录") }}
                    </div>
                  </div>
                  <nuxt-link slot="reference" to="/user/profile">
                    {{ publicData.my.nickname }}
                    <i class="el-icon-arrow-down"></i>
                  </nuxt-link>
                </el-popover>
              </li>
              <li v-else>
                <nuxt-link to="/account/login">{{ $t("登录") }}</nuxt-link>
                ｜
                <nuxt-link to="/account/register">{{ $t("注册") }}</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/user/order">{{ $t("我的订单") }}</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/user/profile">{{ $t("个人中心") }}</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/help_center">{{ $t("帮助中心") }}</nuxt-link>
              </li>

              <li
                id="tel-phone-block"
                v-if="publicData.mnp_qr_code || publicData.oa_qr_code"
              >
                <nuxt-link to="/"
                  >{{ $t("手机端") }}
                  <i class="el-icon-arrow-down"></i>
                </nuxt-link>
                <div class="float-code flex bg-white">
                  <div
                    class="column-center bg-white"
                    v-if="publicData.mnp_qr_code"
                  >
                    <img
                      style="width: 100px; height: 100px"
                      :src="publicData.mnp_qr_code"
                      alt=""
                    />
                    <div class="lighter mt10">{{ $t("官方小程序") }}</div>
                  </div>
                  <div
                    class="column-center"
                    style="margin-left: 30px"
                    v-if="publicData.oa_qr_code"
                  >
                    <img
                      style="width: 100px; height: 100px"
                      :src="publicData.oa_qr_code"
                      alt=""
                    />
                    <div class="lighter mt10">{{ $t("公众号演示") }}</div>
                  </div>
                </div>
              </li>
              <li>
                <nuxt-link to="/">{{ $t("返回官网") }}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="header-main bg-white">
        <div class="wrapper1180">
          <div class="search-wrap flex row-between">
            <nuxt-link to="/" class="flex row-center">
              <img :src="publicData.shop.logo" class="logo" alt="logo" />
            </nuxt-link>
            <div class="flex">
              <div class="search flex">
                <input
                  type="text"
                  v-model="name"
                  :placeholder="$t('请输入要搜索的商品名称')"
                  @keyup.enter="toSearch"
                />
                <div
                  class="search-btn bg-primary white flex row-center"
                  @click="toSearch"
                >
                  {{ $t("搜索") }}
                </div>
              </div>
              <nuxt-link to="/shop_cart" class="cart primary flex row-center">
                {{ $t("我的购物车") }}({{ publicData.my.cart }})
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div class="header-nav bg-white">
        <div class="nav-wrap flex">
          <category />
          <ul class="nav flex">
            <li class="item">
              <nuxt-link to="/">{{ $t("首页") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/goods_list/1">{{ $t("热销榜单") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/goods_list/2">{{ $t("新品推荐") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/goods_list/3">{{ $t("好物优选") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/seckill">{{ $t("限时秒杀") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/get_coupons">{{ $t("领券中心") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/news_list">{{ $t("商城资讯") }}</nuxt-link>
            </li>
            <li class="item">
              <nuxt-link to="/help_center">{{ $t("帮助中心") }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import Category from "./category";
import { directive } from "vue-awesome-swiper";
import { mapState, mapMutations, mapActions } from "vuex";
import getI18n from "~/mixins/lang";

export default {
  components: {
    Category,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      name: "",
      swiperOptions: {
        direction: "vertical",
        // autoHeight: true,
        height: 40,
        initialSlide: 0,
        autoplay: true,
      },
    };
  },

  methods: {
    ...mapMutations(["logout"]),
    ...mapActions(["getPublicData"]),
    toSearch() {
      let _this = this;
      if (!this.name) return this.$message.error(_this.$t("请输入商品名称"));
      this.$router.push({
        path: "/goods_list",
        query: {
          name: this.name,
        },
      });
    },
    onLogout() {
      let _this = this;
      this.logout();
      this.$message({
        message: _this.$t("退出成功"),
        type: "success",
      });
      setTimeout(() => location.reload(), 1500);
    },
  },
  watch: {
    $route: {
      immediate: true,
      deep:true,
      handler: function (val) {
        if (val.path == "/goods_list") {
          this.name = val.query.name;
        } else {
          this.name = "";
        }
      },
    },
  },
  computed: {
    ...mapState(["publicData"]),
  },
};
</script>

<style lang="scss" scoped>
.header-wrap {
  min-width: 1180px;
  position: relative;
  z-index: 1000;
  ::v-deep .swiper-container {
    margin-left: 0;
    margin-right: 0;
    height: 100%;
    width: 400px;
  }
  .swiper-item {
    color: #ccc;
    height: 17px;
  }
  .header-con {
    background-color: $--color-black;
    height: 40px;
    color: #f2f2f2;
    > div {
      height: 100%;
      color: #cccccc;
      a {
        color: #cccccc;
        &:hover {
          color: #fff;
        }
      }
      ul {
        li {
          margin-left: 20px;
        }

        #tel-phone-block {
          position: relative;
          &:hover .float-code {
            display: flex;
            box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
          }
          .float-code {
            display: none;
            position: absolute;
            padding: 22px 16px;
            background-color: white;
            top: 24px;
            right: -20px;
            &::after {
              content: "";
              width: 8px;
              box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
              transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
              right: 35px;
              top: -4px;
              height: 8px;
              background-color: #fff;
              position: absolute;
            }
          }
        }
      }
    }
  }
  .header-main {
    .search-wrap {
      height: 80px;
      .logo {
        height: 56px;
        width: auto;
      }
      .search {
        width: 460px;
        height: 42px;
        overflow: hidden;
        input {
          flex: 1;
          height: 100%;
          border-radius: 4px 0 0 4px;
          border: 1px solid $--color-primary;
          border-right-width: 0;
          padding: 0 10px;
        }
        .search-btn {
          width: 82px;
          height: 42px;
          cursor: pointer;
          border-radius: 0 4px 4px 0;
        }
      }
      .cart {
        cursor: pointer;
        background-color: #ffeeef;
        border: 1px solid $--color-primary;
        border-radius: 4px;
        width: 142px;
        height: 42px;
        margin-left: 16px;
        span {
          font-size: 24px;
        }
      }
    }
  }
  .header-nav {
    border-top: 1px solid $--background-color-base;
    .nav-wrap {
      width: 1180px;
      margin: 0 auto;
    }
    .nav {
      overflow-x: auto;
      overflow-y: hidden;
      .item {
        a {
          padding: 12px 15px;
          margin: 0 10px;
          color: $--color-black;
          font-size: 16px;
          white-space: nowrap;
          &:hover {
            color: $--color-primary;
          }
          &.nuxt-link-exact-active {
            color: $--color-primary;
          }
        }
      }
    }
  }
}
.user-nav {
  .item {
    text-align: center;
    line-height: 34px;
    display: block;
    cursor: pointer;
    &:not(:last-child) {
      border-bottom: 1px solid #e5e5e5;
    }
    &:hover {
      color: $--color-primary;
    }
  }
}
</style>
