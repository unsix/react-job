<template>
    <div>
      <div v-show="form_show">
        <el-form :model="lxd_ruleForm" :rules="lxd_rules" ref="lxd_ruleForm" label-width="150px" class="demo-cpj_ruleForm">
          <el-form-item label="工程名称" prop="project_name">
            <el-input v-model="lxd_ruleForm.project_name"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="num">
            <el-input v-model="lxd_ruleForm.num"></el-input>
          </el-form-item>
          <el-form-item label="事由" prop="carse_content">
            <el-input v-model="lxd_ruleForm.carse_content"></el-input>
          </el-form-item>
          <div class="cs_listed">
            <div>主送人<i class="el-icon-circle-plus" @click="add_zs"></i></div>
            <ul>
              <li v-for="(item,index) in zs_list">
                <img width="30px" :src="item.avatar" alt=""><span>{{item.name}}</span><i @click="deletesd(index,zs_list)" class="el-icon-close"></i>
              </li>
            </ul>
            <div>抄送人<i class="el-icon-circle-plus" @click="add_bxd"></i></div>
            <ul>
              <li v-for="(item,index) in cs_list">
                <img width="30px" :src="item.avatar" alt=""><span>{{item.name}}</span><i @click="deletesd(index,cs_list)" class="el-icon-close"></i>
              </li>
            </ul>
          </div>
          <el-form-item label="事宜" prop="detail_content">
            <el-input v-model="lxd_ruleForm.detail_content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm_cpj('lxd_ruleForm')">立即添加</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="cs" v-show="cs_show">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>{{title}}</p>
          <b @click="submit">完成</b>
        </div>
        <div class="main">
          <el-input type="text" v-model="name" class="search" @keyup.enter.native="getList" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-checkbox-group v-for="(item,index) in nearList" v-model="ccCom" :key="index" style="overflow: hidden;padding: 10px 0">
            <el-checkbox :label="item" >
              <div class="head" style="float: left;overflow: hidden">
                <img :src="item.avatar" alt="">
              </div>
              <div class="desc" style="margin-left: 20px;float: left">
                <p>{{item.name}}</p>
                <p>{{item.phone}}</p>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="page" v-show="pageShow">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
      <loading v-show="loadingShow"></loading>
    </div>
</template>

