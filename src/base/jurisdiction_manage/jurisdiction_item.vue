<template>
	<div class="contractApproval" v-show="contractApprovalShow">
		<div style="height: 30px;">
			<div class="addPerson">
				<el-button type="primary" round style="margin-right: 10px;" @click="save">保存修改</el-button>
				<el-button type="primary" round @click="redact">编辑</el-button>
			</div>
		</div>
		<div class="chooseApprovalPerson">
			<el-collapse v-model="activeNames">
				<el-collapse-item title="人员列表" name="1">
					<div class="info" v-for="(item,index) in comPersonList" @click="chooseContractApprovalPerson(item,index)">
						<div class="avatar">
							<img :src="item.avatar" alt="" />
						</div>
						<div class="content">
							<span class="name">{{item.department_name}}</span>
							<span class="name">{{item.name}}</span>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		<div class="jurisdictionFormList">
			<ul>
				<li v-for="(item,index) in jurisdictionFormList" :key="item.name">
					<div class="info">
						<img :src="item.avatar" alt="" />
						<span>{{item.name}}</span>
						<span v-show="submitAddPersonShow">
							<i class="delete el-icon-error" @click="deletejurisdictionFormList(item,index)"></i>
							<i class="up el-icon-caret-top" @click="upjurisdictionFormList(item,index)" v-show="index!=0"></i>
							<i class="down el-icon-caret-bottom" @click="downjurisdictionFormList(item,index)" v-show="index != jurisdictionFormList.length-1"></i>
						</span>
					</div>
				</li>
			</ul>
		</div>
		<div class="dialog_wrapper" v-show="dialogVisible">
			<div class="dialog">
				<div class="title">
					<span>提示</span>
				</div>
				<div class="close">
					<i class="el-icon-close" @click="cancel"></i>
				</div>
				<div class="info">
					<span>您确定提交吗</span>
				</div>
				<div class="button">
					<span @click="cancel">取消</span>
					<span @click="submit">确定</span>
				</div>
			</div>
		</div>
	</div>
	</div>

</template>

