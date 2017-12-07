<template>
	<div class="add_approval_wrapper">
		<div class="add_approval">
			<div class="nav">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="合同审核表"></el-tab-pane>
					<el-tab-pane label="请购单"></el-tab-pane>
					<el-tab-pane label="呈批件"></el-tab-pane>
					<el-tab-pane label="申请公章"></el-tab-pane>
					<el-tab-pane label="请款单"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="from_template" v-show="formShow">
				<el-button type="primary" plain @click="chooseTem">从模版选择</el-button>
			</div>
			<div class="form" v-show="formShow">
				<addQkd v-if="qkd_show" :approval_id="approval_id" @return_exam="return_Add" :form_approval_id="form_approval_id"></addQkd>
				<addCpj v-if="cpj_show" :approval_id="approval_id" @return_exam="return_Add"></addCpj>
				<addPsb v-if="psb_show" :approval_id="approval_id" @return_exam="return_Add"></addPsb>
				<addQgd v-if="qgd_show" :approval_id="approval_id" @return_exam="return_Add"></addQgd>
				<addSqgz v-if="sqgz_show" :approval_id="approval_id" @return_exam="return_Add"></addSqgz>
			</div>
		</div>
		<div class="as_what" v-show="as_what_show">
			<ul>
				<h2>选择请款依据</h2>
				<i class="el-icon-close" @click="as_what_show = !as_what_show"></i>
				<li v-for="(item,index) in asType" @click="as_click(index)">{{item}}</li>
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
		<psb v-if="psb_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></psb>
		<qgd :qk_return="qk_return" @return_qk="return_qk" v-if="qgd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qgd>
		<cpj v-if="cpj_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></cpj>
		<sqgz v-if="sqgz_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></sqgz>
		<qkd :form_approval_id="form_approval_id" v-if="qkd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="false" @return_psb="returnList" :file_arr="file_arr"></qkd>
	</div>
</template>

