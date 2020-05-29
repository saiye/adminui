<template>
    <el-container>
        <el-header>{{ message }}</el-header>
        <el-main>
            <el-card class="box-card">
                <div class="text item">
                  <!--  <img alt="Vue logo" src="./assets/logo.png">-->

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
