<template>
  <div>
    <div class="deta" v-show="deta">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>{{moreInfo.name}}</p>
        <b><i class="iconfont icon-xiazai19" style="color: #62A4D7;cursor: pointer" @click="showMap"></i></b>
      </div>
      <div class="main">
        <img :src="moreInfo.avatar" alt="" @click="picShow(moreInfo.avatar)">
        <ul>
          <li>姓名：{{moreInfo.name}}</li>
          <li>职业：{{moreInfo.type}}</li>
          <li><i class="iconfont icon-weibiaoti-" style="color: #7CC7FF"></i>{{moreInfo.phone}}</li>
          <li><i class="iconfont icon-xiaoxi" style="color: #50BCBC;"></i>找他聊聊</li>
        </ul>
      </div>
    </div>
    <div class="info" v-show="infos">
      <div class="info_one">
        <ul>
          <li>年龄<span v-show="moreInfo.age != ''">{{moreInfo.age}}岁</span><span v-show="moreInfo.age == ''">无</span></li>
          <li>籍贯<span v-show="moreInfo.hometown != ''">{{moreInfo.hometown}}</span><span v-show="moreInfo.hometown == ''">无</span></li>
          <li>好评率<span>好评率{{moreInfo.nice}}%</span></li>
          <li>雇佣次数<span>被雇佣次数{{moreInfo.work_num}}次</span></li>
          <li>期望薪资<span>{{moreInfo.salary}}</span></li>
          <li>支付宝<span>无</span></li>
          <li>银行卡<span>无</span></li>
          <li>身份证号<span>{{moreInfo.idcard}}</span></li>
          <li>QQ<span v-show="moreInfo.qq != ''">{{moreInfo.qq}}</span><span v-show="moreInfo.qq == ''">无</span></li>
          <li>微信<span>{{moreInfo.wechat}}</span></li>
          <li>暂住地址<span v-show="moreInfo.address != ''">{{moreInfo.address}}</span><span v-show="moreInfo.address == ''">无</span></li>
          <li>个人评价<span>无</span></li>
          <li @click="show_opus">往期作品<span>查看</span></li>
          <li>金主评价<span>查看</span></li>
        </ul>
      </div>
      <div class="bottom">
        <span @click="_get_contract"  v-show="star"><i class="iconfont icon-fasongxinxi" style="color: #B6D8F2;" ></i>发送...</span>
        <span @click="_collect" ><i class="iconfont icon-wujiaoxing" ref="star" style="color: orange;"></i>加入收藏</span>
      </div>
    </div>

    <div class="contra" v-show="contr">
      <ul v-show="insert == 0">
        <h2>选择审批类型</h2>
        <i class="el-icon-close" @click="asShow"></i>
        <li v-for="item in types" @click="choose_add(item)">{{item}}</li>
      </ul>
      <ul v-show="insert == 6">
        <i class="el-icon-close" @click="asShow"></i>
        <li v-for="item in list_con" @click="sel_con(item.contract_type_id,item.contract_name)">{{item.contract_name}}</li>
      </ul>
      <ul v-show="insert == 11">
        <h2>选择请款依据</h2>
        <i class="el-icon-close" @click="asShow"></i>
        <li v-for="item in atype" @click="check_add(item)">{{item}}</li>
      </ul>
    </div>

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

    <div class="pic" ref="pic" v-show="show_pic">
      <i class="el-icon-close" @click="close_pp"></i>
      <img ref="img" :src="linked">
    </div>

    <div class="wide" ref="wide" v-show="wideShow"></div>

    <div class="maps" v-show="map">
      <div class="top">
        <el-button type="primary" size="small" @click="_remap">返回</el-button>
        <p>定位</p>
      </div>
      <div class="map" id="map"></div>
    </div>

    <loading v-show="loadingShow" style="z-index: 9999999"></loading>

    <ysd v-show="ysd_if" ref="ysd"></ysd>

    <opus v-show="op_if" ref="opus" :worker_id="u_id"></opus>

    <div class="as_qingkuan" v-if="at_qingkuanShow">
      <ul>
        <li v-for="(item,index) in untreated" :key="item.approval_id" ref="list">
          <div class="edit">
            <el-button type="primary" round @click="qkView(item,index)">查看</el-button>
            <el-button type="success" round @click="qkUser(item,index)">使用</el-button>
            <div class="process">
              <span v-html="item.approval_state" style="font-weight: 700; font-size: 14px;"></span>
            </div>
          </div>
          <div class="content">
            <div class="title">
              <span>{{item.add_time}}</span>
            </div>
            <div class="type">
              <span>标题：{{item.title}}</span>
            </div>
            <div class="type">
              <span>类型：{{item.type}}</span>
            </div>
          </div>
        </li>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </ul>
    </div>

    <div class="qgd" v-show="top_if">
      <div class="top">
        <el-button type="primary" size="small" @click="_reInfo">返回</el-button>
        <p>{{con_title}}</p>
        <b @click="_righted" style="cursor: pointer">从模板选择</b>
      </div>
      <qgds class="qgd_s" ref="qgd" v-if="qgd_if" :approval_id="approval_id"></qgds>
      <qkds class="qkd_s" :form_approval_id="form_approval_id" :approval_id="approval_id" :request_money_basis_type="request_money_basis_type" ref="qkd" v-if="qkd_if"></qkds>
      <cpjs class="cpj_s" ref="cpj" v-if="cpj_if" :approval_id="approval_id"></cpjs>
      <bxds class="bxd_s" ref="bxd" v-if="bxd_if" :approval_id="approval_id"></bxds>
    </div>

    <chooseTemplate v-if="chooseTemShow" ref="choosetem" @returnForm="returnForm" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></chooseTemplate>
    <qgd :qk_return="qk_return" @return_qk="return_qk" ref="qgd_a" v-show="if_qgd" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qgd>
    <cpj v-show="if_cpj" :form_Lista="form_Lista" ref="cpj_a" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"> </cpj>
    <qkd :form_approval_id="form_approval_id" v-if="if_qkd" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qkd>
    <bxd v-if="if_bxd" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></bxd>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { getCro } from "@/common/js/crowd"
  import {getAvatar} from "../../common/js/avatar";
  import {getPic} from '@/common/js/pic.js'
  import { create_personal_list } from '@/common/js/approval/personal'
  import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
  import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
  import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
  import { create_baoxiaodan_list} from "@/common/js/approval/baoxiaodan"
  import { create_approval_personal_list } from "@/common/js/approval/approval_personal_list";
  import loading from '@/base/loading/loading'
  import ysd from '@/base/received/rece'
  import opus from '@/base/myOpus/opus'
  import qgds from '@/base/personal_approval/qgd_a'
  import qkds from '@/base/personal_approval/qkd_a'
  import cpjs from '@/base/personal_approval/cpj_a'
  import bxds from '@/base/personal_approval/bxd_a'
  import cpj from '@/base/personal_approval/cpj_b'
  import qgd from '@/base/personal_approval/qgd_b'
  import bxd from '@/base/personal_approval/bxd_b'
  import qkd from '@/base/personal_approval/qkd_b'
  import chooseTemplate from '@/base/personal_approval/inital'

  export default {
  data(){
    return{
      moreInfo:'',
      show_pic:false,
      linked:'',
      wideShow:false,
      infos:true,
      deta:true,
      map:false,
      x:'',
      y:'',
      loadingShow:false,
      contr:false,
      list_con:[],
      con_main_show:false,
      core:'',
      title:'',
      signShow:false,
      sign_link:'',
      signature:false,
      signImg:'',
      pic_hash:'',
      u_id:'',
      contract_type_id:'',
      issc :'',
      star : true,
      types:['发送合同','验收单','请购单','请款单','呈批件','报销单'],
      atype:['请购单','呈批件'],
      insert:'0',
      ysd_if:false,
      op_if:false,
      qgd_if:false,
      con_title:'',
      top_if:false,
      qkd_if:false,
      untreated:[],
      at_qingkuanShow: false,
      pageIndex:1,
      approval_type:'',
      nextPageShow:true,
      cpj_if:false,
      bxd_if:false,
      form_approval_id:'',
      request_money_basis_type:'',
      if_cpj:false,
      form_Lista:{},
      form_Listb:{},
      file_arr:[],
      qk_return: false,
      if_qgd:false,
      chooseTemShow:false,
      approval_id:'',
      if_qkd:false,
      if_bxd:false
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
    _getInfo(pr,re){
      this.u_id = pr
      let param = new URLSearchParams()
      param.append('uid',pr)
      param.append('user_id',re)
      this.$http.post('/index.php/Mobile/Find/worker_info',param)
        .then((res)=>{
          if(res.data.code == 0){
            this.moreInfo = res.data.data.worker
            this.moreInfo.avatar = getAvatar(this.moreInfo.avatar)
            let str = ''
            let arr = this.moreInfo.type
            for(var ss in arr){
              str += arr[ss]
            }
            if(res.data.data.issc == 1){
              this.$refs.star.style.color = 'red'
            }
            this.moreInfo.type = str
            this.x = this.moreInfo.longitude
            this.y = this.moreInfo.latitude
          }
        })
    },
    _return(){
      this.$parent.mains = true
      this.$parent.detail_show = false
      this.$refs.star.style.color = '#FFB59B'
    },
    close_pp(){
      this.wideShow = false
      this.show_pic = false
      this.$refs.img.src = ''
      document.body.style.overflow = 'visible'
    },
    picShow(es){
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.$refs.wide.style.height = h + 'px'
      this.$refs.pic.style.height = h + 'px'
      this.wideShow = true
      this.show_pic = true
      var str = ''
      str = es.split('?')
      this.$refs.img.src = str[0]
      document.body.style.overflow = 'hidden'
    },
    showMap(){
      this.deta = false
      this.infos = false
      this.map = true
      this.loadingShow = true
      setTimeout(()=>{
        this.loadingShow = false
        this._creatMap()
      },200)
    },
    _remap(){
      this.deta = true
      this.infos = true
      this.map = false
    },
    _creatMap(){
      var map = new BMap.Map("map");
      if(this.x != '' || this.y != ''){
        var point = new BMap.Point(this.x,this.y)
      }else{
        var point = new BMap.Point(116.404, 39.915)
      }
      map.centerAndZoom(point,14)
      map.enableScrollWheelZoom(true)
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.MapTypeControl())
      var marker = new BMap.Marker(point)
      map.addOverlay(marker);
    },
    _get_contract(){
      let param = new URLSearchParams()
      param.append('type',2)
      this.$http.post('index.php/Mobile/find/select_contract_companty_types',param)
        .then((res)=>{
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
      this.insert = 0
      document.body.style.overflow = 'visible'
    },
    sel_con(res,tip){
      this.contract_type_id = res
      let str = 'index.php/Mobile/skey/look_draft?id=' + res +'&operation=1&view=1'
      this.core = str
      this.wideShow = false
      this.contr = false
      this.infos = false
      this.deta = false
      this.title = tip
      this.loadingShow = true
      setTimeout(()=>{
        this.con_main_show = true
        this.loadingShow = false
      },1000)
    },
    _getToken(uid) {
      let nparam = new URLSearchParams();
      nparam.append("uid", this.user.uid);
      this.$http.post("/index.php/Mobile/path/get_token", nparam)
        .then((res) => {
          this.setToken(res.data.data)
        })
    },
    _returned(){
      this.con_main_show = false
      this.infos = true
      this.deta = true
      if(this.signImg){
        this.$refs.sign.contentWindow.remote()
      }
      this.title = ''
      this.core = ''
    },
    _right(){
      this.sign_link = 'index.php/Mobile/find/sign'
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
      if(this.signImg == ''){
        this.$message.error('请签字')
      }
      if(tips.length > 0){
        this.$message.error(tips)
      }else{
        let result = this.$refs.indx.contentWindow.result
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
            this.$http.post('index.php/Mobile/find/addcontract_new',param)
              .then((res)=>{
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
    _collect(){
      if(this.$refs.star.style.color == 'orange'){
        let param = new URLSearchParams()
        param.append('worker_id',this.u_id)
        param.append('uid',this.user.uid)
        param.append('status','1')
        this.$http.post('/index.php/Mobile/Find/collect',param)
          .then((res)=>{
            if(res.data.code == 0){
              this.$message.success('收藏成功')
              this.$refs.star.style.color = 'red'
            }else{
              this.$message.error('收藏失败')
            }
          })
      }
      if(this.$refs.star.style.color == 'red'){
        let param = new URLSearchParams()
        param.append('worker_id',this.u_id)
        param.append('uid',this.user.uid)
        param.append('status','0')
        this.$http.post('/index.php/Mobile/Find/collect',param)
          .then((res)=>{
            if(res.data.code == 0){
              this.$message.success('取消收藏成功')
              this.$refs.star.style.color = 'orange'
            }else{
              this.$message.error('取消收藏失败')
            }
          })
      }
    },
    choose_add(pr){
      switch (pr){
        case '发送合同':
          this.insert = 6
          break;
        case '验收单':
          this.ysd_if = true
          this.deta = false
          this.infos = false
          this.wideShow = false
          this.$refs.ysd.inserted = '6'
          this.$refs.ysd.activeName = '2'
          this.$refs.ysd._getInfo()
          this.contr = false
          break;
        case '请购单':
          this.qgd_if = true
          this.top_if = true
          this.deta = false
          this.infos = false
          this.wideShow = false
          this.contr = false
          this.con_title = '请购单'
          break;
        case '请款单':
          this.insert = 11
          break;
        case '呈批件':
          this.top_if = true
          this.cpj_if = true
          this.deta = false
          this.infos = false
          this.wideShow = false
          this.contr = false
          this.con_title = '呈批件'
          break;
        case '报销单':
          this.top_if = true
          this.bxd_if = true
          this.deta = false
          this.infos = false
          this.wideShow = false
          this.contr = false
          this.con_title = '报销单'
          break;
      }
    },
    show_opus(){
      this.deta = false
      this.infos = false
      this.op_if = true
      this.$refs.opus.insert = 6
      this.$refs.opus._getInfo()
    },
    _righted(){
      this.top_if = false
      this.cpj_if = false
      this.qgd_if = false
      this.qkd_if = false
      this.bxd_if = false
      switch (this.con_title){
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
    _reInfo(){
      this.deta = true
      this.infos = true
      this.qkd_if = false
      this.qgd_if = false
      this.top_if = false
      this.bxd_if = false
      this.cpj_if = false
      this.con_title = ''
    },
    check_add(pr){
      this.deta = false
      this.infos = false
      this.wideShow = false
      this.contr = false
      this.insert = '0'
      if(pr == '请购单'){
        this.approval_type = '1'
        this._getExamList()
      }
      if(pr == '呈批件'){
        this.approval_type = '3'
        this._getExamList()
      }
    },
    first_page() {
      this.nextPageShow = true
      this.pageIndex = 1
      this._getExamList()
    },
    last_page() {
      this.nextPageShow = true
      --this.pageIndex
      this._getExamList()
    },
    next_page() {
      ++this.pageIndex
      this._getExamList()
    },
    _getExamList(){
      let param = new URLSearchParams()
      param.append('approval_type',this.approval_type)
      param.append('p',this.pageIndex)
      param.append('each',10)
      param.append('approval_state',1)
      param.append('type',2)
      this.$http.post('index.php/Mobile/personal/select_personal_approval',param)
        .then((res)=>{
          if(res.data.code == 0){
            let arr = []
            res.data.data.forEach((item) => {
              arr.push(create_personal_list(item))
            })
            this.untreated = arr
            this.at_qingkuanShow = true
            if(arr.length < 10) {
              this.nextPageShow = false
            }
          }else if(res.data.code == 250){
            this.$message.error('没有数据')
            this.deta = true
            this.infos = true
          }
        })
    },
    qkView(item){
      this.qk_return = true
      this.at_qingkuanShow = false
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      param.append('approval_personal_id',item.approval_personal_id)
      this.$http.post('index.php/Mobile/Personal/approval_personal_process_show',param)
        .then((res)=>{
          if(item.type == '呈批件'){
            this.if_cpj = true
            this.$refs.cpj_a.insert = '6'
            this.form_Lista = create_cengpijian_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(item.type == '请购单'){
            this.if_qgd = true
            this.$refs.qgd_a.insert = '6'
            this.form_Lista = create_qinggoudan_list(res.data.data)
            console.log(res.data.data)
            console.log(this.form_Lista)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }
          let adobe = res.data.data.approval_content
          if(adobe.picture_enclosure){
            let arr = []
            let zparam = new URLSearchParams()
            zparam.append('enclosure_id',adobe.picture_enclosure)
            this.$http.post('/index.php/Mobile/approval/look_enclosure',zparam)
              .then((res)=>{
                res.data.data.picture.forEach((item)=>{
                  if(item != ''){
                    arr.push(getPic(item))
                  }
                })
              })
            res.data.data.approval_content.picture_enclosure = arr
          }
          this.form_Listb = create_approval_personal_list(res.data.data.approval_content)
          console.log(this.form_Listb)
        })
    },
    qkUser(item){
      this.form_approval_id = ''
      this.form_approval_id = item.approval_personal_id
      this.request_money_basis_type = item.type
      this.qkd_if = true
      this.top_if = true
      this.deta = false
      this.infos = false
      this.wideShow = false
      this.contr = false
      this.con_title = '请款单'
      this.at_qingkuanShow = false
    },
    returnList(){
      this.if_cpj = false
      this.if_qgd = false
      this.if_bxd = false
      this.if_qkd = false
      if(!this.con_title){
        this.at_qingkuanShow = true
      }else{
        this.chooseTemShow = true
      }
    },
    get_img(many_enclosure) {
      if(!many_enclosure) {
        return
      }
      if(typeof many_enclosure == 'string'){
        let param = new URLSearchParams();
        param.append("enclosure_id", many_enclosure);
        this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
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
            this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                getCro(judge,current)
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
          this.$http.post("/index.php/Mobile/approval/look_attachments", param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              let obj = {}
              let file_data = res.data.data
              let file_add = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
              obj.name = file_data.file_name+'.'+file_data.attribute
              obj.address = file_add
              this.file_arr.push(obj)
            })
        }
      })
    },
    return_qk(){
      this.if_qgd = false
      this.qk_return = false
      this.at_qingkuanShow = true
    },
    returnForm(){
      this.chooseTemShow = false
      this.top_if = true
      if(this.con_title == '呈批件'){
        this.cpj_if = true
      }else if(this.con_title == '请购单'){
        this.qgd_if = true
      }else if(this.con_title == '请款单'){
        this.qkd_if = true
      }else if(this.con_title == '报销单'){
        this.bxd_if = true
      }
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
      this.$http.post('/index.php/Mobile/Personal/approval_personal_process_show',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
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
          if(item.picture_enclosure){
            let arr = []
            let zparam = new URLSearchParams()
            zparam.append('enclosure_id',item.picture_enclosure)
            this.$http.post('/index.php/Mobile/approval/look_enclosure',zparam)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                getCro(judge,current)
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
    useInfo(item) {
      this.approval_id = ''
      this.top_if = true
      this.qkd_if = false
      this.qgd_if = false
      this.cpj_if = false
      this.bxd_if = false
      this.chooseTemShow = false
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
    }
  },
  mounted(){
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.$refs.wide.style.height = h + 'px'
  },
  components:{
    loading,
    ysd,
    opus,
    qgds,
    qkds,
    cpjs,
    bxds,
    cpj,
    qgd,
    bxd,
    qkd,
    chooseTemplate
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
  created(){
    this._getToken()
  }
}
</script>

<style lang="scss">
.deta{
  width: 100%;
  background: #Fff;
  overflow: hidden;
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
    width: 100%;
    overflow: hidden;
    img{
      border-radius: 50%;
      margin: 40px 15px 20px 20px;
      float: left;
      width: 50px;
      height: 50px;
    }
    ul{
      float: left;
      line-height: 22px;
      margin: 20px 0;
    }
  }
  .tab{
    width: 100%;
    .el-tabs{
      width: 100%;
      .el-tabs__item{
        width: 200px;
        text-align: center;
      }
    }
  }
}
.info{
  width: 100%;
  .info_one{
    width: 100%;
    background: #FFf;
    color: #5a5e66;
    ul{
      li{
        border-bottom: 1px solid #e3e4e9;
        padding: 10px 20px;
        span{
          float: right;
        }
      }
    }
  }
  .comment{
    width: 100%;
    background: #FFf;
    color: #5a5e66;
    height: 450px;
    overflow-y: auto;
  }
  .works{
    width: 100%;
    background: #FFf;
    color: #5a5e66;
    height: 450px;
    overflow-y: auto;
  }
  .bottom{
    background: #Fff;
    padding: 20px 0;
    display: flex;
    display: -webkit-flex;
    span{
      flex-grow: 1;
      display: inline-block;
      text-align: center;
      cursor: pointer;
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
.pic{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99999;
  i{
    font-size: 58px;
    color: white;
    float: right;
    margin: 50px;
    cursor: pointer;
    &:hover{
      color: red;
    }
  }
  img{
    display: block;
    margin: 250px auto;
  }
}
.maps{
  width: 100%;
  background: #Fff;
  overflow: hidden;
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
  }
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
#map{
  height: 600px;
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
.qgd{
  width: 100%;
  background: #Fff;
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
  .qgd_s{
    width: 96%;
    margin: 20px auto;
    padding-bottom: 20px;
  }
  .qkd_s{
    width: 96%;
    margin: 20px auto;
    padding-bottom: 20px;
  }
  .cpj_s{
    width: 96%;
    margin: 20px auto;
    padding-bottom: 20px;
  }
  .bxd_s{
    width: 96%;
    margin: 20px auto;
    padding-bottom: 20px;
  }
}
.as_qingkuan {
  width: 600px;
  background: #fff;
  >ul {
    padding: 4px;
    >.page {
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
    >button {
      margin-bottom: 10px;
    }
    >li {
      display: block;
      margin-bottom: 10px;
      color: #2D2F33;
      font-size: 13px;
      oz-box-shadow: 1px 1px 2px #999999;
      -webkit-box-shadow: 1px 1px 2px #999999;
      box-shadow: 1px 1px 2px #999999;
      >.avatar {
        display: inline-block;
        vertical-align: top;
        margin: 8px 15px 0 15px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          display: block;
        }
      }
      >.edit {
        display: inline-block;
        float: right;
        margin-right: 20px;
        margin-top: 10px;
        cursor: pointer;
        .el-button.is-round {
          padding: 4px 12px;
          display: block;
          margin-bottom: 5px;
        }
        .el-button+.el-button {
          margin-left: 0;
        }
        .process {
          margin-top: 10px;
        }
      }
      .content {
        cursor: default;
        padding: 12px 10px;
        display: inline-block;
        >div {

          line-height: 25px;
          max-width: 350px;
        }
      }
    }
  }
}
</style>
