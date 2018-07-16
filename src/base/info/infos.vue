<template>
  <div>
    <div class="infos" v-show="infoShow">
      <div class="top">
        <p>消息提醒</p>
      </div>
      <ul>
        <li @click="look_con">我收到的合同</li>
        <li @click="approval">审批处理</li>
        <li @click="chat">群聊</li>
      </ul>
    </div>

    <div class="mains" v-if="main_If">
      <div class="nav">
        <el-button type="primary" size="small" @click="_return" v-show="!searchShow">返回</el-button>
        <transition name="fade">
          <el-tabs v-model="activeName" @tab-click="handleClick" v-show="!searchShow">
            <el-tab-pane label="未处理" name="1"></el-tab-pane>
            <el-tab-pane label="已处理" name="2"></el-tab-pane>
            <el-tab-pane label="我发起的" name="3"></el-tab-pane>
          </el-tabs>
        </transition>
        <div class="filtrate" @click="doFiltrate">筛选<i :class="{ 'el-icon-arrow-up': searchShow, 'el-icon-arrow-down': !searchShow }"></i></div>
      </div>
      <transition name="fade1">
        <div class="search" v-show="searchShow">
          <div class="one">
            <el-radio v-model="classRadio" @change="btn_a" label="1">我处理的</el-radio>
            <el-radio v-model="classRadio" @change="btn_a" label="2">我发起的</el-radio>
          </div>
          <div class="two">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInfo" style="display: inline-block;">
            </el-input>
          </div>
          <div class="three">
            <span v-for="(item,index) in group" :class="{'active':classIndex === index}" @click="classButton(item,index)">{{item}}</span>
          </div>
        </div>
      </transition>
      <div class="list" v-show="listSeaShow">
        <ul>
          <li v-for="(item,index) in untreated" :key="item.approval_id" ref="list" :style="{background:item.tagging}">
            <div class="avatar" v-if="ilaunched">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="edit">
              <el-button type="primary" round @click="listCli(item,item.approval_state)">查看</el-button>
              <el-button type="danger" round v-show="item.approval_state.indexOf('审批') != -1 && activeName == '3'" @click="deleteForm(item.approval_personal_id)">删除</el-button>

              <div class="process" v-if="approval_process">
                <span v-html="item.approval_state" style="font-weight: 700; font-size: 14px;"></span>
              </div>

            </div>
            <div class="content">
              <div class="name" v-if="ilaunched">
                <span>姓名：{{item.name}}</span>
              </div>
              <div class="title">
                <span>标题：{{item.title}}</span>
              </div>
              <div class="type">
                <span>类型：{{item.type}}</span>
              </div>
              <div class="creatTime" v-if="!handle_time_show">
                <span>发起时间：{{item.add_time}}</span>
              </div>
              <!--<div class="creatTime" v-if="handle_time_show">-->
                <!--<span>发起时间：{{item.creat_time}}</span>-->
              <!--</div>-->
              <div class="creatTime" v-if="handle_time_show">
                <span>处理时间：{{item.add_time}}</span>
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
    </div>

    <div class="form_box" v-show="formShow">
      <div class="top">
        <el-button type="info" plain @click="return_list">返回列表</el-button>
        <el-button type="primary" plain @click="down" v-show="downShow">下载</el-button>
        <!--<el-button type="primary" plain @click="repeal" v-show="repealShow">撤销</el-button>-->
        <div class="as">
          <el-button type="primary" plain @click="fileAccord(form_Lista)" v-show="now_type_name === '请款单'">依据附件</el-button>
          <el-button type="primary" plain @click="viewHt(form_Lista)" v-if="form_Lista.contract_id">合同附件</el-button>
        </div>
        <span class="title">{{now_type_name}}</span>
      </div>
      <div class="form" name="呈批件" v-if="cengpijian_show">
        <div class="top">
          <span class="title">呈批件</span>
        </div>
        <div>
          <span>呈批标题：</span><span>{{form_Lista.title}}</span>
        </div>
        <div>
          <span>文件编号：</span><span>{{form_Lista.chengpi_num}}</span>
        </div>
        <div>
          <span>主题内容：</span><span>{{form_Lista.content}}</span>
        </div>
        <div>
          <span>附件列表：</span>
          <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
        </div>
        <div>
          <span>图片附件：</span>
          <a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
            <img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
          </a>
        </div>
        <div>
          <span>审批：</span>
          <div class="exam_info">
            <div class="avatar lzz">
              <span style="margin-left: 5px;">状态</span>
            </div>
            <div class="name lzz">
              <span>姓名</span>
            </div>
            <div class="tel lzz">
              <span>时间</span>
            </div>
            <div class="operation lzz">
              <span>回复</span>
            </div>
          </div>
          <div>
            <div class="exam_info">
              <div class="avatar">
                <span>{{form_Listb.approval_state}}</span>
              </div>
              <div class="name">
                <span>{{form_Listb.handler_name}}</span>
              </div>
              <div class="tel">
                <span>{{form_Listb.handle_time}}</span>
              </div>
              <div class="operation">
                <span>{{form_Listb.opinion}}</span>
              </div>
            </div>
            <div>
              <img :src="list" alt="" v-for="(list,index) in form_Listb.picture_enclosure" @click="cl_pic(form_Listb.picture_enclosure,index)" />
            </div>
          </div>
        </div>
        <div class="menu" v-show="handle_show">
          <el-button type="primary" plain @click="handle">处理</el-button>
          <div class="button" v-if="menuShow">
            <el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
            <input name="token" type="hidden" :value="input_value">
            <input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
            <el-button type="primary" round @click="agree($event)">同意</el-button>
            <el-button type="danger" round @click="refuse">拒绝</el-button>
          </div>
        </div>
      </div>

      <div class="form" name="请购单" v-if="qinggoudan_show">

        <div>
          <span>工程名称：</span><span>{{form_Lista.request_contract_address}}</span>
        </div>
        <div>
          <span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
        </div>
        <div>
          <span>采购执行人：</span><span>{{form_Lista.buy_person}}</span>
        </div>
        <div>
          <span>采购执行人联系方式：</span><span>{{form_Lista.buy_person_phone}}</span>
        </div>
        <div>
          <span>工程负责人：</span><span>{{form_Lista.contract_responsible}}</span>
        </div>
        <div>
          <span>工程负责人联系方式：</span><span>{{form_Lista.responsible_tel}}</span>
        </div>
        <div>
          <span>收货地址：</span><span>{{form_Lista.receive_address}}</span>
        </div>
        <div>
          <span>要求到货时间：</span><span>{{form_Lista.arrival_time}}</span>
        </div>
        <div>
          <span>收货人姓名：</span><span>{{form_Lista.consignee}}</span>
        </div>
        <div>
          <span>收货人联系方式：</span><span>{{form_Lista.consignee_phone}}</span>
        </div>
        <div>
          <span style="color: red;"><span>总额：</span>{{form_Lista.total}}</span>
        </div>
        <div v-for="item in form_Lista.content" class="qingdan_qinggou">
          <h4>请购清单</h4>
          <p>请购名称：<span>{{item.name}}</span></p>
          <p>规格：<span>{{item.spec}}</span></p>
          <p>型号:<span>{{item.model}}</span></p>
          <p>单位：<span>{{item.unit}}</span></p>
          <p>数量:<span>{{item.num}}</span></p>
          <p>预计单价￥:<span>{{item.price}}</span></p>
          <p>总额￥:<span>{{item.subtotal}}</span></p>
          <p>申报采购原因及用途:<span>{{item.purpose}}</span></p>
        </div>
        <div>
          <span>附件列表：</span>
          <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
        </div>
        <div>
          <span>图片附件：</span>
          <a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
            <img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
          </a>
        </div>

        <div>
          <span>审批：</span>
          <div class="exam_info">
            <div class="avatar lzz">
              <span style="margin-left: 5px;">状态</span>
            </div>
            <div class="name lzz">
              <span>姓名</span>
            </div>
            <div class="tel lzz">
              <span>时间</span>
            </div>
            <div class="operation lzz">
              <span>回复</span>
            </div>
          </div>
          <div>
            <div class="exam_info">
              <div class="avatar">
                <span>{{form_Listb.approval_state}}</span>
              </div>
              <div class="name">
                <span>{{form_Listb.handler_name}}</span>
              </div>
              <div class="tel">
                <span>{{form_Listb.handle_time}}</span>
              </div>
              <div class="operation">
                <span>{{form_Listb.opinion}}</span>
              </div>
            </div>
            <div>
              <img :src="list" alt="" v-for="(list,index) in form_Listb.picture_enclosure" @click="cl_pic(form_Listb.picture_enclosure,index)" />
            </div>
          </div>
        </div>
        <div class="menu" v-show="handle_show">
          <el-button type="primary" plain @click="handle">处理</el-button>
          <div class="button" v-if="menuShow">
            <el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
            <input name="token" type="hidden" :value="input_value">
            <input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
            <el-button type="primary" round @click="agree($event)">同意</el-button>
            <el-button type="danger" round @click="refuse">拒绝</el-button>
          </div>
        </div>
      </div>

      <div class="form" name="请款单" v-if="qingkuandan_show">
        <div>
          <span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
        </div>
        <div>
          <span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
        </div>
        <div>
          <span>工种：</span><span>{{form_Lista.worker_type}}</span>
        </div>
        <div>
          <span>请款人姓名：</span><span>{{form_Lista.request_name}}</span>
        </div>
        <div>
          <span>联系方式：</span><span>{{form_Lista.phone}}</span>
        </div>
        <div>
          <span>账户名：</span><span>{{form_Lista.account_name}}</span>
        </div>
        <div>
          <span>开户行：</span><span>{{form_Lista.bank_address}}</span>
        </div>
        <div>
          <span>银行卡号：</span><span>{{form_Lista.bank_card}}</span>
        </div>
        <div>
          <span>请款次数：</span><span>{{form_Lista.request_num}}</span>
        </div>
        <div>
          <span>合同执行进度：</span><span>{{form_Lista.contract_state}}</span>
        </div>
        <div>
          <span>合同金额￥：</span><span>{{form_Lista.subtotal}}</span>
        </div>
        <div>
          <span>增减金额￥：</span><span>{{form_Lista.gain_reduction_subtotal}}</span>
        </div>
        <div>
          <span>已领工程款￥：</span><span>{{form_Lista.balance_subtotal}}</span>
        </div>
        <div>
          <span>本次请款￥：</span><span>{{form_Lista.request_subtotal}}</span>
        </div>
        <div>
          <span>请款内容：</span><span>{{form_Lista.request_content}}</span>
        </div>

        <div>
          <span>附件列表：</span>
          <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
        </div>
        <div>
          <span>图片附件：</span>
          <a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
            <img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
          </a>
        </div>

        <div>
          <span>审批：</span>
          <div class="exam_info">
            <div class="avatar lzz">
              <span style="margin-left: 5px;">状态</span>
            </div>
            <div class="name lzz">
              <span>姓名</span>
            </div>
            <div class="tel lzz">
              <span>时间</span>
            </div>
            <div class="operation lzz">
              <span>回复</span>
            </div>
          </div>
          <div>
            <div class="exam_info">
              <div class="avatar">
                <span>{{form_Listb.approval_state}}</span>
              </div>
              <div class="name">
                <span>{{form_Listb.handler_name}}</span>
              </div>
              <div class="tel">
                <span>{{form_Listb.handle_time}}</span>
              </div>
              <div class="operation">
                <span>{{form_Listb.opinion}}</span>
              </div>
            </div>
            <div>
              <img :src="list" alt="" v-for="(list,index) in form_Listb.picture_enclosure" @click="cl_pic(form_Listb.picture_enclosure,index)" />
            </div>
          </div>
        </div>
        <div class="menu" v-show="handle_show">
          <el-button type="primary" plain @click="handle">处理</el-button>
          <div class="button" v-if="menuShow">
            <el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
            <input name="token" type="hidden" :value="input_value">
            <input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
            <el-button type="primary" round @click="agree($event)">同意</el-button>
            <el-button type="danger" round @click="refuse">拒绝</el-button>
          </div>
        </div>
      </div>

      <div class="form" name="报销单" v-if="baoxiaodan_show">
        <div>
          <span>标题：</span><span>{{form_Lista.title}}</span>
        </div>

        <div>
          <span style="color: red;"><span>总额：</span>{{form_Lista.money}}</span><span style="display: block">{{form_Lista.big_money}}</span>
        </div>
        <div v-for="item in form_Lista.content" class="qingdan">
          <h4>报销条目</h4>
          <p>日期:<span>{{item.month_day}}</span></p>
          <p>报销内容:<span>{{item.content}}</span></p>
          <p>金额:<span>{{item.price}}</span></p>
          <p>单据张数:<span>{{item.amount}}</span></p>
          <p>备注:<span>{{item.remarks}}</span></p>
          <p>大写总额<span>{{item.big_price}}</span></p>
        </div>
        <div>
          <span>附件列表：</span>
          <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
        </div>
        <div>
          <span>图片附件：</span>
          <a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
            <img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
          </a>
        </div>
        <div>
          <span>审批：</span>
          <div class="exam_info">
            <div class="avatar lzz">
              <span style="margin-left: 5px;">状态</span>
            </div>
            <div class="name lzz">
              <span>姓名</span>
            </div>
            <div class="tel lzz">
              <span>时间</span>
            </div>
            <div class="operation lzz">
              <span>回复</span>
            </div>
          </div>
          <div>
            <div class="exam_info">
              <div class="avatar">
                <span>{{form_Listb.approval_state}}</span>
              </div>
              <div class="name">
                <span>{{form_Listb.handler_name}}</span>
              </div>
              <div class="tel">
                <span>{{form_Listb.handle_time}}</span>
              </div>
              <div class="operation">
                <span>{{form_Listb.opinion}}</span>
              </div>
            </div>
            <div>
              <img :src="list" alt="" v-for="(list,index) in form_Listb.picture_enclosure" @click="cl_pic(form_Listb.picture_enclosure,index)" />
            </div>
          </div>
        </div>
        <div class="menu" v-show="handle_show">
          <el-button type="primary" plain @click="handle">处理</el-button>
          <div class="button" v-if="menuShow">
            <el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
            <input name="token" type="hidden" :value="input_value">
            <input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
            <el-button type="primary" round @click="agree($event)">同意</el-button>
            <el-button type="danger" round @click="refuse">拒绝</el-button>
          </div>
        </div>
      </div>

      <loading v-show="loadingShow"></loading>

      <div class="ifDown" v-show="ifDownShow">
        <div class="info">
          <div class="title">
            <span>确定下载文件吗</span>
          </div>
          <div class="button">
            <a @click="cancelDown">取消</a>
            <a @click="sureDown" :href="downUrl" target="_blank">确定</a>
          </div>
        </div>
      </div>
    </div>

    <rece ref="rece" v-show="receShow"></rece>

    <chat v-show="chatShow"></chat>
  </div>
