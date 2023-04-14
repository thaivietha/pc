<template>
  <div class="order-detail bg-white">
    <div class="detail-hd flex row-between">
      <div class="lg">{{ $t("订单状态") }}</div>
      <div :class="['status lg', { primary: orderDetail.order_status == 0 }]">
        {{ orderDetail.order_status_desc }}
      </div>
    </div>

    <div class="address">
      <div class="address-item">
        <div class="lighter address-item-label">{{ $t("收件人：") }}</div>
        <div>{{ orderDetail.address.contact }}</div>
      </div>
      <div class="address-item">
        <div class="lighter address-item-label">{{ $t("联系方式：") }}</div>
        <div>{{ orderDetail.address.mobile }}</div>
      </div>

      <template v-if="orderDetail.delivery_type === 1">
        <div class="address-item">
          <div class="lighter address-item-label">{{ $t("收货地址：") }}</div>
          <div>{{ orderDetail.delivery_address }}</div>
        </div>
      </template>

      <template v-if="orderDetail.delivery_type === 2">
        <div class="address-item">
          <div class="lighter address-item-label">{{ $t("门店地址：") }}</div>
          <div>
            <div class="bold black">
              {{ orderDetail.selffetch_shop.name }}
            </div>
            <div class="lighter m-t-8">
              {{ orderDetail.selffetch_shop.shop_address }}
            </div>

            <div class="flex">
              <div class="flex col-center m-t-10">
                <div class="qr-container" ref="qrCodeUrl"></div>
                <div class="selffetc-code m-t-10">
                  <span>{{ $t("提货码") }}:</span>
                  <span>{{ orderDetail.pickup_code }}</span>
                  <span class="primary m-l-8 pointer" @click="onCopyQRCode">{{
                    $t("复制")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="detail-con">
      <div class="title flex">
        <div class="flex-1">
          {{ $t("下单时间：") }}{{ orderDetail.create_time }}
        </div>
        <div class="flex-1">{{ $t("订单编号：") }}{{ orderDetail.sn }}</div>
        <div class="flex-1">
          {{ $t("订单类型：") }}{{ orderDetail.order_type_desc }}
        </div>
      </div>
      <div class="goods">
        <div class="goods-hd lighter flex">
          <div class="info flex flex-1">{{ $t("商品信息") }}</div>
          <div class="price flex row-center">{{ $t("单价") }}</div>
          <div class="num flex row-center">{{ $t("数量") }}</div>
          <div class="total flex row-center">{{ $t("合计") }}</div>
          <div class="real_total flex row-center">{{ $t("实付") }}</div>
        </div>
        <div class="goods-list">
          <div
            class="goods-item flex"
            v-for="(item, index) in orderDetail.order_goods"
            :key="index"
          >
            <nuxt-link
              :to="`/goods_details?id=${item.goods_id}`"
              class="info flex flex-1"
            >
              <el-image class="goods-img" :src="item.goods_image" alt="" />
              <div class="goods-info flex-1">
                <div class="goods-name line-2">
                  <el-tag size="mini" effect="plain" v-if="item.is_seckill">{{
                    $t("秒杀")
                  }}</el-tag>
                  {{ item.goods_name }}
                </div>
                <div class="sm lighter m-t-8">
                  {{ item.spec_value_str }}
                </div>
              </div>
            </nuxt-link>
            <div class="price flex row-center">
              <price-formate :price="item.goods_price" />
            </div>
            <div class="num flex row-center">
              {{ item.goods_num }}
            </div>
            <div class="total flex row-center">
              <!-- <price-formate :price="item.total_price" /> -->
              <price-formate :price="item.total_price" />
            </div>
            <div class="real_total flex row-center">
              <price-formate :price="item.total_pay_price" />
            </div>
          </div>
        </div>
      </div>
      <div class="m-t-16" v-if="orderDetail.user_remark">
        <span class="lighter m-r-8">{{ $t("买家留言：") }}</span>
        <span>{{ orderDetail.user_remark }}</span>
      </div>
    </div>
    <div class="detail-footer flex">
      <div>
        <div class="flex-col" style="align-items: flex-end">
          <div class="money flex m-b-8">
            <div class="lighter">{{ $t("商品总价：") }}</div>
            <div>
              <price-formate :price="orderDetail.goods_price" />
            </div>
          </div>
          <div class="money flex m-b-8">
            <div class="lighter">{{ $t("运费：") }}</div>
            <div>
              <price-formate :price="orderDetail.express_price" />
            </div>
          </div>
          <div
            class="money flex m-b-16"
            v-if="orderDetail.discount_amount != 0"
          >
            <div class="lighter">{{ $t("优惠券：") }}</div>
            <div>
              -
              <price-formate :price="orderDetail.discount_amount" />
            </div>
          </div>
          <div class="money flex">
            <div class="lighter">{{ $t("实付金额：") }}</div>
            <div class="primary">
              <price-formate
                :price="orderDetail.order_amount"
                :subscript-size="14"
                :first-size="28"
                :second-size="28"
              />
            </div>
          </div>
        </div>
        <div class="oprate-btn flex row-end m-t-16">
          <div
            class="btn plain flex row-center lighter"
            v-if="orderDetail.btn.cancel_btn"
            @click="handleOrder(0)"
          >
            {{ $t("取消订单") }}
          </div>
          <div
            class="btn plain flex row-center m-l-8 lighter"
            v-if="orderDetail.btn.delivery_btn"
            @click="showDeliverPop = true"
          >
            {{ $t("物流查询") }}
          </div>
          <div
            class="btn bg-primary flex row-center white m-l-8"
            v-if="orderDetail.btn.confirm_btn"
            @click="handleOrder(2)"
          >
            {{ $t("确认收货") }}
          </div>
          <div
            class="btn plain flex row-center lighter m-l-8"
            v-if="orderDetail.btn.delete_btn"
            @click="handleOrder(1)"
          >
            {{ $t("删除订单") }}
          </div>
          <nuxt-link
            :to="`/payment?id=${orderDetail.id}`"
            class="btn bg-primary flex row-center white m-l-8"
            v-if="orderDetail.btn.pay_btn"
          >
            <span class="m-r-8">{{ $t("去付款") }}</span>
            <count-down
              v-if="getCancelTime(orderDetail.order_cancel_time) > 0"
              :time="getCancelTime(orderDetail.order_cancel_time)"
              format="hh:mm:ss"
              @finish="getOrderDetail"
            />
          </nuxt-link>
        </div>
      </div>
    </div>
    <deliver-search v-model="showDeliverPop" :aid="id" />
  </div>
</template>

<script>
import CountDown from "~/components/countDown";
import { copyClipboard } from "@/utils/tools";
import QRCode from "qrcodejs2";

import headerMixins from "@/mixins/header";
export default {
  mixins: [headerMixins],
  layout: "user-layout",
  components: {
    CountDown,
  },
  async asyncData({ $get, query }) {
    const { data, code } = await $get("order/detail", {
      params: {
        id: query.id,
      },
    });

    if (code == 1) {
      return {
        orderDetail: data,
        id: query.id,
      };
    }
  },
  data() {
    return {
      orderDetail: {},
      showDeliverPop: false,
    };
  },

  mounted() {
    if (this.orderDetail.delivery_type === 2) {
      this.creatQrCode(this.orderDetail.pickup_code);
    }
  },

  methods: {
    creatQrCode(content) {
      const qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: content,
        width: 106,
        height: 106,
        colorDark: "#333333",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
    onCopyQRCode() {
      let _this = this;
      const content = this.orderDetail.pickup_code;
      copyClipboard(content)
        .then(() => {
          this.$message.success(_this.$t("复制成功"));
        })
        .catch((err) => {
          this.$message.error(_this.$t("复制失败"));
          console.log(err);
        });
    },

    async getOrderDetail() {
      const { data, code } = await this.$get("order/detail", {
        params: {
          id: this.id,
        },
      });
      if (code == 1) {
        this.orderDetail = data;
      }
    },
    handleOrder(type) {
      let _this = this;
      this.type = type;
      this.$confirm(this.getTipsText(type), {
        title: _this.$t("温馨提示"),
        center: true,
        confirmButtonText: _this.$t("确定"),
        cancelButtonText: _this.$t("取消"),
        callback: (action) => {
          if (action == "confirm") {
            this.postOrder();
          }
        },
      });
    },
    async postOrder() {
      const { type, id } = this;
      let url = "";
      switch (type) {
        case 0:
          url = "order/cancel";
          break;
        case 1:
          url = "order/del";
          break;
        case 2:
          url = "order/confirm";
          break;
      }
      let { code, data, msg } = await this.$post(url, { id });
      if (code == 1) {
        this.$message({
          message: msg,
          type: "success",
        });
        if (type == 1) {
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500);
        } else {
          this.getOrderDetail();
        }
      }
    },
    getTipsText(type) {
      let _this = this;
      switch (type) {
        case 0:
          return _this.$t("确认取消订单吗？");
        case 1:
          return _this.$t("确认删除订单吗？");
        case 2:
          return _this.$t("确认收货吗？");
      }
    },
  },
  computed: {
    getOrderStatus() {
      return (status) => {
        let text = "";
        switch (status) {
          case 0:
            text = _this.$t("待支付");
            break;
          case 1:
            text = _this.$t("待发货");
            break;
          case 2:
            text = _this.$t("待收货");
            break;
          case 3:
            text = _this.$t("已完成");
            break;
          case 4:
            text = _this.$t("订单已关闭");
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
.order-detail {
  padding: 20px 10px;
  .detail-hd {
    padding: 14px 5px;
    border-bottom: 1px solid #e5e5e5;
  }
  .address {
    padding: 16px 15px;
    > div {
      margin-bottom: 10px;
    }

    &-item {
      display: flex;

      &-label {
        width: 70px;
        text-align: justify;
        text-align-last: justify;
      }
    }
  }
  .detail-con {
    .title {
      height: 40px;
      background: #f2f2f2;
      border: 1px solid #e5e5e5;
      padding: 0 20px;
    }
    .goods {
      .goods-hd,
      .goods-list {
        padding: 10px 20px;
        border: 1px solid #e5e5e5;
        border-top-width: 0;
        .goods-item {
          padding: 10px 0;
          .goods-name {
            line-height: 1.5;
          }
        }
      }
      .info {
        .goods-img {
          width: 72px;
          height: 72px;
          margin-right: 10px;
        }
      }
      .price,
      .num,
      .total,
      .real_total {
        width: 150px;
      }
    }
  }
  .detail-footer {
    padding: 25px 20px;
    justify-content: flex-end;
    .money {
      > div {
        text-align: right;
        &:first-of-type {
          width: 80px;
        }
        &:last-of-type {
          width: 120px;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
    .oprate-btn {
      .btn {
        width: 152px;
        height: 44px;
        cursor: pointer;
        border-radius: 2px;
        &.plain {
          border: 1px solid #e5e5e5;
        }
      }
    }
  }

  .selffetc-code {
    display: inline-block;
    padding: 4px 15px;
    border-radius: 60px;
    font-size: 12px;
    background-color: #f6f6f6;
    // color: $-color-black;
  }

  .qr-container {
    width: 120px;
    height: 120px;
    padding: 6px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
  }
}
</style>
