<template>
  <div>
    <div class="contract_list" v-show="contr_show">
      <div class="tabs">
        <el-tabs v-model="activeCard" @tab-click="handle">
          <el-tab-pane label="合同模板" name="1"></el-tab-pane>
          <el-tab-pane label="拟呈批合同" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="lists">
        <ul>
          <li v-for="(item,index) in contract_list" @click="look_contract(item.contract_type_id,item.contract_name,item.type)">
            <p>{{item.contract_name}}</p>
          </li>
        </ul>
        <div class="pages" v-show="pageShow">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
    </div>

    <div class="detail" v-show="detail_show">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>{{con_title}}</p>
        <b @click="write_contract()"><i class="el-icon-edit"></i></b>
        <a style="color: black" :href="downUrl" target="_blank" download="" mce_href='#'><i class="el-icon-download"></i></a>
      </div>
      <iframe :src="core" class="win" scrolling="yes" height="100%" seamless frameborder="0"></iframe>
    </div>

    <div class="detail" v-if="details_show">
      <div class="top">
        <el-button type="primary" size="small" @click="_returned">返回</el-button>
        <p>编写-{{con_title}}</p>
        <b @click="submit()">提交</b>
      </div>
      <iframe ref="win" :src="cores" class="win" scrolling="yes" height="100%" seamless frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        activeCard:'1',
        contract_list:[],
        pageIndex:1,
        pageShow:false,
        nextPageShow:true,
        contr_show:true,
        detail_show:false,
        con_title:'',
        core:'',
        type_id:'',
        cores:'',
        details_show:false,
        downUrl:''
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
      handle(tab){
        let index = JSON.parse(tab.index)
        this.activeCard = (index+1).toString()
        this._get_Data()
      },
      _get_Data(){
        this.contract_list = []
        if(this.activeCard == '1'){
          this.pageShow = false
          let param = new URLSearchParams()
          param.append('type',1)
          param.append('each',10)
          this.$http.post('index.php/Mobile/find/select_contract_companty_types',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.contract_list = res.data.data
              }
            })
        }else if(this.activeCard == '2'){
          let param = new URLSearchParams()
          param.append('p',this.pageIndex)
          param.append('each',10)
          this.$http.post('index.php/Mobile/find/draft_list',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.contract_list = res.data.data
                if(this.contract_list.length == 0){
                  this.pageShow = false
                }else if(this.contract_list.length < 10){
                  this.nextPageShow = false
                }
              }
            })
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
      look_contract(pr,re,ed){
        this.type_id = pr
        this.downUrl = `/index.php/Mobile/skey/word_contract?type=${ed}`
        let key = ''
        var str = document.cookie.split(';');
        str.forEach((item)=>{
          if(item.indexOf('key') != -1){
            key = item
          }
        })
        key = key.substring(key.lastIndexOf('=')+1, key.length)
        this.core = `index.php/Mobile/Find/show_form?info=null&type_id=${pr}&contract_name=null&is_tax=2&subtotal=null&develop_start_time=null&develop_end_time=null&information_address=null&skey=${key}&skey_uid=${this.user.uid}`
        this.contr_show = false
        this.detail_show = true
        this.con_title = re
      },
      _return(){
        this.contr_show = true
        this.detail_show = false
        this.con_title = ''
        this.core = ''
      },
      write_contract(){
        this.detail_show = false
        this.details_show = true
        this.cores = `index.php/Mobile/skey/look_draft?id=${this.type_id}&operation=1&view=2`
      },
      _returned(){
        this.detail_show = true
        this.details_show = false
      },
      submit(){
        var obj = this.$refs.win.contentWindow
        obj.getCustomFormResult()
        let tips = obj.tips
        let result = obj.result
        if(result){
          let param = new URLSearchParams()
          param.append('contract_type_id',this.type_id)
          param.append('content_json',result)
          this.$http.post('index.php/Mobile/find/add_draft',param)
            .then((res)=>{
              if(res.data.code == 0){
                this.details_show = false
                this.contr_show = true
                this.$message.success('添加成功')
                this._get_Data()
              }else{
                this.$message.error(res.data.message)
              }
            })
        }
      }
    },
    created(){
      this._get_Data()
    },
    watch:{
      pageIndex(){
        this._get_Data()
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
    },
  }
</script>

<style lang="scss">

  .contract_list{
    width: 100%;
    .tabs{
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
    .lists{
      width: 100%;
      li{
        background: #ffffff;
        margin-bottom: 5px;
        padding: 10px 20px ;
        overflow: hidden;
        oz-box-shadow: 1px 1px 2px #999999;
        -webkit-box-shadow: 1px 1px 2px #999999;
        box-shadow: 1px 1px 2px #999999;
        &:hover{
          background: #e3e4e9;
        }
        p{
          cursor: pointer;
        }
      }
      .pages {
        width: 100%;
        padding: 4px;
        text-align: center;
        background: #FFF;
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
  .detail{
    width: 100%;
    background: #FFF;
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
        cursor: pointer;
        top: 13px;
        right: 40px;
      }
      a{
        position: absolute;
        cursor: pointer;
        top: 13px;
        right: 13px;
      }
    }
    .win{
      width: 100%;
      height: 800px;
    }
  }
</style>
