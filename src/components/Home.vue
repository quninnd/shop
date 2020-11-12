<template>
    <div class="home">
        <el-container>
            <!-- 头部 -->
            <el-header>
                <span class="logo">
                    <img src="../assets/img/heima.png" alt="" @click="toWel">
                    <span>电商后台管理系统</span>
                </span>
                <span>
                    <el-button @click="logOut" type="info">退出</el-button>
                </span>
            </el-header>
            <!-- 侧边栏 -->
            <el-container>
                <el-aside :width="collapseFlag?'60px':'200px'">
                    <div class="collapse" @click="collapse">|||</div>
                    <!-- 侧边栏的容器 -->
                    <el-menu :default-active="$route.path" :collapse-transition="false" :collapse="collapseFlag"
                        background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" router>
                                 <!-- 一级菜单 -->
                            <el-submenu v-for="(item,index) in rightsData" :key="item.id" :index="item.id.toString()">
                                <!-- 一级菜单的模板区域 -->
                                <template slot="title">
                                    <i class="iconfont" :class="iconArr[index]"></i>
                                    <span>{{item.authName}}</span>
                                </template>
                                <!-- 嵌套的二级菜单 -->
                                <el-menu-item :index="'/'+items.path" v-for="(items) in item.children" :key="items.id">
                                    <!-- 二级菜单模板区域 -->
                                    <template slot="title">
                                        <i class="el-icon-menu"></i>
                                        <span>{{items.authName}}</span>
                                    </template>
                                </el-menu-item>
                            </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 主体区域 -->
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>

</template>

<script>
export default {
  data () {
    return {
      // 存储的菜单数据
      rightsData: [],
      iconArr: ['icon-user', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      // 控制菜单折叠的flag
      collapseFlag: false
    }
  },

  async created () {
    // 里面保存了路由相关的信息，其中包括params query
    // console.log(this.$route)
    const { data: res } = await this.$http.get('menus')
    // console.log(res)
    if (res.meta.status !== 200) return this.$message.error('获取权限菜单栏失败')
    this.rightsData = res.data
    // console.log(res.data)
  },

  methods: {
    // 退出功能
    logOut () {
      this.$router.push('/')
    },
    // 控制菜单折叠
    collapse () {
      this.collapseFlag = !this.collapseFlag
    },
    // 点击图片跳转到welcome页面的函数
    toWel () {
    //   location.assign('http://localhost:8080/#/welcome')
      this.$router.push('/welcome')
    }
  }
}
</script>

<style scoped lang='less'>
    .home {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .el-container {
        height: 100%;
    }

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #373d41;
    }

    .logo {
        display: flex;
        align-items: center;
    }

    .logo span {
        color: #eee;
        margin-left: 15px;
        font-size: 20px;
    }

    .logo img {
        cursor: pointer!important;
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #eaedf1;
    }
    .el-menu {
        user-select: none;
        border-right: 0;
    }
    .iconfont {
        margin-right: 8px!important;
    }
    .collapse {
        user-select: none;
        text-align: center;
        height: 25px;
        line-height: 25px;
        letter-spacing: 0.2em;
        cursor: pointer;
        color: #eee;
        background-color: #4A5064;
    }
</style>
