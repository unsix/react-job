<template>
    <div>
      <div class="reply" v-show="replys">
        <div class="top">
          <el-button type="primary" size="small" @click="_return">返回</el-button>
          <p>审批回复列表</p>
        </div>
        <div class="listed">
          <ul>
            <li v-for="item in untreated" @click="look_item(item)">
              <img :src="item.avatar" alt="">
              <div class="replys">
                <p>{{item.name}}:回复了我的{{item.name_type}}</p>
                <p class="mar">{{item.description}}</p>
                <p>{{item.add_time}}</p>
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
      <psb v-if="psb_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></psb>
      <qgd :qk_return="qk_return" v-if="qgd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qgd>
      <cpj v-if="cpj_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"> </cpj>
      <sqgz v-if="sqgz_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></sqgz>
      <qkd :form_approval_id="form_approval_id" :change_type="change_type" v-if="qkd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qkd>
      <bxd v-if="bxd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></bxd>
      <ysd v-if="ysd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList"></ysd>
      <gzd v-if="gzd_if" :form_Lista="form_Lista" ref="gzds" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></gzd>
    </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { create_depart_list } from 'common/js/initial/depart.js'
  import { create_approval_list } from '@/common/js/approval/approval_list'
  import { create_exam_list } from '@/common/js/approval/exam'
  import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
  import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
  import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
  import { create_gongzhang_list } from '@/common/js/approval/gongzhang'
  import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
  import { create_baoxiaodan_list } from "@/common/js/approval/baoxiaodan"
  import { create_yanshoudan_list } from "@/common/js/approval/yanshoudan";
  import psb from '@/base/exam_form/psb'
  import qgd from '@/base/exam_form/qgd'
  import cpj from '@/base/exam_form/cpj'
  import qkd from '@/base/exam_form/qkd'
  import sqgz from '@/base/exam_form/sqgz'
  import bxd from '@/base/exam_form/bxd'
  import ysd from '@/base/exam_form/ysd'
  import gzd from '@/base/exam_form/gzd'
  import {getAvatar} from '@/common/js/avatar.js'
  export default {
    data(){
      return{
        pageIndex:1,
        untreated:[],
        replys:true,
        form_Lista: {},
        form_Listb: {},
        file_arr:[],
        psb_if:false,
        qgd_if:false,
        cpj_if:false,
        sqgz_if:false,
        qkd_if:false,
        bxd_if:false,
        ysd_if:false,
        gzd_if:false,
        form_approval_id:'',
        change_type:'',
        nextPageShow:true
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
      get_data(){
        let param = new URLSearchParams()
        param.append('each',10)
        param.append('p',this.pageIndex)
        let str = this.$test('/index.php/Mobile/company/reply_me_approval_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.untreated = res.data.data
              this.untreated.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
                this.$set(item,'name_type')
                switch (item.type) {
                  case '5':
                    item.name_type = '申请公章'
                    break;
                  case '6':
                    item.name_type = '呈批件'
                    break;
                  case '7':
                    item.name_type = '请购单'
                    break;
                  case '8':
                    item.name_type = '请款单'
                    break;
                  case '11':
                    item.name_type = '报销单'
                    break;
                  case '111':
                    item.name_type = '合同评审'
                    break;
                  case '12':
                    item.name_type = '验收单'
                    break;
                  case '13':
                    item.name_type = '个人请款单'
                    break;
                }
              })
              if(this.untreated.length < 10){
                this.nextPageShow = false
              }
            }else{
              this.$message.error(res.data.data)
              this._return()
            }
          })
      },
      _return(){
        this.replys = false
        this.$parent.mainShow = true
        this.$parent.list_show_once = false
      },
      look_item(item){
        this.replys = false
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("approval_id", item.approval_id);
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
        this.$http.post(str, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(res.data.data.change_type){
              this.change_type = res.data.data.change_type
            }
            if(item.name_type === '呈批件') {
              this.cpj_if = true
              this.form_Lista = create_cengpijian_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.name_type === '合同评审表') {
              this.psb_if = true
              this.form_Lista = create_hetongpingshen_list(res.data.data)
              if(this.form_Lista.many_enclosure){
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
              }else{
                this.get_img(this.form_Lista.enclosure_id)
                this.get_file(this.form_Lista.enclosure_id)
              }
            } else if(item.name_type === '请款单') {
              this.qkd_if = true
              this.form_Lista = create_qingkuandan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.name_type === '申请公章') {
              this.sqgz_if = true
              this.form_Lista = create_gongzhang_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.name_type === '请购单') {
              this.qgd_if = true
              this.form_Lista = create_qinggoudan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.name_type === '报销单'){
              this.bxd_if =true
              this.form_Lista = create_baoxiaodan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
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
              if(item.form_auto_filled_value){
                item.form_auto_filled_value = JSON.parse(item.form_auto_filled_value)
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
      returnList(){
        this.psb_if = false
        this.qgd_if = false
        this.cpj_if = false
        this.qkd_if = false
        this.sqgz_if = false
        this.bxd_if = false
        this.ysd_if = false
        this.gzd_if = false
        this.replys = true
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
    },
    created(){
      this.get_data()
    },
    components:{
      psb,
      qgd,
      cpj,
      qkd,
      sqgz,
      bxd,
      ysd,
      gzd,
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
  .reply{
    width: 100%;
    .top {
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
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
    .listed{
      li{
        background: #FFF;
        margin-top: 5px;
        overflow: hidden;
        padding:5px 0px 5px 20px;
        font-size: 14px;
        cursor: default;
        border-bottom: 1px solid #DDDDDD;
        transition: .3s;
        box-shadow: none !important;
        margin-bottom: 3px;
        &:hover {
          background: #EEEEEE;
          cursor: pointer;
        }
        img{
          width: 50px;
          height: 50px;
          margin-top: 15px;
          display: block;
          float: left;
          vertical-align: top;
        }
        .replys{
          width: 500px;
          float: left;
          margin-left: 20px;
          .mar{
            background: #EEEEEE;
            min-height: 50px;
          }
          p{
            line-height: 20px;
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
