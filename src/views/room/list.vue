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
            <el-dialog :title=title :close-on-click-modal="closeModal" :visible.sync="dialogVisible" width="600px;">

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
                        <el-form-item label="板子选择" prop="dup_id">
                            <el-select v-model="dialog_form.dup_id" placeholder="请选择板子">
                                <el-option
                                        v-for="item in boardListData"
                                        :key="item.dup_id"
                                        :label="item.board_name"
                                        :value="item.dup_id">
                                </el-option>
                            </el-select>
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
                        <el-form :model="deviceItem" ref="device_form" :rules="addDeviceRules" label-width="80px" style="position: relative;">
                            <el-form-item prop="seat_num" style="width:20%;float:left;position: relative;" label="座位号">
                                <el-input v-model.number="deviceItem.seat_num"  placeholder="座位号"></el-input>
                            </el-form-item>
                            <el-form-item prop="device_name" style="width:30%;float:left;position: relative;" label="设备名称">
                                <el-input v-model.number="deviceItem.device_name"  placeholder="设备名称"></el-input>
                            </el-form-item>
                            <el-form-item prop="device_id" style="width:30%;float:left;position: relative;"  label="设备id">
                                <el-input v-model="deviceItem.device_id"  placeholder="设备id"></el-input>
                            </el-form-item>
                            <el-form-item style="width:20%;float:left;">
                                <el-button size="mini" @click="addDeviceItem('device_form')" round>添加设备</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form-item label="游戏设备" style="margin-top:100px; " prop="devices">
                            <el-table :data="dialog_form.devices" border style="width: 100%">
                                <el-table-column  type="index" :index="indexMethod" label="序号"></el-table-column>
                                <el-table-column prop="seat_num" label="座位号">
                                </el-table-column>
                                <el-table-column  prop="device_id" label="设备id">
                                </el-table-column>
                                <el-table-column  prop="device_name" label="设备名称">
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                       <span> <el-button size="mini" type="danger" @click="removeDeviceItem(scope.row)" round>删除设备</el-button></span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>

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
    import {boardList} from "@/api/board";
    import {Message} from 'element-ui'

    export default {
        data() {
            let checkDevices = (rule, value, callback) => {
                let l=value.length;
                if (l<1) {
                    return callback(new Error('设备不能为空'));
                }
                let max=this.dialog_form.seats_num+1;
                if(max<l){
                    return callback(new Error('设备不能超过(座位数+1)，即'+max+'个,请删除多余的设备!'));
                }
                if(l>17){
                    return callback(new Error('设备不能超过17个'));
                }
                if(max>l){
                    return callback(new Error('设备数还没满'+max+'个,座位数量n，必须添加n+1设备！'));
                }
                let tmp=value.filter(v=>v.seat_num>this.dialog_form.seats_num);
                if(tmp.length>0){
                    return callback(new Error('已添加的设备列表，座位号只能小于等于座位数！这种情况一般是编辑设备，删除了低位座位号设备，刷新页面重新编辑即可！'));
                }
                let tmpJudge=value.filter(v=>v.seat_num==0);
                if(tmpJudge.length!==1){
                    return callback(new Error('请添加法官设备，0号位'));
                }
                callback();
            };
            let checkSeatsNum=(rule, value, callback) => {
                if(isNaN(value)){
                    return callback(new Error('座位数量,必须是一个数字'));
                }
                if(value<1||value>16){
                    return callback(new Error('座位数量,取值范围1-16'));
                }
                callback();
            };
            let checkSeatNum = (rule, value, callback) => {
                if(isNaN(value)){
                    return callback(new Error('座位号必须是一个数字'));
                }
                let n=this.dialog_form.seats_num||16;
                if(value<0||value>n){
                    return callback(new Error('座位号取值范围0-'+n));
                }
                let setArr=this.dialog_form.devices.map(v=>v.seat_num);
                //座位号是否重复？
                if(setArr.indexOf(value)>-1){
                    return callback(new Error('座位号不能重复!'));
                }
                callback();
            };
            let checkDeviceId = (rule, value, callback) => {
                if(isNaN(value)){
                    return callback(new Error('设备id必须一个数字，即短id'));
                }
                if(value<1){
                    return callback(new Error('设备id只能是大于0的整数!'));
                }
                let devArr=this.dialog_form.devices.map(v=>v.device_id);
                //座位号是否重复？
                if(devArr.indexOf(value)>-1){
                    return callback(new Error('设备id不能重复!'));
                }
                //数据库是否存在该设备id?在后端检查吧，重复就过滤
                callback();
            };
            return {
                activeName:'list',
                tableRoomData:[],
                boardListData:[],
                closeModal:false,
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
                    seat_num:0,
                    device_id:'',
                    device_name:'设备0',
                },
                dialog_form: {
                    room_id:"",
                    dup_id: 1,
                    room_name: "",
                    seats_num: 16,
                    describe: '',
                    devices: [],
                    billing_id: '',
                    storeArr: [0,0],
                    delDevicesIds:[],
                },
                rules: {
                    room_name: [
                        {required: true, message: '请输入房间名称最长30位', trigger: 'blur'},
                        {min: 3, max: 30, message: '长度在 3 到 30个字符', trigger: 'blur'}
                    ],
                    seats_num: [
                        { validator:checkSeatsNum, trigger: 'blur'}
                    ],
                    dup_id: [
                        {required: true, message: '请填选择板子', trigger: 'change'}
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
                        { validator:checkDevices, trigger: 'blur'}
                    ],
                },
                addDeviceRules:{
                    seat_num: [
                        { validator:checkSeatNum,trigger:'blur'}
                    ],
                    device_id: [
                        { validator:checkDeviceId,trigger:'blur'}
                    ],
                    device_name: [
                        {required: true, message: '请填输入设备名称', trigger: 'blur'}
                    ],
                }
            };
        },
        mounted() {
            this.loadRoomListData();
            this.loadBoardList();
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
                this.dialog_form.dup_id = row.dup_id;
                this.dialog_form.storeArr = [row.company_id,row.store_id];
                this.loadBillingData([row.company_id,row.store_id]);
            },
            handleAddRoom(){
                this.dialog_form.room_id =0;
                this.dialogVisible = true;
                this.dialog_form.storeArr=[];
                this.dialog_form.devices=[];
                this.dialog_form.billing_id='';
                this.dialog_form.room_name='';
                this.dialog_form.describe='';
                this.billingData=[];
            },
            removeDeviceItem(row){
                let index=this.dialog_form.devices.indexOf(row);
                this.dialog_form.devices.splice(index,1);
            },
            addDeviceItem(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let dev_num=this.dialog_form.devices.length;
                        let max=this.dialog_form.seats_num+1;
                        if(dev_num>=max){
                            this.showMessage('最多添加'+max+'个设备,0号位是法官，其他1-'+this.dialog_form.seats_num+'号');
                            return false;
                        }
                        if(max>dev_num){
                            this.dialog_form.devices.push({
                                seat_num:this.deviceItem.seat_num,
                                device_id:this.deviceItem.device_id,
                                device_name:this.deviceItem.device_name,
                            });
                            this.dialog_form.devices.sort(function(a,b){
                                return a.seat_num - b.seat_num
                            })

                            this.deviceItem.seat_num+=1;
                            this.deviceItem.device_name='设备'+this.deviceItem.seat_num;
                        }else{
                            this.showMessage('座位数已满'+max);
                        }
                    } else {
                        return false;
                    }
                });
            },
            indexMethod(index) {
                return index+1;
            },
            showMessage(message){
                Message({
                    message: message,
                    type:'error',
                    duration: 5 * 1000
                })
            },
            loadBoardList(){
                boardList({limit:50}).then(response => {
                    this.boardListData= response.data.data.data;
                }).catch(function (error) {
                }).then(function () {
                });
            }
        }
    };
</script>

