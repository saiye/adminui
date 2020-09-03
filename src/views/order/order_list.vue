<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单列表" name="list">
            <el-form :model="form_list" :inline="true"  ref="searchForm">
                <el-form-item label="搜索条件" prop="time_type">
                    <el-select v-model="form_list.cat_id" clearable placeholder="请选择搜索条件">
                        <el-option
                                v-for="item in catSelectData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="searchName">
                    <el-input v-model="form_list.searchName" placeholder="请输入关键词搜索"></el-input>
                </el-form-item>
                <el-form-item prop="listDate">
                    <el-date-picker
                            v-model="form_list.listDate"
                            type="datetimerange"
                            align="right"
                            :picker-options="pickerOptions"
                            start-placeholder="请选择起始日期"
                            end-placeholder="请选择结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <order_detail  @noticeCloseDialog="noticeCloseDialog"  v-bind:order="order" v-bind:showOrderDialog="showOrderDialog" ></order_detail>
                </el-col>
                <el-col :span="24">
                    <refund_detail  @noticeCloseDialog="noticeCloseRefundDialog"  v-bind:order="refundOrder" v-bind:showOrderDialog="showRefundOrderDialog" ></refund_detail>
                </el-col>
            </el-row>

            <el-table
                    v-loading="ListLoading"
                    :data="tableGoodsListData"
                    border
                    stripe
                    highlight-current-row
                    :row-class-name="tableRowClassName"
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="info" label="商品名称"></el-table-column>
                <el-table-column prop="order_sn" label="订单号"></el-table-column>
                <el-table-column prop="pay_date" label="支付时间"></el-table-column>
                <el-table-column   label="订单金额">
                    <template slot-scope="scope">
                        <span style="color: red">{{scope.row.due_price>0?scope.row.due_price:scope.row.actual_payment}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname"  label="用户昵称"></el-table-column>
                <el-table-column prop="user_id"  label="用户id"></el-table-column>
                <el-table-column  prop="pay_type_word" label="支付方式"></el-table-column>
                <el-table-column   label="订单状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status_word}}</span>
                        <span v-if="scope.row.is_abnormal==1" style="color: red">|异常订单</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作栏" width="350">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleQueryOrderDetail(scope.row)" round>实时查询</el-button>
                        <el-button size="mini" @click="handleOrderDetail(scope.row)" round>订单详情</el-button>
                        <el-button size="mini" type="primary" @click="handleStatusOrder(scope.row)" round>设置订单已完成</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="售后" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="scope.row.pay_status==1" type="danger" @click="openRefundOrderDialog(scope.row)" round>发起退款</el-button>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination background
                                       v-if='Paginate.total > 0'
                                       :page-sizes="Paginate.pageSizes"
                                       :page-size="Paginate.pageSize"
                                       :layout="Paginate.layout"
                                       :total="Paginate.total"
                                       :current-page='Paginate.pageIndex'
                                       @current-change='handleListChangePage'
                                       @size-change='handleListChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import {orderList,orderDetail,setOrder,selectConf,findOrder} from '@/api/order';
    import order_detail from '@/components/order/detail';
    import refund_detail from '@/components/order/refund';
    export default {
        components: {
            order_detail,refund_detail
        },
        data() {
            return {
                catSelectData: [],
                activeName: 'list',
                tableGoodsListData: [],
                ListLoading: false,
                showOrderDialog:false,
                showRefundOrderDialog:false,
                order:null,
                refundOrder:null,
                Paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                form_list: {
                    searchName: '',
                    cat_id: '',
                    page: 1,
                    limit:15,
                    listDate:[]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            };
        },
        mounted() {
            this.loadOrderListData();
            this.loadCatList();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadOrderListData() {
                orderList(this.form_list)
                    .then(response => {
                        this.tableGoodsListData = response.data.data.data;
                        this.Paginate.total = response.data.data.total;
                    })
                    .catch(function (error) {
                    })
                    .then(function () {
                    });
            },
            loadCatList(){
                //下拉框分类
                selectConf({limit:500,page:1}).then(response => {
                    this.catSelectData = response.data;
                })
            },
            handleListChangePage(page) {
                this.Paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadOrderListData();
            },
            handleListChangeSize(pageSize) {
                this.Paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadOrderListData();
            },
            onSearchList() {
                this.loadOrderListData();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadOrderListData();
            },
            handleOrderDetail(row){
                this.order=Object.assign({},row);
                this.showOrderDialog=true;
            },
            handleStatusOrder(row){
                setOrder({order_id:row.order_id}) .then(response => {
                    this.loadOrderListData();
                })
            },
            noticeCloseDialog(){
                this.showOrderDialog=false;
            },
            noticeCloseRefundDialog(){
                this.showRefundOrderDialog=false;
            },
            openRefundOrderDialog(row){
                this.refundOrder=Object.assign({},row);
                this.showRefundOrderDialog=true;
            },
            handleQueryOrderDetail(row){
                findOrder({
                    order_id:row.order_id
                }).then(response => {
                    this.loadOrderListData();
                });
            },
            tableRowClassName({row, rowIndex}) {
                if (row.is_abnormal=== 1) {
                    return 'warning-row';
                }
                return 'success-row';
            }
        }
    };

</script>

<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>

