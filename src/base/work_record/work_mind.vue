<template>
  <div class="work_mind">
    <div v-show="mainShow">
      <div class="top">
        <p>消息提醒</p>
      </div>
      <ul class="zhuti">
        <li @click="record_mind">
          <el-badge :value="obj1.unread_num" class="item">
            <span><i class="el-icon-edit"></i></span>
          </el-badge>
          <span>日志提醒</span>
          <span v-show="rec">您有{{obj1.unread_num}}篇日志需要点评</span>
        </li>
        <li @click="reply" >
          <el-badge :value="obj2.unread_num" class="item">
            <span><i class="iconfont icon-xiaoxi"></i></span>
          </el-badge>
          回复我的
          <span v-show="sce">({{obj2.name}} 回复: {{obj2.description}})</span>
        </li>
        <li @click="like_me">
          <el-badge :value="obj3.unread_num" class="item">
            <span><i class="iconfont icon-danzan"></i></span>
          </el-badge>
          我收到的赞
          <span v-show="scd">({{obj3.name}} 赞了我的工作)</span>
        </li>
        <li @click="my_record">
          <el-badge :value="obj4.unread_num" class="item">
            <span><i class="el-icon-edit-outline"></i></span>
          </el-badge>
          我发出的工作
          <span v-show="scf">({{obj4.name}}点评了我的日志:{{obj4.description}})</span>
        </li>
        <li>
          <el-badge :value="obj5.unread_num" class="item">
            <span><i class="iconfont icon-xiaoxi"></i></span>
          </el-badge>
          审批回复提醒
          <span v-show="approval">{{obj5.name}}回复了我的审批：{{obj5.description}}</span>
        </li>
        <li @click="show_qkd">
          <el-badge :value="obj6.unread_num" class="item">
            <span><i class="el-icon-bell"></i></span>
          </el-badge>
          工资请款确认单
          <span v-show="qkd">{{obj6.description}}</span>
        </li>
      </ul>
    </div>

    <mind ref="mind" v-show="mindShow"></mind>

    <reply ref="replys" v-show="replymeShow"></reply>

    <remy ref="remy" v-show="remyShow"></remy>

    <like ref="like" v-show="like_show"></like>

    <per v-if="per_show"></per>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import cc_per from '@/base/work_record/cc_per'
  import loading from '@/base/loading/loading'
  import mind from '@/base/work_record/mind'
  import reply from '@/base/work_record/replyMe'
  import remy from '@/base/work_record/remy'
  import like from '@/base/work_record/liked'
  import per from '@/base/work_record/person_qkd'
  export default {
    data(){
      return{
        list:[],
        mainShow : true,
        replymeShow:false,
        mindShow:false,
        remyShow: false,
        like_show: false,
        per_show:false,
        obj1:{
          name:'',
          unread_num:'',
          description:''
        },
        obj2:{
          name:'',
          unread_num:'',
          description:''
        },
        obj3:{
          name:'',
          unread_num:'',
          description:''
        },
        obj4:{
          name:'',
          unread_num:'',
          description:''
        },
        obj5:{
          name:'',
          unread_num:'',
          description:''
        },
        obj6:{
          name:'',
          unread_num:'',
          description:''
        },
        rec:true,
        sce:true,
        scd:true,
        scf:true,
        approval:true,
        qkd:true,
      }
    },
    methods:{
      ...mapMutations({
        setUser: 'SET_USER',
        setNowCompanyId: 'SET_NOWCOMPANY_ID',
        setComPersonList: 'SET_COM_PERSON_LIST',
        setComDepartList: 'SET_COM_DEPART_LIST',
        setComPartPersonList: 'SET_COM_PART_PERSON_LIST',
        setNowCompanyName: 'SET_NOWCOMPANY_NAME',
        setToken: 'SET_TOKEN',
        setUserState: 'SET_USERSTATE',
        setCompanyList: 'SET_COMPANYLIST',
      }),
      record_mind(){
        this.mainShow = false
        this.mindShow = true
        this.$refs.mind.mindShow = true
        this.$refs.mind.pageShow = true
        this.$refs.mind._get_mind()
      },
      reply(){
        this.mainShow = false
        this.replymeShow = true
        this.$refs.replys.replyShow = true
        this.$refs.replys.pageShow = true
        this.$refs.replys._get_reply()
      },
      my_record(){
        this.mainShow = false
        this.remyShow = true
        this.$refs.remy.myRecord = true
        this.$refs.remy.pageShow = true
        this.$refs.remy._get_return()
      },
      like_me(){
        this.mainShow = false
        this.like_show = true
        this.$refs.like.likedShow = true
        this.$refs.like.pageShow = true
        this.$refs.like._get_like_list()
      },
      show_qkd(){
        this.mainShow = false
        this.per_show = true
      },
      _get_notification_list(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        let httpUrl = this.$test('/index.php/Mobile/company/message_notification_list')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.list = res.data.data
            if(this.list.wait_reviewed == null){
              this.rec = false
              this.list.wait_reviewed = this.obj1
              this.obj1.unread_num = '0'
            }else{
              this.obj1.name = this.list.wait_reviewed.name
              this.obj1.unread_num = this.list.wait_reviewed.unread_num
              this.obj1.description = this.list.wait_reviewed.description
            }
            if(this.list.reply_me == null){
              this.sce = false
              this.list.reply_me = this.obj2
              this.obj2.unread_num = '0'
            }else{
              this.obj2.name = this.list.wait_reviewed.name
              this.obj2.unread_num = this.list.wait_reviewed.unread_num
              this.obj2.description = this.list.wait_reviewed.description
            }

            if(this.list.liked_me == null){
              this.scd = false
              this.list.liked_me = this.obj3
              this.obj3.unread_num = '0'
            }else{
              this.obj3.name = this.list.wait_reviewed.name
              this.obj3.unread_num = this.list.wait_reviewed.unread_num
              this.obj3.description = this.list.wait_reviewed.description
            }

            if(this.list.reviewed_me == null){
              this.scf = false
              this.list.reviewed_me = this.obj4
              this.obj4.unread_num = '0'
            }else{
              this.obj4.name = this.list.wait_reviewed.name
              this.obj4.unread_num = this.list.wait_reviewed.unread_num
              this.obj4.description = this.list.wait_reviewed.description
            }
            if(this.list.reply_me_approval == null){
              this.approval = false
              this.list.reply_me_approval = this.obj5
              this.obj5.unread_num = '0'
            }else{
              this.obj5.name = this.list.reply_me_approval.name
              this.obj5.unread_num = this.list.reply_me_approval.unread_num
              this.obj5.description = this.list.reply_me_approval.description
            }
            if(this.list.salary_remind == null){
              this.qkd = false
              this.list.salary_remind = this.obj6
              this.obj6.unread_num = '0'
            }else{
              this.obj6.name = this.list.salary_remind.name
              this.obj6.unread_num = this.list.salary_remind.unread_num
              this.obj6.description = this.list.salary_remind.description
            }
          })
      },

    },
    computed:{
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ])
    },
    created(){
      this._get_notification_list()
    },
    mounted(){
      if(this.$route.path === '/work/workMind') {
        this.$emit('changeWorkIndex', '4-10')
      }
    },
    components:{
      cc_per,
      loading,
      mind,
      reply,
      remy,
      like,
      per
    },
    watch:{

    }
  }
