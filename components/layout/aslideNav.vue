<template>
    <aside class="aside-nav bg-white">
        <el-menu :default-active="$route.path" :router="true" :default-openeds="['1', '2', '3']" class="el-menu-vertical-demo">

            <el-submenu index="1">
                <template slot="title">
                    <span class="bold xxl">{{$t('订单中心')}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/user/order">{{$t('我的订单')}}</el-menu-item>
                    <el-menu-item index="/user/evaluation">{{$t('评价中心')}}</el-menu-item>
                    <el-menu-item index="/user/after_sales">{{$t('售后管理')}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <span class="bold xxl">{{$t('我的资产')}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/user/coupons">{{$t('我的优惠券')}}</el-menu-item>
                    <el-menu-item index="/user/user_wallet">{{$t('我的钱包')}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <span class="bold xxl">{{$t('其他服务')}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/user/address">{{$t('地址管理')}}</el-menu-item>
                    <el-menu-item index="/user/collection">{{$t('我的收藏')}}</el-menu-item>
                    <el-menu-item index="/user/profile">{{$t('个人资料')}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </aside>
</template>

<script>
import { mapState } from "vuex";
export default {
    created() {},
    computed: {
        ...mapState(["publicData"]),
    },
};
</script>

<style lang="scss" scoped>
.aside-nav {
    width: 160px;
    min-height: 680px;
    padding: 20px 0;
    box-sizing: border-box;
    ::v-deep .el-menu {
      border: 0;
      width: 160px;
      overflow: hidden;
    }
    ::v-deep .el-menu-item-group__title {
      padding-top: 0;
    }
}
</style>
