<template>
  <div>
    <div class="main_qk">
      <div class="top">
        <el-button type="primary" size="small" @click="_return" v-show="!list_show">返回</el-button>
        <p>{{title}}</p>
        <b @click="show_his" v-show="title!= '历史记录' && title != '工资单详情'">历史记录</b>
      </div>
    </div>
    <div class="qk_list" v-show="list_show">
      <ul>
        <li v-for="item in list_type" @click="show_op(item)">{{item}}</li>
      </ul>
    </div>
    <div class="listMain">
      <ele v-if="ele_show" v-for="(item,idx) in add_ele" :todo="item" :key="idx" ref="ele" @submit_ele_son="submit_ele_son" :current="idx" :pages="add_ele.length"></ele>
      <lab v-if="lab_show" v-for="(item,idx) in add_lab" :todo="item" :key="idx" ref="lab" @submit_ele_son="submit_lab_son" :current="idx" :pages="add_lab.length"></lab>
      <fix v-if="fix_show" v-for="(item,idx) in add_fix" :todo="item" :key="idx" ref="fix" @submit_ele_son="submit_fix_son" :current="idx" :pages="add_fix.length"></fix>
    </div>
    <div class="buttons" v-show="buttonShow">
      <el-button type="primary" size="small" @click="add_from">添加</el-button>
      <el-button type="warning" size="small" @click="submit">发送</el-button>
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
    <div class="main">
      <detail_ele v-if="detail_ele_show" :content="detail_data" ></detail_ele>
      <detail_fix v-if="detail_fix_show" :content="detail_data"></detail_fix>
    </div>
    <loading v-show="loadingShow"></loading>
  </div>
</template>

