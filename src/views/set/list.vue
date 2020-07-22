<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设置列表" :inline="true" name="list">
            <el-form :inline="true" :model="form_list" ref="searchForm" class="demo-form-inline">
                <el-form-item prop="key">
                    <el-input v-model="form_list.key" placeholder="请输入key"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="loadConfigListData" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="12">
                    <el-button size="mini" style="float: right;margin-right: 20px;margin-bottom: 10px;"
                               @click="handlePutFile" round>刷新配置文件
                    </el-button>
                </el-col>
                <el-col :span="12">
                    <el-button size="mini" style="float: right;margin-right: 20px;margin-bottom: 10px;"
                               @click="handleAddConfig" round>新增配置
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
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="key" label="key"></el-table-column>
                <el-table-column prop="value" label="配置">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.value" border style="width: 100%">
                            <el-table-column prop="k" label="key"></el-table-column>
                            <el-table-column prop="v" label="值"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
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

                    <el-form-item label="配置key" prop="key">
                        <el-input v-model="dialog_form.key" placeholder="请输入key"></el-input>
                    </el-form-item>

                    <el-form-item label="配置" >
                            <el-table :data="dialog_form.value" border style="width: 100%">
                                <el-table-column type="index" :index="indexMethod" label="序号"></el-table-column>
                                <el-table-column prop="k" label="k">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.k" placeholder="请输入k"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="v" label="值">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.v" placeholder="请输入值"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column>
                                    <template slot="header">
                                        <span>操作</span>
                                        <el-button style="margin-left: 50px;" @click="addItem" type="primary">+
                                        </el-button>
                                    </template>
                                    <template slot-scope="scope">
                                        <span> <el-button size="mini" type="danger" @click="removeItem(scope.row)"
                                                          round>删除</el-button></span>
                                    </template>
                                </el-table-column>
                            </el-table>
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
    import {configList, editConfig, addConfig,putFile} from "@/api/set";

    export default {
        data() {
            let re = new RegExp("^[a-zA-Z]+$");
            let keyCheck = (rule, value, callback) => {

                if (!re.test(value)) {
                    return callback(new Error('key必须是英文'));
                }
                if (value.length < 1 || value.length > 30) {
                    return callback(new Error('key长度1-30个字符串'));
                }
                callback();
            };

            let checkConfig = (rule, value, callback) => {
                let l = value.length;
                if (l < 1) {
                    return callback(new Error('配置不能为空'));
                }
                value.forEach(function (v) {
                    if (!re.test(v.k)){
                        return callback(new Error('k只能是字母!'));
                    }
                    if (!v.v){
                        return callback(new Error('k值不能为空!'));
                    }
                });
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
                    value: '',
                    key: '',
                    limit: 10,
                    page: 1,
                },
                dialogVisible: false,
                dialog_form: {
                    value:[],
                    key: '',
                    id: '',
                },
                rules: {
                    value: [
                        {validator: checkConfig, trigger: 'blur'}
                    ],
                    key: [
                        {validator: keyCheck, trigger: 'blur'}
                    ],
                },
            };
        },
        mounted() {
            this.loadConfigListData();
        },
        computed: {
            title: function () {
                return this.dialog_form.id ? '编辑配置' : '新增配置';
            },
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadConfigListData() {
                configList(this.form_list).then(response => {
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
                this.loadConfigListData();
            },
            handleChangeSize(pageSize) {
                this.paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadConfigListData();
            },
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialog_form.id) {
                            editConfig(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadConfigListData();
                                }).catch(function (error) {
                            }).then(function () {
                            });
                        } else {
                            addConfig(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadConfigListData();
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
                this.dialog_form.value = row.value;
                this.dialog_form.key = row.key;
                this.dialog_form.id = row.id;
            },
            handleAddConfig() {
                this.dialog_form.value =[];
                this.dialog_form.key = '';
                this.dialog_form.id = '';
                this.dialogVisible = true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadConfigListData();
            },
            indexMethod(index) {
                return index + 1;
            },
            removeItem(row) {
                let index = this.dialog_form.value.indexOf(row);
                this.dialog_form.value.splice(index, 1);
            },
            addItem() {
                this.dialog_form.value.push({
                    k:'',
                    v:'',
                });
            },
            handlePutFile(){
                putFile();
            }
        }
    };
</script>

