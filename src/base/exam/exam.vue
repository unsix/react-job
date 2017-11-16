<template>
	<div class="exam_wrapper">
		<div class="exam" v-show="listShow">
			<div class="nav">
				<ul>
					<li v-for="(item,index) in navList" @click="navCli(index)"  :class="{'active': index === currentIndex}">
						<span>{{item}}</span>
					</li>
				</ul>
			</div>
			<div class="list" >
				<ul>
					<li v-for="(item,index) in untreated" :key="item.approval_id">
						<div class="avatar" v-if="ilaunched">
							<img :src="item.avatar" alt="" />
						</div>
						<div class="edit">
							<span @click="listCli(item,index)">查看</span>
						</div>	
						<div class="content">
							<div class="name">
								<span>名称：{{item.name}}</span>
							</div>
							<div class="creatTime">
								<span>发起时间：{{item.add_time}}</span>
							</div>
							<div class="creatTime" v-if="handle_time_show">
								<span>处理时间：{{item.add_time}}</span>
							</div>
							<div class="type">
								<span>类型：{{item.type}}</span>
							</div>
							<div class="title">
								<span>标题：{{item.title}}</span>
							</div>
							<div class="startComP">
								<span>发起公司：{{item.company_name}}</span>
							</div>
							<div class="process" v-if="approval_process">
								<span>审批进程：审批中</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="form_wrapper" v-show="formShow">
				<div class="top">
					<i class="el-icon-d-arrow-left" @click="return_list"></i>
					<span class="title">{{now_type_name}}</span>
				</div>
				<div class="form" name="呈批件" v-if="cengpijian_show">
					<div>
						<span>呈批标题：</span><span>{{cengpijian_lista.title}}</span>
					</div>
					<div>
						<span>呈批部门：</span><span>{{cengpijian_lista.department_name}}</span>
					</div>
					<div>
						<span>文件编号：</span><span>{{cengpijian_lista.chengpi_num}}</span>
					</div>
					<div>
						<span>主题内容：</span><span>{{cengpijian_lista.content}}</span>
					</div>
					<div>
						<span>项目负责人(部门经理)：</span><span>{{cengpijian_lista.project_manager_name.name}}</span>
					</div>
					<div>
						<span>附件列表：</span>
					</div>
					<div>
						<span>图片附件：</span>
					</div>
					<div>
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list">{{item.name}}
						</span>
					</div>
					<div>
						<span>审批：</span>
					</div>
					<div class="menu">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span>同意</span>
							<span>拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<i class="el-icon-close" @click="closeMenu" ></i>
						</div>
					</div>
				</div>
				<div class="form" name="请款单" v-if="qingkuandan_show">
					<div>
						<span>工程名称：</span><span>{{cengpijian_lista.contract_name}}</span>
					</div>
					<div>
						<span>合同名称：</span><span>{{cengpijian_lista.contract_name}}</span>
					</div>
					<div>
						<span>工种：</span><span>{{cengpijian_lista.worker_type}}</span>
					</div>
					<div>
						<span>请款人姓名：</span><span>{{cengpijian_lista.request_name}}</span>
					</div>
					<div>
						<span>联系方式：</span><span>{{cengpijian_lista.phone}}</span>
					</div>
					<div>
						<span>账户名：</span><span>{{cengpijian_lista.account_name}}</span>
					</div>
					<div>
						<span>开户行：</span><span>{{cengpijian_lista.bank_address}}</span>
					</div>
					<div>
						<span>银行卡号：</span><span>{{cengpijian_lista.bank_card}}</span>
					</div>
					<div>
						<span>请款次数：</span><span>{{cengpijian_lista.request_num}}</span>
					</div>
					<div>
						<span>合同金额￥：</span><span></span>
					</div>
					<div>
						<span>增减金额￥：</span><span></span>
					</div>
					<div>
						<span>已领工程款￥：</span><span></span>
					</div>
					<div>	
						<span>本次请款￥：</span><span></span>
					</div>
					<div>
						<span>合同执行进度：</span><span></span>
					</div>
					<div>
						<span>请款内容：</span><span>{{cengpijian_lista.request_content}}</span>
					</div>
					<div>
						<span>项目负责人(部门经理)：</span><span>{{cengpijian_lista.project_manager_name.name}}</span>
					</div>
					<div>
						<span>发起人：</span><span>{{form_Listb.found_name}}</span>
					</div>
					<div>
						<span>审批人员：</span><span v-for="item in form_Listb.list">{{item}}</span>
					</div>
					<div>
						<span>审批：</span>
						<span v-for="item in form_Listb.content">
						{{item.department_name}}	{{item.name}} 	<a>{{item.is_agree}}</a>
						</span>
					</div>
					<div class="menu">
						<span @click="handle">处理</span>
						<div class="button" v-show="menuShow">
							<span>同意</span>
							<span>拒绝</span>
							<input type="text" v-model="handle_txt" placeholder="请输入回复内容"/>
							<i class="el-icon-close" @click="closeMenu"></i>
						</div>
					</div>
				</div>
		</div>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import {create_exam_list} from '@/common/js/exam'
