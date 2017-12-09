<template>
	<div class="form" name="合同评审表">
		<div class="top">
			<el-button type="primary" plain @click="return_">返回列表</el-button>
			<span class="title">合同评审表</span>
		</div>
		<div v-if="form_Lista.contract_name">
			<span>工程名称：</span><span>{{form_Lista.contract_name}}</span>
		</div>
		<div v-if="form_Lista.contract_name_new">
			<span>合同名称：</span><span>{{form_Lista.contract_name_new}}</span>
		</div>
		<div v-if="form_Lista.contract_id">
			<span>合同编号：</span><span>{{form_Lista.contract_id}}</span>
		</div>
		<div v-if="form_Lista.a_name">
			<span>甲方：</span><span>{{form_Lista.a_name}}</span>
		</div>
		<div v-if="form_Lista.b_name">
			<span>乙方：</span><span>{{form_Lista.b_name}}</span>
		</div>
		<div v-if="form_Lista.executor">
			<span>执行人：</span><span>{{form_Lista.executor}}</span>
		</div>
		<div v-if="form_Lista.project_manager_name">
			<span>项目负责人(项目经理)：</span><span>{{form_Lista.project_manager_name}}</span>
		</div>
		<div v-if="form_Lista.prive">
			<span>单价：</span><span>{{form_Lista.prive}}</span>
		</div>
		<div v-if="form_Lista.total_prive">
			<span>总价：</span><span>{{form_Lista.total_prive}}</span>
		</div>
		<div v-if="form_Lista.difference">
			<span>与投标价格差异：</span><span>{{form_Lista.difference}}</span>
		</div>
		<div v-if="form_Lista.pay_method">
			<span>付款方式：</span><span>{{form_Lista.pay_method}}</span>
		</div>
		<div v-if="form_Lista.arrive_time">
			<span>到货时间：</span><span>{{form_Lista.arrive_time}}</span>
		</div>
		<div v-if="form_Lista.arrive_time">
			<span>完工时间：</span><span>{{form_Lista.arrive_time}}</span>
		</div>
		<div v-if="form_Lista.remarks">
			<span>合同主要内容：</span><span>{{form_Lista.remarks}}</span>
		</div>
		<div>
			<span>附件列表：</span>
			<a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
		</div>
		<div v-if="form_Lista.img_list">
			<span>图片附件：</span>
			<a v-for="(item,index) in form_Lista.img_list" v-if="form_Lista.img_list">
				<img :src="item" alt="" @click="ctrl_pic_show(form_Lista.img_list,index)" />
			</a>
		</div>
		<div v-if="form_Listb.found_name">
			<span>发起人：</span><span>{{form_Listb.found_name}}</span>
		</div>
		<div v-if="form_Listb.list">
			<span>审批人员：</span><span v-for="item in form_Listb.list" style="color: #444444;margin-left: 4px;">{{item}}</span>
		</div>
		<div>
			<span>审批：</span>
			<div class="exam_info">
				<div class="avatar lzz">
					<span style="margin-left: 5px;">状态</span>
				</div>
				<div class="name lzz">
					<span>姓名</span>
				</div>
				<div class="tel lzz">
					<span>时间</span>
				</div>
				<div class="operation lzz">
					<span>回复</span>
				</div>
			</div>
			<div v-for="item in form_Listb.content">
				<div class="exam_info">
					<div class="avatar">
						<span>{{item.is_agree}}</span>
					</div>
					<div class="name">
						<span>{{item.name}}</span>
					</div>
					<div class="tel">
						<span>{{item.add_time}}</span>
					</div>
					<div class="operation">
						<span>{{item.opinion}}</span>
					</div>
				</div>
				<div>
					<img :src="list" alt="" v-for="(list,index) in item.picture" @click="cl_pic(item,index)" />
				</div>
			</div>
		</div>
		<div v-if="form_Listb.finance">
			<span>表单回执：</span>
			<br />
			<span style="color: #444444;">
				<span v-html="form_Listb.finance.finance_state"></span> {{form_Listb.finance.name}} {{form_Listb.finance.receipt_content}} {{form_Listb.finance.save_time}}
			<div>
				<img :src="list" alt="" v-for="(list,index) in form_Listb.re_pic" @click="rec_pic(form_Listb.re_pic,index)" />
			</div>
			</span>
		</div>
		<div class="menu" v-show="handle_show">
			<el-button type="primary" plain @click="handle">处理</el-button>
			<div class="button" v-show="menuShow">
				<el-input type="textarea" :rows="2" placeholder="请输入回复内容" v-model="handle_txt"></el-input>
				<input name="token" type="hidden" :value="input_value">
				<input type="file" @change="getFile($event)" multiple="multiple" accept="image/png,image/jpeg" />
				<el-button type="primary" round @click="agree($event)">同意</el-button>
				<el-button type="danger" round @click="refuse">拒绝</el-button>
			</div>
		</div>
		<browsePic :pic_index="pic_index" :img_arr="img_arr" :pic_show="pic_show" @left="last_one" @right="next_one" @close_pic="close_pic"></browsePic>
		<loading v-show="loading_show"></loading>
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
				this.$http.post("/index.php/Mobile/path/get_token", param)
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
				this.loading_show = true
				this.pic_hash_arr = []
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
					setTimeout(() => {
						let mparam = new URLSearchParams();
						mparam.append("uid", this.user.uid);
						mparam.append("company_id", this.nowCompanyId);
						this.$http.post("/index.php/Mobile/User/return_company_new", mparam)
							.then((res) => {
								this.now_personnel_id = res.data.data.personnel_id
								if(this.now_personnel_id === res.data.data.personnel_id) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											let param = new URLSearchParams();
											param.append("uid", this.user.uid);
											param.append("approval_id", this.psb_approval_id);
											param.append("personnel_id", this.now_personnel_id);
											param.append("company_id", this.nowCompanyId);
											param.append("finance_state", 1);
											param.append("receipt_content", '111');
											param.append("receipt_pic", res.data.data.enclosure_id);
											this.$http.post("/index.php/Mobile/find/finance_receipt", param)
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
					}, 1000)
				}
			},

			refuse() {

				if(this.handle_txt === '') {
					this.$message.error('请填写回执内容');
					return
				}
				this.loading_show = true
				if(!this.file) {
					let mparam = new URLSearchParams();
					mparam.append("uid", this.user.uid);
					mparam.append("company_id", this.nowCompanyId);
					this.$http.post("/index.php/Mobile/User/return_company_new", mparam)
						.then((res) => {
							this.now_personnel_id = res.data.data.personnel_id
							let param = new URLSearchParams();
							param.append("uid", this.user.uid);
							param.append("approval_id", this.psb_approval_id);
							param.append("personnel_id", this.now_personnel_id);
							param.append("company_id", this.nowCompanyId);
							param.append("finance_state", 1);
							param.append("receipt_content", this.handle_txt);
							this.$http.post("/index.php/Mobile/find/finance_receipt", param)
								.then((res) => {
									console.log(res)
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
					setTimeout(() => {
						let mparam = new URLSearchParams();
						mparam.append("uid", this.user.uid);
						mparam.append("company_id", this.nowCompanyId);
						this.$http.post("/index.php/Mobile/User/return_company_new", mparam)
							.then((res) => {
								this.now_personnel_id = res.data.data.personnel_id
								if(this.now_personnel_id === res.data.data.personnel_id) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											let param = new URLSearchParams();
											param.append("uid", this.user.uid);
											param.append("approval_id", this.psb_approval_id);
											param.append("personnel_id", this.now_personnel_id);
											param.append("company_id", this.nowCompanyId);
											param.append("finance_state", 1);
											param.append("receipt_content", '111');
											param.append("receipt_pic", res.data.data.enclosure_id);
											this.$http.post("/index.php/Mobile/find/finance_receipt", param)
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
					}, 1000)
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
			margin-bottom: 0px;
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
				width: 80px;
			}
			.tel {
				width: 150px;
			}
			.operation {
				width: 240px;
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