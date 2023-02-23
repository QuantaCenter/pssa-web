<template>
  <div>
    <page-header title="单位活动">
      <div class="button-box">
        <el-button type="primary" @click.native="back" size="mini">返回</el-button>
        <!-- <el-button>导出</el-button> -->
      </div>
    </page-header>
    <div class="view-main">
      <div class="data-box">
        <span><span>总学时:</span><span>{{ total }}</span></span>
      </div>
      <el-table :data="data" 
      border
      stripe 
      :loading="loading"
      class="table-box"
      >
        <el-table-column
          label="单位"
          align="center"
        >
            <template slot-scope="scope">
                <span>{{scope.row[type]}}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="会议名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="starttime"
          label="时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="score"
          label="学时"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="category"
          label="类别"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
            <template slot-scope="scope">
                <router-link class="link" :to="{path:'/index/detail',query:{id: scope.row.id,pageType: 0}}" >查看</router-link>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
    
<script>
import PageHeader from "../components/PageHeader.vue";
export default {
  name: "UnitMeeting",
  data() {
    return {
      loading: false,
      token: "",
      unit: "学生处",
      data: [],
      type: 'send_unit'
    };
  },
  components: { PageHeader },
  computed: {
      total(){
          let total = this.data.reduce((pre, cur) => {
              return pre+parseInt(cur.score)
          }, 0)
          return total
      }
  },
  methods: {
    back() {
      this.$router.back();
    },
    async getData() {
        let {unit, token} = this
        this.loading = true
      let [err, res] = await this.$http.post(
        "/super/getMeetingDetailsBySendUnit",
        {
          data: {
              unit: unit
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
       this.loading = false
      if(err){
          this.$message.error('服务器出错')
          return
      }

      let { code, msg, data } = res.data;
      if (code != 0) {
        this.$message.warning(msg);
        return;
      }
      this.data = data
    },
  },
  activated() {
    this.token = sessionStorage.getItem("userId");
    let { unit, type } = this.$route.query;
    this.unit = unit
    this.type = type+"_unit"
    this.getData();
  },
};
</script>
    
<style>
.view-main {
  background: #fff;
  margin: 2rem;
  padding: 5rem;
  overflow: hidden;
}

.data-box{
    font-size: 20px;
    text-align: left;
    margin: 5px 0;
}

.link{
    color: #000;
}

</style>