<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <el-card>
      <!-- 最上面的输入框 -->
      <div class="inputArea">
        <div class="inputBox">
          <!-- input输入框 -->
          <el-input placeholder="请输入内容">
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </div>
      </div>
      <!-- 表格区域 -->
      <el-table :data="ordersList" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="260"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="260"></el-table-column>
        <!--  -->
        <el-table-column label="是否付款" width="260">
          <template slot-scope="rowData">
            <el-tag :type="rowData.row.pay_status==='1'?'success':'danger'">{{rowData.row.pay_status==='0'?'未付款':'已付款'}}</el-tag>
          </template>
        </el-table-column>
        <!--  -->
        <el-table-column prop="is_send" label="是否发货" width="260"></el-table-column>
        <!--  -->
        <el-table-column prop="create_time" label="下单时间" width="260">
          <template slot-scope="rowData">
            {{rowData.row.create_time | dataFilter}}
          </template>
        </el-table-column>
        <!--按钮 -->
        <el-table-column prop="date" label="操作" fix>
          <template>
            <el-button type="primary" icon="el-icon-edit" size="small" class="btn1" @click="showDialogBtn"></el-button>
            <el-button type="success" icon="el-icon-location-outline" size="small" @click="showKD"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="orderData.pagenum"
      :page-sizes="[5, 8, 10, 20]" :page-size="orderData.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- ---------------------------------修改地址的对话框------------------------------- -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose">
      <!-- 表单区域 -->
      <el-form :model="areaForm" :rules="areaRules" ref="areaForm" label-width="100px" class="demo-ruleForm">
        <!-- 三级 -->
        <el-form-item label="省市区/县" prop="area">
          <el-cascader
            :options="cityOptions"
            :value="areaForm.area"
            @change="changeProvince">
          </el-cascader>
        </el-form-item>
        <!-- 详细地址 -->
        <el-form-item label="详细地址" prop="more">
          <el-input v-model="areaForm.more"></el-input>
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ------------------------------快递信息的对话框---------------------------------- -->
    <el-dialog
      title="查询物流"
      :visible.sync="KDdialogVisible"
      width="50%">
      //
    <span slot="footer" class="dialog-footer">
      <el-button @click="KDdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="KDdialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入国家省市区的资源
import cityOptions from '../../plugins/city_data2017_element'
export default {
  data () {
    return {
      orderData: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 存储订单数据的数据
      ordersList: [],
      total: 0,
      // flag 控制修改地址的
      dialogVisible: false,
      // 修改地址的表单验证规则
      areaRules: {
        area: [
          { required: true, message: '请选择地址!', trigger: 'blur' }
        ],
        more: [
          { required: true, message: '请输入详细的地址!', trigger: 'blur' }
        ]
      },
      // 存放表单数据
      areaForm: {
        area: [],
        more: ''
      },
      // 省市区的数据
      cityOptions: cityOptions,
      // 存储快递的
      kuaiData: [],
      // 查村物流的对话框的falg
      KDdialogVisible: false
    }
  },

  created () {
    this.getOrders()
  },

  methods: {
    // 获取订单总数据
    async getOrders () {
      const { data: res } = await this.$http.get('orders', { params: this.orderData })
      // console.log(res.data.goods)
      if (res.meta.status !== 200) return this.$message.error('获取订单数据失败!!!')
      this.total = res.data.total
      this.ordersList = res.data.goods
    },
    // size发生变化
    handleSizeChange (val) {
      this.orderData.pagesize = val
      this.orderData.pagenum = 1
      this.getOrders()
    },
    // 切换页数
    handleCurrentChange (val) {
      this.orderData.pagenum = val
      this.getOrders()
    },
    // 对话框关闭就触发的函数
    dialogClose () {
      this.$refs.areaForm.resetFields()
    },
    // 点击按钮打开对话框
    showDialogBtn () {
      this.dialogVisible = true
    },
    // 下拉框选择 发生改变触发的函数
    changeProvince (val) {
      // console.log(val)
      this.areaForm.area = val
    },
    // 查询快递的函数
    async getFastSend () {
      const { data: res } = await this.$http.get(`kuaidi/${1106975712662}`)
      if (res.meta.status !== 200) return this.$message.error('获取快递数据失败!')
      console.log(res)
    },
    // 点击弹出快递信息对话框
    showKD () {
      this.KDdialogVisible = true
      this.getFastSend()
    }
  },
  filters: {
    dataFilter (date) {
      date = new Date(date * 1000)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDay().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      const second = date.getSeconds().toString().padStart(2, '0')
      return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
    }
  }
}
</script>

<style scoped lang='less'>
.el-input {
  width: 500px;
}
.el-card {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
  margin-bottom: 10px;
}
.btn1 {
  margin-right: 10px;
}
</style>
