<template>
  <div class="detail-container">
    <PageHeader title="会议详情">
      <div class="btn-group">
        <el-button
          v-for="item in btnGroup"
          :key="item.text"
          :type="item.type"
          @click.native="item.fn"
          size="mini"
        >
          {{ item.text }}
        </el-button>
      </div>
    </PageHeader>
    <div class="info-container" v-loading="loading">
      <div class="detail-info">
        <div class="info-header">
          <h2>{{ data.name }}</h2>
          <el-tag
            v-for="item in statusList"
            :key="item.label"
            :type="item.type"
            effect="plain"
          >
            {{ item.label }}
          </el-tag>
        </div>
        <div class="info-main">
          <div class="right-side">
            <div class="info-item">
              <div class="label">主办单位：</div>
              <div class="info">{{ data.hold_unit }}</div>
            </div>
            <div class="info-item">
              <div class="label">派出单位：</div>
              <div class="info">{{ data.send_unit }}</div>
            </div>
            <div class="info-item">
              <div class="label">开始时间：</div>
              <div class="info">{{ data.starttime }}</div>
            </div>
            <!--data.type===1-->
            <div class="info-item">
              <div class="label">结束时间：</div>
              <div class="info">{{ data.endtime }}</div>
            </div>
            <div class="info-item" v-if="data.type != 1">
              <div class="label">报名截止时间：</div>
              <div class="info">{{ data.deadline }}</div>
            </div>
            <div class="info-item">
              <div class="label">地点：</div>
              <div class="info">{{ data.position }}</div>
            </div>
            <div class="info-item">
              <div class="label">学时数：</div>
              <div class="info">{{ data.score }}</div>
            </div>
            <div class="info-item">
              <div class="label">级别：</div>
              <div class="info">{{ data.level }}</div>
            </div>
            <div class="info-item">
              <div class="label">类别：</div>
              <div class="info">{{ data.category }}</div>
            </div>
            <div class="info-item">
              <div class="label">会议简介：</div>
              <div class="info">{{ data.introduction }}</div>
            </div>
          </div>
          <div class="left-side">
            <img src="../assets/item.png" class="img" />
          </div>
        </div>
      </div>
      <div class="meeting-member">
        <div class="table-title">
          <h3>已选择{{ data.type === 1 ? "人员" : "单位" }}</h3>
          <div class="btn-group">
            <template v-if="data.type === 1">
              <el-button
                type="primary"
                @click.native="linkToAttend"
                size="mini"
                v-if="data.state != 1 && pageType == 0"
              >
                查看名单</el-button
              >
            </template>
            <template v-else>
              <el-button
                v-if="rank == 1"
                type="primary"
                @click.native="linkToSign"
                size="mini"
              >
                查看报名名单</el-button
              >
              <el-button
                type="primary"
                @click.native="linkToAttend"
                size="mini"
                v-if="data.state != 1 && pageType == 0"
              >
                查看名单</el-button
              >
            </template>
          </div>
        </div>
        <template v-if="data.type === 1">
          <el-table
            :key="'member'"
            :data="memberList"
            border
            stripe
            class="table"
          >
            <!--:span-method="objectSpanMethod"-->
            <el-table-column prop="major" label="学院" align="center">
            </el-table-column>
            <el-table-column prop="username" label="姓名" align="center">
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
        </template>
        <template v-else>
          <el-table
            :key="'major'"
            :data="tableData"
            border
            stripe
            class="table"
          >
            <el-table-column prop="major" label="学院" align="center">
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
    <el-dialog
      :visible.sync="open"
      :show-close="false"
      width="400px"
      @close="closeCode"
      :close-on-click-modal="true"
      :close-on-press-escape="false"
    >
      <div class="code-box">
        <img :src="codeSrc" class="code" />
      </div>
      <div class="close-box">
        <el-button @click="closeCode" class="normal-btn">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="show" title="驳回">
      <el-input v-model="reason" placeholder="请填写驳回原因"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click.native="handleReject">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "../components/PageHeader";
