<template>
  <div>
    <div class="company">
      <div class="top">
        <p>公司列表</p>
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
      _get_company(){
        let param = new URLSearchParams()

      }
    },
    created(){
      this._get_company()
    }
  }
</script>

<style lang="scss">
  .company{
    width: 100%;
    .top{
      position: relative;
      background: #Fff;
      p{
        text-align: center;
        font-size: 18px;
        font-weight: bolder;
        padding: 20px 0;
      }
      .el-button--success{
        position: absolute;
        top: 13px;
        right: 15px;
      }
    }
  }

</style>
