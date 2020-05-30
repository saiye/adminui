<template>
    <el-container>
        <el-header>
            {{ message }}
        </el-header>

        <el-main>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{ name:'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>４０４页面</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card class="box-card">
                <div class="text item">
                    <img alt="Vue logo" src="@/assets/404.png">
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>
<script>

    export default {
        data() {
            return {
                message: '404页面你懂的！',
                fit: 'contain',
            }
        }
    }
</script>
