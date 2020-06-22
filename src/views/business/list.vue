<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商户列表" :inline="true" name="list">

            <el-form :inline="true" :model="form_list" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="form_list.company_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form_list.real_name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form_list.state_id" clearable placeholder="请选择国家">
                        <el-option
                                v-for="item in state"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-date-picker
                        v-model="form_list.listDate"
                        type="datetimerange"
                        align="right"
                        :picker-options="pickerOptions"
                        start-placeholder="请选择起始日期"
                        end-placeholder="请选择结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
                </el-form-item>
            </el-form>
            <add_business v-bind:state="state" v-on:success="loadBusinessListData"></add_business>
            <el-table
                    v-loading="BusinessLoading"
                    :data="tableBusinessData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%"
            >
                <el-table-column prop="company_id" label="序号"></el-table-column>
                <el-table-column prop="manage.account" label="账号"></el-table-column>
                <el-table-column prop="company_name" label="商户名称"></el-table-column>
                <el-table-column prop="state.name" label="国家"></el-table-column>
                <el-table-column prop="manage.real_name" label="联系人"></el-table-column>
                <el-table-column prop="manage.phone" label="联系电话"></el-table-column>
                <el-table-column prop="created_at" label="注册日期"></el-table-column>
                <el-table-column prop="status" label="状态"></el-table-column>

                <el-table-column align="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="lockCompany(1, scope.row)" type="primary"
                                   v-if="scope.row.status==2" round>解冻
                        </el-button>
                        <el-button size="mini" @click="lockCompany(2, scope.row)" type="danger"
                                   v-if="scope.row.status==1" round>冻结
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                background
                                v-if="BusinessPaginate.total > 0"
                                :page-sizes="BusinessPaginate.pageSizes"
                                :page-size="BusinessPaginate.pageSize"
                                :layout="BusinessPaginate.layout"
                                :total="BusinessPaginate.total"
                                :current-page="BusinessPaginate.pageIndex"
                                @current-change="handleBusinessChangePage"
                                @size-change="handleBusinessChangeSize"
                        ></el-pagination>
                    </div>
                </el-col>
            </el-row>

        </el-tab-pane>
        <el-tab-pane label="商户审核" name="check">
            <el-dialog
                    title="拒绝原因"
                    :visible.sync="dialogRejectVisible"
                    width="50%"
                    :before-close="handleDialogRejectClose">
                <el-form :model="rejectMessage"  ref="reject_form" :rules="rejectRules" label-width="100px">

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

            <el-form :inline="true" :model="check_list" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="check_list.company_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="check_list.real_name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="check_list.state_id" clearable placeholder="请选择国家">
                        <el-option
                                v-for="item in state"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-date-picker
                        v-model="check_list.listDate"
                        type="datetimerange"
                        align="right"
                        :picker-options="pickerOptions"
                        start-placeholder="请选择起始日期"
                        end-placeholder="请选择结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearchCheckList" round>查询</el-button>
                </el-form-item>
            </el-form>

            <el-table
                    v-loading="BusinessCheckLoading"
                    :data="tableCheckBusinessData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%"
            >
                <el-table-column prop="company_id" label="序号"></el-table-column>
                <el-table-column prop="manage.account" label="账号"></el-table-column>
                <el-table-column prop="company_name" label="商户名称"></el-table-column>
                <el-table-column prop="state.name" label="国家"></el-table-column>
                <el-table-column prop="manage.real_name" label="联系人"></el-table-column>
                <el-table-column prop="manage.phone" label="联系电话"></el-table-column>
                <el-table-column prop="created_at" label="注册日期"></el-table-column>
                <el-table-column prop="check" label="状态"></el-table-column>
                <el-table-column align="right" label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleCheckPass(scope.$index, scope.row)"
                                round
                        >通过
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleCheckReject(scope.$index, scope.row)"
                                round
                        >拒绝
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                background
                                v-if="BusinessCheckPaginate.total > 0"
                                :page-sizes="BusinessCheckPaginate.pageSizes"
                                :page-size="BusinessCheckPaginate.pageSize"
                                :layout="BusinessCheckPaginate.layout"
                                :total="BusinessCheckPaginate.total"
                                :current-page="BusinessCheckPaginate.pageIndex"
                                @current-change="handleCheckBusinessChangePage"
                                @size-change="handleCheckBusinessChangeSize"
                        ></el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>

