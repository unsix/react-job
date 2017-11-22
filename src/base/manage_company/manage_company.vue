<template>
	<div class="manageCompany_wrapper">
		<div class="manageCompany">
			<!--<div class="title">
				<span>公司管理</span><span v-show="typeInfo"> - </span><span class="typeInfo">{{typeInfo}}</span>
				<i class=" close el-icon-close" @click="close"></i>
			</div>-->
			<div class="nav">
				<ul>
					<li v-for="(item,index) in typeName" :class="{'active': index == navIndex}"  @click="chooseNav(item,index)">{{item}}</li>
				</ul>
			</div>
			<div class="type">
				<div class="list" v-show="listShow">
					<ul>
						<li>
							<span>管理员</span>
							<div v-for="(item,index) in adminArr">
								<div class="img">
									<img :src="item.avatar" alt="" />
								</div>
								<div class="content">
									<span class="name">{{item.name}}</span>
									<span class="phone">{{item.phone}}</span>
								</div>
								<i class="close el-icon-circle-close-outline"  @click="_deleteManager(item,index)"></i>
							</div>
						</li>
						<li v-for="(item,index) in comPartPersonList" >
							<span>{{item.department_name}}</span>
							<div v-for="(list,index) in item.person" >
								<div class="img">
									<img :src="list.avatar" alt="" />
								</div>
								<div class="content">
									<span class="name">{{list.name}}</span>
									<span class="phone">{{list.phone}}</span>
								</div>
								<i class="close el-icon-circle-close-outline"></i>
							</div>
						</li>
					</ul>
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
								<!--<el-radioo v-for="(item,index) in radiooArr" v-model="radioo" :label="index">{{item.name}}</el-radioo>-->
  								<!--<el-radioo v-model="radioo" label="2">备选项</el-radioo>-->
  								<!--<i class="addGroup el-icon-circle-plus" @click="addGroup"></i>-->
							</div>
						</div>
						<div class="submit">
							<span>确认邀请</span>
						</div>
					</div>
				</div>
				<div class="addAdministrator" v-show="addAdministratorShow">
					<div class="addAdmin">
						<div class="submit" @click="submitAddManager">确认添加</div>
						<div class="close el-icon-circle-close" @click="closeInvite"></div>
						<div class="list">
							<div class="title">
								<span>管理员列表</span>
							</div>
							<div class="add el-icon-circle-plus" @click="addAdminPerson" ></div>
							<ul>
									<li v-for="(item,index) in adminArr">{{item.name}} 	
										<i class="close el-icon-error" @click="_deleteManager(item,index)"></i> 
									</li>
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
						<li v-for="(item,index) in comPersonList" @click="choosePerson(item,index)" :key="index">
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
import {getAvatar} from '@/common/js/avatar.js'
import {mapGetters} from 'vuex'
	export default{
		data(){
			return{
				activeNames: ['1'],
				companyId:'',
				groupList:[],
				smObj:{},
				navIndex:-1,
				listShow:true,
				inviteColleaguesShow:false,
				addAdministratorShow:false,
				typeInfo:'',
				typeName:['添加部门','添加管理员','添加工程项目'],
				radioo: '2',
				adminArr:[],
				personShow:false,
				numOne:0
			}
		},
		created(){	
			this._getCompanyId()
//			console.log(this.comPartPersonList)
		},
		computed:{
			...mapGetters([
				'user',
				'nowCompanyId',
				'comPartPersonList',
				'comPersonList'
			])
		},
		watch:{
			nowCompanyId:function (){
//				this.numOne=0
//				this._getCompanyId()
			}
		},
		methods:{
			handleChange(){
				
			},
			submitAddManager(){
				
			},

			addAdminPerson(){
				this.personShow=true
			},
			submitAddManager(){
				let newAdminArr=[]
				this.adminArr.forEach((item)=>{
					newAdminArr.push(item.personnel_id)
				})
				let param = new URLSearchParams();
			    param.append("uid",this.user.uid);
			    param.append("personnel_id",JSON.stringify(newAdminArr));
			    param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index/Mobile/User/give_manage",param)
			    .then((res)=>{
			    	if(res.data.code === '0'){
			    		alert('添加成功')
			    	}
			    })
			},
			_deleteManager(item,index){
				if(item.personnel_id==='11'){
					alert('管理员不可删除自己')
					return
				}
				this.adminArr.splice(index,1)
				let param = new URLSearchParams();
			    param.append("uid","10000216");
			    param.append("my_personnel_id",'11');
			    param.append("personnel_id",item.personnel_id);
			    param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index/Mobile/User/del_manage",param)
			    .then((res)=>{
			    })
			},
			chooseNav(item,index){
				this.navIndex=index
				if(index===0){
//					this.listShow=false
//					this.inviteColleaguesShow=true
//					this.addAdministratorShow=false
	    			this.$prompt('请输入新部门', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			        }).then(({ value }) => {
			          this.$message({
			            type: 'success',
						message: '添加'+value+'成功'
			          });
			          this.comPartPersonList.push({
			          	department_name:value
			          })
			          this._add_depart(value)
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '取消输入'
			          });       
			        });
				}else if(index===1){
					this.listShow=false
					this.inviteColleaguesShow=false
					this.addAdministratorShow=true
				}
			},
			_add_depart(value){
				let param = new URLSearchParams();
			    param.append("uid",this.user.uid);
			    param.append("department_name",value);
			    param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index/Mobile/User/add_department",param)
			    .then((res)=>{
			    	if(res.data.code === '0'){
			    		
			    	}
			    })
			},
      		closePersonList(){
		    	this.personShow=false
		    },
		    choosePerson(item,index){
		    	for(let i = 0;i<this.adminArr.length;i++){
		    		if(item.name===this.adminArr[i].name){
		    			alert(item.name+'已经是管理员了！')
		    			return
		    		}	
		    	}

		    	this.adminArr.push(item)
		    },
			closeInvite(){
				this.navIndex=-1
				this.listShow=true
				this.inviteColleaguesShow=false
				this.addAdministratorShow=false
			},
			_getCompanyId(){			
			    	let resData=res.data.data
			    	let mparam = new URLSearchParams();
					mparam.append("company_id",this.nowCompanyId);
					mparam.append("department_id",-1);  
					this.$http.post("/index/Mobile/user/get_company_personnel",mparam)
					.then((res)=>{	
						if(res.data.data.length != 0){
							res.data.data.forEach((list)=>{	
						    		let mewObj={}
						    		mewObj.personnel_id=list.personnel_id
						    		mewObj.department_name=list.department_name
						    		mewObj.name=list.name
						    		mewObj.phone=list.phone
						    		mewObj.avatar=getAvatar(list.avatar)
						    		this.adminArr.push(mewObj)  
					   		})
						}
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
		width: 550px;
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
					cursor: pointer;
					flex: 1;
					font-size: 12px;
					height: 35px;
					line-height: 35px;
					text-align: center;
					&.active{
						background: #f9f9f9;
					    color: #333333;
					}
				}
			}
		}
		.type{
			width: 100%;
			height: 100%;
			.list{
				ul{
					li{
						margin-bottom:4px;
						>span{
							display: block;
							height: 24px;
							line-height: 24px;
							color: #3487E2;
							font-size: 14px;
							text-indent: 6px;
							
						}
						>div{
							cursor: default;
							border-top: 1px solid #DDDDDD;
							.img{
								margin-top: 2px;
								display: inline-block;
								img{
									display: block;
									width: 30px;
									height: 30px;
									border-radius: 50%;
								}
							}
							.content{
								display: inline-block;
								span{
									display: block;
									font-size: 12px;
									line-height: 17px;
								}
							}
							i{
								margin-top: 2px;
								margin-right: 2px;
								float: right;
								&:hover{
									color: #FA5555;
								}
							}
						}
						
					}
				}
			}
			.addAdministrator{
				width: 100%;
				min-height: 400px;
				background: #f1f1f1;
				.addAdmin{
					padding: 10px;
					position: relative;
					.submit{
						position: absolute;
						left: 400px;
						display: block;
						padding: 4px 10px;
						color: #FFFFFF;
						background: #64A6FF;
						cursor: pointer;
					}
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