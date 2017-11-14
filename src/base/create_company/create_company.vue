<template>
	<div class="createCompany_wrapper" >
		<div class="createCompany">
			<div class="step">
				<el-steps :active="active" finish-status="success">
				  <el-step title="基本信息"></el-step>
				  <el-step title="公司架构"></el-step>
				  <el-step title="添加部门人员"></el-step>
				</el-steps>
			</div>
			<div class="wrapper_close el-icon-error" @click="wrapperClose"></div>
			<div class="process_wrapper">
				<div class="process">
					<div class="processOne" v-show="processOneShow">
						<div class="sec">
							<span class="title">公司名称</span>
							<input type="text" v-model="companyName" />
							<span class="exam" v-show="!companyName" >请输入公司名称</span>
						</div>
						
						<div class="sec">
							<span class="title">公司电话</span>
							<input type="text" v-model="companyPhone" />
							<span class="exam" v-show="!companyPhone">请输入公司电话</span>
						</div>
						<div class="sec">
							<span class="title">公司地址</span>
							<input type="text" v-model="companyAdd" />
							<span class="exam" v-show="!companyAdd">请输入公司地址</span>
						</div>
					</div>
					<div class="processTwo" v-show="processTwoShow">
						<el-form :model="department">
							 <el-form-item :label="item.name" v-for="(item,index) in department" :key="item.name">
							    <el-checkbox-group v-model="item.type" >
							      <el-checkbox v-for="(group,index) in item.groups" :label="group" :value="group" name="type" :key="index" >{{group.name}}</el-checkbox>
							      <div class="addGroup_wrapper" @click="addGroup(index)" >
							      	<div class="addGroup fa fa-plus-circle" ></div>
							      </div>
							    </el-checkbox-group>
							 </el-form-item>
							 <div class="addDepart">
							 	<span @click="addDepart">添加部门</span>
							 </div>
						</el-form>
					</div>	
					<div class="processThree" v-show="processThreeShow">
						<div class="sec" v-for="(item,nowIn) in department" >
							<div class="list" v-for="(group,inz) in item.type" :key="item.name">
								<span class="title">
									{{item.name}}-{{group.name}}
									<i class="fa fa-plus-circle" @click="addPerson(inz,nowIn)"></i>
									
								</span>
								<ul>
										<li v-for="(info,index) in group.person"  v-show="info.name"  >
											<div class="avatar">
												<img :src="info.avatar" alt="" />
											</div>
											<div class="content">
												<span class="name">{{info.name}}</span>
												<span class="phone">{{info.phone}}</span>
											</div>
											<i class="close el-icon-circle-close-outline" @click="rePersonList(info,index,inz,nowIn)"></i>
										</li>
								</ul>
							</div>
						</div>
						<transition name="slideOne">
						<div class="person" v-show="personShow" ref="person" >
							<div class="close el-icon-error" @click="closePersonList"></div>
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
			</div>
			<div class="stepButton">
				<el-button  @click="next" ref="step" id="step">下一步</el-button>
			</div>
		</div>
	</div>	
</template>