</template>
<script>
    import {
        addCompany,
        companyList,
        checkCompany,
        getStateData,
        lockCompany
    } from "@/api/company";
    import add_business from '@/components/business/add_business'

    export default {
        data() {
            return {
                activeName: "list",
                formLabelWidth: "120px",
                tableBusinessData: [],
                tableCheckBusinessData: [],
                dialogRejectVisible: false,
                rejectMessage: {
                    check: '',
                    company_id: '',
                    reason: '',
                },
                rejectRules:{
                    reason: [
                        {required: true, message: '请输入拒绝原因最长100位', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100个字符', trigger: 'blur'}
                    ],
                },
                BusinessPaginate: {
                    total: 0, // 总数
                    pageIndex: 1, // 当前位于哪页
                    pageSize: 15, // 1页显示多少条
                    pageSizes: [5, 10, 15, 20], //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
                },
                BusinessCheckPaginate: {
                    total: 0, // 总数
                    pageIndex: 1, // 当前位于哪页
                    pageSize: 15, // 1页显示多少条
                    pageSizes: [5, 10, 15, 20], //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
                },
                BusinessLoading: false,
                BusinessCheckLoading: false,
                CheckLoading: false,
                form_list: {
                    account: "",
                    company_name: "",
                    real_name: "",
                    state_id: '',
                    start_date: "",
                    end_date: "",
                    listDate: "",
                    page: 1,
                    limit: 15,
                    check: [0, 2]
                },
                check_list: {
                    account: "",
                    company_name: "",
                    real_name: "",
                    state_id: '',
                    start_date: "",
                    end_date: "",
                    listDate: "",
                    page: 1,
                    limit: 15,
                    check: [0, 2]
                },
                state: null,
                check: [1, 2],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                }
            };
        },
        components: {
            add_business
        },
        mounted() {
            this.loadBusinessListData();
            this.loadStateData();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
                if (tab.name == "list") {
                    this.loadBusinessListData();
                } else {
                    this.loadCheckListData();
                }
            },
            loadBusinessListData() {
                this.form_list.check = [1];
                companyList(this.form_list)
                    .then(response => {
                        this.tableBusinessData = response.data.data.data;
                        this.loading = false;
                        this.BusinessPaginate.total = response.data.data.total;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        console.log("add role onSubmit");
                    });
            },
            loadStateData() {
                getStateData()
                    .then(response => {
                        this.state = response.data.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                    });
            },
            loadCheckListData() {
                this.check_list.check = [0, 2];
                (this.check_list.limit = this.BusinessPaginate.pageSize),
                    (this.check_list.page = this.BusinessPaginate.pageIndex),
                    companyList(this.check_list)
                        .then(response => {
                            this.tableCheckBusinessData = response.data.data.data;
                            this.loading = false;
                            this.BusinessCheckPaginate.total = response.data.data.total;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(function () {
                            console.log("add role onSubmit");
                        });
            },
            handleBusinessChangePage(page) {
                this.form_list.page = page
                console.log('page:' + page)
                this.loadBusinessListData();
            },
            handleBusinessChangeSize(pageSize) {
                console.log('pageSize:' + pageSize)
                this.form_list.limit = pageSize;
                this.BusinessPaginate.pageSize = pageSize;
                this.loadBusinessListData();
            },
            handleCheckBusinessChangePage(page) {
                this.check_list.page = page
                console.log('page:' + page)
                this.loadBusinessListData();
            },
            handleCheckBusinessChangeSize(pageSize) {
                console.log('pageSize:' + pageSize)
                this.BusinessCheckPaginate.pageSize = pageSize;
                this.check_list.limit = pageSize;
                this.loadBusinessListData();
            },
            onSearchList() {
                this.loadBusinessListData()
            },
            onSearchCheckList() {
                this.loadCheckListData()
            },
            onSubmit() {
                console.log("submit!");
            },
            handleCheckPass(index, row) {
                this.rejectMessage.check = 1;
                this.rejectMessage.company_id = row.company_id;
                checkCompany(this.rejectMessage)
                    .then(response => {
                        this.loadBusinessListData();
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                    });
            },
            handleCheckReject(index, row) {
                this.dialogRejectVisible = true;
                this.rejectMessage.check = 2;
                this.rejectMessage.company_id = row.company_id;
            },
            doRejectCheck(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        checkCompany(this.rejectMessage).then(response => {
                            this.dialogRejectVisible = false
                            this.loadBusinessListData();
                        }).catch(function (error) {
                            console.log(error);
                        }).then(function () {
                        });
                    } else {
                        return false;
                    }
                });
            },
            lockCompany(lock, row) {
                lockCompany({
                    'status': lock,
                    'company_id': row.company_id
                }).then(response => {
                    this.loadBusinessListData();
                }).catch(function (error) {
                    console.log(error);
                })
            },
            handleDialogRejectClose() {
                console.log(11)
            }
        }
    };
</script>



