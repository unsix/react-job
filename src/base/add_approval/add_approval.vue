<template>
  <!--添加请求-->
	<div class="add_approval_wrapper">
		<div class="add_approval">
			<div class="nav">
        <!--导航-->
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="合同评审表"></el-tab-pane>
					<el-tab-pane label="请购单"></el-tab-pane>
					<el-tab-pane label="请款单"></el-tab-pane>
					<el-tab-pane label="申请公章"></el-tab-pane>
					<el-tab-pane label="呈批件"></el-tab-pane>
          <el-tab-pane label="报销单"></el-tab-pane>
          <el-tab-pane label="验收单"></el-tab-pane>
          <el-tab-pane label="工资单"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="from_template" v-show="formShow">
				<el-button type="primary" plain @click="chooseTem" v-show="forms">从模板选择</el-button>
			</div>
			<div class="form" v-show="formShow">
				<addQkd v-if="qkd_show" :userList="user_info" :approval_id="approval_id5" ref="scse" :main_show="main_show" @return_exam="return_Add"  :form_approval_id="form_approval_id"  :request_money_basis_type="request_money_basis_type"></addQkd>
				<addCpj v-if="cpj_show" :userList="user_info" :approval_id="approval_id3" @return_exam="return_Add"></addCpj>
				<addPsb v-if="psb_show" :userList="user_info" :approval_id="approval_id1" @return_exam="return_Add"></addPsb>
				<addQgd v-if="qgd_show" :userList="user_info" :approval_id="approval_id2" @return_exam="return_Add"></addQgd>
				<addSqgz v-if="sqgz_show" :userList="user_info" :approval_id="approval_id4" @return_exam="return_Add"></addSqgz>
        <addBxd v-if="bxd_show" :userList="user_info" :approval_id="approval_id6" @return_exam="return_Add"></addBxd>
        <addYsd v-if="ysd_show" :userList="user_info" :inspection_type_id="inspection_type_id" :approval_id="approval_id7" @return_exam="return_Add"></addYsd>
        <addGzd v-if="gzd_show" :userList="user_info" :approval_id="approval_id8" @return_exam="return_Add"></addGzd>
			</div>
		</div>
		<div class="as_what" v-show="as_what_show">
			<ul>
				<h2 v-show="ysdType.length == 0">选择请款依据</h2>
        <h2 v-show="ysdType.length > 0">选择验收单类型</h2>
				<i class="el-icon-close" @click="close_as"></i>
				<li v-show="ysdType.length == 0" v-for="(item,index) in asType" @click="as_click(index)">{{item}}</li>
        <li v-show="ysdType.length > 0" v-for="(item,index) in ysdType" @click="ysd_click(item.inspection_type_id)" >{{item.inspection_name}}</li>
			</ul>
		</div>
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
		<loading v-show="loading_show"></loading>
		<chooseTemplate v-if="chooseTemShow" @returnForm="returnForm" @viewInfo="viewInfo" :approval_type="approval_type" @useInfo="useInfo"></chooseTemplate>
		<psb v-if="psb_if" :form_Lista="form_Lista" :qk_return="qk_return" @return_qk="return_qk" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></psb>
		<qgd :qk_return="qk_return" @return_qk="return_qk" v-if="qgd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qgd>
		<cpj v-if="cpj_if" :form_Lista="form_Lista" :qk_return="qk_return" @return_qk="return_qk" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"> </cpj>
		<sqgz v-if="sqgz_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></sqgz>
		<qkd :form_approval_id="form_approval_id" :change_type="change_type" v-if="qkd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qkd>
    <bxd v-if="bxd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></bxd>
	  <ysd v-if="ysd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList"></ysd>
    <gzd v-if="gzd_if" :form_Lista="form_Lista" ref="gzds" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></gzd>
    <div class="sendsd" v-show="sendShow">
      <div>
        <span class="close"><span class="huifu">呈批件补充协议</span><i class="el-icon-close" @click="closeSend"></i></span>
        <el-input type="textarea" v-model="content"></el-input>
        <span class="sr">
          <el-button type="primary" round @click="submitCom">确定</el-button>
          <el-upload class="upload-demo" id="picc" multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
            <i class="iconfont icon-zhaopian"></i>
          </el-upload>
          <el-upload class="upload-demo_a" style="margin-top: 0" id="file" multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
            <i class="iconfont icon-fujian"></i>
          </el-upload>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
	import addQgd from '@/base/add_approval/add_qgd'
	import addCpj from '@/base/add_approval/add_cpj'
	import addPsb from '@/base/add_approval/add_psb'
	import addSqgz from '@/base/add_approval/add_sqgz'
	import addQkd from '@/base/add_approval/add_qkd'
  import addBxd from '@/base/add_approval/add_bxd'
  import addYsd from '@/base/add_approval/add_ysd'
  import addGzd from '@/base/add_approval/add_gzd'
	import psb from '@/base/exam_form/psb'
	import qgd from '@/base/exam_form/qgd'
	import cpj from '@/base/exam_form/cpj'
	import qkd from '@/base/exam_form/qkd'
	import sqgz from '@/base/exam_form/sqgz'
  import bxd from '@/base/exam_form/bxd'
  import ysd from '@/base/exam_form/ysd'
  import gzd from '@/base/exam_form/gzd'
	import chooseTemplate from '@/base/add_approval/choose_template'
	import loading from '@/base/loading/loading'
	import {getPic} from '@/common/js/pic.js'
	import {getAvatar} from '@/common/js/avatar.js'
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
  import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
        forms:true,
				navIndex: 0,
				asType: ['请购单', '合同评审表', '呈批件'],
        ysdType:[],
				form_Lista: {},
				form_Listb: {},
        main_show: {},
				activeName: '',
				psb_if: false,
				qgd_if: false,
				cpj_if: false,
				qkd_if: false,
				sqgz_if: false,
        bxd_if: false,
        ysd_if:false,
        gzd_if:false,
				formShow: true,
				chooseTemShow: false,
				as_what_show: false,
				qkd_show: false,
				qgd_show: false,
				cpj_show: false,
        bxd_show: false,
        ysd_show: false,
				psb_show: true,
				sqgz_show: false,
        gzd_show:false,
				loading_show: false,
				at_qingkuanShow:false,
        inspection_type_id:'',
				untreated: [],
				file_arr: [],
				nowType: 1,
				insertType: 0,
				approval_type: 111,
				approval_id1: '',
				approval_id2: '',
				approval_id3: '',
				approval_id4: '',
				approval_id5: '',
        approval_id6:'',
        approval_id7:'',
        approval_id8:'',
				form_approval_id:'',
				qk_return:false,
				nextPageShow: true,
				pageIndex:1,
				xindex:0,
				request_money_basis_type:'',
        link:'',
        sendShow:false,
        content:'',
        fileList:[],
        fileList_a:[],
        picArr:[],
        fileArr:[],
        pic_hash_arr:[],
        afile_hash_arr:[],
        file_hash_arr:[],
        file_time:0,
        pic_time:0,
        change_type:'',
        user_info:[],
        prc_index:'',
			}
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
			nowCompanyId(){
				this._getComPersonList()
				this._getComDepart()
			},
      pic_time(){
			  if(this.fileArr.length != 0){
			    if(this.file_time == 0){
			      return
          }
        }
        if(this.file_time!=0 || this.pic_time !=0){
			    let param = new URLSearchParams()
          param.append('approval_id',this.form_approval_id)
          param.append('remarks',this.content)
          param.append('many_enclosure',JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]))
          let str = this.$test('/index.php/Mobile/Approval/add_chengpi_supply')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loading_show = false
              this.content = ''
              this.fileList = []
              this.fileList_a = []
              if(res.data.code == 0){
                this.$message.success(res.data.message)
                this.formShow = true
                this.sendShow = false
                this.qkd_show = true
              }else{
                this.$message.error('添加失败')
              }
            })
        }
      },
      file_time(){
        if(this.picArr.length != 0){
          if(this.pic_time == 0){
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0){
          let param = new URLSearchParams()
          param.append('approval_id',this.form_approval_id)
          param.append('remarks',this.content)
          param.append('many_enclosure',JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]))
          let str = this.$test('/index.php/Mobile/Approval/add_chengpi_supply')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loading_show = false
              this.content = ''
              this.fileList = []
              this.fileList_a = []
              if(res.data.code == 0){
                this.$message.success(res.data.message)
                this.sendShow = false
                this.formShow = true
                this.qkd_show = true
              }else{
                this.$message.error('添加失败')
              }
            })
        }
      }
		},
		mounted(){
			if(this.$route.path === '/work/addApproval') {
				this.$emit('changeWorkIndex','1-2')
			}
		},
		created(){
			if(!localStorage.user){
				this.$router.push({ path: '/login' })
			}
			this.setUser(JSON.parse(localStorage.user))
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
			this._getUserCompanyList()
			this._getToken()
			this._getComDepart()
			this._getComPersonList()
      this.get_approval_user_info()
		},
		methods: {
      submitCom(){
        if(!this.content){
          this.$message.error('请填写备注')
          return false
        }
        this.fileList.forEach((item) => {
          if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
            this.picArr.push(item)
          }
        })
        this.fileList_a.forEach((item) =>{
          this.fileArr.push(item)
        })
        if(this.picArr.length === 0 && this.fileArr.length === 0){
          this.$message.error('至少选择一个附件')
          return false
        }
        this.pic_hash_arr = []
        this.afile_hash_arr = []
        this.file_hash_arr = []
        this.file_time = 0
        this.pic_time = 0
        this.loading_show = true
        this.sendShow = false
        setTimeout(()=>{
          if(this.picArr.length != 0){
            var upload_enclosure_new = (fn) =>{
              this.picArr.forEach((item)=>{
                let formData = new FormData()
                formData.append('file',item.raw)
                formData.append('token',this.token)
                let config = {
                  headers:{
                    'Content-Type':'multipart/form-data'
                  }
                }
                if(!item.size){
                  this.pic_hash_arr.push(item.hash)
                  this.pic_hash_arr.length == this.picArr.length && fn(item.name)
                }else{
                  this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                    this.pic_hash_arr.push(res.data.hash)
                    if(this.pic_hash_arr.length == this.picArr.length){
                      fn(item.name)
                    }
                  })
                }
              })
            }
            upload_enclosure_new((name)=>{
              let nparam = new URLSearchParams()
              nparam.append('uid',this.user.uid)
              nparam.append('picture',JSON.stringify(this.pic_hash_arr))
              let str = this.$test('/index.php/Mobile/approval/upload_enclosure_new')
              this.$http.post(str,nparam)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
                  this.afile_hash_arr.push({
                    'type':3,
                    'contract_id':res.data.data.enclosure_id,
                    name
                  })
                  this.pic_time = Date.parse(new Date())
                })
            })
          }
          if(this.fileArr.length != 0){
            this.fileArr.forEach((item)=>{
              let formData = new FormData()
              formData.append('file',item.raw)
              formData.append('token',this.token)
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
              if(!item.size){
                let index = item.name.lastIndexOf('.')
                let attribute = item.name.slice(index)
                if(attribute.substr(0,1) == '.'){
                  attribute = attribute.substr(1)
                }
                let file_name = item.name.slice(0,index)
                let param = new URLSearchParams()
                param.append('uid',this.user.uid)
                param.append('attribute',attribute)
                param.append('attachments',item.hash)
                param.append('file_name',file_name)
                let str = this.$test('/index.php/Mobile/approval/add_attachments')
                this.$http.post(str,param)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    this.file_hash_arr.push({
                      'type':4,
                      'contract_id':res.data.data.attachments_id,
                      'name':item.name
                    })
                    if(this.file_hash_arr.length == this.fileArr.length){
                      this.file_time = Date.parse(new Date())
                    }
                  })
              }else{
                let size = item.size
                let index = item.name.lastIndexOf('.')
                let attribute = item.name.slice(index)
                if(attribute.substr(0,1)=='.'){
                  attribute = attribute.substr(1)
                }
                let str = this.$test('/index.php/Mobile/find/file_info')
                this.$http.post(str)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    let maxSize = res.data.data.max
                    let attr = res.data.data.attribute
                    if(attr.indexOf(attribute) != -1){
                      if(size < maxSize){
                        this.$http.post('https://up.qbox.me/',formData,config).then((res)=>{
                          let file_name = item.name.slice(0,index)
                          let param = new URLSearchParams()
                          param.append('uid',this.user.uid)
                          param.append('attribute',attribute)
                          param.append('attachments',res.data.hash)
                          param.append("file_name",file_name)
                          let str = this.$test('/index.php/Mobile/approval/add_attachments')
                          this.$http.post(str,param)
                            .then((res)=>{
                              var current = this
                              var judge = res.data.code
                              this.$testLogin(judge,current)
                              this.file_hash_arr.push({
                                'type':4,
                                'contract_id':res.data.data.attachments_id,
                                'name':item.name
                              })
                              if(this.file_hash_arr.length == this.fileArr.length){
                                this.file_time = Date.parse(new Date())
                              }
                            })
                        })
                      }else{
                        this.$message.error('上传文件过大 请删除')
                        this.loading_show = false
                        return false
                      }
                    }else{
                      this.$message.error('请删除'+this.fileArr[i].name)
                      this.loading_show = false
                      return false
                    }
                  })
              }
            })
          }
        })
      },
      closeSend(){
        this.sendShow = false
        this.content = ''
        this.fileList = []
        this.fileList_a = []
      },
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      handlePreview(file, fileList) {
        if(file.name.indexOf('jpg') == '-1' && file.name.indexOf('png') == '-1'){
          this.$message.error('上传文件格式错误')
          this.str = file
        }
        function remove(arr,val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        remove(fileList,this.str)
        this.fileList = fileList
      },
      handleRemove_a(file, fileList_a) {
        this.fileList_a = fileList_a

      },
      handlePreview_a(file, fileList_a){
        //后缀
        let index = file.name.lastIndexOf('.')
        let attribute = file.name.slice(index)
        if(attribute.substr(0,1)=='.'){
          attribute=attribute.substr(1)
        }
        let str = this.$test("/index.php/Mobile/find/file_info")
        this.$http.post(str)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            let attr = res.data.data.attribute
            if(attr.indexOf(attribute) !=-1){
              this.fileList_a = fileList_a
            }else{
              this.$message.error('上传文件格式错误 请删除')
              this.fileList_a = fileList_a
            }

          })
      },
			fileAccordS(){
				console.log(1)
			},
			_getComDepart() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
        let str = this.$test("/index.php/Mobile/user/get_department_lest")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_depart_list(item))
						})
						this.setComDepartList(arr)
					})
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/path/get_token")
				this.$http.post(str, nparam)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						localStorage.token = JSON.stringify(res.data.data);
					})
			},
			first_page() {
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
			return_qk(){
				this.qgd_if = false
        this.cpj_if = false
        this.psb_if = false
				this.qk_return = false
				this.at_qingkuanShow = true
			},
      //查看
			qkView(item,index){
				this.qk_return = true
				this.at_qingkuanShow = false
				if(item.type === '请购单'){
					this.qgd_if = true
				}
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
						if(item.type === '呈批件') {
							this.cpj_if = true
							this.form_Lista = create_cengpijian_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '合同评审表') {
							this.psb_if = true
							this.form_Lista = create_hetongpingshen_list(res.data.data)
              if(this.form_Lista.many_enclosure){
                this.get_img(this.form_Lista.many_enclosure)
                this.get_file(this.form_Lista.many_enclosure)
              }else{
                this.get_img(this.form_Lista.enclosure_id)
                this.get_file(this.form_Lista.enclosure_id)
              }
						} else if(item.type === '请款单') {
							this.qkd_if = true
							this.form_Lista = create_qingkuandan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '申请公章') {
							this.sqgz_if = true
							this.form_Lista = create_gongzhang_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '请购单') {
							this.qgd_if = true
							this.form_Lista = create_qinggoudan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '报销单'){
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
      //使用
			qkUser(item,index){

          this.request_money_basis_type = item.type;
          this.form_approval_id = ''
          this.at_qingkuanShow = false
          this.form_approval_id = item.approval_id
          let nparam = new URLSearchParams()
          nparam.append('approval_id',this.form_approval_id)
          this.$http.post("/index.php/Mobile/approval/history_request_money",nparam)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.main_show = res.data.data
              console.log(this.main_show)
              this.$refs.scse.showMe()
            })
          this.formShow = true
          this.qkd_show = true
			},
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/user/companies_list")
				this.$http.post(str, param)
					.then((res) => {

            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						this.setCompanyList(res.data.data)
					})
			},
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

			useInfo(item) {
				this.approval_id1 = ''
				this.approval_id2 = ''
				this.approval_id3 = ''
				this.approval_id4 = ''
				this.approval_id5 = ''
        this.approval_id6 = ''
        this.approval_id7 = ''
        this.approval_id8 = ''
				this.formShow = true
				this.qkd_show = false
				this.qgd_show = false
				this.cpj_show = false
				this.psb_show = false
				this.sqgz_show = false
        this.bxd_show = false
        this.ysd_show = false
				this.at_qingkuanShow = false
				this.chooseTemShow = false
				if(item.type === '合同评审表') {
					this.approval_id1 = item.approval_id
					this.psb_show = true
				} else if(item.type === '请购单') {
					this.approval_id2 = item.approval_id
					this.qgd_show = true
				} else if(item.type === '呈批件') {
					this.approval_id3 = item.approval_id
					this.cpj_show = true
				} else if(item.type === '申请公章') {
					this.approval_id4 = item.approval_id
					this.sqgz_show = true
				} else if(item.type === '请款单') {
					this.approval_id5 = item.approval_id
					this.qkd_show = true
				} else if(item.type === '报销单'){
				  this.approval_id6 = item.approval_id
          this.bxd_show = true
        } else if(item.type === '验收单'){
				  this.approval_id7 = item.approval_id
          this.ysd_show = true
        } else if(item.type === '个人请款单'){
          this.approval_id8 = item.approval_id
          this.gzd_show = true
        }
			},
			viewInfo(item) {
				this.qkd_show = false
				this.qgd_show = false
				this.cpj_show = false
				this.psb_show = false
				this.sqgz_show = false
        this.bxd_show = false
        this.ysd_show = false
        this.gzd_show = false
				this.chooseTemShow = false
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
						if(item.type === '呈批件') {
							this.cpj_if = true
							this.form_Lista = create_cengpijian_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '合同评审表') {
							this.psb_if = true
							this.form_Lista = create_hetongpingshen_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '请款单') {
							this.qkd_if = true
							this.form_Lista = create_qingkuandan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '申请公章') {
							this.sqgz_if = true
							this.form_Lista = create_gongzhang_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '请购单') {
							this.qgd_if = true
							this.form_Lista = create_qinggoudan_list(res.data.data)
							this.get_img(this.form_Lista.many_enclosure)
							this.get_file(this.form_Lista.many_enclosure)
						} else if(item.type === '报销单'){
						  this.bxd_if = true
              this.form_Lista = create_baoxiaodan_list(res.data.data)
              this.get_img(this.form_Lista.many_enclosure)
              this.get_file(this.form_Lista.many_enclosure)
            } else if(item.type == '验收单'){
              this.ysd_if = true
              this.form_Lista = create_yanshoudan_list(res.data.data)
            } else if (item.type == '个人请款单'){
						  this.gzd_if = true
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
              if(item.form_auto_filled_value){
							  item.form_auto_filled_value = JSON.parse(item.form_auto_filled_value)
              }
						})
						this.form_Listb = create_approval_list(res.data.data)
					})
			},
      //get_img方法
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
			returnList() {
				this.psb_if = false
				this.qgd_if = false
				this.cpj_if = false
				this.qkd_if = false
				this.sqgz_if = false
        this.bxd_if = false
        this.ysd_if = false
        this.gzd_if = false
				this.chooseTemShow = true
			},
			returnForm() {
				this.chooseTemShow = false
				this.formShow = true
			},
			chooseTem() {
				this.at_qingkuanShow = false
				this.chooseTemShow = true
				this.formShow = false
				this.psb_show = false
				this.qgd_show = false
				this.qkd_show = false
				this.sqgz_show = false
				this.cpj_show = false
        this.bxd_show = false
        this.ysd_show = false
        this.gzd_show = false
			},
      //tab 切換
			handleClick(tab) {
        this.user_info = []
				this.approval_id1 = ''
				this.approval_id2 = ''
				this.approval_id3 = ''
				this.approval_id4 = ''
				this.approval_id5 = ''
        this.approval_id6 = ''
        this.approval_id7 = ''
        this.approval_id8 = ''
        this.link = ''
        this.inspection_type_id = ''
				this.navIndex = JSON.parse(tab.index)
				this.qkd_show = false
				this.qgd_show = false
				this.cpj_show = false
				this.psb_show = false
				this.sqgz_show = false
        this.bxd_show = false
        this.ysd_show = false
        this.gzd_show = false
        this.psb_if = false
        this.qgd_if= false
        this.cpj_if= false
        this.qkd_if= false
        this.sqgz_if= false
        this.bxd_if= false
        this.gzd_if = false
        this.forms = true
				this.chooseTemShow = false
				this.formShow = true
        this.at_qingkuanShow = false
				if(this.navIndex === 0) {
					this.psb_show = true
					this.approval_type = 111
				} else if(this.navIndex === 1) {
					this.qgd_show = true
					this.approval_type = 1000
				} else if(this.navIndex === 2) {
					this.qkd_show = true
					this.as_what_show = true
					this.formShow = false
					this.approval_type = 1001
				} else if(this.navIndex === 3) {
					this.sqgz_show = true
					this.approval_type = 5
				} else if(this.navIndex === 4) {
					this.cpj_show = true
					this.approval_type = 6
				} else if(this.navIndex === 5){
				  this.bxd_show = true
          this.approval_type = 11
        } else if(this.navIndex === 6){
          this.ysd_show = true
          this.get_ysd_type()
          this.as_what_show = true
          this.formShow = false
          this.approval_type = 12
        }else if(this.navIndex === 7){
				  this.gzd_show = true
          this.approval_type = 13
        }
        this.get_approval_user_info()
			},
      get_approval_user_info(){
        this.user_info = []
        let str = ''
        switch (this.approval_type){
          case 111:
            str = 111
            break;
          case 1000:
            str = 7
            break;
          case 1001:
            str = 8
            break;
          case 5:
            str = 5
            break;
          case 6:
            str = 6
            break;
          case 11:
            str = 11
            break;
          case 12:
            str = 12
            break;
          case 13:
            str = 13
            break;
        }
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('type',str)
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
      get_ysd_type(){
        let str = this.$test('/index.php/Mobile/approval/inspection_list')
			  this.$http.post(str)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.ysdType = res.data.data
          })
      },
			close_sqgz(item, index) {
				this.sqgz_ruleForm.add.splice(index, 1)
			},
			close_qgd(item, index) {
				this.qgd_ruleForm.add.splice(index, 1)
			},
			return_show() {
				this.$emit('return_exam')
			},
			return_Add() {
				this.formShow = false
				this.psb_show = false
				this.$router.push({ path: '/work/exam' })
			},
			as_click(index) {
				if(index === 3){
					this.formShow = true
					this.qkd_show = true
					this.as_what_show = false
					this.at_qingkuanShow = false
					return
				}else{
				  this.prc_index = index
					this._getExamList()
					this.at_qingkuanShow = true
					this.as_what_show = false
				}
			},
      ysd_click(pr){
        this.as_what_show = !this.as_what_show
        this.ysdType = []
        this.loading_show = true
        this.inspection_type_id = pr
        setTimeout(()=>{
          this.loading_show = false
          this.formShow = true
        },500)
      },
      close_as(){
        this.as_what_show = !this.as_what_show
        this.ysdType = []
      },
			_getExamList() {

				let type
        console.log(this.prc_index)
				if(this.prc_index === 0) {
					type = 3
				} else if(this.prc_index === 1) {
					type = 1
				} else if(this.prc_index === 2) {
					type = 6
				} else {
					type = -1
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_type", type);
				param.append("each", '10');
				param.append("p", this.pageIndex);
				param.append("company_id", this.nowCompanyId);
        let str = this.$test("/index.php/Mobile/approval/request_monry_basis")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.$testLogin(judge)
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_exam_list(item))
						})
						this.untreated = arr
						if(arr.length < 10) {
							this.nextPageShow = false
						}
					})
			},
			_getComPersonList(){
				let newparam = new URLSearchParams();
				newparam.append("company_id",this.nowCompanyId);
        let str = this.$test("/index.php/Mobile/user/get_company_personnel")
				this.$http.post(str,newparam)
				.then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
				   	let reaDa=[]
				    res.data.data.forEach((item)=>{
				    	item.avatar = getAvatar(item.avatar)
				    	reaDa.push(item)
				    })
				   	this.setComPersonList(reaDa)
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
		components: {
			loading,
			chooseTemplate,
			psb,
			qgd,
			cpj,
			qkd,
			sqgz,
      bxd,
      ysd,
      gzd,
			addPsb,
			addQgd,
			addCpj,
			addSqgz,
			addQkd,
      addBxd,
      addYsd,
      addGzd
		}
	}
