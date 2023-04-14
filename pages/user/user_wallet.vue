<template>
  <div class="user-wallet-container">
    <div class="user-wallet-header lg">{{ $t("我的钱包") }}</div>
    <div class="user-wallet-content">
      <div class="wallet-info-box flex">
        <div class="user-wallet-info">
          <div class="xs title">{{ $t("我的余额") }}</div>
          <div
            class="nr white flex"
            style="font-weight: 500; align-items: baseline"
          >
            {{$t('¥')}}<label style="font-size: 24px">{{
              wallet ? wallet.user_money : 0
            }}</label>
          </div>
        </div>
        <div class="user-wallet-info" style="margin-left: 144px">
          <div class="xs title">{{ $t("累计消费") }}</div>
          <div
            class="nr white flex"
            style="font-weight: 500; align-items: baseline"
          >
            {{$t('¥')}}<label style="font-size: 24px">{{
              wallet ? wallet.total_amount : 0
            }}</label>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeName" class="mt10" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in userWallet"
          :label="item.name"
          :name="item.type"
          :key="index"
        >
          <user-wallet-table :type="item.type" :list="item.lists" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <null-data
      style="padding: 150px"
      img-style="width: 94px;height:118px"
      :img="require('~/assets/images/img_null.png')"
      text="请前往移动端进行查看"
    ></null-data> -->
  </div>
</template>

<script>
import UserWalletTable from "@/components/userWalletTable.vue";
import headerMixins from "@/mixins/header";
export default {
  mixins: [headerMixins],
  components: {
    UserWalletTable,
  },
  layout: "user-layout",
  data() {
    // console.log(this)
    return {
      activeName: "bnw",
      // userWallet: [],
    };
  },
  computed: {
    userWallet() {
      let arr = [
        {
          type: "bnw",
          lists: [],
          name: this.$t("全部记录"),
          count: 0,
          page: 1,
        },
        {
          type: "bnw_inc",
          lists: [],
          name: this.$t("收入记录"),
          count: 0,
          page: 1,
        },
        {
          type: "bnw_dec",
          lists: [],
          name: this.$t("消费记录"),
          count: 0,
          page: 1,
        },
      ];
      return arr;
    },
  },
  async asyncData({ $get, query }) {
    let wallet = {};
    let recodeList = [];
    let walletRes = await $get("user/wallet");
    let recodeRes = await $get("account_log/lists", {
      params: {
        page_no: 1,
        page_size: 10,
        type: "bnw",
      },
    });
    if (walletRes.code == 1) {
      console.log(walletRes);
      wallet = walletRes.data;
    }
    console.log(recodeRes);
    if (recodeRes.code == 1) {
      recodeList = recodeRes.data;
    }
    return {
      wallet,
      recodeList,
    };
  },
  fetch() {
    this.handleClick();
  },
  methods: {
    handleClick() {
      this.getRecodeList();
    },

    changePage(val) {
      this.userWallet.some((item) => {
        if (item.type == this.activeName) {
          item.page = val;
        }
      });
      this.getRecodeList();
    },

    async getRecodeList() {
      const { activeName, userWallet } = this;
      const item = userWallet.find((item) => item.type == activeName);
      const {
        data: { lists, count },
        code,
      } = await this.$get("account_log/lists", {
        params: {
          page_size: 10,
          page_no: item.page,
          type: activeName,
        },
      });
      if (code == 1) {
        this.recodeList = { lists, count };
      }
    },
  },
  watch: {
    recodeList: {
      immediate: true,
      handler(val) {
        this.userWallet.some((item) => {
          if (item.type == this.activeName) {
            Object.assign(item, val);
            return true;
          }
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.user-wallet-container {
  padding: 10px 10px 60px 10px;
  .user-wallet-header {
    padding: 10px 5px;
    border-bottom: 1px solid #e5e5e5;
  }
  .user-wallet-content {
    margin-top: 17px;
    .wallet-info-box {
      padding: 24px;
      background: linear-gradient(87deg, $--color-primary 0%, #ff9e2c 100%);
      .user-wallet-info {
        .title {
          color: #ffdcd7;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>