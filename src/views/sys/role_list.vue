<template>
        <el-table :data="tableData">
            <el-table-column prop="id" label="角色id" width="140">
            </el-table-column>
            <el-table-column prop="role_name" label="角色名称" width="120">
            </el-table-column>
            <el-table-column  align="right" label="操作">
                <el-button size="mini" round>Edit</el-button>
                <el-button size="mini" type="danger" round>Delete</el-button>
            </el-table-column>
        </el-table>
</template>
<script>
    export default {
        data() {
            const item = {
                id: '1',
                role_name: 'buffer',
            };
            return {
                tableData: Array(20).fill(item),
                show: true,
            }
        }
    };
</script>

