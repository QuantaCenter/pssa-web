<template>
    <div class="publish-page">
        <el-form class="form" ref="form" :rules="rules" :model="form" :label-position="'left'" label-width="150px">
            <el-form-item label="会议性质" prop="type">
                <el-radio-group v-model="form.type">
                    <el-radio :label="1" :checked="form.type==1">必修</el-radio>
                    <el-radio :label="2" :checked="form.type==2">选修</el-radio>
                </el-radio-group>
            </el-form-item>
            <h3>基本信息</h3>
            <el-form-item label="会议名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写会议名称"></el-input>
            </el-form-item>
            <el-form-item label="主办单位" prop="dept">
                <el-select v-model="form.dept" placeholder="请选择主办单位" >
                    <el-option v-for="(item) in deptList" :key="item"
                               :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="hold_unit" v-show="form.dept === '其他'">
                <el-input type="text" v-model="form.hold_unit"
                          placeholder="请输入主办单位" class="hid-input"></el-input>
            </el-form-item>
            <el-form-item label="派出单位" prop="send_dept" v-show="form.dept == '其他'">
                <el-select v-model="form.send_dept" placeholder="请选择派出单位">
                    <el-option v-for="(item) in deptList" :key="item"
                               :label="item" :value="item"></el-option>
                </el-select>

            </el-form-item>
            <el-form-item prop="send_unit" v-show="form.send_dept == '其他'">
                <el-input type="text" v-model="form.send_unit" class="hid-input"
                          placeholder="请选择派出单位"></el-input>
            </el-form-item>
            <el-form-item label="级别" prop="level">
                <el-select v-model="form.level" placeholder="请选择级别">
                    <el-option v-for="(item) in meetingLevel" :key="item.value"
                               :label="item.label" :value="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类别" prop="category">
                <el-select v-model="form.category" placeholder="请选择类别">
                    <el-option v-for="(item) in category" :key="item"
                               :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="培训学时" prop="score">
                <el-input-number v-model="form.score"></el-input-number>
            </el-form-item>
            <h3>时间地点</h3>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="选择开始时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="12:00:00">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="选择结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="12:00:00">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-if="form.type == 2" prop="deadline" label="报名截至时间">
                <el-date-picker
                        v-model="form.deadline"
                        type="datetime"
                        placeholder="选择报名截至时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="12:00:00">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="会议地点" prop="place">
                <el-input v-model="form.place" placeholder="请填写会议地点"></el-input>
            </el-form-item>
            <h3>其它</h3>
            <el-form-item prop="info" label="会议简介">
                <el-input type="textarea" :rows="2"
                          placeholder="请输入会议简介" v-model="form.info"></el-input>
            </el-form-item>
            <!--<div class="table-container">-->
                <!--<el-form-item label="人员选择">-->
                    <!---->
                <!--</el-form-item>-->
                <!---->
            <!--</div>-->
            <el-form-item>
                <el-button type="primary" @click.prevent="selectMember" v-if="pageType!='edit'">人员选择</el-button>
                <el-button v-if="pageType!='edit'" type="primary" @click.native="handleSubmit" :loading="loading" :disabled="loading">
                    {{role===1? '会议发布' : '会议申请'}}
                </el-button>
                <el-button v-else type="primary" @click.native="handleEdit"
                           :loading="loading" :disabled="loading">
                    编辑
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="visible" width="500">
            <div class="select-header" v-if="form.type !== 2">
                <el-input placeholder="输入查找" v-model="name" class="selected" @blur="handleBlur">
                    <!--<el-button slot="append" icon="el-icon-search"></el-button>-->
                </el-input>
                <el-select v-model="select" placeholder="请选择单位">
                    <el-option v-for="(item) in selectDept" :key="item"
                               :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <div class="table-container">
                <template v-if="form.type === 2">
                    <el-table
                            ref="multipleTable"
                            :data="selectMemberList"
                            tooltip-effect="dark"
                            class="table"
                            max-height="300"
                            border
                            @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                                type="selection"
                                align="center"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                label="学院"
                                align="center"
                                prop="dept"
                        >
                        </el-table-column>
                    </el-table>
                </template>
                <template v-else>
                    <el-checkbox v-model="checkAllMember" @change="selectAllMember">全选</el-checkbox>
                        <el-card v-for="item in filterPeopleList" :key="item.major" class="box-card">
                            <div slot="header">
                                <el-checkbox @change="() => handleMajorSelect(item.major)" v-model="item.checked"></el-checkbox>
                                <span class="select-label">{{item.major}}</span>
                            </div>
                            <div v-for="people in item.people" :key="people.id">
                                <template v-if="people.show">
                                    <el-checkbox v-model="people.checked"></el-checkbox>
                                    <span class="select-label">{{people.username}}</span>
                                </template>
                            </div>
                        </el-card>


                </template>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {meetingLevel, deptList, category, selectMemberList, peopleMajor} from '../common/appdata'
    import SelectFloat from '../components/SelectFloat.vue'

    export default {
        name: "publish",
        components: {
        },
        data() {
            return {
                token: '',
                role: 1,
                form: {
                    type: 0, //会议性质
                    name: '',
                    level: '',
                    dept: '',
                    hold_unit: '',
                    send_dept: '',
                    send_unit: '',
                    category: '',
                    score: 0,
                    place: '',
                    startTime: '',
                    endTime: '',
                    info: '',
                    isSearch: false,
                    deadline: ''
                },
                show: false,
                meetingLevel,
                meeting: [],
                selectDept: [],
                select: '全部',
                name: '',
                isSearch: false,
                peopleList: [],
                multipleSelection: [],
                deptList,
                category,
                selectMemberList,
                loading: false,
                selectType: 0,
                visible: false,
                rules: {
                    type:  [
                        {required: true, message: '请选择会议类型', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'}
                    ],
                    level: [
                        {required: true, message: '请选择活动级别', trigger: 'change'}
                    ],
                    category: [
                        {required: true, message: '请选择活动类型', trigger: 'change'}
                    ],
                    score: [
                        {required: true, message: '请输入活动学时', trigger: 'change'}
                    ],
                    startTime: [
                        {required: true, message: '请输入开始时间', trigger: 'change'}
                    ],
                    endTime: [
                        {required: true, message: '请输入结束时间', trigger: 'change'}
                    ],
                    info: [
                        {required: true, message: '请输入活动简介', trigger: 'blur'}
                    ],
                    place: [
                        {required: true, message: '请输入活动地点', trigger: 'blur'}
                    ]
                },
                checkAllMember: false,
                pageType: '',
                id: '',
                peopleMajor
            }
        },
        computed: {
            filterPeopleList: function () {
                let {select, peopleList} = this
                console.log(peopleList)
                if(select === '全部'){
                    return peopleList
                }

                return peopleList.filter((item) => {
                    return  select==='全部'||item.major === select
                })
                // if(name !== ''){
                //     filterList.forEach((item) => {
                //         item.people = item.people.filter(({username}) => username.indexOf(name) !== -1)
                //     })
                // }


            }
        },
        methods: {
            handleBlur(){
                let { name, peopleList} = this
                let isSearch = name !== ''
                this.isSearch = isSearch
                let reg = new RegExp(name)
                peopleList.forEach((item) => {
                    item.people.forEach((people) => {
                        if(!isSearch){
                            people.show = true
                        }else{
                            people.show = reg.test(people.username);
                        }
                    })
                })
                this.peopleList = peopleList
            },
            selectMember() {
                this.visible = true
            },
            async submit(){
                let {role, token, form, multipleSelection, peopleList} = this
                let meetingList = []

                if(form.type===1){
                    peopleList.forEach((item) => {
                        let people = item.people
                        meetingList.push(...people.filter((item)=>item.checked).map((item) => item.id))
                    })
                }else {
                    meetingList = multipleSelection.map((item) => {
                        return item.value
                    })
                }
                console.log(meetingList)
                if((meetingList.length === 0)){
                    this.$message.warning('还没有选择人员')
                    return
                }
                let url = role == 1? `/super/${form.type===1? 'publishCompulsoryMeeting' : 'publishSelectiveMeeting'}`
                    : `/admin/${form.type===1? 'applyCompulsoryMeeting' : 'applySelectiveMeeting'}`
                this.loading = true
                //console.log(multipleSelection)

                /**
                 * 如果是选修（selective）就传原来那个major数组， 如果是compulsory就传people数组，里面是id数组
                 * */
                let [err, res] = await this.$http.post(url, {
                    data: {
                        meeting: {
                            type: form.type,
                            name: form.name,
                            starttime: form.startTime,
                            endtime: form.endTime,
                            position: form.place,
                            term: '202020212',
                            level: form.level,
                            hold_unit: form.hold_unit!== ''? form.hold_unit: form.dept,
                            send_unit: form.send_unit!== ''? form.send_unit: (form.send_dept!==''? form.send_dept : form.dept),
                            introduction: form.info,
                            category: form.category,
                            score: parseInt(form.score),
                            deadline: form.type===1? form.startTime : form.deadline
                        },
                        [form.type===1?'people':'major']: meetingList
                    }
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                this.loading = false
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code, msg} = res.data
                if(code !== 0){
                    this.$message.warning(msg)
                    return
                }
                this.$message.success('操作成功')
                this.$router.push('/index')
            },
            handleSubmit(){
                this.$refs['form'].validate((valid) => {
                    if(valid){
                        this.submit()
                    }else{
                        this.$message.warning('还有信息未填写')
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            async getPeopleList(){
                let {token, peopleMajor} = this
                let [err, res] = await this.$http.post('/admin/getPeopleList', {}, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code, msg, data} =res.data
                if(code !== 0){
                    this.$message.warning(msg)
                    return
                }
                let peopleList = []
                let selectDept = ['全部',...peopleMajor]

                peopleMajor.forEach((major) => {
                    let list = data.filter((item) => item.major===major)
                    list.forEach((item, index) => {
                        if(item.role === 2){
                            list.unshift(...list.splice(index, 1))
                        }
                    })

                    peopleList.push({
                        checked: false,
                        major: major,
                        people: list.map((item) => {
                            return {
                                ...item,
                                show: true,
                                checked: false
                            }
                        })
                    })
                })

                // data.forEach((item) => {
                //     let {major} = item
                //     item.checked = false
                //     item.show = true
                //     let preMajor = '', length = peopleList.length
                //     if(length !== 0){
                //         preMajor=peopleList[length-1].major
                //     }
                //
                //     if(preMajor === major){
                //         peopleList[length-1].people.push(item)
                //     }else{
                //         selectDept.push(major)
                //         peopleList.push({
                //             checked: false,
                //             major: major,
                //             people: [item],
                //         })
                //     }
                // })
                // console.log(selectDept)
                this.peopleList = peopleList
                this.selectDept = selectDept
            },
            handleMajorSelect(selectMajor){
                let {peopleList} = this
                peopleList.forEach((item) => {
                    let {major, checked} = item
                    if(selectMajor === major){
                        item.people.forEach((people) => {
                            people.checked = checked
                        })
                    }
                })
            },
            selectAllMember(){
                let {checkAllMember, peopleList} = this
                peopleList.forEach((item) => {
                    item.checked =checkAllMember
                    item.people.forEach((people) => {
                        people.checked = checkAllMember
                    })

                })
            },
            async handleEdit(){
                let {id, token, form} = this
                this.loading = true
                let [err, res] = await this.$http.post('/super/editMeeting', {
                    data: {
                        meeting: {
                            id: id,
                            type: form.type,
                            name: form.name,
                            starttime: form.startTime,
                            endtime: form.endTime,
                            position: form.place,
                            term: '202020212',
                            level: form.level,
                            hold_unit: form.hold_unit!== ''? form.hold_unit: form.dept,
                            send_unit: form.send_unit!== ''? form.send_unit: (form.send_dept!==''? form.send_dept : form.dept),
                            introduction: form.info,
                            category: form.category,
                            score: parseInt(form.score),
                            deadline: form.type===1? form.startTime : form.deadline
                        }
                    }
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                this.loading = false
                if(err){
                    this.$message.error('服务器出错')
                    return
                }
                let {code} =res.data
                if(code !== 0){
                    this.$message.warning('请求出错')
                    return
                }
                this.$message.success('修改成功')
                this.$router.back()
            }
        },
        mounted(){
            let id = this.$route.query.id
            let pageType = this.$route.query.type
            if(pageType==='edit'){
                const deptList = this.deptList
                let params = this.$route.params.params
                this.pageType = pageType||''
                this.id = id||''
                console.log(params)
                Object.keys(this.form).forEach((key) => {
                    if(key === 'info'){
                        this.form[key] = params.introduction
                    }else if(key === 'startTime'){
                        this.form[key] = params.starttime
                    }
                    else if(key === 'endTime'){
                        this.form[key] = params.endtime
                    }else if(key === 'place'){
                        this.form[key] = params.position
                    }else if(key==='type'){
                        console.log(params.type)
                        this.form[key] = parseInt(params.type)
                    }
                    else{
                        this.form[key] = params[key]
                    }
                })
                if(deptList.findIndex((item) => item==params.send_unit) === -1){
                    this.form.send_unit = params.send_unit
                    this.$nextTick(() => {
                      this.form.send_dept = '其他'
                    })
                }
                if(deptList.findIndex((item) => item==params.hold_unit) === -1){
                    this.form.hold_unit = params.hold_unit
                    this.$nextTick(() => {
                      this.form.dept = '其他'
                    })
                }
            }
            this.token = sessionStorage.getItem('userId')
            this.role = parseInt(sessionStorage.getItem('role'))
            this.getPeopleList()
        }
    }
</script>

<style scoped>
    .publish-page {
        background: #fff;
        border-radius: 1.5rem;
        padding: 2rem;
        margin: 4rem;
    }

    .form {
        width: 60%;
        text-align: left;
    }

    .form > h3 {
        margin: 20px 0;
    }

    .table{
        margin: 20px auto;
        width: 400px;
    }
    .select-header{
        display: flex;
        justify-content: space-between;
    }
    .selected{
        width: 250px;
    }
    .box-card{
        width: 500px;
        margin: 20px auto;
    }
    .select-label{
        display: inline-block;
        margin-left: 20px;
        width: 150px;
    }
</style>