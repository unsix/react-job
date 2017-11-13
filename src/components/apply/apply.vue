<template>
	<div class="apply">
		<div class="apply_left_wrapper">
			<div class="apply_left">
				<div class="info_wrapper">
					<a class="info">
						<img :src="user.avatar" alt="" />
						<span>{{user.name}}</span>
					</a>
				</div>
				<div class="apply_apps">
					<ul>
						<li>
							<router-link to="mineApp">
								<div>
									我的应用
								</div>
							</router-link>
						</li>
						
						<li>
							<router-link to="allApp">
								<div>
									应用广场
								</div>
							</router-link>
						</li>
						<i class="line"></i>
						<li>
							<router-link to="serviceApp">
								<div>
									服务号首页
								</div>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="apply_right_wrapper">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
	export default{
		computed:{
			...mapGetters([
		        'user'
		      ])
		},
		created(){
//			console.log(this.user)
		}
	}	
</script>

<style lang="scss">
	.apply{
		width: 1160px;
	    margin: 16px auto;
	    .apply_left_wrapper{
	    	float: left;
	    	width: 230px;
	    	height: 500px;
	    	background: #FFFFFF;
	    	.apply_left{
	    		.apply_apps{
	    			padding-bottom: 30px;
    				padding-top: 10px;	
    				ul{
    					i{
    						margin: 10px 20px;
							height: 1px;
							background-color: #eee;
							display: block;
    					}
    					li{
    						height: 40px;
						    line-height: 40px;
						    font-size: 14px;
    						a{
    							display: block;
    							padding-left: 20px;
    							color:#666666;
    							&:hover{
    								color:#fc923f;
    							}
    						}
    					}
    				}
	    		}
 

	    		.info_wrapper{
			    	padding: 21px 24px;
	    			border-bottom: 1px solid #EEE;
			    	.info{
			    		img{
			    			width: 55px;
						    height: 55px;
						    margin-right: 20px;
						    float: left;
						    -moz-border-radius:5px;
						    -webkit-border-radius: 5px;
						    border-radius: 5px;
			    		}
			    		span{
			    			display: inline-block;
						    font-size: 16px;
						    color: #333;
						    height: 55px;
						    line-height: 55px;
						    width: 105px;
						    overflow: hidden;
						    text-overflow: ellipsis;
						    white-space: nowrap;
						    vertical-align: middle;
			    		}
			    	}
		   		}
	    	}
	    	
	    }
	    .apply_right_wrapper{
	    	float: right;
	    	width: 864px;
	    	height: 500px;
	    	background: red;
	    	padding: 16px 25px;
	    	margin-left: 16px;
	    }
	}
</style>