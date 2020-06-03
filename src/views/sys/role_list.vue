<template>
        <div>
            <el-table
                    v-loading="loading"
                    :data="tableData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">

                <el-table-column prop="role_id" label="角色id" width="140">
                </el-table-column>
                <el-table-column prop="role_name" label="角色名称" width="120">
                </el-table-column>
                <el-table-column  align="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"   round>编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)"   round>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination background
                                v-if='paginations.total > 0'
                                :page-sizes="paginations.pageSizes"
                                :page-size="paginations.pageSize"
                                :layout="paginations.layout"
                                :total="paginations.total"
                                :current-page='paginations.pageIndex'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
</template>
<script>
    import {roleList,deleteRole} from '@/api/role'

    export default {
        created(){

        },
        data() {
            return {
                tableData:[],
                loading:true,
                //需要给分页组件传的信息
                paginations: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
            }
        },
        mounted(){
            this.loadData();
            console.log('print role tableData----start');
            console.log(this.tableData);
            console.log('print role tableData----end');
        },
        methods: {
            loadData() {
                let param = {
                    limit:this.paginations.pageSize,
                    page:this.paginations.pageIndex
                }
                roleList(param).then(response=> {
                    this.tableData=response.data.data.data
                    this.loading = false;
                    this.paginations.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    console.log('add role onSubmit');
                });
            },
            // 每页多少条切换
            handleSizeChange(pageSize) {
                this.paginations.pageSize = pageSize;
                this.loadData();
            },
            // 上下分页
            handleCurrentChange(page) {
                this.paginations.pageIndex = page;
                this.loadData();
            },
            handleEdit(index, row) {
                this.$router.push({'name':'sys-edit-role','params':{role_id:row.role_id}});
                console.log(index, row);
            },
            handleDelete(index, row) {
                deleteRole({
                    role_id:row.role_id,
                }).then(response=> {
                    this.loadData();
                }).catch(function (error) {

                }).then(function () {
                    console.log('add role onSubmit');
                });
            }
        }
    };
</script>

