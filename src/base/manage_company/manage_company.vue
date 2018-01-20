<template>
	<div class="manageCompany_wrapper">
		<div class="manageCompany">
			<div class="nav">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="人员列表" name='1'></el-tab-pane>
					<el-tab-pane label="添加部门" name='2'></el-tab-pane>
					<el-tab-pane label="工程项目" name='3'></el-tab-pane>
          <el-tab-pane label="公司解散" name="4"></el-tab-pane>
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
              <div class="com_unit">
                <el-button type="primary" round>添加人员</el-button>
                <el-button type="danger" round @click="delDepartment(item.department_id)">删除部门</el-button>
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

        <div class="addProject" v-show="addPro" v-model="comProjectList">
          <div class="project"  v-show="project">
            <ul>
              <li  v-show="addProjectShow">
                <div class="projectName">
                  <span>项目名称</span>
                </div>
                <div class="addTime">
                  <span>添加时间</span>
                </div>
              </li>
              <li v-for="item in comProjectList">
                <div class="name">
                  <span>{{item.project_name}}</span>
                </div>
                <div class="time">
                  <span>{{item.add_time}}</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="menu">
            <el-button type="success" round @click="_showMe" v-show="addButton">添加工程</el-button>
          </div>
          <div class="addproject"  v-show="addComProject">
            <div class="return">
              <el-button type="success" @click="_return">返回</el-button>
            </div>
            <div class="operation">
              <el-input v-model="newProjectName" placeholder="请输入工程项目名称"></el-input>
              <el-button type="primary" round @click="addProject">确认添加</el-button>
            </div>
          </div>
        </div>

        <div class="disBandAge" v-show="disBandAgeShow">
          <div class="operation">
            <span>您确定要解散此公司么，此操作不可逆</span>
            <div class="btn">
              <el-button type="danger" round @click="disBandAge">确认解散</el-button>
            </div>
          </div>
        </div>
			</div>

		</div>
	</div>
</template>

