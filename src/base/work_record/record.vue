<template>
  <div class="record">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="合同模板" name="1"></el-tab-pane>
        <el-tab-pane label="拟呈批合同" name="2"></el-tab-pane>
        <el-tab-pane label="工作记录" name="3"></el-tab-pane>
        <el-tab-pane label="工作提醒" name="4"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="workList" v-show="idx == 2">
      <div class="list">
        <ul>
          <li v-for="item in untreated">
            <div class="main">
              <div class="avatar">
                <img :src="item.avatar">
              </div>
              <div class="name">
                <span>{{item.name}}</span>
                <span class="add_time">{{item.add_time}}</span>
              </div>
              <div class="stauts">
                <p>日志
                  <span v-show="item.reviewer_fraction == 0">未点评</span>
                  <span v-show="item.reviewer_fraction != 0">已点评{{item.reviewer_fraction}}分</span>
                </p>
              </div>
            </div>
            <div class="cc">
              <div class="cs">
                <span> <i class="iconfont icon-shixindiqiu" style="margin-right: 5px"></i>全公司</span>
              </div>
            </div>
            <div class="bottom">
              <div class="time">
                <span>{{item.start_time}} 由{{item.reviewer_name}}点评</span>
              </div>
              <ul>
                <li v-for="ti in item.custom_form_elements">
                  <p>{{ti.title}}</p>
                  <span style="margin-left: 20px">{{ti.result}}</span>
                </li>
              </ul>
            </div>
            <div class="share">
              <div class="right">
                <span @click="lookMore(item.publish_id)"><i class="iconfont icon-more"></i>显示更多</span>
                <span @click="likeLog(item.publish_id)" v-show="tips < 10"><i class="iconfont icon-danzan"></i>点赞</span>
                <span @click="likeLogs(item.publish_id)" style="color: red;" v-show="tips > 10"><i class="iconfont icon-danzan"></i>点赞</span>
                <span @click="delDate(item.publish_id)"><i class="iconfont icon-shanchu"></i>删除</span>
                <span @click="judge(item.name,item.publish_id,item.reviewer)" class="nonebo"><i class="iconfont icon-xiaoxi"></i>回复</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="page">
        <span @click="first_page">首页</span>
        <span @click="last_page" v-show="pageIndex > 1">上一页</span>
        <span @click="next_page" v-show="nextPageShow">下一页</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getCro} from "@/common/js/crowd";
  export default {
    data(){
      return{
        activeName:'1',
        idx:'0',
        pageIndex:1,
        nextPageShow: true,
        untreated:[],
        tips:'1',
      }
    },
    methods:{
      ...mapMutations({
        setToken:'SET_TOKEN'
      }),
      handleClick(tab){
        let index = parseInt(tab.index)
        this.idx = index
        if(index == 2){
          this._getPublishLook()
        }
      },
      _getPublishLook(){
        let param = new URLSearchParams()
        param.append("uid",this.user.uid)
        param.append("company_id",this.nowCompanyId)
        param.append('p',this.pageIndex)
        param.append('each',10)
        this.$http.post('/index.php/Mobile/company/publish_look_two',param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            let arr = []
            res.data.data.forEach((item) => {
              item.avatar='http://bbsf-file.hzxb.net/' + item.avatar
              let time = item.start_time
              var date = new Date();
              var show_day=new Array('星期一','星期二','星期三','星期四','星期五','星期六','星期日');
              date.setTime(time * 1000);
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              var d = date.getDate();
              var day=date.getDay();
              d = d < 10 ? ('0' + d) : d;
              item.start_time = y+'年'+m +'月'+d+'日'+' '+show_day[day-1]
              // item.reviewer_fraction=item.reviewer_fraction.toString()
              //抄送
              item.cc = JSON.parse(item.cc)
              // console.log(item)
              arr.push(item)
            })
            this.untreated = arr
            if(arr.length < 10) {
              this.nextPageShow = false
            }
          })
      },
      first_page() {
        this.nextPageShow = true
        this.pageIndex = 1
      },
      last_page() {
        this.nextPageShow = true
        --this.pageIndex
      },
      next_page() {
        ++this.pageIndex
      },
    },
    mounted(){
      if(this.$route.path === '/work/record') {
        this.$emit('changeWorkIndex', 6)
      }
    },
    computed:{
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ])
    }
  }
</script>

<style lang="scss">
  .record{
    width: 600px;
    background: #ffffff;
    overflow: hidden;
    >.tab {
      width: 100%;
      margin: 4px 0;
      .el-tabs__active-bar {
        width: 190px;
      }e
      .el-tabs__nav {
        width: 100%;
      }
      .el-tabs__item {
        font-size: 15px;
        font-weight: 700;
        width: 150px;
        text-align: center;
      }
    }
  }
  .workList{
    .list {
      width: 100%;
      ul {
        list-style: none;
        background: #D8D8D8;
        overflow: hidden;
        li {
          background: #ffffff;
          margin-bottom: 10px;
          margin-top: 10px;
          overflow: hidden;
          box-shadow: 0 0 2px rgba(0, 0, 0, .2);
          -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
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
            overflow: hidden;
            .cs {
              display: inline-block;
              border: 1px solid blue;
              border-radius: 15px;
              padding: 8px 0;
              margin: 5px 0px 5px 15px;
              cursor: pointer;
              span {
                text-align: center;
                padding: 0 15px;
                color: blue;
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
              span {
                display: inline-block;
                padding: 0 10px;
                border-right: 1px solid #707070;
                cursor: pointer;
              }
              .nonebo {
                border-right: none;
              }
            }
          }
        }
      }
      .page {
        padding: 4px;
        text-align: center;
        background: #FFFFFF;
        margin-bottom: 10px;
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
