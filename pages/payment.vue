<template>
  <div class="payment bg-white">
    <div class="payment-hd flex">
      <template v-if="order.pay_status == 0">
        <img src="~/assets/images/pay_wait.png" alt="" />
        <div class="status m-l-8 m-r-16 bold">
          {{ getOrderStatus(order.order_status) }}
        </div>
        <div v-if="getCancelTime(order.order_cancel_time) > 0" class="row">
          {{ $t("请在") }}
          <count-down
            :time="getCancelTime(order.order_cancel_time)"
            :format="$t('hh时mm分ss秒')"
            :style="{ color: '#FF2C3C' }"
            @finish="getOrder"
          />
          {{ $t("完成支付") }}, {{ $t("超时后将取消订单") }}
        </div>
      </template>
      <template v-if="order.pay_status == 1">
        <img src="~/assets/images/pay_success.png" alt="" />
        <div class="status m-l-8 m-r-16 bold">{{ $t("支付成功") }}</div>
      </template>
    </div>
    <div class="payment-con">
      <div class="item flex m-b-16">{{ $t("订单编号：") }}{{ order.sn }}</div>
      <div class="item flex m-b-16">
        {{ $t("订单价格：")
        }}<span class="primary">{{ $t("￥") }}{{ order.order_amount }}</span>
      </div>
      <div class="item flex m-b-16">
        {{ $t("收货地址：") }}
        <div>
          {{ order.consignee }} {{ order.mobile }}
          <span class="ml16">{{ order.delivery_address }}</span>
        </div>
      </div>
      <div class="item flex m-b-16">
        {{ $t("商品名称：") }}
        <div>
          <div v-for="(item, index) in order.order_goods" :key="index">
            <div class="flex">
              {{ item.goods_name }} /
              <span class="m-l-8"> {{ item.spec_value_str }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="payment-footer">
      <template v-if="order.pay_status == 0 && order.order_status == 0">
        <div class="title lg bold">{{ $t("请选择支付方式") }}</div>
        <div class="flex m-t-16">
          <div class="" v-for="(item, index) in payWayArr" :key="index">
            <div
              class="pay-way flex row-center"
              @click="orderPay(item.pay_way)"
            >
              <img :src="item.icon" alt="" />
              <span class="m-l-16 xxl">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <nuxt-link v-else class="btn flex row-center" to="/user/order">{{
        $t("查看订单")
      }}</nuxt-link>
    </div>
    <el-dialog
      title="微信支付"
      :visible.sync="showWxpay"
      width="700px"
      center
      @close="clearTimer"
    >
      <div class="flex flex-col row-center black">
        <!-- <img class="pay-code" :src="payInfo.config.code_url" alt=""/> -->
        <vue-qr
          class="bicode"
          :logoScale="20"
          :margin="0"
          :dotScale="1"
          :text="payInfo.config.code_url"
        >
        </vue-qr>
        <div class="m-t-8" style="font-size: 18px">
          {{ $t("微信扫一扫") }}，{{ $t("完成支付") }}
        </div>
        <div class="pay-money flex">
          <span>{{ $t("需支付金额：") }}</span>
          <span class="primary">
            <price-formate
              :price="payInfo.config.order_amount"
              :subscript-size="18"
              :first-size="28"
              :second-size="28"
            />
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountDown from "~/components/countDown";
import { client } from "@/utils/type";
import headerMixins from "@/mixins/header";
export default {
  mixins: [headerMixins],
  components: {
    CountDown,
  },
  async asyncData({ query, $get }) {
    const { data } = await $get("order/detail", {
      params: {
        id: query.id,
      },
    });
    return {
      order: data,
    };
  },
  data() {
    return {
      showWxpay: false,
      showAlipay: false,
      payWayArr: [],
      payInfo: {
        config: {
          code_url: "",
          order_amount: 0,
        },
      },
      cancelTime: 0,
      alipayHtml: "",
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getPayway();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async getPayway() {
      let _this = this;
      const { code, data } = await this.$get("pay/payway", {
        params: {
          from: "order",
          order_id: this.id,
          scene: 4, // pc端场景为4
        },
      });
      if (code == 1) {
        this.payWayArr = data.lists;
        if (!this.payWayArr.length)
          this.$message({
            message: _this.$t("请联系管理员配置支付方式"),
            type: "error",
          });
      }
    },
    async orderPay(payWay) {
      let params = {
        order_id: this.id,
        pay_way: payWay,
        // order_source: client,
        from: "order",
      };
      let url = this.$route.fullPath;
      // console.log(url);
      // console.log(window.location);
      // return;
      if (payWay == 5) {
        params.callback_url = url;
      }
      const { data, code, msg } = await this.$post("pay/prepay", params);

      if (code == 1 && data.pay_way == 2) {
        // 微信支付
        this.payInfo = data;
        this.showWxpay = true;
        this.createTimer();
      } else if (code == 1 && data.pay_way == 3) {
        // 支付宝支付
        let divForm = document.getElementsByTagName("divform");
        if (divForm.length) {
          document.body.removeChild(divForm[0]);
        }
        const div = document.createElement("divform");
        div.innerHTML = data.config; // data.config就是接口返回的form 表单字符串
        document.body.appendChild(div);
        document.forms[0].submit();
      } else if (code == 1 && (data.pay_way == 1 || data.pay_way == 6)) {
        // 余额支付
        // this.$message({
        //     message: '支付成功',
        //     type: 'success',
        // })
        this.getOrder();
      } else if (code == 1 && data.pay_way == 5) {
        window.location.href = data.payurl;
      }
    },
    clearTimer() {
      clearInterval(this.timer);
    },
    createTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getOrder();
      }, 2000);
    },
    async getOrder() {
      let _this = this;
      const { data, code, msg } = await this.$get("order/detail", {
        params: {
          id: this.id,
        },
      });
      if (code == 1) {
        this.order = data;
        if (data.pay_status == 1) {
          clearInterval(this.timer);
          this.showWxpay = false;

          this.$message({
            message: _this.$t("支付成功"),
            type: "success",
          });
        }
      }
    },
  },
  computed: {
    getOrderStatus() {
      return (status) => {
        let text = "";
        switch (status) {
          case 0:
            text = this.$t("待支付");
            break;
          case 1:
            text = this.$t("待发货");
            break;
          case 2:
            text = this.$t("待收货");
            break;
          case 3:
            text = this.$t("已完成");
            break;
          case 4:
            text = this.$t("订单已关闭");
            break;
        }
        return text;
      };
    },
    getCancelTime() {
      return (time) => time - Date.now() / 1000;
    },
  },
};
</script>

<style lang="scss" scoped>
.payment {
  margin: 16px 0;
  padding: 0 40px;

  .payment-hd {
    > img {
      width: 32px;
      height: 32px;
    }

    .status {
      font-size: 24px;
    }
  }

  .payment-con,
  .payment-hd {
    padding: 32px 0;
    border-bottom: 1px dashed $--border-color-base;
  }

  .payment-con {
    .item {
      align-items: flex-start;
    }
  }

  .payment-footer {
    padding: 32px 0;

    .pay-way {
      width: 200px;
      height: 68px;
      cursor: pointer;
      margin-right: 32px;
      border: 1px dashed $--border-color-base;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .btn {
      width: 134px;
      height: 40px;
      border: 1px solid $--border-color-base;
    }
  }

  .el-dialog {
    .pay-code {
      width: 270px;
      height: 270px;
    }

    .pay-money {
      font-size: 18px;
      margin-top: 24px;
      align-items: baseline;
    }
  }
}
</style>