<script>
	import { createPersonInfo } from 'common/js/person_info'
	import { getPic } from '@/common/js/pic.js'
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
        addComProject:false,
        addProjectShow:false,
				addAdministratorShow: false,
				typeInfo: '',
				typeName: ['添加部门', '添加工程项目'],
				radioo: '2',
				adminArr: [],
				numOne: 0,
				activeName: '1',
				activeName1: ['1'],
				newDepartmentName: '',
        newProjectName: '',
        project : false,
        addButton: false,
        addComProject:false,
        addPro:false,
        comProjectList:[],
				activeName2: '1',
				returnOne: false,
				ComPartPersonList: [],
        disBandAgeShow:false,
        m:'',
        personnel_id:''
			}
		},
		created() {
			if(!localStorage.user) {
				this.$router.push({
					path: '/login'
				})
			}
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
			this.setUser(JSON.parse(localStorage.user))
			this._getComPartPersonList()
			this._getUserCompanyList()
			this._getAdmin()
      this._getProjectList()
			this.ComPartPersonList = []
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId',
				'comPartPersonList',
				'comPersonList'
			])
		},
		mounted() {
			if(this.$route.path === '/work/manageCompany') {
				this.$emit('changeWorkIndex', 2)
			}
		},
		watch: {
			nowCompanyId() {
				this._getAdmin()
				this._getComPartPersonList()
        this._getProjectList()
			}
		},
		methods: {
		  _showMe(){
        this.addProjectShow = false
        this.addComProject = true
        this.addButton = false
        this.project = false
      },
      _return(){
		    this.addComProject = false
        this.project = true
        this.addProjectShow = true
        this.addButton = true
      },
      disBandAge(){
		    let param = new URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('company_id',this.nowCompanyId)
        this.$http.post("/index.php/Mobile/User/return_company_new",param)
          .then((res)=>{
            let item = res.data.data
            this.m = item.is_manage
            this.personnel_id = item.personnel_id
            if(this.personnel_id != JSON.parse(localStorage.personnelId)){
              if(this.m == 1){
                let mparam = new URLSearchParams()
                mparam.append('personnel_id',this.personnel_id)
                mparam.append('uid',this.user.uid)
                mparam.append('company_id',this.nowCompanyId)
                this.$http.post("/index.php/Mobile/User/quit_company",mparam)
                  .then((res)=>{
                    if(res.data.code == 0){
                      this.$message({
                        message: '操作成功',
                        type: 'success'
                      })
                      let param = new URLSearchParams();
                      param.append("uid", this.user.uid);
                      this.$http.post("/index.php/Mobile/user/companies_list", param)
                        .then((res)=>{
                          this.setNowCompanyId(res.data.data[0].company_id)
                          this.setNowCompanyName(res.data.data[0].company_name)
                          localStorage.nowCompanyId = JSON.stringify(res.data.data[0].company_id);
                          localStorage.nowCompanyName = JSON.stringify(res.data.data[0].company_name);
                          this.$router.push('/work');
                        })
                    }
                  })
              } else {
                this.$message({
                  message: '操作失败',
                  type: 'error'
                })
                return
              }
            }else{
              this.$message({
                message: '请联系管理员',
                type: 'error'
              })
              return
            }
          })
      },
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
					this.$http.post("/index.php/Mobile/User/add_department", param)
						.then((res) => {
							this._getComPartPersonList()
							if(res.data.code === 0) {
								this.activeName = '1'
								this.listShow = true
								this.addDepartmentShow = false
								this.newDepartmentName = ''
								this.$message({
									message: '添加部门成功',
									type: 'success'
								});

							} else {
								this.$message.error(res.data.message);
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消添加'
					});
				});
			},
      addProject(){
        this.$confirm('确认添加新工程项目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let nparam = new URLSearchParams()
          nparam.append("uid",this.user.uid)
          nparam.append("project_name",this.newProjectName)
          nparam.append("company_id",this.nowCompanyId)
          this.$http.post("/index.php/Mobile/company/add_company_project",nparam)
            .then((res)=>{
              this._getProjectList()
              if(res.data.code === 0){
                this.project = true
                this.addProjectShow = true
                this.addButton = true
                this.addComProject = false
                this.newProjectName = ''
                this.$message({
                  message :'添加工程项目成功',
                  type: 'success'
                })
              }else{
                this.$message.error(res.data.message);
              }
            })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消添加'
          });
        })
      },
			handleClick(tab) {
				this.listShow = false
				this.addDepartmentShow = false
				this.addAdministratorShow = false
        this.project = false
        this.addProjectShow = false
        this.addButton = false
        this.addPro = false
        this.disBandAgeShow = false
				if(tab.index === '0') {
					this.listShow = true
				} else if(tab.index === '1') {
					this.addDepartmentShow = true
				} else if(tab.index === '2') {
					this.project = true
          this.addProjectShow = true
          this.addButton = true
          this.addComProject = false
          this.addPro = true
				} else if(tab.index === '3'){
          this.disBandAgeShow = true
        }
			},
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
				arr.push(item.personnel_id)
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("personnel_id", JSON.stringify(arr));
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/User/give_manage", param)
					.then((res) => {
						this.activeName1 = ['1']
						this.activeName2 = '0'
						if(res.data.code === 0) {
							this._getAdmin()
							this._getComPartPersonList()
							this.$message({
								message: '添加成功',
								type: 'success'
							});
						} else {
							this.$message.error(res.data.message);
						}
					})
			},

			cancelAdministrator(item) {
				this.$alert('确定删除管理员' + item.name + '吗', '操作', {
					callback: action => {
						if(item.personnel_id === JSON.parse(localStorage.personnelId)) {
							this.$message.error('管理员不可删除自己')
							return
						}
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("my_personnel_id", JSON.parse(localStorage.personnelId));
						param.append("personnel_id", item.personnel_id);
						param.append("company_id", this.nowCompanyId);
						this.$http.post("/index.php/Mobile/User/del_manage", param)
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
					}
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
					this.$http.post("/index.php/Mobile/user/del_company_personnel", param)
						.then((res) => {
							if(res.data.code === 0) {
								this._getComPartPersonList()
								this._getAdmin()
								this.$message({
									message: '删除成功',
									type: 'success'
								});
							} else {
								this.$message.error(res.data.message);

							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
      delDepartment(res){
        this.$confirm("确定删除吗",'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=>{
          // let nparam = new URLSearchParams()
          // nparam.append('uid',this.user.uid)
          // nparam.append('company_id',this.nowCompanyId)
        })
      },
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/user/companies_list", param)
					.then((res) => {
						if(res.data.code === 251){
			              localStorage.removeItem('nowCompanyId');
			              localStorage.removeItem('nowCompanyName');
			              localStorage.removeItem('personnelId');
			              localStorage.removeItem('token');
			              localStorage.removeItem('user');
			              this.$router.push({ path: '/login' })
			              this.$message.error('您的帐号在别处登录，请重新登录');
			            }
						this.setCompanyList(res.data.data)
					})
			},
			_getComPartPersonList() {
				this.numOne = 0
				this.ComPartPersonList = []
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/user/get_department_lest", param)
					.then((res) => {
						if(res.data.code === 251){
			              localStorage.removeItem('nowCompanyId');
			              localStorage.removeItem('nowCompanyName');
			              localStorage.removeItem('personnelId');
			              localStorage.removeItem('token');
			              localStorage.removeItem('user');
			              this.$router.push({ path: '/login' })
			              this.$message.error('您的帐号在别处登录，请重新登录');
			            }
						let resData = res.data.data
						for(let j = 0, len = resData.length; j < len; j++) {
							if(this.numOne >= len) {
								return
							}
							let obj = {}
							this.$set(obj, 'department_name', resData[j].department_name)
              this.$set(obj, 'department_id',resData[j].department_id)
							let newparam = new URLSearchParams();
							newparam.append("company_id", this.nowCompanyId);
							newparam.append("department_id", resData[j].department_id);
							this.$http.post("/index.php/Mobile/user/get_company_personnel", newparam)
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
      _getProjectList(){
        this.comProjectList=[]
        let mparam = new URLSearchParams()
        mparam.append('uid',this.user.uid)
        mparam.append('company_id',this.nowCompanyId)
        this.$http.post("/index.php/Mobile/company/company_project_list",mparam)
          .then((res)=>{
            if(res.data.code === 251){
              localStorage.removeItem('nowCompanyId');
              localStorage.removeItem('nowCompanyName');
              localStorage.removeItem('personnelId');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              this.$router.push({ path: '/login' })
              this.$message.error('您的帐号在别处登录，请重新登录');
            }
            res.data.data.forEach((item)=>{
              this.comProjectList.push(item)
            })
          })
      },
			_getAdmin() {
				this.adminArr = []
				let mparam = new URLSearchParams();
				mparam.append("company_id", this.nowCompanyId);
				mparam.append("department_id", -1);
				this.$http.post("/index.php/Mobile/user/get_company_personnel", mparam)
					.then((res) => {
						if(res.data.code === 251){
			              localStorage.removeItem('nowCompanyId');
			              localStorage.removeItem('nowCompanyName');
			              localStorage.removeItem('personnelId');
			              localStorage.removeItem('token');
			              localStorage.removeItem('user');
			              this.$router.push({ path: '/login' })
			              this.$message.error('您的帐号在别处登录，请重新登录');
			            }
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
		},components:{
    }

	}
</script>

<style lang="scss">
	.manageCompany_wrapper {
		padding: 0 10px 10px 10px;
		z-index: 20;
		background: #FFFFFF;
		box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		.manageCompany {
			position: relative;
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
					width: 150px;
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
					.el-button.is-round {
						padding: 10px 20px;
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
          .com_unit{
            button{
              margin: 10px 10px;
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
        .addProject {
          width: 100%;
          min-height: 200px;
          .menu{
            button{
              display: block;
              margin: 40px auto 0;
            }
          }
          .project{
            background: #FFFFFF;
            box-shadow: 0 0 2px rgba(0, 0, 0, .2);
            -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
            >ul{
              padding: 10px;
              >li{
                cursor: default;
                display: block;
                border-bottom: 1px solid #DDDDDD;
                font-size: 14px;
                transition: .3s;
                &:first-child {
                  border-bottom: 1px solid transparent;
                  &:hover {
                    background: none;
                  }
                }
                >.projectName {
                  font-weight: 700;
                  font-size: 15px;
                  text-indent: 2px;
                }
                >.addTime {
                  font-weight: 700;
                  font-size: 15px;
                  text-indent: 2px;
                  float: right;
                  margin-right: 100px;
                }
                &:nth-child(even) {
                  background: rgb(245, 247, 250);
                }
                &:hover {
                  background: #EEEEEE;
                }
                >div {
                  margin-top: 10px;
                  height: 40px;
                  line-height: 40px;
                  display: inline-block;
                }
                .name {
                  width: 150px;
                }
                .time{
                  width: 200px;
                  float: right;
                }
              }
            }
          }
          .addproject{
            .return{
              button{
                margin-left: 20px;
              }
            }
            .operation {
              width: 200px;
              margin: 100px auto;
              button {
                margin-left: 40px;
                margin-top: 20px;
              }
            }
          }
        }
        .disBandAge{
          width: 100%;
          min-height: 200px;
          .operation{
            margin: 30px auto 0;
            span{
              display: block;
              text-align: center;
              font-size: 18px;
              font-weight: 600;
            }
            .btn{
              width: 104px;
              margin: 30px auto 0;
              button{
                font-weight: normal;
                margin: 0 auto;
                span{
                  font-weight: normal;
                  font-size: 14px;
                }
              }
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
	}
</style>
