<template>
	<div class="address_book">
		<ul>
			<li>
				<div class="avatar">
					<span style="margin-left: 5px;">头像</span>
				</div>
				<div class="name">
					<span>名字</span>
				</div>
				<div class="depart">
					<span>部门</span>
				</div>
				<div class="tel">
					<span>联系方式</span>
				</div>
				<div class="operation">
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
				<div class="depart">
					<span>{{item.department_name}}</span>
				</div>
				<div class="tel">
					<span>{{item.phone}}</span>
				</div>
				<div class="operation">
					<a @click="view_info">查看</a>
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
		li{
			display: block;
			border-bottom: 1px solid #DDDDDD;
			font-size: 14px;
			&:first-child{
				border-bottom: 1px solid transparent;
			}
			>div{
				margin-top: 10px;
				height: 50px;
				line-height: 50px;
				display: inline-block;
			}
			.avatar{
				vertical-align: top;
				width: 50px;
				margin-right: 20px;
				img{
					width: 50px;
					height: 50px;
					border-radius: 50%;
				
				}
			}
			.name{
				width: 100px;
			}
			.depart{
				width: 160px;
			}
			.tel{
				width: 120px;
			}
			.operation{
				width: 50px;
				a{
					display: block;
					width: 40px;
					text-align: center;
					height: 26px;
					line-height: 26px;
					color: #67C23A;
					border: 1px solid #67C23A;
					cursor: pointer;
				}
			}
			
		}
	}
}
</style>