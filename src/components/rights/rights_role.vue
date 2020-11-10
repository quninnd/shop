<template>
  <div class="role">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色的按钮 -->
      <div>
        <el-button type="primary" @click="addRole">添加角色</el-button>
      </div>
      <!-- 表格区域 -->
      <template>
        <el-table :data="roleList" stripe style="width: 100%" border default-expand>
          <el-table-column label="" width="50" type="expand"></el-table-column>
          <el-table-column label="#" width="50" type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="550"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述" width="604"></el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作" width="349">
            <template slot-scope="rowData">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" @click="editRole(rowData.row.id,rowData.row.roleName,rowData.row.roleDesc)">编辑</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" @click="open(rowData.row.id)">删除</el-button>
              <!-- 设置按钮 -->
              <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- -------------------------------添加角色的弹框--------------------------------- -->
    <el-dialog title="添加角色" :visible.sync="addFlag" width="30%" @close="cancelAddBtn()">
      <!-- 对话框表单 -->
      <el-form :model="addFormData" label-width="100px" ref="addForm" :rules="addRules">
        <!-- 角色 -->
        <el-form-item label="添加角色:" prop="roleName">
          <el-input v-model="addFormData.roleName" placeholder="角色名为必填项"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="addFormData.roleDesc" placeholder="角色描述可不填"></el-input>
        </el-form-item>
      </el-form>
      <!-- ---底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddBtn">取 消</el-button>
        <el-button type="primary" @click="sureAddBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- -------------------------------编辑角色的弹框--------------------------------- -->
    <el-dialog title="编辑角色" :visible.sync="editFlag" width="30%" @close="$refs.editForm.resetFields()">
      <!-- 对话框表单 -->
      <el-form :model="editFormData" label-width="100px" ref="editForm" :rules="addRules">
        <!-- 角色 -->
        <el-form-item label="编辑角色:" prop="roleName">
          <el-input v-model="editFormData.roleName" placeholder="角色名为必填项"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="编辑角色描述:" prop="roleDesc">
          <el-input v-model="editFormData.roleDesc" placeholder="角色描述可不填"></el-input>
        </el-form-item>
      </el-form>
      <!-- ---底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFlag=false">取 消</el-button>
        <el-button type="primary" @click="sureEditBtn">确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 存储所有角色的数组
      roleList: [],
      // 添加角色的对话框的flag
      addFlag: false,
      // 添加角色的表单数据绑定
      addFormData: {
        roleName: '',
        roleDesc: ''
      },
      // 定义角色名称的验证规则
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 点击编辑按钮 编辑弹框的flag
      editFlag: false,
      // 编辑框存的消息
      editFormData: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
    }
  },

  created () {
    this.getRoleList()
  },

  methods: {
    // 开局就获取角色列表信息的函数
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
      this.roleList = res.data
    },
    // 取消添加用户的按钮触发的函数 清除表单数据 关闭弹出层
    cancelAddBtn () {
      this.$refs.addForm.resetFields()
      this.addFlag = false
    },
    // 添加角色的按钮触发函数 显示与关闭弹出层
    addRole () {
      this.addFlag = true
    },
    // 添加弹框中的确定按钮， 就要发起请求
    sureAddBtn () {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return this.$message.error('数据不合格！')
        const { data: res } = await this.$http.post('roles', this.addFormData)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败，请稍后重试！')
        this.addFlag = false
        this.$refs.addForm.resetFields()
        this.getRoleList()
        this.$message.success('添加角色成功！')
      })
    },
    // 这个是编辑按钮，控制编辑弹框的开， 并且传参把当前行的数据赋值给editFormData
    editRole (i, un, dsc) {
      this.editFormData.id = i
      this.editFormData.roleName = un
      this.editFormData.roleDesc = dsc
      this.editFlag = true
    },
    // 管理员非常确认要修改的函数 点击编辑弹框的确定按钮触发的函数
    sureEditBtn () {
      this.$refs.editForm.validate(async flag => {
        if (!flag) return this.$message.error('角色名不符合要求')
        const { data: res } = await this.$http.put('roles/' + this.editFormData.id, this.editFormData)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败了~~~ 请重试')
        this.$message.success('编辑角色成功！')
        this.editFlag = false
        this.getRoleList()
      })
    },
    // TODO 点击删除 弹出提示框
    open (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(id)
        const { data: res } = await this.$http.delete('roles/' + id)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败，请重试！')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getRoleList()
      }).catch(() => {
        console.log(22)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
.el-card {
  margin-top: 8px;
}
.el-table {
  margin-top: 10px;
  box-sizing: border-box;
}
</style>
