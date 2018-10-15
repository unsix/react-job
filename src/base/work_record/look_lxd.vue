<template>
    <div>
      <div v-if="qk_note" class="qk_notes">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>工作联系单</p>
          <b v-show="this.approval_id > 0" @click="add_lxd">发起联系单</b>
        </div>
        <div class="main">
          <ul>
            <li v-for="item in qk_list" style="overflow: hidden;padding: 10px" @click="look_qk(item)">
              <p><span style="float: left">{{item.carse_content}}</span><span style="float: right">{{item.add_time}}</span></p>
            </li>
          </ul>
          <div class="page">
            <span @click="first_page">首页</span>
            <span @click="last_page" v-show="pageIndex > 1">上一页</span>
            <span @click="next_page" v-show="nextPageShow">下一页</span>
          </div>
        </div>
      </div>
      <comLxd v-if="com_lxd_show" :form_Lista="form_Lista" @return_psb="returnList"></comLxd>
      <div class="lxd_add" v-if="lxd_show">
        <div class="top" v-show="sign">
          <el-button type="primary" size="small" @click="_returned">返回</el-button>
          <p>工作联系单</p>
        </div>
        <addLxd v-if="lxd_show" class="qingkuan" :approval_id="approval_id" @return_exam="return_Add"></addLxd>
      </div>
    </div>
</template>

<script>
  import {getAvatar} from '@/common/js/avatar.js'
  import addLxd from '@/base/add_approval/add_lxd'
  import comLxd from '@/base/exam_form/lxd'
  export default {
    data(){
      return{
        pageIndex:1,
        nextPageShow:true,
        qk_list:[],
        qk_note:true,
        form_Lista:{},
        lxd_show:false,
        com_lxd_show:false,
        sign:true
      }
    },
    methods:{
      _return(){
        this.$emit('return_list')
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
      get_Data(){
        if(this.approval_id == 0){
          let param = new URLSearchParams()
          param.append('p',this.pageIndex)
          param.append('each',10)
          let str = this.$test('/index.php/Mobile/company/work_contact_message_list')
          this.$http.post(str,param)
            .then((res)=>{
              this.qk_list = res.data.data
              if(res.data.data.length < 10 ){
                this.nextPageShow = false
              }
            })
        }else{
          this.qk_list = []
          let param = new URLSearchParams()
          param.append('contract_id',this.approval_id)
          param.append('each',20)
          param.append('p',this.pageIndex)
          let str = this.$test('/index.php/Mobile/find/find_work_connect_list')
          this.$http.post(str,param)
            .then((res)=>{
              this.qk_list = res.data.data
              if(res.data.data.length < 10 ){
                this.nextPageShow = false
              }
            })
        }
      },
      look_qk(item){
        let param = new URLSearchParams()
        param.append('work_connect_id',item.work_connect_id)
        let str = this.$test('/index.php/Mobile/contract/look_work_connection')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.form_Lista = res.data.data
              if(this.form_Lista.main_send_info){
                this.form_Lista.main_send_info.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                })
              }
              if(this.form_Lista.part_send_info){
                this.form_Lista.part_send_info.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                })
              }
              this.qk_note = false
              this.com_lxd_show = true
            }else{
              this.$message.error(res.data.message)
            }
          })
      },
      returnList(){
        this.qk_note = true
        this.com_lxd_show = false
        this.get_Data()
      },
      add_lxd(){
        this.qk_note = false
        this.lxd_show = true
      },
      return_Add(){
        this.qk_note = true
        this.lxd_show = false
      },
      _returned(){
        this.qk_note = true
        this.lxd_show = false
      }
    },
    created(){
      this.get_Data()
    },
    props:{
      approval_id:{
        default:0
      }
    },
    components:{
      comLxd,
      addLxd
    }
  }
</script>

<style lang="scss">
  .qk_notes{
    width: 100%;
    min-height: 1000px;
    background: #FFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      display: flex;
      justify-content: center;
      .el-button {
        position: absolute;
        top: 7px;
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
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .main{
      li {
        padding: 5px;
        cursor: pointer;
        background: #ffffff;
        margin-bottom: 5px;
        color: #2D2F33;
        font-size: 14px;
        box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        border-bottom: 1px solid #DDDDDD;
        transition: .3s;
        &:first-child {
          border-bottom: 1px solid transparent;
          &:hover {
            background: none;
          }
        }
        &:nth-child(even) {
          background: rgb(245, 247, 250);
        }
        &:hover {
          background: #EEEEEE;
        }
      }

    }
  }
  .page {
    width: 100%;
    padding: 4px;
    text-align: center;
    span {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        color: #409EFF;
      }
    }
  }
  .lxd_add{
    background: #FFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      display: flex;
      justify-content: center;
      .el-button {
        position: absolute;
        top: 7px;
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
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .qingkuan{
      width: 96%;
      margin: 10px auto 0;
      background: #FFF;
      #picc{
        ul{
          li{
            width: 85px;
            height: 85px;
          }
        }
      }
      .el-upload--picture-card{
        width: 85px;
        height: 85px;
        .el-upload-list__item.is-success{
          width: 85px;
          height: 85px;
        }
      }
      .el-icon-plus{
        position: relative;
        top: -25px;
      }
      .upload-demo_a{
        margin-top: 20px;
      }
    }
  }

</style>
