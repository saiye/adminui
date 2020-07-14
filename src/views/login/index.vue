<template>
    <el-container>
        <el-main>
            <div class="login-box">
                <el-card class="box-card">
                    <el-form  :model="form" :rules="rules"   ref="login_form"  label-width="40px"  status-icon style="margin-top: 10px;">
                        <el-form-item label="账号" prop="user_name">
                            <el-input v-model="form.user_name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('login_form')">登录</el-button>
                            <el-button @click="resetForm('login_form')">重置</el-button>
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
            let checkEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'));
                } else {
                    callback()
                }
            };
            let checkPassword = (rule, value, callback) => {
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
                    user_name: [
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    password: [
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
                        this.$store.dispatch('cpuser/login', this.form).then(() => {
                            this.$router.push({path: this.redirect || '/'})
                        }).catch((e) => {
                        })
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>