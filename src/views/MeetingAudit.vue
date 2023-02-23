<template>
    <div class="index-page">
        <PageHeader :title="title">
            <el-radio-group @change="handleChange" v-model="type">
                <el-radio :label="0">会议审核</el-radio>
                <el-radio :label="1">会议补录</el-radio>
            </el-radio-group>
        </PageHeader>
        <div class="meeting-list" v-loading="loading">
            <template v-if="type === 0">
                <MeetingItem v-for="item in meetingList" :itemType="1" :key="item.id" :item="item" @click.native="linkToDetail(item.id)">
                </MeetingItem>
            </template>
            <template v-else>
                <div class="none-tip">暂时没有会议</div>
            </template>
        </div>
        <div class="pagination-box">
            <el-pagination layout="prev, pager, next"
                           @current-change="handleCurrentChange"
                           :total="total"
                           hide-on-single-page
                           :page-size="pageSize"
                           :current-page.sync="page"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import PageHeader from "../components/PageHeader";
    import MeetingItem from "../components/MeetingItem";
    export default {
        name: "MeetingAudit",
        components: {PageHeader, MeetingItem},
        data: function () {
            return {
                type: 0,
                token: '',
                role: 1,
                meetingList: [],
                page: 1,
                pageSize: 6,
                total: 0,
                loading: false
            }
        },
        computed: {
            title: function () {
                return this.type === 0 ? '会议审核' : '补录审核'
            }
        },
        methods: {
            handleChange(){
                console.log(this.type)
            },
            handleCurrentChange(val){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                this.page = val
                this.getAuditList()
            },
            async getAuditList(){
                // 'admin/getPendingMeetingList'
                let {page, pageSize, token} = this
                let [err, res] = await this.$http.post('/super/getPendingMeetingList', {
                    data: {
                        page: page,
                        per_page: pageSize
                    }
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                if(err){
                    console.log(err)
                    this.$message.error('服务器出错')
                    return
                }

                let {code, msg, data} = res.data
                if(code !== 0){
                    this.$message.warning(msg)
                    return
                }
                let {total, per_page, current_page, last_page , data: meetingList} = data
                if(meetingList.length === 0){
                    this.$message.warning('暂时没有需要审核的会议')
                }
                this.meetingList = meetingList
                this.total = total
                this.loading = false
            },
            async linkToDetail(id){
                let {type} = this
                let url = type === 0? '/audit/detail': 'url2'
                this.$router.push({
                    path: url,
                    query: {
                        id: id,
                        pageType: 1
                    }
                })
            }
        },
        mounted(){
            this.token = sessionStorage.getItem('userId')
            this.getAuditList()
        },
        created(){
            this.$bus.$on('auditStateChange',  (id, state) => {
                this.meetingList.forEach((item) => {
                    if(item.id === id){
                        item.state = state
                    }
                })
            })
        }
    }
</script>

<style scoped>
    .meeting-list{
        display: flex;
        padding: 20px 100px;
        justify-content: space-between;
        flex-wrap: wrap;
        min-height: 50vh;
    }

    .meeting-list>*{
        margin:  50px 25px;
    }

    .pagination-box{
        text-align: center;
        margin: 20px 0;
    }

    .none-tip{
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        width: 100%
    }
</style>