<script>
	export default{
		data() {
	      return {
	      	department: {
	          manager:{
	          	name:'总经办',
	          	groups:[
	          	{
	          		"name":"总经理",
					"总经理":[{}]
				},
				{
	          		"name":"副总经理",
					"副总经理":[{}]
				}
	          	],
	          	type:[]
	          },
	          finance:{
	          	name:'财务部',
	          	groups:[
	          	{
	          		"name":"财务总监",
					"财务总监":[{}]
				},
				{
	          		"name":"会计",
					"会计":[{}]
				}
	          	],
	          	type:[]
	          },
	          invest:{
	          	name:'计划投资管理部',
	          	groups:[
	          	{
	          		"name":"计划部经理",
					"计划部经理":[{}]
				},
				{
	          		"name":"投资总监",
					"投资总监":[{}]
				}
	          	],
	          	type:[]
	          }
	          ,
	          budget:{
	          	name:'预结算部',
	          	groups:[
	          	{
	          		"name":"预算员",
					"预算员":[{}]
				},
				{
	          		"name":"结算员",
					"结算员":[{}]
				}
	          	],
	          	type:[]
	          },
	          material:{
	          	name:'材料部',
	          	groups:[
	          	{
	          		"name":"材料员",
					"材料员":[{}]
				},
				{
	          		"name":"仓管员",
					"仓管员":[{}]
				}
	          	],
	          	type:[]
	          },
	          project:{
	          	name:'工程部',
	          	groups:[
	          	{
	          		"name":"项目经理",
					"项目经理":[{}]
				},
				{
	          		"name":"施工员",
					"施工员":[{}]
				},
				{
	          		"name":"资料员",
					"资料员":[{}]
				}
	          	],
	          	type:[]
	          },
	          quality:{
	          	name:'质安部',
	          	groups:[
	          	{
	          		"name":"质量员",
					"质量员":[{}]
				},
				{
	          		"name":"安全员",
					"安全员":[{}]
				}
	          	],
	          	type:[]
	          }
	       },
	        nowPerson:'',
	        nowIn:'',
	        active: 0,
	        companyName:'',
	        companyPhone:'',
	        companyAdd:'',
	        companyId:0,
	        workerInfo:[],
	        personShow:false,
	        processOneShow:true,
	        processTwoShow:false,
	        processThreeShow:false
	      }
	    },

	    created(){
	   		this.getData()
	    },
	    methods: {
		    wrapperClose(){
		    	this.$emit('companyClose')
		    },
		    addPerson(inz,nowIn){
		    	this.personShow=true
		    	this.nowPerson = inz
		    	this.nowIn=nowIn
		    },
		    closePersonList(){
		    	this.personShow=false
		    },
		    choosePerson(item,index){
		    	this.department[this.nowIn].type.person=[]
		    	let nperson=[]
		    	nperson.push(item)
		    	this.$set(this.department[this.nowIn].type[this.nowPerson],'person',nperson)
		    	this.workerInfo.splice(index,1)
		    },
		    rePersonList(info,index,inz,nowIn){
		    	this.nowIn = nowIn
		    	this.workerInfo.push(info)
		    	this.$set(this.department[nowIn].type[inz].person,index,{})
		    },
	    	addDepart(){
	    		 this.$prompt('请输入部门名称', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(({ value }) => {
		          this.$message({
		            type: 'success',
					message: '添加'+value+'成功'
		          });
		          this.$set(this.department,value,{
		          	name:value,
		          	groups:[],
		          	type:[]
		          })
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消输入'
		          });       
		        });
	    	},
	    	addGroup(index) {
		        this.$prompt('请输入', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		        }).then(({ value }) => {
		          this.$message({
		            type: 'success',
					message: '添加'+value+'成功'
		          });
		          let newObj={
	          		"name":value,
					value:[{}]
				}
		          this.department[index].groups.push(newObj)
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消输入'
		          });       
		        });
      		},
      		getData(){	
      			
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
    		creatOver(){
      			let c_param = new URLSearchParams();
			    c_param.append("uid","10000163");
			    c_param.append("name",this.companyName);
			    c_param.append("company_address",this.companyAdd);
			    c_param.append("company_tel",this.companyPhone);
			    this.$http.post("/index/Mobile/User/add_company",c_param)
			    .then((res)=>{
			    	this.companyId=res.data.data.company_id
			    	
			    })
    			let ret = []
	         	for(var i in this.department) {
				let str={}
	         	for(var j in this.department[i].type){
	         		if(this.department[i].type[j]){
	         			let newStr={}
	         			newStr.name=this.department[i].type[j].name
	         			for(var z in this.department[i].type[j].person){
	         				if(this.department[i].type[j].person){
	         					let newStrPerObj={}
		         				newStr.person=[]    				
	         					newStrPerObj.name=this.department[i].type[j].person[z].name
	         					newStrPerObj.uid=this.department[i].type[j].person[z].uid	
	         					newStr.person.push(newStrPerObj)
	         					str.positions=[]
	         					str.positions.push(newStr)
	         					str.name=this.department[i].name
	         					ret.push(str)
	         				}	
		         			}
		         		}
		         	}
		      	}
//	         	console.log(ret)
	         	let newRet =JSON.stringify(ret);
	        	let param = new URLSearchParams();
			    param.append("big_json",newRet);
			    param.append("company_id",this.companyId);
			    param.append("uid","10000163");
			    this.$http.post("/index/Mobile/company/entrance_company",param)
			      .then((res)=>{
			      	console.log(res)
			      })
    		},
	     	next() {
	        if (this.active++ > 2) this.active = 0;
			if(this.active===0){
				alert()
				this.processOneShow = true
				this.processTwoShow = false
				this.processThreeShow = false
				
	        
			}else if(this.active === 1){
				if(!this.companyName||!this.companyPhone||!this.companyAdd){
					 this.active = 0
					return
				}else{
					this.processOneShow = false
					this.processTwoShow = true
					this.processThreeShow = false
				}
				
				
			}else if(this.active === 2){
				this.processOneShow = false
				this.processTwoShow = false
				this.processThreeShow = true
				document.getElementById('step').innerText = '完成'
			}else if(this.active === 3){
				this.creatOver()
			}
	    }
	}
}
</script>

