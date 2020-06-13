<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="房间列表" :inline="true"  name="list">
            <el-form :inline="true" :model="form_list" class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="form_list.business_name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="form_list.room_name" placeholder="请输入房间名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="loadRoomListData" round>查询</el-button>
                </el-form-item>
            </el-form>
            <cp_add_room v-on:success="loadRoomListData"></cp_add_room>
            <el-table
                    v-loading="loading"
                    :data="tableRoomData"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column prop="room_id" label="序号" ></el-table-column>
                <el-table-column prop="room_name" label="房间名称"></el-table-column>
                <el-table-column prop="company.company_name" label="所属商户"></el-table-column>
                <el-table-column prop="store.store_name" label="所在店面"></el-table-column>
                <el-table-column prop="seats_num" label="配置人数"></el-table-column>
                <el-table-column  label="收费模式">
                    <template slot-scope="scope">
                        <span>{{ scope.row.billing.price }}{{ scope.row.billing.price_type }},{{ scope.row.billing.time_unit}}/{{ scope.row.billing.time_type}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建日期"></el-table-column>
                <el-table-column prop="is_use" label="使用状态"></el-table-column>
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
        </el-tab-pane>
    </el-tabs>
</template>
<script>

  import cp_add_room from '@/components/room/cp_add_room'
  
  import  {roomList} from  '@/api/room';

    export default {
        components: {
            cp_add_room
        },
        data() {
            return {
                activeName: 'list',
                tableRoomData: [],
                paginate: {
                    total:0,        // 总数
                    pageIndex: 1,  // 当前位于哪页
                    pageSize:15,   // 1页显示多少条
                    pageSizes: [5, 10, 15, 20],  //每页显示多少条
                    layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
                },
                loading:false,
                form_list: {
                    room_name:'',
                    business_name: '',
                    limit:10,
                    page:1,
                },
            };
        },
        mounted() {
            this.loadRoomListData();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            loadRoomListData(){
                roomList(this.form_list).then(response => {
                    this.tableRoomData = response.data.data.data
                    this.loading = false;
                    this.paginate.total = response.data.data.total;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {

                });
                
                this.tableRoomData=[];
            },
            handleChangePage(page){
                this.paginate.pageIndex = page;
                this.form_list.page=page;
                this.loadRoomListData();
            },
            handleChangeSize(pageSize){
                this.paginate.pageSize = pageSize;
                this.form_list.limit=pageSize;
                this.loadRoomListData();
            }
        }
    };
</script>

