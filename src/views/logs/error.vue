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

        <el-drawer
                size="80%"
                :title="drawer_list.title"
                :visible.sync="drawer_list.drawer"
                :direction="drawer_list.direction"
                :before-close="handleClose">
            <pre>{{drawer_list.info}}</pre>
        </el-drawer>

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
                drawer_list:{
                    title:'',
                    drawer: false,
                    direction: 'rtl',
                    info:'',
                },
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
            handleClose(done) {
                done();
            },
            showLog(row,column, event){
                this.drawer_list.title=row.file;
                if(!this.tmp[row.file]){
                    showLogData(this.drawer_list).then(res=>{
                        this.drawer_list.info=res.data.content;
                        this.tmp[row.file]=res.data.content;
                        this.drawer_list.drawer=true;
                    });
                }else{
                    this.drawer_list.info=this.tmp[row.file];
                    this.drawer_list.drawer=true;
                }

            },
            onClearLog(){
                this.tmp=[];
                console.log('clear log success!');
            }
        },

    };
</script>

