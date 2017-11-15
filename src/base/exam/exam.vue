<template>
	<div class="exam_wrapper">
		<div class="exam">
			<div class="nav">
				<ul>
					<li v-for="(item,index) in navList" @click="navCli(index)"  :class="{'active': index === currentIndex}">
						<span>{{item}}</span>
					</li>
				</ul>
			</div>
			<div class="list">
				<ul>
					<li>
						<div class="avatar">
							<img src="" alt="" />
						</div>
						<div class="info">
							<div class="name">
								<span>姓名：SuperMan</span>
							</div>
							<div class="creatTime">
								<span>时间：2017-09-30 14:47:28</span>
							</div>
						</div>
						<div class="content">
							<div class="type">
								<span>类型：type</span>
							</div>
							<div class="title">
								<span>标题：测试标题</span>
							</div>
							<div class="startComP">
								<span>发起公司：我的公司</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import {exam} from '@/base/exam/exam'
export default{
	data(){
		return{
			currentIndex:0,
			navList:['已处理','未处理','我发起的'],
			untreated:[]
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
		navCli(index){
			this.currentIndex = index
		},
		_getExamList(){
			let param = new URLSearchParams();
			param.append("uid",this.user.uid);
			param.append("type",1);
			param.append("company_id",this.nowCompanyId);
			this.$http.post("/index/Mobile/approval/see_approval_list",param)
			.then((res)=>{
				console.log(res)
			})
		}
	}
}
</script>

<style lang="scss" scoped>

.exam_wrapper{
	.exam{
		width: 560px;
		overflow: hidden;
		.list{
			width: 100%;
			ul{
				li{
					font-size: 14px;
					span{
						line-height: 15px;
					}
					.avatar{
						display: inline-block;
						img{
							width: 30px;
							height: 30px;
							border-radius: 50%;
							display: block;
						}
					}
					.info{
						display: inline-block;
						.name{
							display: block;
						}
						.creatTime{
							display: block;
						}
					}
					.content{
						display: block;
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