<template>
  <div class="list">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 表格 -->
      <template>
        <el-table :data="rightsList" stripe style="width: 100%" border highlight-current-row>
          <el-table-column prop="date" label="#" width="50" type="index"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="date" label="权限等级">
            <template slot-scope="rowData">
              <el-tag v-if="rowData.row.level==0">一级</el-tag>
              <el-tag v-else-if="rowData.row.level==1" type="warning">二级</el-tag>
              <el-tag v-else-if="rowData.row.level==2" type="success">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 存储所有权限list的数组
      rightsList: []
    }
  },

  created () {
    this.getRightsList()
  },

  methods: {
    // 获取权限列表的函数
    async getRightsList () {
      const { data: res } = await this.$http.get('/rights/list')
      console.log(res.data)
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped lang='less'>
.el-card {
  margin-top: 10px;
}
</style>
