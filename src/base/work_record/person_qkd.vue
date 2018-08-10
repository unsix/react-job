<template>
    <div>
      <div class="notice_person_qk">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>{{title}}</p>
        </div>
        <div class="listss" v-show="listShow">
          <ul>
            <li v-for="item in untreated" @click="get_detail(item)">
              <img :src="item.avatar" alt="">
              <div class="name">
                <p>{{item.name}}</p>
                <p>{{item.phone}}</p>
              </div>
              <div class="price">
                <p>请款月份：{{item.month}}</p>
                <p>应付金额：{{item.pay_amount}}</p>
              </div>
              <div class="status">
                <p>{{item.add_time}}</p>
                <p v-html="item.pryroll_status"></p>
              </div>
            </li>
          </ul>
          <div class="page">
            <span @click="first_page">首页</span>
            <span @click="last_page" v-show="pageIndex > 1">上一页</span>
            <span @click="next_page" v-show="nextPageShow">下一页</span>
          </div>
        </div>

        <detail_ele v-if="detail_ele_show" :content="detail_data" :handle="btn_show"></detail_ele>

        <detail_fix v-if="detail_fix_show" :content="detail_data" :handle="btn_show"></detail_fix>
      </div>

    </div>
</template>

<script>
  import {getAvatar} from '@/common/js/avatar.js'
  import moment from 'moment'
  import detail_ele from '@/base/cost_detail/look_ele'
  import detail_fix from '@/base/cost_detail/look_fix'
  export default {
    data(){
      return{
        pageIndex:1,
        untreated:[],
        nextPageShow:true,
        title:'工资条消息提醒',
        listShow:true,
        detail_ele_show:false,
        detail_fix_show:false,
        detail_data:{},
        types:'',
        btn_show:true
      }
    },
    methods:{
      get_data(){
        this.untreated = []
        let param = new URLSearchParams()
        param.append('p',this.pageIndex)
        param.append('each',10)
        let str = this.$test('/index.php/Mobile/payroll/get_message_payroll_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
                item.month = moment(item.month).format('YYYY年MM月')
                item.pryroll_status = get_state(item.pryroll_status)
                this.untreated.push(item)
              })
              if(this.untreated.length < 10){
                this.nextPageShow =  false
              }
            }else{
              this._return()
            }
          })
        function get_state(state){
          if(state === '0'){
            return '<span style="color:#409EFF">待处理<i class="el-icon-loading" style="margin-left:4px"></i></span>'
          }else if(state === '1'){
            return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }else if(state === '2'){
            return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
          }else if(state === '-1'){
            return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
          }else if(state === '99'){
            return '<span style="color:#67C23A">已完结<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }
        }
      },
      _return(){
        if(this.title == '工资单详情'){
          this.detail_ele_show = false
          this.detail_fix_show = false
          this.title = '工资条消息提醒'
          this.listShow = true
        }else{
          this.$parent.per_show = false
          this.$parent.mainShow = true
          this.untreated = []
        }
      },
      first_page() {
        this.pageIndex = 1
      },
      last_page() {
        this.nextPageShow = true
        --this.pageIndex
      },
      next_page() {
        ++this.pageIndex
      },
      get_detail(data){
        this.title = '工资单详情'
        this.listShow = false
        let param = new URLSearchParams()
        param.append('payroll_id',data.payroll_id)
        let str = this.$test('/index.php/Mobile/payroll/get_detail_payroll')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.detail_data = res.data.data
              var that = this
              change_Data(this.detail_data.type,that)
            }else{
              this.$message.error(res.data.message)
              this._return()
            }
          })
        function change_Data(pr,that) {
          switch (pr) {
            case '1':
              that.detail_fix_show = true
              break;
            case '2':
              that.detail_ele_show = true
              break;
            case '3':
              that.detail_ele_show = true
              break;
          }
        }
      }
    },
    created(){
      this.get_data()
    },
    components:{
      moment,
      detail_ele,
      detail_fix
    },
    watch:{
      pageIndex(){
        this.get_data()
      }
    }
  }
</script>

<style lang="scss">
  .notice_person_qk{
    width: 100%;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .listss{
      width: 100%;
      li{
        background: #FFF;
        margin-top: 5px;
        overflow: hidden;
        padding:5px 0px 5px 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        cursor: default;
        border-bottom: 1px solid #DDDDDD;
        transition: .3s;
        box-shadow: none !important;
        margin-bottom: 3px;
        &:nth-child(even) {
          background: rgb(245, 247, 250);
        }
        &:hover {
          background: #EEEEEE;
          cursor: pointer;
        }
        img{
          width: 50px;
          height: 50px;
          display: block;
          float: left;
        }
        .name{
          width: 120px;
          float: left;
          margin: 0 20px;
          line-height: 20px;
        }
        .price{
          width: 180px;
          float: left;
          margin: 0 20px;
        }
      }
      .page {
        padding: 4px;
        text-align: center;
        background: #FFFFFF;
        span {
          cursor: pointer;
          font-size: 12px;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }
</style>
