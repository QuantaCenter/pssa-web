<template>
    <div>
        <PageHeader title="出勤查看">
            <el-input placeholder="查找单位" v-model="name" class="selected">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-select v-model="dept" placeholder="请选择单位">

            </el-select>
        </PageHeader>
        <div class="attend-main">
            <div class="tool-box">
                <el-select v-model="term" placeholder="请选择学期" size="mini">
                </el-select>
                <el-button type="primary" class="export-btn" size="mini">导出</el-button>
            </div>
            <div class="amount-box">
                <span>总人数：{{158}}</span>
                <span>总学时数: {{158}}</span>
                <span>总出席次数: {{158}}</span>
                <span>总缺席次数: {{158}}</span>
                <span>总请假次数: {{158}}</span>
            </div>
            <el-table class="attend-table" border stripe>
                <el-table-column
                        prop="date"
                        label="姓名"
                        align="center"
                >
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="工号"
                        align="center"
                >
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="单位" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="学时数" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="出席次数" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="缺席次数" align="center">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="请假次数" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import PageHeader from "../components/PageHeader";
    export default {
        name: "Attend",
        components: {PageHeader},
        data: function () {
            return {
                dept: '',
                term: ''
            }
        }
    }
</script>

<style scoped>
    .attend-main{
        background: #fff;
        margin: 2rem;
        padding: 2rem;
    }

    .selected{
        width: 500px
    }

    .tool-box, .amount-box{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .amount-box{
        margin: 1.5rem 0;
    }

    .attend-table{
        width: 1000px;
        margin: 1rem auto;
    }

</style>