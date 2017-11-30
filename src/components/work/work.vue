<template>
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
			<div class="department_wtapper">
				<div class="title">部门</div>
				<router-link to="">软件技术部</router-link>
			</div>
		</div>
		<div class="info_main">
			<div class="publish">
				<div class="extend">
					<addApproval v-if="addApprovalShow" @return_exam="return_exam"></addApproval>
					<keep-alive>
						<exam v-if="examShow"></exam>
					</keep-alive>
					<keep-alive>
						<everyday v-if="everydayShow"></everyday>
					</keep-alive>
					<keep-alive>
						<manageCompany v-if="manageCompanyShow" @close="manageCompanyClose"></manageCompany>
					</keep-alive>
					<keep-alive>
						<jurisdictionManage v-if="jurisdictionManageShow" @close="jurisdictionManageClose"></jurisdictionManage>
					</keep-alive>

					<keep-alive>
						<addressBook v-if="address_bookShow"></addressBook>
					</keep-alive>
					<keep-alive>
						<formReceipt v-if="form_receiptShow"></formReceipt>
					</keep-alive>
					<keep-alive>
						<inviteCol v-if="inviteColShow" @close="inviteColClose"></inviteCol>
					</keep-alive>
				</div>
			</div>
		</div>
		<div class="side_right"></div>
		
	</div>
</template>
<script>
import {mapMutations} from 'vuex'
import inviteCol from '@/base/invite_colleague/invite_colleague'
import everyday from '@/base/everyday/everyday'
import formReceipt from '@/base/form_receipt/form_receipt'
import addressBook from '@/base/address_book/address_book'
import exam from '@/base/exam/exam'
import addApproval from '@/base/add_approval/add_approval'
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
			workList: ['日常','审批', '发起审批', '公司管理', '权限管理', '表单回执','邀请同事','通讯录','创建公司'],
			examNav: ['日常', '审批'],
			pStr: '',
			currentIndex: 0,
			now_type_name:'日常',
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
			form_receiptShow:false,
			address_bookShow:false,
			listShow: true,
			compamyShow: false,
			everydayShow:true,
			manageCompanyShow: false,
			jurisdictionManageShow: false,
			examShow: false,
			addApprovalShow: false,
			inviteColShow:false
		}
	},
	props:{
		workIndex:{
			type:Number,
			default:0
		}
	},
	methods: {
		return_exam(){
			this.addApprovalShow = false
			this.examShow = true
			this.everydayShow  = false
			this.$emit('changeWorkIndex',1)
		},
		inviteColClose(){
			this.inviteColShow = false
			this.everydayShow = true
			this.$emit('changeWorkIndex',0)
		},
		manageCompanyClose() {
			this.manageCompanyShow = false
		},
		jurisdictionManageClose() {
			this.jurisdictionManageShow = false
		},
		doList(item, index) {
			if(item === '创建公司'){
				this.compamyShow = true
				return
			}
			this.now_type_name = item
			this.$emit('changeWorkIndex',index)
			this.addApprovalShow = false
			this.listShow = false
			this.everydayShow = false
			this.manageCompanyShow = false
			this.inviteColShow = false
			this.jurisdictionManageShow = false
			this.examShow = false
			this.address_bookShow = false
			this.form_receiptShow = false
			switch(item) {
				case '全部':
					this.listShow = true
					this.currentIndex = 0
					break;
				case '公司管理':
					this.manageCompanyShow = true
					break;
				case '权限管理':
					this.jurisdictionManageShow = true
					break
				case '表单回执':
					this.form_receiptShow = true
					break;
				case '通讯录':
					this.address_bookShow = true
					break;
				case '日常':
					this.everydayShow = true
					break;
				case '发起审批':
					this.addApprovalShow = true
					break;
				case '邀请同事':
					this.inviteColShow = true
					break;
				case '审批':
					this.examShow = true
					break;
			}
			
			
			
		},
		_getToken(uid){
				 let nparam = new URLSearchParams();
					nparam.append("uid",this.user.uid);
					this.$http.post("/index/Mobile/path/get_token",nparam)
					.then((res)=>{
						localStorage.token = JSON.stringify(res.data.data);
						this.set_token(res.data.data)
					})
		},
		...mapMutations({
				set_token: 'SET_TOKEN'
			})
	},
	computed: {
		...mapGetters([
			'user',
			'token',
			'nowCompanyId'
		])
	},
	components: {
		sysP,
		manageCompany,
		jurisdictionManage,
		exam,
		addApproval,
		addressBook,
		formReceipt,
		everyday,
		inviteCol
	},
	mounted() {
	},
	created() {
		
		
	},
	watch:{
		nowCompanyId(){
			this.form_receiptShow = false
			this.address_bookShow = false
			this.compamyShow = false
			this.everydayShow = true
			this.manageCompanyShow = false
			this.jurisdictionManageShow = false
			this.examShow = false
			this.addApprovalShow = false
			this.listShow = true
		}
	}
}
</script>

<style lang="scss" scoped>
	.work {
		width: 1160px;
		margin: 15px auto 0;
		>.info_main {
			float: left;
			width: 600px;
			background: #fff;
			border-radius: 2px;
			box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			>.publish {
				padding: 20px;
				>.extend {
					border: 1px solid #ddd;
					-webkit-border-radius: 2px;
					border-radius: 2px;
					margin-top: 4px;
				}
			}
		}
		>.side_left {
			float: left;
			width: 180px;
			margin-right: 15px;
			background: #fff;
			padding: 20px;
			border-radius: 2px;
			box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
			>.work_wrapper {
				width: 100%;
				padding: 7px 0;
				border-bottom: 1px solid #EEE;
				>ul{
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
			background: #DDDDDD;
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