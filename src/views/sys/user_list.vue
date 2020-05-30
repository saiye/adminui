<template>
    <div>
        <el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))">
            <el-table-column prop="date" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
            <el-table-column align="right" label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
        </el-pagination>
    </div>


</template>
<script>


    export default {
        data() {
            const item = {
                id: '1',
                date: '2016-05-02',
                name: 'buffer',
                address: '广州市天德广场！'
            };
            return {
                tableData: Array(15).fill(item),
                search: '',
            }
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
               // console.log(index, row.id);
               // console.log(this.router)
            }
        },
    };
</script>

