<template>
	<div class="top">
		<div class="title">
			<span>杭州旭邦装饰有限公司</span>
		</div>
		<div class="nav">
			<div class="nav_main">
				<a :class="reclsOne" @click="changeType">工人</a>
				<a :class="reclsTwo" @click="changeType">工程</a>
			</div>
		</div>
		<div class="search">
			<input type="text" placeholder="搜索工人，同事等" />
			<img src="../../assets/find.svg" alt="" />
		</div>
		<div class="work">
			<div class="work_main">
				<a @click="signIn">个人中心</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				isActive:true
			}
		},
		computed:{
			reclsOne(){
				return {
			      active: this.isActive 
			    }
			},
			reclsTwo(){
				return {
			      active: !this.isActive 
			    }
			}
		},
		methods:{
			changeType(){
				this.isActive = !this.isActive
				if(this.isActive){
				this.$router.push("/worker_list");	
				}else{
					this.$router.push("/project_list");
				}
				
			},
			signIn(){
				this.$router.push('/login');
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.top{
		width: 100%;
		background: #f4f6fc;
		display: flex;
		color:#666666;
		height: 60px;
		font-size: 14px;
		text-decoration: none;
		.title{
			cursor: default;
			flex: 1;
			align-self: center;
			span{
				float: left;
				margin-left: 40px;
			}
		}
		.nav{
			flex: 0 20%;
			align-self: center;
			a{
				display: inline-block;
				border-bottom: 3px solid transparent;
				padding: 22px 10px 20px;
				color: #666666;
				cursor: pointer;
				&.active{
					border-bottom: 3px solid #fc923f;
				}
				&:hover{
					color: #FC923F;
				}
				
			}
		}
		.search{
			flex:  0 20%;
			align-self: center;
			position: relative;
			input{
				float: right;
				border: 1px solid #ccc; 
                padding: 12px 100px;
                border-radius: 3px; /*css3属性IE不支持*/
                padding-left:5px; 
                text-indent: 10px;
                outline: none;
			}
			img{
				width: 16px;
				height: 16px;
				position: absolute;
				top: 12px;
				right: 20px;
				cursor: pointer;
			}
		}
		.work{
			flex:1;
			align-self: center;
			.work_main{
				float: right;
				margin-right: 40px;
				a{
					cursor: pointer;
				}
			}
				
		}
	}
</style>