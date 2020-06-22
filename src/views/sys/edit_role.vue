<template>
    <el-form ref="form" label-width="80px">
        <el-form-item label="角色名称">
            <el-input v-model="item.role_name"></el-input>
        </el-form-item>
        <el-row>
            <el-col :span="3">
                <div class="grid-content bg-purple-dark">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                </div>
            </el-col>
            <el-col :span="21">
                <el-row v-for="(sub,i) in menu" :key="i"
                        style="border-style:dashed; border-width: 1px 1px; margin:5px;">
                    <el-checkbox-group v-model="checkedRole">
                        <el-col :span="3">
                            <el-checkbox :label="i" :checked="sub.checked" @change="handleCheckedRoleChange" :key="i">
                                {{sub.name}}
                            </el-checkbox>
                        </el-col>
                        <el-col :span="21">
                            <el-row v-for="(m,j) in sub.child" :key="j"
                                    style="border-style:dashed; border-width: 1px 1px; margin:5px;">
                                <el-col :span="3">
                                    <el-checkbox :checked="m.checked" :label="i+'.'+j" :key="i+'.'+j"
                                                 @change="handleCheckedRoleChange">{{m.name}}
                                    </el-checkbox>
                                </el-col>
                                <el-col :span="21">
                                    <el-row>
                                        <el-col :span="3" v-for="(s,l) in m.child" :key="l"
                                                style="border-style:dashed; border-width: 1px 1px; margin:5px;">
                                            <el-checkbox :checked="s.checked" :label="i+'.'+j+'.'+l"
                                                         :key="i+'.'+j+'.'+l">{{s.name}}
                                            </el-checkbox>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-checkbox-group>
                </el-row>
            </el-col>
        </el-row>

        <el-form-item>
            <el-button type="primary" @click="onSubmit" round>立即保存</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import {getRoleItem,editRole} from '@/api/role'


    export default {
        data() {
            return {
                role_id:this.$route.params.role_id||1,
                item: {
                    role_name: '',
                    role_id: '',
                },
                checkAll: false,
                checkedRole: [],
                menu: [],
                isIndeterminate: true
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {
                getRoleItem({
                    'role_id':this.role_id,
                }).then(response => {
                    this.item = response.data.item;
                    this.menu = response.data.menu;
                }).catch(function (error) {
                    console.log(error);
                }).then(function () {
                    console.log('do onSubmit');
                });
            },
            handleCheckAllChange(val) {
                if (val) {
                    let tmp = [];
                    for (let o of Object.keys(this.menu)) {
                        tmp.push(o);
                        for (let m of Object.keys(this.menu[o].child)) {
                            tmp.push(o + '.' + m);
                            for (let s of Object.keys(this.menu[o].child[m].child)) {
                                tmp.push(o + '.' + m + '.' + s);
                            }
                        }
                    }
                    this.checkedRole = tmp;
                    this.isIndeterminate = false;
                } else {
                    this.checkedRole = [];
                }
            },
            handleCheckedRoleChange(val) {
                console.log(val)
            },
            onSubmit(){
                editRole({
                    'role_id':this.role_id,
                    'act':this.checkedRole,
                }).then(response => {

                }).catch(function (error) {

                }).then(function () {
                    console.log('do onSubmit');
                })


            }
        }
    }
</script>
<style>

</style>
