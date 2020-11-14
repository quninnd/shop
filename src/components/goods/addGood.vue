<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ---------------------------------------------------------------- -->
    <el-card>
          <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
            <!-- ----------------------------------步骤条------------------------------ -->
        <el-steps :active="actIndex*1" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 基本信息的form表单 -->
        <el-form :model="formData" :rules="formRules" ref="formData" label-width="100px" class="demo-ruleForm">
          <!-- 竖型tab -->
          <el-tabs tab-position="left" style="height: auto;" v-model="actIndex" :before-leave="allowChange" @tab-click="tabChange">
          <!--  -->
          <el-tab-pane label="基本信息" name="0">
              <!-- 1 -->
              <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="formData.goods_name"></el-input>
              </el-form-item>
              <!-- 2 -->
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="formData.goods_price" type="number"></el-input>
              </el-form-item>
              <!-- 3 -->
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="formData.goods_weight" type="number"></el-input>
              </el-form-item>
              <!-- 4 -->
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="formData.goods_number" type="number"></el-input>
              </el-form-item>
              <!-- 5 -->
              <el-form-item label="商品分类" prop="goods_cat">
                <!-- 级联选择器 -->
                <el-cascader v-model="formData.goods_cat" :options="selectArr" :props="selectProps"
                @change="selectChange">
                </el-cascader>
              </el-form-item>
          </el-tab-pane>
          <!-- 商品动态参数 -->
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in moveParams" :key="item.attr_id">
              <br>
              <el-checkbox-group v-model="item.attr_vals" v-for="(items, index) in item.attr_vals" :key="index" size="small">
                <el-checkbox :label="items" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品静态属性 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in staticParams" :key="item.attr_id">
              <br>
              <el-input v-model="item.attr_vals">
              </el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品的图片 -->
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              class="upload-demo"
              :action="imgUploadURL"
              :headers="header"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="commitSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!--富文本编辑器 -->
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="formData.goods_introduce">
            </quill-editor>
            <!--添加商品的按钮 -->
            <el-button type="primary" class="btn" @click="addGoodBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
  </el-card>
  <!-- =======================图片预览的对话框========================================= -->
       <el-dialog
       title="图片预览"
       :visible.sync="imgVisible"
       width="30%"
       :before-close="handleClose">
       <img :src="imgURL" alt="">
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 当前tab页的name值012345
      actIndex: 0,
      // 存储基本信息表单的数据
      formData: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '', // 数量
        goods_cat: '', // 分类
        goods_introduce: '', // 介绍
        pics: [], // 上传的图片临时路径（对象）
        attrs: [] // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      // 存储三级下拉选择器的数据
      selectArr: [],
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 用来判断用户使用选择了三级商品，没有三级 不允许用户切换tab
      checkLength: [],
      // 表单验证
      formRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '必须选择三级分类', trigger: 'blur' }
        ]
      },
      // 存储获取过来的动态参数
      moveParams: [],
      // 存储获取过来的静态参数
      staticParams: [],
      // 图片文件上传的路径
      imgUploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      header: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制图片预览对话框的flag
      imgVisible: false,
      // 图片的地址
      imgURL: ''
    }
  },

  created () {
    this.getselectArr()
  },
  methods: {
    // 获取商品列表的函数
    async getselectArr () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      // console.log(res.data)
      this.selectArr = res.data
    },
    // 级联选择器发生选择时触发的函数
    selectChange (val) {
      console.log(val)
      if (val.length <= 2) {
        this.formData.goods_cat = ''
      }
      this.checkLength = val
      this.formData.goods_cat = val.join(',')
    },
    // 切换tab触发的钩子函数 能拿到切换前的tab名字和将要去的tab名字 如果返回false 就阻止切换
    allowChange (activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)
      if (oldActiveName === '0' && this.checkLength.length !== 3) {
        this.$message.warning('请选择商品分类')
        return false
      }
    },
    // 当tab切换到动态参数tab栏时，发起请求获取动态参数，渲染出来
    async tabChange () {
      // console.log(this.actIndex)
      // 获取动态参数
      if (this.actIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.checkLength[2]}/attributes`, { params: { sel: 'many' } })
        // console.log(res.data)
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        // 加工动态参数 参数为空就返回一个空数组，不为空，就转化为数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.moveParams = res.data
        // this.formData.attrs.push(res.data)
      }
      // 获取静态参数
      if (this.actIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.checkLength[2]}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取静态参数失败')
        // console.log(res)
        this.staticParams = res.data
        // this.formData.attrs.push(res.data)
      }
    },
    // 预览图片时触发的函数
    handlePreview (res) {
      // console.log(res)
      this.imgURL = res.response.data.url
      this.imgVisible = true
    },
    // 移除图片触发的函数
    handleRemove (res) {
      // console.log(res)
      // 如果移除了，相应的存放图片路径的数组也要移除这个图片数据
      const path = res.response.data.tmp_path
      const index = this.formData.pics
        .forEach(p => p.pic === path)
      this.formData.pics.splice(index, 1)
    },
    // 图片上传成功时触发的钩子
    commitSuccess (res, file, fileList) {
      // console.log(res)
      // console.log(file)
      // console.log(fileList)
      // 把返回过来的数据（图片路径）存起来，方便后面提交用到这个参数
      this.formData.pics.push({ pic: res.data.tmp_path })
    },
    // 预览图片的对话框关闭触发的函数
    handleClose () {
      this.imgURL = ''
      this.imgVisible = false
    },
    // 点击确定按钮，提交商品数据，先检验表单
    addGoodBtn () {
      this.$refs.formData.validate(async flag => {
        // console.log(flag)
        if (!flag) return this.$message.error('请正确填写必要的表单项！')
        // 加工动态参数
        this.moveParams.forEach(item => {
          const info = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.formData.attrs.push(info)
        })
        // 加工静态参数
        this.staticParams.forEach(item => {
          // console.log(item)
          this.formData.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        // 发起请求
        const { data: res } = await this.$http.post('goods', this.formData)
        // console.log(res)
        // console.log(this.formData)
        if (res.meta.status !== 201) return this.$message.error('创建商品失败，请重试！')
        this.$message.success('创建商品成功！')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped lang='less'>
.el-steps {
  width: 70%;
}
.el-card {
  margin-top: 10px;
}
.el-alert {
  margin-bottom: 15px;
}
.el-form {
  margin-top: 10px;
}
.el-input {
  width: 50%;
}
.el-form-item div {
  float: left;
}
.el-checkbox {
  margin: 0 8px;
}
/deep/.el-form-item__label {
  width: 200px!important;
  text-align: left;
}
/deep/.el-form-item__content {
  margin-left: 0 !important;
}
img {
  width: 100%;
}
/deep/.btn {
  margin-top: 10px;
}
</style>
