<template>
    <div class="category">
        <div class="category-hd bg-white">
            <div class="category-wrap">
                <div class="category-con flex">
                    <div class="name muted">{{$t('一级分类：')}}</div>
                    <div class="category-list flex flex-wrap lighter">
                        <div
                            :class="[
                                'item line1',
                                { active: oneIndex == index },
                            ]"
                            v-for="(item, index) in categoryOne"
                            :key="index"
                            @click="changeData(item.id)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div class="category-con flex">
                    <div class="name muted">{{$t('二级分类：')}}</div>
                    <div class="category-list flex flex-wrap lighter">
                        <div
                            :class="['item line1', { active: twoIndex === '' }]"
                            @click="clickAllTwo"
                        >
                            {{$t('全部')}}
                        </div>
                        <div
                            :class="[
                                'item line1',
                                { active: twoIndex === index },
                            ]"
                            v-for="(item, index) in categoryTwo"
                            :key="index"
                            @click="changeData(item.id)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div class="category-con flex">
                    <div class="name muted">{{$t('三级分类：')}}</div>
                    <div class="category-list flex flex-wrap lighter">
                        <div
                            :class="[
                                'item line1',
                                { active: threeIndex === '' },
                            ]"
                            @click="clickAll"
                        >
                            {{$t('全部')}}
                        </div>
                        <div
                            :class="[
                                'item line1',
                                { active: threeIndex === index },
                            ]"
                            v-for="(item, index) in categoryThree"
                            :key="index"
                            @click="changeData(item.id)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="sort m-b-16 flex bg-white">
                <div class="title muted">{{$t('排序方式：')}}</div>
                <div class="sort-name m-l-16 flex lighter">
                    <div
                        :class="['item', { active: sortType == '' }]"
                        @click="changeSortType('')"
                    >
                        {{$t('综合')}}
                    </div>
                    <div
                        :class="['item', { active: sortType == 'price' }]"
                        @click="changeSortType('price')"
                    >
                        {{$t('价格')}}
                        <i
                            v-show="priceSort == 'desc'"
                            class="el-icon-arrow-down"
                        ></i>
                        <i
                            v-show="priceSort == 'asc'"
                            class="el-icon-arrow-up"
                        ></i>
                    </div>
                    <div
                        :class="['item', { active: sortType == 'sales_sum' }]"
                        @click="changeSortType('sales_sum')"
                    >
                        {{$t('销量')}}
                        <i
                            v-show="saleSort == 'desc'"
                            class="el-icon-arrow-down"
                        ></i>
                        <i
                            v-show="saleSort == 'asc'"
                            class="el-icon-arrow-up"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isHasGoods">
            <goods-list :list="goodsList" />
            <div
                class="pagination flex row-center"
                style="padding-bottom: 38px"
                v-if="count"
            >
                <el-pagination
                    background
                    hide-on-single-page
                    layout="prev, pager, next"
                    :total="count"
                    :prev-text="$t('上一页')"
                    :next-text="$t('下一页')"
                    :page-size="20"
                    @current-change="changePage"
                >
                </el-pagination>
            </div>
        </div>
        <null-data
            v-else
            :img="require('~/assets/images/goods_null.png')"
            :text="$t('暂无商品')"
        ></null-data>
    </div>
</template>

