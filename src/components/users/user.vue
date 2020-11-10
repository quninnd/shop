<template>
  <div class="bigBox">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ---------------------------------------------------------------- -->
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 最上面的输入框 -->
      <div class="inputArea">
        <div class="inputBox">
          <!-- input输入框 -->
          <el-input placeholder="查询用户" v-model="searchData" class="input-with-select" clearable @clear="reLoad">
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search" @click="searchUserInfo"></el-button>
          </el-input>
        </div>
        <!-- 添加用户按钮 -->
        <el-button type="primary" @click="dialogVisible">添加用户</el-button>
      </div>
    </el-card>
    <!-- ---------------------------------------------------------------- -->
    <!-- 表格区域 -->
    <template>
      <el-table :data="usersData" stripe style="width: 100%" border>
        <el-table-column prop="date" label="#" width="50" type="index">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="270">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="270">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="270">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="270">
        </el-table-column>
        <!-- 开关 -->
        <el-table-column prop="mg_state" label="状态" width="270">
          <template slot-scope="rowData">
            <el-switch v-model="rowData.row.mg_state" @change="switchChange($event,rowData.row.id)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="address" label="操作">
          <template slot-scope="rowData">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" @click="editUser(rowData.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="delBtn(rowData.row.id)"></el-button>
            <!-- 设置按钮 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="setBtn(rowData.row.id,rowData.row.username,rowData.row.role_name)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="allSet.pagenum"
      :page-sizes="[3, 5, 8, 10]" :page-size="allSet.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- -----------------------------添加用户的弹出框----------------------------------- -->
    <!-- ---------------------------------------------------------------- -->
    <!-- 添加用户的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addBtnFlag" width="50%">
      <!-- form表单 -->
      <el-form ref="addUserForm" :model="addUserForm" :rules="addRules" label-width="80px">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" :clearable="true"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password" :show-password="true"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- -------------------------------修改用户信息的弹出框--------------------------------- -->
    <!-- 点击修改用户信息的弹窗 -->
    <el-dialog title="修改信息" :visible.sync="editBtnFlag" width="50%">
      <!-- 表单区域 -->
      <el-form ref="editUserForm" :model="editData" :rules="addRules" label-width="80px">
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input disabled v-model="editData.username"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editData.email" :clearable="true"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editData.mobile" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editCloseBtn">取 消</el-button>
    <el-button type="primary" @click="sureEditBtn">确 定</el-button>
  </span>
    </el-dialog>
    <!-- ---------------------------------删除用户的弹框----------------------------- -->
    <el-dialog title="提示" :visible.sync="deleteFlag" width="20%" height="30%" top="30vh">
        <el-alert title="此操作将永久删除该用户, 是否继续?" type="warning" show-icon :closable="false"></el-alert>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDel">取 消</el-button>
        <el-button type="primary" @click="sureClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ---------------------------------分配角色的弹框----------------------------- -->
    <el-dialog title="分配角色" :visible.sync="settingFlag" width="50%" top="15vh">
      <div class="fsize">
        <span>当前的用户: </span>
        <span>{{setRoleInfo.username}}</span>
      </div>
      <div class="fsize">
        <span>当前的角色: </span>
        <span>{{setRoleInfo.roleName}}</span>
      </div>
      <!--分配权限的下拉选择框-->
      <div class="fsize">
        <span class="roles">分配新角色:</span>
        <template>
          <el-select v-model="roleID" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </template>
      </div>
      <!-- ----- -------------------------- -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setClose">取 消</el-button>
        <el-button type="primary" @click="sureSetRoleBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证密码的自定义规则
    var checkpassword = (rule, value, cb) => {
      var pwdReg = /^[0-9]{6,10}$/
      if (!pwdReg.test(value)) {
        return cb(new Error('请输入合格的密码,不能包含中文或下划线以外的字符串'))
      }
      cb()
    }
    // 邮箱
    var checkemail = (rule, value, cb) => {
      var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!emailReg.test(value)) {
        return cb(new Error('请输入正确的邮箱'))
      }
      cb()
    }
    // 手机
    var checkmobile = (rule, value, cb) => {
      var mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!mobileReg.test(value)) {
        return cb(new Error('请输入正确的手机号码'))
      }
      cb()
    }
    return {
      // 存储拿到的用户数据的数组
      usersData: [],
      // 页码的配置
      allSet: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 3 // 每页显示条数
      },
      total: 0,
      searchData: '',
      // 控制添加用户框弹出与隐藏的flag
      addBtnFlag: false,
      // 绑定添加用户输入框的值
      addUserForm: {
        username: '',
        password: '111111',
        email: '184552768@qq.com',
        mobile: '15045454545'
      },
      // 添加用户验证规则
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '用户名长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: checkpassword, trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入用邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 存储点击修改用户信息 获取过来的数据
      editData: {},
      // 编辑按钮弹出框的flag
      editBtnFlag: false,
      // 控制删除按钮 弹出框是否显示与隐藏的flag
      deleteFlag: false,
      // 删除弹出框的flag 判断用户是否真的想删除
      sureDelFlag: false,
      // 存储需要删除的用户的id
      userDelId: '',
      // 控制分配角色弹框显示 隐藏的flag
      settingFlag: false,
      // 用来接受权限管理角色的数组 只接受了最外面一层的权限
      rolesList: [],
      roleID: '',
      // 存储渲染到设置角色框的用护数据
      setRoleInfo: {
        id: '',
        username: '',
        roleName: ''
      }
    }
  },

  async created () {
    this.getList()
    this.getRoles()
  },

  methods: {
    // 获取用户数据的函数
    async getList () {
      const { data: res } = await this.$http.get('users', { params: this.allSet })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取管理员列表失败!')
      // 成功拿到数据  开始赋值 总数 当前页码数  用户数据
      this.usersData = res.data.users
      this.total = res.data.total
      // this.allSet.pagenum = res.data.pagenum
    },
    // 每页显示多少条改变触发的函数
    handleSizeChange (num) {
      // console.log(num)
      this.allSet.pagesize = num
      this.getList()
    },
    // 当前页改变时,触发的函数
    handleCurrentChange (currentNum) {
      // console.log(currentNum)
      this.allSet.pagenum = currentNum
      this.getList()
    },
    // 开关状态发生改变,就调用请求,存储用户的状态
    async switchChange (e, uID) {
      // console.log(e, uID)
      const { data: res } = await this.$http.put(`users/${uID}/state/${e}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('更改用户状态失败!')
      this.$message.success('更新用户状态成功!')
    },
    // 查询用户的函数  将文本框的值赋予给query参数
    async searchUserInfo () {
      // console.log(this.allSet)
      this.allSet.pagenum = 1
      this.allSet.query = this.searchData
      this.getList()
      this.$message.success('查询成功!')
    },
    // 当文本框的值清空时,重新渲染表格
    reLoad () {
      this.allSet.query = ''
      this.allSet.pagenum = 1
      this.allSet.pagesize = 3
      this.getList()
    },
    // 控制添加用户对话框显示的函数
    dialogVisible () {
      this.addBtnFlag = !this.addBtnFlag
    },
    // 添加用户中的取消按钮触发的函数 清空输入的值与验证
    cancelBtn () {
      this.addBtnFlag = false
      // console.log(this.$refs)
      this.$refs.addUserForm.resetFields()
    },
    // 添加用户中的确定按钮触发的函数 清空输入的值与验证 发送请求 重新渲染表格数据
    sureBtn () {
      this.$refs.addUserForm.validate(async flag => {
        // console.log(flag)
        if (!flag) return this.$message.error('信息不通过')
        const { data: res } = await this.$http.post('users', this.addUserForm)
        // console.log(res)
        if (res.meta.msg === '用户名已存在') return this.$message.error('用户名已存在,创建失败')
        this.$message.success('添加用户成功!')
        this.getList()
        this.addBtnFlag = false
      })
    },
    // 修改按钮 发起请求获取该用户的数据
    async editUser (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('/users/' + id)
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('请重试!')
      this.editData = res.data
      this.editBtnFlag = true
    },
    // TODO 点击取消按钮, 隐藏弹框 并清空编辑框的数据
    editCloseBtn () {
      this.editBtnFlag = false
      this.$refs.editUserForm.resetFields()
    },
    // TOD0 确定按钮 验证成功 就发起请求修改用户数据 关闭弹框 清空输入框的值
    sureEditBtn () {
      this.$refs.editUserForm.validate(async flag => {
        // console.log(flag)
        if (!flag) return this.$message.error('请输入正确的格式!')
        const { data: res } = await this.$http.put('users/' + this.editData.id, this.editData)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新数据失败!')
        this.$message.success('更新数据成功!')
        this.editBtnFlag = false
        this.getList()
      })
    },
    // 删除按钮 点击触发的函数 要实现删除用户的操作 先弹出警告框, 待获取确定再发起删除请求 重新渲染数据
    delBtn (id) {
      this.deleteFlag = true
      this.userDelId = id
    },
    // 取消删除
    cancleDel () {
      this.sureDelFlag = false
      this.deleteFlag = false
      return this.$message.warning('取消删除')
    },
    // 用户非常确定要删除
    async sureClick () {
      this.sureDelFlag = true
      const { data: res } = await this.$http.delete('users/' + this.userDelId)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败!')
      this.deleteFlag = false
      this.getList()
      return this.$message.success('删除用户成功!')
    },
    // getRoles 获取角色数据的函数
    async getRoles () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      res.data.forEach(item => {
        this.rolesList.push({
          id: item.id,
          roleName: item.roleName
        })
      })
    },
    // TODO 点击编辑按钮 打开编辑弹框 并将参数赋值给setRoleInfo 用于渲染到弹框
    setBtn (setID, setUserName, setRoleName) {
      this.setRoleInfo.id = setID
      this.setRoleInfo.username = setUserName
      this.setRoleInfo.roleName = setRoleName
      this.settingFlag = true
    },
    // 点击修改用户信息的弹窗里面的取消按钮 关闭弹窗, 且清空下拉框的值
    setClose () {
      this.settingFlag = false
      this.roleID = ''
    },
    async sureSetRoleBtn () {
      const { data: res } = await this.$http.put(`users/${this.setRoleInfo.id}/role`, { rid: this.roleID })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('设置角色失败!请重试哦(⊙o⊙)')
      this.settingFlag = false
      this.getList()
      return this.$message.success('设置角色成功!')
    }
  }
}
</script>

<style scoped lang='less'>
  .bigBox {
    padding: 15px;
    background-color: #fff;
  }

  .el-card {
    margin-top: 10px;
  }

  .inputArea {
    display: flex;
    justify-content: flex-start
  }

  .inputBox {
    margin-right: 20px;
  }

  .el-input {
    width: 400px;
  }

  .el-pagination {
    margin-top: 10px;
    background-color: #fff;
  }
  .fsize {
    font-size: 16px;
    margin: 14px;
  }
  .roles {
    margin-right: 5px;
  }
</style>