</script>

<style lang="scss">
  .work_mind{
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
    .zhuti{
      background: #FFF;
      margin-top: 3px;
      li{
        cursor: default;
        display: block;
        border-bottom: 1px solid #DDDDDD;
        font-size: 14px;
        transition: .3s;
        box-shadow: none !important;
        overflow: hidden;
        height: 50px;
        line-height: 55px;
        margin-bottom: 3px;
        &:nth-child(even) {
          background: rgb(245, 247, 250);
        }
        &:hover {
          background: #EEEEEE;
        }
        .el-badge{
          width: 40px;
          height: 30px;
          text-align: center;
          line-height: 30px!important;
          border: 1px solid skyblue;
          border-radius: 10px;
          margin: 0 15px;
        }
      }
    }
  }
  .mind{
    width: 100%;
    background: #fff;
    overflow: hidden;
    margin-top: 3px;
    .top{
      overflow: hidden;
      text-align: center;
      .btn{
        margin: 10px 15px;
        float: left;
      }
      p{
        width: 440px;
        float: left;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
    .tab{
      width: 100%;
      height: 40px;
      overflow: hidden;
      background: #ffffff;
      .el-tabs__header{
        margin-bottom: 5px;
      }
      .el-tabs__active-bar {
        width: 50%;
      }
      .el-tabs__nav {
        width: 100%;
      }
      .el-tabs__item {
        font-size: 15px;
        font-weight: 700;
        width: 50%;
        text-align: center;
      }
    }
  }
  .main_wei {
    width: 100%;
    ul {
      list-style: none;
      background: #D8D8D8;
      overflow: hidden;
      li {
        background: #ffffff;
        margin-bottom: 5px;
        /*margin-top: 5px;*/
        overflow: hidden;
        oz-box-shadow: 1px 1px 2px #999999;
        -webkit-box-shadow: 1px 1px 2px #999999;
        box-shadow: 1px 1px 2px #999999;
        .main {
          overflow: hidden;
          .avatar {
            width: 80px;
            height: 80px;
            margin-left: 15px;
            margin-top: 15px;
            float: left;
            border-radius: 100%;
            img {
              width: 80px;
              height: 80px;
              border-radius: 100%;
            }
          }
          .name {
            float: left;
            span {
              display: block;
              font-size: 20px;
              margin-top: 15px;
              margin-left: 15px;
            }
            .add_time {
              font-size: 18px;
            }
          }
          .stauts {
            width: 150px;
            float: right;
            overflow: hidden;
            margin-top: 15px;
            span {

            }
          }
        }
        .cc {
          .cs {
            display: inline-block;
            border: 1px solid #74c3ff;
            border-radius: 10px;
            padding: 8px 0;
            margin: 5px 0px 5px 15px;
            cursor: pointer;
            position: relative;
            span {
              text-align: center;
              padding: 0 9px;
              color: #74c3ff;
            }
            .cc_per{
              position: absolute;
              width: 250px;
              height: 200px;
              left: 95px;
              top: -40px;
              z-index: 9999;
              overflow: auto;
              border: 1px solid #DDDDDD;
              background: #DDDDDD;
              ul{
                >li{
                  cursor: default;
                  display: block;
                  border-bottom: 1px solid #DDDDDD;
                  font-size: 14px;
                  transition: .3s;
                  box-shadow: none !important;
                  margin-bottom: 0px !important;
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
                  .avatar {
                    vertical-align: top;
                    width: 40px;
                    float: left;
                    margin-left: 10px;
                    img {
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                    }
                  }
                  .name {
                    float: left;
                    width: 150px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    span{
                      color: black;
                    }
                  }
                }
              }
            }
          }
        }
        .bottom {
          .time {
            font-size: 18px;
            margin-left: 20px;
            padding: 5px 0;
            color: #686868;
          }
          .zuobiao{
            margin-left: 20px;
            background: #eeeeee;
            width: 550px;
            margin-top: 20px;
            border-radius: 10px;
            .icon-xiazai19{
              font-size: 18px;
              color: #86cafc;
            }
            span{
              padding: 10px 0;
              display: inline-block;
              margin-left: 10px;
            }
          }
          p {
            color: #686868;
            margin-left: 15px;
            span {
              margin-top: 5px;
              display: block;
              font-size: 16px;
            }
          }
          ul {
            margin-top: 0;
            background: #ffffff;
            li {
              margin-top: 5px;
              box-shadow: none;
              margin-bottom: 0;
            }
          }
        }
        .share {
          margin-top: 15px;
          background: #f5f7fd;
          padding-top: 10px;
          padding-bottom: 10px;
          overflow: hidden;
          .right {
            width: 350px;
            float: right;
            display: flex;
            display: -webkit-flex;
            span {
              flex-grow: 1;
              display: inline-block;
              cursor: pointer;
              text-align: center;
            }
          }
        }
      }
    }

  }
  .main_yi {
    width: 100%;
    ul {
      list-style: none;
      background: #D8D8D8;
      overflow: hidden;
      li {
        background: #ffffff;
        margin-bottom: 5px;
        /*margin-top: 5px;*/
        overflow: hidden;
        oz-box-shadow: 1px 1px 2px #999999;
        -webkit-box-shadow: 1px 1px 2px #999999;
        box-shadow: 1px 1px 2px #999999;
        .main {
          overflow: hidden;
          .avatar {
            width: 80px;
            height: 80px;
            margin-left: 15px;
            margin-top: 15px;
            float: left;
            border-radius: 100%;
            img {
              width: 80px;
              height: 80px;
              border-radius: 100%;
            }
          }
          .name {
            float: left;
            span {
              display: block;
              font-size: 20px;
              margin-top: 15px;
              margin-left: 15px;
            }
            .add_time {
              font-size: 18px;
            }
          }
          .stauts {
            width: 150px;
            float: right;
            overflow: hidden;
            margin-top: 15px;
            span {

            }
          }
        }
        .cc {
          .cs {
            display: inline-block;
            border: 1px solid #74c3ff;
            border-radius: 10px;
            padding: 8px 0;
            margin: 5px 0px 5px 15px;
            cursor: pointer;
            position: relative;
            span {
              text-align: center;
              padding: 0 9px;
              color: #74c3ff;
            }
            .cc_per{
              position: absolute;
              width: 250px;
              height: 200px;
              left: 95px;
              top: -40px;
              z-index: 9999;
              overflow: auto;
              border: 1px solid #DDDDDD;
              background: #DDDDDD;
              ul{
                >li{
                  cursor: default;
                  display: block;
                  border-bottom: 1px solid #DDDDDD;
                  font-size: 14px;
                  transition: .3s;
                  box-shadow: none !important;
                  margin-bottom: 0px !important;
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
                  .avatar {
                    vertical-align: top;
                    width: 40px;
                    float: left;
                    margin-left: 10px;
                    img {
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                    }
                  }
                  .name {
                    float: left;
                    width: 150px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    span{
                      color: black;
                    }
                  }
                }
              }
            }
          }
        }
        .bottom {
          .time {
            font-size: 18px;
            margin-left: 20px;
            padding: 5px 0;
            color: #686868;
          }
          .zuobiao{
            margin-left: 20px;
            background: #eeeeee;
            width: 550px;
            margin-top: 20px;
            border-radius: 10px;
            .icon-xiazai19{
              font-size: 18px;
              color: #86cafc;
            }
            span{
              padding: 10px 0;
              display: inline-block;
              margin-left: 10px;
            }
          }
          p {
            color: #686868;
            margin-left: 15px;
            span {
              margin-top: 5px;
              display: block;
              font-size: 16px;
            }
          }
          ul {
            margin-top: 0;
            background: #ffffff;
            li {
              margin-top: 5px;
              box-shadow: none;
              margin-bottom: 0;
            }
          }
        }
        .share {
          margin-top: 15px;
          background: #f5f7fd;
          padding-top: 10px;
          padding-bottom: 10px;
          overflow: hidden;
          .right {
            width: 350px;
            float: right;
            display: flex;
            display: -webkit-flex;
            span {
              flex-grow: 1;
              display: inline-block;
              cursor: pointer;
              text-align: center;
            }
          }
        }
      }
    }

  }
  .page {
    padding: 4px;
    text-align: center;
    background: #FFFFFF;
    margin-top: 4px;
    span {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        color: #409EFF;
      }
    }
  }
  .wide{
    width: 100%;
    z-index: 99;
    /*height: 3000px;*/
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
  }
  .add{
    z-index: 999;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -100px;
    ul {
      width: 200px;
      background: #FFFFFF;
      margin: 200px auto;
      padding: 10px;
      border-radius: 4px;
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      i {
        font-size: 20px;
        float: right;
        cursor: pointer;
        &:hover {
          color: #FA5555
        }
      }
      li {
        cursor: pointer;
        display: block;
        height: 24px;
        line-height: 24px;
        font-size: 15px;
        &:hover {
          color: #5A5E66;
        }
      }
    }
  }
  .send{
    width: 450px;
    background: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -270px;
    margin-top: -75px;
    z-index: 999;
    .close{
      display: block;
      width: 100%;
      overflow: hidden;
      text-align: center;
      .huifu{
        line-height: 53px;
        font-size: 16px;
      }
      i{
        float: right;
        font-size: 16px;
        margin: 20px 10px 0;
        cursor: pointer;
        border-radius: 100%;
        border: 1px solid black;
        color: #000;
      }
    }
    .el-textarea{
      display: block;
      width: 90%;
      margin: 0 auto;
    }
    .sr{
      overflow: hidden;
      display: block;
      margin-top: 10px;
      padding-bottom: 10px;
      #picc{
        position: relative;
        width: 70%;
        .el-upload-list__item{
          position: relative;
          top: 30px;
          left: 15px;
          width: 50px;
          height: 50px;
        }
        .el-upload{
          display: block;
        }
        .el-upload--picture-card{
          z-index: 999;
          position: absolute;
          left: 3px;
          top: 0px;
          width: 0px;
          height: 0px;
          margin-top: 12px;
          margin-left: 27px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
            z-index: 999;
          }
        }
      }
      #file{
        width: 70%;
        position: relative;
        .el-upload-list--text{
          position: relative;
          top: 0px;
          left: 15px;
          width: 100%;
        }
        .el-upload--text{
          width: 0px;
          height: 0px;
          margin-top: 40px;
          margin-left: 30px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
          }
        }
      }
      .el-button{
        padding: 4px 10px;
        float: right;
        margin-right: 20px;
        margin-top: 14px;
      }
    }
  }
  .sended{
    width: 450px;
    background: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -270px;
    margin-top: -75px;
    z-index: 999;
    .close{
      display: block;
      width: 100%;
      overflow: hidden;
      .huifu{
        line-height: 53px;
        font-size: 16px;
        margin-left: 50px;
      }
      i{
        float: right;
        font-size: 16px;
        margin: 20px 10px 0;
        cursor: pointer;
        border-radius: 100%;
        border: 1px solid black;
        color: #000;
      }
      .el-rate{
        width: 150px;
        float: left;
        line-height: 53px;
        text-align: center;
        .el-rate__item{
          line-height: 0px;
          margin: 0;
          i{
            margin: 3px;
            border: none;
            font-size: 18px;
          }
        }
      }
    }
    .el-textarea{
      display: block;
      width: 90%;
      margin: 0 auto;
    }
    .sr{
      overflow: hidden;
      display: block;
      margin-top: 10px;
      padding-bottom: 10px;
      #picc{
        position: relative;
        width: 70%;
        .el-upload-list__item{
          position: relative;
          top: 30px;
          left: 15px;
          width: 50px;
          height: 50px;
        }
        .el-upload{
          display: block;
        }
        .el-upload--picture-card{
          z-index: 999;
          position: absolute;
          left: 3px;
          top: 0px;
          width: 0px;
          height: 0px;
          margin-top: 12px;
          margin-left: 27px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
            z-index: 999;
          }
        }
      }
      #file{
        width: 70%;
        position: relative;
        .el-upload-list--text{
          position: relative;
          top: 0px;
          left: 15px;
          width: 100%;
        }
        .el-upload--text{
          width: 0px;
          height: 0px;
          margin-top: 40px;
          margin-left: 30px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
          }
        }
      }
      .el-button{
        padding: 4px 10px;
        float: right;
        margin-right: 20px;
        margin-top: 14px;
      }
    }
  }
  .more{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    margin-top: 3px;
    /*margin-bottom: 100px;*/
    .top{
      .btn{
        margin: 20px;
      }
      .title{
        display: block;
        text-align: center;
        font-size: 20px;
      }
    }
    .main{
      overflow: hidden;
      .avatar {
        width: 80px;
        height: 80px;
        margin-left: 15px;
        margin-top: 15px;
        float: left;
        img {
          width: 80px;
          height: 80px;
          border-radius: 100%;
        }
      }
      .name{
        float: left;
        span{
          display: block;
          font-size: 20px;
          margin-top: 15px;
          margin-left: 15px;
        }
        .add_time{
          font-size: 18px;
        }
      }
      .stauts{
        width: 150px;
        float: right;
        overflow: hidden;
        margin-top: 15px;
      }
    }
    .cc{
      .cs {
        display: inline-block;
        border: 1px solid #74c3ff;
        border-radius: 10px;
        padding: 8px 0;
        margin: 5px 0px 5px 15px;
        cursor: pointer;
        position: relative;
        span {
          text-align: center;
          padding: 0 9px;
          color: #74c3ff;
        }
        .cc_pers{
          position: absolute;
          width: 250px;
          height: 200px;
          left: 95px;
          top: -40px;
          z-index: 9999;
          overflow: auto;
          border: 1px solid #DDDDDD;
          background: #DDDDDD;
          ul{
            >li{
              cursor: default;
              display: block;
              border-bottom: 1px solid #DDDDDD;
              font-size: 14px;
              transition: .3s;
              box-shadow: none !important;
              overflow: hidden;
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
              .avatar {
                vertical-align: top;
                width: 40px;
                float: left;
                margin-left: 10px;
                img {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                }
              }
              .name {
                float: left;
                width: 150px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                span{
                  color: black;
                }
              }
            }
          }
        }
      }
    }
    .bottom{
      .time{
        font-size: 18px;
        margin-left: 20px;
        padding: 5px 0;
        color: #686868;
      }
      p{
        color: #686868;
        margin-left: 15px;
        span{
          margin-top: 5px;
          display: block;
          font-size: 16px;
        }
      }
      ul{
        margin-top: 0;
        background: #ffffff;
        li{
          margin-top: 5px;
          box-shadow: none;
          margin-bottom: 0;
        }
      }
      .zuobiao{
        margin-left: 20px;
        background: #eeeeee;
        width: 550px;
        margin-top: 20px;
        border-radius: 10px;
        .icon-xiazai19{
          font-size: 18px;
          color: #86cafc;
        }
        span{
          padding: 10px 0;
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
    .ques{
      text-align: center;
      background: #eeeeee;
      width: 95%;
      margin: 10px auto;
      line-height: 23px;
      overflow: hidden;
      border-radius: 10px;
      >div{
        margin: 10px 0;
        p{
          color: #686868;
        }
      }
    }
    .imgList{
      margin-left: 15px;
      margin-top: 15px;
      overflow: hidden;
      span{
        color: #686868;
        display: block;
        float: left;
      }
      a{
        display: inline-block;
        margin-left: 5px;
      }
    }
    .file{
      margin-left: 15px;
      margin-top: 15px;
      overflow: hidden;
      span{
        color: #686868;
        display: block;
        float: left;
      }
      a{
        font-size: 14px;
        margin: 4px auto;
        display: block;
        height: 24px;
        width: 80%;
        line-height: 24px;
        color: #5A5E66;
        border: 1px solid #F9F9F9;
        border-radius: 4px;
        background: #DDDDDD;
        text-align: center;
        margin-left: 80px;
      }
    }
    .tab{
      margin-top: 5px;
      .el-tabs__nav{
        margin-left: 15px;
      }
      .el-tab-pane{
        margin-left: 15px;
      }
    }
    .comment{
      li{
        overflow: hidden;
        padding-bottom: 20px;
        border-bottom: 1px solid #707070;
        .avatar {
          width: 60px;
          height: 60px;
          margin-left: 15px;
          margin-top: 15px;
          float: left;
          img {
            width: 60px;
            height: 60px;
            border-radius: 100%;
          }
        }
        .name{
          float: left;
          margin-top: 5px;
          span{
            display: block;
            font-size: 18px;
            margin-top: 10px;
            margin-left: 15px;
            .reply{
              display: inline;
            }
          }
          .add_time{
            font-size: 16px;
          }
        }
        .huihui{
          display: inline-block;
          float: right;
          margin-right: 50px;
          margin-top: 50px;
          font-size: 23px;
          cursor: pointer;
        }
        .fuj{
          width: 100%;
          float: left;
          >div{
            overflow: hidden;
            margin-top: 10px;
            span{
              display: block;
              float: left;
              img{
                margin-left: 5px;
              }
            }
            .filess{
              font-size: 14px;
              margin: 4px auto;
              display: block;
              height: 24px;
              width: 80%;
              line-height: 24px;
              color: #5A5E66;
              border: 1px solid #F9F9F9;
              border-radius: 4px;
              background: #DDDDDD;
              text-align: center;
              margin-left: 80px;
            }
          }
        }
      }
    }
    .like{
      li{
        overflow: hidden;
        p{
          margin-left: 15px;
          overflow: hidden;
          width: 400px;
          float: left;
          img{
            width: 45px;
            height: 45px;
            border-radius: 100%;
            float: left;
          }
          span{
            display: inline-block;
            margin-left: 10px;
            margin-top: 13px;
          }
        }
        .add_time{
          display: inline-block;
          margin-top: 13px;
        }
      }
    }
    .menu{
      background: #f5f7fd;
      border-top: 1px solid #ffffff;
      display: flex;
      display: -webkit-flex;
      span{
        flex-grow: 1;
        padding: 10px 0;
        display: inline-block;
        text-align: center;
        font-size: 17px;
        cursor: pointer;
      }
    }
  }
  .reply_me{
    margin-top: 3px;
    .top{
      overflow: hidden;
      text-align: center;
      background: #fff;
      .btn{
        margin: 10px 15px;
        float: left;
      }
      p{
        width: 440px;
        float: left;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
    .main{
      border-top: 1px solid #5393FF;
      background: #fff;
      font-size: 14px;
      ul{
        overflow: hidden;
        li{
          cursor: default;
          display: block;
          border-bottom: 1px solid #DDDDDD;
          font-size: 14px;
          transition: .3s;
          margin-bottom: 3px;
          overflow: hidden;
          oz-box-shadow: 1px 1px 2px #999999;
          -webkit-box-shadow: 1px 1px 2px #999999;
          box-shadow: 1px 1px 2px #999999;
          &:nth-child(even) {
            background: rgb(245, 247, 250);
          }
          &:hover {
            background: #EEEEEE;
          }
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid red;
            margin: 15px;
            float: left;
          }
          .right{
            width: 525px;
            float: right;
            .ed{
              margin-top: 10px;
              margin-bottom: 10px;
              display: inline-block;
            }
            .time{
              width: 500px;
              background: #dddddd;
              height: 45px;
              line-height: 45px;
              span{
                margin-left: 10px;
                display: inline-block;
              }
            }
            .ziti{
              margin-top: 10px;
              margin-bottom: 7px;
              span{
                color: #868686;
              }
              i{
                float: right;
                margin-right: 30px;
              }
            }
          }
        }
      }
    }
  }
</style>