<script>
import { trottle } from '~/utils/tools'
import headerMixins from '@/mixins/header'
export default {
    mixins: [headerMixins],
    watchQuery: true,
    async asyncData({ query, $get }) {
        // 获取商品分类数据
        let { data } = await $get('goodsCategory/lists', {
            // params: { client: 2 },
        })
        console.log('goodsCategory', data)
        return {
            categoryList: data.lists,
        }
    },
    data() {
        return {
            count: 0,
            oneIndex: 0,
            twoIndex: '',
            threeIndex: '',
            categoryOne: [],
            categoryTwo: [],
            categoryThree: [],
            sortType: '',
            saleSort: 'desc',
            priceSort: 'desc',
            page: '',
            goodsList: [],
            cateId: 0,
            isHasGoods: true,
        }
    },
    created() {
        this.changeSortType = trottle(this.changeSortType, 500, this)
    },
    methods: {
        changeData(id) {
            const { categoryList } = this
            this.setIndex(id)
            this.categoryOne = categoryList
            this.categoryTwo = categoryList[this.oneIndex]
                ? categoryList[this.oneIndex].sons
                : []

            if( this.categoryTwo) {
                this.categoryThree = this.categoryTwo[this.twoIndex]
                    ? this.categoryTwo[this.twoIndex].sons
                    : []
            }

            this.setCateId(id)
            this.getGoods()
        },
        setCateId(id) {
            if (
                this.twoIndex == '' &&
                this.threeIndex == '' &&
                this.oneIndex !== ''
            ) {
                this.cateId = this.categoryOne[this.oneIndex].id
            }
            if (this.threeIndex == '' && this.twoIndex !== '') {
                this.cateId = this.categoryTwo[this.twoIndex].id
            }
            if (id) {
                this.cateId = id
            }
        },
        setIndex(id) {
            const { categoryList } = this
            categoryList.some((oitem, oindex) => {
                if (oitem.id === id) {
                    this.oneIndex = oindex
                    this.twoIndex = ''
                    this.threeIndex = ''
                    return true
                }
                return (
                    oitem.sons &&
                    oitem.sons.some((witem, windex) => {
                        if (witem.id === id) {
                            this.oneIndex = oindex
                            this.twoIndex = windex
                            this.threeIndex = ''
                            return true
                        }
                        return (
                            witem.sons &&
                            witem.sons.some((titem, tindex) => {
                                if (titem.id === id) {
                                    this.oneIndex = oindex
                                    this.twoIndex = windex
                                    this.threeIndex = tindex
                                    return true
                                }
                            })
                        )
                    })
                )
            })
        },
        clickAllTwo() {
            this.twoIndex = ''
            this.threeIndex = ''
            this.changeData()
        },
        clickAll() {
            this.threeIndex = ''
            this.changeData()
        },
        changeSortType(type) {
            this.sortType = type
            switch (type) {
                case 'price':
                    if (this.priceSort == 'asc') {
                        this.priceSort = 'desc'
                    } else if (this.priceSort == 'desc') {
                        this.priceSort = 'asc'
                    }
                    break
                case 'sales_sum':
                    if (this.saleSort == 'asc') {
                        this.saleSort = 'desc'
                    } else if (this.saleSort == 'desc') {
                        this.saleSort = 'asc'
                    }
                    break
                default:
            }
            this.getGoods()
        },
        changePage(current) {
            this.page = current
            this.getGoods()
        },
        // 获取商品列表
        async getGoods() {
            const { priceSort, sortType, saleSort } = this
            let category_id = this.cateId
            let sort = ''
            switch (sortType) {
                case 'price':
                    sort = priceSort
                    break
                case 'sales_sum':
                    sort = saleSort
                    break
            }
            const {
                data: { lists, count },
            } = await this.$get('goods/lists', {
                params: {
                    page_size: 20,
                    page_no: this.page,
                    category_id: category_id,
                    price: this.sortType == 'price'?this.priceSort : '',
                    sale: this.sortType == 'sales_sum'?this.saleSort : '',
                },
            })
            this.goodsList = lists
            if (!lists.length) {
                this.isHasGoods = false
            } else {
                this.isHasGoods = true
            }
            this.count = count
        },
    },
    watch: {
        categoryList: {
            immediate: true,
            handler(value) {
                const { id } = this.$route.query
                this.changeData(Number(id))
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.category {
    padding: 16px 0;
    .category-hd {
        .category-wrap {
            padding: 0 16px;
        }
        .category-con {
            border-bottom: 1px dashed #e5e5e5;
            align-items: flex-start;
            padding-top: 16px;

            .name {
                flex: none;
            }
            .item {
                margin-bottom: 16px;
                width: 84px;
                margin-left: 14px;
                cursor: pointer;
                &.active {
                    color: $--color-primary;
                }
                &:hover {
                    color: $--color-primary;
                }
            }
        }
        .sort {
            padding: 15px 16px;
            .sort-name {
                .item {
                    margin-right: 30px;
                    cursor: pointer;
                    &.active {
                        color: $--color-primary;
                    }
                }
            }
        }
    }
}
</style>
