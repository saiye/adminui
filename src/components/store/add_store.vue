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
        <el-dialog title="添加店面" :visible.sync="dialogVisible" width="700px">
            <div class="add-dialog-box">
                <el-form ref="form" :model="dialog_form" label-width="100px">
                    <el-form-item label="店面名称">
                        <el-input v-model="dialog_form.store_name"></el-input>
                    </el-form-item>

                    <el-form-item label="所在区域">
                        <el-cascader placeholder="选择所在区域" v-model=dialog_form.area :props="areaListData" clearable ></el-cascader>
                    </el-form-item>

                    <el-form-item label="店面地址">
                        <el-input v-model="dialog_form.address"></el-input>
                    </el-form-item>

                    <el-form-item label="所属商户">
                    <el-select
                                v-model="dialog_form.company_id"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入商户关键词"
                                :remote-method="remoteCompanyList"
                                :loading="loading">
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
                                action="https://jsonplaceholder.typicode.com/posts/"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog
                                width="30%"
                                title="店面-原图"
                                :visible.sync="dialogImgVisible"
                                append-to-body
                        >
                            <img width="100%" :src="dialogImageUrl" alt/>
                        </el-dialog>
                    </el-form-item>

                    <el-form-item label="联系人姓名">
                        <el-input v-model="dialog_form.real_name">
                            <template slot="append">
                                <el-radio v-model="dialog_form.sex" label="1">男</el-radio>
                                <el-radio v-model="dialog_form.sex" label="2">女</el-radio>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="dialog_form.phone">
                            <template slot="prepend">+86中国大陆</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="账号">
                        <el-input v-model="dialog_form.account"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="dialog_form.password" show-password></el-input>
                    </el-form-item>

                    <el-form-item label="店面描述">
                        <el-input v-model="dialog_form.describe"  type="textarea"
                                  :rows="2"
                                  placeholder="请输入描述"></el-input>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
          <el-button @click="storeDialogCance">取 消</el-button>
          <el-button type="primary" @click="storeDialogConfirm">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import {areaList,companyList} from "@/api/company";

    import {addStore,storeList} from "@/api/store";

    export default {
        'name': 'add_store',
        props: ['state'],
        data() {
            return {
                dialogVisible: false,
                loading: false,
                companyListData: [],
                dialogImageUrl: '',
                dialogImgVisible: false,
                visibleDialog: this.visible,
                dialog_form: {
                    describe: "",
                    store_name: "",
                    company_id: "",
                    address: "",
                    real_name: "",
                    phone: "",
                    proportion: 100,
                    account: "",
                    password: "",
                    sex:'1',
                    area:[],
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
        methods: {
            storeDialogCance() {

                this.dialogVisible = false;
            },
            storeDialogConfirm() {
                //addStore,storeList
                addStore(this.dialog_form)
                    .then(response => {
                        this.dialogVisible = false;
                        //回调父组件，刷新页面
                       this.$emit('success');
                    }).catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        console.log("add role onSubmit");
                    });
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImgVisible = true;
            },
            remoteCompanyList(query){
                this.loading = true;
                companyList({
                    company_name:query,
                }).then(response => {
                   this.companyListData=response.data.data.data;
                   this.loading=false;
                });
            }
        }
    };
</script>