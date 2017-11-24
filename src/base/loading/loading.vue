<template>
	<div class="loading">
		<div class="a">
			<div><i class="el-icon-loading"></i><span>请等待片刻</span></div>
			
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
	background: rgba(0,0,0,0.5);	
	z-index: 10;
	cursor: default;
	.a{
		width: 200px;
		height: 100px;
		background: #FFFFFF;
		border-radius: 10px;
		margin: 100px auto;
		>div{
			position: relative;
			top: 40px;
			text-align: center;
			span{
				margin-left: 10px;
			}
		}
		
	}
}
</style>