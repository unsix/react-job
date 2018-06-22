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
						</div>
						<div class="sec">
							<span class="title">公司电话</span>
							<input type="text" v-model="companyPhone" />
						</div>
						<div class="sec">
							<span class="title">公司地址</span>
							<input type="text" v-model="companyAdd" />
						</div>
					</div>
					<div class="processTwo" v-show="processTwoShow">
						<el-form :model="department">
							 <el-form-item :label="item.name" v-for="(item,index) in department" :key="item.name">
							    <el-checkbox-group v-model="item.type" >
							      <el-checkbox v-for="(group,index) in item.groups" :label="group" :value="group" name="type" :key="index" >{{group.name}}</el-checkbox>
							      <div class="addGroup_wrapper" @click="addGroup(index)" >
							      	<div class="addGroup el-icon-circle-plus" ></div>
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
									<i class="el-icon-circle-plus" @click="addPerson(inz,nowIn)"></i>
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
	import {mapGetters, mapMutations } from 'vuex'
  import {getCro} from "@/common/js/crowd";
	export default{
		data() {
	      return {
	      	old_department:{},
          nowCompanyId:'',
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
	        companyId:0,
	        companyName:'',
	        companyPhone:'',
	        companyAdd:'',
	        workerInfo:[],
	        personShow:false,
	        processOneShow:true,
	        processTwoShow:false,
	        processThreeShow:false,
	        nperson:[]
	      }
	    },
      mounted() {
        if(this.$route.path === '/work/create_company') {
          this.$emit('changeWorkIndex', 3)
        }
      },
	    created(){

	   		this.getData()
	    },
	    computed:{
	    	...mapGetters([
	    		'user',
	    		'comPersonList'
	    	])
	    },
	    methods: {
		  //下一步
        ...mapMutations({
          setNowCompanyId: 'SET_NOWCOMPANY_ID',
          setNowCompanyName: 'SET_NOWCOMPANY_NAME'
        }),
		    wrapperClose(){
		    	this.$emit('companyClose')
		    	  this.companyName = ''
	       		this.companyPhone = ''
	        	this.companyAdd = ''
	        	this.processOneShow = true
	       		this.processTwoShow = false
	        	this.processThreeShow = false
            this.active = 0
            document.getElementById('step').innerText = '下一步'
		    },
		    addPerson(inz,nowIn){
		    	this.personShow = true
		    	this.nowPerson = inz
		    	this.nowIn = nowIn
		    	this.nperson=[]
		    },
		    closePersonList(){
		    	this.personShow=false

		    },
		    choosePerson(item,index){
		    	for(let i = 0; i<this.nperson.length;i++){
		    		if(this.nperson[i].personnel_id=== item.personnel_id){
		    			this.$message({
				          message: item.name+'已经存在',
				          type: 'warning'
				        });
		    			return
		    		}
		    	}
		    	this.department[this.nowIn].type.person=[]
		    	this.nperson.push(item)
		    	this.$set(this.department[this.nowIn].type[this.nowPerson],'person',this.nperson)
		    },
		    rePersonList(info,index,inz,nowIn){
		    	this.nowIn = nowIn
		    	this.$set(this.department[nowIn].type[inz].person,index,{})
		    },
        //添加部门
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
        //添加职位
	    	addGroup(index) {
		        this.$prompt('请输入职位', '提示', {
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
            this.nowCompanyId = JSON.parse(localStorage.nowCompanyId)
            let newparam = new URLSearchParams();
            newparam.append("company_id", this.nowCompanyId);
            this.$http.post("/index.php/Mobile/user/get_company_personnel", newparam)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                this.workerInfo = res.data.data
              })
			   // this.workerInfo=this.comPersonList
			    this.old_department = this.department
    		},
        //创建公司
    		creatOver(){
		      let str = this.companyName
          let c_param = new URLSearchParams();
			    c_param.append("uid",this.user.uid);
			    c_param.append("name",this.companyName);
			    c_param.append("company_address",this.companyAdd);
			    c_param.append("company_tel",this.companyPhone);
			    this.$http.post("/index.php/Mobile/User/add_company",c_param)
			    .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
			    	if(res.data.code === 0){
			    		this.companyId=res.data.data.company_id
			    		let ret = []
			         	for(var i in this.department) {
			    		  console.log(this.department)
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
				      	console.log(ret)
			         	let newRet =JSON.stringify(ret);
			        	let param = new URLSearchParams();
                param.append("big_json",newRet);
                param.append("company_id",this.companyId);
                param.append("uid",this.user.uid);
                this.$http.post("/index.php/Mobile/company/entrance_company",param)
					      .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  getCro(judge,current)
					      	if(res.data.code === 0){
					      			this.$message({
						        	message: '创建公司成功',
						        	type: 'success'
						        });
                    this.setNowCompanyId(this.companyId)
                    this.setNowCompanyName(str)
                    localStorage.nowCompanyId = JSON.stringify(this.companyId)
                    localStorage.nowCompanyName = JSON.stringify(str)
                    this.$router.push('/work')
					      	}else{
					      		this.$message.error('创建公司失败');
					      	}
					      })
			    	}else{
			    		this.$message.error(res.data.data.m);
              this.$message.error('创建公司失败');
              return
			    	}
			    })
    		},
        //点击下一步
	     	next() {
	        if (this.active++ > 2) this.active = 0;
            if(this.active===0){
              alert()
              this.processOneShow = true
              this.processTwoShow = false
              this.processThreeShow = false
            }else if(this.active === 1){

              if(!this.companyName||!this.companyPhone||!this.companyAdd){
                 this.$message({
                      message: '请填写完整信息',
                      type: 'warning'
                    });
                 this.active = 0
                return
              }
              let reg = /^1[0-9]{10}$/;
              if(!reg.test(this.companyPhone)){
                 this.$message({
                      message: '请填写正确手机号码',
                      type: 'warning'
                    });
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
              this.$emit('companyClose')
              this.processOneShow = true
              this.processTwoShow = false
              this.processThreeShow = false
              this.companyName=''
                  this.companyPhone=''
                  this.companyAdd=''
              this.active = 0
              document.getElementById('step').innerText = '下一步'
              this.department = this.old_department
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
		/*position: absolute;*/
		top: 0;
		left: 0;
		width: 600px;
		height: 100%;
		background: rgba(0,0,0,0.5);
		z-index: 20;

		.createCompany{
			position: relative;
			background: #FFFFFF;
			margin: 0px auto;
			overflow: hidden;
			/*border-radius: 6px;*/
			/*-moz-border-radius:  6px ;*/
            /*-webkit-border-radius:  6px;*/
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
						width: 300px;
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
										color:#409EFF ;
										&:hover{
										color: #409EFF;
									}
									}
								}
								ul{
									li{
										width: 100%;
										height: 40px;
										text-indent: 10px;

										background:transparent;
										border-bottom: 1px solid #999999;
										position: relative;
										cursor: default;

										.close{
											position: absolute;
											top: 10px;
											right: 1px;
											font-size: 18px;
											&:hover{
												color: #FA5555;
											}
										}
										.avatar{
											display: inline-block;
											float: left;
											margin-top: 2px;
											img{
												width: 30px;
												height: 30px;
												border-radius: 50%;
												margin-top: 2px;
											}
										}
										.content{
											display: inline-block;
											float: left;
											margin-left: 4px;

											span{
												display: block;
												font-size: 12px;
												line-height: 20px;
												background: transparent;
												color: #666666;
												border-bottom: none;
											}
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
