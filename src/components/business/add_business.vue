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
            <el-form ref="form" :model="dialog_form" label-width="80px">
                <el-form-item label="商户名称">
                    <el-input v-model="dialog_form.company_name"></el-input>
                </el-form-item>
                <el-form-item label="所在国家">
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
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog
                            width="30%"
                            title="营业执照-原图"
                            :visible.sync="dialogImgVisible"
                            append-to-body
                    >
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                </el-form-item>

                <el-form-item label="联系人">
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

                <el-form-item label="分成比例">
                    <el-input v-model="dialog_form.proportion"></el-input>
                </el-form-item>
                <el-form-item label="商户账号">
                    <el-input v-model="dialog_form.account"></el-input>
                </el-form-item>
                <el-form-item label="商户密码">
                    <el-input v-model="dialog_form.password" show-password></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="businessDialogCance">取 消</el-button>
          <el-button type="primary" @click="businessDialogConfirm">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
    import {
        addCompany,
    } from "@/api/company";
    export default {
        'name': 'add_business',
        props:['state'],
        data() {
            return {
                dialogVisible: false,
                closeModal:false,
                dialogImageUrl: '',
                dialogImgVisible:false,
                visibleDialog:this.visible,
                dialog_form: {
                    company_name: "",
                    state_id: "",
                    real_name: "",
                    phone: "",
                    proportion: 100,
                    account: "",
                    password: "",
                    sex:'1'
                },
            };
        },
        methods: {
            businessDialogCance() {
                //      this.$emit('confirm')
                this.dialogVisible = false;
            },
            businessDialogConfirm() {
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
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImgVisible = true;
            },
        }
    };
</script>