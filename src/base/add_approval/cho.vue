<template>
  <div>
    <div class="closed" v-if="closed_show">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <el-input v-model="search" @change="search_app" v-show="title != '工资'"></el-input>
        <p v-show="title == '工资'">工资条历史记录</p>
        <b @click="submit()">完成</b>
      </div>
      <div class="main">
        <el-checkbox-group v-for="(item,index) in list" v-model="ccCom" :key="index" v-if="title == '验收'">
          <el-checkbox :label="item">
            <div style="float: left;">
              <p>{{item.add_time}}</p>
              <p>类型：验收单</p>
              <p>标题：{{item.title}}</p>
              <p>审批进程：<span v-html="item.approval_state"></span></p>
            </div>
            <div style="margin:20px 165px;float: left">
              <el-button type="info" size="small"  @click="look(item)">查看</el-button>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-for="(item,index) in list" v-model="ccCom" :key="index" v-if="title == '结算'">
          <el-checkbox :label="item">
            <div style="float: left;">
              <p>{{item.add_time}}</p>
              <p>类型：结算单</p>
              <p>标题：{{item.title}}</p>
              <p>审批进程：<span v-html="item.approval_state"></span></p>
            </div>
            <div style="margin:20px 165px;float: left">
              <el-button type="info" size="small"  @click="look(item)">查看</el-button>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-for="(item,index) in list" v-model="ccCom" :key="index" v-if="title == '工资'">
          <el-checkbox :label="item">
            <div style="float: left;">
              <p>{{item.add_time}}</p>
              <p>{{item.name}}{{item.phone}}</p>
              <p>请款月份：{{item.month}}</p>
              <p>应付金额:{{item.pay_amount}}元</p>
              <p><span v-html="item.pryroll_status"></span></p>
            </div>
            <!--<div style="margin:20px 165px;float: left">-->
              <!--<el-button type="info" size="small"  @click="look(item)">查看</el-button>-->
            <!--</div>-->
          </el-checkbox>
        </el-checkbox-group>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
    </div>

    <ysd v-if="ysd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList"></ysd>
    <jsd v-if="jsd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></jsd>
  </div>
</template>

