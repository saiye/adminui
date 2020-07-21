<template>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="店面列表" :inline="true" name="list">
            <el-form :inline="true"  ref="searchForm"  :model="form_list" class="demo-form-inline">
                <el-form-item prop="company_name">
                    <el-input v-model="form_list.company_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item prop="store_name">
                    <el-input v-model="form_list.store_name" placeholder="请输入店面名称"></el-input>
                </el-form-item>
                <el-form-item prop="real_name">
                    <el-input v-model="form_list.real_name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-form-item prop="listDate">
                    <el-date-picker
                            v-model="form_list.listDate"
                            type="datetimerange"
                            align="right"
                            :picker-options="pickerOptions"
                            start-placeholder="请选择起始日期"
                            end-placeholder="请选择结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetForm('searchForm')" round>重置</el-button>
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
                                       v-if='ListPaginate.total > 0'
                                       :page-sizes="ListPaginate.pageSizes"
                                       :page-size="ListPaginate.pageSize"
                                       :layout="ListPaginate.layout"
                                       :total="ListPaginate.total"
                                       :current-page='ListPaginate.pageIndex'
                                       @current-change='handleStoreChangePage'
                                       @size-change='handleStoreChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="店面审核" name="check">

            <el-form :inline="true"  ref="searchCheckForm" :model="form_check" class="demo-form-inline">
                <el-form-item prop="company_name">
                    <el-input v-model="form_check.company_name"  placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item prop="store_name">
                    <el-input v-model="form_check.store_name" placeholder="请输入店面名称"></el-input>
                </el-form-item>
                <el-form-item prop="real_name">
                    <el-input v-model="form_check.real_name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-form-item prop="listDate">
                    <el-date-picker
                            v-model="form_check.listDate"
                            type="datetimerange"
                            align="right"
                            :picker-options="pickerOptions"
                            start-placeholder="请选择起始日期"
                            end-placeholder="请选择结束日期"
                            :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchCheckList" round>查询</el-button>
                    <el-button type="danger" icon="el-icon-search" @click="resetCheckForm('searchCheckForm')" round>重置</el-button>
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
                <el-table-column prop="reason" label="拒绝原因"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleCheckStore(1,scope.row)" round>通过
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleCheckStore(2,scope.row)" round>拒绝</el-button>
                    </template>
                </el-table-column>
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
            <el-dialog
                    title="拒绝原因"
                    :visible.sync="dialogRejectVisible"
                    width="50%"
                    :before-close="handleDialogRejectClose">
                <el-form :model="rejectMessage" ref="reject_form" :rules="rejectRules" label-width="100px">

                    <el-form-item label="拒绝原因" prop="reason">
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="rejectMessage.reason">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogRejectVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doRejectCheck('reject_form')">确 定</el-button>
                </span>
            </el-dialog>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import add_store from '@/components/store/add_store';
    import {storeList, checkStore} from '@/api/store';

    export default {
        components: {
            add_store
        },
        data() {
            return {
                activeName: 'list',
                tableStoreData: [],
                dialogRejectVisible: false,
                tableStoreCheckData: [],
                ListPaginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                rejectMessage: {
                    check: '',
                    store_id: '',
                    reason: '',
                },
                rejectRules: {
                    reason: [
                        {required: true, message: '请输入拒绝原因最长100位', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100个字符', trigger: 'blur'}
                    ],
                },
                CheckPaginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                storeLoading: false,
                checkLoading: false,
                form_list: {
                    user_name: '',
                    store_name: '',
                    company_name: '',
                    real_name: '',
                    start_date: '',
                    end_date: '',
                    listDate: '',
                    check: [1],
                    limit: 15,
                    page: 1
                },
                form_check: {
                    user_name: '',
                    store_name: '',
                    company_name: '',
                    real_name: '',
                    start_date: '',
                    end_date: '',
                    listDate: '',
                    check: [0, 2],
                    limit: 15,
                    page: 1
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
                if (tab.name == 'list') {
                    this.loadStoreListData();
                } else {
                    this.loadStoreCheckListData();
                }
            },
            loadStoreListData() {
                this.storeLoading = true;
                storeList(this.form_list).then(response => {
                    this.tableStoreData = response.data.data.data;
                    this.ListPaginate.total = response.data.data.total;
                    this.storeLoading = false;
                })
                    .catch(function (error) {
                        console.log(error);
                    })
            },
            loadStoreCheckListData() {
                this.checkLoading = true;
                storeList(this.form_check).then(response => {
                    this.tableStoreCheckData = response.data.data.data;
                    this.CheckPaginate.total = response.data.data.total;
                    this.checkLoading = false;
                }).catch(function (error) {
                    console.log(error);
                })
            },
            handleStoreChangePage(page) {
                this.ListPaginate.pageIndex = page;
                this.form_list.page = page;
                this.loadStoreListData();

            },
            handleStoreChangeSize(pageSize) {
                this.ListPaginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadStoreListData();
            },
            handleStoreCheckChangePage(page) {
                this.CheckPaginate.pageIndex = page;
                this.form_check.page = page;
                this.loadStoreCheckListData();

            },
            handleStoreCheckChangeSize(pageSize) {
                this.CheckPaginate.pageSize = pageSize;
                this.form_check.limit = pageSize;
                this.loadStoreCheckListData();
            },
            onSearchList() {
                this.loadStoreListData();
            },
            onSearchCheckList() {
                this.loadStoreCheckListData();
            },
            handleCheckStore(check, row) {
                this.rejectMessage.check = check;
                this.rejectMessage.store_id = row.store_id;
                if (check == 2) {
                    this.dialogRejectVisible = true;
                } else {
                    checkStore(this.rejectMessage).then(response => {
                        this.dialogRejectVisible = false
                        this.loadStoreCheckListData();
                    }).catch(function (error) {
                        console.log(error);
                    }).then(function () {
                    });
                }
            },
            handleDialogRejectClose() {
                console.log(11)
            },
            doRejectCheck(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        checkStore(this.rejectMessage).then(response => {
                            this.dialogRejectVisible = false
                            this.loadStoreCheckListData();
                        }).catch(function (error) {
                            console.log(error);
                        }).then(function () {
                        });
                    } else {
                        return false;
                    }
                });

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.loadStoreListData();
            },
            resetCheckForm(formName) {
                this.$refs[formName].resetFields();
                this.loadStoreCheckListData();
            }
        }
    };
</script>

