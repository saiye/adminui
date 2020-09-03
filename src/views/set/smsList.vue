<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="短信发送列表" :inline="true" name="list">
            <el-form :inline="true" :model="form_list" ref="searchForm" class="demo-form-inline">
                <el-form-item prop="type">
                    <el-input v-model="form_list.type" placeholder="请输入type"></el-input>
                </el-form-item>
                <el-form-item prop="area_code">
                    <el-input v-model="form_list.area_code" placeholder="请输入area_code"></el-input>
                </el-form-item>
                <el-form-item prop="area_code">
                    <el-input v-model="form_list.phone" placeholder="请输入phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="loadSmsListData" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    v-loading="loading"
                    :data="tableSmsData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="area_code" label="区号"></el-table-column>
                <el-table-column prop="phone" label="号码"></el-table-column>
                <el-table-column prop="msg" label="消息">
                    <template slot-scope="scope">
                        <el-row >
                            <el-col v-for="(v, n) in scope.row.msg " v-bind:key="v" >{{ n }}: {{ v }}</el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="短信类型"></el-table-column>
                <el-table-column prop="action" label="action"></el-table-column>
                <el-table-column prop="status_word" label="状态">
                </el-table-column>
                <el-table-column prop="res" label="接口结果">
                    <template slot-scope="scope">
                        <el-row >
                            <el-col v-for="(v, n) in scope.row.res" v-bind:key="n" >{{ n }}: {{ v }}</el-col>
                        </el-row>
                    </template>
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
                                       @current-change='handleChangePage'
                                       @size-change='handleChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import {sendSmsList} from "@/api/set";

    export default {
        data() {
            return {
                activeName: 'list',
                tableSmsData: [],
                closeModal: false,
                paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                loading: false,
                form_list: {
                    area_code: '',
                    phone: '',
                    type: '',
                    limit: 10,
                    page: 1,
                },
                dialogVisible: false,
            };
        },
        mounted() {
            this.loadSmsListData();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadSmsListData() {
                sendSmsList(this.form_list).then(response => {
                    this.tableSmsData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });
                this.tableSmsData = [];
            },
            handleChangePage(page) {
                this.paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadSmsListData();
            },
            handleChangeSize(pageSize) {
                this.paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadSmsListData();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadSmsListData();
            },
        }
    };
</script>

