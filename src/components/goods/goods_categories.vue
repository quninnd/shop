<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加分类的按钮 -->
      <el-button type="primary" class="mt" @click="addBtn">添加分类</el-button>
      <tree-table :data="cateData" :columns="columsArr" show-index
      index-text="#"
      :expand-type="false"
      :selection-type="false"
      border>
      <!-- 是否有效 -->
      <template slot="isOK" slot-scope="rowdata">
        <i :class="rowdata.row.cat_deleted?['el-icon-error']:['el-icon-success']" class="bg"></i>
      </template>
      <!-- 排序 -->
      <template slot="sort" slot-scope="rowdata">
        <el-tag v-if="rowdata.row.cat_level==0">一级</el-tag>
        <el-tag v-if="rowdata.row.cat_level==1" type="warning">二级</el-tag>
        <el-tag v-if="rowdata.row.cat_level==2" type="success">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="setting">
        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="categoriesData.pagenum"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="categoriesData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- ---------------------------------添加分类的对话框------------------------------- -->
    <el-dialog
      title="提示"
      :visible.sync="addVisible"
      @close="emptyAddForm()"
      width="50%">
      <!-- form表单 -->
      <el-form :model="addCateGForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <!--  -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateGForm.cat_name"></el-input>
        </el-form-item>
        <!-- 添加父级分类的级联下拉框 -->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectValue"
            :options="selectData"
            :props="selectProps"
            clearable
            @change="handleSelectChange"
            ref="refhandle">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleBtn">取 消</el-button>
        <el-button type="primary" @click="sureAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //
      categoriesData: {
        type: '',
        pagenum: 1,
        pagesize: 3
      },
      // 总条数
      total: 0,
      // 存储获取过来的123级参数数据
      cateData: [],
      columsArr: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        prop: 'cat_deleted',
        type: 'template',
        template: 'isOK'
      },
      {
        label: '排序',
        prop: 'cat_level',
        type: 'template',
        template: 'sort'
      },
      {
        label: '操作',
        type: 'template',
        template: 'setting'
      }
      ],
      addVisible: false,
      // 添加分类的表单数据
      addCateGForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的验证
      addRules: {
        cat_name: [
          { required: true, message: '请输入分类', trigger: 'blur' }
        ]
      },
      // 下拉框的所有数据 12级
      selectData: [],
      // 下拉框的选中值
      selectValue: [],
      // 下拉框props的配置
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },

  created () {
    this.getGoodsCategories()
  },

  methods: {
    async getGoodsCategories () {
      const { data: res } = await this.$http.get('categories', { params: this.categoriesData })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      // console.log(res.data)
      this.cateData = res.data.result
      this.total = res.data.total
    },
    // 每页显示条数发生改变 触发的函数
    handleSizeChange (val) {
      this.categoriesData.pagesize = val
      this.categoriesData.pagenum = 1
      this.getGoodsCategories()
    },
    // 当前页改变触发的函数
    handleCurrentChange (val) {
      // console.log(val)
      this.categoriesData.pagenum = val
      this.getGoodsCategories()
    },
    // 点击添加分类按钮 弹出对话框
    async addBtn () {
      const { data: res } = await this.$http.get('categories', { params: { type: '2' } })
      // console.log(res)
      this.selectData = res.data
      this.addVisible = true
    },
    // 下拉框选择改变触发的函数
    handleSelectChange (val) {
      const vals = JSON.parse(JSON.stringify(val))
      // console.log(vals)
      this.selectValue = vals
      if (vals.length !== 0) {
        this.addCateGForm.cat_level = this.selectValue.length
        this.addCateGForm.cat_pid = this.selectValue[this.selectValue.length - 1]
      } else {
        this.addCateGForm.cat_level = 0
        this.addCateGForm.cat_pid = 0
      }
    },
    // 情况添加分类的表单数据的函数
    emptyAddForm () {
      this.selectValue = []
      this.addCateGForm.cat_name = ''
      this.addCateGForm.cat_level = 0
      this.addCateGForm.cat_pid = 0
      this.$refs.addForm.resetFields()
    },
    // 用户取消添加 点击取消按钮触发的函数
    cancleBtn () {
      this.addVisible = false
    },
    // 确定提交
    sureAddCate () {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return this.$message.error('请填写必要的必填项!')
        const { data: res } = await this.$http.post('categories', this.addCateGForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败,请重试!')
        this.$message.success('添加分类成功!')
        this.addVisible = false
        this.getGoodsCategories()
      })
    }
  }
}
</script>

<style scoped lang='less'>
.el-card {
  margin-top: 10px;
}
.bg {
 color: rgb(122, 211, 122);
}
.mt {
  margin-bottom: 10px;
}
.el-pagination {
  margin-top: 20px;
}
/deep/.el-radio__inner {
  overflow: hidden;
}
</style>
