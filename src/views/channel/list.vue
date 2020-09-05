<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="渠道列表" :inline="true" name="list">
            <el-form :inline="true" :model="form_list"  ref="searchForm"  class="demo-form-inline">
                <el-form-item prop="channel_name">
                    <el-input v-model="form_list.channel_name" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" icon="el-icon-search" @click="loadChannelListData" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <el-button
                            size="mini"
                            style="float: right;margin-right: 20px;margin-bottom: 10px;"
                            @click="handleAddChannel"
                            round
                    >新增渠道
                    </el-button>
                </el-col>
            </el-row>
            <el-table
                    v-loading="loading"
                    :data="tableRoomData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="channel_id" label="渠道id"></el-table-column>
                <el-table-column prop="channel_name" label="渠道名称"></el-table-column>
                <el-table-column prop="gameSrvAddr" label="游戏服地址"></el-table-column>
                <el-table-column prop="callBackServer" label="游戏服回调地址"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEditChannel(scope.row)" round>编辑渠道</el-button>
                        <el-button size="mini" type="danger" @click="handleRemoveChannel(scope.row)" round>删除</el-button>
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
            <!--dialog start-->
            <el-dialog :title=title :close-on-click-modal="closeModal" :visible.sync="dialogVisible" width="300px;">

                <el-form :model="dialog_form" ref="dialog_form" :rules="rules" label-width="100px">
                    <el-form-item label="渠道id" prop="channel_id">
                        <el-input v-model="dialog_form.channel_id" placeholder="请输入渠道id"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道名称" prop="channel_name">
                        <el-input v-model="dialog_form.channel_name" placeholder="请输入渠道名字最长30位"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏服地址" prop="gameSrvAddr">
                        <el-input v-model="dialog_form.gameSrvAddr" placeholder="请输入游戏服地址"></el-input>
                    </el-form-item>
                    <el-form-item label="回调地址" prop="callBackServer">
                        <el-input v-model="dialog_form.callBackServer" placeholder="请输入回调地址"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCance">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm('dialog_form')">确 定</el-button>
        </span>
            </el-dialog>
            <!--dialog end-->
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import {channelList, addChannel, editChannel,delChannel} from "@/api/channel";

    export default {
        data() {

            let gameSerAddrCheck = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('游戏服地址不能为空!'));
                }
                let l = value.length;
                if (value > 100) {
                    return callback(new Error('游戏服地址长度不能大于100字符'));
                }
                callback();
            };
            let callBackServerAddrCheck = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('游戏服回调地址不能为空!'));
                }
                let l = value.length;
                if (l > 100) {
                    return callback(new Error('游戏服回调地址长度不能大于100字符'));
                }
                callback();
            };
            return {
                activeName: 'list',
                tableRoomData: [],
                closeModal: false,
                isAdd: false,
                paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                loading: false,
                form_list: {
                    channel_name: '',
                    limit: 15,
                    page: 1,
                },
                dialogVisible: false,
                dialog_form: {
                    gameSrvAddr: '',
                    callBackServer: '',
                    channel_id: '',
                    channel_name: "",
                },
                rules: {
                    channel_name: [
                        {required: true, message: '请输入渠道名称最长30位', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 30个字符', trigger: 'blur'}
                    ],
                    gameSrvAddr: [
                        {validator: gameSerAddrCheck, trigger: 'blur'}
                    ],
                    callBackServer: [
                        {validator: callBackServerAddrCheck, trigger: 'blur'}
                    ]
                },
            };
        },
        mounted() {
            this.loadChannelListData();
        },
        computed: {
            title: function () {
                return this.dialog_form.channel_id ? '编辑渠道' : '新增渠道';
            },
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadChannelListData() {
                channelList(this.form_list).then(response => {
                    this.tableRoomData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });

                this.tableRoomData = [];
            },
            handleChangePage(page) {
                this.paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadChannelListData();
            },
            handleChangeSize(pageSize) {
                this.paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadChannelListData();
            },
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            addChannel(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadChannelListData();
                                }).catch(function (error) {
                            }).then(function () {

                            });
                        } else {
                            editChannel(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadChannelListData();
                                }).catch(function (error) {
                            }).then(function () {

                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            dialogCance() {
                this.dialogVisible = false;
            },
            handleEditChannel(row) {
                this.isAdd=false;
                this.dialogVisible = true
                this.dialog_form.gameSrvAddr = row.gameSrvAddr;
                this.dialog_form.callBackServer = row.callBackServer;
                this.dialog_form.channel_id = row.channel_id;
                this.dialog_form.channel_name = row.channel_name;
            },
            handleAddChannel() {
                this.isAdd=true;
                this.dialog_form.gameSrvAddr = '';
                this.dialog_form.loginCallBackAddr = '';
                this.dialog_form.channel_id = '';
                this.dialog_form.channel_name = '';
                this.dialogVisible = true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadChannelListData();
            },
            handleRemoveChannel(row){
                delChannel({'channel_id':row.channel_id}).then(response => {
                    this.loadChannelListData();
                }).catch(function (error) {
                }).then(function () {

                });
            }
        }
    };
</script>

