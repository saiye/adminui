<template>
    <div>
        <el-dialog :title=dialogTitle :close-on-click-modal="closeModal"  :visible.sync="dialogVisible"  @close="noticeCloseDialog">
            <div class="add-dialog-box">
                <el-form :model="dialog_form"  ref="dialog_form" :rules="rules" label-width="100px">

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

                    <el-form-item label="店面名称" prop="store_name">
                        <el-input v-model="dialog_form.store_name"></el-input>
                    </el-form-item>

                    <el-form-item label="所在区域" prop="area">
                        <el-cascader placeholder="选择所在区域" style="width:350px; " size="medium" v-model=dialog_form.area :props="areaListData" clearable ></el-cascader>
                    </el-form-item>

                    <el-form-item label="店面地址"  prop="address">
                        <el-input v-model="dialog_form.address"></el-input>
                    </el-form-item>

                    <el-form-item label="店面标签"  prop="tags">
                        <el-checkbox-group v-model="dialog_form.tags">
                            <el-checkbox v-for="tag in storeTags" :label="tag.k" :key="tag.k">{{tag.v}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="店面经纬度"  prop="point">
                        <el-row>
                            <el-col :span="8">
                                <el-input v-model="dialog_form.point"></el-input>
                            </el-col>
                            <el-col :span="14" style="margin-left: 10px;">
                                <el-link href="http://api.map.baidu.com/lbsapi/getpoint/" target="_blank">经纬度坐标捨取<i class="el-icon-view el-icon--right"></i> </el-link>
                            </el-col>
                        </el-row>

                    </el-form-item>

                    <el-form-item label="店面照片">
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

                    <el-form-item label="店长账号" prop="account">
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
    import {addStore,storeTagList,editStore} from "@/api/store";
    import {
        uploadImage,deleteImage
    } from "@/api/tool";
    export default {
        'name': 'add_store',
        props: ['show','store'],
        computed:{
            dialogTitle:function(){
                return this.dialog_form.store_id?'编辑门店':'添加门店';
            }
        },
        watch: {
            store: function (store) {
                if(store){
                    let tags=[],imageData=[];
                    this.fileList=[];
                    if(store.tags)
                    store.tags.forEach(tag=>{
                        tags.push(tag.tag_id);
                    })
                    if(store.image)
                    store.image.forEach(img=>{
                        this.fileList.push({
                            'name':img.id,
                            'url':img.path
                        });
                        imageData.push(img.id);
                    })

                    this.dialog_form={
                        imageData:imageData,
                        describe:store.describe,
                        store_name: store.store_name,
                        store_id: store.store_id,
                        company_id: store.company_id,
                        address:store.address,
                        tags:tags,
                        real_name:store.staff.real_name,
                        phone:store.staff.phone,
                        account: store.staff.account,
                        password: "",
                        sex:store.staff.sex,
                        point:store.lon+','+store.lat,
                        area:[store.province.area_id,store.city.area_id,store.region.area_id],
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
            let checkPoint=(rule, value, callback) => {
                if(!value){
                    return callback(new Error('经纬度不能为空！'));
                }
                let lonReg = /^([-+])?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
                let latReg = /^([-+])?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
                let point=value.split(',');
                if(point.length!==2){
                    return callback(new Error('该经纬度字符串不符合规范!请输入字符串如:116.401969,39.916927'));
                }
                if(!latReg.test(point[1])){
                    return callback(new Error('纬度不符合规范!请输入字符串如:116.401969,39.916927'));
                }
                if(!lonReg.test(point[0])){
                    return callback(new Error('经度不符合规范!请输入字符串如:116.401969,39.916927'));
                }
                callback();
            };

            let checkPassword=(rule, value, callback) => {
                if(!this.dialog_form.store_id){
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
                closeModal: false,
                loading: false,
                dialogImageUrl: '',
                dialogImgVisible: false,
                visibleDialog: this.visible,
                storeTags:[],
                fileList:[],
                companyListData: [],
                dialog_form: {
                    imageData:[],
                    store_id: "",
                    describe: "",
                    store_name: "",
                    company_id: "",
                    address: "",
                    tags: [],
                    real_name: "",
                    phone: "",
                    account: "",
                    password: "",
                    sex:'1',
                    point:'',
                    area:[],
                },
                rules: {
                    point:[
                        { validator:checkPoint, trigger: 'blur'}
                    ],
                    company_id: [
                        {required: true, message: '请选择商户',trigger: 'change'},
                        {type: 'number', message: '商户id错误'}
                    ],
                    describe: [
                        {required: true, message: '请输入店面描述最长100位', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100个字符', trigger: 'blur'}
                    ],
                    store_name: [
                        {required: true, message: '请输入店面名称最长30位', trigger: 'blur'},
                        {min: 1, max:30, message: '长度在 1 到 30个字符', trigger: 'blur'}
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
                        {validator:checkPassword,trigger: 'blur'}
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
            this.loadStoreTags();
            this.remoteCompanyList();
        },
        methods: {
            initData(){
                this.fileList=[];
                this.dialog_form={
                    imageData:[],
                    store_id: "",
                    describe: "",
                    store_name: "",
                    company_id: "",
                    address: "",
                    tags: [],
                    real_name: "",
                    phone: "",
                    account: "",
                    password: "",
                    sex:'1',
                    point:'',
                    area:[],
                }
            },
            storeDialogCance() {
                this.dialogVisible = false;
            },
            storeDialogConfirm(formName) {
                console.log(this.dialog_form.tags)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.dialog_form.store_id){
                            editStore(this.dialog_form).then(response => {
                                this.dialogVisible = false;
                                this.dialog_form.imageData=[];
                                //回调父组件，刷新页面
                                this.$emit('success');
                            }).catch(function (error) {
                                console.log(error);
                            }).then(function () {
                            });
                        }else{
                            addStore(this.dialog_form).then(response => {
                                this.dialogVisible = false;
                                this.dialog_form.imageData=[];
                                //回调父组件，刷新页面
                                this.$emit('success');
                            }).catch(function (error) {

                            }).then(function () {

                            });
                        }
                    } else {
                        return false;
                    }
                });

            },
            handleRemove(file, fileList) {
                if(!isNaN(file.name)){
                    deleteImage({
                        'image_id':file.name,
                    }).then(r=>{
                        this.$emit('success');
                    });
                }
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
            loadStoreTags(){
                storeTagList().then(response => {
                    this.storeTags=response.data;
                }).catch()
            },
            noticeCloseDialog(){
                this.$emit('noticeCloseDialog');
            },
            remoteCompanyList(){
                this.loading = true;
                companyList({limit:500,page:1}).then(response => {
                    this.companyListData=response.data.data.data;
                    this.loading=false;
                });
            },
        }
    };
</script>