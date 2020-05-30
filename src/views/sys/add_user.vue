<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="所属角色">
                <el-select v-model="form.rule" placeholder="请所属角色">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="登录邮箱">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="用户密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" round>立即创建</el-button>
                <el-button round>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    rule:'',
                    name: '',
                    email: '',
                    password: '',
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
