<template>
  <div>
    <div v-if="wrapper">
      <div class="mained" v-show="mian_show">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>{{sec_title}}</p>
          <b @click="show_sign">去复制</b>
        </div>
        <addYsd :inspection_type_id="linked" v-if="ysd_if" :insdent="inset" :approval_id="approval_id7"></addYsd>
      </div>
      <ysd v-if="ysd_show" :form_Lista="form_Lista"  :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList"></ysd>
      <chooseTemplate style="background: #FFF" v-if="chooseTemShow"  @returnForm="returnForm" :insert="0" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></chooseTemplate>
    </div>
    <cho  v-else :title="tips"></cho>
  </div>
</template>

<script>
  import cho from '@/base/add_approval/cho'
  import { mapGetters, mapMutations } from 'vuex'
  import addYsd from '@/base/add_approval/add_ysd'
  import ysd from '@/base/exam_form/ysd'
  import chooseTemplate from '@/base/add_approval/choose_template'
  import { create_yanshoudan_list } from "@/common/js/approval/yanshoudan";
  import { create_approval_list } from '@/common/js/approval/approval_list'
  export default {
    data(){
      return{
        ys_list:[],
        js_list:[],
        gz_list:[],
        tips:'',
        wrapper:true,
        mian_show:true,
        approval_type:'12',
        chooseTemShow:false,
        approval_id7:'',
        ysd_if:true,
        form_Lista:{},
        form_Listb:{},
        ysd_show:false
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
      _return(){
        this.ys_list = []
        this.js_list = []
        this.gz_list = []
        this.$parent.store = true
        this.$parent.add_ysd_show_cr = false
      },
      show_sign(){
        this.mian_show = false
        this.ysd_if = false
        this.chooseTemShow = true
      },
      returnForm(){
        this.mian_show = true
        this.ysd_if = true
        this.chooseTemShow = false
      },
      returnList(){
        this.ysd_show = false
        this.chooseTemShow = true
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
      viewInfo(item){
        this.chooseTemShow = false
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("approval_id", item.approval_id);
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
        this.$http.post(str, param)
          .then((res)=>{
            if(item.type == '验收单'){
              this.ysd_show = true
              this.form_Lista = create_yanshoudan_list(res.data.data)
            }
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
        this.chooseTemShow = false
        this.mian_show = true
        if(item.type === '验收单'){
          this.approval_id7 = item.approval_id
          this.ysd_if = true
        }
      }
    },
    created(){

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
    props:{
      linked:{

      },
      sec_title:{

      },
      inset:{

      }
    },
    components:{
      addYsd,
      chooseTemplate,
      ysd,
      cho
    }
  }
</script>

<style lang="scss">
  .mained{
    width: 100%;
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
  }
</style>
