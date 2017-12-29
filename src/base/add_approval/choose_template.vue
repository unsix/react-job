<template>
	<div class="choose_template">
		<div class="list">
			<ul>
				<!--<el-button type="primary" plain @click="returnForm">返回</el-button>-->
				<li v-for="(item,index) in untreated" :key="item.approval_id" ref="list" :style="{background:item.tagging}">
					<div class="edit">
						<el-button type="primary" round @click="viewInfo(item,index)">查看</el-button>
            <!--从模板选择的使用按钮-->
						<el-button type="success" round @click="useInfo(item,index)">使用</el-button>
						<div class="process">
							<span v-html="item.approval_state" style="font-weight: 700; font-size: 14px;"></span>
						</div>
					</div>
					<div class="content">
						<div class="title">
							<span>{{item.add_time}}</span>
						</div>
						<div class="type">
							<span>标题：{{item.title}}</span>
						</div>
						<div class="type">
							<span>类型：{{item.type}}</span>
						</div>
					</div>
				</li>
				<div class="page">
					<span @click="first_page">首页</span>
					<span @click="last_page" v-show="pageIndex > 1">上一页</span>
					<span @click="next_page" v-show="nextPageShow">下一页</span>
				</div>
			</ul>
		</div>
	</div>
</template>

<script>
	import { create_exam_list } from '@/common/js/approval/exam'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				untreated: [],
				pageIndex: 1,
				nextPageShow: true
			}
		},
		props: {
			approval_type: {
				type: Number
			}
		},
		methods: {
			first_page() {
				this.nextPageShow = true
				this.pageIndex = 1
				this._getExamList()
			},
			last_page() {
				this.nextPageShow = true
				--this.pageIndex
				this._getExamList()
			},
			next_page() {
				++this.pageIndex
				this._getExamList()
			},
			viewInfo(item, index) {
				this.$emit('viewInfo', item)
			},
			useInfo(item, index) {
				this.$emit('useInfo', item)
			},
			returnForm() {
				this.$emit('returnForm')
			},
			_getExamList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("type", 3);
				param.append("each", 10);
				param.append("p", this.pageIndex);
				param.append("company_id", this.nowCompanyId);
				param.append("approval_type", this.approval_type);
				this.$http.post("/index.php/Mobile/approval/see_approval_list", param)
					.then((res) => {
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_exam_list(item))
						})
						this.untreated = arr
						if(arr.length < 10) {
							this.nextPageShow = false
						}

					})
			}
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId'
			])
		},
		created() {
			this._getExamList()
		}
	}
</script>

<style lang="scss">
	.choose_template {
		>.list {
			width: 600px;
			>ul {
				padding: 4px;
				>.page {
					width: 100%;
					padding: 4px;
					text-align: center;
					span {
						cursor: pointer;
						font-size: 12px;
						&:hover {
							color: #409EFF;
						}
					}
				}
				>button {
					margin-bottom: 10px;
				}
				>li {
					display: block;
					margin-bottom: 10px;
					height: 100px;
					color: #2D2F33;
					font-size: 13px;
					oz-box-shadow: 1px 1px 2px #999999;
					-webkit-box-shadow: 1px 1px 2px #999999;
					box-shadow: 1px 1px 2px #999999;
					>.avatar {
						display: inline-block;
						vertical-align: top;
						margin: 8px 15px 0 15px;
						img {
							width: 40px;
							height: 40px;
							border-radius: 4px;
							display: block;
						}
					}
					>.edit {
						display: inline-block;
						float: right;
						margin-right: 20px;
						margin-top: 15px;
						cursor: pointer;
						.el-button.is-round {
							padding: 4px 12px;
							display: block;
							margin-bottom: 5px;
						}
						.el-button+.el-button {
							margin-left: 0;
						}
						.process {
							margin-top: 10px;
						}
					}
					.content {
						cursor: default;
						padding: 12px 10px;
						display: inline-block;
						>div {
							height: 25px;
							line-height: 25px;
						}
					}
				}
			}
		}
	}
</style>
