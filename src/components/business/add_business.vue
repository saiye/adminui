<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-button
                    size="mini"
                    style="float: right;margin-right: 20px;margin-bottom: 10px;"
                    @click="dialogVisible=true"
                    round
            >添加商户</el-button>
        </el-col>
    </el-row>
    <el-dialog title="添加商户" :close-on-click-modal="closeModal"  :visible.sync="dialogVisible" width="700px">
        <div class="add-dialog-box">
            <el-form :model="dialog_form"  ref="dialog_form" :rules="rules" label-width="80px">
                <el-form-item label="商户名称" prop="company_name">
                    <el-input v-model="dialog_form.company_name"></el-input>
                </el-form-item>
                <el-form-item label="所在国家" prop="state_id">
                    <el-select v-model="dialog_form.state_id" clearable placeholder="请选择活动区域">
                        <el-option
                                v-for="item in state"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="营业执照">
                    <el-upload
                            action=""
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :before-upload="beforeAvatarUpload"
                            :http-request="doUploadImage"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog
                            width="40%"
                            title="营业执照-原图"
                            :visible.sync="dialogImgVisible"
                            append-to-body
                    >
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                </el-form-item>

                <el-form-item label="联系人" prop="real_name">
                    <el-input v-model="dialog_form.real_name">
                        <template slot="append">
                            <el-radio v-model="dialog_form.sex" label="1">男</el-radio>
                            <el-radio v-model="dialog_form.sex" label="2">女</el-radio>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="dialog_form.phone">
                        <template slot="prepend">+86中国大陆</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="分成比例" prop="proportion">
                    <el-input v-model="dialog_form.proportion"></el-input>
                </el-form-item>
                <el-form-item label="商户账号" prop="account">
                    <el-input v-model="dialog_form.account"></el-input>
                </el-form-item>
                <el-form-item label="商户密码" prop="password">
                    <el-input v-model="dialog_form.password" show-password></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="businessDialogCance">取 消</el-button>
          <el-button type="primary" @click="businessDialogConfirm('dialog_form')">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
    import {
        addCompany,
    } from "@/api/company";
    import {
        uploadImage,deleteImage
    } from "@/api/tool";
    export default {
        'name': 'add_business',
        props:['state'],
        data() {
            let checkProportion = (rule, value, callback) => {
                if(isNaN(value)){
                    return callback(new Error('分成比例必须是一个数字'));
                }
                if(value>100||value<1){
                    return callback(new Error('分成比例的值范围是1-100!'));
                }
                callback();
            };
            return {
                dialogVisible: false,
                closeModal:false,
                dialogImageUrl: '',
                dialogImgVisible:false,
                visibleDialog:this.visible,
                dialog_form: {
                    company_name: "",
                    state_id: "",
                    imageData:[],
                    real_name: "",
                    phone: "",
                    proportion: 100,
                    account: "",
                    password: "",
                    sex:'1'
                },
                rules: {
                    company_name: [
                        {required: true, message: '请输入商户名称最长50位', trigger: 'blur'},
                        {min:1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
                    ],
                    state_id: [
                        {required: true, message: '请选择所在国家', trigger: 'change'}
                    ],
                    real_name: [
                        {required: true, message: '请填写联系人', trigger: 'blur'},
                        {min:1, max: 50, message: '长度在 1 到 50个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请选择填手机号码最长11位',trigger: 'blur'},
                        {min: 11, max:11, message: '长度在 11个字符', trigger: 'blur'}
                    ],
                    proportion: [
                        { validator:checkProportion, trigger: 'blur'}
                    ],
                    account: [
                        {required: true, message: '请输入账号1-20字符', trigger: 'blur'},
                        {min: 1, max:20, message: '长度在 1 到 20个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码1-20字符', trigger: 'blur'},
                        {min: 1, max:20, message: '长度在 1 到 20个字符', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别',trigger: 'change'},
                    ],
                },
            };
        },
        methods: {
            businessDialogCance() {
                this.dialog_form.imageData=[];
                this.dialogVisible = false;
            },
            businessDialogConfirm(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addCompany(this.dialog_form)
                            .then(response => {
                                this.dialogVisible = false;
                                this.$emit('success');
                            })
                            .catch(function(error) {
                                console.log(error);
                            })
                            .then(function() {
                                console.log("add role onSubmit");
                            });
                    } else {
                        return false;
                    }
                });


            },
            handleRemove(file, fileList) {
                //deleteImage
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                    this.dialogImageUrl = file.url;
                    this.dialogImgVisible = true;
            },
            beforeAvatarUpload(file) {
                let types=[
                    {
                       'type':'image/jpeg',
                    },
                    {
                       'type':'image/png',
                    },
                ];
                const isImg=types.find(item=>{
                    console.log(item.type)
                    return item.type==file.type;
                })
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isImg) {
                    this.$message.error('上传头像图片只能是 JPG 或者Png格式!'+file.type);
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false;
                }
                return true;
            },
            doUploadImage(file){
                let formData = new FormData();
                formData.set("file", file.file);
                formData.set("type",1);
                uploadImage(formData).then(response => {
                    this.dialog_form.imageData.push(response.data.id);
                }).catch();
            }
        }
    };
</script>