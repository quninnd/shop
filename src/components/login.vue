<template>
  <div class="hello">
    <h1>组件</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  * {
    margin: 0;
    padding: 0
  }
</style>
