<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="国际区号列表" :inline="true" name="list">
            <el-form :inline="true"  :model="form_list" ref="searchForm"  class="demo-form-inline">
                <el-form-item prop="key">
                    <el-input v-model="form_list.search_name" placeholder="请输入地区"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="loadAreaListData" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="12">
                    <el-button size="mini" style="float: right;margin-right: 20px;margin-bottom: 10px;"
                               @click="handleAddAreaCode" round>新增地区
                    </el-button>
                </el-col>
            </el-row>
            <el-table
                    v-loading="loading"
                    :data="tableAreaListData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="area_code" label="区号"></el-table-column>
                <el-table-column prop="name_zh_cn" label="国家名称(简体)"></el-table-column>
                <el-table-column prop="name_zh_hk" label="国家名称(繁体)"></el-table-column>
                <el-table-column prop="name_en" label="国家名称(英文)"></el-table-column>
                <el-table-column prop="letter_en" label="英文首字母"></el-table-column>
                <el-table-column prop="letter_zh_cn" label="中文名称首字母"></el-table-column>
                <el-table-column prop="pattern" label="正则"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEditArea(scope.row)" round>编辑</el-button>
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

                    <el-form-item label="区号" prop="key">
                        <el-input v-model="dialog_form.area_code" placeholder="请输入区号"></el-input>
                    </el-form-item>

                    <el-form-item label="国家名称" prop="name_zh_cn">
                        <el-input v-model="dialog_form.name_zh_cn" placeholder="国家名称"></el-input>
                    </el-form-item>

                    <el-form-item label="国家英文名称" prop="name_en">
                        <el-input v-model="dialog_form.name_en" placeholder="国家英文名称"></el-input>
                    </el-form-item>
                    <el-form-item label="国家繁体名称" prop="name_zh_hk">
                        <el-input v-model="dialog_form.name_zh_hk" placeholder="国家繁体名称"></el-input>
                    </el-form-item>

                    <el-form-item label="英文名称首字母" prop="letter_en">
                        <el-input v-model="dialog_form.letter_en" placeholder="英文名称首字母"></el-input>
                    </el-form-item>

                    <el-form-item label="拼音首字母" prop="letter_zh_cn">
                        <el-input v-model="dialog_form.letter_zh_cn" placeholder="拼音首字母"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号正则" prop="pattern">
                        <el-input v-model="dialog_form.pattern" placeholder="手机号正则"></el-input>
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
    import {areaList,addArea,editArea} from "@/api/set";

    export default {
        data() {
            let re = new RegExp("^[a-zA-Z]+$");
            let keyCheck = (rule, value, callback) => {
                if (!re.test(value)) {
                    return callback(new Error('必须是英文'));
                }
                if (value.length < 1 || value.length > 2) {
                    return callback(new Error('长度1-2个字符串'));
                }
                callback();
            };
            let checkEnName = (rule, value, callback) => {
                if (!re.test(value.replace(/\s+/g,""))) {
                    return callback(new Error('必须是英文'));
                }
                if (value.length < 1 || value.length > 32) {
                    return callback(new Error('长度1-32个字符串'));
                }
                callback();
            };
            let checkAreaCode= (rule, value, callback) => {
                if (!'^[0-9]+$'.test(value)) {
                    return callback(new Error('必须是英文'));
                }
                if (value.length < 1 || value.length > 32) {
                    return callback(new Error('长度1-32个字符串'));
                }
                callback();
            };
            return {
                activeName: 'list',
                tableAreaListData: [],
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
                    search_name: '',
                    limit: 10,
                    page: 1,
                },
                dialogVisible: false,
                dialog_form: {
                    name_zh_cn:'',
                    name_en:'',
                    name_zh_hk:'',
                    area_code:'',
                    letter_en:'',
                    letter_zh_cn:'',
                    pattern:'',
                    id: '',
                },
                rules: {
                    name_zh_cn: [
                        {required: true, message: '请输入地区名称1-32位', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32个字符', trigger: 'blur'}
                    ],
                    name_zh_hk:[
                        {required: true, message: '请输入地区名称1-32位', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32个字符', trigger: 'blur'}
                    ],
                    name_en: [
                        { validator:checkEnName, trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32个字符', trigger: 'blur'}
                    ],
                    letter_en:[
                        { validator:keyCheck, trigger: 'blur'}
                    ],
                    letter_zh_cn:[
                        { validator:keyCheck, trigger: 'blur'}
                    ],
                    area_code:[
                        { validator:checkAreaCode, trigger: 'blur'}
                    ],
                },
            };
        },
        mounted() {
            this.loadAreaListData();
        },
        computed: {
            title: function () {
                return this.dialog_form.id ? '编辑地区' : '新增地区';
            },
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadAreaListData() {
                //areaList,addArea,editArea
                areaList(this.form_list).then(response => {
                    this.tableAreaListData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                });
                this.tableAreaListData = [];
            },
            handleChangePage(page) {
                this.paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadAreaListData();
            },
            handleChangeSize(pageSize) {
                this.paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadAreaListData();
            },
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialog_form.id) {
                            editArea(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadAreaListData();
                                }).catch(function (error) {
                            }).then(function () {
                            });
                        } else {
                            addArea(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.loadAreaListData();
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
            handleEditArea(row) {
                this.dialogVisible = true
                this.dialog_form = Object.assign({},row);
            },
            handleAddAreaCode() {
                this.dialog_form.id = '';
                this.dialogVisible = true;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadAreaListData();
            },
            indexMethod(index) {
                return index + 1;
            },
        }
    };
</script>

