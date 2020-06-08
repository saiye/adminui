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
            <el-table-column prop="file" label="文件">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {logError} from '@/api/log'

    export default {
        created() {
        },
        data() {
            return {
                tableData: [],
                loading: true,
                //需要给分页组件传的信息
                paginations: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {
                logError().then(response => {
                    this.tableData = response.data.data
                    this.loading = false;
                    this.paginations.total = response.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    console.log('add role onSubmit');
                });
            },
        }
    };
</script>

