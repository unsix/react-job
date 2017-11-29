<template>
	<div class="jurisdictionManage_wrapper">
		<div class="jurisdictionManage">
			<div class="nav">
				<el-tabs  v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="表单回执" ></el-tab-pane>
				    <el-tab-pane label="合同评审" ></el-tab-pane>
				    <el-tab-pane label="请购单" ></el-tab-pane>
			        <el-tab-pane label="请款单" ></el-tab-pane>
			        <el-tab-pane label="印章申请" ></el-tab-pane>
			        <el-tab-pane label="呈批件" ></el-tab-pane>
				</el-tabs>
			</div>
			<div class="wrapper">
					<div class="setFormRePer" v-show="setFormRePerShow">
						<div class="type">
							<div class="sec" v-for="(item,index) in setFormRe">
								<div class="secHead">
									<span class="headerName">{{item.name}}</span>
									 <el-button type="primary" round @click="perShow(index)" :disabled="redactState">编辑</el-button>
								</div>
								<ul class="secUl">
									<li v-for="(group,gindex) in item.groups">
										<div class="avatar">
											<img :src="group.avatar" v-show="group.avatar" alt="" />
										</div>
										<div class="content">
											<span class="name" v-show="group.name">{{group.name}}</span>
										</div>
										<div class="delete">
											<i class="el-icon-circle-close-outline" @click="deleted(gindex,index)" v-show="formRePersonIndex === index"></i>
										</div>
									</li>
								</ul>
							</div>
							
							<div class="person"  ref="person">
								<div class="submit">
									  <el-button type="primary" round @click="submit">保存更改</el-button>
								</div>	
								<el-collapse  v-model="activeNames" >
								   <el-collapse-item title="人员列表" name="1">
									   <div class="info" v-for="(item,index) in comPersonList" @click="choosePerson(item,index)">
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
						</div>
					</div>
					<keep-alive>
						<jurisdictionItem 
							v-show="jurisdictionItemShow"
							:formType="formType"
							@reload="reload"
							:submitAddPersonShow="submitAddPersonShow"
							:jurisdictionFormList="jurisdictionFormList">
						</jurisdictionItem>
					</keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
import {createJurisdictionList} from 'common/js/jurisdiction_list.js'
import {mapGetters} from 'vuex' 
import {createPersonInfo} from 'common/js/person_info'
import personList from '@/base/person_list/person_list'
import jurisdictionItem from '@/base/jurisdiction_manage/jurisdiction_item'
	export default{
		data(){
			return{
				typeInfo:'',
				setFormRe:{
					pingshen:{
						name:'合同评审表',
						type:1,
						groups:[]
					},
					qingkuan:{
						name:'请款单',
						type:7,
						groups:[]
					},
					qinggou:{
						name:'请购单',
						type:3,
						groups:[]
					},
				},	
			    value6: '',
			    redactState:false,
				setFormRePerShow:false,
				listShow:true,
				personShow:false,
				formRePersonIndex:'',
				jurisdictionFormList:[],
				contractApproval:[],
				jurisdictionItemShow:false,
				submitAddPersonShow:false,
				huizhiPersonList:[],
				deleteIndex:'',
				formType:-1,
				closeShow:false,
				num:0,
				activeName:'',
				activeNames: ['0']
				
			}
		},
		created(){
		},
		computed:{
			...mapGetters([
				'nowCompanyId',
				'user',
				'comPersonList'
			])
		},
		methods:{
			handleChange(){
				
			},
			handleClick(tab){
				let index = JSON.parse(tab.index)
				switch(index)
				{
				case 1:
				  this.formType=1
				  break;
				case 2:
				  this.formType=3
				  break;
				case 3:
				  this.formType=7
				  break;
				case 4:
				  this.formType=5
				  break;
				case 4:
				  this.formType=6
				  break;
				}
				if(index===0){
					this._getHuizhi()
					this.setFormRePerShow = true
					this.jurisdictionItemShow = false
				}else{
					this.personShow = false
					this.setFormRePerShow = false
					this.jurisdictionItemShow = true
					this._getApproval()
				}
			},
			handleClose(){
				
			},
			close(){
				this.$emit('close')
			},
			reload(){
				
				this._getApproval()
			},
			submit(){
				this.redactState = false
				this.activeNames = ['0']
				let zz=0
				if(this.formRePersonIndex==='pingshen'){
					zz=1
				}else if(this.formRePersonIndex === 'qinggou'){
					zz=3
				}else if(this.formRePersonIndex === 'qingkuan'){
					zz=7
				}
				let narr=[]
				this.setFormRe[this.formRePersonIndex].groups.forEach((item)=>{
					narr.push(item.uid)
				})
				let param = new URLSearchParams();
			    param.append("company_id",this.nowCompanyId);
			    param.append("type",zz);
			    param.append("personnel",JSON.stringify(narr));
			    param.append("uid",this.user.uid);
			    this.$http.post("/index/Mobile/user/give_finance_new",param)
			    .then((res)=>{
			    	if(res.data.code === 0){
			    		this._getHuizhi()
			    		this.formRePersonIndex = -1
			    		this.$message({
				          message: '修改成功',
				          type: 'success'
				        });
			    	}else{
			    		this.$message.error('修改失败');
			    	}
			    })
			},
			deleted(gindex,index){
				this.setFormRe[index].groups.splice(gindex,1)
			},
			returnList(){
				this.setFormRePerShow = false
				this.listShow = true	
			},
			choosePerson(item,index){
				if(this.setFormRe[this.formRePersonIndex].groups.indexOf(item) != -1){
					this.$message({
			          message: '列表中已存在' + item.name,
			          type: 'warning'
			        });
					return
				}
				this.setFormRe[this.formRePersonIndex].groups.push(item)
			},
			perShow(index){
				this.formRePersonIndex = index
				this.redactState = true
				this.activeNames = ['1']
			},
			closePersonList(){
				this.formRePersonIndex = -1
				this.personShow = false
			},
			
			_getHuizhi(){
				let param = new URLSearchParams();
			    param.append("company_id",this.nowCompanyId);
			    param.append("uid",this.user.uid);
			    this.$http.post("/index/Mobile/find/finance_personnel_list",param)
				.then((res)=>{
					res.data.data.forEach((item)=>{
						if(item.type===1){
							let arr=[]
							item.list.forEach((list)=>{
								arr.push(createJurisdictionList(list))
							})
							this.$set(this.setFormRe.pingshen, 'groups', arr)
						}else if(item.type === 3){
							let arr=[]
							item.list.forEach((list)=>{
								arr.push(createJurisdictionList(list))
							})
							this.$set(this.setFormRe.qinggou, 'groups', arr)
						}else if(item.type === 7){
							let arr=[]
							item.list.forEach((list)=>{
								arr.push(createJurisdictionList(list))
							})
							this.$set(this.setFormRe.qingkuan, 'groups', arr)
						}
					})
				})
			},
			_getApproval(){
				this.jurisdictionFormList = []
				let param = new URLSearchParams();
			    param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index/Mobile/approval/approval_list",param)
			    .then((res)=>{
			    	console.log(res)
					res.data.data.approval.forEach((item)=>{
						if(item.type===this.formType){
							if(item.list.length!=0){
								item.list.forEach((list)=>{
									this.jurisdictionFormList.push(createJurisdictionList(list))
								})								
							}
						}
						
					})
			    })
			}
		},
		components:{
			personList,
			jurisdictionItem
		},
		watch:{
			nowCompanyId(){
				this._getHuizhi()
				this._getApproval()
			}
		}
	}
