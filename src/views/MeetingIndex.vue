<template>
    <div class="index-page">
        <PageHeader title="会议查看">
            <!--<el-input placeholder="输入查找" v-model="name" class="selected">-->
                <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
            <!--</el-input>-->
            <el-checkbox v-show="role != 1" v-model="getAudit" @change="getAuditList">查看申请会议</el-checkbox>
            <!--<el-select v-model="select" placeholder="请选择单位">-->
                <!--<el-option v-for="(item) in selectDept" :key="item"-->
                           <!--:label="item" :value="item"></el-option>-->
            <!--</el-select>-->
        </PageHeader>
        <div class="meeting-list" v-loading="loading">
            <template v-if="config.data.length !== 0">
                <MeetingItem v-for="item in config.data" :key="item.id" :itemType="config.itemType" :item="item"
                             @click.native="linkToDetail(item.id, config.pageType)">
                </MeetingItem>
            </template>
            <template v-else>
                <div class="none-tip">暂时没有会议</div>
            </template>

        </div>
        <div class="pagination-box">
            <el-pagination layout="prev, pager, next"
                           @current-change="handleCurrentChange"
                           hide-on-single-page
                           :total="config.total"
                           :page-size="pageSize"
                           :current-page.sync="config.page"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import MeetingItem from "../components/MeetingItem";
    import PageHeader from "../components/PageHeader"
    export default {
        name: "MeetingIndex",
        components: {MeetingItem, PageHeader},
        data: function () {
            return {
                page: 1,
                auditPage: 1,
                pageSize: 6,
                total: 0,
                auditTotal: 0,
                token: '',
                meetingList: [],
                loading: false,
                select: '',
                name: '',
                getAudit: false,
                auditMeeting: [],
                role: 1
            }
        },
        methods: {
            async getList(){
                let {page, pageSize, token} = this
                this.loading = true
                let [err, res] = await this.$http.post('/admin/getMeetingList', {
                        data: {
                            page: page,
                            per_page: pageSize
                        }
                    }, {
                        headers: {'Authorization': `Bearer ${token}`}
                    }
                )
                this.loading = false
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
                this.meetingList = meetingList
                this.total = total
                this.loading = false
            },
            handleCurrentChange(val){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                if(this.getAudit){
                    this.auditPage = val
                    this.getAuditList()
                }else {
                    this.page = val
                    this.getList()
                }
            },
            linkToDetail(id, pageType){
                console.log(id)
                this.$router.push({
                    path: '/index/detail',
                    query: {
                        id: id,
                        pageType: pageType
                    }
                })
            },
            async getAuditList(){
                let {getAudit, token, auditPage, pageSize} = this
                if(!getAudit){
                    return
                }
                let [err, res] = await this.$http.post('/admin/getPendingMeetingList', {
                    data: {
                        page: auditPage,
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
                this.auditMeeting = meetingList
                this.auditTotal = total
                this.loading = false
            }
        },
        computed: {
            config: function () {
                return this.getAudit? {
                    data: this.auditMeeting,
                    page: this.auditPage,
                    total: this.auditTotal,
                    pageType: 1,
                    itemType: 1
                } : {
                    data: this.meetingList,
                    page: this.page,
                    total: this.total,
                    pageType: 0,
                    itemType: 0
                }
            }
        },
        mounted(){
            this.token = sessionStorage.getItem('userId')
            this.role = sessionStorage.getItem('role')
            this.getList()
        },
        created(){
            this.$bus.$on('stateChange',  (id, state) => {
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

    .selected{
        width: 500px;
    }

    .meeting-list{
        display: flex;
        padding: 20px 100px;
        justify-content: space-between;
        flex-wrap: wrap;
        min-height: 50vh;
    }

    .none-tip{
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        width: 100%
    }

    .meeting-list>*{
        margin:  50px 25px;
    }

    .pagination-box{
        text-align: center;
        margin: 20px 0;
    }
</style>