<script>
	import {getPic} from '@/common/js/pic.js'
	import { mapGetters, mapMutations } from 'vuex'
	import { createPersonInfo } from 'common/js/person_info'
	import { createOrder } from 'common/js/order'
	export default {
		data() {
			return {
				contractApprovalShow: false,
				originalJurisdictionFormList: [],
				dialogVisible: false,
				submitAddPersonShow: false,
				numOne: 0,
				perIndex: -1,
				arr: [],
				activeNames: ['0']
			}
		},
		props: {
			jurisdictionFormList: {
				type: Array,
				default: []
			},
			formType: {
				type: Number
			}
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user',
				'comPersonList',
				'comPartPersonList'
			])
		},
		methods: {
			save() {
				this.dialogVisible = true
				this.activeNames = ['0']
			},
			cancel() {
				this.dialogVisible = false
				this.submitAddPersonShow = false
			},
			submit() {
				this.arr = []
				this.jurisdictionFormList.forEach((item, index) => {
					this.arr.push(createOrder(item, index))
				})

				this.dialogVisible = false
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("type", this.formType);
				param.append("sequence", JSON.stringify(this.arr));
				this.$http.post("/index.php/Mobile/approval/set_sequence", param)
					.then((res) => {
						this.submitAddPersonShow = false
						this.$emit('reload')
						if(res.data.code === 0) {
							this.$message({
								message: '修改成功',
								type: 'success'
							});
						} else {
							this.$message.error('修改失败');
						}
					})
			},
			redact() {
				this.submitAddPersonShow = true
				this.activeNames = ['1']
				this.originalJurisdictionFormList = this.jurisdictionFormList
			},
			//			选择合同评审表人员
			chooseContractApprovalPerson(item) {
				for(let i = 0; i < this.jurisdictionFormList.length; i++) {
					if(item.name === this.jurisdictionFormList[i].name) {
						this.$message.error(item.name + '已经在列表中！');
						return
					}
				}
				this.jurisdictionFormList.push(item)
			},
			//			删除合同评审表人员
			deletejurisdictionFormList(item, index) {

				this.jurisdictionFormList.splice(index, 1)
			},
			upjurisdictionFormList(item, index) {
				if(index === 0) {
					return
				}
				let nowItem = this.jurisdictionFormList[index]
				let upItem = this.jurisdictionFormList[index - 1]
				this.$set(this.jurisdictionFormList, index, upItem);
				this.$set(this.jurisdictionFormList, index - 1, nowItem);
			},
			downjurisdictionFormList(item, index) {
				let len = this.jurisdictionFormList.length
				if(index === len - 1) {
					return
				}
				let nowItem = this.jurisdictionFormList[index]
				let downItem = this.jurisdictionFormList[index + 1]
				this.$set(this.jurisdictionFormList, index, downItem);
				this.$set(this.jurisdictionFormList, index + 1, nowItem);
			},
			...mapMutations({
				setComPersonList: 'SET_COM_PERSON_LIST'
			})
		},
		watch: {
			jurisdictionFormList() {
//				this.submitAddPersonShow = false
				this.activeNames = ['0']
			},
			formType(){
				this.submitAddPersonShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dialog_wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		z-index: 10;
		.dialog {
			opacity: 1;
			width: 30%;
			background: #fff;
			margin: 200px auto;
			padding: 10px;
			>div {
				display: inline-block;
			}
			.close {
				cursor: pointer;
				float: right;
				padding: 2px;
				&:hover {
					color: #3487E2;
				}
			}
			.info {
				display: block;
				clear: both;
				height: 80px;
				line-height: 80px;
				font-size: 14px;
				color: #2D2F33;
			}
			.button {
				display: block;
				width: 100%;
				height: 30px;
				span {
					border-radius: 4px;
					text-align: center;
					font-size: 14px;
					cursor: pointer;
					float: right;
					margin-right: 10px;
					width: 60px;
					height: 30px;
					line-height: 30px;
					background: #FFFFFF;
					border: 1px solid #3487E2;
				}
			}
		}
	}
	
	.contractApproval {
		position: relative;
		.addPerson {
			display: inline-block;
			float: right;
		}
		.submitAddPerson {
			position: absolute;
			top: 360px;
			right: 10px;
			display: inline-block;
			float: right;
		}
		.jurisdictionFormList {
			margin-top: 10px;
			width: 300px;
			ul {
				li {
					.group {
						display: block;
						height: 20px;
						color: #FFFFFF;
						background: #878D99;
						line-height: 20px;
						-webkit-border-radius: 4px;
						-moz-border-radius: 4px;
						border-radius: 4px;
						text-indent: 10px;
					}
					.info {
						display: block;
						height: 30p;
						font-size: 0;
						cursor: default;
						position: relative;
						border-bottom: 1px solid #5A5E66;
						img {
							display: inline-block;
							width: 26px;
							height: 26px;
							-webkit-border-radius: 50%;
							-moz-border-radius: 50%;
							border-radius: 50%;
							vertical-align: top;
							margin-top: 2px;
							margin-left: 4px;
						}
						span {
							font-size: 14px;
							line-height: 30px;
							margin-left: 10px;
						}
						.up {
							line-height: 30px;
							font-size: 14px;
							float: right;
							position: absolute;
							right: 45px;
							cursor: pointer;
							display: inline-block;
						}
						.down {
							display: inline-block;
							line-height: 30px;
							font-size: 14px;
							float: right;
							position: absolute;
							right: 80px;
							cursor: pointer;
						}
						.delete {
							line-height: 30px;
							font-size: 14px;
							float: right;
							margin-right: 10px;
							color: #878D99;
							&:hover {
								color: #FA5555;
							}
						}
					}
				}
			}
		}
		.chooseApprovalPerson {
			position: absolute;
			right: 10px;
			top: 50px;
			width: 200px;
			height: 300px;
			overflow-y: scroll;
			overflow-x: hidden;
			.info {
				cursor: default;
				font-size: 0;
				margin-bottom: 4px;
				>.avatar {
					vertical-align: top;
					display: inline-block;
					img {
						width: 40px;
						height: 40px;
						border-radius: 50%;
					}
				}
				>.content {
					display: inline-block;
					margin-left: 10px;
					>span {
						display: block;
						font-size: 12px;
					}
				}
			}
		}
	}
	
	.el-button.is-round {
		padding: 6px 10px;
	}
	
	.v-modal {
		z-index: -100;
	}
</style>