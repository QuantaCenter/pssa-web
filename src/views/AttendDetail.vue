<template>
    <div>
        <PageHeader title="出勤查看">
            <div class="btn-group">
                <el-button type="primary" size="mini">返回</el-button>
                <el-button type="danger" size="mini">重置密码</el-button>
                <el-button type="primary" size="mini">编辑</el-button>
            </div>
        </PageHeader>
        <div class="detail-main">
            <div class="user-info">
                <i class="el-icon-user-solid"></i>
                <div>
                    <p class="username">{{username}}</p>
                    <p class="score">总学时: {{score}}</p>
                </div>
            </div>
            <el-table class="detail-table" border stripe>
                <el-table-column
                        prop="date"
                        label="学期"
                        align="center"
                >
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                >
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="工号" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="单位" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="会议名" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="学时数" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="出勤情况" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import PageHeader from "../components/PageHeader";
    export default {
        name: "AttendDetail",
        components: {PageHeader},
        data: function () {
            return {
                username: 'hjh',
                score: 0
            }
        }
    }
</script>

<style scoped>
    .detail-main{
        background: #fff;
        margin: 2rem;
        padding: 2rem;
    }

    .user-info{
        display: flex;
        align-items: center;
    }

    .user-info>i{
        width: 40px;
        height: 40px;
        font-size: 40px;
        display: inline-block;
        margin-right: 20px;
    }

    .user-info>div{
        text-align: center;
    }

    .user-info>div>.username{
        font-size: 18px;
    }

    .user-info>div>.score{
        color: #666;
    }

    .detail-table{
        width: 1000px;
        margin: 1rem auto;
    }
</style>