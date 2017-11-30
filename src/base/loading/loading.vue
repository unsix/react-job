<template>
	<div class="loading">
		<div class="a">
			<div>
				<i class="el-icon-loading"></i>
				<span>拼命加载中</span>
			</div>
			
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped>
.loading{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.8);	
	z-index: 10;
	cursor: default;
	.a{
		width: 200px;
		height: 100px;
		border-radius: 10px;
		margin: 200px auto;
		>div{
			color: #409EFF;
			position: relative;
			top: 40px;
			text-align: center;
			span{
				margin-top: 10px;
				display: block;
				margin-left: 10px;
			}
		}
		
	}
}
</style>