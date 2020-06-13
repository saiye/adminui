<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-button
                        size="mini"
                        style="float: right;margin-right: 20px;margin-bottom: 10px;"
                        @click="dialogVisible=true"
                        round
                >新增会员
                </el-button>
            </el-col>
        </el-row>
        <el-dialog title="新增会员" :visible.sync="dialogVisible" width="700px">
            <div class="add-dialog-box">
                <el-form :model="dialog_form" label-width="100px" :rules="rules"  ref="dialog_form" >
                    <el-form-item label="会员账号">
                        <el-input v-model="dialog_form.account"  placeholder="请选择设置会员账号最长20位"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="dialog_form.password" placeholder="请选择设置会员密码" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码">
                        <el-input v-model="dialog_form.affirm_password" placeholder="请选择确认会员密码" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="真实姓名">
                        <el-input v-model="dialog_form.real_name"  placeholder="请输入会员真实姓名">
                            <template slot="append">
                                <el-radio v-model="dialog_form.sex" label="1">男</el-radio>
                                <el-radio v-model="dialog_form.sex" label="2">女</el-radio>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="昵称">
                        <el-input v-model="dialog_form.nickname" placeholder="会员昵称最长10字"></el-input>
                    </el-form-item>

                    <el-form-item label="邮箱地址">
                        <el-input v-model="dialog_form.email" placeholder="会员邮箱地址最长30位"></el-input>
                    </el-form-item>
                  <el-form-item label="是否为法官">
                      <el-radio v-model="dialog_form.judge" label="1">是</el-radio>
                      <el-radio v-model="dialog_form.judge" label="2">否</el-radio>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
           <el-button @click="dialogCance">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm('dialog_form')">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import {userList,addUser} from "@/api/user";
    
    export default {
        'name':'add_user',
        data() {
            return {
                dialogVisible: false,
                loading: false,
                UserListData: [],
                dialog_form: {
                    account: "",
                    password: "",
                    affirm_password: "",
                    real_name: "",
                    nickname: "",
                    email: "",
                    sex:'1',
                    judge:'2',
                },
                rules: {
                    account: [
                        { required: true, message: '请输入会员账号最长20位', trigger: 'blur' },
                        { min:3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addUser(this.dialog_form)
                            .then(response => {
                                this.dialogVisible = false;
                                //回调父组件，刷新页面
                                this.$emit('success');
                            }).catch(function (error) {
                        }).then(function () {
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            dialogCance(){
                this.dialogVisible = false;
            },
        }
    };
</script>