<script>
  import { getAvatar } from '@/common/js/avatar.js'
  import loading from '@/base/loading/loading'
  export default {
    data(){
      return{
        lxd_ruleForm:{
          project_name:'',
          contract_request_id:'',
          approval_contract_id:'',
          main_send_uids:[],
          inessential_send_uids:[],
          carse_content:'',
          detail_content:'',
          num:''
        },
        lxd_rules:{
          project_name: [{
            required: true,
            message: '请填写工程名称',
            trigger: 'change'
          }],
          num: [{
            required: true,
            message: '请填写编号',
            trigger: 'blur'
          }],
          carse_content: [{
            required: true,
            message: '请填写事由',
            trigger: 'blur'
          }],
        },
        form_show:true,
        cs_show:false,
        pageIndex:1,
        pageShow:true,
        nextPageShow:true,
        name:'',
        title:'',
        nearList:[],
        ccCom:[],
        zs_list:[],
        cs_list:[],
        loadingShow:false
      }
    },
    methods:{
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
      add_bxd(){
        if(this.$parent.sign){
          this.$parent.sign = false
        }
        this.getdata()
        this.form_show = false
        this.cs_show = true
        this.title = '选择抄送人'
      },
      getList(){},
      add_zs(){
        if(this.$parent.sign){
          this.$parent.sign = false
        }
        this.getdata()
        this.form_show = false
        this.cs_show = true
        this.title = '选择主送人'
      },
      _return(){
        if(!this.$parent.sign){
          this.$parent.sign = true
        }
        this.form_show = true
        this.cs_show = false
        this.title = ''
        this.ccCom = []
      },
      getdata(){
        this.nearList = []
        let param = new URLSearchParams()
        param.append('order','d')
        param.append('each',10)
        param.append('p',this.pageIndex)
        let str = this.$test('/index.php/Mobile/Find/nearby_worker_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.nworker.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
                this.nearList.push(item)
              })
            }
          })
      },
      submit(){
        if(this.title == '选择主送人'){
          this.zs_list = this.ccCom
          this._return()
        }else{
          this.cs_list = this.ccCom
          this._return()
        }
      },
      deletesd(pr,data){
        data.splice(pr,1)
      },
      submitForm_cpj(formName){
        if(this.approval_id){
          this.lxd_ruleForm.contract_request_id = this.approval_id
        }
        // console.log(this.approval_id,contract_request_id)
        this.loadingShow = true
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.zs_list.length > 0 ){
              this.zs_list.forEach((item)=>{
                this.lxd_ruleForm.main_send_uids.push(item.uid)
              })
            }
            if(this.cs_list.length > 0 ){
              this.cs_list.forEach((item)=>{
                this.lxd_ruleForm.inessential_send_uids.push(item.uid)
              })
            }
            this.cpj_submit()
          } else {
            this.$message.error('请将表单填写完整');
            this.loadingShow = false
            return false;
          }
        });
      },
      add_ok() {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        });
      },
      add_fail() {
        this.$message({
          showClose: true,
          message: '添加失败',
          type: 'error'
        });
      },
      cpj_submit(){
        let param = new URLSearchParams()
        param.append('carse_content',this.lxd_ruleForm.carse_content)
        param.append('inessential_send_uids',JSON.stringify(this.lxd_ruleForm.inessential_send_uids))
        param.append('detail_content',this.lxd_ruleForm.detail_content)
        param.append('main_send_uids',JSON.stringify(this.lxd_ruleForm.main_send_uids))
        param.append('num',this.lxd_ruleForm.num)
        param.append('project_name',this.lxd_ruleForm.project_name)
        param.append('contract_request_id',this.lxd_ruleForm.contract_request_id)
        let str = this.$test('/index.php/Mobile/contract/add_work_connection')
        this.$http.post(str,param)
          .then((res)=>{
            this.loadingShow = false
            if(res.data.code == 0){
              this.add_ok()
              this.$emit('return_exam')
            }else{
              this.add_fail()
            }
          })

      }
    },
    props:{
      approval_id:{}
    },
    components:{
      loading
    },
    watch:{
      pageIndex(){
        this.getdata()
      }
    }
  }
</script>

<style lang="scss">
  .cs {
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
    .main {
      width: 100%;
      .el-tabs__nav {
        background: #FFFFFF;
        width: 100% !important;
      }
      .el-tabs__header {
        margin-bottom: 5px;
      }
      .el-tabs__active-bar {
        width: 50% !important;
      }
      .el-tabs__item {
        font-weight: 700;
        font-size: 15px;
        width: 50%;
        text-align: center;
      }
      .search{
        width: 80%;
        padding-left: 10%;
        margin: 10px auto;
      }
      .el-button{
        padding: 31px 13px;
      }
      .el-checkbox-group{
        width: 90%;
        margin: 10px auto;
        padding: 0;
        .el-checkbox{
          >.el-checkbox__input{
            line-height: 4;
            vertical-align: top;
          }
        }

      }
    }
  }
  .cs_listed{
    width: 65%;
    margin: 0 auto;
    font-size: 14px;
    >div{
      margin: 30px 0;
      i{
        float: right;
        cursor: pointer;
      }
    }
    ul{
      margin: 5px 10px;
      li{
        border-bottom: 1px solid #878d99;
        padding: 4px 0;
        overflow: hidden;
        img{
          margin-left: 30px;
          float: left;
        }
        span{
          line-height: 30px;
          margin-left: 15px;
        }
        i{
          float: right;
          line-height: 30px;
          cursor: pointer;
          &hover{
            color: #FA5555;
          }
        }
      }
    }
  }
</style>
