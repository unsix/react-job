<template>
	<div class="uncreated_company">
		<div class="not">
			<span>您还未创建公司</span>
		<span class="return">	<i class="el-icon-loading"></i>即将返回首页</span>
		</div>
	</div>
</template>

<script>
	export default{
		
	}
</script>

<style lang="scss">
.uncreated_company{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background:#10477d;
	z-index: 20;
	.not{
		margin-top: 100px;
		span{
			display: block;
			width: 100%;
			text-align: center;
			color: #F2F2F2;
			font-size: 40px;
			font-family: "楷体";
			&.return{
				margin-top: 10px;
				font-size: 30px;
			}
		}
	}
}
</style>