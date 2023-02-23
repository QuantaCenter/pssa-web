<template>
    <div>
        <PageHeader title="出勤名单">
            <div class="btn-group">
                <export-data
                        :name="name"
                        :type="'0'"
                        :data-list="excelList"
                        :head-option="headOption"
                        :titles="titles"
                >
                </export-data>
                <el-button type="primary" size="mini" @click.native="editing = true">编辑</el-button>
                <el-button type="primary" size="mini" @click.native="handleBack">返回</el-button>
            </div>
        </PageHeader>
        <div class="check-main" v-loading="loading">
            <div class="check-header">
                <span>会议名称:</span>
                <span class="meeting-name">{{name}}</span>
            </div>
            <el-table
                    ref="multipleTable"
                    :data="memberList"
                    border
                    stripe
                    class="check-table">
                <!--@selection-change="handleSelectionChange">-->
                <el-table-column
                        prop="name"
                        align="center"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="major"
                        label="学院">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="状态">
                    <template slot-scope="scope">
                        <template v-if="!editing">
                            <span :class="stateOption[scope.row.status].color">{{stateOption[scope.row.status].text}}</span>
                        </template>
                        <template v-else>
                            <el-select v-model="scope.row.status" @change="handleChange(scope.row.status, scope.row.member)"
                                       placeholder="修改出席状态">
                                <el-option v-for="(item) in state" :key="item.value"
                                           :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page="currentPage"
                    :page-size="10"
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    hide-on-single-page
                    :total="total"
            >
            </el-pagination>
            <div class="btn-box" v-if="editing">
                <el-button type="primary" @click.native="handleSubmit">
                    完成
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import PageHeader from "../components/PageHeader";
    import ExportData from "../components/exportData";
    export default {
        name: "MeetingAttend",
        components: {ExportData, PageHeader},
        data: function () {
            return {
                loading: false,
                name: name,
                id: '',
                token: '',
                tableData: [],
                editing: false,
                currentPage: 1,
                state: [
                    {
                        label: '出席',
                        value: 2,
                    },
                    {
                        label: '早退',
                        value: 3,
                    },
                    {
                        label: '迟到',
                        value: 4,
                    },
                    {
                        label: '缺席',
                        value: 8,
                    },
                    {
                        label: '请假',
                        value: 9,
                    }
                ],
                stateOption: {
                    '0': {text:'已报名', color: 'green-state'},
                    '-1': {text:'未签到', color: 'value'},
                    '1': {text:'已签到', color: 'green-state'},
                    '2': {text:'出席', color: 'green-state'},
                    '3': {text:'早退', color: 'yellow-state'},
                    '4': {text:'迟到', color: 'red-state'},
                    '7': {text:'未报名', color: 'value'},
                    '8': {text:'缺席', color: 'red-state'},
                    '9': {text:'请假', color: 'green-state'},
                },
                changeList: [],
                total: 0,
                headOption: [
                    'username',
                    'major',
                    'status'
                ],
                titles: [
                    '姓名',
                    '学院',
                    '出勤状态'
                ]
            }
        },
        computed: {
            memberList: function () {
                let {currentPage,tableData} = this
                return tableData.slice((currentPage-1)*10,currentPage*10)
            },
            excelList: function () {
                let {tableData, stateOption} = this
                return tableData.map((item) => {
                    return {
                        username: item.name,
                        major: item.major,
                        status: stateOption[item.status].text
                    }
                })
            }
        },
        methods: {
            handleBack(){
                this.$router.back()
            },
            async getAttendList(){
                let {token, id} = this
                this.loading = true
                let [err, res] = await this.$http.post('/admin/getMeetingAttendance',{
                    data: {
                        meeting:id
                    }
                }, {headers: {'Authorization': `Bearer ${token}`}})
                this.loading = false
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code, msg, data} = res.data
                //console.log(data)
                if(code !== 0){
                    this.$message.warning('请求出错')
                    return
                }

                if(data.length === 0){
                    this.$message.warning('暂时没有出勤信息')
                }
                //console.log(data)
                this.tableData = data
                this.total = data.length
            },
            handleChange(status, id){
                let {changeList} = this
                let index = changeList.findIndex((item) => item.member === id)
                if(index !== -1){
                    changeList[index].status = status
                }else{
                    changeList.push({
                        status: status,
                        member: id
                    })
                }
            },
            async handleSubmit(){
                let {changeList, token, id} = this
                if(changeList.length === 0){
                    this.$message.warning('您还没有进行修改')
                    return
                }
                let [err, res] = await this.$http.post('/super/editMeetingAttendance', {
                    data: {
                        meeting:id,
                        attendance: changeList
                    }
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code, msg} = res.data
                if(code !== 0){
                    this.$message.warning(msg)
                    return
                }
                this.$message.success('修改成功')
                this.editing = false
                this.changeList = []
            },
            handleCurrentChange(val){
                this.currentPage = val
            },
        },
        activated(){
            let {id, name} = this.$route.query
            this.token = sessionStorage.getItem('userId')
            this.id = id
            this.name = name
            this.getAttendList()
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

    .value{
        color:#9e9e9e;
    }
    .green-state{
        color: #37b540;
    }
    .red-state{
        color: #c23d3d;
    }
    .yellow-state{
        color: #e3b850;
    }

    .btn-box{
        text-align: center;
        margin: 15px 0;
    }
</style>