<template>
	<div class="form_receipt">
		<div class="nav">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="未处理"></el-tab-pane>
				<el-tab-pane label="已处理"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="list" v-show="listShow">
			<ul>
				<li v-for="(item,index) in untreated" :key="item.approval_id">
					<div class="avatar">
						<img :src="item.avatar" alt="" />
					</div>
					<div class="edit">
						<el-button type="primary" round @click="listCli(item,index)">查看</el-button>
					</div>
					<div class="content">
						<div class="creatTime">
							<span>发起时间：{{item.add_time}}</span>
						</div>
						<div class="name">
							<span>名称：{{item.name}}</span>
						</div>
						<!--<div class="creatTime">
							<span>处理时间：{{item.add_time}}</span>
						</div>-->
						<div class="type">
							<span>类型：{{item.type}}</span>
						</div>
						<div class="title">
							<span>标题：{{item.title}}</span>
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
		<psb v-if="psb_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb">
		</psb>
		<qgd v-if="qgd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb">
		</qgd>
		<qkd v-if="qkd_if" :form_Lista="form_Lista" :form_Listb="form_Listb" :handle_show="handle_show" :psb_approval_id="psb_approval_id" @return_psb="return_psb">
		</qkd>
	</div>
</template>

<script>
	import psb from '@/base/exam_form/psb'
	import qgd from '@/base/exam_form/qgd'
	import qkd from '@/base/exam_form/qkd'
	import { create_exam_list } from '@/common/js/approval/exam'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang'
	import { create_qinggoudan_list } from '@/common/js/approval/qinggoudan'
	import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { create_approval_list } from '@/common/js/approval/approval_list'
	import { mapGetters ,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				untreated: [],
				form_Lista: {},
				form_Listb: {},
				finance_type: 1,
				psb_if: false,
				qgd_if: false,
				listShow: true,
				nextPageShow: true,
				handle_show: true,
				qkd_if: false,
				pageIndex: 1,
				psb_approval_id: '',
				activeName: ''
			}
		},
		watch: {
			pageIndex() {
				this._get_data()
			},
			nowCompanyId(){
				this._get_data()
			}
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user'
			])
		},
		mounted() {
			if(this.$route.path === '/work/formReceipt') {
				this.$emit('changeWorkIndex', 4)
			}
		},
		created() {
			this._get_data()
			this._getUserCompanyList()
			
		},
		methods: {
			handleClick(tab) {
				let index = tab.index
				if(index === '0') {
					this.handle_show = true
					this.finance_type = 1
					this._get_data()
				} else if(index === '1') {
					this.handle_show = false
					this.finance_type = 2
					this._get_data()
				}

			},
			first_page() {
				this.nextPageShow = true
				this.pageIndex = 1
			},
			last_page() {
				this.nextPageShow = true
					--this.pageIndex
			},
			next_page() {
				++this.pageIndex
			},
			nav_cli(index) {

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
			_get_data() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("type", this.finance_type);
				param.append("company_id", this.nowCompanyId);
				param.append("p", this.pageIndex);
				param.append("each", 10);
				this.$http.post("/index/Mobile/find/finance_list_formal", param)
					.then((res) => {
						console.log(res)
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
			return_psb() {
				this.psb_if = false
				this.qgd_if = false
				this.qkd_if = false
				this.listShow = true
			},
			listCli(item) {
				this.listShow = false
				this.psb_approval_id = item.approval_id
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", item.approval_id);
				this.$http.post("/index/Mobile/approval/approval_process_show", param)
					.then((res) => {
						if(item.type === '呈批件') {
							this.form_Lista = create_cengpijian_list(res.data.data)
							this.get_img(this.form_Lista.img_list)
						} else if(item.type === '合同评审表') {
							this.psb_if = true
							this.form_Lista = create_hetongpingshen_list(res.data.data)
							if(res.data.data.enclosure_id) {
								this.get_img(res.data.data.enclosure_id)
							}
							if(res.data.data.many_enclosure) {
								this.get_moreimg(res.data.data.many_enclosure)
							}
						} else if(item.type === '请款单') {
							this.qkd_if = true
							this.form_Lista = create_qingkuandan_list(res.data.data)
							if(res.data.data.contract_id) {
								this.get_img(res.data.data.contract_id[0].contract_id)
							}
							if(res.data.data.many_enclosure) {
								this.get_moreimg(res.data.data.many_enclosure)
							}
						} else if(item.type === '申请公章') {
							this.form_Lista = create_gongzhang_list(res.data.data)
						} else if(item.type === '请购单') {
							this.qgd_if = true
							this.form_Lista = create_qinggoudan_list(res.data.data)
							if(!this.form_Lista.enclosure_id) {
								return
							}
							this.get_img(this.form_Lista.enclosure_id.contract_id)
						}
					})
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				nparam.append("approval_id", item.approval_id);
				nparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/approval/approval_process_personnel", nparam)
					.then((res) => {
						this.form_Listb = create_approval_list(res.data.data)
						if(res.data.data.content) {
							res.data.data.content.forEach((item) => {
								if(item.picture) {
									let zparam = new URLSearchParams();
									zparam.append("enclosure_id", item.picture);
									this.$http.post("/index/Mobile/approval/look_enclosure", zparam)
										.then((res) => {
											let arr = []
											res.data.data.picture.forEach((item) => {
												if(item != '') {
													arr.push('http://img-bbsf.6655.la/' + item)
												}
											})
											item.picture = arr
										})
								}
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
							this.$http.post("/index/Mobile/approval/look_enclosure", zparam)
								.then((res) => {

									let arr = []
									res.data.data.picture.forEach((item) => {
										if(item != '') {
											arr.push('http://img-bbsf.6655.la/' + item)
										}
									})
									this.$set(this.form_Listb, 're_pic', arr)
								})
						}

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
			//		获取图片
			get_img(contract_id) {
				if(!contract_id) {
					return
				}
				let param = new URLSearchParams();
				param.append("enclosure_id", contract_id);
				this.$http.post("/index/Mobile/approval/look_enclosure", param)
					.then((res) => {
						let arr = []
						res.data.data.picture.forEach((item) => {
							if(item != '') {
								if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
									arr.push('http://img-bbsf.6655.la/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
								} else {
									arr.push('http://img-bbsf.6655.la/' + item)
								}
							}
						})
						this.$set(this.form_Lista, 'img_list', arr)
					})
			},
			get_moreimg(many) {
				many.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_enclosure", param)
							.then((res) => {
								let arr = []
								res.data.data.picture.forEach((item) => {
									if(item != '') {
										if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
											arr.push('http://img-bbsf.6655.la/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
										} else {
											arr.push('http://img-bbsf.6655.la/' + item)
										}
									}
								})
								this.$set(this.form_Lista, 'img_list', arr)
							})
					}
				})
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/path/get_token", nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			}
		},
		
		components: {
			psb,
			qgd,
			qkd
		}
	}
</script>

<style lang="scss">
	.form_receipt {
		>.nav {
			width: 100%;
			.el-tabs__nav {
				background: #FFFFFF;
				width: 100% !important;
			}
			.el-tabs__header {
				margin-bottom: 5px;
			}
			.el-tabs__active-bar {
				width: 50%!important;
			}
			.el-tabs__item {
				font-weight: 700;
				font-size: 15px;
				width: 50%;
				text-align: center;
			}
		}
		.list {
			width: 100%;
			ul {
				>.page {
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
				li {
					padding: 5px;
					background: #ffffff;
					margin-bottom: 5px;
					color: #2D2F33;
					font-size: 14px;
					box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					span {
						line-height: 18px;
					}
					.avatar {
						display: inline-block;
						vertical-align: top;
						margin-top: 4px;
						img {
							width: 30px;
							height: 30px;
							border-radius: 50%;
							display: block;
						}
					}
					.edit {
						display: inline-block;
						float: right;
						margin-right: 20px;
						margin-top: 30px;
						cursor: pointer;
						.el-button.is-round {
							padding: 4px 12px;
						}
					}
					.content {
						padding: 4px 0;
						display: inline-block;
						max-width: 400px;
					}
				}
			}
		}
	}
</style>