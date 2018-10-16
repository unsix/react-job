<template>
  <div>
    <div v-if="wrapper">
      <div class="forms" v-if="form_show">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>{{qkd_status}}</p>
          <b @click="show_sign">去复制</b>
        </div>
        <addQkd v-if="qkd_show" :userList="user_info" :approval_id="approval_id" :btn_show="false" :contract_name="contract_name" :contract="inset" ref="scse"  @return_exam="return_Add"  :form_approval_id="form_approval_id"  :request_money_basis_type="request_money_basis_type"></addQkd>
        <qkds class="qkd_s" :contract_name="contract_name" :contract="inset" :approval_id="approval_id" :btn_show="false" :request_money_basis_type="request_money_basis_type" ref="qkd" v-if="qkd_if"></qkds>
      </div>
      <choose v-if="chooseShow" :link="true"  ref="choosetem" @returnForm="returnForm" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></choose>
      <chooseTemplate v-if="chooseTemShow" :link="true" style="background: #FFF"  @returnForm="returnForm" :insert="0" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></chooseTemplate>

      <qkd v-if="if_qkd" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qkd>
      <comQkd :change_type="change_type" v-if="qkd_show_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" :pset="false" @return_psb="returnList" :file_arr="file_arr"></comQkd>
    </div>
    <cho v-else :title="tips"></cho>
  </div>
</template>

