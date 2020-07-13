<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-button
                        size="mini"
                        style="float: right;margin-right: 20px;margin-bottom: 10px;"
                        @click="dialogVisible=true"
                        round
                >添加店面
                </el-button>
            </el-col>
        </el-row>
        <el-dialog title="添加店面" :close-on-click-modal="closeModal"  :visible.sync="dialogVisible" >
            <div class="add-dialog-box">
                <el-form :model="dialog_form"  ref="dialog_form" :rules="rules" label-width="100px">
                    <el-form-item label="店面名称" prop="store_name">
                        <el-input v-model="dialog_form.store_name"></el-input>
                    </el-form-item>

                    <el-form-item label="所在区域" prop="area">
                        <el-cascader placeholder="选择所在区域" style="width:350px; " size="medium" v-model=dialog_form.area :props="areaListData" clearable ></el-cascader>
                    </el-form-item>

                    <el-form-item label="店面地址"  prop="address">
                        <el-input v-model="dialog_form.address"></el-input>
                    </el-form-item>

                    <el-form-item label="所属商户"  prop="company_id">
                       <el-select v-model="dialog_form.company_id">
                            <el-option
                                     v-for="item in companyListData"
                                    :key="item.company_id"
                                    :label="item.company_name"
                                    :value="item.company_id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="店面照片">
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
                                action=""
                                width="60%"
                                title="店面-原图"
                                :visible.sync="dialogImgVisible"
                                append-to-body
                        >
                            <img width="100%" :src="dialogImageUrl" alt/>
                        </el-dialog>
                    </el-form-item>

                    <el-form-item label="联系人姓名" prop="real_name">
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

                    <el-form-item label="账号" prop="account">
                        <el-input v-model="dialog_form.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="dialog_form.password" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="店面描述" prop="describe">
                        <el-input v-model="dialog_form.describe"  type="textarea"
                                  :rows="2"
                                  placeholder="请输入描述"></el-input>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
          <el-button @click="storeDialogCance">取 消</el-button>
          <el-button type="primary" @click="storeDialogConfirm('dialog_form')">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import {areaList,companyList} from "@/api/company";
    import {addStore} from "@/api/store";
    import {
        uploadImage,deleteImage
    } from "@/api/tool";
    export default {
        'name': 'add_store',
        props: ['state'],
        data() {
            return {
                dialogVisible: false,
                closeModal: false,
                loading: false,
                companyListData: [],
                dialogImageUrl: '',
                dialogImgVisible: false,
                visibleDialog: this.visible,
                dialog_form: {
                    imageData:[],
                    describe: "",
                    store_name: "",
                    company_id: "",
                    address: "",
                    real_name: "",
                    phone: "",
                    account: "",
                    password: "",
                    sex:'1',
                    area:[],
                },
                rules: {
                    describe: [
                        {required: true, message: '请输入店面描述最长100位', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100个字符', trigger: 'blur'}
                    ],
                    store_name: [
                        {required: true, message: '请输入店面名称最长30位', trigger: 'blur'},
                        {min: 1, max:30, message: '长度在 1 到 30个字符', trigger: 'blur'}
                    ],
                    company_id: [
                        {required: true, message: '请选择商户',trigger: 'change'},
                        {type: 'number', message: '商户id错误'}
                    ],
                    address: [
                        {required: true, message: '请选择填写店面地址最长100位',trigger: 'blur'},
                        {min: 1, max:100, message: '长度在 1 到 100个字符', trigger: 'blur'}
                    ],
                    real_name: [
                        {required: true, message: '请选择填写真实姓名最长20位',trigger:'blur'},
                        {min: 1, max:100, message: '长度在 1 到 20个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请选择填手机号码最长11位',trigger: 'blur'},
                         {min: 11, max:11, message: '长度在 11个字符', trigger: 'blur'}
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
                    area: [
                        {required: true, message: '请选择店面地区',trigger: 'change'},
                    ]
                },
                areaListData: {
                    lazy: true,
                    lazyLoad (node, resolve) {
                        const { level } = node;
                        let param={
                            'parent_id':node.value||-1,
                        };
                        areaList(param).then(response => {
                            resolve(response.data.data);
                        }).catch(function (error) {
                                console.log(error);
                        }).then(function () {

                        });
                    }
                },
            };
        },
        mounted(){
            this.remoteCompanyList();
        },
        methods: {
            storeDialogCance() {
                this.dialogVisible = false;
            },
            storeDialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addStore(this.dialog_form)
                            .then(response => {
                                this.dialogVisible = false;
                                this.dialog_form.imageData=[];
                                //回调父组件，刷新页面
                                this.$emit('success');
                            }).catch(function (error) {
                            console.log(error);
                        }).then(function () {
                                console.log("onSubmit");
                            });
                    } else {
                        return false;
                    }
                });

            },
            handleRemove(file, fileList) {
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
                formData.set("type",2);
                uploadImage(formData).then(response => {
                    this.dialog_form.imageData.push(response.data.id);
                }).catch();
            },
            remoteCompanyList(){
                this.loading = true;
                companyList({limit:500,page:1}).then(response => {
                   this.companyListData=response.data.data.data;
                   this.loading=false;
                });
            }

        }
    };
</script>