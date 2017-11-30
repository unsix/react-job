<template>
	<div class="address_book">
		<ul>
			<li>
				<div class="avatar lzz" >
					<span style="margin-left: 5px;">头像</span>
				</div>
				<div class="name lzz">
					<span>名字</span>
				</div>

				<div class="tel lzz">
					<span>联系方式</span>
				</div>
				<div class="operation lzz">
					<span>操作</span>
				</div>
			</li>
			<li v-for="item in comPersonList">
				<div class="avatar">
					<img :src="item.avatar" alt="" />
				</div>
				<div class="name">
					<span>{{item.name}}</span>
				</div>
				<div class="tel">
					<span>{{item.phone}}</span>
				</div>
				<div class="operation">
					 <el-button type="primary" round>查看</el-button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {}
		},
		computed: {
			...mapGetters([
				'comPersonList'
			])
		},
		methods: {
			view_info() {
				this.$message({
					message: '暂时还不能查看',
					type: 'warning'
				});
			}
		},
		created() {
		}
	}
</script>

<style lang="scss" scoped="scoped">
.address_book{
	>ul{
		padding: 10px;
		>li{
			cursor: default;
			display: block;
			border-bottom: 1px solid #DDDDDD;
			font-size: 14px;
			transition:.3s; 
			>.lzz{
				font-weight: 700;
				font-size: 15px;
				text-indent: 2px;
			}
			&:first-child{
				border-bottom: 1px solid transparent;
				&:hover{
					background: none;
				}
			}
			&:nth-child(even)
			{
				background:rgb(245,247,250);
			}
			&:hover{
				background: #EEEEEE;
			}
			>div{
				margin-top: 10px;
				height: 40px;
				line-height: 40px;
				display: inline-block;
			}
			.avatar{
				vertical-align: top;
				width: 90px;
				margin-right: 20px;
				margin-left: 4px;
				img{
					width: 40px;
					height: 40px;
					border-radius: 50%;
				
				}
			}
			.name{
				width: 130px;
			}
			.tel{
				width: 190px;
			}
			.operation{
				width: 80px;
				button{
					display: block;
				}
			}
			
		}
	}
}
</style>