<script>
  import ele from '@/base/person_qk/ele_work'
  import lab from '@/base/person_qk/labour'
  import fix from '@/base/person_qk/fixedWork'
  import detail_ele from '@/base/cost_detail/look_ele'
  import detail_fix from '@/base/cost_detail/look_fix'
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import loading from '@/base/loading/loading'
  import moment from 'moment'
  export default {
    data(){
      return{
        title:'个人请款单',
        list_show:true,
        list_type:['点工月工资请款单','个人劳务承包请款单','固定职工月工资请款单'],
        ele_show:false,
        lab_show:false,
        fix_show:false,
        add_ele:[{
          uid:'',
          name:'',
          phone:'',
          bank_name:'',
          bank_account:'',
          id_card:'',
          work_type:'',
          month:'',
          unit:'',
          amount:'',
          price:'',
          sanction_price:'',
          received_price:'',
          should_pay_price:'',
          thr_true_people:'',
          many_enclosure:[],
          fileList:[],
          fileList_a:[],
          confirm_uid:'',
          third_uid:'',
          once_month:''
        }],
        add_lab:[{
          uid:'',
          name:'',
          phone:'',
          bank_name:'',
          bank_account:'',
          id_card:'',
          work_type:'',
          month:'',
          unit:'',
          amount:'',
          price:'',
          sanction_price:'',
          received_price:'',
          should_pay_price:'',
          thr_true_people:'',
          many_enclosure:[],
          fileList:[],
          fileList_a:[],
          confirm_uid:'',
          third_uid:'',
          once_month:''
        }],
        add_fix:[{
          name:'',
          phone:'',
          bank_name:'',
          bank_account:'',
          once_month:'',
          all_day_price:'',
          phone_subsidy:'',
          house_subsidy	:'',
          base_life_pay:'',
          educate_pay:'',
          work_age_pay:'',
          profession_pay:'',
          environment_price:'',
          easy:'',
          overtime_pay:'',
          merit_ration:'',
          merit_pay:'',
          subsidy:'',
          total:'',
          social_security:'',
          personal_tax:'',
          absent_cost:'',
          house_cost:'',
          hydropower_cost:'',
          performance_deduction:'',
          performance_cost:'',
          cut_money:'',
          sum:'',
          month:'',
          many_enclosure:[],
          fileList:[],
          fileList_a:[],
          uid:''
        }],
        types:'',
        buttonShow:false,
        loadingShow:false,
        ele_items:[],
        lab_items:[],
        fix_items:[],
        pageIndex:'1',
        untreated:[],
        listShow:false,
        nextPageShow:true,
        detail_ele_show:false,
        detail_fix_show:false,
        detail_data:{},
      }
    },
    methods:{
      ...mapMutations({
        setUser: 'SET_USER',
        setToken: 'SET_TOKEN',
        setComPersonList: 'SET_COM_PERSON_LIST',
      }),
      show_op(pr){
        this.title = pr
        this.list_show = false
        this.buttonShow = true
        switch (pr) {
          case '点工月工资请款单':
            this.ele_show = true
            this.types = 'ele'
            break;
          case '个人劳务承包请款单':
            this.lab_show = true
            this.types = 'lab'
            break;
          case '固定职工月工资请款单':
            this.fix_show = true
            this.types = 'fix'
            break;
        }
      },
      show_his(){
        this.title = '历史记录'
        this.list_show = false
        this.ele_show = false
        this.lab_show = false
        this.fix_show = false
        this.buttonShow = false
        this.listShow = true
        this.get_Data()
      },
      get_Data(){
        this.untreated = []
        let param = new URLSearchParams()
        param.append('p',this.pageIndex)
        param.append('each',10)
        let str = this.$test('/index.php/Mobile/payroll/get_initiator_payroll_history')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              var arr = res.data.data
              if(arr.length > 0){
                arr.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                  item.month = moment(item.month).format('YYYY年MM月')
                  item.pryroll_status = get_state(item.pryroll_status)
                })
                this.untreated = arr
                if(this.untreated.length < 10){
                  this.nextPageShow =  false
                }
              }
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
      _getComPersonList(){
        let newparam = new URLSearchParams();
        newparam.append("company_id",this.nowCompanyId);
        let str = this.$test("/index.php/Mobile/user/get_company_personnel")
        this.$http.post(str,newparam)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            let reaDa=[]
            res.data.data.forEach((item)=>{
              item.avatar = getAvatar(item.avatar)
              reaDa.push(item)
            })
            this.setComPersonList(reaDa)
          })
      },
      add_from(){
        switch (this.types) {
          case 'ele':
            this.add_ele_once()
            break;
          case 'lab':
            this.add_lab_once()
            break;
          case 'fix':
            this.add_fix_once()
            break;
        }
      },
      add_ele_once(){
        let obj = {
          uid:'',
          name:'',
          phone:'',
          bank_name:'',
          bank_account:'',
          id_card:'',
          work_type:'',
          month:'',
          unit:'',
          amount:'',
          price:'',
          sanction_price:'',
          received_price:'',
          should_pay_price:'',
          thr_true_people:'',
          many_enclosure:[],
          fileList:[],
          fileList_a:[],
          confirm_uid:'',
          third_uid:'',
          once_month:''
        }
        this.add_ele.push(obj)
      },
      add_lab_once(){
        let obj = {
          uid:'',
          name:'',
          phone:'',
          bank_name:'',
          bank_account:'',
          id_card:'',
          work_type:'',
          month:'',
          unit:'',
          amount:'',
          price:'',
          sanction_price:'',
          received_price:'',
          should_pay_price:'',
          thr_true_people:'',
          many_enclosure:[],
          fileList:[],
          fileList_a:[],
          confirm_uid:'',
          third_uid:'',
          once_month:''
        }
        this.add_lab.push(obj)
      },
      add_fix_once(){
        let obj = {
          confirm_uid:'',
          third_uid:'',
          uid:'',
          name:'',
          phone:'',
          open_bank:'',
          open_account:'',
          id_number:'',
          once_month:'',
          full_day:'',
          message:'',
          room:'',
          basic:'',
          education:'',
          work_year:'',
          title:'',
          ambient:'',
          easy:'',
          overtime:'',
          performanced:'',
          subsidy:'',
          total:'',
          social:'',
          per_tax:'',
          lose_day:'',
          stay:'',
          hydro:'',
          deuction:'',
          withhold:'',
          cut_money:'',
          sum:''
        }
        this.add_fix.push(obj)
      },
      _return(){
        if(this.title == '工资单详情'){
          this.detail_ele_show = false
          this.detail_fix_show = false
          this.detail_data = {}
          this.listShow = true
          this.title = '历史记录'
        }else{
          if(this.types && this.title == '历史记录'){
            this.listShow = false
            this.buttonShow = true
            switch (this.types) {
              case 'ele':
                this.ele_show = true
                this.title = '点工月工资请款单'
                break;
              case 'lab':
                this.lab_show = true
                this.title = '个人劳务承包请款单'
                break;
              case 'fix':
                this.fix_show = true
                this.title = '固定职工月工资请款单'
                break;
            }
          }else if(this.types && this.title != '历史记录'){
            this.list_show = true
            this.ele_show = false
            this.lab_show = false
            this.fix_show = false
            this.title = '个人请款单'
            this.buttonShow = false
            this.listShow = false
            this.add_ele = [{
              name:'',
              phone:'',
              bank_name:'',
              bank_account:'',
              id_card:'',
              work_type:'',
              once_month:'',
              amount:'',
              unit:'',
              price:'',
              sanction_price:'',
              received_price:'',
              should_pay_price:'',
              thr_true_people:'',
              true_people:'',
              many_enclosure:[],
              fileList:[],
              fileList_a:[],
              uid:'',
              confirm_uid:'',
              third_uid:''
            }]
            this.add_lab = [{
              name:'',
              phone:'',
              bank_name:'',
              bank_account:'',
              id_card:'',
              work_type:'',
              once_month:'',
              amount:'',
              unit:'',
              price:'',
              sanction_price:'',
              received_price:'',
              should_pay_price:'',
              thr_true_people:'',
              true_people:'',
              many_enclosure:[],
              fileList:[],
              fileList_a:[],
              uid:'',
              confirm_uid:'',
              third_uid:''
            }]
            this.add_fix = [{
              name:'',
              phone:'',
              bank_name:'',
              bank_account:'',
              once_month:'',
              all_day_price:'',
              phone_subsidy:'',
              house_subsidy	:'',
              base_life_pay:'',
              educate_pay:'',
              work_age_pay:'',
              profession_pay:'',
              environment_price:'',
              easy:'',
              overtime_pay:'',
              merit_ration:'',
              merit_pay:'',
              subsidy:'',
              total:'',
              social_security:'',
              personal_tax:'',
              absent_cost:'',
              house_cost:'',
              hydropower_cost:'',
              performance_deduction:'',
              performance_cost:'',
              cut_money:'',
              sum:'',
              month:'',
              many_enclosure:[],
              fileList:[],
              fileList_a:[],
              uid:''
            }]
            this.types = ''
            this.ele_items = []
          }else{
            this.list_show = true
            this.ele_show = false
            this.lab_show = false
            this.fix_show = false
            this.title = '个人请款单'
            this.buttonShow = false
            this.listShow = false
            this.add_ele = [{
              name:'',
              phone:'',
              bank_name:'',
              bank_account:'',
              id_card:'',
              work_type:'',
              once_month:'',
              amount:'',
              unit:'',
              price:'',
              sanction_price:'',
              received_price:'',
              should_pay_price:'',
              thr_true_people:'',
              true_people:'',
              many_enclosure:[],
              fileList:[],
              fileList_a:[],
              uid:'',
              confirm_uid:'',
              third_uid:''
            }]
            this.add_lab = [{
              name:'',
              phone:'',
              bank_name:'',
              bank_account:'',
              id_card:'',
              work_type:'',
              once_month:'',
              amount:'',
              unit:'',
              price:'',
              sanction_price:'',
              received_price:'',
              should_pay_price:'',
              thr_true_people:'',
              true_people:'',
              many_enclosure:[],
              fileList:[],
              fileList_a:[],
              uid:'',
              confirm_uid:'',
              third_uid:''
            }]
            this.add_fix = [{
              name:'',
              phone:'',
              bank_name:'',
              bank_account:'',
              once_month:'',
              all_day_price:'',
              phone_subsidy:'',
              house_subsidy	:'',
              base_life_pay:'',
              educate_pay:'',
              work_age_pay:'',
              profession_pay:'',
              environment_price:'',
              easy:'',
              overtime_pay:'',
              merit_ration:'',
              merit_pay:'',
              subsidy:'',
              total:'',
              social_security:'',
              personal_tax:'',
              absent_cost:'',
              house_cost:'',
              hydropower_cost:'',
              performance_deduction:'',
              performance_cost:'',
              cut_money:'',
              sum:'',
              month:'',
              many_enclosure:[],
              fileList:[],
              fileList_a:[],
              uid:''
            }]
            this.types = ''
            this.ele_items = []
          }
        }
      },
      submit(){
        switch (this.types) {
          case 'ele':
            this.submit_ele()
            break;
          case 'lab':
            this.submit_lab()
            break;
          case 'fix':
            this.submit_fix()
            break;
        }
      },
      submit_ele(){
        this.loadingShow = true
        this.$refs.ele.forEach((item)=>{
          item.submit()
        })
      },
      submit_lab(){
        this.loadingShow = true
        this.$refs.lab.forEach((item)=>{
          item.submit()
        })
      },
      submit_fix(){
        this.loadingShow = true
        this.$refs.fix.forEach((item)=>{
          item.submit()
        })
      },
      submit_ele_son(res){
        this.ele_items.push(res)
      },
      submit_lab_son(res){
        this.lab_items.push(res)
      },
      submit_fix_son(res){
        this.fix_items.push(res)
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
    components:{
      ele,
      lab,
      fix,
      loading,
      moment,
      detail_ele,
      detail_fix
    },
    created(){
      this._getComPersonList()
    },
    watch:{
      pageIndex() {
        this.get_Data()
      },
      ele_items:{
        handler:function (newVal) {
          if(newVal.length == this.add_ele.length){
            let param = new URLSearchParams()
            param.append('items',JSON.stringify(newVal))
            param.append('type',2)
            let str = this.$test('/index.php/Mobile/payroll/add_payroll')
            this.$http.post(str,param)
              .then((res)=>{
                this.loadingShow = false
                this._return()
                if(res.data.code == 0){
                  this.$message.success('添加成功')
                }else{
                  this.$message.error(res.data.message)
                }
              })
          }
        },
        deep:true
        //深度监听
      },
      lab_items:{
        handler:function (newVal) {
          if(newVal.length == this.add_lab.length){
            let param = new URLSearchParams()
            param.append('items',JSON.stringify(newVal))
            param.append('type',3)
            let str = this.$test('/index.php/Mobile/payroll/add_payroll')
            this.$http.post(str,param)
              .then((res)=>{
                this.loadingShow = false
                this._return()
                if(res.data.code == 0){
                  this.$message.success('添加成功')
                }else{
                  this.$message.error(res.data.message)
                }
              })
          }
        },
        deep:true
      },
      fix_items:{
        handler:function (newVal) {
          if(newVal.length == this.add_fix.length){
            let param = new URLSearchParams()
            param.append('items',JSON.stringify(newVal))
            param.append('type',1)
            let str = this.$test('/index.php/Mobile/payroll/add_payroll')
            this.$http.post(str,param)
              .then((res)=>{
                this.loadingShow = false
                this._return()
                if(res.data.code == 0){
                  this.$message.success('添加成功')
                }else{
                  this.$message.error(res.data.message)
                }
              })
          }
        },
        deep:true
      }
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ]),
    },
  }
</script>

<style lang="scss">
.main_qk{
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
}
  .qk_list{
    margin-top: 3px;
    li {
      background: #FFF;
      padding: 0 20px;
      cursor: default;
      display: block;
      border-bottom: 1px solid #DDDDDD;
      font-size: 14px;
      transition: .3s;
      box-shadow: none !important;
      overflow: hidden;
      height: 35px;
      line-height: 35px;
      margin-bottom: 3px;
      &:nth-child(even) {
        background: rgb(245, 247, 250);
      }
      &:hover {
        background: #EEEEEE;
      }
    }
  }
  .listMain{
    overflow: hidden;
    background: #fff;
  }
.buttons{
  background: #FFF;
  padding:10px 0px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
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
</style>
