<template>
  <div>
    <div class="pay">
      <div class="top">
        <p>我的账户</p>
      </div>
      <div class="pay_main">
        <div class="bent">
          <el-radio-group v-model="pay_off" >
            <el-radio-button v-for="(item,index) in moneys" :key="index" :label="item">{{item}}</el-radio-button>
          </el-radio-group>
        </div>
        <el-button class="btn" type="primary" @click="send_pay">充值</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      moneys:['50','100','200','500','1000','其他'],
      pay_off:''
    }
  },
  methods:{
    send_pay(){
      if(!this.pay_off){
        this.$message.warning('请选择其中一项')
      }else{
        let param = new URLSearchParams()
        param.append('money',this.pay_off)
        this.$http.post('index.php/Mobile/Alisun/recharge',param)
          .then((res)=>{
            console.log(res)
          })
      }
    }
  },
  created(){
    if(!localStorage.user){
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss">
.pay{
  width: 100%;
  .top{
    background: #fff;
    position: relative;
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
    }
  }
  .pay_main{
    margin-top: 5px;
    overflow: hidden;
    background: #FFf;
    .bent{
      display: flex;
      display: -webkit-flex;
      justify-content:center;
      align-items:center;
      flex-wrap:wrap;
      padding-bottom: 20px;
      .el-radio-button{
        padding: 25px 30px 0px 30px;
        span{
          width: 120px;
          border-radius: 4px;
        }
      }
      .el-radio-button__inner{
        border-left: 1px solid #D6D9E3;
      }
    }
    .btn{
      width: 90%;
      display: block;
      margin: 10px auto 20px;
    }
  }
}
</style>
