<template>
    <div>
        <el-dialog title="订单退款发起" :close-on-click-modal="closeModal" @close="noticeCloseDialog" :visible.sync="dialogVisible" width="80%">
            <el-row :gutter="20" class="my-row">
                <el-col :span="24">注意：发起退款，需要高权限人员审核，3个工作日内完成审核流程，请与顾客确认！</el-col>
            </el-row>
            <el-row :gutter="20" class="my-row">
                <el-col :span="3">部分商品退款</el-col>
                <el-col :span="21">
                    <el-table :data="detail_form.orderGoods" >
                        <el-table-column label="商品图">
                            <template slot-scope="scope">
                                <div>
                                    <el-image
                                            style="width:50px; height:50px"
                                            :src="scope.row.img50"
                                            fit="fill"></el-image>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
                        <el-table-column prop="tag" label="商品规格"></el-table-column>
                        <el-table-column prop="goods_price" label="单价"></el-table-column>
                        <el-table-column  label="数量">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.refund_num"  @change="resetComputerRefundFee" placeholder="请选择">
                                    <el-option
                                            v-for="n in scope.row.goods_num"
                                            :key="n"
                                            :label="n"
                                            :value="n"
                                    >
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="小计">
                            <template slot-scope="scope">
                                {{scope.row.goods_price*scope.row.refund_num}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.active?'success':'info'" @click="selectRefund(scope.row)"  :class="scope.row.active?'el-icon-circle-check':''" >发起退款</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="my-row">
                <el-col :span="3">全部退款</el-col>
                <el-col :span="18">
                    注意：全部退款，需要与顾客确认，是否有商品已经被使用，无法退款！
                </el-col>
                <el-col :span="3">
                    <el-tag :type="allRefund?'success':'info'"  @click="handelAllRefund()"  :class="allRefund?'el-icon-circle-check':''" >全部退款</el-tag>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="my-row">
                <el-col :span="21"></el-col>
                <el-col :span="3">退款订单金额:{{totalRefundFee}}</el-col>
            </el-row>
            <el-row :gutter="20" class="my-row">
                <el-col :span="3">退款原因</el-col>
                <el-col :span="3">
                    <el-select v-model="refund_reason_type"    placeholder="请选择退款原因">
                        <el-option
                                v-for="(n,k) in refundReasonTypeArr"
                                :key="k"
                                :label="n"
                                :value="k"
                        >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="18"></el-col>
            </el-row>

            <el-row :gutter="20" class="my-row">
                <el-col :span="3">沟通情况</el-col>
                <el-col :span="21">
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入与顾客沟通情况"
                            v-model="refund_reason">
                    </el-input>
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-search" @click="confirmOrder('orderForm')" round>确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {refundApply,refundConf} from  "@/api/order";
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
                this.detail_form = {
                    order_id: order.order_id,
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
                totalRefundFee:0,
                allRefund:false,
                refund_reason_type:'',
                refund_type:'',
                refund_reason:'',
                refundReasonTypeArr:[],
                refundGoodsArr:[],
                detail_form: {
                    order_id: '',
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
            this.loadRefundConf();
        },
        methods: {
            dialogInit() {
                this.refund_reason_type='';
                this.refund_reason='';
                this.refundGoodsArr=[],
                this.detail_form = {
                    nickname: '',
                    order_id: '',
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
                refundApply({
                    order_id:this.detail_form.order_id,
                    refund_type:this.refund_type,
                    refund_reason_type:this.refund_reason_type,
                    refund_reason:this.refund_reason,
                    refund_fee:this.totalRefundFee,
                    refundGoodsArr:this.refundGoodsArr,
                }).then(reponse => {
                    this.dialogVisible=false;
                })
            },
            selectRefund(row){
                row.active=!row.active;
                this.allRefund=false;
                this.refund_type=1;
                this.computerRefundFee();
            },
            resetComputerRefundFee(n){
                this.computerRefundFee();
            },
            computerRefundFee(){
                this.refund_type=1;
                let total=0;
                this.refundGoodsArr=[];
                if(this.detail_form.orderGoods){
                    this.detail_form.orderGoods.forEach((item)=> {
                        if(item.active){
                            total+=item.goods_price*item.refund_num;
                            this.refundGoodsArr.push({
                                order_goods_id:item.order_goods_id,
                                type:item.type,
                                count:item.refund_num,
                            });
                        }
                    });
                }
                this.totalRefundFee=total>this.detail_form.actual_payment?this.detail_form.actual_payment:total;
            },
            handelAllRefund(){
                this.refund_type=2;
                //全部退款
                this.allRefund=true;
                this.totalRefundFee=this.detail_form.actual_payment;
                this.detail_form.orderGoods.forEach(function (item,index) {
                    item.active=false;
                });
            },
            loadRefundConf(){
                refundConf({}).then(reponse => {
                    this.refundReasonTypeArr=reponse.data.refundReasonType;
                })
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

