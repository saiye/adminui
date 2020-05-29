<template>
        <el-table :data="tableData">
            <el-table-column prop="date" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
</template>
<script>
    export default {
        data() {
            const item = {
                date: '2016-05-02',
                name: 'buffer',
                address: '广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！广州市天德广场！'
            };
            return {
                tableData: Array(20).fill(item),
                show: true,
            }
        }
    };
</script>

