<template>
  <div>
    <div class="like" v-show="likeShow">
      <div class="top">
        <el-button type="primary" class="btn" size="small" @click="_remain" plain >返回</el-button>
        <p class="title">工作记录</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      likeShow: false
    }
  },
  methods:{
    _remain(){
      this.$parent.mainShow = true
      this.likeShow = false
    }
  }
}
</script>

<style lang="scss">
.like{
  width: 100%;
  height: 400px;
  margin-top: 3px;
  .top{
    background: #fff;
    overflow: hidden;
    text-align: center;
    .btn{
      margin: 10px 15px;
      float: left;
    }
    p{
      width: 440px;
      float: left;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
  }
}
</style>
