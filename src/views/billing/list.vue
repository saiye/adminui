<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="计费模式列表" name="list">
            <el-form :model="form_list" :inline="true"  ref="searchForm">
                <el-form-item prop="search_name">
                    <el-input v-model="form_list.search_name" placeholder="请输入店面，模式名进行搜索"></el-input>
                </el-form-item>

                <el-form-item label="请选择计费单位" prop="time_type">
                    <el-select v-model="form_list.time_type" clearable placeholder="请选择计费单位">
                        <el-option
                                v-for="item in TimeTypeArr"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="货币类型" prop="price_type">
                    <el-select v-model="form_list.price_type" clearable placeholder="请选择货币类型">
                        <el-option
                                v-for="item in PriceTypeArr"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
                </el-form-item>
            </el-form>
            <cp_add_billing v-bind:TimeTypeArr="TimeTypeArr" v-bind:PriceTypeArr="PriceTypeArr" v-on:success="loadUserListData"></cp_add_billing>
            <el-table
                    v-loading="ListLoading"
                    :data="tableListData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column :index="indexBillingList" type="index" label="序号"></el-table-column>
                <el-table-column prop="company_name" label="商家名称"></el-table-column>
                <el-table-column prop="store_name" label="面店名称"></el-table-column>
                <el-table-column prop="billing_name" label="模式名称"></el-table-column>
                <el-table-column  label="计费单价">
                    <template slot-scope="scope">
                        <span>{{ scope.row.price }}({{ scope.row.price_type}})</span>
                    </template>
                </el-table-column>
                <el-table-column label="计费单位">
                    <template slot-scope="scope">
                            <span>{{ scope.row.time_unit }}/{{ scope.row.time_type}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="注册日期"></el-table-column>
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
                                       @current-change='handleUserChangePage'
                                       @size-change='handleUserChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import {billingConfig,billingList} from '@/api/billing';
    import cp_add_billing from '@/components/billing/cp_add_billing';

    export default {
        components: {
            cp_add_billing,
        },
        data() {
            return {
                TimeTypeArr: [],
                PriceTypeArr: [],
                activeName: 'list',
                tableListData: [],
                ListLoading: false,
                Paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                form_list: {
                    search_name: '',
                    page: 1,
                    limit:15,
                    time_type: '',
                    price_type: '',
                },
            };
        },
        mounted() {
            this.loadUserListData();
            this.loadBillingConfig();
        },
        methods: {

            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadUserListData() {
                billingList(this.form_list)
                    .then(response => {
                        this.tableListData = response.data.data.data;
                        this.Paginate.total = response.data.data.total;
                    })
                    .catch(function (error) {
                    })
                    .then(function () {
                    });

            },
            loadBillingConfig() {

                billingConfig().then(response => {
                    this.TimeTypeArr =response.data.time_type,
                    this.PriceTypeArr = response.data.price_type;
                }).catch(function (error) {

                }).then(function () {

                });

            },
            handleUserChangePage(page) {
                this.Paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadUserListData();
            },
            handleUserChangeSize(pageSize) {
                this.Paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadUserListData();
            },
            onSearchList() {
                this.loadUserListData();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadUserListData();
            },
            indexBillingList(index){
                return index+1;
            }
        }
    };

</script>

