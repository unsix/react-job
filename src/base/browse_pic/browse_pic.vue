<template>
	<div class="pic" v-if="pic_show">
		<div>
			<div>
				<i class="el-icon-arrow-left" @click="left"></i>
			</div>
			<transition name="slide">
				<img :src="img_arr[pic_index]" alt="" />
			</transition>
			<div>
				<i class="el-icon-arrow-right" @click="right"></i>
			</div>
		</div>
		<div class="close">
			<i class="el-icon-close" @click="close"></i>
		</div>
	</div>
</template>

<script>
export default {
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
		close(){
			this.$emit('close_pic')
		},
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
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.pic {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 10;
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
			width: 100%;
			max-width: 1000px;
			flex: 1;
		}
	}
	.close{
		position: fixed;
		display: block;
		top: 100px;
		right:100px;
		i{
			font-size: 50px;
			color: #FFFFFF;
			cursor: pointer;
			&:hover{
				color: #FA5555;
			}
		}
	}
}

</style>
