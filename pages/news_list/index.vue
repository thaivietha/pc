<template>
  <div class="help-center-container">
    <div class="banner m-t-16 flex-col">
      <ad-item :item="adData.content" v-if="adData.content.url"></ad-item>
    </div>
    <!--< div class="help-center-banner">
       <client-only>
        <swiper ref="mySwiper" :options="swiperOptions">
          <swiper-slide
            class="swiper-item"
            v-for="(item, index) in bannerList"
            :key="index"
          >
            <ad-item :item="item"></ad-item>
          </swiper-slide>
        </swiper>
      </client-only>
    </div> -->
    <div class="help-center-box">
      <!-- <div class="help-center-aside bg-white">
                <ul class="nav">
                    <li
                        class="flex"
                        :class="{ 'active-item': currentId <= 0 }"
                        @click="changeList(0)"
                    >
                        全部
                    </li>

                </ul>
            </div> -->
      <div class="article-lists-container bg-white">
        <div v-show="!dataNull">
          <div>
            <nuxt-link
              :to="'/news_list/news_list_detail?id=' + item.id"
              class="article-item flex row-between bg-white"
              v-for="item in articleList"
              :key="item.id"
            >
              <div style="max-width: 920px" class="">
                <div class="lg article-name line-2">
                  {{ item.name }}
                </div>
                <div class="line-2" style="color: #888888">
                  {{ item.synopsis }}
                </div>
                <div class="flex" style="margin-top: 30px">
                  <div class="sm muted">{{$t('发布时间')}}：{{ item.create_time }}</div>
                  <div class="flex m-l-16">
                    <i class="el-icon-view muted"></i>
                    <div class="muted" style="margin-left: 3px">
                      {{ item.views }} {{$t('人浏览')}}
                    </div>
                  </div>
                </div>
              </div>
              <el-image
                style="width: 200px; height: 150px; border-radius: 6px"
                fit="cover"
                :src="item.image"
              />
            </nuxt-link>
          </div>
          <div class="help-center-pagination row-center">
            <el-pagination
              background
              hide-on-single-page
              layout="prev, pager, next"
              :total="count"
              :prev-text="$t('上一页')"
              :next-text="$t('下一页')"
              :page-size="10"
              @current-change="changePage"
            />
          </div>
        </div>
        <div class="data-null flex col-center" v-show="dataNull">
          <img
            style="width: 150px; height: 150px"
            src="~/assets/images/news_null.png"
          />
          <div class="xs muted">{{ $t("暂无消息记录～") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import headerMixins from "@/mixins/header";
export default {
  mixins: [headerMixins],
  async asyncData({ $get, $post }) {
    let categoryList = [];
    let currentId = 0;
    let articleList = [];
    let count = 0;
    let dataNull = true;
    // const banner = $get("ad/lists", { params: { pid: 8, client: 2 } });
    // let res = await $get("article/category");
    // const { data: bannerList } = await banner;
    // if(res.code == 1) {
    //   categoryList = res.data;
    //   currentId = 0
    //   let listsRes = await $get("article/lists", {params: {id: currentId, page_size: 10}});
    //   if(listsRes.code == 1) {
    //     articleList = listsRes.data.list;
    //     count = listsRes.data.count
    //     if(count <= 0) {
    //       dataNull = true;
    //     }
    //     else {
    //       dataNull = false
    //     }
    //   }
    // }
    let listsRes = await $get("shop_notice/lists");
    if (listsRes.code == 1) {
      articleList = listsRes.data.lists;
      count = listsRes.data.count;
      if (count <= 0) {
        dataNull = true;
      } else {
        dataNull = false;
      }
    }

    // 获取顶部广告图
    const adData = await $get("Pc/getPage", {
      params: {
        type: 5,
      },
    });

    return {
      // categoryList,
      articleList,
      count,
      currentId: 0,
      // bannerList,
      // dataNull,

      adData: adData.data,
    };
  },
  data() {
    return {
      categoryList: [],
      articleList: [],
      currentId: 0,
      count: 0,
      swiperOptions: {
        width: 1180,
      },
      bannerList: [],
      dataNull: false,

      adData: {},
    };
  },

  computed: {
    ...mapState(["publicData"]),
  },

  mounted() {
    this.bannerList = [{ image: this.publicData.shop.notice_ad }];
    console.log(this.articleList, "articleList");
  },
  methods: {
    async changePage(current) {
      // let res = await this.$get("article/lists", {params: {id: this.currentId, page_no: current, page_size: 10}});
      let res = await this.$get("shop_notice/lists", {
        params: { id: this.currentId, page_no: current, page_size: 10 },
      });
      if (res.code == 1) {
        this.articleList = res.data.lists;
        if (this.articleList.length <= 0) {
          dataNull = true;
        } else {
          dataNull = false;
        }
      }
    },
    changeList(id) {
      this.currentId = id;
      this.changePage(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.help-center-container {
  .help-center-banner {
    margin-top: 16px;
  }
  .help-center-box {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    .help-center-aside {
      width: 160px;
      min-height: 635px;
      padding-top: 20px;
      padding-bottom: 20px;
      .nav {
        li {
          padding: 10px 32px;
          cursor: pointer;
        }
        .active-item {
          color: $--color-primary;
        }
      }
    }
    .article-lists-container {
      width: 1180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .article-item {
        padding: 15px 20px;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;
        .article-name {
          margin-bottom: 11px;
          margin-top: 13px;
          // max-width: 720px;
        }
      }
      .help-center-pagination {
        padding-top: 38px;
        margin-bottom: 30px;
      }
      .data-null {
        padding-top: 150px;
      }
    }
  }
}
::v-deep .el-pagination.is-background .btn-prev {
  background: #fff;
  padding: 0 10px;
}
::v-deep .el-pagination.is-background .btn-next {
  background: #fff;
  padding: 0 10px;
}
::v-deep .el-pagination.is-background .el-pager li {
  background: #fff;
  padding: 0 10px;
}
</style>