<style lang="scss" scoped="scoped">
  .slideOne-enter-active, .slideOne-leave-active{
  	transition: all 1s
  }
  .slideOne-enter, .slideOne-leave-to{
  	 transform: translate3d(0,-400px, 0)
  }
  .slideTwo-enter-active, .slideTwo-leave-active{
  	transition: all 1s
  }
  .slideTwo-enter, .slideTwo-leave-to{
  	 transform: translate3d(200px,0, 0)
  }
	.createCompany_wrapper{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
		z-index: 20;
		
		.createCompany{
			position: relative;
			width: 600px;
			background: #EEEEEE;
			margin: 75px auto;
			overflow: hidden;
			border-radius: 6px;
			-moz-border-radius:  6px ;
            -webkit-border-radius:  6px;
			.step{
				width: 100%;
				.el-steps--horizontal{
					padding: 10px;	
				}		
			}
			.wrapper_close{
				position: absolute;
				right: 5px;
				top: 5px;
				font-size: 20px;
				&:hover{
					color: #FA5555;
				}
			}
			.stepButton{
				width: 100%;
				height: 40px;
				button{
					float: right;
					position: relative;
					bottom: 10px;
					right: 10px;	
				}
			}
			.process_wrapper{
				width: 100%;
				.process{
					padding:10px;
					.processThree{
						width: 200px;
						margin: 20px;
						position: relative;	
						min-height: 200px;
						.person{
							position: absolute;
							right: -160px;
							top: 0;
							z-index: 10;
							.close{
								position: absolute;
								right: 2px;
								top: 2px;
								color:#999999; 
								&:hover{
									color: #FA5555;
								}
							}
							.personList{
								width: 150px;
								height: 230px;
								background:#F2F2F2;
								border: 1px solid #999999;
								overflow-y: scroll;
								-webkit-border-radius: 4px;
								-moz-border-radius: 4px;
								border-radius: 4px;;
								ul{
									margin-top: 20px;
									padding: 4px;
									li{
										width: 100%;
										height: 34px;
										cursor: default;
										border-bottom: 1px solid #999999;
										.avatar{
											display: inline-block;
											float: left;
											margin-top: 2px;
											
										}
										.content{
											display: inline-block;
											float: left;
											margin-left: 4px;
											span{
												display: block;
												font-size: 12px;
												height: 17px;
												line-height: 17px;	
											}
										}
										img{
											width: 30px;
											height: 30px;
											border-radius: 50%;
										}
									}
								}
							}	
						}
						.sec{
							.list{
								
								span{
									width: 100%;
									height: 20px;
									font-size: 14px;
									line-height: 20px;
									text-align: left;
									background: #EEEEEE;
									color: #a2a2a2;
									cursor: default;
									display: block;
									border-bottom: 1px solid #999999;
									i{
										float: right;
										font-size: 20px;
										color:409EFF ;
										&:hover{
										color: #409EFF;
									}
									}
								}
								ul{
									li{
										width: 100%;
										height: 30px;
										text-indent: 10px;
										line-height: 30px;
										background:transparent;
										border-bottom: 1px solid #999999;
										position: relative;
										cursor: default;
										
										.close{
											position: absolute;
											top: 2px;
											right: 2px;
											font-size: 14px;
											&:hover{
												color: #FA5555;
											}
										}
										.avatar{
											display: inline-block;
											float: left;
											margin-top: 2px;
											
										}
										.content{
											display: inline-block;
											float: left;
											margin-left: 4px;
											
											span{
												display: block;
												font-size: 12px;
												height: 15px;
												line-height: 15px;
												background: transparent;
												color: #666666;
												border-bottom: none;
											}
										}
										img{
											width: 26px;
											height: 26px;
											border-radius: 50%;
										}
									}
								}
							}
						}
					}
					.processTwo{
						width: 500px;
						margin: 20px auto;
						.addDepart{
							width: 100%;
							span{
								display: block;
								width: 100px;
								background: #409EFF;
								border-radius: 4px;
								color: #fff;
								text-align: center;
								line-height: 34px;
								cursor: pointer;
								&:hover{
									background: #67C23A;
								}
							}
						}
						.addGroup_wrapper{
							width: 20px;
							height: 20px;
							display: inline-block;
							float:right;
							position:relative;
							top:6px;
							.addGroup{
								font-size: 20px;
								color: #878D99;
								&:hover{
									color: #409EFF;
								}
							}
						}
						.el-form-item__label{
							width: 120px;
							text-align: center;
							&::after{
								content: '';
							}
						}
						.el-checkbox-group{
							margin-left: 100px;
						}
						.el-checkbox{
							min-width: 80px;
						}
						.el-checkbox+.el-checkbox{
							margin-left: 20px;
						}
						.el-form-item{
							margin-bottom: 10px;
						}
					}
					.processOne{
						margin-top: 20px;
						.sec{
							width: 500px;
							margin: 0 auto;
							height: 40px;
							margin-bottom: 10px;
							
							.title{
								height: 40px;
								line-height: 40px;
								font-size: 14px;
								padding: 0 10px ;
							}
							.exam{
								
								color: #FA5555;
								font-size: 12px;
							}
							input{
								height: 30px;
								border-radius: 4px;
								line-height: 1;
								width: 300px;
								border: 1px solid #2fa6ae;
								text-indent: 6px;
								outline:none;
								-webkit-transition: .2s;
								-moz-transition: .2s;
								-ms-transition: .2s;
								-o-transition: .2s;
								transition: .2s;
								&:hover{
									border: 1px solid #64a6ff;
								}
							}
						}
					}
				}
			}
		}
		
	}
	.el-message-box{
			.el-message-box__content{
				p{
					padding-bottom: 0;
					text-align: left;
				}
			}
			.el-input{
				right: 0;
			}
		}
</style>