<template>
	<div class="manageCompany_wrapper">
		<div class="manageCompany">
			<!--<div class="title">
				<span>公司管理</span><span v-show="typeInfo"> - </span><span class="typeInfo">{{typeInfo}}</span>
				<i class=" close el-icon-close" @click="close"></i>
			</div>-->
			<div class="nav">
				<ul>
					<li @click="inciteCol">邀请同事</li>
					<li @click="addAdmin">添加管理员</li>
					<li >添加工程项目</li>
				</ul>
			</div>
			<div class="type">
				<div class="list" v-show="listShow">
					<el-collapse v-model="activeNames" @change="handleChange">
					  <el-collapse-item :title="item.name" name="1" v-for="(item,index) in groupList">
					    <div>
					    	{{item.infos.name}}
					    </div>
					  </el-collapse-item>
					</el-collapse>
				</div>
				<div class="inviteColleagues" v-show="inviteColleaguesShow">
					<div class="inviteCo">
						<div class="close el-icon-circle-close" @click="closeInvite"></div>
						<div class="sec">
							<span class="title">姓名</span>
							<input type="text" class="inputInfo" />
						</div>
						<div class="sec">
							<span class="title">电话</span>
							<input type="text" class="inputInfo" />
						</div>
						<div class="sec">
							<span class="title">指定部门</span>
							<input type="text" class="inputInfo" />
						</div>
						<div class="sec">
							<span class="title">职位</span>
							<div class="position">  
								<el-radio v-for="(item,index) in radioArr" v-model="radio" :label="index">{{item.name}}</el-radio>
  								<!--<el-radio v-model="radio" label="2">备选项</el-radio>-->
  								<i class="addGroup el-icon-circle-plus" @click="addGroup"></i>
							</div>
						</div>
						<div class="submit">
							<span>确认邀请</span>
						</div>
					</div>
				</div>
				<div class="addAdministrator" v-show="addAdministratorShow">
					<div class="addAdmin">
						<div class="close el-icon-circle-close" @click="closeInvite"></div>
						<div class="list">
							<div class="title">
								<span>管理员列表</span>
							</div>
							<div class="add el-icon-circle-plus" @click="addAdminPerson" ></div>
							<ul>
								<transition name="slideLi">
									<li v-for="(item,index) in adminArr">{{item.name}} 	
										<i class="close el-icon-error" @click="reAdmin(item,index)"></i> 
									</li>
								</transition>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<transition name="slide">
			<div class="person" v-show="personShow" ref="person">
				<div class="close el-icon-circle-close" @click="closePersonList" ></div>
				<div class="personList" id="person">
					<ul>
						<li v-for="(item,index) in workerInfo" @click="choosePerson(item,index)">
							<div class="avatar">
								<img :src="item.avatar" alt="" />
							</div>
							<div class="content">
								<span class="name">{{item.name}}</span>
								<span class="phone">{{item.phone}}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				activeNames: ['1'],
				companyId:'',
				groupList:[],
				smObj:{},
				listShow:true,
				inviteColleaguesShow:false,
				addAdministratorShow:false,
				typeInfo:'',
				radioArr:[
					{name:"职位1"},
					{name:"职位2"}
				],
				radio: '2',
				workerInfo:[],
				adminArr:[],
				personShow:false
			}
		},
		created(){
			this.getCompanyId()
			this.getAdminListData()
		},
		methods:{
			handleChange(){
				
			},
			reAdmin(item,index){
				this.adminArr.splice(index,1)
				setTimeout(()=>{
					this.workerInfo.push(item)
				},400)
				
			},
			addAdminPerson(){
				this.personShow=true
			},
			addGroup() {
		        this.$prompt('请输入新职位', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(({ value }) => {
		          this.$message({
		            type: 'success',
					message: '添加'+value+'成功'
		          });
		          this.radioArr.push({name:value})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消输入'
		          });       
		        });
      		},
      		
      		closePersonList(){
		    	this.personShow=false
		    },
		    choosePerson(item,index){
		    	this.adminArr.push(item)
		    	this.workerInfo.splice(index,1)
		    },
			inciteCol(){
				this.listShow=false
				this.inviteColleaguesShow=true
				this.addAdministratorShow=false
				this.typeInfo="邀请同事"
			},
			closeInvite(){
				this.listShow=true
				this.inviteColleaguesShow=false
				this.addAdministratorShow=false
				this.typeInfo=""
			},
			addAdmin(){
				this.listShow=false
				this.inviteColleaguesShow=false
				this.addAdministratorShow=true
				this.typeInfo="添加管理员"
			},
