<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
            <el-input v-model="form.role_name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" round>立即创建</el-button>
            <el-button round>取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    role_name: '',
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>
