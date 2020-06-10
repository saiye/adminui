<template>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="店面列表" :inline="true"  name="list">
            <el-form :inline="true" :model="form_list" class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="form_list.company_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="form_list.store_name" placeholder="请输入店面名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="form_list.real_name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-date-picker
                        v-model="form_list.listDate"
                        type="datetimerange"
                        align="right"
                        :picker-options="pickerOptions"
                        start-placeholder="请选择起始日期"
                        end-placeholder="请选择结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                </el-form-item>
            </el-form>
            <add_store v-on:success="loadStoreListData"></add_store>
            <el-table
                    v-loading="storeLoading"
                    :data="tableStoreData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="store_id" label="序号" width="100"></el-table-column>
                <el-table-column prop="store_name" label="店面名称"></el-table-column>
                <el-table-column prop="company.company_name" label="商户名称"></el-table-column>
                <el-table-column prop="created_at" width="100" label="注册日期"></el-table-column>
                <el-table-column label="地区">
                    <template slot-scope="scope">
                      <span>{{scope.row.province.area_name}}/{{scope.row.city.area_name}}/{{scope.row.region.area_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="staff.real_name" width="100" label="联系人"></el-table-column>
                <el-table-column prop="staff.phone" label="联系电话"></el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination background
                                       v-if='StorePaginate.total > 0'
                                       :page-sizes="StorePaginate.pageSizes"
                                       :page-size="StorePaginate.pageSize"
                                       :layout="StorePaginate.layout"
                                       :total="StorePaginate.total"
                                       :current-page='StorePaginate.pageIndex'
                                       @current-change='handleStoreChangePage'
                                       @size-change='handleStoreChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="店面审核" name="check">

            <el-form :inline="true" :model="form_store" class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="form_store.company_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="form_store.store_name" placeholder="请输入店面名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="form_store.real_name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-date-picker
                        v-model="form_store.listDate"
                        type="datetimerange"
                        align="right"
                        :picker-options="pickerOptions"
                        start-placeholder="请选择起始日期"
                        end-placeholder="请选择结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchCheckList" round>查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    v-loading="storeLoading"
                    :data="tableStoreCheckData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="store_id" label="序号" width="100"></el-table-column>
                <el-table-column prop="store_name" label="店面名称"></el-table-column>
                <el-table-column prop="company.company_name" label="商户名称"></el-table-column>
                <el-table-column prop="created_at" width="100" label="注册日期"></el-table-column>
                <el-table-column label="地区">
                    <template slot-scope="scope">
                        <span>{{scope.row.province.area_name}}/{{scope.row.city.area_name}}/{{scope.row.region.area_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="staff.real_name" width="100" label="联系人"></el-table-column>
                <el-table-column prop="staff.phone" label="联系电话"></el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination background
                                       v-if='CheckPaginate.total > 0'
                                       :page-sizes="CheckPaginate.pageSizes"
                                       :page-size="CheckPaginate.pageSize"
                                       :layout="CheckPaginate.layout"
                                       :total="CheckPaginate.total"
                                       :current-page='CheckPaginate.pageIndex'
                                       @current-change='handleStoreCheckChangePage'
                                       @size-change='handleStoreCheckChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>

        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import add_store from '@/components/store/add_store';
    import {storeList} from '@/api/store';
    export default {
        components:{
            add_store
        },
        data() {
            return {
                activeName: 'list',
                tableStoreData: [],
                tableStoreCheckData: [],
                StorePaginate: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                CheckPaginate: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                storeLoading:false,
                checkLoading:false,
                form_list: {
                    user_name: '',
                    store_name:'',
                    company_name: '',
                    real_name: '',
                    start_date:'',
                    end_date:'',
                    listDate:'',
                    limit:15,
                    page:1
                },
                form_store: {
                    user_name: '',
                    store_name:'',
                    company_name: '',
                    real_name: '',
                    start_date:'',
                    end_date:'',
                    listDate:'',
                    limit:15,
                    page:1
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
            this.loadStoreListData();
        },
        methods: {
            handleTabClick(tab, event) {
                if(tab.name=='list'){
                    this.loadStoreListData();
                }else{
                    this.loadStoreCheckListData();
                }
            },
            loadStoreListData(){
              this.storeLoading=true;
              storeList(this.form_list).then(response => {
                    this.tableStoreData = response.data.data.data;
                    this.StorePaginate.total = response.data.data.total;
                    this.storeLoading = false;
                })
                .catch(function(error) {
                    console.log(error);
                })
            },
            loadStoreCheckListData(){
                this.checkLoading = true;
                storeList(this.form_store).then(response => {
                    this.tableStoreCheckData = response.data.data.data;
                    this.CheckPaginate.total = response.data.data.total;
                    this.checkLoading = false;
                }).catch(function(error) {
                        console.log(error);
                })
            },
            handleStoreChangePage(page){
                this.StorePaginate.pageIndex = page;
                this.form_list.page=page;
                this.loadStoreListData();

            },
            handleStoreChangeSize(pageSize){
                this.StorePaginate.pageSize = pageSize;
                this.form_list.limit=pageSize;
                this.loadStoreListData();
            },
            handleStoreCheckChangePage(page){
                this.CheckPaginate.pageIndex = page;
                this.form_store.page=page;
                this.loadStoreCheckListData();

            },
            handleStoreCheckChangeSize(pageSize){
                this.CheckPaginate.pageSize = pageSize;
                this.form_store.limit=pageSize;
                this.loadStoreCheckListData();
            },
            onSearchList(){
                this.loadStoreListData();
            },
            onSearchCheckList(){
                this.loadStoreCheckListData();
            },
            handleStoreLook(index, row){

            }
        }
    };
</script>