<script>
	import addQgd from '@/base/add_approval/add_qgd'
	import addCpj from '@/base/add_approval/add_cpj'
	import addPsb from '@/base/add_approval/add_psb'
	import addSqgz from '@/base/add_approval/add_sqgz'
	import addQkd from '@/base/add_approval/add_qkd'
	import psb from '@/base/exam_form/psb'
	import qgd from '@/base/exam_form/qgd'
	import cpj from '@/base/exam_form/cpj'
	import qkd from '@/base/exam_form/qkd'
	import sqgz from '@/base/exam_form/sqgz'
	import chooseTemplate from '@/base/add_approval/choose_template'
	import loading from '@/base/loading/loading'
	import { create_depart_list } from 'common/js/initial/depart.js'
	import { create_approval_list } from '@/common/js/approval/approval_list'
	import { create_exam_list } from '@/common/js/approval/exam'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang'
	import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				navIndex: 0,
				asType: ['请购单', '合同评审表', '呈批件', '其他'],
				form_Lista: {},
				form_Listb: {},
				activeName: '',
				psb_if: false,
				qgd_if: false,
				cpj_if: false,
				qkd_if: false,
				sqgz_if: false,
				formShow: true,
				chooseTemShow: false,
				as_what_show: false,
				qkd_show: false,
				qgd_show: false,
				cpj_show: false,
				psb_show: true,
				sqgz_show: false,
				loading_show: false,
				at_qingkuanShow:false,
				untreated: [],
				file_arr: [],
				nowType: 1,
				insertType: 0,
				approval_type: 111,
				approval_id: '',
				form_approval_id:'',
				qk_return:false,
				nextPageShow: true,
				pageIndex:1,
				xindex:0
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
			}
		},
		created(){
			this._getUserCompanyList()
			this._getToken()
		},
		methods: {
			_getComDepart() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_department_lest", param)
					.then((res) => {
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
				this.$http.post("/index/Mobile/path/get_token", nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
					})
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
			return_qk(){
				this.qgd_if = false
				this.qk_return = false
				this.at_qingkuanShow = true
			},
			qkReturn(){
				
			},
			qkView(item,index){
				this.qk_return = true
				this.at_qingkuanShow = false
				if(item.type === '请购单'){
					this.qgd_if = true
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", item.approval_id);
				this.$http.post("/index/Mobile/approval/approval_process_show", param)
					.then((res) => {
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
						}
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", item.approval_id);
				nparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/approval_process_personnel", nparam)
					.then((res) => {
						res.data.data.content.forEach((item, index) => {
							if(item.picture) {
								let arr = []
								let zparam = new URLSearchParams();
								zparam.append("enclosure_id", item.picture);
								this.$http.post("/index/Mobile/approval/look_enclosure", zparam)
									.then((res) => {
										res.data.data.picture.forEach((item) => {
											if(item != '') {
												arr.push('http://img-bbsf.6655.la/' + item)
											}
										})
									})
								res.data.data.content[index].picture = arr
							}
						})
						this.form_Listb = create_approval_list(res.data.data)
					})
			},
			qkUser(item,index){
				this.form_approval_id = ''
				this.at_qingkuanShow = false
				this.form_approval_id = item.approval_id
				this.formShow = true
				this.qkd_show = true
			},
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/user/companies_list", param)
					.then((res) => {	
						this.setNowCompanyId(res.data.data[0].company_id)
						this.setCompanyList(res.data.data)
						this.setNowCompanyName(res.data.data[0].company_name)
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
				this.formShow = true
				this.qkd_show = false
				this.qgd_show = false
				this.cpj_show = false
				this.psb_show = false
				this.sqgz_show = false
				this.at_qingkuanShow = false
				this.chooseTemShow = false
				this.approval_id = item.approval_id
				if(item.type === '合同评审表') {
					this.psb_show = true
				} else if(item.type === '请购单') {
					this.qgd_show = true
				} else if(item.type === '呈批件') {
					this.cpj_show = true
				} else if(item.type === '申请公章') {
					this.sqgz_show = true
				} else if(item.type === '请款单') {
					this.qkd_show = true
				}

			},
			viewInfo(item) {
				this.qkd_show = false
				this.qgd_show = false
				this.cpj_show = false
				this.psb_show = false
				this.sqgz_show = false
				this.chooseTemShow = false
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", item.approval_id);
				this.$http.post("/index/Mobile/approval/approval_process_show", param)
					.then((res) => {
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
						}
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", item.approval_id);
				nparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/approval_process_personnel", nparam)
					.then((res) => {
						res.data.data.content.forEach((item, index) => {
							if(item.picture) {
								let arr = []
								let zparam = new URLSearchParams();
								zparam.append("enclosure_id", item.picture);
								this.$http.post("/index/Mobile/approval/look_enclosure", zparam)
									.then((res) => {
										res.data.data.picture.forEach((item) => {
											if(item != '') {
												arr.push('http://img-bbsf.6655.la/' + item)
											}
										})
									})
								res.data.data.content[index].picture = arr
							}
						})
						this.form_Listb = create_approval_list(res.data.data)
					})
			},
			get_img(many_enclosure) {
				if(!many_enclosure) {
					return
				}
				many_enclosure.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_enclosure", param)
							.then((res) => {
								let arr = []
								res.data.data.picture.forEach((item) => {
									if(item != '') {
										arr.push('http://img-bbsf.6655.la/' + item)
									}
								})
								this.img_arr = arr
								this.$set(this.form_Lista, 'img_list', arr)
							})
					}
				})
			},
			get_file(many_enclosure) {
				this.file_arr = []
				if(!many_enclosure) {
					return
				}
				many_enclosure.forEach((item) => {
					if(item.type === 4) {
						let param = new URLSearchParams();
						param.append("attachments_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_attachments", param)
							.then((res) => {
								let obj = {}
								let file_data = res.data.data
								let file_add = 'http://img-bbsf.6655.la/' + file_data.attachments + '?attname=' + file_data.file_name + file_data.attribute
								obj.name = file_data.file_name
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
			},

			handleClick(tab) {
				this.navIndex = JSON.parse(tab.index)
				this.qkd_show = false
				this.qgd_show = false
				this.cpj_show = false
				this.psb_show = false
				this.sqgz_show = false
				this.chooseTemShow = false
				this.formShow = true
				if(this.navIndex === 0) {
					this.psb_show = true
					this.approval_type = 111
				} else if(this.navIndex === 1) {
					this.qgd_show = true
					this.approval_type = 1000
				} else if(this.navIndex === 2) {
					this.cpj_show = true
					this.approval_type = 6
				} else if(this.navIndex === 3) {
					this.sqgz_show = true
					this.approval_type = 5
				} else if(this.navIndex === 4) {
					this.as_what_show = true
					this.formShow = false
					this.approval_type = 1001
				}
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
				this.$emit('return_exam')
			},

			as_click(index) {
				this._getExamList(index)
				this.at_qingkuanShow = true
				this.as_what_show = false
				
			},
			_getExamList(index) {
				if(!index){
					index = this.xindex
				}
				this.xindex = index
				let type
				if(this.xindex === 0) {
					type = 3
				} else if(this.xindex === 1) {
					type = 1
				} else if(this.xindex === 2) {
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
				this.$http.post("/index/Mobile/approval/request_monry_basis", param)
					.then((res) => {
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
				this.$http.post("/index/Mobile/user/get_company_personnel",newparam)
				.then((res)=>{
				   	let reaDa=[]
				    res.data.data.forEach((item)=>{
				    	item.avatar = 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
				    	reaDa.push(item)
				    })	
				   	this.setComPersonList(reaDa)
				})
			}
		},
		components: {
			loading,
			chooseTemplate,
			psb,
			qgd,
			cpj,
			qkd,
			sqgz,
			addPsb,
			addQgd,
			addCpj,
			addSqgz,
			addQkd
		}
	}
</script>

<style lang="scss">
	.as_qingkuan {
		width: 550px;
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
					margin-top: 15px;
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
					font-size: 15px;
					font-weight: 700;
					width: 110px;
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
		margin-bottom: 30px;
	}
</style>