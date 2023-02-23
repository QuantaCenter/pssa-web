<template>
  <div class="page-container">
    <div class="page-header">
      <div class="app-name">广东外语外贸大学培训学时系统管理后台</div>
      <div class="info">
        <span>尊敬的管理员： {{username}}</span>
        <el-dropdown class="setting">
          <span class="el-dropdown-link">
            <i class="el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native.prevent="logout">退出登录</el-dropdown-item>
            <el-dropdown-item @click.native.prevent="showEditModal">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="page-content">
      <div class="nav">
        <div class="list-container">
          <div v-for="(item, index) in navList" class="nav-item" :key="index">
            <router-link :to="item.path" active-class="active-navLink">{{item.text}}</router-link>
          </div>
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
    <el-dialog title="修改订单" :visible.sync="visible">
      <el-form :model="form" :label-position="'left'">
        <el-form-item label="原密码" label-width="150px">
          <el-input v-model="form.oldpass" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="150px">
          <el-input v-model="form.newpass" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次确认新密码" label-width="150px">
          <el-input v-model="form.repeatpass" placeholder="请再次确认新密码" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" :loading="loading" @click.native="submit">确认</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
import { PageHeader } from "element-ui";

export default {
  name: "PageContainer",
  data: function() {
    return {
      username: "",
      rank: 0,
      token: "",
      NavItems: [
        {
          text: "会议查看",
          path: "/index",
          icon: "el-icon-s-custom",
          rank: -1
        },
        {
          text: "会议发布",
          path: "/publish",
          icon: "el-icon-s-promotion",
          rank: 1
        },
        {
          text: "会议申请",
          path: "/publish",
          icon: "el-icon-s-promotion",
          rank: 2
        },
        {
          text: "会议审核",
          path: "/audit",
          icon: "el-icon-s-promotion",
          rank: 1
        },
        {
          text: "请假审核",
          path: "/check",
          icon: "el-icon-s-promotion",
          rank: 1
        },
        {
          text: "出勤查看",
          path: "/attend",
          icon: "el-icon-s-promotion",
          rank: 1
        },
        {
          text: "单位查看",
          path: "/view",
          icon: "el-icon-s-promotion",
          rank: 1
        }
      ],
      visible: false,
      form: {
        oldpass: "",
        newpass: "",
        repeatpass: ""
      },
      loading: false
    };
  },
  methods: {
    logout() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let token = this.token;
        let [err, res] = await this.$http.post(
          "/index/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (err) {
          this.$message.error("服务器出错");
          return;
        }
        this.$message.success("退出成功");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("role");
        this.$router.replace({
          name: "Login"
        });
      });
    },
    async getUserInfo() {
      let token = this.token;
      let [err, res] = await this.$http.post(
        "/index/getUserInfo",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (err) {
        console.log(err);
        this.$message.error("服务器出错");
        return;
      }
      if (res.data.code !== 0) {
        console.log(res);
        return;
      }

      let {
        data: { username }
      } = res.data;
      this.username = username;
    },
    async submit() {
      const token = this.token;
      const { oldpass, newpass, repeatpass } = this.form;
      if (
        oldpass.trim() == "" ||
        newpass.trim() == "" ||
        repeatpass.trim() == ""
      ) {
        this.$message.warning("请填写完整");
        return;
      }
      if (newpass != repeatpass) {
        this.$message.warning("两次输入密码不一致");
        return;
      }
      this.loading = true
      const [err, res] = await this.$http.post(
        "/index/changePassword",
        {
          data: {
            password_old: oldpass,
            password_new: newpass
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      this.loading = false
      if (err) {
        console.log(err);
        this.$message.error("服务器出错");
        return;
      }
      if (res.data.code !== 0) {
        console.log(res);
        return;
      }
      this.$message.success('修改成功')
      this.visible = false
      this.form = {
        oldpass: "",
        newpass: "",
        repeatpass: ""
      }
    },
    showEditModal() {
      this.visible = true;
    }
  },
  computed: {
    navList: function() {
      return this.NavItems.filter(
        item => item.rank === -1 || item.rank === this.rank
      );
    }
  },
  mounted() {
    this.token = sessionStorage.getItem("userId");
    this.rank = parseInt(sessionStorage.getItem("role"));
    this.getUserInfo();
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  min-width: 800px;
  display: flex;
  flex-direction: column;
}
.page-header {
  background: #1d8ce0;
  display: flex;
  color: #fff;
  padding: 1rem 1.5rem;
  align-items: center;
  flex-direction: row-reverse;
}

.page-header > .app-name {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  flex: auto;
}

.page-header > .info {
  position: absolute;
}

.page-header > .info > * {
  margin: 0 10px;
  color: #fff;
  font-size: 1.1rem;
}

.page-header > .info > .setting {
  cursor: pointer;
}

.page-content {
  display: flex;
  flex: auto;
}

.nav {
  width: 15rem;
  background: #324157;
}

.main {
  flex: 1;
  background: #e8e8e8;
}

.list-container {
  position: sticky;
  top: 20px;
}

.nav-item {
  padding: 0 1.5rem;
  text-align: center;
  margin: 1rem 0;
}

.nav-item > * {
  font-size: 1.2rem;
  font-weight: bold;
  color: #b0bdcd;
  cursor: pointer;
  transition: color 0.5s;
  text-decoration: none;
}

.nav-item > *:hover {
  color: #20a0ff;
}

.active-navLink {
  color: #20a0ff;
}
</style>