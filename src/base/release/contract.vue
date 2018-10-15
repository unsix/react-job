<template>
  <div>
    <div v-if="wrapper">
      <div class="contract_list" v-show="contr_show">
        <div class="tabs">
          <el-tabs v-model="activeCard" @tab-click="handle">
            <el-tab-pane label="合同模板" name="1"></el-tab-pane>
            <el-tab-pane label="合同草稿" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="lists">
          <ul>
            <li v-for="(item,index) in contract_list" @click="look_contract(item.contract_type_id,item.contract_name,item.type)">
              <p>{{item.contract_name}}</p>
              <div class="bun" v-show="activeCard == 2">
                <span @click.stop="edit(item)">编辑</span>
                <span @click.stop="share()">复制</span>
                <span @click.stop="send(item)">发起合同评审</span>
              </div>
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
          <b @click="write_contract()" v-show="activeCard == 1"><i class="el-icon-edit"></i></b>
          <a style="color: black" :href="downUrl" target="_blank" download="" mce_href='#' v-show="activeCard == 1"><i class="el-icon-download"></i></a>
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

      <div class="box" v-if="psb_show">
        <div class="top">
          <el-button type="primary" size="small" @click="_returns">返回</el-button>
          <p>{{contr_name}}</p>
          <b @click="show_sea">去复制</b>
        </div>
        <addPsb :userList="user_info" :approval_id="approval_id1" :tode="todo" @return_exam="return_Add"></addPsb>
      </div>
      <chooseTemplate v-if="chooseTemShow"  @returnForm="returnForm" :insert="0" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></chooseTemplate>
      <psb v-if="psb_if" :form_Lista="form_Lista" :qk_return="false" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></psb>
    </div>
    <cho  v-else  :title="tips"></cho>
  </div>
</template>

