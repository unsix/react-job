<template>
	<div class="workWrapper">
		<div class="index">
			<div class="top">
				<div class="title">
					<span>{{nowCompanyName}}</span>
					<span class="changeCompany">更换公司
					<ul @mouseover ="userIconOverLeft" @mouseout="userIconOutLeft" v-show="userOperationLeftShow">
						<li v-for="(item,index) in companyList" @click="changeCompany(item,index)">{{item.company_name}}</li>
					</ul>
					<img src="../../assets/down.svg" @mouseover ="userIconOverLeft" @mouseout="userIconOutLeft" ref="userIconLeft"/>
				</span>

				</div>
				<div class="nav">
					<div class="nav_main">
						<a v-for="(item,index) in typeArr" @click="changeType(item,index)">{{item.title}}</a>
					</div>
				</div>
				<div class="search">
					<input type="text" placeholder="暂不能使用" />
					<img src="../../assets/find.svg" alt="" />
				</div>
				<div class="personInfo">
					<div class="person_main">
						<a>{{user.name}}</a>
						<img src="../../assets/down.svg" alt="" @mouseover="userIconOver" @mouseout="userIconOut" ref="userIcon" />
						<div class="userOperation" v-show="userOperationShow" @mouseover="userIconOver" @mouseout="userIconOut">
							<router-link to="">升级说明</router-link>
							<router-link to="">个人设置</router-link>
							<a @click="compamyShow = true">创建公司</a>
							<router-link to="">退出登录</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="work">
			<div class="side_left">
				<div class="info_wrapper">
					<a class="info">
						<img :src="user.avatar" />
						<span>{{user.name}}</span>
					</a>
				</div>
				<div class="work_wrapper">
					<ul>
						<li class="work_item" v-for="(item,index) in workList" @click="doList(item,index)">
							<router-link to="" :class="{'active' : index === workIndex}">
								<span class="content">{{item}}</span>
								<span class="num_icon"></span>
							</router-link>
						</li>
					</ul>
				</div>
				<!--<div class="department_wtapper">
					<div class="title">部门</div>
					<router-link to="">软件技术部</router-link>
				</div>-->
			</div>
			<div class="info_main">
				<router-view @changeWorkIndex="changeWorkIndex">
					
				</router-view>
						
			</div>
			<div class="side_right">
				<Date></Date>
			</div>
		</div>
	</div>
