<template>
    <div class="index-page">
        <PageHeader title="请假审核">
        </PageHeader>
        <div class="check-main" v-loading="loading">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    border
                    stripe
                    class="check-table">
                <!--@selection-change="handleSelectionChange">-->
                <el-table-column
                        prop="name"
                        align="center"
                        label="会议名称">
                </el-table-column>
                <el-table-column
                        prop="username"
                        align="center"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="major"
                        label="单位">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="reason"
                        label="理由">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <template v-if="scope.row.is_allowed == 0">
                            <el-button @click="handleReject(scope.row.id)" type="danger" size="mini">不同意</el-button>
                            <el-button type="primary" @click="handleGrant(scope.row.id)" size="mini">同意</el-button>
                        </template>
                        <template v-else>
                            <span :class="scope.row.is_allowed==1?'pass-text': 'unpass-text'">
                                {{scope.row.is_allowed==1? '已同意' : '已驳回'}}</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog  title="理由" :visible.sync="visible" width="400" close-on-click-modal>
            <el-input v-model="reason" placeholder="请填写不通过理由" autocomplete="off"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleReject">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import MeetingItem from '../components/MeetingItem'
    import PageHeader from '../components/PageHeader'
    export default {
        name: "MeetingCheck",
        components: {MeetingItem, PageHeader},
        data: function () {
            return {
                tableData: [],
                token: '',
                loading: [],
                visible: false,
                rejectId: '',
                reason: ''
            }
        },
        methods: {
            async getCheckList(){
                let {token} = this
                this.loading = true
                let [err, res] = await this.$http.post('/super/getAskLeaveList', {}, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                this.loading = false
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code, msg, data} = res.data
                if(code !== 0){
                    this.$message.warning('请求出错')
                    return
                }
                if(data.length === 0){
                    this.$message.warning('暂时没有请假审核')
                }
                this.tableData = data
            },
            handleReject(id){
                this.visible = true
                console.log(id)
                this.rejectId = id
            },
            async handleGrant(id){
                let {token} = this
                let [err, res] = await this.$http.post('/super/grantAskLeave', {
                    data: {
                        leave: id
                    }
                }, {headers: {'Authorization': `Bearer ${token}`}})
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code} = res.data
                if(code !== 0){
                    this.$message.warning('请求出错')
                    return
                }
                this.$message.success('操作成功')
                this.getCheckList()
            },
            cancleReject(){
                this.visible = false
                this.rejectId = ''
            },
            async confirm(){
                let {token, rejectId, reason} = this
                let [err, res] = await this.$http.post('/super/rejectAskLeave', {
                    data: {
                        leave: rejectId,
                        reason: reason
                    }
                }, {headers: {'Authorization': `Bearer ${token}`}})
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code} = res.data
                if(code !== 0){
                    this.$message.warning('请求出错')
                    return
                }
                this.$message.success('操作成功')
                this.visible = false
                this.rejectId = ''
                this.getCheckList()
            }
        },
        mounted(){

            this.token = sessionStorage.getItem('userId')
            this.getCheckList()
        }
    }
</script>

<style scoped>
    .check-main{
        background-color: #fff;
        padding: 2rem;
        margin: 2rem;
    }

    .check-header{
        margin: 1rem 0;
    }

    .check-table{
        width: 800px;
        margin: 1rem auto;
    }

    .pass-text{
        color: cornflowerblue;
    }
    .unpass-text{
        color: red;
    }

</style>