<script>
  import cho from '@/base/add_approval/cho'
  import { mapGetters, mapMutations } from 'vuex'
  import psb from '@/base/exam_form/psb'
  import addPsb from '@/base/add_approval/add_psb'
  import {getPic} from '@/common/js/pic.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import chooseTemplate from '@/base/add_approval/choose_template'
  import { create_approval_list } from '@/common/js/approval/approval_list'
  import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
  export default {
    data(){
      return{
        ys_list:[],
        js_list:[],
        gz_list:[],
        tips:'',
        wrapper:true,
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
        downUrl:'',
        psb_show: false,
        approval_id1:'',
        user_info:[],
        contr_name:'合同评审表',
        todo:{},
        chooseTemShow:false,
        approval_type:111,
        psb_if:false,
        form_Lista:{},
        form_Listb:{},
        file_arr:[]
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
      edit(item){
        this.contr_show = false
        this.con_title = item.contract_name
        this.details_show = true
        let httpUrl = this.$test('/index.php/Mobile/skey/look_draft?id')
        this.cores = `${httpUrl}=${item.contract_record_id}&operation=3&view=3`
      },
      share(){

      },
      send(res){
        this.todo = res
        this.psb_show = true
        this.contr_show = false
      },
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
          param.append('type',3)
          param.append('each',10)
          let httpUrl = this.$test('/index.php/Mobile/find/select_contract_companty_types')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              if(res.data.code == 0){
                this.contract_list = res.data.data
              }
            })
        }else if(this.activeCard == '2'){
          let param = new URLSearchParams()
          param.append('p',this.pageIndex)
          param.append('each',10)
          let httpUrl = this.$test('/index.php/Mobile/find/pre_contract_list')
          this.$http.post(httpUrl,param)
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
        let httpUrl = this.$test('/index.php/Mobile/skey/word_contract?type')
        this.downUrl = `${httpUrl}=${ed}`
        let key = ''
        var str = document.cookie.split(';');
        str.forEach((item)=>{
          if(item.indexOf('key') != -1){
            key = item
          }
        })
        key = key.substring(key.lastIndexOf('=')+1, key.length)
        //拿到cookie
        let httpUrls = this.$test('/index.php/Mobile/Find/show_form?info=null&type_id')
        this.core = `${httpUrls}=${pr}&contract_name=null&is_tax=2&subtotal=null&develop_start_time=null&develop_end_time=null&information_address=null`
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
        let httpUrl = this.$test('/index.php/Mobile/skey/look_draft?id')
        this.cores = `${httpUrl}=${this.type_id}&operation=1&view=2`
      },
      _returned(){
        if(this.activeCard == 2){
          this.details_show = false
          this.contr_show = true
          this.con_title = ''
        }else{
          this.detail_show = true
          this.details_show = false
        }
      },
      submit(){
        var obj = this.$refs.win.contentWindow
        obj.getCustomFormResult()
        let tips = obj.tips
        let result = obj.result
        if(result){
          this.$confirm('确认发起评审么','提示',{
            confirmButtonText:'确认',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            let param = new URLSearchParams()
            param.append('contract_type_id',this.type_id)
            param.append('content_json',result)
            let httpUrl = this.$test('/index.php/Mobile/find/add_temp_draft')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                if(res.data.code == 0){
                  this.todo = res.data.data
                  this.getlist()
                  this.$message.success('添加成功')
                  this.details_show = false
                  this.psb_show = true
                }else{
                  this.$message.error(res.data.message)
                }
              })
          }).catch(()=>{
            this.$message.error('已取消操作')
          })
        }
      },
      _returns(){
        this.ys_list = []
        this.js_list = []
        this.gz_list = []
        if(this.activeCard == 2){
          this.contr_show = true
          this.psb_show = false
          this.todo = {}
        }else{
          this.details_show = true
          this.psb_show = false
          this.user_info = []
          this.approval_id1 = ''
        }
      },
      show_sea(){
        this.psb_show = false
        this.chooseTemShow = true
      },
      getlist(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('type',111)
        let str = this.$test('/index.php/Mobile/user/get_approval_user_info')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                this.$set(item,'require',Array)
                this.$set(item,'option',Array)
                if(item.form_content){
                  if(item.form_content.required){
                    item.require = item.form_content.required
                  }
                  if(item.form_content.optional){
                    item.option = item.form_content.optional
                  }
                }
                if(item.auto_fill_fields){
                  if(item.auto_fill_fields.required){
                    item.auto_fill_fields.required.forEach((pr)=>{
                      item.require.push(pr.name)
                    })
                  }
                  if(item.auto_fill_fields.optional){
                    item.auto_fill_fields.optional.forEach((pr)=>{
                      item.option.push(pr.name)
                    })
                  }
                }
                this.user_info.push(item)
              })
            }
          })
      },
      returnForm(){
        this.psb_show = true
        this.chooseTemShow = false
      },
      viewInfo(item) {
        this.psb_if = false
        this.chooseTemShow = false
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("approval_id", item.approval_id);
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
        this.$http.post(str, param)
          .then((res)=>{
            this.psb_if = true
            this.form_Lista = create_hetongpingshen_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          })
        let nparam = new URLSearchParams();
        nparam.append("uid", this.user.uid);
        nparam.append("approval_id", item.approval_id);
        nparam.append("company_id", item.company_id);
        let httpUrl = this.$test("/index.php/Mobile/approval/approval_process_personnel")
        this.$http.post(httpUrl, nparam)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            res.data.data.content.forEach((item, index) => {
              if(item.picture) {
                let arr = []
                let zparam = new URLSearchParams();
                zparam.append("enclosure_id", item.picture);
                let str = this.$test("/index.php/Mobile/approval/look_enclosure")
                this.$http.post(str, zparam)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    res.data.data.picture.forEach((item) => {
                      if(item != '') {
                        arr.push(getPic(item))
                      }
                    })
                  })
                res.data.data.content[index].picture = arr
              }
              if(item.many_enclosure){
                this.get_imgs(item.many_enclosure,item)
                this.get_files(item.many_enclosure,item)
              }
              if(item.replys){
                item.replys.forEach((pic)=>{
                  this.get_imgs(pic.many_enclosure,pic)
                  this.get_files(pic.many_enclosure,pic)
                })
              }
            })
            if(res.data.data.supply){
              res.data.data.supply.forEach((item,index)=>{
                this.get_imgs(item.many_enclosure,item)
                this.get_files(item.many_enclosure,item)
              })
            }
            if(res.data.data.finance) {
              if(res.data.data.finance.finance_state === '1') {
                res.data.data.finance.finance_state = '<span style="color:#67C23A">通过</span>'
              } else {
                res.data.data.finance.finance_state = '<span style="color:#EB9E05" >未通过</span>'
              }
              let zparam = new URLSearchParams();
              zparam.append("enclosure_id", res.data.data.finance.receipt_pic);
              let str = this.$test("/index.php/Mobile/approval/look_enclosure")
              this.$http.post(str, zparam)
                .then((res) => {
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item) => {
                    if(item != '') {
                      arr.push(getPic(item))
                    }
                  })
                  this.$set(this.form_Listb, 're_pic', arr)
                })
            }
            this.form_Listb = create_approval_list(res.data.data)
          })
      },
      useInfo(item){
        this.approval_id1 = item.approval_id
        this.psb_show = true
        this.chooseTemShow = false
      },
      returnList(){
        this.chooseTemShow = true
        this.psb_if = false
      },
      get_img(many_enclosure) {
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams();
          param.append("enclosure_id", many_enclosure);
          let str = this.$test("/index.php/Mobile/approval/look_enclosure")
          this.$http.post(str, param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let arr = []
              res.data.data.picture.forEach((item) => {
                if(item != '') {
                  arr.push(getAvatar(item))
                }
              })
              // this.img_arr = arr
              this.$set(this.form_Lista, 'img_list', arr)
            })
        }else{
          many_enclosure.forEach((item) => {
            if(item.type === 3) {
              let param = new URLSearchParams();
              param.append("enclosure_id", item.contract_id);
              let str = this.$test("/index.php/Mobile/approval/look_enclosure")
              this.$http.post(str, param)
                .then((res) => {
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item) => {
                    if(item != '') {
                      arr.push(getAvatar(item))
                    }
                  })
                  // this.img_arr = arr
                  this.$set(this.form_Lista, 'img_list', arr)
                })
            }
          })
        }
      },
      get_file(many_enclosure) {
        this.file_arr = []
        if(!many_enclosure) {
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item) => {
          if(item.type === 4) {
            let param = new URLSearchParams();
            param.append("attachments_id", item.contract_id);
            let str = this.$test("/index.php/Mobile/approval/look_attachments")
            this.$http.post(str, param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let obj = {}
                let file_data = res.data.data
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                this.file_arr.push(obj)
              })
          }
        })
      },
      get_imgs(many_enclosure,info){
        if(!many_enclosure){
          return
        }
        if(typeof many_enclosure == 'string'){
          let param = new URLSearchParams()
          param.append('enclosure_id',many_enclosure)
          let str = this.$test('/index.php/Mobile/approval/look_enclosure')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let arr = []
              res.data.data.picture.forEach((item)=>{
                if(item != ''){
                  arr.push(getAvatar(item))
                }
              })
              this.$set(info,'imgs',arr)
            })
        }else{
          many_enclosure.forEach((item)=>{
            if(item.type == 3){
              let param = new URLSearchParams()
              param.append('enclosure_id',item.contract_id)
              let str = this.$test('/index.php/Mobile/approval/look_enclosure')
              this.$http.post(str,param)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  let arr = []
                  res.data.data.picture.forEach((item)=>{
                    if(item != ''){
                      arr.push(getAvatar(item))
                    }
                  })
                  this.$set(info,'imgs',arr)
                })
            }
          })
        }
      },
      get_files(many_enclosure,info){
        if(!many_enclosure){
          return
        }
        if(typeof many_enclosure == 'string'){
          return
        }
        many_enclosure.forEach((item)=>{
          let arr =[]
          if(item.type == 4){
            let param = new URLSearchParams()
            param.append('attachments_id',item.contract_id)
            let str = this.$test('/index.php/Mobile/approval/look_attachments')
            this.$http.post(str,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                let obj = {}
                let file_data = res.data.data
                var str = process.env.NODE_ENV
                var picLeader = ''
                str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                arr.push(obj)
              })
            this.$set(info,'files',arr)
          }
        })
      },
      return_Add(){
        this.detail_show = true
        this.psb_show = false
        this.user_info = []
        this.approval_id1 = ''
      }
    },
    created(){
      this._get_Data()
    },
    mounted() {
      if(this.$route.path === '/work/contr_list') {
        this.$emit('changeWorkIndex', '4-6')
      }
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
    components:{
      addPsb,
      psb,
      chooseTemplate,
      cho
    }
  }
</script>

<style lang="scss">
  .box{
    background: #FFF;
    .top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #FFF;
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
        right: 13px;
      }
    }
    .add_psb{
      width: 95%;
      margin: 20px auto 0;
    }
  }
  .choose_template{
    background: #FFF;
  }
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
          float: left;
        }
        .bun{
          float: right;
          span{
            color: #878d99;
            margin: 0 10px;
            cursor: pointer;
          }
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
