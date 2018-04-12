<template>
	<div class="pic">
		<div>
			<div>
				<i class="el-icon-arrow-left" @click="left"></i>
			</div>
				<li v-for="(item,index) in img_arr" v-show="index == pic_index">
          <img :src="item"  alt="" />
        </li>
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
	data(){
		return{
			imgArr:[]
		}
	},
	props: {
		img_arr: {
			type: Array
		},
		pic_index: {
			type: Number,
			default: 0
		}
	},
	methods: {
		close(){
			this.$parent.pic_show = false
      this.img_arr.splice(0,this.img_arr.length)
		},
		left() {
      if(this.pic_index === 0) {
        return
      }
      --this.pic_index
		},
		right() {
      if(this.pic_index === this.img_arr.length - 1) {
        return
      }
      ++this.pic_index
		},
	}
}</script>

<style lang="scss" scoped>
  *{
    list-style: none;
  }
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.pic {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	min-height: 100%;
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
