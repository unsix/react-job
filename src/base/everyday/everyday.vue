<template>
	<div class="everyday_wrapper">
		<div class="everyday">
			<div class="postLog">
				<!--<span class="title">发布日志</span>-->
				<div class="text">
					<div>
						<span>请填写本{{dayType}}工作总结</span>
						<textarea></textarea>
					</div>
					<div>
						<span>请填写明{{dayType}}工作计划</span>
						<textarea></textarea>
					</div>
					<div>
						<span>请填写工作心得体会</span>
						<textarea></textarea>
					</div>
				</div>
				<div class="opera">
					<i class="fa fa-picture-o"></i>
					<i class="fa fa-paperclip"></i>
				</div>
				<div class="choosePanel">
					<div class="top">
						<span v-for="(item,index) in chooseDayList" :class="{'active':currentIndex === index}" @click="chooseDay(item,index)">
							{{item}}
						</span>
					</div>
					<div class="info1" v-show="info1Show">
						<div>
							<span>时间：</span>
							<el-date-picker v-model="time1" type="date" placeholder="选择日期">
							</el-date-picker>
						</div>
						<div>
							<span>点评人：</span>
							<el-form>
								<el-select v-model="people" placeholder="选择点评人">
									<el-option :label="item.name" :value="item.name" v-for="(item,index) in comPersonList" :key="index"></el-option>
								</el-select>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<div class="info2" v-show="info2Show">
						<div>
							<span>时间：</span>
							<el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</div>
						<div>
							<span>点评人：</span>
							<el-form>
								<el-select v-model="people" placeholder="选择点评人">
									<el-option :label="item.name" :value="item.name" v-for="(item,index) in comPersonList" :key="index"></el-option>
								</el-select>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<div class="info3" v-show="info3Show">
						<div>
							<span>时间：</span>
							<el-date-picker type="month" placeholder="选择月">
							</el-date-picker>
						</div>
						<div>
							<span>点评人：</span>
							<el-form>
								<el-select v-model="people" placeholder="选择点评人">
									<el-option :label="item.name" :value="item.name" v-for="(item,index) in comPersonList" :key="index"></el-option>
								</el-select>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
				<div class="ccRange">
					<span>刘忠哲<i class="fa fa-close"></i></span>
					<div class="choose">
						<i class="fa fa-plus"></i>
						<span>选择抄送范围</span>
					</div>
				</div>
				<div class="ccForm">
					<div class="nav">
						<span class="active">同事</span>
						<span>部门</span>
					</div>
					<ul>
						<li></li>
					</ul>
				</div>
			</div>
			<div class="logList">
				<ul>
					<li v-for="(item,index) in dayList">
						<div class="info">
							<div class="avatar">
								<img :src="item.avatar" alt="" />
							</div>
							<div class="content">
								<span class="name">{{item.name}}</span>
								<span class="time">发布时间：{{item.add_time}}</span>
							</div>
							<div class="state1" v-show="item.form_type === '1'">
								<i></i>
								<span>日志</span>
							</div>
						</div>
						<div class="content">
							<div class="today">
								<p>今日工作总结</p>
								<span>
									{{item.summary_today}}
								</span>
							</div>
							<div class="tomorrow">
								<p>明日工作计划</p>
								<span>
									{{item.tomorrow_plan}}
								</span>
							</div>
							<div class="work_exp">
								<p>工作心得体会</p>
								<span>
									{{item.work_exp}}
								</span>
							</div>
						</div>
						<div class="opera">
							<div>
								<i class="fa fa-thumbs-up"></i>
							</div>
							<div>
								<a>回复</a>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { createDayList } from '@/common/js/day.js'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				pageIndex: 1,
				dayList: [],
				chooseDayList: ['日计划', '周计划', '月计划'],
				currentIndex: 0,
				people: '',
				time1: '',
				info1Show: true,
				info2Show: false,
				info3Show: false,
				dayType: '日'
			}
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId',
				'comPersonList'
			])
		},
		methods: {
			chooseDay(item, index) {
				this.currentIndex = index
				this.info1Show = false
				this.info2Show = false
				this.info3Show = false
				if(index === 0) {
					this.info1Show = true
					this.dayType = '日'
				} else if(index === 1) {
					this.info2Show = true
					this.dayType = '周'
				} else if(index === 2) {
					this.info3Show = true
					this.dayType = '月'
				}
			},
			getData() {
				setTimeout(() => {
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("each", '10');
					param.append("p", this.pageIndex);
					this.$http.post("/index/Mobile/company/publish_look_two", param)
						.then((res) => {
							console.log(res)
							res.data.data.forEach((item) => {
								this.dayList.push(createDayList(item))
							})
						})
				}, 700)
			},
			_getComPersonList() {
				let newparam = new URLSearchParams();
				newparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_company_personnel", newparam)
					.then((res) => {
						let reaDa = []
						res.data.data.forEach((item) => {
							item.avatar = 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
							reaDa.push(item)
						})
						this.setComPersonList(reaDa)

					})
			},
			...mapMutations({
				setComPersonList: 'SET_COM_PERSON_LIST'
			})
		},
		created() {
			this.getData()
			this._getComPersonList()

		}

	}
</script>

