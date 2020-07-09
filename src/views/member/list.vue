<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="会员列表"   name="list">
            <el-form  :model="form_list" >
                <el-form-item >
                    <el-row>
                        <el-col :span="6">
                            <el-input v-model="form_list.search_name"   placeholder="请输入会员的账号，昵称，真实姓名，邮箱地址进行搜索">
                            </el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <el-button
                            size="mini"
                            style="float: right;margin-right: 20px;margin-bottom: 10px;"
                            @click="openAddUserDialog"
                            round
                    >新增会员
                    </el-button>
                </el-col>
            </el-row>
            <add_user v-on:handelConfirm="handleDialogConfirm"  v-on:handelCance="handleDialogCance" v-bind:visible="visible"  v-bind:user="user"></add_user>
            <el-table
                    v-loading="ListLoading"
                    :data="tableListData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    :row-class-name="tableRowClassName"
                    style="width:100%">
                <el-table-column prop="id" label="序号" ></el-table-column>
                <el-table-column prop="account" label="会员账号"></el-table-column>
                <el-table-column  label="是否为法官">
                    <template slot-scope="scope">
                        <span>{{scope.row.judge==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="real_name" label="真实姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱地址"></el-table-column>
                <el-table-column prop="created_at" label="注册日期"></el-table-column>
                <el-table-column prop="lock" label="账号状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.lock==1?'正常':'已禁封'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="right" label="操作">
                    <template slot-scope="scope">
                        <span><el-button size="mini" type="primary"  @click="handleEdit(scope.row)" round>编辑</el-button></span>
                       <span> <el-button size="mini"  type="danger" @click="handleLock(2, scope.row)" round>禁封</el-button></span>
                      <span><el-button size="mini"  type="success" @click="handleLock(1, scope.row)" round>解封</el-button></span>
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
                                       @current-change='handleUserChangePage'
                                       @size-change='handleUserChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<style>
    .el-table .warning-row {
        background:#f3dfdf;
    }
    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
<script>
    import {userList,lockUser} from '@/api/user';
    import  add_user from '@/components/users/add_user';
    export default {
        components: {
            add_user,
        },
        data() {
            return {
                activeName: 'list',
                tableListData: [],
                ListLoading:false,
                visible:false,
                user: {
                    id: "",
                    account: "",
                    password: "",
                    affirm_password: "",
                    real_name: "",
                    nickname: "",
                    email: "",
                    sex:0,
                    judge:2,
                },
                Paginate: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                form_list: {
                    search_name: '',
                    page:1,
                    limit:15,
                },
            };
        },
        mounted() {
            this.loadUserListData();
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.lock==2) {
                    return 'warning-row';
                } else {
                    return 'success-row';
                }
            },
            handleLock(lock,row){
                lockUser({
                    'user_id':row.id,
                    'lock':lock,
                }).then(response => {
                       this.loadUserListData();
                    })
                    .catch(function(error) {
                    })
                    .then(function() {
                    });
            },
            openAddUserDialog(){
                this.visible=true;
                this.user.id='';
            },
            handleEdit(row){
                console.log('edit--props')
                this.visible=true;
                this.user=row;
            },
            handleDialogConfirm(){
                this.visible=false;
                this.loadUserListData();
            },
            handleDialogCance(){
                this.visible=false;
            },
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadUserListData(){
                userList(this.form_list)
                    .then(response => {
                        this.tableListData = response.data.data.data;
                        this.Paginate.total = response.data.data.total;
                    })
                    .catch(function(error) {
                    })
                    .then(function() {
                    });

            },
            handleUserChangePage(page){
                this.Paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadUserListData();
            },
            handleUserChangeSize(pageSize){
                this.Paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadUserListData();
            },
            onSearchList(){
                this.loadUserListData();
            }
        }
    };

</script>

