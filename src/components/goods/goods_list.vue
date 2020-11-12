<template>
  <div class="list">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ---------------------------------------------------------------- -->
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 最上面的输入框 -->
      <div class="inputArea">
        <div class="inputBox">
          <!-- input输入框 -->
          <el-input placeholder="查询商品" v-model="allSet.query" class="input-with-select" clearable @clear="reLoad">
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </div>
        <!-- 添加用户按钮 -->
        <el-button type="primary">添加用户</el-button>
      </div>
    <!-- ---------------------------------------------------------------- -->
    <!-- 表格区域 -->
    <template>
      <el-table :data="goodsList" stripe style="width: 100%" border :height="changeH?700:375">
        <el-table-column prop="goods_id" label="#" width="50" type="index">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" fit>
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="121">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品质量" width="95">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="address" label="操作" width="200">
          <template slot-scope="rowData">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="delGoodies(rowData.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="allSet.pagenum"
      :page-sizes="[5, 10, 20, 50]" :page-size="allSet.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用来存储商品数据列表的数组
      goodsList: [],
      // 存储分页数据的参数
      allSet: {
        query: '',
        pagenum: 1, // 当前页
        pagesize: 5 // 每页显示条数
      },
      // 总条数
      total: 0,
      // 用来控制table高度
      changeH: false
    }
  },

  created () {
    this.getGoodsList()
  },
  filters: {
    dataFilter (date) {
      console.log(date)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDay().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      const second = date.getSeconds().toString().padStart(2, '0')
      return `${year}年${month}月${day}日 ${hour}:${minute}:${second}58`
    }
  },
  methods: {
    /// 获取商品列表的函数
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.allSet })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      if (res.data.goods.length === 0) return this.$message.warning('未查询到该商品')
      this.pagenum = res.data.pagenum
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    // 每页条数改变触发的函数
    handleSizeChange (num) {
      if (num >= 10) {
        this.changeH = true
      } else {
        this.changeH = false
      }
      this.allSet.pagesize = num
      this.getGoodsList()
    },
    // 分页栏页码发生改变触发的函数
    handleCurrentChange (num) {
      // console.log(num)
      this.allSet.pagenum = num
      this.getGoodsList()
    },
    // 点击查询按钮查询出相应的商品
    searchGoods () {
      if (this.allSet.query === '') return this.$message.error('请输入需要查询的商品！')
      this.allSet.pagenum = 1
      this.getGoodsList()
    },
    // 重置输入框时，触发的clear函数 重新渲染商品列表
    reLoad () {
      this.allSet.query = ''
      this.allSet.pagenum = 1
      this.allSet.pagesize = 5
      this.getGoodsList()
    },
    // 点击删除按钮，拿到商品id 删除商品 重新渲染数据  但是需要询问一下是否确定删除
    delGoodies (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(id)
        const { data: res } = await this.$http.delete('goods/' + id)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        this.getGoodsList()
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
    }
  }
}
</script>

<style scoped lang='less'>
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
  .el-card {
    overflow: auto;
    margin-top: 10px;
  }
  .el-table {
    max-width: 1637px;
    margin-top: 10px;
  }
</style>
