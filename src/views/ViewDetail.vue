<template>
    <div class="view-page">
        <PageHeader title="单位详情">
            <el-button type="primary" size="mini">返回</el-button>
        </PageHeader>
        <div class="view-main">
            <div class="tool-box">
                <span>总学时: {{score}}</span>
                <el-button type="primary" class="export-btn" size="mini">导出</el-button>
            </div>
            <el-table></el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ViewDetail",
        data: function () {
            return {
                score: 0
            }
        }
    }
</script>

<style scoped>
    .view-main{
        background: #fff;
        margin: 2rem;
        padding: 2rem;
    }

    .tool-box{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tool-box>.export-btn{
        justify-self: flex-end;
    }
</style>