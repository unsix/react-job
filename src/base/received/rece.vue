<template>
<div>
  <div class="re" v-show="store">
    <div class="top">
      <el-button v-show="inserted == 6" type="primary" size="small" @click="_returnsd">返回</el-button>
      <p>我的合同</p>
      <el-tabs v-model="activeName" @tab-click="handClick">
        <el-tab-pane label="未开始" name="1"></el-tab-pane>
        <el-tab-pane label="已开始" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="list">
      <ul>
        <li v-for="item in list" @click="getMoreInfo(item)">
          <span>创建时间：{{item.add_time}}</span>
          <div class="main">
            <p>{{item.contract_name}}</p>
            <p v-if="item.type == '1'">乙方姓名：{{item.worker_name}}</p>
            <p v-if="item.type == '2'">甲方公司：{{item.company_name}}</p>
            <p v-if="item.type == 2"><span  v-if="item.status == -1">失效，甲方评审未通过</span><span  v-if="item.status == 1">未签字</span><span  v-if="item.status == 2">已签字，等待甲方评审</span></p>
          </div>
          <div class="btn" v-show="item.type==1">
            <div style="height: 20px">
              <p v-show="item.take_effect == 4" @click.stop="look_history(item.contract_id,'')" style="cursor: pointer;float:right;text-align: right">验收记录</p>
              <p v-show="item.take_effect == 4" @click.stop="look_evad(item.contract_id,'')" style="cursor: pointer;float:right;margin-right:20px;text-align: right">请款记录</p>
            </div>
            <span v-if="item.log" @click.stop="once(item.log,item.contract_id)">{{item.log}}</span>
            <span v-if="item.ion" @click.stop="twice(item.ion,item.contract_id)">{{item.ion}}</span>
            <span v-if="item.fir" @click.stop='third(item.fir,item.contract_id)'>{{item.fir}}</span>
            <p v-show="item.fir == '已结束'" @click.stop="complaint()" style="cursor: pointer;text-align: right">投诉入口</p>
          </div>
          <div class="btn" v-show="item.type==2 && activeName == 2">
            <div style="height: 20px">
              <p @click.stop="look_company_contract(item.contract_temp_id,'验收')" style="cursor: pointer;float:right;text-align: right">验收记录</p>
              <p @click.stop="look_company_contract(item.contract_temp_id,'请款')" style="cursor: pointer;float:right;margin-right:20px;text-align: right">请款记录</p>
              <p @click.stop="look_company_contract(item.contract_temp_id,'结算')" style="cursor: pointer;float:right;margin-right:20px;text-align: right">结算记录</p>
            </div>
            <span @click.stop="add_ysd(item.contract_temp_id)">申请验收</span>
            <span @click.stop="add_com_qkd(item)">去请款</span>
            <span @click.stop="add_com_lxd(item)">工作联系单</span>
            <span @click.stop="add_com_jsd(item)">结算单</span>
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
      <b v-show="sign_show" @click="show_sign">签字确认</b>
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
      <div class="page">
        <span @click="first_page">首页</span>
        <span @click="last_page" v-show="pageIndex > 1">上一页</span>
        <span @click="next_page" v-show="nextPageShow">下一页</span>
      </div>
    </div>
  </div>

  <div class="person" v-show="checked">
    <div class="top">
      <el-button type="primary" size="small" @click="_recont">返回</el-button>
      <p>{{data_qkd}}</p>
    </div>
    <div class="main">
      <ul v-if="!white">
        <li v-for="item in vlurt" @click="look_destal(item)">
          <div class="left">
            <p>{{item.add_time}}</p>
            <p>类型：{{item.type}}</p>
            <p>标题：{{item.title}}</p>
          </div>
          <div class="process">
            <span v-html="item.approval_state" style="font-weight: 700; font-size: 14px;"></span>
          </div>
        </li>
      </ul>
      <ul v-if="white">
        <li v-for="item in vlurt" @click="look_crystal(item)">
          <div class="left">
            <p>{{item.add_time}}</p>
            <p>类型：{{item.type}}</p>
            <p>标题：{{item.title}}</p>
          </div>
          <div class="process">
            <span v-html="item.approval_state" style="font-weight: 700; font-size: 14px;"></span>
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

  <div class="add" v-show="addShow">
    <ul>
      <h2>{{sec_title}}</h2>
      <i class="el-icon-close" @click="asShow"></i>
      <li v-if="!add_ysd_show"  v-for="(item,index) in qkd_type" @click="show_qkd(item)">{{item}}</li>
      <li v-if="add_ysd_show" v-for="(item,index) in plan" :log_type_id="item.inspection_type_id" @click="log(item.inspection_type_id)">{{item.inspection_name}}</li>
    </ul>

  </div>

  <div class="box" v-if="qkd_show">
    <div class="top">
      <el-button type="primary" size="small" @click="_returns">返回</el-button>
      <p>{{contr_name}}</p>
      <b @click="show_sea">去复制</b>
    </div>
    <qgds class="qgd_s" ref="qgd" v-if="qgd_if" :approval_id="approval_id"></qgds>
    <qkds class="qkd_s" :contract="contract_ids" :approval_id="approval_id" :btn_show="false" :request_money_basis_type="request_money_basis_type" ref="qkd" v-if="qkd_if"></qkds>
    <cpjs class="cpj_s" ref="cpj" v-if="cpj_if" :approval_id="approval_id"></cpjs>
    <bxds class="bxd_s" ref="bxd" v-if="bxd_if" :approval_id="approval_id"></bxds>
  </div>
  <qkd v-if="if_qkd" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnListed" :file_arr="file_arr"></qkd>
  <companyQkd :form_approval_id="form_approval_id" :down_show="down_show" :change_type="change_type" v-if="qkd_com_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList_com" :file_arr="file_arr"></companyQkd>
  <ysd v-if="ysd_if" :down_show="down_show" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList_com"></ysd>
  <jsd v-if="jsd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList_com" :file_arr="file_arr"></jsd>
  <lxd v-if="lxd_show" @return_list="_return_main" :approval_id="contract_ids"></lxd>
  <chooseTemplate v-if="chooseTemShow" ref="choosetem" @returnForm="returnForm" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></chooseTemplate>

  <add_ysd v-if="add_ysd_show_cr" :inset='inset' :sec_title="con_title" :linked="linked"></add_ysd>

  <addJsd v-if="jsd_show" :qkd_status="title" :contract_name="jsd_data.contract_name"  :inset="jsd_data"></addJsd>

  <comYsd v-if="add_qkd_show_cr" :inset='inset' :qkd_status="qkd_son" :contract_name="contract_name"></comYsd>
