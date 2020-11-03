<template>
    <div>
        <el-dialog :title="title" :close-on-click-modal="closeModal"  @closed="closeDialog"  :visible.sync="visibleDialog"  width="800px">
            <div class="add-dialog-box">
                <el-form :model="dialog_form" label-width="100px" :rules="rules" ref="dialog_form">
                    <el-form-item prop="searchName" label="道具或道具分类名称">
                        <el-input v-model="dialog_form.searchName"  :disabled="dialog_form.id>0" placeholder="道具或道具分类名称最长50位"></el-input>
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
        'name': 'bag_log',
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
                let title='道具流水';
                return title;
            }
        },
        data() {
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
                    searchName: "",
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
                    searchName: [
                        {required: true, message: '请输入会员账号最长50位', trigger: 'blur'},
                        {min: 3, max:50, message: '长度在 3 到 50个字符', trigger: 'blur'}
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
