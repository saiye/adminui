<template>

</template>
<script>
    export default {
        'name': 'add_business',
        data() {
            return {
                dialogImageUrl: '',
                dialogImgVisible:false,
                visibleDialog:this.visible,
                dialog_form: {
                    business_name: '',
                    state: '',
                    relation_name: '',
                    relation_phone: '',
                    percent: 100,
                    user_name: '',
                    password: '',
                    sex: 1,
                },
            };
        },
        methods: {
            businessDialogCance() {
                this.$emit('cance')
                //this.dialogVisible=false;
            },
            businessDialogConfirm() {
                this.$emit('confirm')
                //this.dialogVisible=false;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogImgVisible = true;
            },
        }
    };
</script>