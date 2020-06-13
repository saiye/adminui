<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-button
                        size="mini"
                        style="float: right;margin-right: 20px;margin-bottom: 10px;"
                        @click="dialogVisible=true"
                        round
                >新增计费模式
                </el-button>
            </el-col>
        </el-row>
        <el-dialog title="新增计费模式" :visible.sync="dialogVisible" width="700px">
            <div class="add-dialog-box">
                <el-form :model="dialog_form" ref="dialog_form" :rules="rules" label-width="100px">

                    <el-form-item label="所属门店">
                        <el-cascader placeholder="选择所在区域" v-model=dialog_form.storeArr :props="storeListData" clearable ></el-cascader>
                    </el-form-item>

                    <el-form-item label="模式名称" prop="billing_name">
                        <el-input v-model="dialog_form.billing_name" placeholder="请输入模式名字最长15位"></el-input>
                    </el-form-item>
                    <el-form-item label="计费单价" prop="price">
                        <el-input v-model.number="dialog_form.price" placeholder="计费单价，仅为数字,最小0.1"></el-input>
                    </el-form-item>

                    <el-form-item label="计费单位" prop="time_unit">
                        <el-row>
                         <el-col :span="12">
                             <el-input v-model.number="dialog_form.time_unit" placeholder="计费单位，仅为数字,不能为0"></el-input>
                         </el-col>
                            <el-col :span="6">
                                <el-select v-model.number="dialog_form.time_type" placeholder="时间类型">
                                    <el-option
                                            v-for="item in TimeTypeArr"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <el-select v-model.number="dialog_form.price_type" placeholder="货币类型">
                                    <el-option
                                            v-for="item in PriceTypeArr"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>

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
    import {companyAndRoomList} from "@/api/room";
    import {addBilling} from "@/api/billing";

    export default {
        'name': 'cp_add_billing',
        props: [
            'TimeTypeArr',
            'PriceTypeArr',
        ],
        data() {
            return {
                dialogVisible: false,
                loading: false,
                UserListData: [],
                billingData: [],
                storeArr: [],
                storeListData: {
                    lazy: true,
                    lazyLoad(node, resolve) {
                        const {level} = node;
                        let param = {
                            'parent_id': node.value || -1,
                            'level': node.level || 0,
                        };
                        companyAndRoomList(param).then(response => {
                            resolve(response.data.data);
                        }).catch(function (error) {
                            console.log(error);
                        }).then(function () {

                        });
                    }
                },
                dialog_form: {
                    billing_name: "",
                    price:100,
                    price_type:1,
                    time_unit:2,
                    time_type:2,
                },
                rules: {
                    billing_name: [
                        {required: true, message: '请输入模式名称最长15位', trigger: 'blur'},
                        {min: 1, max: 15, message: '长度在 1 到 15个字符', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '请输入计费单价'},
                        {type: 'number', message: '你输入的必须是数字'}
                    ],
                    price_type: [
                        {required: true, message: '请选择货币类型', trigger: 'change'},
                        {type: 'number', message: '必须数值类型'}
                    ],
                    time_type: [
                        {required: true, message: '请选择货币类型', trigger: 'change'},
                        {type: 'number', message: '必须数值类型'}
                    ],
                    time_unit: [
                        {required: true, message: '请输入单位数值', trigger: 'blur'},
                        {type: 'number', message: '你输入的必须是数字,不能为0'}
                    ],
                }
            };
        },
        methods: {
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addBilling(this.dialog_form)
                            .then(response => {
                                this.dialogVisible = false;
                                //回调父组件，刷新页面
                                this.$emit('success');
                            }).catch(function (error) {
                        }).then(function () {
                        });
                    } else {
                        return false;
                    }
                });
            },
            dialogCance() {
                this.dialogVisible = false;
            },
        }
    };
</script>