</div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import addJsd from '@/base/contract_doc/con_qk'
  import qkd from '@/base/personal_approval/qkd_b'
  import loading from '@/base/loading/loading'
  import qgds from '@/base/personal_approval/qgd_a'
  import qkds from '@/base/personal_approval/qkd_a'
  import cpjs from '@/base/personal_approval/cpj_a'
  import bxds from '@/base/personal_approval/bxd_a'
  import ysd from '@/base/exam_form/ysd'
  import jsd from '@/base/exam_form/jsd'
  import add_ysd from '@/base/received/add_ysd'
  import comYsd from '@/base/received/add_com_qkd'
  import companyQkd from '@/base/exam_form/qkd'
  import lxd from '@/base/work_record/look_lxd'
  import {getPic} from '@/common/js/pic.js'
  import {getAvatar} from '@/common/js/avatar.js'
  import chooseTemplate from '@/base/personal_approval/inital'
  import { create_personal_list } from '@/common/js/approval/personal'
  import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
  import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
  import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
  import { create_baoxiaodan_list} from "@/common/js/approval/baoxiaodan"
  import { create_approval_list } from '@/common/js/approval/approval_list'
  import { create_exam_list } from '@/common/js/approval/exam'
  import { create_yanshoudan_list } from "@/common/js/approval/yanshoudan";
  import { create_approval_personal_list } from "@/common/js/approval/approval_personal_list";