import {create_approval_list} from '@/common/js/approval_list'
export default{
	data(){
		return{
			currentIndex:0,
			navList:['未处理','已处理','我发起的'],
			untreated:[],
			now_type_name:'',
			handle_txt:'',
			nowType:1,
			listShow:true,
			formShow:false,
			qingkuandan_show:false,
			cengpijian_show:false,
			cengpijian_lista:[],
			form_Listb:[],
			menuShow:false,
			ilaunched:true,
			handle_time_show:false,
			approval_process:false,
			handle_txt:''
		}
	},
	computed:{
		...mapGetters([
			'user',
			'nowCompanyId'
		])
	},
	created(){
		this._getExamList()
	},
	methods:{
		return_list(){
			this.formShow=false
			this.listShow=true
			this.menuShow=false
			this.qingkuandan_show=false
			this.cengpijian_show=false
		},
		listCli(item){
			this.listShow = false
			this.formShow = true
			this.now_type_name=item.type
			if(item.type === '呈批件'){
				this.cengpijian_show=true
			}else if(item.type === '请款单'){
				this.qingkuandan_show=true
			}
			let param = new URLSearchParams();
			param.append("uid",this.user.uid);
			param.append("approval_id",item.approval_id);
			this.$http.post("/index/Mobile/approval/approval_process_show",param)
			.then((res)=>{
				console.log(res)
				res.data.data.project_manager_name.forEach((list)=>{
					list.project_manager_name.name
				})
				this.cengpijian_lista = res.data.data
			})
			let nparam = new URLSearchParams();
			nparam.append("uid",this.user.uid);
			nparam.append("approval_id",item.approval_id);
			nparam.append("company_id",this.nowCompanyId);
			this.$http.post("/index/Mobile/approval/approval_process_personnel",nparam)
			.then((res)=>{	
				this.form_Listb=create_approval_list(res.data.data)
			})
		},
		navCli(index){
			this.nowType = index+1
			if(index===0) {
				this.handle_time_show=false 
				this.approval_process=false 
				this.ilaunched=true
			}
			if(index===1) {
				this.handle_time_show=true
				this.approval_process=true
				this.ilaunched=true
			}
			if(index===2) {
				this.handle_time_show=false
				this.approval_process=true
				this.ilaunched=false
			}
			this.currentIndex = index
			this._getExamList()
		},
		handle(){
			this.menuShow=true
		},
		closeMenu(){
			this.menuShow=false
		},
		_getExamList(){
			let param = new URLSearchParams();
			param.append("uid",this.user.uid);
			param.append("type",this.nowType);
			param.append("company_id",this.nowCompanyId);
			this.$http.post("/index/Mobile/approval/see_approval_list",param)
			.then((res)=>{
				let arr=[]
				res.data.data.forEach((item)=>{
					arr.push(create_exam_list(item))
				})
				this.untreated=arr
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.exam_wrapper{
	width: 100%;
	height: 100%;
	.form_wrapper{
		width: 556px;
		overflow: hidden;
		.top{
			width: 100%;
			display: block;
			position: relative;
			>i{
				position: absolute;
				top: 10px;
				left: 10px;
				cursor: pointer;
			}
			.title{
				display: block;
				text-align: center;
				height: 30px;
				line-height: 30px;
			}
		}
		.form{
			padding: 10px;
			>div{
				display: block;
				border-bottom: 1px solid #DDDDDD;
				span{
					font-size: 14px;
					line-height: 24px;
					&:nth-child(2){
						color: #409EFF;
					}
				}
			}
			.menu{
				margin-top: 10px;
				border-bottom: none;
				span{
					display: inline-block;
					padding: 2px 10px;
					border: 1px solid #3487E2;
					border-radius: 4px;
					cursor: pointer;
				}
				.button{
					margin-left: 20px;
					display: inline-block;
					span{
						color: #FA5555;
						border: 1px solid #FA5555;
						margin-left:4px; 
						&:first-child{
							color:#67C23A;
							border: 1px solid #67C23A;
						}
						
					}
					input{
						margin-left: 4px;
						height: 22px;
						outline: none;
						border: 1px solid #3487E2;
						border-radius: 4px;
						text-indent: 4px;
					}
					i{
						padding: 4px;
						cursor: pointer;
					};
				}
			}
		}
	}
	.exam{
		width: 560px;
		overflow: hidden;
		.list{
			width: 100%;
			ul{
				padding: 4px;
				li{
					color: #2D2F33;
					font-size: 14px;
					
					border-bottom: 1px solid #3487E2;
					span{
						line-height: 18px;
					}
					.avatar{
						display: inline-block;
						vertical-align: top;
						margin-top: 4px;
						img{
							width: 30px;
							height: 30px;
							border-radius: 50%;
							display: block;
						}
					}

					.edit{
						display: inline-block;
						float: right;
						margin-right: 20px;
						margin-top:30px;
						cursor: pointer;
						span{
							font-size: 14px;
							border: 1px solid #3487E2;
							padding: 4px 10px;
						}
					}
					.content{
						padding: 4px 0;
						display: inline-block;
						/*margin-left: 38px;*/
					}
				}
			}
		}
		.nav{
			width: 100%;
			height: 30px;
			ul{
				display:flex;
				li{
					line-height: 30px;
					flex: 1;
					text-align: center;
					cursor: pointer;
					&.active{
						background: #DDDDDD;
					}
					span{
						font-size: 12px;
					}
				}	
			}
		}

	}
}

</style>