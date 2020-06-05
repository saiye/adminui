<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="所属角色">
                <el-select v-model="form.role_id" placeholder="请选择角色">
                    <el-option
                            v-for="item in roleList"
                            :key="item.role_id"
                            :label="item.role_name"
                            :value="item.role_id">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="登录账号">
                <el-input v-model="form.user_name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="用户密码">
                <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" round>立即提交</el-button>
                <el-button round @click="canceHandel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {roleList} from '@/api/role';
    import {addUser,editUser} from '@/api/user';
    import {Message, MessageBox} from "element-ui";
    export default {
        data() {
            return {
                form:{
                    role_id:'',
                    user_id:'',
                    user_name: '',
                    email:'',
                    password: '',
                },
                roleList: []
            }
        },
        mounted() {
            if(this.$route.name=='sys-edit-user'){
                this.userInfo();
            }
            this.loadRoleList();
        },
        methods: {
            onSubmit() {
                let param={
                    'role_id':this.form.role_id,
                    'user_id':this.form.user_id,
                    'user_name':this.form.user_name,
                    'email':this.form.email,
                    'password':this.form.password,
                };
                if(this.$route.name=='sys-add-user'){
                    addUser(param).then(res=>{
                        Message({
                            message:res.message,
                            type: 'success',
                            duration: 5 * 1000
                        })
                    }).catch(error=>{

                    }).then(res=>{
                        this.$router.push({
                            'name':'sys-user-list'
                        });
                    });
                    console.log('add user!');
                }else{
                    editUser(param).then(res=>{
                        Message({
                            message:res.message,
                            type: 'success',
                            duration: 5 * 1000
                        })
                    }).catch(error=>{
                        Message({
                            message:error.message(),
                            type: 'error',
                            duration: 5 * 1000
                        })

                    }).then(res=>{
                        this.$router.push({
                            'name':'sys-user-list'
                        });
                    });

                }
            },
            loadRoleList(){
                let param = {
                    limit:50,
                    page:1
                }
                roleList(param).then(response => {
                   this.roleList=response.data.data.data;
                   console.log(response.data.data.data)
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    console.log('load role List');
                })
            },
            userInfo(){
                if(this.$route.params.user_name){
                    //用户列表过来查看
                    this.form.user_name=this.$route.params.user_name;
                    this.form.user_id=this.$route.params.id;
                    this.form.role_id=this.$route.params.role_id;
                    this.form.email=this.$route.params.email;
                }else{
                    console.log('email--'+this.$store.getters.user_id)
                    //此处过来的用户是，查看个人登录资料
                    this.form.user_name=this.$store.getters.user_name;
                    this.form.user_id=this.$store.getters.user_id;
                    this.form.role_id=this.$store.getters.role_id;
                    this.form.email=this.$store.getters.email;
                    //load user info
                }
            },
            canceHandel(){
                this.$router.go(-1);
            }
        }
    }
</script>
