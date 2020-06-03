<template>
    <el-form ref="form" label-width="80px">
        <el-form-item label="角色名称">
            <el-input v-model="role_name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" round>立即创建</el-button>
            <el-button round>取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import {addRole} from '@/api/role'
    import {Message} from 'element-ui'
    export default {
        data() {
            return {
                role_name:'',
            }
        },
        methods: {
            onSubmit() {
                addRole({
                    role_name:this.role_name,
                }).then(function (response) {
                    Message({
                        message: response.message || 'Error',
                        type: 'success',
                        duration: 5 * 1000
                    })
                }).catch(function (error) {
                        // handle error
                        console.log(error);
                }).then(function () {
                      console.log('add role onSubmit');
                });
            }
        }
    }
</script>
