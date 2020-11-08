<template>
  <div class="home">
    <h1>这是homo界面</h1>
    <el-button @click="logOut" type="primary">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  created () {

  },

  methods: {
    logOut () {
      sessionStorage.removeItem('token')
      this.$router.push('/')
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
</style>