</script>

<style lang="scss">
.jurisdictionManage_wrapper{
	>.jurisdictionManage{
		width: 558px;
		overflow: hidden;
		>.nav{
			width: 100%;
			margin: 4px 0;
			.el-tabs__nav{
				margin-left: 30px;
			}
		}
		.wrapper{
			width: 100%;
			overflow-x: hidden;
			min-height: 400px;
		}
		.wrapper>div{
            padding: 8px;
            width: 540px;
            min-height: 400px;
            background: #FFFFFF;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            .return{
            	display:inline-block;
				i{	
					display: inline-block;
					cursor: pointer;
					padding: 2px;
				}
			}
		}
		.list{
			ul{
				li{
					cursor: default;
					height: 30px;
					line-height: 30px;
					color: #5A5E66;
					font-size: 16px;
					margin-bottom: 10px;
					button{
						float: right;
					}
				}
			}
		}
		.setFormRePer{
			overflow-x: hidden;
			.type{
				position: relative;
				margin-top: 10px;
				>.person {
					position: absolute;
					top: 0px;
					right: 10px;
					z-index: 10;
					width: 150px;
					height: 300px;
					.el-collapse-item__content{
						padding-bottom: 0;
					}
					>.submit{
						margin-bottom: 10px;
						margin-left: 30px;
					}
					.info{
						cursor: default;
						font-size:0;
						margin-bottom:4px;
						
						>.avatar{
							vertical-align: top;
							display: inline-block;
							img{
								width: 40px;
								height: 40px;
								border-radius: 50%;
							}	
						}	
						>.content{
							display: inline-block;
							margin-left: 10px;
							>span{
								display: block;
								font-size: 12px;
							}
						}
					}
				}
				
				.sec{
					margin-bottom: 4px;
					.secHead{
						display: block;		
						.headerName{
							display: inline-block;
							width: 300px;
							height: 26px;
							line-height: 26px;
							background: #9293A7;
							color: #FFFFFF;
							text-indent: 10px;
							-webkit-border-radius: 4px;
							-moz-border-radius: 4px;
							border-radius: 4px;
							font-size: 14px;
							cursor: default;
						}
						button{
							padding: 5px 10px;
							width: 50px;
						}
					}
					.secUl{
						width:300px;
						li{
							width:300px;
							margin: 2px 0;
							.avatar {
								vertical-align: middle;
								display: inline-block;
								margin-left:4px;
								
								img {
									display: inline-block;
									width: 28px;
									height: 28px;
									border-radius: 50%;
								}
							}
							.content {
								display: inline-block;
								margin-left: 8px;
								span {
									display: block;
									font-size: 14px;
									height: 28px;
									line-height: 28px;
									&:last-child{
										color: #444444;
									}
								}
							}
							.delete{
								float: right;
								i{
									margin-top: 1px;
									margin-right: 2px;
									cursor: pointer
								}
							}
							
						}
					}
				}
			}
		}
	}
}
.el-button.is-round{
	padding: 6px 10px;
}
.v-modal{
	display: none;
}
</style>