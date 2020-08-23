<template>
<div>
    <el-dialog :title=dialogTitle :close-on-click-modal="closeModal"  :visible.sync="dialogVisible" width="700px"  @close="noticeCloseDialog">
        <div class="add-dialog-box">
            <el-form :model="dialog_form"  ref="dialog_form" :rules="rules" label-width="80px">
                <el-form-item label="商户名称" prop="company_name">
                    <el-input v-model="dialog_form.company_name"></el-input>
                </el-form-item>
                <el-form-item label="所在国家" prop="area_code">
                    <el-select v-model="dialog_form.area_code" clearable placeholder="请选择活动区域">
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
                            :file-list="fileList"
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
                        <template slot="prepend">
                            <div style="width:100px;">
                                <el-select v-model="dialog_form.phone_area_code" clearable  placeholder="请选择区号">
                                    <el-option
                                            v-for="item in state"
                                            :key="item.value"
                                            :label="'+'+item.value+item.name"
                                            :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </template>
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
        addCompany,editCompany
    } from "@/api/company";
    import {
        uploadImage,deleteImage
    } from "@/api/tool";
    export default {
        'name': 'add_business',
        props:['state','show','company'],
        computed:{
            dialogTitle:function(){
                return this.dialog_form.company_id?'编辑商户':'添加商户';
            }
        },
        watch: {
            company: function (company) {
                if(company){
                    let tags=[],imageData=[];
                    this.fileList=[];
                    if(company.image){
                        company.image.forEach(img=>{
                            this.fileList.push({
                                'name':img.id,
                                'url':img.path
                            });
                            imageData.push(img.id);
                        })
                    }
                    this.dialog_form={
                        imageData:imageData,
                        company_name:company.company_name,
                        company_id:company.company_id,
                        area_code: company.area_code,
                        real_name: company.manage.real_name,
                        phone:company.manage.phone,
                        phone_area_code: company.manage.area_code,
                        proportion:company.proportion,
                        account: company.manage.account,
                        password: "",
                        sex:company.manage.sex
                    };
                }else{
                    this.initData();
                }
            },
            show:function (show) {
                this.dialogVisible=show;
            }
        },
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

            let checkPassword=(rule, value, callback) => {
                if(!this.dialog_form.company_id){
                    if(!value){
                        return callback(new Error('密码不能为空！'));
                    }
                    if(value.length<6){
                        return callback(new Error('密码不能小于6位为空！'));
                    }
                }
                callback();
            }
            return {
                dialogVisible: false,
                closeModal:false,
                dialogImageUrl: '',
                dialogImgVisible:false,
                visibleDialog:this.visible,
                fileList:[],
                dialog_form: {
                    company_name: "",
                    company_id: "",
                    area_code: "",
                    imageData:[],
                    real_name: "",
                    phone: "",
                    phone_area_code: "",
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
                    phone_area_code:[
                        {required: true, message: '请选择电话区号', trigger: 'change'}
                    ],
                    area_code: [
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
                        {validator:checkPassword,trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别',trigger: 'change'},
                    ],
                },
            };
        },
        methods: {
            initData(){
                this.dialog_form={
                    company_name: "",
                    company_id: "",
                    area_code: "",
                    imageData:[],
                    real_name: "",
                    phone: "",
                    phone_area_code: "",
                    proportion: 100,
                    account: "",
                    password: "",
                    sex:'1'
                };
            },
            businessDialogCance() {
                this.dialog_form.imageData=[];
                this.dialogVisible = false;
            },
            businessDialogConfirm(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dialog_form.company_id){
                            editCompany(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.$emit('success');
                                })
                                .catch(function(error) {
                                    console.log(error);
                                })
                                .then(function() {
                                });
                        }else{
                            addCompany(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    this.$emit('success');
                                })
                                .catch(function(error) {
                                    console.log(error);
                                })
                                .then(function() {
                                });
                        }

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
                    this.$message.error('上传图片只能是 JPG 或者Png格式!'+file.type);
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
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
            },
            noticeCloseDialog(){
                this.$emit('noticeCloseDialog');
            },
        }
    };
</script>
