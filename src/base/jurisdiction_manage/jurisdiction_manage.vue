<template>
	<div class="jurisdictionManage_wrapper">
		<div class="jurisdictionManage">
			<!--<div class="title">
				<span>权限管理</span><span v-show="typeInfo"> - </span><span class="typeInfo">{{typeInfo}}</span>
				<i class="close el-icon-close" @click="close"></i>
			</div>-->
			<div class="nav">
				<ul>
					<li v-for="(item,index) in typeList" @click="chooseType(item,index)">{{item}}</li>
				</ul>
			</div>
			<div class="wrapper">

				<!--<transition name="sildeThree">-->
					<div class="setFormRePer" v-show="setFormRePerShow">
						<!--<div class="return">
							<i class="el-icon-d-arrow-left" @click="returnList"></i>
						</div>-->
						<div class="type">
							<div class="sec" v-for="(item,index) in setFormRe">
								<div class="secHead">
									<span class="headerName">{{item.name}}</span>
									 <el-button type="primary" round @click="perShow(index)">编辑</el-button>
								</div>
									<personList :infoList="infoList" :personShow="personShow" @close="closePersonList" @choosePerson="choosePerson"></personList>
								<ul class="secUl">
									<li v-for="(group,gindex) in item.groups">
										<div class="avatar">
											<img :src="group.avatar" alt="" />
										</div>
										<div class="content">
											<span class="name">{{group.name}}</span>
											<span class="phone" v-show="group.phone">{{group.phone}}</span>
											<span class="depart" v-show="group.department_name">{{group.department_name}}</span>
										</div>
										<div class="delete">
											<i class="el-icon-circle-close-outline" @click="deleted(gindex,index)"></i>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				<!--</transition>-->
					<jurisdictionItem 
						v-show="jurisdictionItemShow"
						:formType="formType"
						@return="returnJur"
						:jurisdictionFormList="jurisdictionFormList"></jurisdictionItem>
			</div>
		</div>
		
	</div>
</template>

<script>
import {createPersonInfo} from 'common/js/person_info'
import personList from '@/base/person_list/person_list'
import jurisdictionItem from '@/base/jurisdiction_manage/jurisdiction_item'
	export default{
		data(){
			return{
				typeInfo:'',
				typeList:['设置表单回执人员','合同评审表','请购单','请款单','印章申请','呈批件'],
				setFormRe:[
					{
						name:'合同评审人',
						groups:[]
					},
					{
						name:'请购单',
						groups:[]
					},
					{
						name:'请款单',
						groups:[]
					},
				],	
			    value6: '',
				setFormRePerShow:false,
				listShow:true,
				personShow:false,
				formRePersonIndex:-1,
				jurisdictionFormList:[],
				contractApproval:[],
				jurisdictionItemShow:false,
				infoList:[],
				formType:-1
				
			}
		},
		created(){
			this._getCompanyPersonInfo()
		},
		methods:{
			handleClose(){
				
			},
			close(){
				this.$emit('close')
			},
			returnList(){
				this.setFormRePerShow = false
				this.listShow=true
				this.personShow=false
			},
			returnJur(){
				this.typeInfo=''
				this.jurisdictionItemShow=false
			},
			chooseType(item,index){
				this.typeInfo=item
				if(index===0){
					this.setFormRePerShow=true
					this.jurisdictionItemShow = false
				}else{
					this.setFormRePerShow=false
					this.jurisdictionItemShow = true
					this._getApproval()
				}
				switch (index)
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
				case 3:
					this.formType=5
					break;
				case 3:
					this.formType=6
					break;
				}
			},
			choosePerson(item,index){
				if(this.setFormRe[this.formRePersonIndex].groups.indexOf(item) != -1){
					return
				}
				this.setFormRe[this.formRePersonIndex].groups.push(item)
			},
			perShow(index){
				
				this.formRePersonIndex=index
				this.personShow=true

			},
			closePersonList(){
				this.personShow=false
			},
			
			deleted(gindex,index){
				this.setFormRe[index].groups.splice(gindex,1)
			},
//			表单绘制人员联系表
			_getCompanyPersonInfo(){
				let ret=[]
				let param = new URLSearchParams();
			    param.append("company_id","131");
			    this.$http.post("/index/Mobile/user/get_company_personnel",param)
			    .then((res)=>{
					res.data.data.forEach((item)=>{
						ret.push(createPersonInfo(item))
					})
					this.infoList = ret
			    })
			},
			_getApproval(){
				let param = new URLSearchParams();
			    param.append("company_id","135");
			    this.$http.post("/index/Mobile/approval/approval_list",param)
			    .then((res)=>{
					res.data.data.approval.forEach((item)=>{
						if(item.type===this.formType){
							if(item.list.length!=0){
								this.jurisdictionFormList.push(item.list)
							}
						}
						
					})
			    })
			}
		},
		components:{
			personList,
			jurisdictionItem
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
		/*.title{
			background: #FFFFFF;
			padding: 0 10px;
			border-bottom: 1px solid #9293A7;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
			span{
				color: #2D2F33;
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
		}*/
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
					    font-weight: 700;
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
				margin-top: 10px;
				.sec{
					.person{
						top: 10px;
						right: 20px;
					}
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
						li{
							width:300px;
							margin: 2px 0;
							.avatar {
								display: inline-block;
								margin-top: 2px;
								img {
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
									font-size: 12px;
									height: 16px;
									line-height: 16px;
									&:last-child{
										color: #5e8579;
									}
								}
							}
							.delete{
								float: right;
								i{
									margin-top: 10px;
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