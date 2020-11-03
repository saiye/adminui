<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="VIP会员" name="list">
            <el-form :model="form_list" ref="searchForm">
                <el-form-item prop="search_name">
                    <el-row>
                        <el-col :span="6">
                            <el-input v-model="form_list.search_name" placeholder="请输入会员的账号，昵称">
                            </el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <bag_list v-on:handelConfirm="handleDialogBagListConfirm" v-on:handelCance="handleDialogBagListCance" v-bind:visible="bagListVisible" v-bind:user="user"></bag_list>

            <bag_log v-on:handelConfirm="handleDialogBagLogConfirm" v-on:handelCance="handleDialogBagLogCance" v-bind:visible="bagLogVisible" v-bind:user="user"></bag_log>
            <el-table
                    v-loading="ListLoading"
                    :data=" tableVipUserData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    :row-class-name="tableRowClassName"
                    style="width:100%">
                <el-table-column :index="indexUserList" type="index" label="序号"></el-table-column>
                <el-table-column  label="头像">
                    <template slot-scope="scope">
                        <div>
                            <el-image style="width:50px; height:50px" :src="scope.row.icon" fit="fill"></el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="account" label="会员账号"></el-table-column>
                <el-table-column label="是否为法官">
                    <template slot-scope="scope">
                        <span>{{scope.row.judge==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="real_name" label="真实姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱地址"></el-table-column>
                <el-table-column prop="created_at" label="注册日期"></el-table-column>
                <el-table-column prop="lock" label="会员类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.lock==1?'正常':'已禁封'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="lock" label="会员时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.created_at}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="right" width="180" label="操作">
                    <template slot-scope="scope">
                        <span><el-button size="mini" type="primary" @click="showUserBagListLog(scope.row)" round>道具流水</el-button></span>
                        <span><el-button size="mini" type="primary" @click="showUserBagList(scope.row)" round>背包</el-button></span>
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
                                       @current-change='handleVipUserChangePage'
                                       @size-change='handleVipUserChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<style>
    .el-table .warning-row {
        background: #f3dfdf;
    }
    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
<script>
    import {userList, lockUser, setJudge} from '@/api/user';
    import bag_list from '@/components/bag/bag_list';
    import bag_log from '@/components/bag/bag_log';

    export default {
        components: {
            bag_list,bag_log
        },
        data() {
            return {
                activeName: 'list',
                tableVipUserData: [],
                ListLoading: false,
                bagListVisible: false,
                bagLogVisible: false,
                Paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                user: {
                    id: "",
                    account: "",
                    real_name: "",
                    nickname: "",
                    email: "",
                    sex: 0
                },
                form_list: {
                    search_name: '',
                    page: 1,
                    limit: 15,
                },
            };
        },
        mounted() {
            this.loadVipUserListData();
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.lock == 2) {
                    return 'warning-row';
                } else {
                    return 'success-row';
                }
            },
            handleDialogBagListConfirm() {
                this.bagListVisible = false;
                this.loadVipUserListData();
            },
            handleDialogBagListCance() {
                this.bagListVisible = false;
            },
            handleDialogBagLogConfirm() {
                this.bagLogVisible = false;
                this.loadVipUserListData();
            },
            handleDialogBagLogCance() {
                this.bagLogVisible = false;
            },
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadVipUserListData() {
                userList(this.form_list)
                    .then(response => {
                        this. tableVipUserData = response.data.data.data;
                        this.Paginate.total = response.data.data.total;
                    })
                    .catch(function (error) {
                    })
                    .then(function () {
                    });

            },
            handleVipUserChangePage(page) {
                this.Paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadVipUserListData();
            },
            handleVipUserChangeSize(pageSize) {
                this.Paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadVipUserListData();
            },
            onSearchList() {
                this.loadVipUserListData();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form_list.search_name = '';
                this.form_list.page = 1;
                this.form_list.limit = 15;
                this.loadVipUserListData();
            },
            showUserBagList(row){
                this.bagListVisible=true;
            },
            showUserBagListLog(row){
                this.bagLogVisible=true;
            },
            indexUserList(index){
                return index+1;
            }
        }
    };

</script>