</script>

<style lang="scss">
	.as_qingkuan {
		width: 600px;
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
					margin-top: 1px;
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
  .sendsd{
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
    >div{
      width: 450px;
      background: #ffffff;
      margin: 200px auto;
      z-index: 99;
      .close{
        display: block;
        width: 100%;
        overflow: hidden;
        text-align: center;
        .huifu{
          line-height: 53px;
          font-size: 16px;
        }
        i{
          float: right;
          font-size: 16px;
          margin: 20px 10px 0;
          cursor: pointer;
          border-radius: 100%;
          border: 1px solid black;
          color: #000;
        }
      }
      .el-textarea{
        display: block;
        width: 90%;
        margin: 0 auto;
      }
      .sr{
        overflow: hidden;
        display: block;
        margin-top: 10px;
        padding-bottom: 10px;
        #picc{
          position: relative;
          width: 70%;
          .el-upload-list__item{
            position: relative;
            top: 30px;
            left: 15px;
            width: 50px;
            height: 50px;
          }
          .el-upload{
            display: block;
          }
          .el-upload--picture-card{
            z-index: 999;
            position: absolute;
            left: 3px;
            top: 0px;
            width: 0px;
            height: 0px;
            margin-top: 12px;
            margin-left: 27px;
            outline: none;
            background: none;
            border: none;
            border-radius: 0;
            line-height: 0;
            i{
              font-size: 20px;
              z-index: 999;
            }
          }
        }
        #file{
          width: 70%;
          position: relative;
          .el-upload-list--text{
            position: relative;
            top: 0px;
            left: 15px;
            width: 100%;
          }
          .el-upload--text{
            width: 0px;
            height: 0px;
            margin-top: 40px;
            margin-left: 30px;
            outline: none;
            background: none;
            border: none;
            border-radius: 0;
            line-height: 0;
            i{
              font-size: 20px;
            }
          }
        }
        .el-button{
          padding: 4px 10px;
          float: right;
          margin-right: 20px;
          margin-top: 14px;
        }
      }
    }
  }
	.add_approval_wrapper {
		background: #FFFFFF;
		box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		width: 600px;
		.add_approval {
			padding: 0px 10px;
			>.nav {
				.el-tabs__nav {
					width: 100%;
				}
				.el-tabs__item {
					font-size: 12px;
					font-weight: 700;
					width: 75px;
					text-align: center;
				}
			}
			.form {
				background-color: #FFFFFF;
				padding: 10px;
			}
		}
	}

	.el-radio+.el-radio {
		margin-left: 10px;
	}
	.el-form-item {
		margin-bottom: 20px;
	}
  .add{
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
