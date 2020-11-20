<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 800px; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {

    }
  },

  created () {

  },

  methods: {

  },
  mounted () {
    var myChart = echarts.init(document.getElementById('main'))
    var option = {
      title: {
        text: '2020年总销售量'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['冰丝内裤', '袜子', '鞋子', '裤子', '衣服']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    myChart.setOption(option)
  }
}
</script>

<style scoped lang='less'>
.el-card {
  margin-top: 10px;
}
</style>
