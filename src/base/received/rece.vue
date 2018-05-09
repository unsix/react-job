<template>
<div>
  <div class="re" v-show="store">
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
          <span>创建时间：{{item.add_time}}</span>
          <div class="main">
            <p>{{item.contract_name}}</p>
            <p>乙方姓名：{{item.worker_name}}</p>
          </div>
          <span>{{item.log}}</span>
          <span>{{item.take_effect}}</span>
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
      <p>我的合同</p>
    </div>
    <iframe id="mom" class="win" ref="indx" :src="linked" scrolling="yes" height="100%" seamless frameborder="0"></iframe>
  </div>

  <loading v-show="loadingShow"></loading>
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
      loadingShow:false
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
      param.append('identity','2')
      param.append('p',this.pageIndex)
      param.append('each',10)
      this.$http.post('/index.php/Mobile/find/contract_list',param)
        .then((res)=>{
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.$set(item,'log')
              //状态设置
              // switch(item.take_effect){
              //   case '0':
              //     item.take_effect = '等待乙方签字确认'
              //     break;
              //   case '1':
              //     item.log = '乙方已签字'
              //     item.take_effect = '去付款'
              //     break;
              //   case '2':
              //     item.log = '乙方已退回'
              //     item.take_effect = '点击修改'
              //     break;
              //   case '3':
              //     item.take_effect = '乙方已拒绝'
              //     break;
              //   case '4':
              //     switch (item.apply_is_ok){
              //       case '0':
              //         item.take_effect = 'sss'
              //         break;
              //       case '1':
              //         item.take_effect = ''
              //         break;
              //     }
              //   case '5':
              //     item.take_effect = '已完工'
              //     break;
              // }
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
      this.linked = 'index.php/Mobel/skey/look_draft?id='+pr+'&operation=2&view=1'
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
      })
    },
    _return(){
      this.store = true
      this.contract = false
      this.linked = ''
    },
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
  }
}
</script>

<style lang="scss">
  .re{
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
          span{
            display: inline-block;
            text-align: right;
            width: 100%;
          }
          .main{
            margin-top: 10px;
            padding:10px 10px 10px;
            background: #e3e4e9;
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
</style>
