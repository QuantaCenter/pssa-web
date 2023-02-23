<template>
    <div class="bg-page">
        <div class="login-box">
            <div class="form-box">
                <img src="../assets/app-logo.png" title="logo" class="logo"/>
                <div class="form">
                    <el-input v-model="username" placeholder="请输入账号"/>
                    <el-input v-model="password" placeholder="请输入密码" type="password"/>
                    <div @click="login" class="btn" v-loading="loading">登录</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data: function() {
            return {
                username: '',
                password: '',
                loading: false
            }
        },
        methods: {
            async login(){
                if(this.username === ''|| this.password === ''){
                    this.$message.warning('请填写完整')
                    return
                }
                this.loading = true
               let [err, res] = await this.$http.post(
                    '/index/login', {
                        data: {
                            number: this.username,
                            password: this.password
                        }
                    }, {
                        headers: {'Authorization': 'Bearer login'}
                    }
                )
                this.loading = false
                if(err){
                    console.log(err)
                    this.$message.error('服务器出错')
                    return
                }

                let data = res.data

                if(data.code !== 0){
                    this.$message.warning('工号或密码出错')
                    return
                }

                this.$message.success('登录成功')
                sessionStorage.setItem('userId', data.data.token)
                sessionStorage.setItem('role', data.data.role)
                this.$router.push('/')

                // sessionStorage.setItem('userId', '1')
                // this.$router.push('/')
            }
        }
    }
</script>

<style scoped>

    .login-box{
        height: 36rem;
        width: 54rem;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        -moz-transform: translate3d(-50%, -50%, 0);
        -ms-transform: translate3d(-50%, -50%, 0);
        -o-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
        background: url("../assets/login.png") no-repeat ;
        background-size: cover;
        display: flex;
        justify-content: flex-end;
    }
    .form-box{
        width: 38%;
        margin-right: 0.8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .logo{
        width: 5rem;
        height: 5rem;
    }

    .form{
        margin: 20px ;
    }

    .form>*{
        margin: 10px 0;
    }

    .btn{
        background: #004593;
        opacity: 0.6;
        border: transparent;
        border-radius: 1.5rem;
        text-align: center;
        color: #fff;
        cursor: pointer;
        padding: 10px 0;
        transition: opacity 0.5s;
    }

    .btn:hover{
        opacity: 1;
    }
</style>