<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <div style="margin: 15px 0">
        选择商品分类:
        <!-- 级联选择器 -->
        <el-cascader
          v-model="selectValue"
          :options="allData"
          :props="propsData"
          @change="handleChange">
        </el-cascader>
        <!-- tab切换页 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <div>
              <el-button type="primary" :disabled="btnFlag" @click="showDio">
                添加参数
              </el-button>
              <!-- 动态参数表格区域 -->
              <el-table :data="manyParams" stripe style="width: 100%" border>
                <!-- tag区域 -->
                  <el-table-column prop="" label="" width="50" type="expand">
                    <template slot-scope="scope">
                      <el-tag
                      :key="tag"
                      v-for="(tag,i) in scope.row.attr_vals"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(i,scope.row)">
                      {{tag}}
                    </el-tag>
                    <!--  -->
                    <el-input
                      class="input-new-tag"
                      v-show="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                  </el-table-column>
                <el-table-column prop="" label="#" width="50" type="index"></el-table-column>
                <!-- 参数名称 -->
                <el-table-column prop="attr_name" label="参数名称" fix></el-table-column>
                <!-- 操作 -->
                <el-table-column prop="date" label="操作" width="300">
                  <template slot-scope="rowData">
                    <el-button type="primary" icon="el-icon-edit" @click="editParams(rowData.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeParams(rowData.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- ---------------------------------------------------------------- -->
          <el-tab-pane label="静态属性" name="only">
            <div>
              <el-button type="primary" :disabled="btnFlag" @click="showDio">
                添加属性
              </el-button>
              <!-- 静态属性表格区域 -->
              <el-table :data="manyParams" stripe style="width: 100%" border>
                <!-- tag区域 -->
                  <el-table-column prop="" label="" width="50" type="expand">
                    <template slot-scope="scope">
                      <el-tag
                      :key="tag"
                      v-for="(tag,i) in scope.row.attr_vals"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(i,scope.row)">
                      {{tag}}
                    </el-tag>
                    <!--  -->
                    <el-input
                      class="input-new-tag"
                      v-show="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                  </el-table-column>
                <el-table-column prop="" label="#" width="50" type="index"></el-table-column>
                <!-- 参数名称 -->
                <el-table-column prop="attr_name" label="参数名称" fix></el-table-column>
                <!-- 操作 -->
                <el-table-column prop="date" label="操作" width="300">
                  <template slot-scope="rowData">
                    <el-button type="primary" icon="el-icon-edit" @click="editParams(rowData.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeParams(rowData.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <!-- 添加参数的对话框------------------------ -->
    <el-dialog
      title="添加参数"
      :visible.sync="dialogVisible"
      @close="dialogClose"
      width="50%">
      <!-- form表单 -->
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="addData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框------------------9999------ -->
    <el-dialog
      title="修改参数"
      :visible.sync="putParamsVisible"
      @close="editParamsClose"
      width="50%">
      <!-- form表单 -->
      <el-form :model="editData" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="editData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="putParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 存放三级联动数据的数组
      selectValue: [],
      // 用来存储所有商品分类的123级都有的数据
      allData: [],
      // props的配置
      propsData: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 切换到哪个tab页的name
      activeName: 'many',
      // 主宰添加参数的两个按钮的flag
      btnFlag: true,
      // 存储动态参数
      manyParams: [],
      // 动态参数的展开的数据
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      // 控制添加参数的对话框的flag
      dialogVisible: false,
      // 添加动态参数或者静态参数的form数据
      addData: {
        attr_name: '',
        attr_sel: 'many'
      },
      // 修改参数的form
      editData: {
        attrId: 0,
        attr_name: '',
        attr_sel: ''
      },
      // form表单的验证
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改框的flag
      putParamsVisible: false
    }
  },

  created () {
    this.getAllData()
  },

  methods: {
    // 开局就获取123级的商品数据
    async getAllData () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品参数失败!')
      this.allData = res.data
    },
    // 级联选择器选中发生变化触发的函数
    async handleChange (val) {
      const vals = JSON.parse(JSON.stringify(val))
      if (vals.length !== 3) {
        this.selectValue = []
        return this.$message.error('必须选择三级分类!')
      }
      this.selectValue = vals
      this.btnFlag = false
      this.getData()
    },
    // 获取静态 动态参数的函数
    async getData () {
      // 发起请求获取动态参数和静态属性
      const { data: res } = await this.$http.get(`categories/${this.selectValue[this.selectValue.length - 1]}/attributes`, { params: { sel: this.activeName } })
      // console.log(res.data)
      if (res.meta.status !== 200) this.$message.error('获取动态参数失败!')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(' ')
        // 让每一个元素都有自己的inputVisible/inputValue
        item.inputVisible = false
        item.inputValue = ''
      })
      this.manyParams = res.data
    },
    // 切换tab触发的函数
    handleClick () {
      this.addData.attr_sel = this.activeName
      this.getData()
    },
    // 点击tag的删除
    async handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.put(`categories/${this.selectValue[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('添加参数失败!')
      this.$message.success('更新参数成功!')
    },
    // 添加属性对话框的显示
    showDio () {
      this.dialogVisible = true
    },
    // 对话框关闭时,清空数据和验证
    dialogClose () {
      this.$refs.ruleForm.resetFields()
      this.addData.attr_name = ''
    },
    // 确认添加参数的按钮触发的函数
    async sureAddparams () {
      const { data: res } = await this.$http.post(`categories/${this.selectValue[2]}/attributes`, this.addData)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error(`添加${this.activeName === 'many' ? '动态' : '静态'}属性失败!请重试!!!`)
      this.$message.success('创建成功!')
      this.dialogVisible = false
      this.getData()
    },
    // 删除动态参数和静态属性的函数 先询问删不删除
    removeParams (i) {
      this.$confirm('此操作将删除该属性, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.selectValue[2]}/attributes/${i}`)
        if (res.meta.status !== 200) return this.$message.error('删除属性失败!')
        this.getData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击修改按钮 弹出修改框
    editParams (i) {
      this.putParamsVisible = true
      this.editData.attr_sel = this.activeName
      this.editData.attrId = i * 1
    },
    // 修改框关闭 就清空一些数据
    editParamsClose () {
      this.$refs.editForm.resetFields()
      this.editData.attr_name = ''
    },
    // 确认修改参数的按钮触发的函数
    async sureEditParams () {
      // console.log(this.editData)
      const { data: res } = await this.$http.put(`categories/${this.selectValue[2]}/attributes/${this.editData.attrId}`, this.editData)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('参数更新失败!')
      this.$message.success('更新成功!')
      this.putParamsVisible = false
      this.getData()
    },
    // 输入框失去焦点或点回车触发的函数
    async handleInputConfirm (row) {
      if (row.inputValue.trim() === '') {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 发起请求
      row.attr_vals.push(row.inputValue.trim())
      const { data: res } = await this.$http.put(`categories/${this.selectValue[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('添加参数失败!')
      this.$message.success('更新参数成功!')
      row.inputValue = ''
      row.inputVisible = false
    },
    // 点击按钮显示输入框
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style scoped lang='less'>
.el-card {
  margin-top: 10px;
}
.el-tabs {
  user-select: none;
}
.el-button {
  transform: scale(0.8)
}
.el-tag {
  margin-right: 8px;
  font-size: 14px;
}
.input-new-tag {
  width: 120px;
}
.el-button {
  height: 40px;
}
</style>
