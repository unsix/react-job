<template>
	<div class="pic" v-if="pic_show">
		<div>
			<div>
				<i class="el-icon-arrow-left" @click="left"></i>
			</div>
			<img :src="img_arr[pic_index]" alt=""/>
			<div>
				<i class="el-icon-arrow-right" @click="right"></i>
			</div>
		</div>
	</div>
</template>

<script>export default {
	props: {
		img_arr: {
			type: Array
		},
		pic_show: {
			type: Boolean,
			default: false
		},
		pic_index: {
			type: Number,
			default: 0
		}
	},
	methods: {
		left() {
			this.$emit('left')
		},
		right() {
			this.$emit('right')
		},
		pic_showImgView() {
			this.pic_show = true
		},
		hideImageView() {
			this.pic_show = false
		},
		selectImg(index) {
			this.pic_show = true
			this.imageIndex = index
		}
	}
}</script>

<style lang="scss" scoped>
.pic {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	>div{
		height: 100%;
		display: flex;
		justify-content:center;
		 align-items:center;
		>div{
			display: inline-block;
			flex: 1;
			i{
				color: #FFFFFF;
				font-size: 40px;
				float: right;
				cursor: pointer;
			}
			&:last-child{
				i{
					float: left;
				}
			}
			
		}
		img{
			flex: 1;
		}
	}
}

</style>
