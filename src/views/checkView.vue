<template>
  <div class="view-page">
    <PageHeader title="单位查看">
      <el-input placeholder="查找单位" v-model="name" class="selected">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-select v-model="term" @change="changeTerm" placeholder="请选择学期">
        <el-option
          v-for="item in termOption"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </PageHeader>
    <div class="view-main">
      <div class="tool-box">
        <el-radio-group v-model="type" @change="changeType">
          <el-radio label="send">按派出单位查看</el-radio>
          <el-radio label="hold">按主办单位查看</el-radio>
        </el-radio-group>
        <!-- <el-button type="primary" class="export-btn" size="mini"
          >导出</el-button
        > -->
      </div>
      <div class="data-box">
        <div>
          <span>总人数:</span><span>{{ total.total_people||0}}</span>
        </div>
        <div>
          <span>总学时数:</span><span>{{ total.total_score||0}}</span>
        </div>
        <div>
          <span>总出席次数:</span><span>{{ total.total_presence||0}}</span>
        </div>
        <div>
          <span>总请假次数:</span><span>{{ total.total_ask_leave||0 }}</span>
        </div>
      </div>
      <el-table :data="units_data" border stripe :loading="loading">
        <el-table-column label="单位" align="center">
          <template slot-scope="scope">
            <router-link 
            :to="{path: '/view/detail', query: {unit:scope.row.unit, type: type}}" 
            class="link">{{scope.row.unit}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_meeting_count"
          label="发布活动总数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_country_count"
          label="国家级活动数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_province_count"
          label="省级活动数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="total_school_count"
          label="校级活动数"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="total_score_count" label="总学时" align="center">
        </el-table-column>
        <el-table-column
          prop="total_presence_count"
          label="出席总人数"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import PageHeader from "../components/PageHeader";
import { termOption } from "../common/appdata";
export default {
  name: "checkView",
  components: { PageHeader },
  data: function () {
    return {
      type: "send",
      token: "",
      term: termOption[0],
      termOption: termOption,
      total: {
        total_people: 0,
        total_score: 0,
        total_presence: 0,
        total_ask_leave: 0,
      },
      units_data: [],
      name: "",
      changing: false,
      loading: false,
    };
  },
  computed: {
    termValue() {
      return this.term.replace(/-/g, "");
    },
  },
  methods: {
    async getData() {
      let { token, termValue, type } = this;
      let url = {
        send: "/super/getMeetingBySendUnit",
        hold: "/super/getMeetingByHoldUnit",
      };
      this.loading = true;
      let [err, res] = await this.$http.post(
        url[type],
        {
          data: {
            term: termValue,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      this.loading = false;
      if (err) {
        this.$message.error("服务器出错");
        return;
      }
      let { code, msg, data } = res.data;
      if (code != 0) {
        this.$message.warning(msg);
        return;
      }

      this.total = data.total;
      //   console.log(data.total)
      let units_data = type == "hold" ? data.hold_units : data.send_units;
      this.units_data = [...units_data];
      // console.log(res)
    },

    changeType() {
      this.getData();
    },
    changeTerm(){
       this.getData();
    }
  },
  mounted() {
    this.token = sessionStorage.getItem("userId");
    this.getData();
  },
};
</script>

<style scoped>
.view-main {
  background: #fff;
  margin: 2rem;
  padding: 2rem;
}

.selected {
  width: 500px;
}

.tool-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.data-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 50px;
}

.link{
  color: #000;
}
</style>