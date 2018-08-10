<template>
  <div>
    <div class="rele" v-show="rele">
      <div class="top">
        <p>最新工程</p>
        <el-tabs v-model="activeName" @tab-click="handClick">
          <el-tab-pane label="进行中" name="fir"></el-tab-pane>
          <el-tab-pane label="已结束" name="sec"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="list">
        <ul>
          <li v-for="item in list" @click="sel_item(item.iid)">
            <p>{{item.add_time}}</p>
            <p>{{item.title}}</p>
            <i class="el-icon-arrow-right"></i>
          </li>
        </ul>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
    </div>

    <div class="details" v-show="dede">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>{{moreInfo.title}}</p>
        <b @click="work_end(moreInfo.iid)" v-show="activeName != 'sec'" style="cursor: pointer">结束招工</b>
      </div>
      <div class="main">
        <ul>
          <li>位置<span>{{moreInfo.address}}</span></li>
          <li>开始时间<span>{{moreInfo.start_time}}</span></li>
          <li>用工数<span v-for="item in moreInfo.worker" style="border: 1px solid #878d99;border-radius: 4px;margin-left: 5px">{{item.type}}({{item.num}})</span></li>
          <li>总预算<span>{{moreInfo.budget}}元</span></li>
          <li>工期<span>{{moreInfo.schedule}}天</span></li>
          <li style="border-bottom: none">备注<span>{{moreInfo.remark}}</span></li>
        </ul>

        <div class="tab">
          <el-tabs v-model="activeNames" @tab-click="handleClick">
            <el-tab-pane label="申请的工人" name="1"></el-tab-pane>
            <el-tab-pane label="浏览的工人" name="2"></el-tab-pane>
            <el-tab-pane label="雇佣的工人" name="3"></el-tab-pane>
          </el-tabs>
        </div>

        <div class="list">
          <li v-for="item in workers">
            <img :src="item.avatar">
            <p>{{item.name}}</p>
            <span @click="_get_contract(item.uid)">发送合同</span>
          </li>
        </div>
      </div>

    </div>

    <div class="wide" ref="wide" v-show="wideShow"></div>

    <div class="contra" v-show="contr">
      <ul>
        <i class="el-icon-close" @click="asShow"></i>
        <li v-for="item in list_con" @click="sel_con(item.contract_type_id,item.contract_name)">{{item.contract_name}}</li>
      </ul>
    </div>

    <loading v-show="loadingShow"></loading>

    <div class="contract_main" v-show="con_main_show" >
      <div class="top">
        <el-button type="primary" size="small" @click="_returned">返回</el-button>
        <p>{{title}}</p>
        <b @click="_right" style="cursor: pointer">签字</b>
      </div>
      <iframe id="mom" class="win" ref="indx" :src="core" scrolling="yes" height="100%" seamless frameborder="0"></iframe>
      <el-button type="success" size="small" @click="_submit" style="margin-top: 5px;margin-left: 5px;margin-bottom: 5px">确定</el-button>
    </div>

    <div class="signed" v-show="signature">
      <i class="el-icon-close" @click="close_sign"></i>
      <iframe :src="sign_link" ref="sign" scrolling="no" seamless frameborder="0"></iframe>
      <el-button type="warning" size="small" @click="_rewirte">重写</el-button>
      <el-button type="success" size="small" style="float: right" @click="sure">确定</el-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import loading from '@/base/loading/loading'
