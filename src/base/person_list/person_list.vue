<template>
	<transition name="slideOne">
		<div class="person" v-show="personShow" ref="person">
			<div class="close" >
				<i class="el-icon-error" @click="closePersonList"></i>
			</div>
			<div class="personList" id="person">
				<ul>
					<li v-for="(item,index) in infoList" @click="choosePerson(item,index)">
						<div class="avatar">
							<img :src="item.avatar" alt="" />
						</div>
						<div class="content">
							<span class="name">{{item.name}}</span>
							<span class="phone" v-show="item.phone">{{item.phone}}</span>
							<span class="depart" v-show="item.department_name">{{item.department_name}}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</transition>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return{
				choosePersonList:[]
			}
		},
		props:{
			infoList: {
		        type: Array
	        },
	        personShow:{
	       		type:Boolean,
	       		dafault:false
	        }
		},
		methods: {
			choosePerson(item, index) {
				this.choosePersonList.push(item)
				this.setChoosePersonList(this.choosePersonList)
				this.$emit('choosePerson',item,index)
			},
			closePersonList() {
				this.$emit('close')
			},
			...mapMutations({
		    	setChoosePersonList: 'SET_CHOOSE_PERSON_LIST'					  
		    }),
		}

	};
</script>

<style lang="scss">
.slideOne-enter-active, .slideOne-leave-active{
  	transition: all .8s
}
.slideOne-enter, .slideOne-leave-to{
  	 transform: translate3d(200px,-300px, 0)
}
	.person {
		position: absolute;
		right: -160px;
		top: 0;
		z-index: 10;
		width: 150px;
		height: 230px;
		background: #F2F2F2;
		border: 1px solid #999999;
		.close {
			display: block;
			color: #999999;
			i{
				float: right;
				margin-top: 2px;
			}
			&:hover {
				color: #FA5555;
			}
		}
		.personList {
			width: 150px;
			height: 210px;
			background: #F2F2F2;
			overflow-y: scroll;
			-webkit-border-radius: 4px;
			-moz-border-radius: 4px;
			border-radius: 4px;
			ul {
				padding: 4px;
				li {
					width: 100%;
					height: 34px;
					cursor: default;
					border-bottom: 1px solid #999999;
					.avatar {
						display: inline-block;
						float: left;
						margin-top: 2px;
					}
					.content {
						display: inline-block;
						float: left;
						margin-left: 8px;
						span {
							display: block;
							font-size: 12px;
							height: 16px;
							line-height: 16px;
							&:last-child{
								color: #5e8579;
							}
						}
					}
					img {
						width: 28px;
						height: 28px;
						border-radius: 50%;
					}
				}
			}
		}
	}
</style>