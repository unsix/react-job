<template>
  <div id="app">
    <top></top>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import top from '@/components/top/top'
export default {
  name: 'app',
  components:{
  	top
  }
}
</script>

<style scoped>
@import '/static/reset.css';
@import '/static/common.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "微软雅黑";
  min-width: 1200px;
}
</style>
