<template>
  <div class="fixed" v-if="fixed.show">
    <div class="float-nav bg-white">
      <div class="nav-list">
        <template v-for="(item, index) in fixed.content.data">
          <div :key="index">
            <div
              class="item flex-col col-center lighter"
              v-if="item.type == 'nav'"
              @mouseenter="handleHover(index, true)"
              @mouseleave="handleHover(index, false)"
            >
              <nuxt-link
                :to="{
                  path: item.link.path,
                  query: item.link.params,
                }"
              >
                <img
                  :src="
                    $getImageUri(
                      ishover(index) ? item.select_icon || item.icon : item.icon
                    )
                  "
                  class="icon-img"
                />
                <div class="xs m-t-5" v-if="fixed.content.style == 1">
                  {{ item.name }}
                </div>
              </nuxt-link>
            </div>
            <div
              v-else
              @mouseenter="handleHover(index, true)"
              @mouseleave="handleHover(index, false)"
            >
              <el-popover placement="left" width="165" trigger="hover">
                <div
                  style="text-align: center; margin: 0"
                  class="flex-col row-center"
                >
                  <img
                    style="width: 100px; height: 100px"
                    class="m-l-20"
                    :src="server.qr_code"
                    alt=""
                  />
                  <div class="sm m-t-8">{{ $t("微信客服") }}</div>
                  <div class="sm m-t-10">
                    {{ $t("客服微信号：") }} {{ server.wechat }}
                  </div>
                </div>
                <div
                  class="item flex-col col-center row-center lighter"
                  slot="reference"
                >
                  <img
                    :src="
                      $getImageUri(
                        ishover(index)
                          ? item.select_icon || item.icon
                          : item.icon
                      )
                    "
                    class="icon-img"
                  />
                  <div class="xs m-t-5" v-if="fixed.content.style == 1">
                    {{ item.name }}
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      server: {},
      hoverLists: [],
    };
  },
  created() {
    this.getService();
  },
  methods: {
    async getService() {
      const { data, code } = await this.$get("service/getConfig");
      if (code == 1) {
        this.server = data;
      }
    },
    handleHover(index, ishover) {
      this.$set(this.hoverLists, index, ishover);
    },
  },
  computed: {
    ...mapState(["publicData"]),
    fixed() {
      return this.publicData.decoration.fixed || {};
    },
    ishover() {
      return (index) => {
        return this.hoverLists[index];
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.float-nav {
  width: 70px;
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  box-shadow: -3px 1px 2px rgba(0, 0, 0, 0.04);
  .nav-list {
    bottom: 120px;
    .item {
      padding: 10px 0;
      margin: 0 10px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
      .icon-img {
        width: 28px;
        height: 28px;
      }
    }
  }
}
</style>