<template>
	<div class="work">
		<div class="side_left">
			<div class="info_wrapper">
				<a class="info">
					<img alt="" />
					<span>{{user.name}}</span>
				</a>
			</div>
			<div class="work_wrapper">
				<ul>
					<li class="work_item" v-for="(item,index) in workList" @click="doList(item,index)">
						<router-link to="">
							<span class="content">{{item}}</span>
							<span class="num_icon"></span>
						</router-link>
					</li>
				</ul>
			</div>
			<div class="department_wtapper">
				<div class="title">部门</div>
				<router-link to="">软件技术部</router-link>
			</div>
		</div>
		<div class="info_main">
			<div class="publish">
				<!--导航-->
				<div class="nav">
					<ul>
						<li v-for="(item,index) in wkNav" ref="wk_nav">
							<a @click="navCli(item,index)" v-bind:class="{'active': index == navIndex}">{{item}}</a>
						</li>
					</ul>
					<img src="../../assets/icon1.png" class="icon1" ref="icon1" />
				</div>
				<!--面板-->
				<div class="panel">
					<div class="panel_exam">
						<form action="" class="panel_exam_form">
							<!--分享，日志-->
							<div class="input_wrapper" v-show="shareShow">
								<textarea class="input" placeholder="请输入" name="" rows="" cols=""></textarea>
							</div>
							<div class="input_btns" v-show="shareShow">
								<i title="添加提到">@</i>
								<i class="el-icon-picture" title="添加图片(多张)"></i>
								<i class="el-icon-upload2" title="添加附件(多个)"></i>
							</div>
							<keep-alive>
								<addApproval v-if="addApprovalShow" @add_approval_showF="add_approval_showF"></addApproval>
							</keep-alive>
							<!--审批选项-->
							<div class="extend">
								<ul class="extend_ul" v-show="listShow">
									<li v-for="(item,index) in examNav" v-bind:class="{'active': index == currentIndex}" @click="rc_or_sp(index)">
										<a>{{item}}</a>
									</li>
								</ul>
								<keep-alive>
									<manageCompany v-if="manageCompanyShow" @close="manageCompanyClose"></manageCompany>
								</keep-alive>
								<keep-alive>
									<jurisdictionManage v-if="jurisdictionManageShow" @close="jurisdictionManageClose"></jurisdictionManage>
								</keep-alive>
								<keep-alive>
									<exam v-if="examShow"></exam>
								</keep-alive>
								<keep-alive>
									<addressBook v-if="address_bookShow"></addressBook>
								</keep-alive>
								<keep-alive>
									<formReceipt v-if="form_receiptShow"></formReceipt>
								</keep-alive>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="side_right"></div>
		<keep-alive>
			<createCompany v-show="compamyShow" @companyClose="companyClose()"></createCompany>
		</keep-alive>	
	</div>
</template>
<script>
import {mapMutations} from 'vuex'
import formReceipt from '@/base/form_receipt/form_receipt'
import addressBook from '@/base/address_book/address_book'
import exam from '@/base/exam/exam'
import addApproval from '@/base/add_approval/add_approval'
import createCompany from '@/base/create_company/create_company'
import manageCompany from '@/base/manage_company/manage_company'
import jurisdictionManage from '@/base/jurisdiction_manage/jurisdiction_manage'
import sysP from '@/base/sys-p/sys-p'
import { prefixStyle } from '@/common/js/dom'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			workList: ['全部', '创建公司', '公司管理', '权限管理', '表单回执','通讯录'],
			wkNav: ['分享', '日志', '发起审批'],
			examNav: ['日常', '审批'],
			pStr: '',
			currentIndex: 0,
			navIndex: -1,
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
			value1: '',
			form_receiptShow:true,
			address_bookShow:false,
			listShow: true,
			compamyShow: false,
			manageCompanyShow: false,
			jurisdictionManageShow: false,
			examShow: false,
			addApprovalShow: false,
			shareShow: true
		}
	},
	methods: {
		companyClose() {
			this.compamyShow = false
		},
		manageCompanyClose() {
			this.manageCompanyShow = false
		},
		jurisdictionManageClose() {
			this.jurisdictionManageShow = false
		},
		navCli(item, index) {
			this.listShow = true
			this.compamyShow = false
			this.manageCompanyShow = false
			this.jurisdictionManageShow = false
			this.examShow = false
			this.addApprovalShow = false
			this.shareShow = false
			this.navIndex = index
			let x = this.$refs.wk_nav[index].clientWidth
			x = x * index
			if(index === 2) {
				this.addApprovalShow = true
				x = 112
			} else {
				this.shareShow = true
			}
			this.$refs.icon1.style.transition = 'all 0.4s'
			this.$refs.icon1.style[transform] = `translate3d(${x}px,0,0)`
		},
		rc_or_sp(index) {
			this.currentIndex = index
			if(index === 1) {
				this.examShow = true
			}
		},
		add_approval_showF() {
			this.addApprovalShow = false
		},
		doList(item, index) {
			this.addApprovalShow = false
			this.listShow = false
			this.compamyShow = false
			this.manageCompanyShow = false
			this.jurisdictionManageShow = false
			this.examShow = false
			this.address_bookShow = false
			switch(index) {
				case 0:
					this.listShow = true
					break;
				case 1:
					this.compamyShow = true
					break;
				case 2:
					this.manageCompanyShow = true
					break;
				case 3:
					this.jurisdictionManageShow = true
					break
				case 5:
					this.address_bookShow = true
					break
			}
		},
		_getToken(uid){
				 let nparam = new URLSearchParams();
					nparam.append("uid",this.user.uid);
					this.$http.post("/index/Mobile/path/get_token",nparam)
					.then((res)=>{
						this.set_token(res.data.data)
					})
		},
		...mapMutations({
				set_token: 'SET_TOKEN'
			})
	},
	computed: {
		...mapGetters([
			'user'
		])
	},
	components: {
		sysP,
		createCompany,
		manageCompany,
		jurisdictionManage,
		exam,
		addApproval,
		addressBook,
		formReceipt
	},
	mounted() {
	},
	created() {
		this._getToken()
	}
}
</script>

