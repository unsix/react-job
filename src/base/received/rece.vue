<template>
<div>
  <div class="re" v-show="store">
    <div class="top">
      <el-button v-show="inserted == 6" type="primary" size="small" @click="_returnsd">返回</el-button>
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
          <div class="btn">
            <p v-show="item.take_effect == 4" @click.stop="look_history(item.contract_id)" style="cursor: pointer;text-align: right">查看历史验收记录</p>
            <span v-if="item.log" @click.stop="once(item.log,item.contract_id)">{{item.log}}</span>
            <span v-if="item.ion" @click.stop="twice(item.ion,item.contract_id)">{{item.ion}}</span>
            <span v-if="item.fir" @click.stop='third(item.fir,item.contract_id)'>{{item.fir}}</span>
            <p v-show="item.fir == '已结束'" @click.stop="complaint()" style="cursor: pointer;text-align: right">投诉入口</p>
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

  <div class="signed" v-show="signature">
    <i class="el-icon-close" @click="close_sign"></i>
    <iframe :src="sign_link" ref="sign" scrolling="no" seamless frameborder="0"></iframe>
    <el-button type="warning" size="small" @click="_rewirte">重写</el-button>
    <el-button type="success" size="small" style="float: right" @click="sure">确定</el-button>
  </div>

  <div class="wide" ref="wide" v-show="wideShow"></div>

  <div class="accept" v-show="accept">
    <div class="top">
      <el-button type="primary" size="small" @click="_returned">返回</el-button>
      <p>验收申请</p>
      <b @click="_right(pubg.contract_id)" style="cursor: pointer">查看合同</b>
    </div>
    <div class="main">
      <ul>
        <li>合同总金额<span>{{pubg.subtotal}}</span></li>
        <li>开始时间<span>{{pubg.contract_begin_time}}</span></li>
        <li>结束时间<span>{{pubg.contract_end_time}}</span></li>
      </ul>
      <ul>
        <li>已付款金额<span>{{pubg.amount_received}}</span></li>
      </ul>
      <ul>
        <li>本次结算金额 <el-input v-if="earn_money > 0" :disabled="true" v-model="earn_money" placeholder="请输入金额"></el-input>
          <el-input v-if="!earn_money" v-model="earn_money" placeholder="请输入金额"></el-input>
        </li>
      </ul>
      <ul>
        <li @click="look_accept()"><b style="color: blue;">验收单</b><span style="cursor: pointer">{{pubg.log}}</span></li>
        <li @click="look_settlement()"><b style="color: blue;">结算单</b><span style="cursor: pointer">{{pubg.ion}}</span></li>
      </ul>
      <span style="float: right;font-size: 14px;margin-right: 15px;cursor: pointer">更多记录</span>
      <div style="width: 80%;margin: 40px auto 0">
        <el-button type="success" style="width: 100%;border-radius: 4px">{{pubg.btn}}</el-button>
      </div>
    </div>
  </div>

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
          <p @click="look_accepted(item.inspection_id)">验收单值<span>点击查看</span></p>
          <p @click="look_settlemented(item.settlement_id)">结算单值<span>点击查看</span></p>
        </li>
      </ul>
    </div>
  </div>

  <div class="add" v-show="addShow">
    <ul>
      <h2>{{sec_title}}</h2>
      <i class="el-icon-close" @click="asShow"></i>
      <li v-for="(item,index) in plan" :log_type_id="item.inspection_type_id" @click="log(item.inspection_type_id)">{{item.inspection_name}}</li>
    </ul>
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
      signature:false,
      sign_link:'',
      wideShow:false,
      signImg:'',
      insert:'',
      accept:false,
      pubg:'',
      earn_money:'',
      con_title:'',
      check: false,
      vlurt:[],
      addShow:false,
      sec_title:'',
      plan:[],
      inserted:'0'
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
              this.$set(item,'ion')
              this.$set(item,'fir');
              //状态设置
              switch(item.take_effect){
                case '0':
                  item.log = '同意'
                  item.ion = '不满意'
                  item.fir = '拒绝'
                  break;
                case '1':
                  item.fir = '已同意，等待甲方支付预付款'
                  break;
                case '2':
                  item.fir = '已退回'
                  break;
                case '3':
                  item.log = '已拒绝'
                  break;
                case '4':
                  switch (item.apply_status){
                    case '0':
                      item.log = '申请验收'
                      break;
                    case '1':
                      switch (item.apply_is_ok){
                        case '3':
                        case '0':
                          item.log = '等待甲方处理验收单'
                          break;
                        case '1':
                          item.log = '等待甲方付款'
                          break;
                        case '2':
                        case '4':
                          item.log = '修改验收单'
                          break;
                      }
                      break;
                  }
                  switch (item.worker_apply){
                    case '0':
                      item.ion = '申请完工'
                      break;
                    case '1':
                      item.ion = '等待甲方处理完工申请'
                      break;
                  }
                  switch (this.inserted){
                    case '6':
                      item.fir = '请求付款'
                      break;
                  }
                  break;
                case '5':
                  item.fir = '已结束'
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
      this.linked = 'index.php/Mobel/skey/look_draft?id='+pr+'&operation=2&view=1'
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '我的合同'
      },500)
    },
    _return(){
      if(this.con_title == '我的合同'){
        this.store = true
        this.contract = false
        this.linked = ''
      }else{
        this.contract = false
        this.accept = true
      }
    },
    once(pr,res){
      if(pr == '同意'){
        this.sign_link = 'index.php/Mobile/find/sign'
        this.wideShow = true
        this.signature = true
        this.insert = res
      }
      if(pr == '等待甲方付款'){
        this.store = false
        let param = new URLSearchParams()
        param.append('contract_id',res)
        this.$http.post('index.php/Mobile/find/look_apply_content',param)
          .then((res)=>{
              if(res.data.code == 0) {
                this.$set(res.data.data,'log')
                this.$set(res.data.data,'ion')
                this.$set(res.data.data,'btn')
                res.data.data.btn = pr
                this.pubg = res.data.data
                this.earn_money = this.pubg.apply_content.money
                switch (this.pubg.apply_content.inspection_state){
                  case '0':
                    res.data.data.log = '甲方未处理'
                    break;
                  case '1':
                    res.data.data.log = '甲方已同意'
                    break;
                  case '2':
                    res.data.data.log = '甲方已拒绝'
                    break;
                }
                switch (this.pubg.apply_content.settlement_state){
                  case '0':
                    res.data.data.ion = '甲方未处理'
                    break;
                  case '1':
                    res.data.data.ion = '甲方已同意'
                    break;
                  case '2':
                    res.data.data.ion = '甲方已拒绝'
                    break;
                }
                this.accept = true
              }
          })
      }
      if(pr == '申请验收'){
        this.store = false
        let param = new URLSearchParams()
        param.append('contract_id',res)
        this.$http.post('index.php/Mobile/find/look_apply_content',param)
          .then((res)=>{
            if(res.data.code == 0) {
              this.$set(res.data.data,'log')
              this.$set(res.data.data,'ion')
              this.$set(res.data.data,'btn')
              res.data.data.btn = '发起验收申请'
              this.pubg = res.data.data
              if(this.pubg.apply_content){
                this.earn_money = this.pubg.apply_content.money
                switch (this.pubg.apply_content.inspection_state){
                  case '0':
                    res.data.data.log = '甲方未处理'
                    break;
                  case '1':
                    res.data.data.log = '甲方已同意'
                    break;
                  case '2':
                    res.data.data.log = '甲方已拒绝'
                    break;
                }
                switch (this.pubg.apply_content.settlement_state){
                  case '0':
                    res.data.data.ion = '甲方未处理'
                    break;
                  case '1':
                    res.data.data.ion = '甲方已同意'
                    break;
                  case '2':
                    res.data.data.ion = '甲方已拒绝'
                    break;
                }
              }else{
                this.earn_money = ''
                res.data.data.ion = '暂未填写 发起'
                res.data.data.log = '暂未填写 发起'
              }
              this.accept = true
            }
          })
      }
    },
    twice(pr,res){
      if(pr == '不满意'){
        this.$confirm('确认不满意该合同，将返回给甲方重新修改？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          let param = new URLSearchParams()
          param.append('status',2)
          param.append('contract_id',res)
          this.$http.post('index.php/Mobile/Find/audit_new',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.$message.warning('合同退回成功')
                this._getInfo()
              }else{
                this.$message.warning('处理失败')
              }
            })
        }).catch(()=>{
          this.$message.warning('取消操作')
        })
      }
      if(pr == '申请完工'){
        this.$confirm('经甲方同意后，则此合同结束，将不能进行任何操作','确认申请完工',{
          confirmButtonText:'确认',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          let param = new URLSearchParams()
          param.append('contract_id',res)
          this.$http.post('index.php/Mobile/find/examine_apply',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.$message.success('等待雇主处理')
                this._getInfo()
              }else{
                this.$message.error(res.data.message)
              }
            })
        }).catch(()=>{
          this.$message.warning('取消操作')
        })
      }
    },
    third(pr,res){
      if(pr == '拒绝'){
        this.$confirm('确认拒绝该合同么？','提示',{
          confirmButtonText:'确认',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          let param = new URLSearchParams()
          param.append('status',3)
          param.append('contract_id',res)
          this.$http.post('index.php/Mobile/Find/audit_new',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.$message.warning('拒绝成功')
                this._getInfo()
              }else{
                this.$message.warning('拒绝失败')
              }
            })
        }).catch(()=>{
          this.$message.warning('取消操作')
        })
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
    complaint(){
      this.$message.warning('功能尚在开发中')
    },
    close_sign(){
      this.signature = false
      this.wideShow = false
      this.$refs.sign.contentWindow.remote()
    },
    _rewirte(){
      this.$refs.sign.contentWindow.remote()
    },
    sure(){
      this.$refs.sign.contentWindow.sure()
      this.signImg = this.$refs.sign.contentWindow.ss
      this.signature = false
      this.wideShow = false
      this._agree()
    },
    _agree(){
      let formData = new FormData()
      formData.append('file',this.signImg)
      formData.append('token',this.token)
      let config = {
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }
      this.$http.post('https://up.qbox.me',formData,config).then((res)=>{
        setTimeout(()=>{
          let param = new URLSearchParams()
          param.append('status',1)
          param.append('contract_id',this.insert)
          param.append('signatory_b',res.data.hash)
          this.loadingShow = true
          this.$http.post('index.php/Mobile/Find/audit_new',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.loadingShow = false
                this.wideShow = false
                this.signature = false
                this._getInfo()
                this.$message.success(res.data.message)
              }else{
                this.loadingShow = false
                this.$message.error(res.data.message)
              }
            })
        })
      })
    },
    _returned(){
      this.store = true
      this.accept = false
      this.earn_money = ''
    },
    _right(pr){
      this.accept = false
      this.linked = 'index.php/Mobel/skey/look_draft?id='+pr+'&operation=2&view=1'
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '我的合同'
      },500)
    },
    look_accept(){
      if(this.pubg.apply_content){
        this.accept = false
        this.linked = 'index.php/Mobile/skey/look_inspection?type=1&operation=2&form_id='+this.pubg.apply_content.inspection_id
        this.loadingShow = true
        setTimeout(()=>{
          this.contract = true
          this.loadingShow = false
          this.con_title = '验收单'
        },500)
      }else{
        this.$http.post('index.php/Mobile/find/inspection_list')
          .then((res)=>{
            this.addShow = true
            this.wideShow = true
            this.sec_title = '选择验收单类型'
            this.plan = res.data.data
          })
      }
    },
    look_settlement(){
      if(this.pubg.apply_content){
        this.accept = false
        this.linked = 'index.php/Mobile/skey/look_inspection?type=2&operation=2&form_id='+this.pubg.apply_content.settlement_id
        this.loadingShow = true
        setTimeout(()=>{
          this.contract = true
          this.loadingShow = false
          this.con_title = '结算单'
        },500)
      }else{
        this.$http.post('/index.php/Mobile/find/seelement_list')
          .then((res)=>{
            this.addShow = true
            this.wideShow = true
            this.sec_title = '选择结算单类型'
            this.plan = res.data.data
          })
      }
    },
    look_accepted(pr){
      this.accept = false
      this.check = false
      this.linked = 'index.php/Mobile/skey/look_inspection?type=1&operation=2&form_id='+pr
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '验收单'
      },500)
    },
    look_settlemented(pr){
      this.accept = false
      this.check = false
      this.linked = 'index.php/Mobile/skey/look_inspection?type=2&operation=2&form_id='+pr
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '结算单'
      },500)
    },
    _recont(){
      this.store = true
      this.check = false
    },
    asShow(){
      this.addShow = false
      this.wideShow = false
    },
    log(pr){
      this.addShow = false
      this.wideShow = false
      this.accept = false
      this.contract = true
      if(this.sec_title == '选择验收单类型'){
        this.linked = 'index.php/Mobile/skey/look_inspection?type=1&form_type_id=2&operation=1&form_id=' + pr
        this.con_title = '填写验收单'
      }else{
        this.linked = 'index.php/Mobile/skey/look_inspection?type=2&form_type_id=1&operation=1&form_id=' + pr
        this.con_title = '填写结算单'
      }

    },
    _returnsd(){
      this.$parent.deta = true
      this.$parent.infos = true
      this.$parent.ysd_if = false
      this.insert = 0
    }
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
  mounted(){
    if(this.$route.path === '/work/exam') {
      this.$emit('changeWorkIndex', 13)
    }
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.$refs.wide.style.height = h + 'px'
  }
}
</script>

<style lang="scss">
  .re{
    width: 100%;
    .top{
      background: #fff;
      position: relative;
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
            display: block;
            text-align: right;
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
              cursor: pointer;
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
  .accept{
    width: 100%;
    .top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
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
      background: #F1F1F1;
      height: 600px;
      ul{
        background: #fff;
        margin-bottom: 10px;
        li{
          padding: 10px 10px;
          border-bottom:  1px solid #e3e4e9;
          span{
            float: right;
          }
          .el-input{
            width: 60%;
            float: right;
            display: inline;
            border-bottom:  1px solid #e3e4e9;
            .el-input__inner{
              height: 20px;
              border: none;
              outline: none;
              text-align: right;
            }
          }
        }
      }
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
</style>