<script>
  import cho from '@/base/add_approval/cho'
  import { mapGetters, mapMutations } from 'vuex'
  import qkd from '@/base/personal_approval/qkd_b'
  import comQkd from '@/base/exam_form/qkd'
  import qkds from '@/base/personal_approval/qkd_a'
  import {getPic} from '@/common/js/pic.js'
  import addQkd from '@/base/add_approval/add_qkd'
  import choose from '@/base/personal_approval/inital'
  import chooseTemplate from '@/base/add_approval/choose_template'
  import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
  import { create_approval_list } from '@/common/js/approval/approval_list'
  import {getAvatar} from '@/common/js/avatar.js'
  export default {
    data(){
      return{
        wrapper:true,
        ys_list:[],
        js_list:[],
        gz_list:[],
        form_show:true,
        qkd_show:false,
        user_info:[],
        approval_id:'',
        request_money_basis_type:'',
        form_approval_id:'',
        qkd_if:false,
        chooseShow:false,
        chooseTemShow:false,
        approval_type:'',
        if_qkd:false,
        form_Lista:{},
        form_Listb:{},
        file_arr:[],
        qkd_show_if:false,
        change_type:''
      }
    },
    props:{
      inset:{

      },
      qkd_status:{

      },
      contract_name:{

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
      change_types(){
        switch (this.qkd_status) {
          case '请款单':
            this.qkd_show = true
            this.get_user()
            break;
          case '个人请款单':
            this.qkd_if = true
            break;
        }
      },
      get_user(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('type',8)
        let src = this.$test('/index.php/Mobile/user/get_approval_user_info')
        this.$http.post(src,param)
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
      return_Add(){
        this.form_show = false
        this.$parent.store = true
        this.approval_id = ''
        this.$parent.add_qkd_show_cr = false
      },
      _reInfo(){
        this.form_show = false
        this.$parent.store = true
        this.approval_id = ''
        this.$parent.add_qkd_show_cr = false
      },
      returnForm(){
        this.chooseTemShow = false
        this.chooseShow = false
        this.form_show = true
        this.approval_type = ''
        switch (this.qkd_status) {
          case '请款单':
            this.qkd_show = true
            break;
          case '个人请款单':
            this.qkd_if = true
            break;
        }
      },
      viewInfo(item){
        this.chooseTemShow = false
        this.chooseShow = false
        this.if_qkd = false
        this.qkd_show_if = false
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
        switch (this.qkd_status) {
          case '请款单':
            let nparam = new URLSearchParams();
            nparam.append("approval_id", item.approval_id);
            let src = this.$test("/index.php/Mobile/approval/approval_process_show")
            this.$http.post(src, nparam)
              .then((res)=>{
                if(res.data.data.change_type){
                  this.change_type = res.data.data.change_type
                }
                this.qkd_show_if = true
                this.form_Lista = create_qingkuandan_list(res.data.data)
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
                this.get_repal(this.form_Lista.many_enclosure)
              })
            break;
          case '个人请款单':
            let param = new URLSearchParams()
            param.append('approval_personal_id',item.approval_personal_id)
            let str = this.$test('/index.php/Mobile/Personal/approval_personal_process_show')
            this.$http.post(str,param)
              .then((res)=>{
                this.if_qkd = true
                this.form_Lista = create_qingkuandan_list(res.data.data)
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
              })
            break;
        }
      },
      get_repal(many_enclosure){
        if(!many_enclosure){
          return
        }else{
          if(many_enclosure.length > 0){
            many_enclosure.forEach((item)=>{
              if(item.type == '5'){
                let arr = []
                let param = new URLSearchParams();
                param.append("id", item.contract_id);
                let str = this.$test('/index.php/Mobile/approval/look_enclosure_approval')
                this.$http.post(str,param)
                  .then((res)=>{
                    if(res.data.code == 0){
                      res.data.data.forEach((item)=>{
                        switch (item.type) {
                          case '12':
                            item.type ='验收单'
                            break;
                          case '14':
                            item.type ='结算单'
                            break;
                        }
                        item.approval_state = get_state(item.approval_state)
                        arr.push(item)
                        this.$set(this.form_Lista, 'app_list', arr)
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
              }else if(item.type == '6'){
                let arr = []
                let param = new URLSearchParams();
                param.append("id", item.contract_id);
                let str = this.$test('/index.php/Mobile/approval/look_enclosure_payroll')
                this.$http.post(str,param)
                  .then((res)=>{
                    if(res.data.code == 0){
                      res.data.data.forEach((item)=>{
                        item.pryroll_status = get_states(item.pryroll_status)
                        arr.push(item)
                      })
                      this.$set(this.form_Lista, 'apple_list', arr)
                    }
                  })
                function get_states(state){
                  if(state === '0'){
                    return '<span style="color:#409EFF">待处理<i class="el-icon-loading" style="margin-left:4px"></i></span>'
                  }else if(state === '1'){
                    return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
                  }else if(state === '2'){
                    return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
                  }else if(state === '-1'){
                    return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
                  }else if(state === '99'){
                    return '<span style="color:#67C23A">已确认<i class="el-icon-success" style="margin-left:4px"></i></span>'
                  }
                }
              }
            })
          }
        }
      },
      useInfo(item){
        this.approval_id = ''
        this.chooseTemShow = false
        this.chooseShow = false
        this.qkd_show = false
        this.qkd_if = false
        this.form_show = true
        switch (this.qkd_status) {
          case '请款单':
            this.qkd_show = true
            this.approval_id = item.approval_id
            break;
          case '个人请款单':
            this.qkd_if = true
            this.approval_id = item.approval_personal_id
            break;
        }
      },
      _return(){
        this.ys_list = []
        this.js_list = []
        this.gz_list = []
        this.user_info = []
        this.form_show = false
        this.$parent.store = true
        this.$parent.add_qkd_show_cr = false
      },
      show_sign(){
        this.qkd_show = false
        this.qkd_if = false
        this.form_show = false
        switch (this.qkd_status) {
          case '请款单':
            this.chooseTemShow = true
            this.approval_type = 8
            break;
          case '个人请款单':
            this.chooseShow = true
            this.approval_type = 2
            break;
        }
      },
      returnList(){
        switch (this.qkd_status) {
          case '请款单':
            this.chooseTemShow = true
            this.qkd_show_if = false
            break;
          case '个人请款单':
            this.chooseShow = true
            this.if_qkd = false
            break;
        }
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
    },
    created(){
      this.change_types()
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
    components:{
      qkds,
      qkd,
      addQkd,
      choose,
      comQkd,
      chooseTemplate,
      cho
    }
  }
</script>

<style lang="scss">
  .forms{
    background: #FFF;
    width: 100%;
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
    .qingkuan{
      width: 96%;
      margin:  0 auto;
      #picc{
        ul{
          li{
            width: 85px;
            height: 85px;
          }
        }
      }
      .el-upload--picture-card{
        width: 85px;
        height: 85px;
        .el-upload-list__item.is-success{
          width: 85px;
          height: 85px;
        }
      }
      .el-icon-plus{
        position: relative;
        top: -25px;
      }
      .upload-demo_a{
        margin-top: 20px;
      }
    }
    .qkd_s{
      .as{
        margin-top: 0px!important;
      }
    }
  }
</style>
