<template>
	<div class="manageCompany_wrapper">
		<div class="manageCompany">
			<div class="nav">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="人员列表"></el-tab-pane>
					<el-tab-pane label="添加部门"></el-tab-pane>
					<el-tab-pane label="添加工程项目"></el-tab-pane>
				</el-tabs>
			</div>
			<div class="type">
				<div class="list" v-show="listShow">
					<el-collapse v-model="activeName1">
						<el-collapse-item title="管理员" name="1">
							<div v-for="(list,index) in adminArr" class="list_item" :key="index">
								<div class="avatar">
									<img :src="list.avatar" alt="" />
								</div>
								<div class="content">
									<span class="name">{{list.name}}</span>
									<span class="phone">{{list.phone}}</span>
								</div>
								<div class="button">
									<el-button type="warning" round @click="cancelAdministrator(list)">取消管理</el-button>
								</div>
							</div>
						</el-collapse-item>
					</el-collapse>
					<el-collapse v-model="activeName2" accordion>
						<el-collapse-item :title="item.department_name" :name="i" v-for="(item,i) in comPartPersonList" :key="i">
							<div v-for="(list,index) in item.person" class="list_item">
								<div class="avatar">
									<img :src="list.avatar" alt="" />
								</div>
								<div class="content">
									<span class="name">{{list.name}}</span>
									<span class="phone">{{list.phone}}</span>
								</div>
								<div class="button">
									<el-button type="success" round @click="setAdministrator(list)" v-if="list.is_manage !=1">设为管理</el-button>
									<el-button type="warning" round @click="deleteMember(list)">删除</el-button>
								</div>
							</div>
						</el-collapse-item>
					</el-collapse>
				</div>

				<div class="addDepartment" v-show="addDepartmentShow">
					<div class="operation">
						<el-input v-model="newDepartmentName" placeholder="请输入部门名称"></el-input>
						<el-button type="primary" round @click="addDepartment">确认添加</el-button>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import { createPersonInfo } from 'common/js/person_info'
	import { getAvatar } from '@/common/js/avatar.js'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				activeNames: ['1'],
				companyId: '',
				groupList: [],
				smObj: {},
				navIndex: -1,
				listShow: true,
				addDepartmentShow: false,
				addAdministratorShow: false,
				typeInfo: '',
				typeName: ['添加部门', '添加工程项目'],
				radioo: '2',
				adminArr: [],
				personShow: false,
				numOne: 0,
				activeName: '',
				activeName1: ['1'],
				newDepartmentName: '',
				activeName2: '1',
				returnOne: false
			}
		},
		created() {
			this._getAdmin()
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId',
				'comPartPersonList',
				'comPersonList'
			])
		},
		watch: {
			nowCompanyId: function() {
				//				this.numOne=0
				//				this._getAdmin()
			}
		},
		methods: {
			addDepartment() {
				this.$confirm('确认添加新部门吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("department_name", this.newDepartmentName);
					param.append("company_id", this.nowCompanyId);
					this.$http.post("/index/Mobile/User/add_department", param)
						.then((res) => {
							if(res.data.code === 0) {
								this.$message({
									message: '添加部门成功',
									type: 'success'
								});
								this.listShow = true
								this.addDepartmentShow = false
								this._getComPartPersonList()
							} else {
								this.$message.error('添加部门失败');
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消添加'
					});
				});
			},
			handleClick(tab) {
				this.listShow = false
				this.addDepartmentShow = false
				this.addAdministratorShow = false
				if(tab.index === '0') {
					this.listShow = true
				} else if(tab.index === '1') {
					this.addDepartmentShow = true
				} else if(tab.index === '2') {
					this.addAdministratorShow = true
				}
			},
			handleChange() {},
			setAdministrator(item) {
				this.adminArr.forEach((list) => {
					if(list.personnel_id === item.personnel_id) {
						this.$message({
							message: item.name + '已是管理员',
							type: 'warning'
						});
						this.returnOne = true
					}
				})
				if(this.returnOne) {
					this.returnOne = false
					return
				}
				let arr = []
				arr.push(item.person[0].personnel_id)
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("personnel_id", JSON.stringify(arr));
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/User/give_manage", param)
					.then((res) => {
						this.activeName1 = ['1']
						this.activeName2 = '0'
						if(res.data.code === 0) {
							this._getAdmin()
							this.$message({
								message: '添加成功',
								type: 'success'
							});
						} else {
							this.$message.error('添加失败')
						}
					})
			},

			cancelAdministrator(item) {
				this.$confirm('确定删除' + item.name + '吗', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					if(item.personnel_id === JSON.parse(localStorage.nowCompanyId)) {
						this.$message.error('管理员不可删除自己')
						return
					}
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("my_personnel_id", JSON.parse(localStorage.nowPersonelId));
					param.append("personnel_id", item.personnel_id);
					param.append("company_id", this.nowCompanyId);
					this.$http.post("/index/Mobile/User/del_manage", param)
						.then((res) => {
							if(res.data.code === 1) {
								this.$message.error(res.data.message);
							} else if(res.data.code === 0) {
								this._getComPartPersonList()
								this._getAdmin()
								this.$message({
									message: '删除成功',
									type: 'success'
								});
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deleteMember(item, index, i) {
				this.$confirm('确定删除' + item.name + '吗', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("personnel_id", item.personnel_id);
					param.append("company_id", this.nowCompanyId);
					this.$http.post("/index/Mobile/user/del_company_personnel", param)
						.then((res) => {
							if(res.data.code === 1) {
								this.$message.error(res.data.message);
							} else if(res.data.code === 0) {
								this._getComPartPersonList()
								this._getAdmin()
								this.$message({
									message: '删除成功',
									type: 'success'
								});
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			closePersonList() {
				this.personShow = false
			},

			closeInvite() {
				this.navIndex = -1
				this.listShow = true
				this.addAdministratorShow = false
			},
			_getComPartPersonList() {
				let param = new URLSearchParams();
				param.append("company_id", JSON.parse(localStorage.nowCompanyId));
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
							newparam.append("company_id", JSON.parse(localStorage.nowCompanyId));
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
			_getAdmin() {
				this.adminArr = []
				let mparam = new URLSearchParams();
				mparam.append("company_id", this.nowCompanyId);
				mparam.append("department_id", -1);
				this.$http.post("/index/Mobile/user/get_company_personnel", mparam)
					.then((res) => {
						if(res.data.data.length != 0) {
							res.data.data.forEach((list) => {
								let mewObj = {}
								mewObj.personnel_id = list.personnel_id
								mewObj.department_name = list.department_name
								mewObj.name = list.name
								mewObj.phone = list.phone
								mewObj.avatar = getAvatar(list.avatar)
								this.adminArr.push(mewObj)
							})
						}
					})
			},
			...mapMutations({
				setComPartPersonList: 'SET_COM_PART_PERSON_LIST'
			})
		}
	}
</script>

<style lang="scss">
	.manageCompany_wrapper {
		z-index: 20;
		background: #FFFFFF;
		box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		.manageCompany {
			position: relative;
			width: 550px;
			padding: 4px;
			margin-left: 20px;
			overflow: hidden;
			border-radius: 6px;
			-moz-border-radius: 6px;
			-webkit-border-radius: 6px;
			>.nav {
				width: 100%;
				margin: 4px 0;
				.el-tabs__active-bar {
					width: 190px;
				}
				.el-tabs__nav {
					width: 100%;
				}
				.el-tabs__item {
					font-size: 15px;
					font-weight: 700;
					width: 190px;
					text-align: center;
				}
			}
			>.type {
				width: 100%;
				height: 100%;
				>.list {
					.el-collapse-item__header {
						margin-left: 0;
						text-indent: 10px;
					}
					.el-collapse-item:last-child {
						margin-bottom: -2px;
					}
					.el-collapse-item__content {
						padding-bottom: 0;
					}
					.el-collapse-item.is-active .el-collapse-item__header {
						background: #EEEEEE;
					}
					.list_item {
						margin-top: 5px;
						height: 50px;
						font-size: 0;
						>.avatar {
							display: inline-block;
							vertical-align: top;
							margin-left: 40px;
							img {
								margin-top: 4px;
								width: 40px;
								height: 40px;
								border-radius: 50%;
							}
						}
						>.content {
							display: inline-block;
							margin-left: 10px;
							>span {
								font-size: 14px;
								display: block;
							}
						}
						.button {
							display: inline-block;
							float: right;
							margin-right: 10px;
							button {
								margin-left: 10px;
							}
						}
					}
				}
				.addDepartment {
					width: 100%;
					min-height: 200px;
					.operation {
						width: 200px;
						margin: 100px auto;
						button {
							margin-left: 40px;
							margin-top: 20px;
						}
					}
				}
				.addAdministrator {
					width: 100%;
					min-height: 400px;
					background: #f1f1f1;
					.addAdmin {
						padding: 10px;
						position: relative;
						.submit {
							position: absolute;
							left: 400px;
							display: block;
							padding: 4px 10px;
							color: #FFFFFF;
							background: #64A6FF;
							cursor: pointer;
						}
						.close {
							position: absolute;
							top: 5px;
							right: 5px;
							color: #878D99;
							z-index: 20;
							&:hover {
								color: #FA5555;
							}
						}
						.list {
							width: 200px;
							border-radius: 4px;
							margin-left: 10px;
							position: relative;
							.title {
								width: 100%;
								span {
									display: block;
									width: 100%;
									height: 30px;
									text-align: center;
									color: #3487E2;
									border-radius: 4px;
								}
							}
							.add {
								position: absolute;
								top: 6px;
								right: -30px;
								color: #878D99;
								&:hover {
									color: #409EFF;
								}
							}
							ul {
								li {
									background: transparent;
									height: 30px;
									text-indent: 10px;
									line-height: 30px;
									position: relative;
									border-bottom: 1px solid #3487E2;
									i {
										position: absolute;
										top: 7px;
										right: 10px;
										font-size: 14px;
										color: #3487E2;
										&:hover {
											color: #FA5555;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		.person {
			position: absolute;
			left: 260px;
			top: 100px;
			z-index: 10;
			.close {
				position: absolute;
				right: 2px;
				top: 2px;
				color: #3487E2;
				&:hover {
					color: #FA5555;
				}
			}
			.personList {
				width: 200px;
				height: 280px;
				background: rgb(241, 241, 241);
				border: 1px solid #3487E2;
				overflow-y: scroll;
				-webkit-border-radius: 4px;
				-moz-border-radius: 4px;
				border-radius: 4px;
				ul {
					margin-top: 20px;
					padding: 4px;
					li {
						width: 100%;
						height: 34px;
						border-bottom: 1px solid #409EFF;
						color: #2D2F33;
						cursor: default;
						.avatar {
							display: inline-block;
							float: left;
							margin-top: 2px;
							img {
								display: block;
								width: 30px;
								height: 30px;
								border-radius: 50%;
							}
						}
						.content {
							display: inline-block;
							float: left;
							margin-left: 4px;
							span {
								display: block;
								font-size: 12px;
								height: 17px;
								line-height: 17px;
							}
						}
					}
				}
			}
		}
	}
</style>