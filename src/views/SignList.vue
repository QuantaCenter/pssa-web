<template>
    <div>
        <PageHeader title="报名名单">
            <div class="btn-group">
                <export-data
                        :name="name"
                        :type="'1'"
                        :data-list="excelList"
                        :head-option="headOption"
                        :titles="titles"
                >
                </export-data>
                <el-button type="primary" size="mini" @click.native="handleGrant">同意参加</el-button>
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
                    :data="tableData"
                    border
                    stripe
                    class="check-table"
                    @selection-change="handleSelectionChange"
            >
                <!--@selection-change="handleSelectionChange">-->
                <el-table-column
                        type="selection"
                        align="center"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="username"
                        align="center"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="major"
                        label="学院">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import PageHeader from "../components/PageHeader";
    import ExportData from "../components/exportData";
    export default {
        name: "SignList",
        components: {ExportData, PageHeader},
        data: function(){
            return{
                token: '',
                name:'',
                id: '',
                tableData: [],
                loading: false,
                visible: false,
                selectList: [],
                headOption: [
                    'username',
                    'number',
                    'major'
                ],
                titles: [
                    '姓名',
                    '工号',
                    '学院'
                ]
            }
        },
        computed: {
          excelList: function () {
              let {tableData} = this
              return tableData.map((item) => {
                  return {
                      username: item.username,
                      major: item.major,
                      number: item.number
                  }
              })
          }
        },
        methods:{
            handleBack(){
                this.$router.back()
            },
            async getSignList(){
                let {token, id} = this
                this.loading = true
                let [err, res] = await this.$http.post('/super/getSignUpList', {
                    data: {
                        meeting: id
                    }
                }, {
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
                    this.$message.warning('暂时没有人报名')
                }
                this.tableData = data
            },
            handleSelectionChange(val) {
                this.selectList = val;
            },
            handleGrant(){
                let {token, selectList, id} = this
                if(selectList.length===0){
                    this.$message.warning('还没选择人员')
                    return
                }
                this.$confirm('是否同意选中人员参加?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let people = selectList.map(({user}) => user)
                    let [err, res] = await this.$http.post('/super/grantSignUp', {
                        data: {
                            people: people,
                            meeting: id
                        }
                    }, {
                        headers: {'Authorization': `Bearer ${token}`}
                    })
                    if(err){
                        this.$message.error('服务器出错')
                        return
                    }
                    let{code} = res.data
                    if(code !== 0){
                        this.$message.warning(code)
                        return
                    }
                    this.$message.success('操作成功')
                })
            },
            exportList(){

            }
        },
        activated(){
            let {id, name} = this.$route.query
            this.token = sessionStorage.getItem('userId')
            this.id = id
            this.name = name
            this.getSignList()
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