export default {
  data(){
    return{
      activeName:'fir',
      list:[],
      pageIndex:1,
      nextPageShow: true,
      rele:true,
      dede:false,
      moreInfo:'',
      activeNames:'1',
      iid:'',
      workers:[],
      wideShow:false,
      contr:false,
      list_con:[],
      loadingShow:false,
      con_main_show:false,
      signature:false,
      title:'',
      core:'',
      sign_link:'',
      u_id:'',
      signImg:''
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
        this._getMyrelea()
      }else if(index == 1){
        this._getMyrelea()
      }
    },
    _getMyrelea(){
      this.list.splice(0,this.list.length)
      let param = new URLSearchParams()
      if(this.activeName == 'fir'){
        param.append('status','1')
      }else{
        param.append('status','2')
      }
      param.append('uid',this.user.uid)
      param.append('each','10')
      param.append('p',this.pageIndex)
      let httpUrl = this.$test('/index.php/Mobile/Myinfo/myRelease')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.list.push(item)
            })
            if(this.list.length<20){
              this.nextPageShow =false
            }
          }else{
            this.$message.error(res.data.message)
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
    sel_item(pr){
      this.dede = true
      this.rele = false
      this._lookUser(pr)
      let param = new URLSearchParams()
      param.append('iid',pr)
      let httpUrl = this.$test('/index.php/Mobile/Myinfo/releaseDetail')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            this.moreInfo = res.data.data
          }
        })
    },
    _return(){
      this.rele = true
      this.dede = false
    },
    handleClick(tab){
      let index = parseInt(tab.index)
      if(index == 0){
        this._lookUser(this.iid)
      }else if(index == 1){
        this._lookUser(this.iid)
      }else if(index == 2){
        this._lookUser(this.iid)
      }
    },
    _lookUser(pr){
      this.workers.splice(0,this.workers.length)
      this.iid = pr
      let param = new URLSearchParams()
      param.append('iid',pr)
      param.append('type',this.activeNames)
      let httpUrl = this.$test('/index.php/Mobile/Myinfo/lookUser')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              item.avatar = getAvatar(item.avatar)
              this.workers.push(item)
            })
          }
        })
    },
    _get_contract(pr){
      this.u_id = pr
      let param = new URLSearchParams()
      param.append('type',2)
      let httpUrl = this.$test('/index.php/Mobile/find/select_contract_companty_types')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            this.list_con = res.data.data
            this.wideShow = true
            this.contr = true
          }else{
            this.$message.error(res.data.message)
          }
        })
    },
    asShow(){
      this.wideShow = false
      this.contr = false
      document.body.style.overflow = 'visible'
    },
    sel_con(res,tip){
      this.contract_type_id = res
      let httpUrl = this.$test('/index.php/Mobile/skey/look_draft?id=')
      let str = httpUrl + res +'&operation=1&view=1'
      this.core = str
      this.wideShow = false
      this.contr = false
      this.dede = false
      this.title = tip
      this.loadingShow = true
      setTimeout(()=>{
        this.con_main_show = true
        this.loadingShow = false
      },1000)
    },
    _returned(){
      this.con_main_show = false
      this.dede = true
      if(this.signImg){
        this.$refs.sign.contentWindow.remote()
      }
      this.title = ''
      this.core = ''
    },
    _right(){
      let httpUrl = this.$test('/index.php/Mobile/find/sign')
      this.sign_link = httpUrl
      this.signature = true
      this.wideShow = true
    },
    close_sign(){
      this.signature = false
      this.wideShow = false
      this.$refs.sign.contentWindow.remote()
    },
    _submit(){
      this.$refs.indx.contentWindow.getCustomFormResult()
      let tips = this.$refs.indx.contentWindow.tips
      let result = this.$refs.indx.contentWindow.result
      if(this.signImg == ''){
        this.$message.error('请签字')
        return false
      }
      if(result.length > 0){
        let formData = new FormData()
        formData.append('file',this.signImg)
        formData.append('token',this.token)
        let config = {
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post('https://up.qbox.me',formData,config).then((res)=>{
          setTimeout(()=>{
            let param = new URLSearchParams()
            param.append('content_json',result)
            param.append('contract_type_id',this.contract_type_id)
            param.append('worker_id',this.u_id)
            param.append('signatory_a',res.data.hash)
            this.loadingShow = true
            let httpUrl = this.$test('/index.php/Mobile/find/addcontract_new')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                if(res.data.code == 0){
                  this.loadingShow = false
                  this._returned()
                  this.$message.success(res.data.message)
                }else{
                  this.loadingShow = false
                  this.$message.error(res.data.message)
                }
              })
          },500)
        })
      }

    },
    _rewirte(){
      this.$refs.sign.contentWindow.remote()
    },
    sure(){
      this.$refs.sign.contentWindow.sure()
      this.signImg = this.$refs.sign.contentWindow.ss
      this.signature = false
      this.wideShow = false
    },
    _getToken(uid) {
      let nparam = new URLSearchParams();
      nparam.append("uid", this.user.uid);
      let httpUrl = this.$test("/index.php/Mobile/path/get_token")
      this.$http.post(httpUrl, nparam)
        .then((res) => {
          this.setToken(res.data.data)
        })
    },
    work_end(pr){
      this.$confirm('您确定结束用工么','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        let param = new URLSearchParams()
        param.append('iid',pr)
        let httpUrl = this.$test('/index.php/Mobile/myinfo/end_enter')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(res.data.code == 0){
              this.$message.success('结束招工成功')
              this._return()
              this._getMyrelea()
            }else{
              this.$message.error('结束招工失败')
            }
          })
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'已取消操作'
        })
      })
    }

  },
  created(){
    this._getMyrelea()
    this._getToken()
  },
  mounted(){
    if(this.$route.path === '/work/release') {
      this.$emit('changeWorkIndex', '5-1')
    }
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.$refs.wide.style.height = h + 'px'
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
  watch:{
    pageIndex(){
      this._getMyrelea()
    }
  },
  components:{
    loading
  }
}
</script>

<style lang="scss">
.rele{
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
        p{
          width: 150px;
          float: left;
        }
        i{
          float: right;
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
.details{
  width: 100%;
  .top{
    position: relative;
    border-bottom: 1px solid #e3e4e9;
    background: #Fff;
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
      background: #Fff;
      li{
        padding: 10px 10px;
        border-bottom: 1px solid #878d99;
        span{
          float: right;
        }
      }
    }
  }
  .tab{
    background: #Fff;
    margin-top: 5px;
    height: 40px;
    .el-tabs{
      width: 100%;
      height: 40px;
      .el-tabs__item{
        width: 200px;
        text-align: center;
      }
    }
  }
  .list{
    margin-top: 5px;
    background: #fff;
    li{
      list-style: none;
      overflow: hidden;
      padding: 10px 0;
      img{
        width: 50px;
        height: 50px;
        float: left;
        margin-left: 15px;
      }
      p{
        width: 100px;
        float: left;
        text-align: center;
        line-height: 50px;
      }
      span{
        float: right;
        line-height: 50px;
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        color: #FA8058;
      }
      &:hover {
        background: #EEEEEE;
      }
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
.contra{
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
.contract_main{
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
.signed{
  width: 600px;
  position: fixed;
  top: 60px;
  left: 50%;
  margin-left: -345px;
  z-index: 99999;
  background: #fff;
  border-radius: 4px;
  i{
    float: right;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;
  }
  iframe{
    width: 600px;
    height: 230px;
  }
  button{
    margin: 10px;
  }
}
</style>
