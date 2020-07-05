<template>
    <div>

        <el-button style="float:right;" type="primary" icon="el-icon-search" size="mini" @click="onClearLog" round>clear log cache</el-button>
        <el-table
                v-loading="loading"
                :data="tableData"
                v-on:row-click="showLog"
                border
                stripe
                highlight-current-row
                header-cell-class-name="table-header-class"
                style="width:100%">
            <el-table-column prop="file"  label="文件">
            </el-table-column>
        </el-table>



        <el-dialog
                :title=list.title
                :visible.sync="list.drawer"
                width="90%"
                :close-on-click-modal="false"
                :before-close="handleClose" >
            <span>{{list.title}}</span>
               <pre style="white-space:pre-wrap;word-wrap: break-word;">{{info}}</pre>
           <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleClose">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
    import {logError,showLogData} from '@/api/log'

    export default {
        created() {
        },
        data() {
            return {
                tableData: [],
                loading:false,
                list:{
                    title:'',
                    drawer: false,
                    direction: 'rtl',
                },
                info:'',
                tmp:[],
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {
                this.loading = true;
                logError().then(response => {
                    this.tableData = response.data.data
                    this.loading = false;
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                }).then(function () {
                    console.log('add role onSubmit');
                });
            },
            handleClose() {
                this.list.drawer=false;
            },
            showLog(row,column, event){
                this.list.title=row.file;
                if(!this.tmp[row.file]){
                    showLogData(this.list).then(res=>{
                        this.info=res.data.content;
                        this.tmp[row.file]=res.data.content;
                        this.list.drawer=true;
                    });
                }else{
                    this.info=this.tmp[row.file];
                    this.list.drawer=true;
                }

            },
            onClearLog(){
                this.tmp=[];
                console.log('clear log success!');
            }
        },

    };
</script>