<style lang="scss" scoped>
	.work {
		width: 1160px;
		margin: 15px auto 0;
		.info_main {
			float: left;
			width: 600px;
			background: #fff;
			border-radius: 2px;
			box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			.publish {
				padding: 20px;
				.panel {
					position: relative;
					.panel_exam {
						position: relative;
						.panel_exam_form {
							.extend {
								border: 1px solid #ddd;
								-webkit-border-radius: 2px;
								border-radius: 2px;
								margin-top: 4px;
								.extend_ul {}
								.extend_item3_wrapper {
									display: none;
									padding: 10px;
									background: #f9f9f9;
									.list {
										margin-top: 10px;
										span {
											display: inline-block;
											width: 63px;
											text-align: right;
											color: #999;
											vertical-align: top;
											padding-top: 8px;
											font-size: 12px;
										}
										input {
											width: 422px;
											padding-left: 5px;
											padding-right: 30px;
											border: 1px solid #DDD;
											height: 20px;
											line-height: 20px;
											padding-top: 6px;
											padding-bottom: 6px;
											outline: none;
											&.no {
												background: #F2F2F2;
											}
										}
									}
								}
								.extend_item1_wrapper {
									padding: 10px;
									background: #f9f9f9;
									display: none;
								}
								.extend_item2_wrapper {
									background-color: #f9f9f9;
									padding: 10px;
									display: none;
									.extend_item2 {
										margin-top: 10px;
										table {
											background: #FFFFFF;
											td {
												border: 1px solid #ddd;
												text-indent: 14px;
												line-height: 36px;
												font-size: 12px;
												color: #666;
												input {
													width: 120px;
													height: 26px;
													border: none;
													outline: none;
												}
												.fbtInput {
													width: 400px;
													height: 26px;
													border: none;
													outline: none;
													font-size: 12px;
												}
											}
										}
									}
								}
								.extend_ul {
									font-size: 13px;
									li {
										width: 50%;
										display: inline-block;
										font-size: 12px;
										cursor: pointer;
										color: #0082CB;
										box-sizing: border-box;
										text-align: center;
										border-bottom: 2px solid transparent;
										&.active {
											border-bottom: 2px solid #FC923F;
											/*background: #f9f9f9;
    											font-weight: 700;
    											color: #333333;*/
										}
										a {
											height: 35px;
											line-height: 35px;
										}
									}
								}
							}
							.input_btns {
								text-align: left;
								height: 35px;
								padding: 0 10px;
								background: #F9F9F9;
								border: 1px solid #ddd;
								border-top: none;
								i {
									height: 20px;
									line-height: 20px;
									cursor: pointer;
									display: inline-block;
									margin-right: 20px;
									overflow: hidden;
									position: relative;
									color: #666666;
									top: 9px;
									font-size: 20px;
									&:hover {
										color: #333333;
									}
								}
							}
							.input_wrapper {
								padding-bottom: 35px;
								-webkit-border-radius: 3px;
								border-radius: 3px;
								display: block;
								border: 1px solid #ddd;
								border-bottom: none;
								padding: 8px 10px;
								-webkit-border-radius: 2px 2px 0 0;
								border-radius: 2px 2px 0 0;
								.input {
									display: block;
									border: none;
									outline: none;
									width: 526px;
									height: 50px;
									resize: none;
									background: 0 0;
									font-size: 12px;
								}
							}
						}
					}
				}
				.nav {
					position: relative;
					margin-bottom: 4px;
					z-index: 10;
					font-size: 13px;
					color: #0082CB;
					.icon1 {
						position: absolute;
						left: 13px;
						top: 33px;
					}
					ul {
						position: relative;
						li {
							margin-right: 0;
							padding-left: 5px;
							vertical-align: top;
							display: inline-block;
							cursor: pointer;
							a {
								display: inline-block;
								padding: 0 10px;
								height: 35px;
								line-height: 35px;
								&.active {
									color: #333333;
									font-weight: 700;
								}
							}
						}
					}
				}
			}
		}
		.side_left {
			float: left;
			width: 180px;
			margin-right: 15px;
			background: #fff;
			padding: 20px;
			border-radius: 2px;
			box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			.work_wrapper {
				width: 100%;
				padding: 7px 0;
				border-bottom: 1px solid #EEE;
				.work_item {
					position: relative;
					color: #3e5685;
					font-size: 13px;
					line-height: 28px;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					a {
						color: #4D6595;
						width: 100%;
						display: inline-block;
						&:hover {
							color: #FC923F;
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
				.title {
					color: #999;
					height: 28px;
					line-height: 28px;
					padding-top: 7px;
				}
				a {
					position: relative;
					color: #3e5685;
					font-size: 13px;
					height: 28px;
					line-height: 28px;
				}
			}
			.info_wrapper {
				padding-bottom: 20px;
				border-bottom: 1px solid #EEE;
				.info {
					img {
						width: 55px;
						height: 55px;
						margin-right: 20px;
						float: left;
						-moz-border-radius: 5px;
						-webkit-border-radius: 5px;
						border-radius: 5px;
					}
					span {
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
		.side_right {
			background: lightsalmon;
			height: 600px;
			float: right;
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
</style>