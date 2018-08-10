<template>
  <div class="named">
    <div class="top">
      <el-button type="primary" size="small" @click="_return">返回</el-button>
      <p>添加人员</p>
    </div>
    <div class="main">
      <el-tabs v-model="activeCard" @tab-click="handle">
        <el-tab-pane label="最近联系人" name="1"></el-tab-pane>
        <el-tab-pane label="通讯录" name="2"></el-tab-pane>
      </el-tabs>
      <el-input type="text" v-model="name" class="search" @keyup.enter.native="getList" >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <ul class="inser">
        <li v-for="item in listed" class="inset" @click="trans(item)">
          <img :src="item.avatar" alt="">
          <div class="mains">
            <p>{{item.name}}</p>
          </div>
          <div class="phone">
            <span>{{item.phone}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="page" v-show="pageShow">
      <span @click="first_page">首页</span>
      <span @click="last_page" v-show="pageIndex > 1">上一页</span>
      <span @click="next_page" v-show="nextPageShow">下一页</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { getAvatar } from '@/common/js/avatar.js'
  export default {
    data(){
      return{
        activeCard:'1',
        loading:false,
        name:'',
        listed:[],
        pageIndex:1,
        pageShow:true,
        nextPageShow:true
      }
    },
    methods:{
      ...mapMutations({
        setToken: 'SET_TOKEN',
        setComPersonList: 'SET_COM_PERSON_LIST',
      }),
      handle(){
        this.name= ''
        if(this.activeCard == 1){
          this.getList()
        }else{
          this.getPer()
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
      getList:function(){
        if(this.activeCard == 1){
          this.listed = []
          let param = new URLSearchParams()
          param.append('name',this.name)
          param.append('each',10)
          param.append('p',this.pageIndex)
          let str = this.$test('index.php/Mobile/payroll/get_recent_contact_list')
          this.$http.post(str,param)
            .then((res)=>{
              if(res.data.code ==0){
                res.data.data.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                  this.listed.push(item)
                })
              }
              if(this.listed.length < 10){
                this.nextPageShow = false
              }
            })
        }else{
          if(this.name){
            this.listed = []
            let param = new URLSearchParams()
            param.append('info',this.name)
            param.append('p',this.pageIndex)
            param.append('each',10)
            let str = this.$test('index.php/Mobile/worker/get_worker_info')
            this.$http.post(str,param)
              .then((res)=>{
                if(res.data.code == 0){
                  res.data.data.forEach((item)=>{
                    item.avatar = getAvatar(item.avatar)
                    this.listed.push(item)
                  })
                }
                if(this.listed.length < 10){
                  this.nextPageShow = false
                }
              })
          }else{
            this.getPer()
          }
        }
      },
      getPer(){
        this.listed = []
        let param = new URLSearchParams()
        param.append('order','d')
        param.append('p',this.pageIndex)
        param.append('each',10)
        let str = this.$test('index.php/Mobile/Find/nearby_worker_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.listed = res.data.data.nworker
              this.listed.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
              })
            }
            if(this.listed.length < 10){
              this.nextPageShow = false
            }
          })
      },
      trans(obj){
        this.$emit('transet',obj)
      },
      _return(){
        this.$parent.nameshow = false
        this.$parent.mainShow = true
        this.handle = ''
        this.listed = []

      }
    },
    created(){
      this.getList()
    },
    watch:{
      pageIndex(){
        this.getList()
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
  .named{
    width: 100%;
    position: relative;
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
    }
  }
  .inset{
    height: 60px;
    margin-top: 5px;
    background: #FFF;
    padding: 0 65px;
    cursor: default;
    display: block;
    border-bottom: 1px solid #DDDDDD;
    font-size: 14px;
    transition: .3s;
    box-shadow: none !important;
    overflow: hidden;
    margin-bottom: 3px;
    &:nth-child(even) {
      background: rgb(245, 247, 250);
    }
    &:hover {
      background: #EEEEEE;
    }
    img{
      width: 50px;
      margin-top: 5px;
      float: left;
    }
    .mains{
      width: 60px;
      float: left;
      background: none;
      margin-left: 10px;
      p{
        margin-top: 10px;
        height: 22px;
        text-align: center;
      }
    }
    .phone{
      width: 120px;
      float: left;
      height: 60px;
      margin-left: 35px;
      span{
        margin-top: 10px;
        display: block;
      }
    }
  }
  .inser{
    min-height: 700px;
  }
  .page {
    padding: 4px;
    text-align: center;
    background: #FFFFFF;
    margin-top: 5px;
    span {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        color: #409EFF;
      }
    }
  }
</style>
