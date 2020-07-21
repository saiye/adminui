<template>
    <el-container >
        <el-aside width="200px">
            <div class="left-logo">
                <span>{{title}}</span>
            </div>
            <el-menu :default-active="$route.name" class="el-menu-vertical-demo">
                <el-submenu :index="item.name"  v-for="item in routes" :key="item.name">
                    <template slot="title">
                        <i class="el-icon-odometer"></i>
                        <span>{{item.meta.title}}</span>
                    </template>
                    <el-menu-item-group >
                        <template slot="title">{{item.meta.title}}</template>
                        <el-menu-item :index="sub.name"  @click="selectMenu(sub.name,'')" v-for="sub in item.children.filter(function (item) { return !(item.hidden);})" :key="sub.name">
                            <i class="el-icon-odometer"></i>
                            <span slot="title">{{sub.meta.title}}</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <el-menu-item index="s.name" v-for="s in singleRoutes" :key="s.name" @click="selectMenu(s.name,'')" >
                    <i class="el-icon-odometer"></i>
                    <span slot="title">{{s.meta.title}}</span>
                </el-menu-item>
            </el-menu>

        </el-aside>
        <el-main>
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
            <!--main  box start-->
            <router-view></router-view>
            <!--main  box end-->
        </el-main>
    </el-container>
</template>
<script>
    import route from "@/route.js";
    import getPageTitle from "@/tools/get-page-title";

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
                title: getPageTitle(),
            }
        },
        methods: {
            selectMenu(routeName, param) {
                if (this.$route.name!==routeName) {
                    this.$router.push({'name': routeName, 'param': param});
                }
            },
            async logout() {
                await this.$store.dispatch('cpuser/logout')
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
    html,body,.el-container{
        margin: 0;
        height: 100vh;
        width: 100vw;
    }
    .el-aside{
        width: 100vw;
        border-right: solid 1px #e6e6e6;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: rgb(230, 230, 230);
    }
    .el-main{
        height: 100%;
        margin: 0;
        padding-left:20px;
        background-color: #FFF;
    }
    .left-logo{
        width:200px;
        height:50px;
        text-align:center;
        line-height: 50px;
        font-size:25px;
        color: #0a0c2196;
    }
    @media screen and (min-width:100px) {
        .el-dialog{
            width:98%;
        }
    }
    @media screen and (min-width:500px) {
        .el-dialog{
            width:98%;
        }
    }
    @media screen and (min-width: 800px) {
        .el-dialog{
            width:90%;
        }
    }
    @media screen and (min-width:1200px) {
        .el-dialog{
            width:80%;
        }
    }
    @media screen and (min-width:1210px) {
        .el-dialog{
            width:60%;
        }
    }

</style>

