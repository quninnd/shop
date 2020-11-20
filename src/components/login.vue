<template>
  <div class="hello">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="logo">
        <img src="../assets/img/dog.jpg" alt="">
      </div>
      <!-- 表单-->
      <div class="login_inp">
        <el-form :model="ruleForm" :rules="Formrules" ref="loginForm">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" >
              <i slot="prefix" class="el-input__icon el-icon-s-custom"></i>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" type="password" show-password>
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loginBtn">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单的数据
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单的验证规则
      Formrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '用户名长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.loginForm.resetFields()
    },
    // 发起登录请求验证
    loginBtn () {
      this.$refs.loginForm.validate(async (flag) => {
        if (!flag) return this.$message.error('登录失败！')
        const { data: res } = await this.$http.post('login', this.ruleForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        // 登录成功，保存token字符串，并跳转页面
        this.$message.success('登录成功！')
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/users')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .hello {
    height: 100%;
    background-color: #2B4B6B
  }

  .login_box {
    position: relative;
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    padding:15px;
    background-color: #fff;
    transform: translate(-50%, -50%);
  }

  .logo {
    position: absolute;
    left: 50%;
    width: 110px;
    height: 110px;
    transform: translate(-50%, -70%);
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
  }

  .logo img {
    width: 100%;
    height: 100%;
    background-color: #eee;
  }
  .login_inp {
    margin-top: 90px;
  }
  .el-input {
    border: 1px solid green;
  }
</style>
