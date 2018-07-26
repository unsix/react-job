<template>
  <div>
    <div class="chat">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>群消息列表</p>
        <b @click="showList">群列表</b>
      </div>
      <div class="main">
        <el-button>创建群组</el-button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    _return(){
      this.$parent.infoShow = true
      this.$parent.chatShow = false
    },
    showList(){
      let str = this.$test('/index.php/Mobile/personal/my_group_list')
      this.$http.post(str)
        .then((res)=>{
          if(res.data.code == 250){
            this.$message.error('暂无数据')
          }
        })
    },

  }
}
</script>

<style lang="scss">
.chat{
  width: 100%;
  .top{
    background: #FFf;
    border-bottom: 1px solid #e3e4e9;
    position: relative;
    .el-button{
      position: absolute;
      top: 8px;
      left: 5px;
      margin: 0 !important;
    }
    p{
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
    b{
      position: absolute;
      top: 13px;
      right: 13px;
      cursor: pointer;
      color: #6BB4EB;
    }
  }
}
</style>