</template>

<script>
  import {getCro} from "@/common/js/crowd";
  import {getPic} from '@/common/js/pic.js'
  import { getAvatar } from '@/common/js/avatar.js'
  import rece from '@/base/received/rece'
  import chat from '@/base/info/chat'
  import loading from '@/base/loading/loading'
  import { create_personal_list } from '@/common/js/approval/personal'
  import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
  import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
  import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
  import { create_baoxiaodan_list} from "@/common/js/approval/baoxiaodan"
  import { create_approval_personal_list } from "@/common/js/approval/approval_personal_list";
  import { mapGetters, mapMutations } from 'vuex'
export default {
  data(){
    return{
      pageIndex:1,
      infoShow:true,
      main_If:false,
      activeName: '1',
      searchShow:false,
      searchInfo: '',
      group: ['请购单', '请款单', '呈批件','报销单'],
      listSeaShow:false,
      classRadio: '1',
      classIndex: -1,
      handle_time_show: false,
      approval_process: false,
      ilaunched: true,
      handle_show: true,
      untreated:[],
      nextPageShow:true,
      colorIndex: -1,
      approval_type:'',
      formShow:false,
      now_type_name:'',
      downShow:false,
      repealShow:false,
      form_Lista:{},
      form_Listb:{},
      cengpijian_show:false,
      qinggoudan_show:false,
      qingkuandan_show:false,
      baoxiaodan_show:false,
      list:'',
      status:'',
      downApproId:'',
      file_arr:[],
      handle_txt: '',
      menuShow: false,
      input_value: '',
      reply:'',
      downUrl:'',
      ifDownShow:false,
      loadingShow:false,
      pic_hash_arr:[],
      receShow:false,
      chatShow:false,
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
    approval(){
      this.infoShow = false
      this.main_If = true
      this.listSeaShow = true
      this._getExamList()
    },
    handleClick(tab){
      let index = parseInt(tab.index)
      if(index === 0) {
        this.handle_time_show = false
        this.approval_process = false
        this.ilaunched = true
        this.handle_show = true
      }
      if(index === 1) {
        this.handle_time_show = true
        this.approval_process = true
        this.ilaunched = true
        this.handle_show = false
      }
      if(index === 2) {
        this.handle_time_show = false
        this.approval_process = true
        this.ilaunched = false
        this.handle_show = false
      }
      this._getExamList()
    },
    doFiltrate(){
      if(this.searchShow) {
        this.pageIndex = 1
        this._getExamList()
        this.listSeaShow = true
        this.classIndex = -1
        this.searchShow = false
      } else {
        this.approval_type = ''
        this.pageIndex = 1
        this.listSeaShow = false
        this.searchShow = true
      }
    },
    _return(){
      this.infoShow = true
      this.main_If = false
    },
    _getExamList(){
      let param = new URLSearchParams()
      param.append('type',this.activeName)
      param.append('each',10)
      param.append('p',this.pageIndex)
      this.$http.post('/index.php/Mobile/personal/see_approval_personal_list',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          let arr = []
          res.data.data.forEach((item)=>{
            arr.push(create_personal_list(item))
          })
          if(arr.length < 10){
            this.nextPageShow = false
          }
          this.untreated = arr
        })
    },
    first_page() {
      this.pageIndex = 1
    },
    last_page() {
      this.nextPageShow = true
      --this.pageIndex
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    next_page() {
      ++this.pageIndex
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    deleteForm(pr){
      this.$confirm('确认删除此审批','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
      }).then(()=>{
        let param = new URLSearchParams()
        param.append('approval_personal_id',pr)
        this.$http.post('index.php/Mobile/Personal/del_approval_personal',param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            if(res.data.code == 0){
              this.$message.success('删除成功')
              this._getExamList()
            }else{
              this.$message.error(res.data.message)
            }
          })
      }).catch(()=>{
        this.$message.error('已取消操作')
      })
    },
    classButton(item,index){
      this.pageIndex = 1
      this.classIndex = index
      switch (item){
        case '请购单':
          this.approval_type = '1'
          break;
        case '请款单':
          this.approval_type = '2'
          break;
        case '呈批件':
          this.approval_type = '3'
          break;
        case '报销单':
          this.approval_type = '4'
          break;
      }
      this.doSearch()
    },
    doSearch(){
      let param = new URLSearchParams()
      param.append('approval_type',this.approval_type)
      param.append('select',this.searchInfo)
      param.append('p',this.pageIndex)
      param.append('each',10)
      param.append('type',parseInt(this.classRadio))
      this.$http.post('index.php/Mobile/personal/select_personal_approval',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          if(res.data.code == 0){
            let arr = []
            res.data.data.forEach((item) => {
              arr.push(create_personal_list(item))
              if(!item.name){
                this.ilaunched = false
              }
            })
            this.untreated = arr
            if(arr.length < 10) {
              this.nextPageShow = false
            }
            this.listSeaShow = true
          }else{
            this.listSeaShow = false
          }
        })
    },
    btn_a(){
      this.doSearch()
    },
    listCli(item,sta){
      this.list = item
      if(sta.indexOf('已通过') == '-1'){
        this.status = '2'
      }else{
        this.status = '1'
      }
      // if(sta.indexOf('已通过') != '-1' && this.activeName == 3){
      //   this.repealShow = true
      // }else{
      //   this.repealShow = false
      // }
      if(sta.indexOf('已通过') != '-1'){
        this.downShow = true
      }
      this.now_type_name = item.type
      this.downApproId = item.approval_personal_id
      this.form_Lista = {}
      this.form_Listb = {}
      this.main_If = false
      this.formShow = true
      this.cengpijian_show = false
      this.qinggoudan_show = false
      this.baoxiaodan_show = false
      this.qingkuandan_show = false
      if(item.type == '呈批件'){
        this.cengpijian_show = true
      }else if(item.type == '请购单'){
        this.qinggoudan_show = true
      }else if(item.type == '请款单'){
        this.qingkuandan_show = true
      }else if(item.type == '报销单'){
        this.baoxiaodan_show = true
      }
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      param.append('approval_personal_id',item.approval_personal_id)
      this.$http.post('index.php/Mobile/Personal/approval_personal_process_show',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          if(item.type == '呈批件'){
            this.form_Lista = create_cengpijian_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(item.type == '请购单'){
            this.form_Lista = create_qinggoudan_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Lista.many_enclosure)
          }else if(item.type == '请款单'){
            this.form_Lista = create_qingkuandan_list(res.data.data)
            this.get_img(this.form_Lista.many_enclosure)
            this.get_file(this.form_Listb.many_enclosure)
          }else if(item.type == '报销单'){
            this.form_Lista = create_baoxiaodan_list(res.data.data)
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
          this.reply = res.data.data.approval_personal_id
          this.form_Listb = create_approval_personal_list(res.data.data.approval_content)
        })
    },
    return_list(){
      this.downShow = false
      this.handle_txt = ''
      this.formShow = false
      this.main_If = true
      this.menuShow = false
      this.qingkuandan_show = false
      this.qinggoudan_show = false
      this.cengpijian_show = false
      this.pingshenbiao_show = false
      this.baoxiaodan_show = false
      this.gongzhang_show = false
      this.reply = ''
      this.list = ''
    },
    down(){
      this.ifDownShow = true
      let param = new URLSearchParams()
      param.append('approval_id',this.reply)
      param.append('type',1)
      this.$http.post('index.php/Mobile/find/get_download_token',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          this.downUrl = '/index.php/Mobile/skey/aaampd_picture?token=' + res.data.data
        })
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
              var str = process.env.NODE_ENV
              var picLeader = ''
              str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
              let file_data = res.data.data
              let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
              obj.name = file_data.file_name+'.'+file_data.attribute
              obj.address = file_add
              this.file_arr.push(obj)
            })
        }
      })
    },
    refuse(){
      this.pic_hash_arr = []
      if(this.handle_txt == ''){
        this.$message.error('请填写审批意见')
        return
      }
      if(!this.pic){
        this.$confirm('是否提交审批?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.loadingShow = true
          let param = new URLSearchParams()
          param.append('uid',this.user.uid)
          param.append('approval_personal_id',this.reply)
          param.append('approval_state','2')
          param.append('opinion',this.handle_txt)
          this.$http.post('index.php/Mobile/personal/personal_approval',param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              this.loadingShow = false
              this.handle_txt = ''
              this.main_If = true
              this.formShow = false
              this._getExamList()
              if(res.data.code == 0){
                this.$message.success('操作成功')
              }else{
                this.$message.error('操作失败')
              }
            })
        }).catch(()=>{
          this.$message.info('已取消删除')
        })
      }
      if(this.pic){
        this.$confirm('是否提交审批?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.loadingShow = true
          for(let i = 0;i<this.pic.length;i++){
            let formData = new FormData()
            formData.append('file',this.pic[i])
            formData.append('token',JSON.parse(localStorage.token))
            let config = {
              headers:{
                'Content-Type':'multipart/form-data'
              }
            }
            this.$http.post('https://up.qbox.me/',formData,config).then((res)=>{
              this.pic_hash_arr.push(res.data.hash)
              if(this.pic_hash_arr.length == this.pic.length){
                let nparam = new URLSearchParams()
                nparam.append('uid',this.user.uid)
                nparam.append('picture',JSON.stringify(this.pic_hash_arr))
                this.$http.post('/index.php/Mobile/approval/upload_enclosure_new',nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    let param = new URLSearchParams()
                    param.append('uid',this.user.uid)
                    param.append('approval_personal_id',this.reply)
                    param.append('approval_state','2')
                    param.append('opinion',this.handle_txt)
                    param.append('picture_enclosure',res.data.data.enclosure_id)
                    this.$http.post('index.php/Mobile/personal/personal_approval',param)
                      .then((res)=>{
                        var current = this
                        var judge = res.data.code
                        getCro(judge,current)
                        this.loadingShow = false
                        this.handle_txt = ''
                        this.main_If = true
                        this.formShow = false
                        this._getExamList()
                        if(res.data.code == 0){
                          this.$message.success('操作成功')
                        }else{
                          this.$message.error('操作失败')
                        }
                      })
                  })
              }
            })
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        })
      }
    },
    agree(){
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      this.pic_hash_arr = []
      if(!this.pic){
        this.$confirm('是否提交审批?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.loadingShow = true
          let param = new URLSearchParams()
          param.append('uid',this.user.uid)
          param.append('approval_personal_id',this.reply)
          param.append('approval_state','1')
          param.append('opinion',this.handle_txt)
          this.$http.post('index.php/Mobile/personal/personal_approval',param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              this.loadingShow = false
              this.handle_txt = ''
              this.main_If = true
              this.formShow = false
              this._getExamList()
              if(res.data.code == 0){
                this.$message.success('操作成功')
              }else{
                this.$message.error('操作失败')
              }
            })
        }).catch(()=>{
          this.$message.warning('已取消删除')
        })
      }
      if(this.pic){
        this.$confirm('是否提交审批','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.loadingShow = true
          for(let i = 0;i<this.pic.length;i++){
            let formData = new FormData()
            formData.append('file',this.pic[i])
            formData.append('token',JSON.parse(localStorage.token))
            let config = {
              headers:{
                'Content-Type':'multipart/form-data'
              }
            }
            this.$http.post('https://up.qbox.me',formData,config).then((res)=>{
              this.pic_hash_arr.push(res.data.hash)
              if(this.pic_hash_arr.length == this.pic.length){
                let nparam = new URLSearchParams()
                nparam.append('uid',this.user.uid)
                nparam.append('picture',JSON.stringify(this.pic_hash_arr))
                this.$http.post('/index.php/Mobile/approval/upload_enclosure_new',nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    let param = new URLSearchParams()
                    param.append('uid',this.user.uid)
                    param.append('approval_personal_id',this.reply)
                    param.append('approval_state','1')
                    param.append('opinion',this.handle_txt)
                    param.append('picture_enclosure',res.data.data.enclosure_id)
                    this.$http.post('index.php/Mobile/personal/personal_approval',param)
                      .then((res)=>{
                        var current = this
                        var judge = res.data.code
                        getCro(judge,current)
                        this.loadingShow = true
                        this.main_If = true
                        this.formShow = false
                        this._getExamList()
                        if(res.data.code == 0){
                          this.$message.success('操作成功')
                        }else{
                          this.$message.error('操作失败')
                        }
                      })
                  })

              }
            })
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        })
      }
    },
    handle(){
      if(this.menuShow == false){
        this.menuShow = true
      }else{
        this.menuShow = false
      }
      let param = new URLSearchParams()
      param.append("uid", this.user.uid)
      this.$http.post('/index.php/Mobile/path/get_token',param)
        .then((res)=>{
          this.input_value = res.data.data
        })
    },
    getPic(event){
      this.pic = event.target.files;
    },
    cancelDown(){
      this.ifDownShow = false
    },
    sureDown(){
      this.ifDownShow = false
    },
    look_con(){
      this.infoShow = false
      this.receShow = true
      this.$refs.rece.activeName = '2'
      this.$refs.rece._getInfo()
      this.$refs.rece.inserted = '6'
    },
    chat(){
      this.$message.warning('功能尚在研发中')
      // this.infoShow = false
      // this.chatShow = true
    },
    cl_pic(item, index) {
      console.log(item)
      item.forEach((res)=>{
        let current = res.indexOf('?')
        this.arr_list.push(res.slice(0,current) + '?imageslim' )
      })
      this.pic_index = index
      this.pic_show = true
    },
  },
  created(){
    // this.approval()
  },
  mounted(){
    if(this.$route.path === '/work/infos') {
      this.$emit('changeWorkIndex', '8-3')
    }
  },
  watch:{
    pageIndex() {
      this._getExamList()
      if(this.searchShow) {
        this.doSearch()
      }
    },
    searchInfo() {
      this.doSearch()
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'nowCompanyId',
      'companyList'
    ])
  },
  components:{
    loading,
    rece,
    chat
  }
}
</script>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in below version 2.1.8 */

  {
    opacity: 0
  }

  .fade1-enter-active,
  .fade1-leave-active {
    transition: opacity .5s;
    transform: translateY(-54px);
  }

  .fade1-enter,
  .fade1-leave-to
    /* .fade-leave-active in below version 2.1.8 */

  {
    opacity: 0;
  }