<script>
  import jsd from '@/base/exam_form/jsd'
  import ysd from '@/base/exam_form/ysd'
  import gzd from '@/base/exam_form/gzd'
  import {getPic} from '@/common/js/pic.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import { create_yanshoudan_list } from "@/common/js/approval/yanshoudan";
  import { create_approval_list } from '@/common/js/approval/approval_list'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        list:[],
        ccCom:[],
        ysd_if:false,
        jsd_if:false,
        gzd_if:false,
        form_Lista:{},
        form_Listb:{},
        closed_show:true,
        file_arr:[],
        nextPageShow: true,
        pageIndex: 1,
        search:''
      }
    },
    watch:{
      pageIndex(){
        if(this.title == '工资'){
          this.show_gz()
        }else{
          this.show_ys()
        }
      }
    },
    methods:{
      ...mapMutations({
        setToken: 'SET_TOKEN'
      }),
      choose(){
        switch (this.title) {
          case '验收':
          case '结算':
            this.show_ys()
            break;
          case '工资':
            this.show_gz()
            break;
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
      show_ys(){
        let param = new URLSearchParams
        param.append('company_id',this.nowCompanyId)
        param.append('type',2)
        param.append('status',1)
        if(this.title == '验收'){
          param.append('approval_type',12)
        }else{
          param.append('approval_type',14)
        }
        param.append('each',20)
        param.append('p',this.pageIndex)
        let str = this.$test("/index.php/Mobile/approval/select_approval")
        this.$http.post(str, param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                item.approval_state = get_state(item.approval_state)
                this.list.push(item)
              })
              if(res.data.data.length < 10){
                this.nextPageShow = false
              }
            }
          })
        function get_state(state){
          if(state === '0'){
            return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
          }else if(state === '1'){
            return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }else if(state === '2'){
            return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
          }else if(state === '3'){
            return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
          }
        }
      },
      show_gz(){
        let param = new URLSearchParams()
        param.append('each',20)
        param.append('p',this.pageIndex)
        let str = this.$test("/index.php/Mobile/payroll/get_payroll_choice_list")
        this.$http.post(str, param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                item.pryroll_status = get_state(item.pryroll_status)
                this.list.push(item)
              })
              if(res.data.data.length < 10){
                this.nextPageShow = false
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
            return '<span style="color:#67C23A">已确认<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }
        }
      },
      _return(){
        this.$parent.wrapper = true
        this.$parent.ys_list = []
        this.$parent.js_list = []
        this.$parent.gz_list = []
        this.ccCom = []
      },
      submit(){
        this.$parent.wrapper = true
        switch (this.title) {
          case '验收':
            this.$parent.ys_list = this.ccCom
            break;
          case '结算':
            this.$parent.js_list = this.ccCom
            break;
          case '工资':
            this.$parent.gz_list = this.ccCom
            break;
        }
      },
      look(item){
        this.closed_show = false
        if(this.title != '工资'){
          // this.ysd_if = true
          let param = new URLSearchParams();
          param.append("uid", this.user.uid);
          param.append("approval_id", item.approval_id);
          let str = this.$test("/index.php/Mobile/approval/approval_process_show")
          this.$http.post(str, param)
            .then((res)=>{
              if(this.title == '验收'){
                this.ysd_if = true
                this.form_Lista = create_yanshoudan_list(res.data.data)
              }else if(this.title == '结算'){
                this.jsd_if = true
                this.form_Lista = res.data.data
                this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
              }
            })
          let nparam = new URLSearchParams();
          nparam.append("uid", this.user.uid);
          nparam.append("approval_id", item.approval_id);
          nparam.append("company_id", item.company_id);
          let httpUrl = this.$test("/index.php/Mobile/approval/approval_process_personnel")
          this.$http.post(httpUrl, nparam)
            .then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              res.data.data.content.forEach((item, index) => {
                if(item.picture) {
                  let arr = []
                  let zparam = new URLSearchParams();
                  zparam.append("enclosure_id", item.picture);
                  let str = this.$test("/index.php/Mobile/approval/look_enclosure")
                  this.$http.post(str, zparam)
                    .then((res) => {
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      res.data.data.picture.forEach((item) => {
                        if(item != '') {
                          arr.push(getPic(item))
                        }
                      })
                    })
                  res.data.data.content[index].picture = arr
                }
                if(item.many_enclosure){
                  this.get_imgs(item.many_enclosure,item)
                  this.get_files(item.many_enclosure,item)
                }
                if(item.replys){
                  item.replys.forEach((pic)=>{
                    this.get_imgs(pic.many_enclosure,pic)
                    this.get_files(pic.many_enclosure,pic)
                  })
                }
              })
              if(res.data.data.supply){
                res.data.data.supply.forEach((item,index)=>{
                  this.get_imgs(item.many_enclosure,item)
                  this.get_files(item.many_enclosure,item)
                })
              }
              if(res.data.data.finance) {
                if(res.data.data.finance.finance_state === '1') {
                  res.data.data.finance.finance_state = '<span style="color:#67C23A">通过</span>'
                } else {
                  res.data.data.finance.finance_state = '<span style="color:#EB9E05" >未通过</span>'
                }
                let zparam = new URLSearchParams();
                zparam.append("enclosure_id", res.data.data.finance.receipt_pic);
                let str = this.$test("/index.php/Mobile/approval/look_enclosure")
                this.$http.post(str, zparam)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    let arr = []
                    res.data.data.picture.forEach((item) => {
                      if(item != '') {
                        arr.push(getPic(item))
                      }
                    })
                    this.$set(this.form_Listb, 're_pic', arr)
                  })
              }
              this.form_Listb = create_approval_list(res.data.data)
            })
        }
      },
      get_imgs(many_enclosure,info){
        if(!many_enclosure){
          return
        }
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams()
          param.append('enclosure_id',many_enclosure)
          let str = this.$test('/index.php/Mobile/approval/look_enclosure')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let arr = []
              res.data.data.picture.forEach((item)=>{
                if(item != ''){
                  arr.push(getAvatar(item))
                }
              })
              this.$set(info,'imgs',arr)
            })
        }else{
          many_enclosure.forEach((item)=>{
            if(item.type == 3){
              let param = new URLSearchParams()
              param.append('enclosure_id',item.contract_id)
              let str = this.$test('/index.php/Mobile/approval/look_enclosure')
              this.$http.post(str,param)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item)=>{
                    if(item != ''){
                      arr.push(getAvatar(item))
                    }
                  })
                  this.$set(info,'imgs',arr)
                })
            }
          })
        }
      },
      get_files(many_enclosure,info){
        if(!many_enclosure){
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item)=>{
          let arr =[]
          if(item.type == 4){
            let param = new URLSearchParams()
            param.append('attachments_id',item.contract_id)
            let str = this.$test('/index.php/Mobile/approval/look_attachments')
            this.$http.post(str,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let obj = {}
                let file_data = res.data.data
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                arr.push(obj)
              })
            this.$set(info,'files',arr)
          }
        })
      },
      get_img(many_enclosure) {
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams();
          param.append("enclosure_id", many_enclosure);
          let str = this.$test("/index.php/Mobile/approval/look_enclosure")
          this.$http.post(str, param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let arr = []
              res.data.data.picture.forEach((item) => {
                if(item != '') {
                  arr.push(getAvatar(item))
                }
              })
              // this.img_arr = arr
              this.$set(this.form_Lista, 'img_list', arr)
            })
        }else{
          many_enclosure.forEach((item) => {
            if(item.type === 3) {
              let param = new URLSearchParams();
              param.append("enclosure_id", item.contract_id);
              let str = this.$test("/index.php/Mobile/approval/look_enclosure")
              this.$http.post(str, param)
                .then((res) => {
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item) => {
                    if(item != '') {
                      arr.push(getAvatar(item))
                    }
                  })
                  // this.img_arr = arr
                  this.$set(this.form_Lista, 'img_list', arr)
                })
            }
          })
        }
      },
      get_file(many_enclosure) {
        this.file_arr = []
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item) => {
          if(item.type === 4) {
            let param = new URLSearchParams();
            param.append("attachments_id", item.contract_id);
            let str = this.$test("/index.php/Mobile/approval/look_attachments")
            this.$http.post(str, param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let obj = {}
                let file_data = res.data.data
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                this.file_arr.push(obj)
              })
          }
        })
      },
      returnList(){
        this.closed_show = true
        this.ysd_if = false
        this.jsd_if = false
      },
      search_app(){
        this.list = []
        if(this.title != '工资'){
          let param = new URLSearchParams
          param.append('company_id',this.nowCompanyId)
          param.append('type',2)
          param.append('status',1)
          param.append('select',this.search)
          if(this.title == '验收'){
            param.append('approval_type',12)
          }else{
            param.append('approval_type',14)
          }
          param.append('each',20)
          param.append('p',this.pageIndex)
          let str = this.$test("/index.php/Mobile/approval/select_approval")
          this.$http.post(str, param)
            .then((res)=>{
              if(res.data.code == 0){
                res.data.data.forEach((item)=>{
                  item.approval_state = get_state(item.approval_state)
                  this.list.push(item)
                })
                if(res.data.data.length < 10){
                  this.nextPageShow = false
                }
              }
            })
          function get_state(state){
            if(state === '0'){
              return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
            }else if(state === '1'){
              return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
            }else if(state === '2'){
              return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
            }else if(state === '3'){
              return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
            }
          }
        }
      }
    },
    props:{
      title:{},
    },
    created(){
      this.choose()
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ])
    },
    components:{
      ysd,
      jsd,
      gzd
    }
  }
</script>

<style lang="scss">
  .closed{
    background: white;
    min-height: 800px;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      display: flex;
      justify-content: center;
      .el-button {
        position: absolute;
        top: 10px;
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
      .el-input {
        width: 450px;
        margin: 5px auto 10px;
        text-align: center;
        font-weight: bolder;
      }
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
  }
  .el-checkbox-group{
    width: 90%;
    margin: 10px auto;
    .el-checkbox{
      >.el-checkbox__input{
        line-height: 6;
        vertical-align: top;
      }
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
</style>