import { MeetingState } from "../common/appdata";
export default {
  name: "MeetingDetail",
  components: { PageHeader },
  data: function () {
    return {
      data: {
        id: 0,
        name: "",
        starttime: "",
        endtime: "",
        position: "",
        term: "",
        state: "",
        level: "",
        hold_unit: "",
        send_unit: "",
        introduction: "",
        category: "",
        type: 0,
        score: 0,
        publish_id: 0,
      },
      pageType: 0,
      loading: false,
      token: "",
      render: true,
      open: false,
      reason: "",
      show: false,
      codeSrc: "",
      timer: null,
      spanArr: [],
      tableData: [],
      rank: 1,
      currentPage: 1,
      total: 0,
    };
  },
  computed: {
    statusList: function () {
      let { type, state } = this.data;
      let { pageType } = this;
      let statusList = [];
      if (parseInt(type) === 1) {
        statusList.push({
          label: "必修",
          type: "danger",
        });
      } else {
        statusList.push({
          label: "选修",
          type: "primary",
        });
      }
      if (pageType === 0) {
        switch (state) {
          case 1:
            statusList.push({
              label: MeetingState[state],
              type: "info",
            });
            break;
          case 2:
            statusList.push({
              label: MeetingState[state],
              type: "success",
            });
            break;
          case 3:
            statusList.push({
              label: MeetingState[state],
              type: "danger",
            });
            break;
        }
      } else {
        switch (state) {
          case 0:
            statusList.push({
              label: "未审核",
              type: "info",
            });
            break;
          case 1:
            statusList.push({
              label: "审核通过",
              type: "success",
            });
            break;
          case 2:
            statusList.push({
              label: "审核不通过",
              type: "danger",
            });
            break;
        }
      }
      return statusList;
    },
    btnGroup: function () {
      let { state } = this.data;
      let { pageType } = this;
      let btnGroup = [
        {
          text: "返回",
          fn: this.handleBack,
          type: "primary",
        },
      ];
      if (pageType === 0) {
        if (state === 1) {
          btnGroup.unshift(
            ...[
              {
                text: "开始会议",
                fn: this.handleStart,
                type: "success",
              },
              {
                text: "删除会议",
                fn: this.handleDelete,
                type: "danger",
              },
              {
                text: "编辑",
                fn: this.handleEdit,
                type: "primary",
              },
              {
                text: "查看请假审核",
                fn: this.linkToList,
                type: "info",
              },
            ]
          );
        } else if (state === 2) {
          btnGroup.unshift(
            ...[
              {
                text: "结束会议",
                fn: this.handleEnd,
                type: "danger",
              },
              {
                text: "签到码",
                fn: this.getCheckInCode,
                type: "success",
              },
              {
                text: "签退码",
                fn: this.getCheckOutCode,
                type: "success",
              },
              {
                text: "查看请假审核",
                fn: this.linkToList,
                type: "info",
              },
            ]
          );
        } else if (state === 3) {
          btnGroup.unshift(
            ...[
              {
                text: "补录名单",
                fn: this.handleAdd,
                type: "primary",
              },
              {
                text: "查看请假审核",
                fn: this.linkToList,
                type: "info",
              },
            ]
          );
        }
      } else {
        if (state === 0) {
          btnGroup.unshift(
            ...[
              {
                text: "通过",
                fn: this.handleGrant,
                type: "success",
              },
              {
                text: "驳回",
                fn: this.showReject,
                type: "danger",
              },
            ]
          );
        }
      }
      return btnGroup;
    },
    memberList: function () {
      let { currentPage, tableData } = this;
      return tableData.slice((currentPage - 1) * 10, currentPage * 10);
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    async getDetail(id) {
      let { token, pageType } = this;
      let url =
        pageType === 0 ? "/admin/getMeeting" : "/admin/getPendingMeeting";
      this.loading = true;
      let [err, res] = await this.$http.post(
        url,
        {
          data: {
            meeting: id,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.loading = false;
      if (err) {
        this.$message.error("服务器出错");
        return;
      }
      let { code, msg } = res.data;
      if (code !== 0) {
        this.$message.warning(msg);
        return;
      }
      let { data } = res.data;
      //people majors
      let tableData = [];
      let spanArr = [];
      if (data.type === 1) {
        let people = data.people || [];
        let preMajor = "";
        let preIndex = 0;
        people.forEach((item, index) => {
          if (index === 0) {
            spanArr.push(1);
            preMajor = item.major;
            return;
          }
          if (item.major !== preMajor) {
            preMajor = item.major;
            preIndex = index;
            spanArr.push(1);
          } else {
            spanArr[preIndex] = spanArr[preIndex] + 1;
            spanArr.push(0);
          }
        });
        //console.log(spanArr)
        tableData = people;
        this.total = tableData.length;
      } else tableData = data.majors || [];

      this.tableData = tableData;
      this.data = { ...data };
    },
    handleBack() {
      this.$router.back();
    },
    handleStart() {
      let {
        data: { id },
        token,
      } = this;
      this.$confirm("是否开始会议?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let [err, res] = await this.$http.post(
          "/admin/startMeeting",
          {
            data: {
              meeting: id,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (err) {
          this.$message.error("服务器出错");
          return;
        }
        let { code, msg } = res.data;
        if (code !== 0) {
          this.$message.warning(msg);
          return;
        }
        this.$message.success("操作成功");
        this.$bus.$emit("stateChange", id, 2);
        this.data.state = 2;
      });
    },
    handleEnd() {
      let {
        data: { id },
        token,
      } = this;
      this.$confirm("是否结束会议?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let [err, res] = await this.$http.post(
          "/admin/endMeeting",
          {
            data: {
              meeting: id,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (err) {
          this.$message.error("服务器出错");
          return;
        }
        let { code, msg } = res.data;
        if (code !== 0) {
          this.$message.warning(msg);
          return;
        }
        this.$message.success("操作成功");
        this.$bus.$emit("stateChange", id, 3);
        this.data.state = 3;
      });
    },
    linkToList() {
      let { id, name } = this.data;
      this.$router.push({
        name: "indexCheckLeave",
        query: {
          id: id,
          name: name,
        },
      });
    },
    linkToAttend() {
      let { id, name } = this.data;
      this.$router.push({
        name: "indexAttend",
        query: {
          id: id,
          name: name,
        },
      });
    },
    closeCode() {
      clearInterval(this.timer);
      this.timer = null;
      this.open = false;
    },
    async getCode(url) {
      let {
        token,
        data: { id },
      } = this;
      let [err, res] = await this.$http.post(
        url,
        {
          data: {
            meeting: id,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (err) {
        this.$message.error("服务器出错");
        return;
      }
      let { data, msg, code } = res.data;
      if (code !== 0) {
        this.$message.warning(msg);
        return;
      }
      this.codeSrc = data.qrcode;
      this.open = true;
      if (this.timer === null) {
        this.timer = setInterval(() => {
          this.getCode(url);
        }, 30000);
      }
    },
    getCheckInCode() {
      this.getCode("/admin/getCheckInQrcode");
    },
    getCheckOutCode() {
      this.getCode("/admin/getCheckOutQrcode");
    },
    async handleGrant() {
      let {
        token,
        data: { id },
      } = this;
      console.log(id);
      let [err, res] = await this.$http.post(
        "/super/grantMeeting",
        {
          data: {
            meeting: id,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (err) {
        this.$message.error("服务器出错");
        return;
      }
      let { msg, code } = res.data;
      console.log(res);
      if (code !== 0) {
        this.$message.warning(msg);
        return;
      }

      this.$message.success("操作成功");
      this.$bus.$emit("auditStateChange", id, 1);
      this.data.state = 1;
    },
    async handleReject() {
      let {
        token,
        data: { id },
        reason,
      } = this;

      if (reason === "") {
        this.$message.warning("请填写驳回原因");
        return;
      }

      let [err, res] = await this.$http.post(
        "/super/rejectMeeting",
        {
          data: {
            meeting: id,
            reason: reason,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (err) {
        this.$message.error("服务器出错");
        return;
      }
      let { msg, code } = res.data;
      console.log(res);
      if (code !== 0) {
        this.$message.warning(msg);
        return;
      }

      this.$message.success("操作成功");
      this.data.state = 2;
      this.$bus.$emit("auditStateChange", id, 2);
      this.show = false;
    },
    showReject() {
      this.show = true;
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      //表格以该函数合并单元格 具体看element-ui的文档
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    handleEdit() {
      let { id } = this.data;
      let params = { ...this.data };
      console.log(params);
      this.$router.push({
        name: "publish",
        query: {
          id: id,
          type: "edit",
        },
        params: {
          params: params,
        },
      });
    },
    async handleDelete() {
      // this.$message.warning('删除会议暂时没有开放')
      let { token } = this;
      let { id } = this.data;
      let [err, res] = await this.$http.post(
        "/super/deleteMeeting",
        {
          data: {
            meeting: id,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (err) {
        this.$message.error("服务器出错");
        return;
      }
      let { msg, code } = res.data;
      console.log(res);
      if (code !== 0) {
        this.$message.warning(msg);
        return;
      }
      this.$message.success("删除成功");
      this.$router.replace("/index");
    },
    handleAdd() {
      this.$message.warning("补录功能暂时没有开放");
    },
    linkToSign() {
      let { id, name } = this.data;
      this.$router.push({
        name: "indexSign",
        query: {
          id: id,
          name: name,
        },
      });
    },
  },
  watch: {
    $route(to, from) {
      if (to.path === "/index/list" || to.path === "/audit/List") {
        this.render = true;
      }
      if(from.path==='/view/detail'){
          this.render = true
      }
    },
  },
  activated: function () {
    //console.log(this.render)
    if (this.render) {
      let { id, pageType } = this.$route.query;
      this.data.id = id;
      this.pageType = parseInt(pageType);
      this.token = sessionStorage.getItem("userId");
      this.rank = sessionStorage.getItem("role");
      this.getDetail(id);
      this.render = false;
    }
  },
};
</script>

<style scoped>
.info-container {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 0;
  margin: 2rem;
}

.detail-info {
  border-bottom: 1px solid #999;
  padding: 2rem;
}

.info-header {
  display: flex;
  align-items: center;
}

.info-header > * {
  margin-right: 10px;
}

.info-main {
  display: flex;
  align-items: center;
}

.info-main > * {
  width: 50%;
}

.info-item {
  display: flex;
  color: #888;
  font-size: 1rem;
  margin: 10px 0;
}

.info-item > .label {
  width: 5rem;
  text-align: left;
  margin-right: 50px;
  color: #333;
}

.info-item > .info {
  flex: 1;
  white-space: pre-wrap;
  text-align: left;
}

.img {
  width: 300px;
  height: 200px;
  border-radius: 1rem;
}

.meeting-member {
  padding: 1rem 0;
}

.table-title {
  display: flex;
  align-items: center;
  margin: 0.5rem 1rem;
  flex-direction: row-reverse;
}

.table-title > .btn-group {
  position: absolute;
}

.table-title > h3 {
  flex: 1;
  text-align: center;
}

.el-dialog > * {
  padding: 0;
}
.code-box {
  margin: 0 auto;
  width: 350px;
  height: 350px;
  text-align: center;
}
.close-box {
  width: 100%;
}
.close-box > * {
  width: 100%;
}
.message-item > .right {
  text-align: right;
  padding-right: 50px;
}
.code {
  width: 100%;
  height: 100%;
}
.table {
  width: 400px;
  margin: 20px auto;
}
</style>