//			close(){
//				this.$emit('close')
//			},
			getAdminListData(){	
			    let rec=[]
			    let param = new URLSearchParams();
			    param.append("uid","10000163");
			    this.$http.post("/index/Mobile/Find/nearby_worker",param)
			    .then((res)=>{
			    	 for (let x in res.data.data.nworker)  
					  {  
					    if(res.data.data.nworker[x].avatar.indexOf('jpg')!== -1){
					   		res.data.data.nworker[x].avatar = 'http://img-bbsf.6655.la/FnF0MmO7g-WONz-QYU6BsWMTwNR_'
					    }else{
					   	 	res.data.data.nworker[x].avatar = 'http://img-bbsf.6655.la/' + res.data.data.nworker[x].avatar
					    }
					    if(res.data.data.nworker[x].type){
					    	res.data.data.nworker[x].type = res.data.data.nworker[x].type[0]
					    }
					  }
			     	this.workerInfo=res.data.data.nworker
			    })
    		},
			getCompanyId(){	
			    let param = new URLSearchParams();
			    param.append("company_id","135");
			    this.$http.post("/index/Mobile/user/get_department_lest",param)
			    .then((res)=>{
			    	res.data.data.forEach((item)=>{
			    		this.companyId=item.department_id
			    		this.smObj.name=item.department_name
			    	})			    	
			    	this.getCompanyPersonnel(this.companyId)
			    })
	   		},
	   		getCompanyPersonnel(cid){
	   			let param = new URLSearchParams();
			    param.append("company_id","135");
			    param.append("department_id",cid);
			    this.$http.post("/index/Mobile/user/get_company_personnel",param)
			    .then((res)=>{
			    	res.data.data.forEach((list)=>{
			    		let newObj={}
			    		newObj.name=list.name
			    		newObj.phone=list.phone
			    		newObj.avatar=list.avatar
			    		this.smObj.infos=newObj
			    		this.groupList.push(this.smObj)
			    	})
			    })
	   		}
		}
	}
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active{
  	transition: all .6s
}
.slide-enter, .slide-leave-to{
  	transform: translate3d(0, -400px, 0)
}
.slideLi-enter-active, .slideLi-leave-active{
  	transition: all .5s
}
.slideLi-enter, .slideLi-leave-to{
  	transform: translate3d(240px, 0, 0)
}
.manageCompany_wrapper{
	z-index: 20;
	.manageCompany{
		position: relative;
		width: 560px;
		height: 400px;
		padding: 4px;
		background: #FFFFFF;
		overflow: hidden;
		border-radius: 6px;
		-moz-border-radius: 6px;
		-webkit-border-radius: 6px;
		.title{
			width: 100%;
			span{
				color: #5A5E66;
				height: 30px;
				line-height: 30px;
			}
			.close{
				display: inline-block;
				line-height:30px;
				float: right;
				font-size: 16px;
				&:hover{
					color: #409EFF;
				}
			}
		}
		.nav{
			width: 100%;
			margin: 4px 0;
			ul{
				display:flex;
				li{
					flex: 1;
					font-size: 12px;
					height: 35px;
					line-height: 35px;
					text-align: center;
					&.active{
						background: #f9f9f9;
					    font-weight: 700;
					    color: #333333;
					}
				}
			}
		}
		.type{
			width: 100%;
			height: 100%;
			.list{}
			.addAdministrator{
				width: 100%;
				height: 100%;
				background: #f1f1f1;
				.addAdmin{
					padding: 10px;
					position: relative;
					.close{
						position: absolute;
						top: 5px;
						right: 5px;
						color: #878D99; 
						z-index:20; 
						&:hover{
							color: #FA5555;
						}
					}
					.list{
						width:200px;
						border-radius:4px;
						margin-left: 10px;
						position: relative;
						.title{
							width:100%;
							span{
								display: block;
								width: 100%;
								height: 30px;
								text-align: center;
								color:#3487E2;
								border-radius: 4px;							
							}
						}
						.add{
							position: absolute;
							top: 6px;
							right: -30px;
							color: #878D99;
							&:hover{
								color: #409EFF;
							}
						}
						ul{
							li{
								background:transparent;
								height: 30px;
								text-indent: 10px;
								line-height: 30px;
								position: relative;
								border-bottom: 1px solid #3487E2;
								i{
									position: absolute;
									top: 7px;
									right: 10px;
									font-size: 14px;
									color: #3487E2;
									&:hover{
										color: #FA5555;
									}
								}
							}
						}
					}
				}
			}
			.inviteColleagues{
				width: 100%;
				height: 100%;
				background: #f1f1f1;
				.inviteCo{
					padding: 10px;
					position: relative;
					.close{
						position: absolute;
						top: 5px;
						right: 5px;
						color: #878D99; 
						z-index:20; 
						&:hover{
							color: #FA5555;
						}
					}
					.submit{
						width: 100%;
						margin-top: 10px;
						cursor: pointer;
						span{
							width: 100%;
							padding: 10px 0;
							text-align: center;
							background: #9DB5FB;
							display: block;
							color: #FFFFFF;
							-webkit-border-radius: 4px;
							-moz-border-radius: 4px;
							border-radius: 4px;
						}
					}
					.sec{
						margin-bottom: 10px;
						position: relative;
						.title{
							width: 100px;
							display: inline-block;
							margin-right:30px;
							display: block;
							width: 100px;
							height: 30px;
							line-height: 30px;
							text-align: right;
							float: left;
						}
						.inputInfo{
							display: inline-block;		
							height: 26px;
							width: 400px;
							outline: none;
						}
						.position{
							line-height: 30px;
							.addGroup{
								margin-left: 10px;
								color: #878D99;
								font-size: 20px;
								position: relative;
								top: 2px;
								&:hover{
									color: #409EFF;
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
			background:rgb(241,241,241);
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
					color:#2D2F33;
					cursor: default;
					.avatar {
						display: inline-block;
						float: left;
						margin-top: 2px;
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
					img {
						width: 30px;
						height: 30px;
						border-radius: 50%;
					}
				}
			}
		}
	}
}
.el-collapse-item__header{
	padding: 0 20px;
}
.el-button+.el-button{
	margin-left: 0;
	float: right;
}
.el-collapse-item__content{
	padding-bottom: 0;
	height: 24px;
	line-height: 24px;
	text-indent: 10px;
	background: #6298d4;
	color: #FFFFFF;
	cursor: default;
}
  .box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
</style>