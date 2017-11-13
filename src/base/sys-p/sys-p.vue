<template>
	<div>
		<p>
			<span class="txt">{{pStr}}</span>
			<span class="fa fa-angle-double-right"></span>
		</p>
	</div>
</template>

<script>
	export default{
		props:{
			pStr:{
		        type:String,
		        default: '查看普通审批制度'
		    }
		}
	}
</script>

<style lang="scss">
	p {
		padding-bottom: 10px;
		background-color: #F9F9F9;
		display: block;
		font-size: 12px;
		color: #999;
		text-align: right;
		cursor: default;
		.txt {
			color: #999;
			font-size: 12px;
			height: 14px;
			line-height: 14px;
			position: relative;
			display: inline-block;
			cursor: pointer;
		}
		.fa {
			margin-right: 14px;
			font-size: 14px;
			cursor: pointer;
		}
	}
</style>