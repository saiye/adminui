<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="会员列表" :inline="true"  name="list">
            <el-form  :model="form_list" >
                <el-form-item >
                    <el-input v-model="form_list.business_name"   placeholder="请输入会员的账号，昵称，真实姓名，邮箱地址进行搜索">
                        <template slot="append"> <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button></template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-table
                    v-loading="BusinessLoading"
                    :data="tableBusinessData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="id" label="序号" ></el-table-column>
                <el-table-column prop="user_name" label="会员账号"></el-table-column>
                <el-table-column prop="is_judge" label="是否为法官"></el-table-column>
                <el-table-column prop="nickname" label="昵称"></el-table-column>
                <el-table-column prop="real_name" label="真实姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱地址"></el-table-column>
                <el-table-column prop="register_date" label="注册日期"></el-table-column>
                <el-table-column prop="status" label="账号状态"></el-table-column>
                <el-table-column align="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleLock(scope.$index, scope.row)" round>
                            禁封/ 解封
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination background
                                       v-if='StorePaginate.total > 0'
                                       :page-sizes="StorePaginate.pageSizes"
                                       :page-size="StorePaginate.pageSize"
                                       :layout="StorePaginate.layout"
                                       :total="StorePaginate.total"
                                       :current-page='StorePaginate.pageIndex'
                                       @current-change='handleStoreChangePage'
                                       @size-change='handleStoreChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    export default {
        data() {
            return {
                activeName: 'list',
                tableBusinessData: [],
                StorePaginate: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                CheckPaginate: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                BusinessLoading:false,
                CheckLoading:false,
                form_list: {
                    user_name: '',
                    business_name: '',
                    relation_name: '',
                    start_date:'',
                    end_date:'',
                    listDate:'',
                },
                check_list: {
                    user_name: '',
                    business_name: '',
                    relation_name: '',
                    start_date:'',
                    end_date:'',
                    listDate:'',
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
        methods: {
            handleLock(index,row){

            },
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadStoreListData(){

            },
            handleStoreChangePage(page){
                this.paginations.pageIndex = page;
                this.loadBusinessListData();

            },
            handleStoreChangeSize(pageSize){
                this.paginations.pageSize = pageSize;
                this.loadStoreListData();
            },
            onSearchList(){

            },
            onSearchCheckList(){

            },

            handleStoreLook(index, row){

            }
        }
    };

</script>

