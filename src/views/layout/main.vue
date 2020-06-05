<template>
    <el-container style="height:auto; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['0']"  class="left">
                <el-submenu index="0" v-for="item in routes" :key="item.name">
                    <template slot="title"><i class="el-icon-odometer"></i>{{item.meta.title}}</template>
                    <el-menu-item-group v-if="item.children.length>1">
                        <template>
                            <el-menu-item @click="selectMenu(sub.name,'')" index="sub.name" v-for="sub in item.children.filter(function (item) { return !(item.hidden);})"
                                          :key="sub.name">
                                <i class="el-icon-setting"></i>
                                <span slot="title">{{sub.meta.title}}</span>
                            </el-menu-item>
                        </template>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="item.name" v-for="item in singleRoutes" :key="item.name" @click="selectMenu(item.name,'')">
                    <i class="el-icon-odometer"></i>
                    <span slot="title">{{item.meta.title}}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><span @click="userDetail()">查看</span></el-dropdown-item>
                        <el-dropdown-item><span @click="logout()">退出登录</span></el-dropdown-item>
                        <el-dropdown-item><span @click="selectMenu('home','')">返回主页</span></el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{user_name}}</span>
            </el-header>
            <el-main>
                <!--main  box start-->
                <router-view></router-view>
                <!--main  box end-->
            </el-main>
        </el-container>
    </el-container>

</template>
<script>
    import route from "@/route.js";

    export default {
        data() {
            return {
                routes: route.options.routes.filter(function (item) {
                    return !(item.hidden)&&item.children.length>1;
                }),
                singleRoutes:route.options.routes.filter(function (item) {
                    return !(item.hidden)&&item.children.length==1;
                }),
                user_name: this.$store.getters.user_name,
                user_id: this.$store.getters.user_id,
            }
        },
        methods: {
            selectMenu(routeName, param) {
                if (this.$route.name!==routeName) {
                    this.$router.push({'name': routeName, 'param': param});
                }
            },
            async logout() {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            },
            userDetail() {
                this.$router.push({'name': 'sys-edit-user', 'param': {
                        user_id: this.$store.getters.user_id,
                    }
                });
            }
        }
    }
</script>
<style>
    .breadcrumb-box {
        height: 20px;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .el-header {
        color: #333;
        line-height: 60px;
    }
    .el-aside {
        color: #333;
    }
    .el-container {
        min-height: 1000px;
    }
</style>

