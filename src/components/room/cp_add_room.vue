<template>
 <span>
    <el-row v-if="!row">
        <el-col :span="24">
            <el-button
                    size="mini"
                    style="float: right;margin-right: 20px;margin-bottom: 10px;"
                    @click="dialogVisible=true"
                    round
            >新增房间
            </el-button>
        </el-col>
    </el-row>
     <template v-else>
        <el-button size="mini" @click="dialogVisible=true" round>编辑房间</el-button>
     </template>
        <el-dialog :title=title :visible.sync="dialogVisible" >
                <el-form :model="dialog_form" ref="dialog_form" :rules="rules" label-width="100px">
                    <el-form-item label="所属门店" prop="storeArr">
                        <el-cascader placeholder="选择所在区域" v-on:change="loadBillingData" v-model=dialog_form.storeArr
                                     :props="storeListData" clearable></el-cascader>
                    </el-form-item>
                    <el-form-item label="房间名称" prop="room_name">
                        <el-input v-model="dialog_form.room_name" placeholder="请输入房间名字最长30位"></el-input>
                    </el-form-item>
                    <el-form-item label="座位数量" prop="seats_num">
                        <el-input v-model.number="dialog_form.seats_num" placeholder="请选择设置座位数量"></el-input>
                    </el-form-item>
                    <el-form-item label="计费模式" prop="billing_id">
                        <el-select v-model="dialog_form.billing_id" placeholder="请选择计费模式">
                            <el-option
                                    v-for="item in billingData"
                                    :key="item.billing_id"
                                    :label="item.billing_name"
                                    :value="item.billing_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="房间描述" prop="describe">
                        <el-input v-model="dialog_form.describe" type="textarea" :rows="3"
                                  placeholder="请输入房间描述最长150字"></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCance">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm('dialog_form')">确 定</el-button>
        </span>
        </el-dialog>
    </span>
</template>
<script>
    import {companyAndRoomList, addRoom, editRoom} from "@/api/room";
    import {billingList} from "@/api/billing";

    export default {
        'name': 'cp_add_room',
        props: [
            'row',
        ], mounted() {
            this.loadBillingData(this.dialog_form.storeArr);
        },
        computed: {
            title: function () {
                return this.row ? '编辑房间' : '新增房间';
            }
        },
        data() {
            return {
                dialogVisible: false,
                billingData: [],
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
                    room_id: this.row ? this.row.room_id : "",
                    room_name: this.row ? this.row.room_name : "",
                    seats_num: this.row ? this.row.seats_num : 16,
                    describe: this.row ? this.row.describe : '',
                    devices: this.row ? this.row.devices : [],
                    billing_id: this.row ? this.row.billing_id : '',
                    storeArr: this.row ? [this.row.company_id, this.row.store_id] : [],
                },
                rules: {
                    room_name: [
                        {required: true, message: '请输入房间名称最长30位', trigger: 'blur'},
                        {min: 3, max: 30, message: '长度在 3 到 30个字符', trigger: 'blur'}
                    ],
                    seats_num: [
                        {required: true, message: '请填写座位数'},
                        {type: 'number', message: '你输入的必须是数字'}
                    ],
                    storeArr: [
                        {required: true, message: '请选择门店'},
                    ],
                    describe: [
                        {required: true, message: '请填输入房间描述', trigger: 'blur'}
                    ],
                    billing_id: [
                        {required: true, message: '请填选择计费模式', trigger: 'change'}
                    ],
                }
            };
        },
        methods: {
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialog_form.room_id) {
                            editRoom(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    //回调父组件，刷新页面
                                    this.$emit('success');
                                }).catch(function (error) {
                            }).then(function () {
                            });
                        } else {
                            addRoom(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
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
            dialogCance() {
                this.dialogVisible = false;
            },
            loadBillingData(value) {
                let company_id = value[0];
                let store_id = value[1];
                this.billingData = [];
                if (company_id && store_id) {
                    billingList({'company_id': company_id, 'store_id': store_id}).then(response => {
                        this.billingData = response.data.data.data;
                    }).catch(function (error) {
                    }).then(function () {
                    });
                } else {
                    this.dialog_form.billing_id = '';
                }
            },

        }
    };
</script>
