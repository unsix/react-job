<template>
  <div>
    <div class="account" v-show="account">
      <div class="top">
        <p>我的账户</p>
        <b @click="look_record">提现记录</b>
      </div>
      <div class="ac_main">
        <div class="ac_cash">
          <div>
            <p class="zsp">账户</p>
            <p>{{balance}}</p>
          </div>
          <span>提示:未完结的工程预付款是不能提现的哦，工程完结后才可以提现，您现在可提现金额:￥{{cash_amount}}</span>
          <el-button class="btn" @click="forward" type="primary">申请提现</el-button>
        </div>
        <div class="ac_list">
          <ul>
            <li v-for="item in order_list" @click="look_detail(item.order_sn,item.amount_type)">
              <div class="mon">
                {{item.amount_type}}￥{{item.amount}}
              </div>
              <div class="det">
                <span>{{item.addtime}}</span>
                <span>{{item.body}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="record">

    </div>

    <div class="ac_detail" v-show="detail">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>交易记录详情</p>
      </div>
      <div class="main">
        <ul>
          <li v-for="item in detail_list">
            <div class="mon">
              {{item.amount_type}}￥{{item.amount}}
            </div>
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
            <div class="det">
              <span>{{item.name}}</span>
              <span>{{item.body}}</span>
              <span>{{item.add_time}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {getAvatar} from '@/common/js/avatar.js'
export default {
  data(){
    return{
      balance:'',
      cash_amount:'',
      order_list:[],
      account:true,
      detail:false,
      detail_list:[]
    }
  },
  methods:{
    _get_money(){
      let str = this.$test('/index.php/Mobile/Myinfo/money')
      this.$http.post(str)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            this.balance = res.data.data.withdraw
            this.cash_amount = res.data.data.withdraw - res.data.data.no_withdraw
          }
        })
    },
    _get_order(){
      let str = this.$test('/index.php/Mobile/order/get_all_order')
      this.$http.post(str)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              if(item.amount_type == 0){
                item.amount_type = '-'
              }else{
                item.amount_type = '+'
              }
              this.order_list.push(item)
            })
          }
        })
    },
    look_record(){
      let str = this.$test('/index.php/Mobile/Myinfo/withdraw_recording')
      this.$http.post(str)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            if(!res.data.data){
              this.$message.error('没有数据')
            }
          }
        })
    },
    forward(){
      this.$prompt('请输入提现金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern:/^[0-9]+([.]{1}[0-9]{1,2})?$/,
        inputErrorMessage:'只能输入数字，且为小数点后两位',
        inputPlaceholder:`最高提现金额为${this.cash_amount}元`
      }).then(({value})=>{
        let str = this.$test('/index.php/Mobile/myinfo/withdraw')
        let param = new URLSearchParams()
        param.append('money',value)
        this.$http.post(str,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(res.data.code == 0){
              this.$message.success(res.data.message)
              this._get_money()
              this._get_order()
            }else{
              this.$message.warning(res.data.message)
            }
          })
      }).catch(()=>{
        this.$message.warning('取消提现')
      })
    },
    look_detail(pr,re){
      this.detail_list = []
      re = (re == '+')? 1 : 0
      let param = new URLSearchParams()
      param.append('order_num',pr)
      param.append('amount_type',re)
      let str = this.$test('/index.php/Mobile/order/get_pay_detail')
      this.$http.post(str,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            this.detail = true
            this.account = false
            res.data.data.forEach((item)=>{
              item.amount_type = (item.amount_type == 0) ? '-' : '+'
              item.avatar = getAvatar(item.avatar)
              this.detail_list.push(item)
            })
          }
        })
    },
    _return(){
      this.detail = false
      this.account = true
    }
  },
  created(){
    if(!localStorage.user){
      this.$router.push({ path: '/login' })
    }
    this._get_money()
    this._get_order()
  },
  mounted(){
    if(this.$route.path === '/work/account') {
      this.$emit('changeWorkIndex', '5-3')
    }
  }
}
</script>

<style lang="scss">
.account{
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
  .ac_main{
    margin-top: 5px;
    overflow: hidden;
    background: #FFf;
    .ac_cash{
      >div{
        overflow: hidden;
        text-align: center;
        .zsp{
          font-size: 25px;
          margin-top: 20px;
          letter-spacing: 15px;
          margin-left: 15px;
        }
        p{
          font-size: 20px;
          margin-top: 10px;
        }
      }
      >span{
        font-size: 14px;
        margin-top: 10px;
        display: inline-block;
      }
      >.btn{
        width: 90%;
        display: block;
        margin: 25px auto 0;
      }
    }
    .ac_list{
      width: 80%;
      margin: 20px auto;
      ul{
        height: 600px;
        overflow-y: auto;
        border: 1px solid #e3e4e9;
        li{
          cursor: pointer;
          display: block;
          height: 40px;
          border-bottom: 1px solid #DDDDDD;
          /*font-size: 14px;*/
          transition: .3s;
          &:nth-child(even) {
            background: rgb(245, 247, 250);
          }
          &:hover {
            background: #EEEEEE;
          }
          >.mon{
            width: 150px;
            float: left;
            color: red;
            font-size: 20px;
            line-height: 40px;
          }
          >.det{
            float: left;
            span{
              margin-top: 3px;
              display: block;
            }
          }
        }
      }
    }
  }

}
.ac_detail{
  width: 100%;
  background: #fff;
  .top{
    position: relative;
    border-bottom: 1px solid #e3e4e9;
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
  }
  .main{
    overflow: hidden;
    ul{
      width: 90%;
      height: 600px;
      margin: 0 auto;
      overflow-y: auto;
      padding: 0 5%;
      li{
        cursor: pointer;
        display: block;
        height: 60px;
        border-bottom: 1px solid #DDDDDD;
        /*font-size: 14px;*/
        transition: .3s;
        &:nth-child(even) {
          background: rgb(245, 247, 250);
        }
        &:hover {
          background: #EEEEEE;
        }
        >.mon{
          width: 120px;
          float: left;
          color: red;
          font-size: 20px;
          line-height: 60px;
          margin-left: 10px;
        }
        >.avatar{
          display: inline-block;
          float: left;
          padding: 10px;
          width: 60px;
          img {
            width: 40px;
            height: 40px;
            display: block;
            border-radius: 50%;
          }
        }
        >.det{
          float: left;
          font-size: 14px;
          span{
            margin-top: 4px;
            display: block;
          }
        }
      }
    }
  }
}
</style>