export default {
  data(){
    return{
      qkd_type:['请款单','个人请款单'],
      contract_name:'',
      qkd_son:'',
      add_qkd_show_cr:false,
      add_ysd_show:false,
      add_ysd_show_cr:false,
      checked:false,
      qkd_com_if:false,
      ysd_if:false,
      inset:'',
      data_qkd:'',
      qgd_if:false,
      cpj_if:false,
      bxd_if:false,
      approval_id:'',
      request_money_basis_type:'',
      qkd_if:false,
      chooseTemShow:false,
      if_qkd:false,
      approval_type:'',
      activeName:'1',
      file_arr:[],
      pageIndex:'1',
      form_Lista:{},
      form_Listb:{},
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
      inserted:'0',
      sign_type:{},
      qkd_show:false,
      contr_name:'',
      contract_ids:'',
      qk_return: false,
      form_approval_id:'',
      person_data:false,
      white:'',
      change_type:'',
      down_show:false,
      jsd_if:false,
      lxd_show:false,
      jsd_show:false,
      jsd_data:{},
      title:'',
      sign_show:true
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
    add_com_qkd(pr){
      this.inset = pr.contract_temp_id
      this.contract_name = pr.contract_name
      this.addShow = true
      this.wideShow = true
      this.sec_title = '选择请款单类型'
      this.add_ysd_show = false
    },
    show_qkd(pr){
      this.qkd_son = pr
      this.add_qkd_show_cr = true
      this.addShow = false
      this.wideShow = false
      this.store = false
    },
    add_ysd(pr){
      this.inset = pr
      let httpUrl = this.$test('/index.php/Mobile/find/inspection_list')
      this.$http.post(httpUrl)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          this.addShow = true
          this.wideShow = true
          this.sec_title = '选择验收单类型'
          this.plan = res.data.data
        })
      this.addShow = true
      this.add_ysd_show = true
    },
    returnList_com(){
      this.qkd_com_if =false
      this.checked = true
      this.ysd_if =false
      this.jsd_if = false
    },
    look_evad(pr){
      this.inset = pr
      this.vlurt = []
      this.data_qkd = '请款记录'
      this.pageIndex = '1'
      this.nextPageShow = true
      let param = new URLSearchParams()
      param.append('contract_id',pr)
      param.append('p',this.pageIndex)
      param.append('each',20)
      let httpUrl = this.$test('/index.php/Mobile/personal/request_money_personal_list')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == '0'){
            if(res.data.data.length < 10){
              this.nextPageShow = false
            }
            let arr = []
            if(res.data.data.length > 0){
              res.data.data.forEach((item)=>{
                arr.push(create_personal_list(item))
              })
            }
            if(res.data.data.length < 1){
              this.$message.info('没有数据')
            }else{
              this.store = false
              this.checked = true
              this.vlurt = arr
            }
          }
        })
    },
    look_destal(res){
      this.person_data = true
      this.checked = false
      this.if_qkd = true
      this.viewInfo(res)
    },
    returnForm(){
      this.qkd_show = true
      this.chooseTemShow = false
    },
    viewInfo(item){
      this.if_cpj = false
      this.if_bxd = false
      this.if_qgd = false
      this.if_qkd = false
      let title = item.type
      this.chooseTemShow = false
      let param = new URLSearchParams()
      param.append('approval_personal_id',item.approval_personal_id)
      let str = this.$test('/index.php/Mobile/Personal/approval_personal_process_show')
      this.$http.post(str,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(title == '呈批件'){
            this.if_cpj = true
            this.form_Lista = create_cengpijian_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(title == '请购单'){
            this.if_qgd = true
            this.form_Lista = create_qinggoudan_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(title == '请款单'){
            this.if_qkd = true
            this.form_Lista = create_qingkuandan_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(title == '报销单'){
            this.if_bxd = true
            this.form_Lista = create_baoxiaodan_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }
          let item = res.data.data.approval_content
          if(item.approval_enclosure){
            let arr = []
            let zparam = new URLSearchParams()
            zparam.append('enclosure_id',item.approval_enclosure)
            let str = this.$test('/index.php/Mobile/approval/look_enclosure')
            this.$http.post(str,zparam)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                res.data.data.picture.forEach((item)=>{
                  if(item != ''){
                    arr.push(getPic(item))
                  }
                })
              })
            res.data.data.approval_content.picture_enclosure = arr
          }
          this.form_Listb = create_approval_personal_list(res.data.data.approval_content)
        })
    },
    useInfo(item){
      this.approval_id = ''
      this.top_if = true
      this.qkd_if = false
      this.qgd_if = false
      this.cpj_if = false
      this.bxd_if = false
      this.chooseTemShow = false
      this.qkd_show = true
      if(item.type == '请购单'){
        this.approval_id = item.approval_personal_id
        this.qgd_if = true
      }else if(item.type == '请款单'){
        this.approval_id = item.approval_personal_id
        this.qkd_if = true
      }else if(item.type == '呈批件'){
        this.approval_id = item.approval_personal_id
        this.cpj_if = true
      }else if(item.type == '报销单'){
        this.approval_id = item.approval_personal_id
        this.bxd_if = true
      }
    },
    _reInfo(){
      this.store = true
      this.qkd_show = false
      this.contr_name = ''
      this.contract_ids = ''
      this.approval_id = ''
    },
    returnListed(){
      this.if_cpj = false
      this.if_qgd = false
      this.if_bxd = false
      this.if_qkd = false
      if(this.person_data){
        this.checked = true
        this.person_data = false
      }else{
        this.chooseTemShow = true
      }
    },
    returnList(){
      this.jsd_show = false
      this.store = true
    },
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
      param.append('uid',this.user.uid)
      param.append('status',this.activeName-1)
      param.append('p',this.pageIndex)
      param.append('each',20)
      let httpUrl = this.$test('/index.php/Mobile/find/process_contract_list')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.$set(item,'log')
              this.$set(item,'ion')
              this.$set(item,'fir');
              //状态设置
              if(item.type == '1'){
                switch(item.take_effect){
                  case '0':
                    item.log = '同意'
                    item.ion = '不满意'
                    item.fir = '拒绝'
                    break;
                  case '1':
                    item.log = '已同意，等待甲方支付预付款'
                    break;
                  case '2':
                    item.log = '已退回'
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
                    if(item.apply_pay == null){
                      item.fir = '去请款'
                    }else{
                      item.fir = '等待甲方处理付款申请'
                    }
                    break;
                  case '5':
                    item.fir = '已结束'
                    break;
                }
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
      if(pr.status != '1'){
        this.sign_show = false
      }
      this.sign_type = pr
      this.store = false
      let httpUrl = this.$test('/index.php/Mobel/skey/look_draft?id=')
      this.linked = httpUrl+pr.contract_temp_id+'&operation=2&view=4'
      this.loadingShow = true
      setTimeout(()=>{
        this.contract = true
        this.loadingShow = false
        this.con_title = '我的合同'
      },500)
    },
    _return(){
      if(this.add_ysd_show){
        this.store = true
        this.contract = false
        this.linked = ''
      }else{
        if(this.con_title == '我的合同'){
          this.store = true
          this.contract = false
          this.linked = ''
        }else{
          this.contract = false
          this.accept = true
        }
      }
    },
    once(pr,res){
      if(pr == '同意'){
        let httpUrl = this.$test('/index.php/Mobile/find/sign')
        this.sign_link = httpUrl
        this.wideShow = true
        this.signature = true
        this.insert = res
      }
      if(pr == '等待甲方付款'){
        this.store = false
        let param = new URLSearchParams()
        param.append('contract_id',res)
        let httpUrl = this.$test('/index.php/Mobile/find/look_apply_content')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
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
        let httpUrl = this.$test('/index.php/Mobile/find/look_apply_content')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
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
          let httpUrl = this.$test('/index.php/Mobile/Find/audit_new')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
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
          let httpUrl = this.$test('/index.php/Mobile/find/examine_apply')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
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
          let httpUrl = this.$test('/index.php/Mobile/Find/audit_new')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
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
      if(pr == '去请款'){
        this.store = false
        this.qkd_show = true
        this.qkd_if = true
        this.contr_name = '请款单'
        this.contract_ids = res
      }
    },
    _returns(){
      this.store = true
      this.qkd_show = false
      this.contr_name = ''
      this.contract_ids = ''
    },
    show_sea(){
      this.qkd_show = false
      switch (this.contr_name){
        case '请购单':
          this.approval_type = 1
          break;
        case '请款单':
          this.approval_type = 2
          break;
        case '呈批件':
          this.approval_type = 3
          break;
        case '报销单':
          this.approval_type = 4
          break;
      }
      this.chooseTemShow = true
    },
    look_history(pr){
      this.inset = pr
      this.pageIndex = '1'
      this.nextPageShow = true
      this.vlurt = []
      let param = new URLSearchParams()
      param.append('contract_id',pr)
      param.append('each',10)
      param.append('p',this.pageIndex)
      let httpUrl = this.$test('/index.php/Mobile/find/apply_history')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == '0'){
            if(res.data.data.length < 10){
              this.nextPageShow = false
            }
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
      if(this.sign_type.type == 1){
        this._agree()
      }else{
        this._agreed()
      }

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
          let httpUrl = this.$test('/index.php/Mobile/Find/audit_new')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
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
    _agreed(){
      this.$confirm('确认签署合同','提示',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
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
            param.append('contract_request_id',this.sign_type.contract_temp_id)
            param.append('signatory_b',res.data.hash)
            this.loadingShow = true
            let httpUrl = this.$test('/index.php/mobile/find/contract_temp_signatory_b')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
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
      }).catch(()=>{
        this.$message.warning('已取消操作')
      })
    },
    _returned(){
      this.store = true
      this.accept = false
      this.earn_money = ''
    },
    _right(pr){
      this.accept = false
      let httpUrl = this.$test('/index.php/Mobel/skey/look_draft?id=')
      this.linked = httpUrl+pr+'&operation=2&view=1'
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
        let httpUrl = this.$test('/index.php/Mobile/skey/look_inspection?type=1&operation=2&form_id=')
        this.linked = httpUrl+this.pubg.apply_content.inspection_id
        this.loadingShow = true
        setTimeout(()=>{
          this.contract = true
          this.loadingShow = false
          this.con_title = '验收单'
        },500)
      }else{
        let httpUrl = this.$test('/index.php/Mobile/find/inspection_list')
        this.$http.post(httpUrl)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
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
        let httpUrl = this.$test('/index.php/Mobile/skey/look_inspection?type=2&operation=2&form_id=')
        this.linked = httpUrl+this.pubg.apply_content.settlement_id
        this.loadingShow = true
        setTimeout(()=>{
          this.contract = true
          this.loadingShow = false
          this.con_title = '结算单'
        },500)
      }else{
        let httpUrl = this.$test('/index.php/Mobile/find/seelement_list')
        this.$http.post(httpUrl)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
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
      let httpUrl = this.$test('/index.php/Mobile/skey/look_inspection?type=1&operation=2&form_id=')
      this.linked = httpUrl+pr
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
      let httpUrl = this.$test('/index.php/Mobile/skey/look_inspection?type=2&operation=2&form_id=')
      this.linked = httpUrl+pr
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
      this.checked = false
      this.inset = ''
      this.data_qkd = ''
      this.white = ''
      this._getInfo()
    },
    asShow(){
      this.addShow = false
      this.wideShow = false
    },
    log(pr){
      if(this.add_ysd_show){
        this.store = false
        this.addShow = false
        this.wideShow = false
        this.accept = false
        this.add_ysd_show_cr = true
        if(this.sec_title == '选择验收单类型'){
          this.linked = pr
          this.con_title = '填写验收单'
        }else{
          this.linked = pr
          this.con_title = '填写结算单'
        }
      }else{
        this.addShow = false
        this.wideShow = false
        this.accept = false
        this.contract = true
        if(this.sec_title == '选择验收单类型'){
          let httpUrl = this.$test('/index.php/Mobile/skey/look_inspection?type=1&form_type_id=2&operation=1&form_id=')
          this.linked = httpUrl + pr
          this.con_title = '填写验收单'
        }else{
          let httpUrl = this.$test('/index.php/Mobile/skey/look_inspection?type=2&form_type_id=1&operation=1&form_id=')
          this.linked = httpUrl + pr
          this.con_title = '填写结算单'
        }
      }
    },
    _returnsd(){
      this.$parent.deta = true
      this.$parent.infos = true
      this.$parent.ysd_if = false
      this.$parent.infoShow = true
      this.$parent.receShow = false
      this.inserted = 0
    },
    show_sign(){
      let httpUrl = this.$test('/index.php/Mobile/find/sign')
      this.sign_link = httpUrl
      this.wideShow = true
      this.signature = true
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
    look_company_contract(pr,res){
      this.inset = pr
      this.pageIndex = '1'
      this.nextPageShow = true
      this.vlurt = []
      this.white = res
      let param = new URLSearchParams()
      param.append('each',20)
      param.append('p',this.pageIndex)
      if(res == '请款'){
        param.append('type',4)
        this.data_qkd = '请款记录'
      }else if(res == '验收'){
        param.append('type',3)
        this.data_qkd = '验收记录'
      }else if(res == '结算'){
        this.data_qkd = '结算记录'
      }
      let httpUrl = ''
      if(res == '结算'){
        param.append('contract_id',pr)
        httpUrl = this.$test('/index.php/Mobile/find/find_settle_list')
      }else{
        param.append('contract_request_id',pr)
        httpUrl = this.$test('/index.php/mobile/find/get_approval_id_from_contract')
      }
      this.$http.post(httpUrl,param)
        .then((res)=>{
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.vlurt.push(create_exam_list(item))
              this.checked = true
              this.store = false
            })
            if(this.vlurt.length < 10){
              this.nextPageShow =false
            }
          }else{
            this.$message.error(res.data.message)
          }
        })
    },
    look_crystal(item){
      if(item.approval_state.indexOf('通过')!= '-1'){
        this.down_show = true
      }
      this.checked = false
      this.form_approval_id = item.approval_id
      let param = new URLSearchParams();
      param.append("uid", this.user.uid);
      param.append("approval_id", item.approval_id);
      let str = this.$test("/index.php/Mobile/approval/approval_process_show")
      this.$http.post(str, param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.data.change_type){
            this.change_type = res.data.data.change_type
          }
          if(item.type === '请款单') {
            this.qkd_com_if = true
            this.form_Lista = create_qingkuandan_list(res.data.data)
            this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)

          }else if(item.type == '验收单'){
            this.ysd_if = true
            this.form_Lista = res.data.data
            this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(item.type == '结算单'){
            this.jsd_if = true
            this.form_Lista = res.data.data
            this.form_Lista.project_manager_name = this.form_Lista.project_manager_name.name
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
    add_com_lxd(item){
      this.store = false
      this.lxd_show = true
      this.contract_ids = item.contract_temp_id
    },
    add_com_jsd(item){
      this.store = false
      this.jsd_show = true
      this.jsd_data = item
      this.title= '结算单'
    },
    _return_main(){
      this.lxd_show = false
      this.store = true
      this.contract_ids = ''
    }
  },
  created(){
    this._getInfo()
  },
  watch:{
    pageIndex(){
      if(this.store){
        this._getInfo()
      }else if(this.check){
        this.look_history(this.inset)
      }else if(this.checked){
        if(this.white){
          this.look_company_contract(this.inset,this.white)
        }else{
          this.look_evad(this.inset)
        }
      }
    }
  },
  components:{
    loading,
    qgds,
    qkds,
    cpjs,
    bxds,
    qkd,
    ysd,
    chooseTemplate,
    companyQkd,
    add_ysd,
    comYsd,
    jsd,
    lxd,
    addJsd
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
    if(this.$route.path === '/work/rece') {
      this.$emit('changeWorkIndex', '5-2-1')
    }
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.$refs.wide.style.height = h + 'px'
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
    .qingkuan{
      width: 95%;
      margin: 20px auto 0;
      .as{
        margin-top: 0!important;
      }
    }
  }
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
  .person{
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
          padding: 10px 10px;
          background: #ffffff;
          margin-bottom: 5px;
          /*margin-top: 5px;*/
          overflow: hidden;
          oz-box-shadow: 1px 1px 2px #999999;
          -webkit-box-shadow: 1px 1px 2px #999999;
          box-shadow: 1px 1px 2px #999999;
          .left{
            width: 88%;
            float: left;
            p{
              padding:0 10px;
              font-size: 14px;
              span{
                float: right;
              }
            }
          }
          .process {
            float: left;
            margin-top: 10px;
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
