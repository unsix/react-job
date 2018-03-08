<template>
  <div class="work_mind">
    <ul v-show="mainShow">
      <li @click="record_mind">
        <el-badge :value="list.wait_reviewed.unread_num" class="item">
          <span><i class="el-icon-edit"></i></span>
        </el-badge>
        <span>日志提醒</span>
        <span>({{list.wait_reviewed.name}}{{list.wait_reviewed.description}})</span>
      </li>
      <li>
        <el-badge :value="list.reply_me.unread_num" class="item">
          <span><i class="iconfont icon-xiaoxi"></i></span>
        </el-badge>
        回复我的
        <span>({{list.reply_me.name}}回复{{list.reply_me.description}})</span>
      </li>
      <li>
        <el-badge :value="2" class="item">
          <span><i class="iconfont icon-danzan"></i></span>
        </el-badge>
        我收到的赞
        <!--<span>({{list.liked_me.name}} {{list.liked_me.description}})</span>-->
      </li>
      <li>
        <el-badge :value="list.reviewed_me.unread_num" class="item">
          <span><i class="el-icon-edit-outline"></i></span>
        </el-badge>
        我发出的工作
        <span>({{list.reviewed_me.name}}点评了我的日志:{{list.reviewed_me.description}})</span>
      </li>
    </ul>

    <div class="mind" v-show="mindShow">
      <div class="top">
        <el-button>返回</el-button>
        <p>点评列表</p>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        list:[],
        mainShow : true,
        mindShow: false,

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
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('each',10)
      },
      _get_notification_list(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        this.$http.post('index.php/Mobile/company/message_notification_list',param)
          .then((res)=>{
            this.list = res.data.data
            if(this.list.liked_me == null){
              let obj = new Object()
              obj.name = ''
              obj.description = ''
              this.list.liked = obj
            }
          })
      }
    },
    props:{


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
  }
</script>

<style lang="scss">
  .work_mind{
    width: 100%;
    background: #fff;
    ul{
      >li{
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
</style>
