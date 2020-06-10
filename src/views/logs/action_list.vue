<template>
    <div>
        <el-form :inline="true" label-width="80px"  size="mediumfff" :model="form_list" class="demo-form-inline">
            <el-form-item  label="用户名">
                <el-input v-model="form_list.user" placeholder="请输入user"></el-input>
            </el-form-item>
            <el-form-item label="uri">
                <el-input v-model="form_list.uri" placeholder="请输入uri"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
                v-loading="loading"
                :data="tableData"
                border
                stripe
                highlight-current-row
                header-cell-class-name="table-header-class"
                style="width:100%">

            <el-table-column prop="id" label="id">
            </el-table-column>
            <el-table-column prop="date" label="时间">
            </el-table-column>
            <el-table-column prop="guard" label="guard">
            </el-table-column>
            <el-table-column prop="ip" label="ip">
            </el-table-column>
            <el-table-column prop="uri" label="uri"></el-table-column>
            <el-table-column prop="params" label="params"></el-table-column>
            <el-table-column prop="user" label="user"></el-table-column>
            <el-table-column prop="user_id" label="user_id"></el-table-column>
            <el-table-column prop="http_type" label="http_type">
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="24">
                <div class="pagination">
                    <el-pagination background
                                   v-if='paginate.total > 0'
                                   :page-sizes="paginate.pageSizes"
                                   :page-size="paginate.pageSize"
                                   :layout="paginate.layout"
                                   :total="paginate.total"
                                   :current-page='paginate.pageIndex'
                                   @current-change='handleCurrentChange'
                                   @size-change='handleSizeChange'>
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {actionLogList} from '@/api/log'

    export default {
        created() {
        },
        data() {
            return {
                tableData: [],
                loading: true,
                form_list:{
                  page:1,
                  limit:15,
                  user:'',
                  http_type:'',
                  uri:'',
                },
                //需要给分页组件传的信息
                paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {

                actionLogList(this.form_list).then(response => {
                    this.tableData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });
            },
            // 每页多少条切换
            handleSizeChange(pageSize) {
                this.form_list.limit = pageSize;
                this.loadData();
            },
            // 上下分页
            handleCurrentChange(page) {
                this.form_list.page= page;
                this.loadData();
            },
            onSearchList(){
                actionLogList(this.form_list).then(response => {
                    this.tableData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });
            }
        }
    };
</script>

