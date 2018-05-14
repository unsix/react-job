<template>
  <div>
    <div class="lssue" v-show="store">
      <div class="top">
        <p>我的合同</p>
        <el-tabs v-model="activeName" @tab-click="handClick">
          <el-tab-pane label="进行中" name="1"></el-tab-pane>
          <el-tab-pane label="已结束" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="list">
        <ul>
          <li v-for="item in list" @click="getMoreInfo(item.contract_id)">
            <span class="el">创建时间：{{item.add_time}}</span>
            <div class="main">
              <p>{{item.contract_name}}</p>
              <p>乙方姓名：{{item.worker_name}}</p>
            </div>
            <div class="btn">
              <p v-show="item.take_effect == '4'" style="cursor: pointer" @click.stop="look_history(item.contract_id)">查看历史验收记录</p>
              <span v-show="item.log">{{item.log}}</span>
              <span v-show="item.ion" style="cursor: pointer" @click.stop="choose(item.ion)">{{item.ion}}</span>
            </div>
          </li>
        </ul>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
    </div>

    <div class="contract" v-show="contract">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>{{con_title}}</p>
      </div>
      <iframe id="mom" class="win" ref="indx" :src="linked" scrolling="yes" height="100%" seamless frameborder="0"></iframe>
    </div>

    <loading v-show="loadingShow"></loading>

    <div class="check" v-show="check">
      <div class="top">
        <el-button type="primary" size="small" @click="_recont">返回</el-button>
        <p>验收记录</p>
      </div>
      <div class="main">
        <ul>
          <li v-for="item in vlurt">
            <p>申请时间<span>{{item.add_time}}</span></p>
            <p>结算金额<span>{{item.money}}</span></p>
            <p @click="look_accept(item.inspection_id)">验收单值<span>点击查看</span></p>
            <p @click="look_settlement(item.settlement_id)">结算单值<span>点击查看</span></p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import loading from '@/base/loading/loading'
export default {
  data(){
    return{
      activeName:'1',
      pageIndex:'1',
      list:[],
      nextPageShow: true,
      contract:false,
      store:true,
      linked:'',
      loadingShow:false,
      check:false,
      vlurt:[],
      con_title:''
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
      setCompanyList: 'SET_COMPANYLIST'
    }),
    handClick(tab){
      let index = parseInt(tab.index)
      if(index == 0){
        this._getInfo()
      }else if(index == 1){
        this._getInfo()
      }
    },
    _getInfo(){
      this.list.splice(0,this.list.length)
      let param = new URLSearchParams()
      param.append('type',this.activeName)
      param.append('identity','1')
      param.append('p',this.pageIndex)
      param.append('each',10)
      this.$http.post('/index.php/Mobile/find/contract_list',param)
        .then((res)=>{
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.$set(item,'log')
              this.$set(item,'ion')
              switch(item.take_effect){
                case '0':
                  item.log = '等待乙方签字确认'
                  break;
                case '1':
                  item.log = '乙方已签字'
                  item.ion = '去付款'
                  break;
                case '2':
                  item.log = '乙方已退回'
                  item.ion = '点击修改'
                  break;
                case '3':
                  item.log = '乙方已拒绝'
                  break;
                case '4':
                  switch (item.apply_is_ok){
                    case '0':
                      item.ion = '乙方申请验收，请处理'
                      break;
                    case '1':
                      item.ion = '去付款'
                      break;
                    case '2':
                      item.ion = '等待乙方修改验收单'
                      break;
                    case '3':
                      item.ion = '等待乙方修改验收单'
                      break;
                    case '4':
                      item.ion = '等待乙方修改验收单'
                      break;
                  }
                  break;
                case '5':
                  item.log = '已结束'
                  break;
              }
                this.list.push(item)
              })
              if(this.list.length < 10){
                this.nextPageShow = false
              }else{
              this.nextPageShow = true
            }
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
    getMoreInfo(pr){
      this.store = false
      this.linked = 'index.php/Mobile/skey/look_draft?id=' + pr +'&operation=2&view=1'
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.con_title = '我的合同'
        this.loadingShow = false
      },500)
    },
    choose(pr){
      if(pr == '去付款'){
        this.$message.warning('请在手机端完成此操作')
      }

    },
    _return(){
      if(this.con_title == '我的合同'){
        this.store = true
        this.contract = false
        this.linked = ''
      }else{
        this.contract = false
      }
    },
    look_history(pr){
      let param = new URLSearchParams()
      param.append('contract_id',pr)
      param.append('each',10)
      param.append('p',1)
      this.$http.post('index.php/Mobile/find/apply_history',param)
        .then((res)=>{
          if(res.data.code == '0'){
             if(res.data.data.length < 1){
               this.$message.info('没有数据')
             }else{
               this.store = false
               this.check = true
               this.vlurt = res.data.data
             }
          }
        })
    },
    _recont(){
      this.store = true
      this.check = false
    },
    look_accept(pr){
      this.check = false
      this.linked = 'index.php/Mobile/skey/look_inspection?type=1&operation=2&form_id='+pr
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '验收单'
      },500)
    },
    look_settlement(pr){
      this.check = false
      this.linked = 'index.php/Mobile/skey/look_inspection?type=2&operation=2&form_id='+pr
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '结算单'
      },500)
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'nowCompanyName',
      'userState',
      'nowCompanyId',
      'comDepartList',
      'companyList'
    ])
  },
  created(){
    this._getInfo()
  },
  watch:{
    pageIndex(){
      this._getInfo()
    }
  },
  components:{
    loading
  },
  mounted(){
    if(this.$route.path === '/work/exam') {
      this.$emit('changeWorkIndex', 12)
    }
  }
}

</script>

<style lang="scss">
  .lssue{
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
      .el-tabs{
        width: 100%;
        height: 40px;
        .el-tabs__item{
          width: 300px;
          text-align: center;
        }
      }
    }
    .list{
      ul{
        margin-top: 3px;
        list-style: none;
        background: #D8D8D8;
        overflow: hidden;
        li{
          padding: 10px 10px;
          background: #ffffff;
          margin-bottom: 5px;
          /*margin-top: 5px;*/
          overflow: hidden;
          oz-box-shadow: 1px 1px 2px #999999;
          -webkit-box-shadow: 1px 1px 2px #999999;
          box-shadow: 1px 1px 2px #999999;
          &:hover {
            background: #EEEEEE;
          }
          .el{
            display: inline-block;
            text-align: right;
            width: 100%;
          }
          .main{
            margin-top: 10px;
            padding:10px 10px 10px;
            background: #e3e4e9;
          }
          .btn{
            float: right;
            margin-top: 5px;
            span{
              display: inline-block;
              background: #FF7A4C;
              padding: 2px;
              border-radius: 4px;
              font-size: 12px;
              color: #fff;
            }
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
    }
  }
  .contract{
    background: #fff;
    width: 100%;
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
      b{
        position: absolute;
        top: 13px;
        right: 13px;
      }
    }
    .win{
      width: 600px;
      height:700px;
      border-bottom: 1px solid #e3e4e9;
    }
  }
  .check{
    background: #fff;
    width: 100%;
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
      b{
        position: absolute;
        top: 13px;
        right: 13px;
      }
    }
    .main{
      ul{
        width: 100%;
        li{
          margin-bottom: 10px;
          p{
            padding: 10px;
            border-bottom: 1px solid #e3e4e9;
            span{
              float: right;
            }
          }
        }
      }
    }
  }
</style>