.infos{
  width: 100%;
  .top{
    width: 100%;
    background: #fff;
    p{
      width: 500px;
      margin: 0 auto;
      text-align: center;
      font-weight: bolder;
      padding: 15px 0;
    }
  }
  ul{
    width: 100%;
    margin-top: 10px;
    background: #FFF;
    li{
      cursor: default;
      display: block;
      border-bottom: 1px solid #DDDDDD;
      font-size: 14px;
      transition: .3s;
      box-shadow: none !important;
      overflow: hidden;
      height: 50px;
      line-height: 55px;
      margin-bottom: 3px;
      padding: 0px 20px;
      &:nth-child(even) {
        background: rgb(245, 247, 250);
      }
      &:hover {
        background: #EEEEEE;
      }
    }
  }
}
.mains{
  width: 100%;
  .nav {
    position: relative;
    font-weight: 700;
    >button{
      position: absolute;
      top: 3px;
      left: 10px;
      z-index: 99;
    }
    >.filtrate {
      position: absolute;
      top: 12px;
      right: 20px;
      font-size: 14px;
      cursor: pointer;
    }
    >.el-select{
      position: absolute;
      top: 5px;
      right: 90px;
      height: 30px;
      font-size: 14px;
      cursor: pointer;
      //修复页面刷新之后选择框跑到左边的问题
      width: 140px;
    }
    .el-input--suffix .el-input__inner{
      height: 30px;
      width: 140px;
    }
    .el-tabs__header {
      background: #FFFFFF;
      margin-bottom: 5px;
    }
    .el-tabs__active-bar {
      width: 100px;
    }
    .el-tabs__item {
      font-weight: 700;
      width: 120px;
      text-align: center;
    }
    .el-tabs__nav{
      margin-left: 100px;
    }
  }
  .search {
    background: #FFFFFF;
    padding-top: 50px;
    padding-bottom: 20px;
    >.one {
      display: inline-block;
      margin-left: 40px;
    }
    >.two {
      display: inline-block;
      margin-left: 40px;
    }
    >.three {
      margin: 15px;
      span {
        display: inline-block;
        cursor: pointer;
        margin-left: 10px;
        padding: 8px 20px;
        border-radius: 4px;
        font-size: 14px;
        color: #878d99;
        background: #f3f4f5;
        &:hover {
          background: #878d99;
          color: #FFFFFF;
        }
        &.active {
          background: #878d99;
          color: #FFFFFF;
        }
      }
    }
    .el-input__inner {
      width: auto;
    }
    .el-input {
      width: auto;
    }
  }
  .list {
    width: 600px;
    >ul {
      >.page {
        padding: 4px;
        text-align: center;
        background: #FFFFFF;
        margin-bottom: 10px;
        span {
          cursor: pointer;
          font-size: 12px;
          &:hover {
            color: #409EFF;
          }
        }
      }
      >li {
        background: #FFFFFF;
        display: block;
        margin-bottom: 5px;
        color: #2D2F33;
        font-size: 13px;
        oz-box-shadow: 1px 1px 2px #999999;
        -webkit-box-shadow: 1px 1px 2px #999999;
        box-shadow: 1px 1px 2px #999999;
        >.avatar {
          display: inline-block;
          /*vertical-align: top;*/
          margin: 8px 5px 0 15px;
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
          margin-top: 5px;
          cursor: pointer;
          .el-button.is-round {
            padding: 4px 12px;
          }
          .process {
            margin-top: 10px;
          }
          >.color {
            position: relative;
            width: 50px;
            height: 30px;
            margin-top: 15px;
            >span {
              float: right;
              margin-right: 10px;
              display: inline-block;
              width: 28px;
              text-align: center;
              height: 28px;
              font-weight: 700;
              line-height: 28px;
              border-radius: 50%;
              background: #FFFFFF;
              border: 1px solid #999999;
            }
            >.choose {
              transition: all 1s;
              position: absolute;
              right: 50px;
              bottom: 2px;
              width: 128px;
              height: 28px;
              display: flex;
              >span {
                border-radius: 50%;
                flex: 1;
                margin-left: 4px;
                &:nth-child(1) {
                  background: #ff0000;
                }
                &:nth-child(2) {
                  background: #ffff00;
                }
                &:nth-child(3) {
                  background: #00ff00;
                }
                &:nth-child(4) {
                  background: #0000ff;
                }
              }
            }
          }
        }
        .content {
          margin-left: 20px;
          padding: 4px 0;
          display: inline-block;
          >div {
            height: 20px;
            line-height: 20px;
          }
        }
      }
    }
  }
}
.form_box{
  min-height: 400px;
  background: #FFFFFF;
  width: 600px;
  overflow: hidden;
  box-shadow: 0 0 2px rgba(0, 0, 0, .2);
  -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
  .top {
    width: 100%;
    display: block;
    .as {
      display: inline-block;
      float: right;
      margin-right: 10px;
    }
    button {
      margin-left: 10px;
      margin-top: 10px;
      display: inline-block;
    }
    .title {
      width: 100%;
      display: inline-block;
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
  }
  .form {
    padding: 10px;
    .exam_info {
      cursor: default;
      display: block;
      border-bottom: 1px solid #DDDDDD;
      font-size: 14px;
      transition: .3s;
      margin-bottom: 4px;
      >.lzz {
        font-weight: 700;
        font-size: 15px;
        text-indent: 2px;
      }
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
      >div {
        height: 40px;
        line-height: 40px;
        display: inline-block;
      }
      .avatar {
        /*vertical-align: top;*/
        width: 70px;
      }
      .name {
        width: 80px;
      }
      .tel {
        width: 150px;
      }
      .operation {
        width: 240px;
        button {
          display: block;
        }
      }
    }
    >div {
      display: block;
      border-bottom: 1px solid #DDDDDD;
      >span {
        vertical-align: top;
        font-size: 14px;
        line-height: 24px;
        &:nth-child(2) {
          margin-left: 5px;
          color: #444444;
        }
      }
      .approval {
        display: inline-block;
        span {
          font-size: 14px;
          line-height: 24px;
        }
      }
      img {
        margin-right: 10px;
        display: inline-block;
        width: 80px;
        cursor: pointer;
      }
      ul{
        li{
          margin-bottom: 5px;
          font-size: 14px;
          p{
            margin-top: 5px;
            b{
              width: 250px;
              display: inline-block;
              font-weight: normal;
            }
          }
        }
      }
    }
    .file {
      font-size: 14px;
      margin: 4px auto;
      display: block;
      height: 24px;
      width: 80%;
      line-height: 24px;
      color: #5A5E66;
      border: 1px solid #F9F9F9;
      border-radius: 4px;
      background: #DDDDDD;
      text-align: center;
    }
    .qingdan {
      font-size: 14px;
      padding: 4px 0;
      h4 {
        color: #409EFF;
        font-size: 15px;
        margin: 2px 0px;
      }
      p {
        height: 30px;
        line-height: 30px;
        span {
          margin-left: 5px;
          color: #444444;
        }
      }
    }
    .qingdan_qinggou {
      font-size: 14px;
      padding: 4px 0;
      h4 {
        color: #409EFF;
        font-size: 15px;
        margin: 2px 0px;
      }
      p {
        display: inline-block;
        min-width: 180px;
        height: 30px;
        line-height: 30px;
        span {
          margin-left: 5px;
          color: #444444;
        }
      }
    }
    .menu {
      margin-top: 10px;
      border-bottom: none;
      >button {
        display: block;
      }
      .button {
        margin-top: 10px;
        margin-left: 120px;
        display: block;
        font-size: 0;
        z-index: 2;
        width: 300px;
        input[type="file"] {
          margin: 10px 0 10px 0px;
        }
        >button {
          margin-left: 50px;
        }
      }
    }
  }
}
  .ifDown{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 10;
    >.info{
      padding: 10px;
      width:160px;
      height: 80px;
      background: #FFFFFF;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translateX(-50%) translateY(-50%);
      -moz-transform: translateX(-50%) translateY(-50%);
      -ms-transform: translateX(-50%) translateY(-50%);
      -o-transform: translateX(-50%) translateY(-50%);
      transform: translateX(-50%) translateY(-50%);
      border-radius: 6px;
      >.title{
        width: 100%;
        text-align: center;
        font-size: 16px;
      }
      >.button{
        width: 100%;
        text-align: center;
        margin-top: 40px;
        a{
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
          padding: 6px 12px;
          border: 1px solid #409EFF;
          &:first-child{
            border: 1px solid #D9D9D9;
          }
        }
      }
    }
  }
</style>
