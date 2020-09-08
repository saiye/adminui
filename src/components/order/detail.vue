<template>
    <div>
        <el-dialog title="订单详情" :close-on-click-modal="closeModal" @close="noticeCloseDialog" :visible.sync="dialogVisible" width="800px">
                   <el-row :gutter="20" class="my-row">
                        <el-col :span="3">用户名</el-col>
                        <el-col :span="9">{{detail_form.nickname}}</el-col>
                        <el-col :span="3">用户id</el-col>
                        <el-col :span="9">{{detail_form.user_id}}</el-col>
                    </el-row>
                    <el-row :gutter="20" class="my-row">
                        <el-col :span="3">手机号码</el-col>
                        <el-col :span="9">{{detail_form.phone?detail_form.phone:'-'}}</el-col>
                        <el-col :span="3">支付方式</el-col>
                        <el-col :span="9">{{detail_form.pay_type_word}}</el-col>
                    </el-row>
                    <el-row :gutter="20" class="my-row">
                        <el-col :span="3">下单时间</el-col>
                        <el-col :span="9">{{detail_form.created_at}}</el-col>
                        <el-col :span="3">订单状态</el-col>
                        <el-col :span="9">{{detail_form.status_word}}</el-col>
                    </el-row>
                  <el-row :gutter="20" class="my-row">
                        <el-col :span="3">商品列表</el-col>
                        <el-col :span="21">
                            <el-table :data="detail_form.orderGoods" >
                                <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
                                <el-table-column prop="tag" label="商品规格"></el-table-column>
                                <el-table-column prop="goods_num" label="商品数量"></el-table-column>
                                <el-table-column prop="goods_price" label="单价"></el-table-column>
                                <el-table-column label="小计">
                                        <template slot-scope="scope">
                                            {{scope.row.goods_price*scope.row.goods_num}}
                                        </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                  </el-row>
             <el-row :gutter="20" class="my-row">
                        <el-col :span="24">优惠信息</el-col>
                  </el-row>
                  <el-row :gutter="20" class="my-row">
                        <el-col :span="3">优惠券</el-col>
                        <el-col :span="21">未使用</el-col>
                  </el-row>
                <el-row :gutter="20" class="my-row">
                        <el-col :span="3">积分抵扣</el-col>
                        <el-col :span="21">未使用</el-col>
                  </el-row>
                 <el-row :gutter="20" class="my-row">
                        <el-col :span="8">原订单金额<span style="color: red;margin-left: 10px;">{{detail_form.total_price}}</span></el-col>
                        <el-col :span="8">应付金额<span style="color: red;margin-left: 10px;">{{detail_form.due_price}}</span></el-col>
                        <el-col :span="8">实付金额<span style="color: red;margin-left: 10px;">{{detail_form.actual_payment}}</span></el-col>
                  </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-search" @click="confirmOrder('orderForm')" round>确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        'name': 'order_detail',
        computed: {
            defaultPriceTitle: function () {
                return '设置规格价格,默认规格';
            },
        },
        props: ['order', 'showOrderDialog'],
        watch: {
            order: function (order) {
                console.log(order)
                    this.detail_form = {
                        nickname: order.nickname,
                        user_id: order.user_id,
                        phone: order.phone,
                        pay_type_word: order.pay_type_word,
                        pay_date: order.pay_date,
                        created_at: order.created_at,
                        status_word: order.status_word,
                        total_price:order.total_price,
                        actual_payment:order.actual_payment,
                        due_price:order.due_price,
                        orderGoods: Object.assign([],order.order_goods),
                        coupon: '',
                    };
            },
            showOrderDialog: function (show) {
                this.dialogVisible = show;
            }
        },
        data() {
            return {
                closeModal: false,
                dialogVisible: false,
                loading: false,
                detail_form: {
                    nickname: '',
                    user_id: '',
                    phone: '',
                    pay_type_word: '',
                    pay_date: '',
                    created_at: '',
                    status_word: '',
                    orderGoods: [],
                    coupon: '',
                    total_price:'',
                    actual_payment:'',
                    due_price:'',
                },
            };
        },
        mounted() {

        },
        methods: {
            dialogInit() {
                this.detail_form = {
                    nickname: '',
                    user_id: '',
                    phone: '',
                    pay_type_word: '',
                    pay_date: '',
                    created_at: '',
                    status_word: '',
                    orderGoods: [],
                    coupon: '',
                    total_price:'',
                    actual_payment:'',
                    due_price:'',
                };
            },
            resetCatForm(formName) {
                this.$refs[formName].resetFields();
            },
            noticeCloseDialog() {
                this.$emit('noticeCloseDialog');
            },
            confirmOrder(formName){
                this.dialogVisible=false;
                this.dialogInit();
            }
        }
    };
</script>

<style>
    .my-row{
        text-align: center
    }
    .el-row {
        margin-bottom: 20px;
      &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