<style lang="scss">
	.everyday_wrapper {
		width: 100%;
		height: 100%;
		font-size: 14px;
		.everyday {
			min-height: 400px;
			>.postLog {
				background: #FFFFff;
				box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				padding: 10px 25px;
				>.ccForm{
					display: none;
					width: 300px;
					height: 500px;
					background: #FFFFFF;
					box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					>.nav{
						font-size: 14px;
						height: 30px;
						width: 100%;
						span{
							color: #3487E2;
							display: inline-block;
							width: 50%;
							box-sizing: border-box;
							float: left;
							text-align: center;
							line-height: 30px;
							&.active{
								background: #DDDDDD;
							}
						}
					}
				}
				>.ccRange {
					margin-top: 10px;
					border: 1px solid #DDDDDD;
					padding: 4px 7px 0;
					>.choose{
						cursor: pointer;
						font-size: 13px;
						display: inline-block;
						color: #3487E2;
						margin: 0 8px 4px 0;
					}
					>span {
						margin: 0 8px 4px 0;
						display: inline-block;
						padding: 4px 10px;
						background: #3D83E9;
						border-radius: 10px;
						color: #FFF;
						cursor: pointer;
						>i {
							margin-left: 4px;
							font-size: 14px;
							
						}
					}
				}
				>.choosePanel {
					margin-top: 20px;
					height: 150px;
					border: 1px solid #ddd;
					background: #f9f9f9;
					>.info1 {
						>div {
							padding: 10px;
							>span {
								display: inline-block;
								text-indent: 5px;
								width: 70px;
								color: #999;
								font-size: 12px;
							}
							>form {
								display: inline-block;
							}
						}
					}
					>.info2 {
						>div {
							padding: 10px;
							>span {
								display: inline-block;
								text-indent: 5px;
								width: 70px;
								color: #999;
								font-size: 12px;
							}
							>form {
								display: inline-block;
							}
						}
					}
					>.info3 {
						>div {
							padding: 10px;
							>span {
								display: inline-block;
								text-indent: 5px;
								width: 70px;
								color: #999;
								font-size: 12px;
							}
							>form {
								display: inline-block;
							}
						}
					}
					>.top {
						height: 30px;
						background: #FFFFFF;
						>span {
							cursor: pointer;
							width: 60px;
							text-align: center;
							display: inline-block;
							height: 30px;
							line-height: 30px;
							font-size: 12px;
							color: #0082CB;
							&.active {
								background: #f9f9f9;
								color: #000000;
								font-weight: 700;
							}
						}
					}
				}
				>.opera {
					text-align: left;
					height: 35px;
					padding: 0 10px;
					background: #F9F9F9;
					border: 1px solid #ddd;
					border-top: none;
					>i {
						cursor: pointer;
						font-size: 16px;
						margin-top: 10px;
						margin-left: 10px;
					}
				}
				>.title {
					font-size: 14px;
				}
				>.text {
					padding: 0 10px 46px;
					border: 1px solid #ddd;
					border-bottom: none;
					>div {
						margin-top: 8px;
						>span {
							color: #999;
							display: block;
						}
						>textarea {
							width: 500px;
							outline: none;
							min-height: 60px;
							border: none;
							resize: none;
							border-bottom: 1px dashed #ddd;
							font-size: 14px;
						}
					}
				}
			}
			>.logList {
				margin-top: 10px;
				>ul {
					>li {
						background: #FFFFFF;
						display: block;
						margin-bottom: 10px;
						color: #2D2F33;
						font-size: 13px;
						/*border: 1px solid #CCCCCC;*/
						box-shadow: 0 0 2px rgba(0, 0, 0, .2);
						-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
						>.opera {
							background-color: #f4f7fd;
							height: 46px;
							position: relative;
							line-height: 46px;
							padding-left: 500px;
							>div {
								cursor: pointer;
								padding: 0 10px;
								height: 18px;
								border-right: 1px solid #DDDDDD;
								margin-top: 14px;
								display: inline-block;
								>i {
									display: inline-block;
									font-size: 18px;
									position: relative;
									bottom: 11px;
									color: #6c7a95;
									&:hover {
										color: #FC923F;
									}
								}
								>a {
									position: relative;
									bottom: 13px;
									color: #6c7a95;
									&:hover {
										text-decoration: underline;
									}
								}
							}
						}
						>.info {
							padding: 20px 25px 0 25px;
							>.avatar {
								display: inline-block;
								vertical-align: top;
								>img {
									width: 45px;
									height: 45px;
									border-radius: 6px;
								}
							}
							>.content {
								display: inline-block;
								margin-left: 10px;
								margin-top: 2px;
								>span {
									display: block;
									line-height: 20px;
									&.name {
										font-weight: 700;
									}
									&.time {
										color: #969696;
									}
								}
							}
							>.state1 {
								float: right;
								display: inline-block;
								>i {
									display: inline-block;
									width: 8px;
									height: 8px;
									border-radius: 50%;
									background: #199475;
								}
								>span {
									font-size: 14px;
								}
							}
							>.state2 {
								float: right;
								display: inline-block;
								>i {
									display: inline-block;
									width: 8px;
									height: 8px;
									border-radius: 50%;
									background: #9DB5FB;
								}
								>span {
									font-size: 14px;
								}
							}
						}
						>.content {
							padding: 20px 25px 0 25px;
							>div {
								>p {
									line-height: 18px;
									font-size: 13px;
									color: #999;
								}
								>span {
									display: block;
									margin: 10px 0;
									color: #444444;
									line-height: 27px;
									font-size: 14px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>