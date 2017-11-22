<template>
	<div class="jurisdictionManage_wrapper">
		<div class="jurisdictionManage">
			<div class="nav">
				<ul>
					<li v-for="(item,index) in typeList" :class="{'active': index == navIndex}"  @click="chooseNav(item,index)">{{item}}</li>
				</ul>
			</div>
			<div class="wrapper">
					<div class="setFormRePer" v-show="setFormRePerShow">
						<div class="type">
							<div class="sec" v-for="(item,index) in setFormRe">
								<div class="secHead">
									<span class="headerName">{{item.name}}</span>
									 <el-button type="primary" round @click="perShow(index)">编辑</el-button>
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
							<div class="person" v-show="personShow" ref="person">
								<div class="submit">
									<span @click="submit">确认修改</span>
								</div>	
								<div class="close" >
									<i class="el-icon-error" @click="closePersonList"></i>
								</div>
								<div class="personList" id="person">
									<ul>
										<div class="content">
											<li v-for="(item,index) in comPersonList" @click="choosePerson(item,index)">
					
												<div class="avatar">
													<img :src="item.avatar" alt="" />
												</div>
												<div class="content">
													<span class="name">{{item.department_name}}</span>
													<span class="name">{{item.name}}</span>	
												</div>
											</li>
										</div>
									</ul>
								</div>	
							</div>
						</div>
					</div>
					<keep-alive>
						<jurisdictionItem 
							v-show="jurisdictionItemShow"
							:formType="formType"
							@return="returnJur"
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
				typeList:['设置表单回执人员','合同评审表','请购单','请款单','印章申请','呈批件'],
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
				navIndex:-1,
				closeShow:false,
				num:0
				
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
			handleClose(){
				
			},
			close(){
				this.$emit('close')
			},
			submit(){
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
				console.log(zz,JSON.stringify(narr))
				let param = new URLSearchParams();
			    param.append("company_id",this.nowCompanyId);
			    param.append("type",zz);
			    param.append("personnel",JSON.stringify(narr));
			    param.append("uid",this.user.uid);
			    this.$http.post("/index/Mobile/user/give_finance_new",param)
			    .then((res)=>{
			    	if(res.data.code === 0){
			    		this.$message({
				          message: '修改成功',
				          type: 'success'
				        });
			    	}else{
			    		this.$message.error('修改失败');
			    	}
			    	this.personShow = false
			    })
			},
			deleted(gindex,index){
				this.setFormRe[index].groups.splice(gindex,1)
			},
			returnList(){
				this.setFormRePerShow = false
				this.listShow = true
				this.personShow = false
			},
			returnJur(){
				this.submitAddPersonShow =! this.submitAddPersonShow
			},
			chooseNav(item,index){
				
				this.navIndex=index
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
			choosePerson(item,index){
				if(this.setFormRe[this.formRePersonIndex].groups.indexOf(item) != -1){
					alert('列表中已存在')
					return
				}
				this.setFormRe[this.formRePersonIndex].groups.push(item)
			},
			perShow(index){
				this.formRePersonIndex = index
				this.personShow=true
			},
			closePersonList(){
				this.personShow=false
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
				this.submitAddPersonShow=false
				this.jurisdictionFormList=[]
				let param = new URLSearchParams();
			    param.append("company_id",this.nowCompanyId);
			    this.$http.post("/index/Mobile/approval/approval_list",param)
			    .then((res)=>{
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

<style lang="scss" scoped>
.sildeThree-enter-active, .sildeThree-leave-active{
  	transition: all .6s
}
.sildeThree-enter, .sildeThree-leave-to{
  	transform: translate3d(600px, 0px, 0)
}
.jurisdictionManage_wrapper{
	.jurisdictionManage{
		width: 560px;
		overflow: hidden;
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
					cursor:pointer; 
					&:first-child{
						flex: 0 100px;
					}
					&.active{
						background: #f9f9f9;
					    color: #333333;
					}
				}
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
					>.submit{
						display: block;
						>span{
							background: #878D99;
							color: #FFFFFF;
							cursor: pointer;
							position: absolute;
							top: -30px;
							right: 10px;
							padding: 7px 20px;
							border-radius: 4px;
							font-size: 12px;
							&:hover{
								background: #9aa0ac;
							}
						}
					}
					position: absolute;
					top: 30px;
					right: 10px;
					z-index: 10;
					width: 150px;
					height: 230px;
					background: #F2F2F2;
					border: 1px solid #999999;
					.close {
						cursor: pointer;
						display: block;
						color: #999999;
						i{
							float: right;
							margin-top: 2px;
						}
						&:hover {
							color: #FA5555;
						}
					}
					.personList {
						width: 150px;
						height: 210px;
						background: #F2F2F2;
						overflow-y: scroll;
						-webkit-border-radius: 4px;
						-moz-border-radius: 4px;
						border-radius: 4px;
						ul {
							padding: 4px;
							li {
								width: 100%;
								height: 30px;
								cursor: default;
								border-bottom: 1px solid #999999;
								.avatar {
									display: inline-block;
									float: left;
									margin-top: 2px;
									>img{
										width: 24px;
										height: 24px;
										border-radius: 50%;
									}	
								}
								.content {
									display: inline-block;
									float: left;
									margin-left: 8px;
									>span {
										display: block;
										font-size: 12px;
										height: 14px;
										line-height: 14px;
										&:first-child{
											color: #5e8579;
											font-size: 12px;
										}
									}
								}
								
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
										color: #5e8579;
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