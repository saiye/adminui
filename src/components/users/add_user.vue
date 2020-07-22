<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="closeModal"  @closed="closeDialog"  :visible.sync="visibleDialog"  width="700px">
            <div class="add-dialog-box">
                <el-form :model="dialog_form" label-width="100px" :rules="rules" ref="dialog_form">
                    <el-form-item prop="account" label="会员账号">
                        <el-input v-model="dialog_form.account"  :disabled="dialog_form.id>0" placeholder="请选择设置会员账号最长50位"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input v-model="dialog_form.password" placeholder="请选择设置会员密码" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="affirm_password">
                        <el-input v-model="dialog_form.affirm_password" placeholder="请选择确认会员密码"
                                  show-password></el-input>
                    </el-form-item>

                    <el-form-item label="真实姓名" prop="real_name">
                        <el-input v-model="dialog_form.real_name" placeholder="请输入会员真实姓名">
                            <template slot="append" prop="sex">
                                <el-radio v-model="dialog_form.sex" :label="sexArr.m">男</el-radio>
                                <el-radio v-model="dialog_form.sex" :label="sexArr.w">女</el-radio>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="dialog_form.nickname" placeholder="会员昵称最长10字"></el-input>
                    </el-form-item>

                    <el-form-item label="邮箱地址" prop="email">
                        <el-input v-model="dialog_form.email" placeholder="会员邮箱地址最长30位"></el-input>
                    </el-form-item>
                    <el-form-item label="是否为法官" prop="judge">
                        <el-radio v-model="dialog_form.judge" :label="judgeArr.y">是</el-radio>
                        <el-radio v-model="dialog_form.judge" :label="judgeArr.n">否</el-radio>
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
    import {userList, addUser,editUser} from "@/api/user";

    export default {
        'name': 'add_user',
        props: ['user','visible'],
        watch: {
            'user': function (user) {
                if(user)
               this.dialog_form=user;
            },
            'visible': function (v) {
                this.visibleDialog=v;
            },
        },
        computed:{
            title: function () {
                let title=this.dialog_form.id?'修改会员':'新增会员';
                return title;
            }
        },
        data() {
            let validatePassword = (rule, value, callback) => {
                if(!this.dialog_form.id){
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else {
                        callback();
                    }
                }else{
                    callback();
                }
            };
            let validateAffirmPassword = (rule, value, callback) => {
                if(!this.dialog_form.id){
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== this.dialog_form.password) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                }else{
                    callback();
                }
            };
            return {
                closeModal: false,
                loading: false,
                UserListData: [],
                visibleDialog:false,
                sexArr:{
                    m:0,
                    w:1,
                },
                judgeArr:{
                    y:1,
                    n:2,
                },
                dialog_form: {
                    account: "",
                    password: "",
                    affirm_password: "",
                    real_name: "",
                    nickname: "",
                    email: "",
                    sex: 0,
                    judge: 2,
                    id:'',
                },
                rules: {
                    account: [
                        {required: true, message: '请输入会员账号最长50位', trigger: 'blur'},
                        {min: 3, max:50, message: '长度在 3 到 50个字符', trigger: 'blur'}
                    ],
                    password: [
                        {validator:  validateAffirmPassword, trigger: 'blur'},
                        {min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur'}
                    ],
                    affirm_password: [
                        {validator:  validateAffirmPassword, trigger: 'blur'},
                        {min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur'}
                    ],
                    real_name: [
                        {required: true, message: '请填写真实姓名', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur'}
                    ],
                    nickname: [
                        {required: true, message: '用户昵称不能为空', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: 'email不能为空', trigger: 'blur'},
                        {min: 1, max: 30, message: '长度在 1 到 30个字符', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '性别未选择', trigger: 'blur'}
                    ],
                    judge: [
                        {required: true, message: '玩家类型必须选择', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dialog_form.id){
                            editUser(this.dialog_form)
                                .then(response => {
                                    //回调父组件，刷新页面
                                    this.$emit('handelConfirm');
                                }).catch(function (error) {
                            }).then(function () {
                            });

                        }else{
                            addUser(this.dialog_form)
                                .then(response => {
                                    //回调父组件，刷新页面
                                    this.$emit('handelConfirm');
                                }).catch(function (error) {
                            }).then(function () {
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            dialogCance() {
                this.$emit('handelCance');
            },
            closeDialog(){
                this.$emit('handelCance');
            },
        }
    };
</script>