<template>
    <div>
      <div class="contes" v-show="notes">
        <div class="top">
          <p>合同归档</p>
        </div>
        <div class="main">
          <ul>
            <li v-for="item in list" @click="newTarget(item)">
              <div style="border-bottom: 1px solid #878d99;overflow: hidden">
                <div class="head">
                  <img :src="item.avatar" alt="">
                </div>
                <div class="let">
                  <p>标题：{{item.contract_name}}</p>
                  <p>类型：{{item.contract_type_name}}</p>
                  <p>发起人：{{item.name}}</p>
                  <p>乙方：{{item.b_name}}</p>
                </div>
              </div>
              <div class="menu">
                <span @click.stop="look(item,'请款')">请款记录</span>
                <span @click.stop="look(item,'结算')">结算记录</span>
                <span @click.stop="look(item,'验收')">验收记录</span>
                <span @click.stop="look(item,'工作')">工作联系单</span>
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

      <div v-if="qk_note" class="qk_notes">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>{{record}}</p>
          <b @click="add_qk">{{get_record}}</b>
        </div>
        <div class="main">
          <ul>
            <li v-for="item in qk_list" @click="look_qk(item)" v-if="record != '工作联系单'">
              <p>{{item.add_time}}</p>
              <p>类型：{{item.type}}</p>
              <p>标题：{{item.title}}</p>
              <p>审批进程：<span v-html="item.approval_state"></span></p>
            </li>
            <li v-if="record == '工作联系单'" v-for="item in qk_list" style="overflow: hidden;padding: 10px" @click="look_qk(item)">
              <p><span style="float: left">{{item.carse_content}}</span><span style="float: right">{{item.add_time}}</span></p>
            </li>
          </ul>
          <div class="page">
            <span @click="first_page">首页</span>
            <span @click="last_page" v-show="pageIndex > 1">上一页</span>
            <span @click="next_page" v-show="nextPageShow">下一页</span>
          </div>
        </div>
      </div>

      <add_qk v-if="qkd_show" :inspection_type_id="inspection_type_id" ref="qkdLook" :inset="add_data" :contract_name="add_data.contract_name" :qkd_status="status"></add_qk>

      <comQkd :change_type="change_type" v-if="qkd_show_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" :pset="false" @return_psb="returnList" :file_arr="file_arr"></comQkd>
      <comJsd v-if="jsd_show_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" :pset="false" @return_psb="returnList" :file_arr="file_arr"></comJsd>
      <comYsd v-if="ysd_show_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></comYsd>
      <comLxd v-if="lxd_show_if" :form_Lista="form_Lista" @return_psb="returnList"></comLxd>
      <div class="as_what" v-show="as_what_show">
        <ul>
          <h2>选择验收单类型</h2>
          <i class="el-icon-close" @click="close_as"></i>
          <li v-for="(item,index) in ysdType" @click="ysd_click(item.inspection_type_id)" >{{item.inspection_name}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
  import add_qk from '@/base/contract_doc/con_qk'
  import comQkd from '@/base/exam_form/qkd'
  import comJsd from '@/base/exam_form/jsd'
  import comYsd from '@/base/exam_form/ysd'
  import comLxd from '@/base/exam_form/lxd'
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
  import { create_approval_list } from '@/common/js/approval/approval_list'
  export default {
    data(){
      return{
        pageIndex:1,
        list:[],
        nextPageShow:true,
        notes:true,
        qk_note:false,
        qkd_show:false,
        qk_list:[],
        add_data:{},
        status:'',
        change_type:'',
        qkd_show_if:false,
        jsd_show_if:false,
        form_Lista:{},
        form_Listb:{},
        file_arr:[],
        record:'',
        get_record:'',
        as_what_show:false,
        ysdType:[],
        inspection_type_id:'',
        ysd_show_if:false,
        lxd_show_if:false
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
      getdate(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('p',this.pageIndex)
        param.append('each',10)
        let str = this.$test('/index.php/Mobile/find/find_contract_company_list')
        this.$http.post(str,param)
          .then((res)=>{
            res.data.data.forEach((item)=>{
              item.avatar = getAvatar(item.avatar)
              let str = `/index.php/Mobile/skey/look_draft?id=${item.contract_temp_id}&operation=2&view=4`
              this.$set(item,'link',str)
              this.list.push(item)
            })
            if(res.data.data.length <10){
              this.nextPageShow = false
            }
          })
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
      look(pr,rsc){
        this.notes = false
        switch (rsc) {
          case '请款':
            this.record = '请款记录'
            this.get_record = '去请款'
            this.qk_note = true
            this.qk_data(pr)
            break;
          case '结算':
            this.record = '结算记录'
            this.get_record = '去结算'
            this.qk_note = true
            this.js_data(pr)
            break;
          case '验收':
            this.record = '验收记录'
            this.get_record = '去验收'
            this.qk_note = true
            this.ys_data(pr)
            break;
          case '工作':
            this.record = '工作联系单'
            this.get_record = '发起联系单'
            this.qk_note = true
            this.gz_data(pr)
            break;
        }
      },
      qk_data(pr){
        this.qk_list = []
        this.add_data = pr
        let param = new URLSearchParams()
        param.append('contract_id',pr.contract_type_id)
        param.append('each',10)
        param.append('p',this.pageIndex)
        let str = this.$test('/index.php/Mobile/find/contract_request_money_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                if(item.type == 8){
                  item.type = '请款单'
                  item.approval_state = get_state(item.approval_state)
                  this.qk_list.push(item)
                }
                if(res.data.data.length < 10 ){
                  this.nextPageShow = false
                }
              })
            }
          })
        function get_state(state){
          if(state === '0'){
            return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
          }else if(state === '1'){
            return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }else if(state === '2'){
            return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
          }else if(state === '3'){
            return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
          }
        }
      },
      js_data(pr){
        this.qk_list = []
        this.add_data = pr
        let param = new URLSearchParams()
        param.append('contract_id',pr.contract_type_id)
        param.append('each',10)
        param.append('p',this.pageIndex)
        let str = this.$test('/index.php/Mobile/find/find_settle_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                if(item.type == 14){
                  item.type = '结算单'
                  item.approval_state = get_state(item.approval_state)
                  this.qk_list.push(item)
                }
                if(res.data.data.length < 10 ){
                  this.nextPageShow = false
                }
              })
            }
          })
        function get_state(state){
          if(state === '0'){
            return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
          }else if(state === '1'){
            return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }else if(state === '2'){
            return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
          }else if(state === '3'){
            return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
          }
        }
      },
      ys_data(pr){
        this.qk_list = []
        this.add_data = pr
        let param = new URLSearchParams()
        param.append('contract_id',pr.contract_type_id)
        param.append('each',10)
        param.append('p',this.pageIndex)
        let str = this.$test('/index.php/Mobile/find/find_inspection_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              res.data.data.forEach((item)=>{
                if(item.type == 12){
                  item.type = '结算单'
                  item.approval_state = get_state(item.approval_state)
                  this.qk_list.push(item)
                }
                if(res.data.data.length < 10 ){
                  this.nextPageShow = false
                }
              })
            }
          })
        function get_state(state){
          if(state === '0'){
            return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
          }else if(state === '1'){
            return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }else if(state === '2'){
            return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
          }else if(state === '3'){
            return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
          }
        }
      },
      gz_data(pr){
        this.qk_list = []
        this.add_data = pr
        let param = new URLSearchParams()
        param.append('contract_id',pr.contract_type_id)
        param.append('each',20)
        param.append('p',this.pageIndex)
        let str = this.$test('/index.php/Mobile/find/find_work_connect_list')
        this.$http.post(str,param)
          .then((res)=>{
            this.qk_list = res.data.data
            if(res.data.data.length < 10 ){
              this.nextPageShow = false
            }
          })
      },
      newTarget(pr){
        window.open(pr.link,'_blank')
      },
      add_qk(){
        switch(this.record){
          case '请款记录':
            this.status = '请款单'
            this.qk_note = false
            this.qkd_show = true
            break;
          case '结算记录':
            this.status = '结算单'
            this.qk_note = false
            this.qkd_show = true
            break;
          case '验收记录':
            this.status = '验收单'
            this.as_what_show = true
            this.get_ysd_type()
            break;
          case '工作联系单':
            this.status = '工作联系单'
            this.qk_note = false
            this.qkd_show = true
            break;
        }
      },
      _return(){
        this.getdate()
        this.notes = true
        this.qk_note = false
        this.pageIndex = 0
      },
      look_qk(item){
        this.qk_note = false
        this.qkd_show_if = false
        this.ysd_show_if = false
        this.jsd_show_if = false
        this.lxd_show_if = false
        if(this.record == '工作联系单'){
          let param = new URLSearchParams()
          param.append('work_connect_id',item.work_connect_id)
          let str = this.$test('/index.php/Mobile/contract/look_work_connection')
          this.$http.post(str,param)
            .then((res)=>{
              this.form_Lista = res.data.data
              if(this.form_Lista.main_send_info){
                this.form_Lista.main_send_info.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                })
              }
              if(this.form_Lista.part_send_info){
                this.form_Lista.part_send_info.forEach((item)=>{
                  item.avatar = getAvatar(item.avatar)
                })
              }
              this.lxd_show_if = true
            })
        }else{
          let mparam = new URLSearchParams();
          mparam.append("approval_id", item.approval_id);
          mparam.append("company_id", item.company_id);
          let httpUrl = this.$test("/index.php/Mobile/approval/approval_process_personnel")
          this.$http.post(httpUrl, mparam)
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
          let nparam = new URLSearchParams();
          nparam.append("approval_id", item.approval_id);
          let src = this.$test("/index.php/Mobile/approval/approval_process_show")
          this.$http.post(src, nparam)
            .then((res)=>{
              switch (this.record) {
                case '请款记录':
                  if(res.data.data.change_type){
                    this.change_type = res.data.data.change_type
                  }
                  this.qkd_show_if = true
                  this.form_Lista = create_qingkuandan_list(res.data.data)
                  this.get_img(this.form_Lista.many_enclosure)
                  this.get_file(this.form_Lista.many_enclosure)
                  break;
                case '结算记录':
                  this.jsd_show_if = true
                  this.form_Lista = res.data.data
                  this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
                  this.get_img(this.form_Lista.many_enclosure)
                  this.get_file(this.form_Lista.many_enclosure)
                  break;
                case '验收记录':
                  this.ysd_show_if = true
                  this.form_Lista = res.data.data
                  this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
                  this.get_img(this.form_Lista.many_enclosure)
                  this.get_file(this.form_Lista.many_enclosure)
                  break;
              }
            })
        }
      },
      returnList(){
        this.qkd_show_if = false
        this.jsd_show_if = false
        this.ysd_show_if = false
        this.lxd_show_if = false
        this.qk_note = true
        switch(this.record){
          case '请款记录':
            this.qk_data(this.add_data)
            break;
          case '结算记录':
            this.js_data(this.add_data)
            break;
          case '验收记录':
            this.ys_data(this.add_data)
            break;
          case '工作联系单':
            this.gz_data(this.add_data)
            break;
        }
      },
      ysd_click(pr){
        this.as_what_show = !this.as_what_show
        this.ysdType = []
        this.loading_show = true
        this.inspection_type_id = pr
        setTimeout(()=>{
          this.loading_show = false
          this.qkd_show = true
        },500)
      },
      close_as(){
        this.as_what_show = !this.as_what_show
        this.ysdType = []
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
      get_ysd_type(){
        let str = this.$test('/index.php/Mobile/approval/inspection_list')
        this.$http.post(str)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.ysdType = res.data.data
            this.as_what_show = true
          })
      },
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ])
    },
    watch:{
      pageIndex(){
        if(this.notes){
          this.getdate()
        }else if(this.qk_note){
          switch (this.record) {
            case '请款记录':
              this.qk_data(this.add_data)
              break;
            case '结算记录':
              this.js_data(this.add_data)
              break;
            case '验收记录':
              this.ys_data(this.add_data)
              break;
          }
        }
      }
    },
    mounted(){

    },
    created(){
      this.getdate()
    },
    components:{
      add_qk,
      comQkd,
      comJsd,
      comYsd,
      comLxd
    }
  }
