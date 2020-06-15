<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="房间列表" :inline="true" name="list">
            <el-form :inline="true" :model="form_list" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="form_list.business_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form_list.room_name" placeholder="请输入房间名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="loadRoomListData" round>查询</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="24">
                    <el-button
                            size="mini"
                            style="float: right;margin-right: 20px;margin-bottom: 10px;"
                            @click="handleAddRoom"
                            round
                    >新增房间
                    </el-button>
                </el-col>
            </el-row>
            <el-table
                    v-loading="loading"
                    :data="tableRoomData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="room_id" label="序号"></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="company.company_name" label="所属商户"></el-table-column>
                <el-table-column prop="store.store_name" label="所在店面"></el-table-column>
                <el-table-column prop="seats_num" label="配置人数"></el-table-column>
                <el-table-column label="收费模式">
                    <template slot-scope="scope">
                        <span>{{ scope.row.billing.price }}{{ scope.row.billing.price_type }},{{ scope.row.billing.time_unit}}/{{ scope.row.billing.time_type}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="is_use" label="使用状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEditRoom(scope.row)" round>编辑房间</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination background
                                       v-if='paginate.total > 0'
                                       :page-sizes="paginate.pageSizes"
                                       :page-size="paginate.pageSize"
                                       :layout="paginate.layout"
                                       :total="paginate.total"
                                       :current-page='paginate.pageIndex'
                                       @current-change='handleChangePage'
                                       @size-change='handleChangeSize'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
            <!--dialog start-->
            <el-dialog :title=title :visible.sync="dialogVisible" width="80%">
                <div class="add-dialog-box">
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
                            <el-input v-model="dialog_form.describe" type="textarea" :rows="3" placeholder="请输入房间描述最长150字"></el-input>
                        </el-form-item>

                        <el-form-item prop="seat_num" style="width:30%;float: left;" label="座位号">
                            <el-input v-model.number="deviceItem.seat_num"  placeholder="座位号"></el-input>
                        </el-form-item>
                        <el-form-item prop="device_id" style="width:40%;float: left;"  label="设备id">
                            <el-input v-model="deviceItem.device_id"  placeholder="设备id"></el-input>
                        </el-form-item>
                        <el-form-item style="width:30%;float: left;">
                            <el-button size="mini" @click="addDeviceItem()" round>添加设备</el-button>
                        </el-form-item>

                        <el-form-item label="游戏设备" style="width:100%;float: left;" prop="devices">
                            <el-table :data="dialog_form.devices" border style="width: 100%">
                                <el-table-column  type="index" :index="indexMethod" label="序号"></el-table-column>
                                <el-table-column prop="seat_num" label="座位号">
                                </el-table-column>
                                <el-table-column  prop="device_id" label="设备id">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                       <span> <el-button size="mini" @click="removeDeviceItem(scope.index,scope.row)" round>删除设备</el-button></span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
          <el-button @click="dialogCance">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm('dialog_form')">确 定</el-button>
        </span>
            </el-dialog>
            <!--dialog end-->
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import {companyAndRoomList, roomList, addRoom, editRoom} from "@/api/room";
    import {billingList} from "@/api/billing";
    import {Message} from 'element-ui'

    export default {
        data() {
            return {
                activeName:'list',
                tableRoomData:[],
                paginate: {
                    total: 0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize: 15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                loading: false,
                form_list: {
                    room_name: '',
                    business_name: '',
                    limit: 10,
                    page: 1,
                },
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
                deviceItem:{
                    id:'-1',
                    seat_num:'',
                    device_id:'',
                },
                dialog_form: {
                    room_id: "",
                    room_name: "",
                    seats_num: 16,
                    describe: '',
                    devices: [],
                    billing_id: '',
                    storeArr: [],
                    delDevicesIds:[],
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
                    seat_num: [
                        {required: true, message: '请填写座位号'},
                        {type: 'number', message: '你输入的必须是数字'}
                    ],
                    device_id: [
                        {required: true, message: '请填写设备id'},
                        {min:3, max: 30, message: '长度在 3 到 30个字符', trigger: 'blur'}
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
                    devices:[
                        {required: true, message: '请填写设备信息', trigger: 'blur'}
                    ],
                }
            };
        },
        mounted() {
            this.loadRoomListData();
        },
        watch: {
            dialog_form: function (n, o) {
                let dev_num=n.devices.length;
                let seats_num=n.seats_num;
                if(dev_num!==seats_num){
                  //  let add_num=0,remove_num=0;

                    let add_num=seats_num-dev_num;
                    console.log('add_num:')
                    console.log(add_num)

                }
            }
        },
        computed:{
            title:function(){
                return this.dialog_form.room_id?'编辑房间':'新增房间';
            },
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadRoomListData() {
                roomList(this.form_list).then(response => {
                    this.tableRoomData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });

                this.tableRoomData = [];
            },
            handleChangePage(page) {
                this.paginate.pageIndex = page;
                this.form_list.page = page;
                this.loadRoomListData();
            },
            handleChangeSize(pageSize) {
                this.paginate.pageSize = pageSize;
                this.form_list.limit = pageSize;
                this.loadRoomListData();
            },
            dialogConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialog_form.room_id) {
                            editRoom(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    //回调父组件，刷新页面
                                    this.loadRoomListData();
                                }).catch(function (error) {
                            }).then(function () {
                            });
                        } else {
                            addRoom(this.dialog_form)
                                .then(response => {
                                    this.dialogVisible = false;
                                    //回调父组件，刷新页面
                                    this.loadRoomListData();
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
            handleEditRoom(row) {
                this.dialogVisible = true
                this.dialog_form.room_id = row.room_id;
                this.dialog_form.room_name = row.room_name;
                this.dialog_form.seats_num = row.seats_num;
                this.dialog_form.describe = row.describe;
                this.dialog_form.devices = row.devices;
                this.dialog_form.billing_id = row.billing_id;
                this.dialog_form.storeArr = [row.company_id,row.store_id];
                this.loadBillingData([row.company_id,row.store_id]);
            },
            handleAddRoom(){
                this.dialog_form.room_id =0;
                this.dialog_form.storeArr=[];
                this.dialog_form.devices=[];
                this.dialog_form.billing_id='';
                this.dialog_form.room_name='';
                this.dialog_form.describe='';
                this.dialogVisible = true
                this.billingData=[];
            },
            removeDeviceItem(index,row){
                this.dialog_form.delDevicesIds.push(row.id);
                this.dialog_form.devices.splice(index, 1);
            },
            addDeviceItem(formName){
                let dev_num=this.dialog_form.devices.length;
                if(this.dialog_form.seats_num>dev_num){
                    //
                    if(isNaN(this.deviceItem.seat_num)||this.deviceItem.seat_num<1||this.deviceItem.seat_num>16){
                        this.showMessage('座位号不是数字,或者小于1,大于16');
                        return ;
                    }
                    if(!this.deviceItem.device_id){
                        this.showMessage('设备id不能为空');
                        return ;
                    }
                    this.dialog_form.devices.push({
                        id:'-1',
                        seat_num:this.deviceItem.seat_num,
                        device_id:this.deviceItem.device_id,
                    });

                }else{
                    this.showMessage('座位数已满'+this.dialog_form.seats_num);
                }
            },
            indexMethod(index) {
                return index+1;
            },
            showMessage(message){
                Message({
                    message: message,
                    type:'danger',
                    duration: 5 * 1000
                })
            }
        }
    };
</script>

