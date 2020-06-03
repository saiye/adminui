<template>
    <el-container>
        <el-main>
            <div class="login-box">
                <el-card class="box-card">
                    <el-form ref="form" :model="form" label-width="40px" status-icon :rules="rules"
                             style="margin-top: 10px;">
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="form.user_name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')">登录</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </el-main>
    </el-container>
</template>
<style>
    .login-box {
        margin-left: auto;
        margin-right: auto;
        margin-top: 10%;
        width: 400px;
        height: 200px;
        padding: 30px 30px 30px 30px;
        opacity: 0.8;
    }
</style>
<script>
    export default {
        data() {
            var checkEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'));
                } else {
                    callback()
                }
            };
            var checkPassword = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('密码不能为空'));
                } else {
                    callback()
                }
            };
            return {
                form: {
                    user_name: '',
                    password: '',
                },
                redirect: undefined,
                rules: {
                    email: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: checkPassword, trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('user/login', this.form).then(() => {
                            this.$router.push({path: this.redirect || '/'})
                        }).catch((e) => {
                            console.log('login success 22!!');
                            console.log(e);
                        })
                        console.log('---' + this.redirect)
                        //登录操作！
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>