</script>

<style lang="scss">
 .contes{
   width: 100%;
   background: #fff;
   min-height: 800px;
   .top {
     position: relative;
     border-bottom: 1px solid #e3e4e9;
     background: #fff;
     display: flex;
     justify-content: center;
     .el-button {
       position: absolute;
       top: 10px;
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
     b {
       position: absolute;
       top: 13px;
       right: 13px;
       cursor: pointer;
     }
   }
   .main{
     ul{
       width: 90%;
       margin: 0 auto;
       li{
         padding: 10px 0;
         overflow: hidden;
         a{
           color: black;
         }
         .head{
           width: 50px;
           float: left;
         }
         .let{
           float: left;
           margin: 0 20px;
           p{
             font-size: 14px;
             line-height: 18px;
           }
         }
         .menu{
           background: #f5f7fd;
           border-top: 1px solid #ffffff;
           display: flex;
           display: -webkit-flex;
           span{
             flex-grow: 1;
             margin: 10px 0;
             display: inline-block;
             text-align: center;
             font-size: 17px;
             cursor: pointer;
             border-left: 1px solid #878d99;
             &:first-child{
               border-left: none;
             }
           }
         }
       }
     }
   }
 }
 .qk_notes{
    width: 100%;
    min-height: 1000px;
    background: #FFF;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      display: flex;
      justify-content: center;
      .el-button {
        position: absolute;
        top: 7px;
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
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .main{
      li {
        padding: 5px;
        cursor: pointer;
        background: #ffffff;
        margin-bottom: 5px;
        color: #2D2F33;
        font-size: 14px;
        box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        border-bottom: 1px solid #DDDDDD;
        transition: .3s;
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
      }

    }
  }
 .page {
   width: 100%;
   padding: 4px;
   text-align: center;
   span {
     cursor: pointer;
     font-size: 12px;
     &:hover {
       color: #409EFF;
     }
   }
 }
 .as_what {
   position: fixed;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   height: 100%;
   width: 100%;
   margin: 0 auto;
   background: rgba(0, 0, 0, 0.4);
   z-index: 10;
   ul {
     width: 200px;
     background: #FFFFFF;
     margin: 200px auto;
     padding: 10px;
     border-radius: 4px;
     h2 {
       display: inline-block;
       margin-bottom: 10px;
       font-size: 20px;
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
