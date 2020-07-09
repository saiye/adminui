<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="板子列表" :inline="true" name="list">
            <el-form :inline="true" :model="form_list" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="form_list.board_name" placeholder="请输入板子名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form_list.dup_id" placeholder="请输入板子id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="loadBoardListData" round>查询</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <el-button
                            size="mini"
                            style="float: right;margin-right: 20px;margin-bottom: 10px;"
                            @click="handleAddBoard"
                            round
                    >新增板子
                    </el-button>
                    <el-button
                            size="mini"
                            style="float: right;margin-right: 20px;margin-bottom: 10px;"
                            @click="importBoard"
                            round
                    >导入板子
                    </el-button>

                </el-col>
            </el-row>
            <el-table
                    v-loading="loading"
                    :data="tableBoardData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="board_id" label="序号"></el-table-column>
                <el-table-column prop="board_name" label="板子名称"></el-table-column>
                <el-table-column prop="dup_id" label="板子id"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEditBoard(scope.row)" round>编辑</el-button>
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
                    <el-form-item label="板子名称" prop="board_name">
                        <el-input v-model="dialog_form.board_name" placeholder="请输入板子名字最长30位"></el-input>
                    </el-form-item>

                    <el-form-item label="板子id" prop="dup_id">
                        <el-input v-model="dialog_form.dup_id" placeholder="请输入板子id"></el-input>
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
    import {boardList,addBoard,editBoard} from "@/api/board";

    export default {
        data() {

            let dupIdCheck = (rule, value, callback) => {
                if (isNaN(value)) {
                    return callback(new Error('板子id必须是一个数字!'));
                }
                if(value<1){
                    return callback(new Error('板子id必须大于0!'));
                }
                callback();
            };

            return {
                activeName: 'list',
                tableBoardData: [],
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
                    board_name: '',
                    dup_id: '',
                    limit: 10,
                    page: 1,
                },
                dialogVisible: false,
                dialog_form: {
                    board_name: '',
                    dup_id: '',
                    board_id: '',
                },
                rules: {
                    board_name: [
                        {required:true, message: '请输入渠道名称最长30位', trigger: 'blur'},
                        {min:1,max:30, message: '长度在 1 到 30个字符', trigger: 'blur'}
                    ],
                    dup_id: [
                        {validator: dupIdCheck, trigger: 'blur'}
                    ],
                },
            };
        },
        mounted() {
            this.loadBoardListData();
        },
        computed: {
            title: function () {
                return this.dialog_form.board_id ? '编辑板子' : '新增板子';
            },
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadBoardListData() {
                boardList(this.form_list).then(response => {
                    this.tableBoardData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });

                this.tableBoardData = [];
            },
            handleChangePage(page) {
                this.paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadBoardListData();
            },
            handleChangeSize(pageSize) {
                this.paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadBoardListData();
            },
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialog_form.board_id) {
                            editBoard(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadBoardListData();
                                }).catch(function (error) {
                            }).then(function () {
                            });
                        } else {
                            addBoard(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadBoardListData();
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
            handleEditBoard(row) {
                this.dialogVisible = true
                this.dialog_form.board_name =row.board_name;
                this.dialog_form.dup_id=row.dup_id;
                this.dialog_form.board_id=row.board_id;
            },
            handleAddBoard() {
                this.dialog_form.board_name ='';
                this.dialog_form.dup_id='';
                this.dialog_form.board_id='';
                this.dialogVisible = true;
            },
            importBoard(){
                alert('xx')
            }
        }
    };
</script>

