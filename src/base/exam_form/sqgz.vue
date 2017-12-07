<template>
	<div class="form" name="申请公章">
		<div class="top">
			<el-button type="primary" plain @click="return_">返回列表</el-button>
			<span class="title">申请公章</span>
		</div>
		<div>
			<span>用章部门：</span><span>{{form_Lista.department_name}}</span>
		</div>
		<div>
			<span>申请人：</span><span>{{form_Lista.user_name}}</span>
		</div>
		<div>
			<span>项目负责人(部门经理)：</span><span>{{form_Lista.project_manager_name}}</span>
		</div>
		<div v-for="item in form_Lista.info" class="qingdan">
			<h4>申请清单</h4>
			<p>印章类别:<span>{{item.seal_type}}</span></p>
			<p>盖章事由:<span>{{item.reason}}</span></p>
			<p>资料名称:<span>{{item.contract_name}}</span></p>
			<p>公司名称:<span>{{item.name_company}}</span></p>
			<p>数量:<span>{{item.num}}</span></p>
			<p>备注:<span>{{item.remarks}}</span></p>
		</div>
		<div>
			<span>附件列表：</span>
			<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
		</div>
		<div>
			<span>图片附件：</span>
			<a v-for="item in form_Lista.img_list" v-if="form_Lista.img_list">
				<img :src="item" alt="" @click="ctrl_pic_show" />
			</a>
		</div>
		<div>
			<span>发起人：</span><span>{{form_Listb.found_name}}</span>
		</div>
		<div>
			<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;">{{item}}
						</span>
		</div>
		<div>
			<span>审批：</span>
			<div v-for="item in form_Listb.content">
				<div class="exam_info">
					<div class="avatar lzz">
						<span style="margin-left: 5px;">状态</span>
					</div>
					<div class="tel lzz">
						<span>姓名</span>
					</div>
					<div class="name lzz">
						<span>部门</span>
					</div>
					<div class="operation lzz">
						<span>时间</span>
					</div>
				</div>
				<div class="exam_info">
					<div class="avatar">
						<span>{{item.is_agree}}</span>
					</div>
					<div class="name">
						<span>{{item.name}}</span>
					</div>
					<div class="tel">
						<span>{{item.department_name}}</span>
					</div>
					<div class="operation">
						<span>{{item.add_time}}</span>
					</div>
				</div>
				<div>
					<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
				</div>
			</div>
		</div>
		<div class="menu" v-show="handle_show">
			<el-button type="primary" plain @click="handle">处理</el-button>
			<div class="button" v-show="menuShow">
				<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
				<input name="token" type="hidden" :value="input_value">
				<input type="file" @change="getPic($event)" multiple="multiple" accept="image/png,image/jpeg" />
				<el-button type="primary" round @click="agree($event)">同意</el-button>
				<el-button type="danger" round @click="refuse">拒绝</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import browsePic from '@/base/browse_pic/browse_pic'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				menuShow: false,
				handle_txt: '',
				pic_index: 0,
				pic_show: false,
				loading_show: false,
				input_value: '',
				pic_hash: '',
				now_personnel_id: 0,
				pic_hash_arr: [],
				img_arr: []
			}
		},
		props: {
			form_Lista: {
				type: Object
			},
			form_Listb: {
				type: Object
			},
			handle_show: {
				type: Boolean
			},
			psb_approval_id: {
				type: String
			},
			file_arr: {
				type: Array
			},
			file_arr: {
				type: Array
			}
		},
		computed: {
			...mapGetters([
				'user',
				'nowCompanyId'
			])
		},
		methods: {
			return_() {
				this.$emit('return_psb')
				this.handle_txt === ''
			},
			close_pic() {
				this.pic_show = false
			},
			last_one() {
				if(this.pic_index === 0) {
					return
				}
				--this.pic_index
			},
			next_one() {
				if(this.pic_index === this.img_arr.length - 1) {
					return
				}
				++this.pic_index
			},
			rec_pic(item, index) {
				this.img_arr = item
				this.pic_index = index
				this.pic_show = true
			},
			cl_pic(item, index) {
				this.img_arr = item.picture
				this.pic_index = index
				this.pic_show = true
			},
			ctrl_pic_show(item, index) {
				this.img_arr = item
				this.pic_index = index
				this.pic_show = true
			},
			handle() {
				this.menuShow = true
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index/Mobile/path/get_token", param)
					.then((res) => {
						this.input_value = res.data.data
					})
			},
			closeMenu() {
				this.menuShow = false
			},
			getFile(event) {
				this.file = event.target.files;
			},
			agree() {
				if(this.handle_txt === '') {
					this.$message.error('请填写回执内容');
					return
				}
				if(!this.file) {
					this.$message.error('确认回执必须上传图片');
					return
				}
				if(this.file) {
					if(this.file.length === 0) {
						this.$message.error('确认回执必须上传图片');
						return
					}
					for(let i = 0; i < this.file.length; i++) {
						let formData = new FormData();
						formData.append('file', this.file[i]);
						formData.append('token', this.input_value);
						let config = {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}
						this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							this.pic_hash_arr.push(res.data.hash)
						})
					}
					if(this.pic_hash_arr.length === this.file.length) {
						this.loading_show = true
						let mparam = new URLSearchParams();
						mparam.append("uid", this.user.uid);
						mparam.append("company_id", this.nowCompanyId);
						this.$http.post("/index/Mobile/User/return_company_new", mparam)
							.then((res) => {
								this.now_personnel_id = res.data.data.personnel_id
								if(this.now_personnel_id === res.data.data.personnel_id) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											let param = new URLSearchParams();
											param.append("uid", this.user.uid);
											param.append("approval_id", this.psb_approval_id);
											param.append("personnel_id", this.now_personnel_id);
											param.append("company_id", this.nowCompanyId);
											param.append("finance_state", 1);
											param.append("receipt_content", '111');
											param.append("receipt_pic", res.data.data.enclosure_id);
											this.$http.post("/index/Mobile/find/finance_receipt", param)
												.then((res) => {
													this.loading_show = false
													if(res.data.code === 0) {
														this.$message({
															message: '恭喜你，操作成功',
															type: 'success'
														});
														this.return_()
													} else {
														this.$message.error('操作失败');
													}
												})
										})
								}
							})
					}
				}
			},

			refuse() {
				if(this.handle_txt === '') {
					this.$message.error('请填写回执内容');
					return
				}
				if(!this.file) {
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("approval_id", this.psb_approval_id);
					param.append("personnel_id", this.now_personnel_id);
					param.append("company_id", this.nowCompanyId);
					param.append("finance_state", 1);
					param.append("receipt_content", this.handle_txt);
					this.$http.post("/index/Mobile/find/finance_receipt", param)
						.then((res) => {
							this.loading_show = false
							if(res.data.code === 0) {
								this.$message({
									message: '恭喜你，操作成功',
									type: 'success'
								});
								this.return_()
							} else {
								this.$message.error('操作失败');
							}
						})
				}
				if(this.file) {
					for(let i = 0; i < this.file.length; i++) {
						let formData = new FormData();
						formData.append('file', this.file[i]);
						formData.append('token', this.input_value);
						let config = {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}
						this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
							this.pic_hash_arr.push(res.data.hash)
						})
					}
					if(this.pic_hash_arr.length === this.file.length) {
						this.loading_show = true
						let mparam = new URLSearchParams();
						mparam.append("uid", this.user.uid);
						mparam.append("company_id", this.nowCompanyId);
						this.$http.post("/index/Mobile/User/return_company_new", mparam)
							.then((res) => {
								this.now_personnel_id = res.data.data.personnel_id
								if(this.now_personnel_id === res.data.data.personnel_id) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											let param = new URLSearchParams();
											param.append("uid", this.user.uid);
											param.append("approval_id", this.psb_approval_id);
											param.append("personnel_id", this.now_personnel_id);
											param.append("company_id", this.nowCompanyId);
											param.append("finance_state", 1);
											param.append("receipt_content", '111');
											param.append("receipt_pic", res.data.data.enclosure_id);
											this.$http.post("/index/Mobile/find/finance_receipt", param)
												.then((res) => {
													this.loading_show = false
													if(res.data.code === 0) {
														this.$message({
															message: '恭喜你，操作成功',
															type: 'success'
														});
														this.return_()
													} else {
														this.$message.error('操作失败');
													}
												})
										})
								}
							})
					}
				}
			}
		},
		components: {
			browsePic,
			loading
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.form {
		background: #FFFFFF;
		padding: 10px;
		color: #999999;
		>.top {
			width: 100%;
			display: block;
			button {
				margin-left: 10px;
				margin-top: 10px;
				display: inline-block;
			}
			.title {
				font-size: 16px;
				width: 100%;
				display: inline-block;
				text-align: center;
				height: 30px;
				line-height: 30px;
			}
		}
		.exam_info {
			cursor: default;
			display: block;
			border-bottom: 1px solid #DDDDDD;
			font-size: 14px;
			transition: .3s;
			margin-bottom: 4px;
			>.lzz {
				font-weight: 700;
				font-size: 15px;
				text-indent: 2px;
			}
			&:first-child {
				border-bottom: 1px solid transparent;
				&:hover {
					background: none;
				}
			}
			&:nth-child(even) {
				background: rgb(245, 247, 250);
			}
			&:hover {
				background: #EEEEEE;
			}
			>div {
				height: 40px;
				line-height: 40px;
				display: inline-block;
			}
			.avatar {
				vertical-align: top;
				width: 70px;
			}
			.name {
				width: 100px;
			}
			.tel {
				width: 100px;
			}
			.operation {
				width: 200px;
				button {
					display: block;
				}
			}
		}
		>div {
			display: block;
			border-bottom: 1px solid #DDDDDD;
			>span {
				vertical-align: top;
				font-size: 14px;
				line-height: 24px;
				&:nth-child(2) {
					margin-left: 5px;
					color: #444444;
				}
			}
			.approval {
				display: inline-block;
				span {
					font-size: 14px;
					line-height: 24px;
				}
			}
			img {
				margin-right: 10px;
				display: inline-block;
				width: 80px;
				cursor: pointer;
			}
		}
		.file {
			font-size: 14px;
			margin: 4px auto;
			display: block;
			height: 24px;
			width: 80%;
			line-height: 24px;
			color: #5A5E66;
			border: 1px solid #F9F9F9;
			border-radius: 4px;
			background: #DDDDDD;
			text-align: center;
		}
		.qingdan {
			font-size: 14px;
			padding: 4px 0;
			h4 {
				color: #409EFF;
				font-size: 15px;
				margin: 2px 0px;
			}
			p {
				height: 30px;
				line-height: 30px;
				span {
					margin-left: 5px;
					color: #444444;
				}
			}
		}
		.qingdan_qinggou {
			font-size: 14px;
			padding: 4px 0;
			h4 {
				color: #409EFF;
				font-size: 15px;
				margin: 2px 0px;
			}
			p {
				display: inline-block;
				min-width: 180px;
				height: 30px;
				line-height: 30px;
				span {
					margin-left: 5px;
					color: #444444;
				}
			}
		}
		.menu {
			margin-top: 10px;
			border-bottom: none;
			>button {
				display: block;
			}
			.button {
				margin-top: 10px;
				margin-left: 120px;
				display: block;
				font-size: 0;
				z-index: 2;
				width: 300px;
				input[type="file"] {
					margin: 10px 0 10px 0px;
				}
				>button {
					margin-left: 50px;
				}
			}
		}
	}
</style>