</template>
<script>
	import { create_depart_list } from 'common/js/initial/depart.js'
	import { createPersonInfo } from 'common/js/person_info'
	import { mapMutations } from 'vuex'
	import Date from '@/base/date/date'
	import { prefixStyle } from '@/common/js/dom'
	const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				examNav: ['日常', '审批'],
				pStr: '',
				currentIndex: 0,
				now_type_name: '日常',
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				pickerOptions1: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				typeArr: [{
						'title': '工作',
						'url': '/work'
					},
					{
						'title': '应用',
						'url': '/apply'
					}
				],
				value1: '',
				compamyShow: false,
				userOperationShow: false,
				userOperationLeftShow: false,
				ComPartPersonList: [],
				workList:[],
				workIndex:0
			}
		},
		methods: {
			judgeState() {
				let m = this.userState.manage
				let f = this.userState.finance
				if(m === 0 && f === 0) {
					this.workList = ['审批', '发起审批', '通讯录']
				}
				if(m === 1 && f === 0) {
					this.workList = ['审批', '发起审批', '公司管理', '权限管理', '邀请同事', '通讯录']
				}
				if(m === 0 && f === 1) {
					this.workList = ['审批', '发起审批', '表单回执', '邀请同事', '通讯录']
				}
				if(m === 1 && f === 1) {
					this.workList = ['审批', '发起审批', '公司管理', '权限管理', '表单回执', '邀请同事', '通讯录']
				}
			},
			changeType(item, index) {
				if(index === 0) {
					this.$router.push('/index/work');
				} else {
					this.$router.push('/index/apply/mineApp');
				}
			},
			changeWorkIndex(num){
				this.workIndex = num
			},
			userIconOver() {
				this.$refs.userIcon.style.transition = 'all 0.4s'
				this.$refs.userIcon.style[transform] = `rotate(180deg)`
				this.userOperationShow = true
			},
			userIconOut() {
				this.$refs.userIcon.style.transition = 'all 0.4s'
				this.$refs.userIcon.style[transform] = `rotate(360deg)`
				this.userOperationShow = false
			},
			userIconOverLeft() {
				this.$refs.userIconLeft.style.transition = 'all 0.4s'
				this.$refs.userIconLeft.style[transform] = `rotate(180deg)`
				this.userOperationLeftShow = true
			},
			userIconOutLeft() {
				this.$refs.userIconLeft.style.transition = 'all 0.4s'
				this.$refs.userIconLeft.style[transform] = `rotate(360deg)`
				this.userOperationLeftShow = false
			},
			changeCompany(item, index) {
				console.log(item.company_name)
				this.workIndex = 0
				this.setNowCompanyName(item.company_name)
				this.userOperationLeftShow = false
				this.setNowCompanyId(item.company_id)
				localStorage.nowCompanyId = JSON.stringify(item.company_id);
				localStorage.nowCompanyName = JSON.stringify(item.company_name);
				this.$router.push('/work');
			},
			doList(item, index) {
				if(item === '创建公司') {
					this.compamyShow = true
					return
				}
				this.workIndex = index
				this.now_type_name = item
				switch(item) {
					case '公司管理':
						this._getComPartPersonList()
						this.$router.push({ path: '/work/manageCompany' })
						break;
					case '权限管理':
						this.$router.push({ path: '/work/jurisdictionManage' })
						break
					case '表单回执':
						this.$router.push({ path: '/work/formReceipt' })
						break;
					case '通讯录':
						this._getComPersonList()
						this.$router.push({ path: '/work/addressBook' })
						break;
					case '日常':
						this.$router.push({ path: '/work/everyday' })
						break;
					case '发起审批':
						this._getComPersonList()
						this._getComDepart()
						this.$router.push({ path: '/work/addApproval' })
						break;
					case '邀请同事':
						this._getComDepart()
						this.$router.push({ path: '/work/inviteCol' })
						break;
					case '审批':
						this.$router.push({ path: '/work/exam' })
						break;
				}
			},
			_getUserState() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				param.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/User/return_company_new", param)
					.then((res) => {
						console.log(res)
						let is_manage = parseInt(res.data.data.is_manage)
						let is_finance = parseInt(res.data.data.is_finance)
						this.setUserState({
							'manage': is_manage,
							'finance': is_finance,
						})
						this.judgeState()
					})
			},
			_getToken(uid) {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/path/get_token", nparam)
					.then((res) => {
//						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
			_getComPartPersonList() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_department_lest", param)
					.then((res) => {
						let resData = res.data.data
						for(let j = 0, len = resData.length; j < len; j++) {
							if(this.numOne >= len) {
								return
							}
							let obj = {}
							this.$set(obj, 'department_name', resData[j].department_name)
							let newparam = new URLSearchParams();
							newparam.append("company_id", this.nowCompanyId);
							newparam.append("department_id", resData[j].department_id);
							this.$http.post("/index/Mobile/user/get_company_personnel", newparam)
								.then((res) => {
									let reaDa = []
									res.data.data.forEach((item) => {
										reaDa.push(createPersonInfo(item))
									})
									this.$set(obj, 'person', reaDa)
									this.ComPartPersonList.push(obj)
								})
							this.numOne++
						}
						this.setComPartPersonList(this.ComPartPersonList)
					})
			},
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
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/user/companies_list", param)
					.then((res) => {
						this.setNowCompanyId(res.data.data[0].company_id)
						this.setCompanyList(res.data.data)
						this.setNowCompanyName(res.data.data[0].company_name)
						this._getUserState()
					})
			},
			_getComPersonList() {
				let newparam = new URLSearchParams();
				newparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_company_personnel", newparam)
					.then((res) => {
						let reaDa = []
						res.data.data.forEach((item) => {
							item.avatar = 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
							reaDa.push(item)
						})
						this.setComPersonList(reaDa)

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
			})
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
		components: {
			Date
		},
		mounted() {},
		created() {
			this.setUser(JSON.parse(localStorage.user))
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
			this.setNowCompanyName(JSON.parse(localStorage.nowCompanyName))
			this._getToken()
			this._getUserState()
		},
		watch: {
			nowCompanyId() {
				this.compamyShow = false
				this._getUserState()
				this._getToken()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.workWrapper {
		width: 100%;
		height: 100%;
		background: rgb(227, 228, 233);
		.index {
			.top {
				width: 100%;
				background: #f4f6fc;
				display: flex;
				color: #666666;
				height: 60px;
				font-size: 14px;
				text-decoration: none;
				box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				.title {
					flex: 1;
					align-self: center;
					span {
						display: inline-block;
						float: left;
						margin-left: 40px;
						&.changeCompany {
							margin-left: 10px;
							font-size: 12px;
							color: #67C23A;
							cursor: pointer;
							margin-top: 1px;
							position: absolute;
							ul {
								min-width: 100px;
								position: absolute;
								top: 15px;
								left: 0px;
								background: #f4f6fc;
								padding: 10px 0;
								border-radius: 2px;
								box-shadow: 0 0 2px rgba(0, 0, 0, .2);
								z-index: 2;
								li {
									display: block;
									padding: 10px 6px;
									color: #666666;
									&:hover {
										color: #F09835;
									}
								}
							}
							img {
								width: 20px;
								height: 20px;
								position: absolute;
								top: -4px;
								left: 50px;
								cursor: pointer;
							}
						}
					}
				}
				.nav {
					flex: 0 20%;
					align-self: center;
					a {
						display: inline-block;
						border-bottom: 3px solid transparent;
						padding: 22px 10px 20px;
						color: #666666;
						cursor: pointer;
						&.active {
							border-bottom: 3px solid #fc923f;
						}
						&:hover {
							color: #FC923F;
						}
					}
				}
				.search {
					flex: 0 20%;
					align-self: center;
					position: relative;
					input {
						float: right;
						border: 1px solid #ccc;
						padding: 12px 100px;
						border-radius: 3px;
						/*css3属性IE不支持*/
						padding-left: 5px;
						text-indent: 10px;
						outline: none;
					}
					img {
						width: 16px;
						height: 16px;
						position: absolute;
						top: 12px;
						right: 20px;
						cursor: pointer;
					}
				}
				.personInfo {
					flex: 1;
					align-self: center;
					.person_main {
						position: relative;
						float: right;
						margin-right: 40px;
						.userOperation {
							position: absolute;
							top: 20px;
							right: 0px;
							width: 84px;
							padding: 10px 0;
							background: #FFF;
							border-radius: 2px;
							box-shadow: 0 0 2px rgba(0, 0, 0, .2);
							line-height: 27px;
							z-index: 2;
							a {
								display: block;
								height: 26px;
								line-height: 26px;
								padding: 0 15px;
								color: #333;
								font-size: 13px;
								&:hover {
									color: #3487E2;
								}
							}
						}
						a {
							cursor: pointer;
							display: inline-block;
							height: 20px;
							line-height: 20px;
						}
						img {
							width: 20px;
							vertical-align: top;
							cursor: pointer;
						}
					}
				}
			}
		}
		.work {
			margin-top: 5px;
			display: flex;
			justify-content:center;
			align-items:flex-start;
			>.info_main {
				width: 600px;
				margin: 0 10px;
			}
			>.side_left {
				width: 180px;
				background: #fff;
				padding: 20px;
				border-radius: 2px;
				box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				>.work_wrapper {
					padding: 7px 0;
					border-bottom: 1px solid #EEE;
					>ul {
						>.work_item {
							position: relative;
							color: #3e5685;
							font-size: 13px;
							line-height: 28px;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							font-size: 15px;
							>a {
								color: #4D6595;
								width: 100%;
								display: inline-block;
								&:hover {
									color: #199475;
								}
								&.active {
									color: #199475;
								}
							}
						}
					}
				}
				.department_wtapper {
					font-size: 13px;
					width: 180px;
					border-top: none;
					-webkit-border-bottom-left-radius: 2px;
					border-bottom-left-radius: 2px;
					-webkit-border-bottom-right-radius: 2px;
					border-bottom-right-radius: 2px;
					position: relative;
					>.title {
						color: #999;
						height: 28px;
						line-height: 28px;
						padding-top: 7px;
					}
					>a {
						position: relative;
						color: #3e5685;
						font-size: 13px;
						height: 28px;
						line-height: 28px;
					}
				}
				>.info_wrapper {
					padding-bottom: 20px;
					border-bottom: 1px solid #EEE;
					>.info {
						>img {
							width: 55px;
							height: 55px;
							margin-right: 20px;
							float: left;
							-moz-border-radius: 5px;
							-webkit-border-radius: 5px;
							border-radius: 5px;
						}
						>span {
							display: inline-block;
							font-size: 16px;
							color: #333;
							height: 55px;
							line-height: 55px;
							width: 105px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							vertical-align: middle;
						}
					}
				}
			}
			>.side_right {
				width: 310px;
			}
		}
		.el-input--prefix .el-input__inner {
			padding-left: 0px;
		}
		.el-input--suffix .el-input__inner {
			padding-right: 0px;
		}
		.el-icon-date:before {
			content: "";
		}
		.el-date-editor.el-input,
		.el-date-editor.el-input__inner {
			width: 150px;
		}
		.el-input {
			position: relative;
			font-size: 12px;
			display: inline-block;
			width: 100%;
			right: 14px;
		}
	}
</style>