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
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			currentIndex:0,
			navList:['已处理','未处理','我发起的']
		}
	},
	methods:{
		navCli(index){
			this.currentIndex = index
		}
	}
}
</script>

<style lang="scss" scoped>

.exam_wrapper{
	.exam{
		width: 560px;
		overflow: hidden;
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