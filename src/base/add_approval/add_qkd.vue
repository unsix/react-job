<template>
	<div class="qingkuan">
		<div class="as">
			<el-button type="primary" plain @click="fileAccordS" v-show="form_approval_id != 0">依据附件</el-button>
		</div>
		<el-form :model="qkd_ruleForm" :rules="rules" ref="qkd_ruleForm" label-width="150px" class="demo-qkd_ruleForm">
			<el-form-item label="工程名称" prop="contract_name">
				<el-input v-model="qkd_ruleForm.contract_name"></el-input>
			</el-form-item>
			<el-form-item label="合同名称" prop="contract_name_new">
				<el-input v-model="qkd_ruleForm.contract_name_new"></el-input>
			</el-form-item>
			<el-form-item label="工种" prop="worker_type">
				<el-input v-model="qkd_ruleForm.worker_type"></el-input>
			</el-form-item>
			<el-form-item label="请款人姓名" prop="request_name">
				<el-input v-model="qkd_ruleForm.request_name"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="qkd_ruleForm.phone"></el-input>
			</el-form-item>
			<el-form-item label="开户行地址" prop="bank_address">
				<el-input v-model="qkd_ruleForm.bank_address"></el-input>
			</el-form-item>
			<el-form-item label="银行账户名称" prop="account_name">
				<el-input v-model="qkd_ruleForm.account_name"></el-input>
			</el-form-item>
			<el-form-item label="银行卡号" prop="bank_card">
				<el-input v-model="qkd_ruleForm.bank_card"></el-input>
			</el-form-item>
			<el-form-item label="合同金额" prop="subtotal">
				<el-input v-model="qkd_ruleForm.subtotal"></el-input>
			</el-form-item>
			<el-form-item label="本次请款金额" prop="request_subtotal">
				<el-input v-model="qkd_ruleForm.request_subtotal"></el-input>
			</el-form-item>
			<el-form-item label="请款内容" prop="request_content">
				<el-input type="textarea" v-model="qkd_ruleForm.request_content"></el-input>
			</el-form-item>
			<el-form-item label="合同执行进度" prop="contract_state">
				<el-input v-model="qkd_ruleForm.contract_state"></el-input>
			</el-form-item>
			<el-form-item label="增减金额">
				<el-input v-model="qkd_ruleForm.gain_reduction_subtotal"></el-input>
			</el-form-item>
			<el-form-item label="请款次数">
				<el-input v-model.number="qkd_ruleForm.request_num"></el-input>
			</el-form-item>
			<el-form-item label="已领工程款">
				<el-input v-model.number="qkd_ruleForm.balance_subtotal"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="qkd_ruleForm.project_manager_name" placeholder="请选择" @change="qkdSelectOk">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :value="item.name">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-upload class="upload-demo" multiple action="http://up.qiniu.com" :on-change="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
				<el-button size="small" type="info" plain>上传文件</el-button>
			</el-upload>
			<el-form-item>
				<el-button type="primary" @click="submitForm_qkd('qkd_ruleForm')">立即添加</el-button>
				<!--<el-button @click="resetForm('qkd_ruleForm')">重置</el-button>-->
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
		<fileAccord v-if="fileAccordShow" :request_money_basis_type="request_money_basis_type" :form_approval_id="form_approval_id" @closeAcc="closeAcc"></fileAccord>
	</div>
</template>

<script>
	import fileAccord from '@/base/file_accord/file_accord'
	import loading from '@/base/loading/loading'
	import { mapGetters, mapMutations } from 'vuex'
	import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
	export default {
		data() {
			return {
				fileList: [],
				picArr: [],
				fileArr: [],
				qkd_ruleForm: {
					balance_subtotal: '',
					gain_reduction_subtotal: '',
					contract_name_new: '',
					contract_name: '',
					bank_name: '',
					account_name: '',
					bank_card: '',
					worker_type: '',
					bank_address: '',
					subtotal: '',
					request_subtotal: '',
					request_content: '',
					request_name: '',
					request_num: '',
					phone: '',
					contract_state: '',
					project_manager_name: '',
					project_manager: {}
				},
				rules: {
					account_name: [{
						required: true,
						message: '请填写	银行账户名称',
						trigger: 'blur'
					}],
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}],
					contract_name: [{
						required: true,
						message: '请填写工程名称',
						trigger: 'blur'
					}],
					request_name: [{
						required: true,
						message: '请填写请款人姓名',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请填写联系方式',
						trigger: 'blur'
					}],
					bank_card: [{
						required: true,
						message: '请填写银行卡号',
						trigger: 'blur'
					}],
					bank_name: [{
						required: true,
						message: '请填写银行账户名称',
						trigger: 'blur'
					}],
					worker_type: [{
						required: true,
						message: '请填写工种',
						trigger: 'blur'
					}],
					bank_address: [{
						required: true,
						message: '请填写开户行地址',
						trigger: 'blur'
					}],
					subtotal: [{
						required: true,
						message: '请填写合同金额',
						trigger: 'blur'
					}],
					request_subtotal: [{
						required: true,
						message: '请填写请款金额',
						trigger: 'blur'
					}],
					request_content: [{
						required: true,
						message: '请填写请求内容',
						trigger: 'blur'
					}],
					contract_state: [{
						required: true,
						message: '请填写请款进程',
						trigger: 'blur'
					}]
				},
				pic_hash_arr: [],
				file_hash_arr: [],
				afile_hash_arr: [],
				file_time: 0,
				pic_time: 0,
				pic_show: false,
				loadingShow: false,
				pic_index: 0,
				img_arr: [],
				pic_enclosure_id: '',
				fileAccordShow: false
			}
		},
		props: {
			approval_id: {
				type: String
			},
			form_approval_id: {
				type: String,
				default: '0'
			},
			request_money_basis_type: {
				type: String
			}
		},
		created() {
			this._getToken()
			this.initial_data()
		},
		computed: {
			...mapGetters([
				'comPersonList',
				'user',
				'nowCompanyId',
				'comDepartList',
				'token'
			])
		},
		components: {
			loading,
			fileAccord
		},
		methods: {
			handleRemove(file, fileList) {
				this.fileList = fileList
			},
			handlePreview(file, fileList) {
				this.fileList = fileList
			},
			closeAcc() {
				this.fileAccordShow = false
			},
			fileAccordS() {
				this.fileAccordShow = true
			},
			initial_data() {
				if(!this.approval_id) {
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", this.approval_id);
				this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
					.then((res) => {
						this.form_Lista = create_qingkuandan_list(res.data.data)
						this.qkd_ruleForm.balance_subtotal = this.form_Lista.balance_subtotal
						this.qkd_ruleForm.contract_name_new = this.form_Lista.contract_name_new
						this.qkd_ruleForm.contract_name = this.form_Lista.contract_name
						this.qkd_ruleForm.account_name = this.form_Lista.account_name
						this.qkd_ruleForm.bank_card = this.form_Lista.bank_card
						this.qkd_ruleForm.worker_type = this.form_Lista.worker_type
						this.qkd_ruleForm.bank_address = this.form_Lista.bank_address
						this.qkd_ruleForm.subtotal = this.form_Lista.subtotal
						this.qkd_ruleForm.request_subtotal = this.form_Lista.request_subtotal
						this.qkd_ruleForm.request_content = this.form_Lista.request_content
						this.qkd_ruleForm.request_name = this.form_Lista.request_name
						this.qkd_ruleForm.request_num = this.form_Lista.request_num
						this.qkd_ruleForm.phone = this.form_Lista.phone
						this.qkd_ruleForm.contract_state = this.form_Lista.contract_state
						this.qkd_ruleForm.gain_reduction_subtotal = this.form_Lista.gain_reduction_subtotal
						this.qkd_ruleForm.project_manager_name = this.form_Lista.project_manager_name

					})
			},
			add_ok() {
				this.$message({
					showClose: true,
					message: '添加成功',
					type: 'success'
				});
			},
			add_fail() {
				this.$message({
					showClose: true,
					message: '添加失败',
					type: 'error'
				});
			},
			get_img(enclosure_id) {
				if(enclosure_id === '0') {
					return
				}
				let param = new URLSearchParams();
				param.append("enclosure_id", enclosure_id);
				this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
					.then((res) => {
						let arr = []
						res.data.data.picture.forEach((item) => {
							if(item != '') {
								arr.push('http://bbsf-file.hzxb.net/' + item)
							}

						})
						this.img_arr = arr
						this.$set(this.form_Lista, 'img_list', arr)
					})
			},
			get_moreimg(many) {
				many.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
						this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
							.then((res) => {
								let arr = []
								res.data.data.picture.forEach((item) => {
									if(item != '') {
										if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
											arr.push('http://bbsf-file.hzxb.net/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
										} else {
											arr.push('http://bbsf-file.hzxb.net/' + item)
										}
									}
								})
								this.$set(this.form_Lista, 'img_list', arr)
							})
					}
				})
			},
			ctrl_pic_show(index) {
				this.pic_index = index
				this.pic_show = true
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
			close_pic() {
				this.pic_show = false
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/path/get_token", nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
			...mapMutations({
				setToken: 'SET_TOKEN'
			}),
			qkdSelectOk(tab) {
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.$set(this.qkd_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
			submitForm_qkd(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.qkd_submit()
						this.loading_show = true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			qkd_submit() {
				this.picArr = []
				this.fileArr = []
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1') {
						this.picArr.push(item)
					} else {
						this.fileArr.push(item)
					}
				})
				var re = /^[0-9]+$/;
				if(!re.test(this.qkd_ruleForm.request_num)) {
					this.$message.error('请求次数请填正整数');
					return
				}
				var ret = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/;
				if(!ret.test(this.qkd_ruleForm.balance_subtotal)) {
					this.$message.error('已领工程款请填数字');
					return
				}
				if(this.qkd_ruleForm.project_manager_name != '') {
					this.comPersonList.forEach((item) => {
						if(item.name === this.qkd_ruleForm.project_manager_name) {
							this.$set(this.qkd_ruleForm.project_manager, 'uid', item.uid)
						}
					})
				}
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				setTimeout(() => {
					if(this.picArr.length === 0 && this.fileArr.length === 0) {
						let param = new URLSearchParams();
						if(this.qkd_ruleForm.project_manager.uid) {
							param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
						}
						param.append("uid", this.user.uid);
						param.append("contract_name", this.qkd_ruleForm.contract_name);
						param.append("company_id", this.nowCompanyId);
						param.append("request_name", this.qkd_ruleForm.request_name);
						param.append("phone", this.qkd_ruleForm.phone);
						param.append("worker_type", this.qkd_ruleForm.worker_type);
						param.append("phone", this.qkd_ruleForm.phone);
						param.append("account_name", this.qkd_ruleForm.account_name);
						param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
						param.append("bank_card", this.qkd_ruleForm.bank_card);
						param.append("bank_address", this.qkd_ruleForm.bank_address);
						param.append("subtotal", this.qkd_ruleForm.subtotal);
						param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
						param.append("request_content", this.qkd_ruleForm.request_content);
						param.append("request_num", this.qkd_ruleForm.request_num);
						param.append("type", '2');
						if(this.form_approval_id != '0') {
							param.append("form_approval_id", this.form_approval_id);
						}
						param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
						param.append("contract_state", this.qkd_ruleForm.contract_state);
						param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
						this.$http.post("/index.php/Mobile/approval/add_request_money", param)
							.then((res) => {
								this.loadingShow = false
								if(res.data.code === 0) {
									this.add_ok()
									this.loading_show = false
									this.$emit('return_exam')
								} else {
									this.add_fail()
								}
							})
					} else {
						if(this.picArr.length != 0) {
							for(let i = 0; i < this.picArr.length; i++) {
								let formData = new FormData();
								formData.append('file', this.picArr[i].raw);
								formData.append('token', this.token);
								let config = {
									headers: {
										'Content-Type': 'multipart/form-data'
									}
								}
								this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
									this.pic_hash_arr.push(res.data.hash)
									if(this.pic_hash_arr.length === this.picArr.length) {
										let nparam = new URLSearchParams();
										nparam.append("uid", this.user.uid);
										nparam.append("picture", JSON.stringify(this.pic_hash_arr));
										this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
											.then((res) => {
												this.afile_hash_arr.push({
													"type": 3,
													"contract_id": res.data.data.enclosure_id,
													"name": this.picArr[i].name
												})
												let aDate = Date.parse(new Date())
												this.pic_time = aDate
											})
									}
								})
							}
						}
						if(this.fileArr.length != 0) {
							for(let i = 0; i < this.fileArr.length; i++) {
								let formData = new FormData();
								formData.append('file', this.fileArr[i].raw);
								formData.append('token', this.token);
								let config = {
									headers: {
										'Content-Type': 'multipart/form-data'
									}
								}
								this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
									let index = this.fileArr[i].name.indexOf('.')
									let attribute = this.fileArr[i].name.slice(index)
                                    if(attribute.substr(0,1)=='.'){
                                      attribute=attribute.substr(1)
                                    }
									let file_name = this.fileArr[i].name.slice(0, index)
									let param = new URLSearchParams();
									param.append("uid", this.user.uid);
									param.append("attribute", attribute);
									param.append("attachments", res.data.hash);
									param.append("file_name", file_name);
									this.$http.post("/index.php/Mobile/approval/add_attachments", param)
										.then((res) => {
											this.file_hash_arr.push({
												"type": 4,
												"contract_id": res.data.data.attachments_id,
												"name": this.fileArr[i].name
											})
											if(this.file_hash_arr.length === this.fileArr.length) {
												let bDate = Date.parse(new Date())
												this.file_time = bDate
											}
										})
								})
							}
						}
					}
				}, 500)
			}
		},
		watch: {
			file_time() {
				if(this.picArr.length != 0) {
					if(this.pic_time === 0) {
						return
					}
				}
				if(this.file_time != 0 || this.pic_time != 0) {
					let param = new URLSearchParams();
					if(this.qkd_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					if(this.form_approval_id != '0') {
						param.append("form_approval_id", this.form_approval_id);
					}
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("contract_state", this.qkd_ruleForm.contract_state);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_request_money", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$emit('return_exam')
							} else {
								this.add_fail()
							}
						})
				}
			},
			pic_time() {
				if(this.fileArr.length != 0) {
					if(this.file_time === 0) {
						return
					}
				}
				if(this.file_time != 0 || this.pic_time != 0) {
					let param = new URLSearchParams();
					if(this.qkd_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("contract_state", this.qkd_ruleForm.contract_state);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					if(this.form_approval_id != '0') {
						param.append("form_approval_id", this.form_approval_id);
					}
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("draw_money_name", this.qkd_ruleForm.draw_money_name);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_request_money", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$emit('return_exam')
							} else {
								this.add_fail()
							}
						})
				}
			}
		}
	}
</script>

<style lang="scss">
	.qingkuan {
		.as {
			display: block;
			button {
				position: relative;
				bottom: 50px;
				left: 450px;
			}
		}
		.content {
			font-size: 14px;
			border-bottom: 1px solid #666666;
			position: relative;
			>div {
				line-height: 20px;
				display: block;
				max-width: 320px;
			}
			.button {
				position: absolute;
				top: 30px;
				right: 50px;
				span {
					cursor: pointer;
					color: #67C23A;
					border: 1px solid #67C23A;
					padding: 5px 10px;
					&:last-child {
						color: #409EFF;
						border: 1px solid #409EFF;
					}
				}
			}
		}
		.template_view {
			.form {
				padding: 10px;
				color: #999999;
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
						display: inline-block;
						height: 50px;
						width: 80px;
						cursor: pointer;
					}
				}
				.user {
					&:last-child {
						color: #409EFF;
						border: 1px solid #409EFF;
						margin-left: 10px;
					}
					margin-top: 10px;
					display: inline-block;
					width: 50px;
					border-bottom: none;
					cursor: pointer;
					color: #67C23A;
					border: 1px solid #67C23A;
					text-align: center;
					height: 26px;
					line-height: 26px;
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
						width: 200px;
						height: 30px;
						line-height: 30px;
						span {
							margin-left: 5px;
							color: #444444;
						}
					}
				}
			}
		}
		.as_type {
			ul {
				li {
					display: block;
					height: 30px;
					line-height: 30px;
				}
			}
		}
		table {
			background: #FFFFFF;
			td {
				border: 1px solid #ddd;
				text-indent: 14px;
				line-height: 36px;
				font-size: 12px;
				color: #666;
				.inputMid {
					width: 140px;
					height: 26px;
					border: none;
					outline: none;
				}
				i {
					display: inline-block;
					font-size: 18px;
					color: #3487E2;
					line-height: 1;
					position: relative;
					top: 2px;
				}
				input {
					width: 90%;
					height: 26px;
					border: none;
					outline: none;
				}
				.fbtInput {
					width: 400px;
					height: 26px;
					border: none;
					outline: none;
					font-size: 12px;
				}
			}
		}
	}
</style>
<template>
	<div class="qingkuan">
		<div class="as">
			<el-button type="primary" plain @click="fileAccordS" v-show="form_approval_id != 0">依据附件</el-button>
		</div>
		<el-form :model="qkd_ruleForm" :rules="rules" ref="qkd_ruleForm" label-width="150px" class="demo-qkd_ruleForm">
			<el-form-item label="工程名称" prop="contract_name">
				<el-input v-model="qkd_ruleForm.contract_name"></el-input>
			</el-form-item>
			<el-form-item label="合同名称" prop="contract_name_new">
				<el-input v-model="qkd_ruleForm.contract_name_new"></el-input>
			</el-form-item>
			<el-form-item label="工种" prop="worker_type">
				<el-input v-model="qkd_ruleForm.worker_type"></el-input>
			</el-form-item>
			<el-form-item label="请款人姓名" prop="request_name">
				<el-input v-model="qkd_ruleForm.request_name"></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="phone">
				<el-input v-model="qkd_ruleForm.phone"></el-input>
			</el-form-item>
			<el-form-item label="开户行地址" prop="bank_address">
				<el-input v-model="qkd_ruleForm.bank_address"></el-input>
			</el-form-item>
			<el-form-item label="银行账户名称" prop="account_name">
				<el-input v-model="qkd_ruleForm.account_name"></el-input>
			</el-form-item>
			<el-form-item label="银行卡号" prop="bank_card">
				<el-input v-model="qkd_ruleForm.bank_card"></el-input>
			</el-form-item>
			<el-form-item label="合同金额" prop="subtotal">
				<el-input v-model="qkd_ruleForm.subtotal"></el-input>
			</el-form-item>
			<el-form-item label="本次请款金额" prop="request_subtotal">
				<el-input v-model="qkd_ruleForm.request_subtotal"></el-input>
			</el-form-item>
			<el-form-item label="请款内容" prop="request_content">
				<el-input type="textarea" v-model="qkd_ruleForm.request_content"></el-input>
			</el-form-item>
			<el-form-item label="合同执行进度" prop="contract_state">
				<el-input v-model="qkd_ruleForm.contract_state"></el-input>
			</el-form-item>
			<el-form-item label="增减金额">
				<el-input v-model="qkd_ruleForm.gain_reduction_subtotal"></el-input>
			</el-form-item>
			<el-form-item label="请款次数">
				<el-input v-model.number="qkd_ruleForm.request_num"></el-input>
			</el-form-item>
			<el-form-item label="已领工程款">
				<el-input v-model.number="qkd_ruleForm.balance_subtotal"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="qkd_ruleForm.project_manager_name" placeholder="请选择" @change="qkdSelectOk">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :value="item.name">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-upload class="upload-demo" multiple action="http://up.qiniu.com" :on-change="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
				<el-button size="small" type="info" plain>上传文件</el-button>
			</el-upload>
			<el-form-item>
				<el-button type="primary" @click="submitForm_qkd('qkd_ruleForm')">立即添加</el-button>
				<!--<el-button @click="resetForm('qkd_ruleForm')">重置</el-button>-->
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
		<fileAccord v-if="fileAccordShow" :request_money_basis_type="request_money_basis_type" :form_approval_id="form_approval_id" @closeAcc="closeAcc"></fileAccord>
	</div>
</template>

<script>
	import fileAccord from '@/base/file_accord/file_accord'
	import loading from '@/base/loading/loading'
	import { mapGetters, mapMutations } from 'vuex'
	import { create_qingkuandan_list } from '@/common/js/approval/qingkuandan'
	export default {
		data() {
			return {
				fileList: [],
				picArr: [],
				fileArr: [],
				qkd_ruleForm: {
					balance_subtotal: '',
					gain_reduction_subtotal: '',
					contract_name_new: '',
					contract_name: '',
					bank_name: '',
					account_name: '',
					bank_card: '',
					worker_type: '',
					bank_address: '',
					subtotal: '',
					request_subtotal: '',
					request_content: '',
					request_name: '',
					request_num: '',
					phone: '',
					contract_state: '',
					project_manager_name: '',
					project_manager: {}
				},
				rules: {
					account_name: [{
						required: true,
						message: '请填写	银行账户名称',
						trigger: 'blur'
					}],
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}],
					contract_name: [{
						required: true,
						message: '请填写工程名称',
						trigger: 'blur'
					}],
					request_name: [{
						required: true,
						message: '请填写请款人姓名',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请填写联系方式',
						trigger: 'blur'
					}],
					bank_card: [{
						required: true,
						message: '请填写银行卡号',
						trigger: 'blur'
					}],
					bank_name: [{
						required: true,
						message: '请填写银行账户名称',
						trigger: 'blur'
					}],
					worker_type: [{
						required: true,
						message: '请填写工种',
						trigger: 'blur'
					}],
					bank_address: [{
						required: true,
						message: '请填写开户行地址',
						trigger: 'blur'
					}],
					subtotal: [{
						required: true,
						message: '请填写合同金额',
						trigger: 'blur'
					}],
					request_subtotal: [{
						required: true,
						message: '请填写请款金额',
						trigger: 'blur'
					}],
					request_content: [{
						required: true,
						message: '请填写请求内容',
						trigger: 'blur'
					}],
					contract_state: [{
						required: true,
						message: '请填写请款进程',
						trigger: 'blur'
					}]
				},
				pic_hash_arr: [],
				file_hash_arr: [],
				afile_hash_arr: [],
				file_time: 0,
				pic_time: 0,
				pic_show: false,
				loadingShow: false,
				pic_index: 0,
				img_arr: [],
				pic_enclosure_id: '',
				fileAccordShow: false
			}
		},
		props: {
			approval_id: {
				type: String
			},
			form_approval_id: {
				type: String,
				default: '0'
			},
			request_money_basis_type: {
				type: String
			}
		},
		created() {
			this._getToken()
			this.initial_data()
		},
		computed: {
			...mapGetters([
				'comPersonList',
				'user',
				'nowCompanyId',
				'comDepartList',
				'token'
			])
		},
		components: {
			loading,
			fileAccord
		},
		methods: {
			closeAcc() {
				this.fileAccordShow = false
			},
			fileAccordS() {
				this.fileAccordShow = true
			},
			initial_data() {
				if(!this.approval_id) {
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", this.approval_id);
				this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
					.then((res) => {
						this.form_Lista = create_qingkuandan_list(res.data.data)
						this.qkd_ruleForm.balance_subtotal = this.form_Lista.balance_subtotal
						this.qkd_ruleForm.contract_name_new = this.form_Lista.contract_name_new
						this.qkd_ruleForm.contract_name = this.form_Lista.contract_name
						this.qkd_ruleForm.account_name = this.form_Lista.account_name
						this.qkd_ruleForm.bank_card = this.form_Lista.bank_card
						this.qkd_ruleForm.worker_type = this.form_Lista.worker_type
						this.qkd_ruleForm.bank_address = this.form_Lista.bank_address
						this.qkd_ruleForm.subtotal = this.form_Lista.subtotal
						this.qkd_ruleForm.request_subtotal = this.form_Lista.request_subtotal
						this.qkd_ruleForm.request_content = this.form_Lista.request_content
						this.qkd_ruleForm.request_name = this.form_Lista.request_name
						this.qkd_ruleForm.request_num = this.form_Lista.request_num
						this.qkd_ruleForm.phone = this.form_Lista.phone
						this.qkd_ruleForm.contract_state = this.form_Lista.contract_state
						this.qkd_ruleForm.gain_reduction_subtotal = this.form_Lista.gain_reduction_subtotal
						this.qkd_ruleForm.project_manager_name = this.form_Lista.project_manager_name

					})
			},
			add_ok() {
				this.$message({
					showClose: true,
					message: '添加成功',
					type: 'success'
				});
			},
			add_fail() {
				this.$message({
					showClose: true,
					message: '添加失败',
					type: 'error'
				});
			},
			get_img(enclosure_id) {
				if(enclosure_id === '0') {
					return
				}
				let param = new URLSearchParams();
				param.append("enclosure_id", enclosure_id);
				this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
					.then((res) => {
						let arr = []
						res.data.data.picture.forEach((item) => {
							if(item != '') {
								arr.push('http://bbsf-file.hzxb.net/' + item)
							}

						})
						this.img_arr = arr
						this.$set(this.form_Lista, 'img_list', arr)
					})
			},
			get_moreimg(many) {
				many.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
						this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
							.then((res) => {
								let arr = []
								res.data.data.picture.forEach((item) => {
									if(item != '') {
										if(item.indexOf('jpg') > 0 || item.indexOf('png') > 0 || item.indexOf('Enclos') > 0) {
											arr.push('http://bbsf-file.hzxb.net/FvxX0Q9Xf_7jlhruiU9VVPntp0iA')
										} else {
											arr.push('http://bbsf-file.hzxb.net/' + item)
										}
									}
								})
								this.$set(this.form_Lista, 'img_list', arr)
							})
					}
				})
			},
			ctrl_pic_show(index) {
				this.pic_index = index
				this.pic_show = true
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
			close_pic() {
				this.pic_show = false
			},
			_getToken() {
				let nparam = new URLSearchParams();
				nparam.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/path/get_token", nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
			...mapMutations({
				setToken: 'SET_TOKEN'
			}),
			qkdSelectOk(tab) {
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.$set(this.qkd_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
			submitForm_qkd(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.qkd_submit()
						this.loading_show = true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			qkd_submit() {
				this.picArr = []
				this.fileArr = []
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1') {
						this.picArr.push(item)
					} else {
						this.fileArr.push(item)
					}
				})
				var re = /^[0-9]+$/;
				if(!re.test(this.qkd_ruleForm.request_num)) {
					this.$message.error('请求次数请填正整数');
					return
				}
				var ret = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/;
				if(!ret.test(this.qkd_ruleForm.balance_subtotal)) {
					this.$message.error('已领工程款请填数字');
					return
				}
				if(this.qkd_ruleForm.project_manager_name != '') {
					this.comPersonList.forEach((item) => {
						if(item.name === this.qkd_ruleForm.project_manager_name) {
							this.$set(this.qkd_ruleForm.project_manager, 'uid', item.uid)
						}
					})
				}
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				setTimeout(() => {
					if(this.picArr.length === 0 && this.fileArr.length === 0) {
						let param = new URLSearchParams();
						if(this.qkd_ruleForm.project_manager.uid) {
							param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
						}
						param.append("uid", this.user.uid);
						param.append("contract_name", this.qkd_ruleForm.contract_name);
						param.append("company_id", this.nowCompanyId);
						param.append("request_name", this.qkd_ruleForm.request_name);
						param.append("phone", this.qkd_ruleForm.phone);
						param.append("worker_type", this.qkd_ruleForm.worker_type);
						param.append("phone", this.qkd_ruleForm.phone);
						param.append("account_name", this.qkd_ruleForm.account_name);
						param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
						param.append("bank_card", this.qkd_ruleForm.bank_card);
						param.append("bank_address", this.qkd_ruleForm.bank_address);
						param.append("subtotal", this.qkd_ruleForm.subtotal);
						param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
						param.append("request_content", this.qkd_ruleForm.request_content);
						param.append("request_num", this.qkd_ruleForm.request_num);
						param.append("type", '2');
						if(this.form_approval_id != '0') {
							param.append("form_approval_id", this.form_approval_id);
						}
						param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
						param.append("contract_state", this.qkd_ruleForm.contract_state);
						param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
						this.$http.post("/index.php/Mobile/approval/add_request_money", param)
							.then((res) => {
								this.loadingShow = false
								if(res.data.code === 0) {
									this.add_ok()
									this.loading_show = false
									this.$emit('return_exam')
								} else {
									this.add_fail()
								}
							})
					}
				}, 500)
			}
		},
		watch: {
			file_time() {
				if(this.pic) {
					if(this.pic_time === 0) {
						return
					}
				}
				if(this.file_time != 0 || this.pic_time != 0) {
					let param = new URLSearchParams();
					if(this.qkd_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					if(this.form_approval_id != '0') {
						param.append("form_approval_id", this.form_approval_id);
					}
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("contract_state", this.qkd_ruleForm.contract_state);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_request_money", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$emit('return_exam')
							} else {
								this.add_fail()
							}
						})
				}
			},
			pic_time() {
				if(this.file) {
					if(this.file_time === 0) {
						return
					}
				}
				if(this.file_time != 0 || this.pic_time != 0) {
					let param = new URLSearchParams();
					if(this.qkd_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.qkd_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("contract_name", this.qkd_ruleForm.contract_name);
					param.append("company_id", this.nowCompanyId);
					param.append("request_name", this.qkd_ruleForm.request_name);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("worker_type", this.qkd_ruleForm.worker_type);
					param.append("phone", this.qkd_ruleForm.phone);
					param.append("account_name", this.qkd_ruleForm.account_name);
					param.append("contract_name_new", this.qkd_ruleForm.contract_name_new);
					param.append("contract_state", this.qkd_ruleForm.contract_state);
					param.append("bank_card", this.qkd_ruleForm.bank_card);
					param.append("bank_address", this.qkd_ruleForm.bank_address);
					param.append("subtotal", this.qkd_ruleForm.subtotal);
					param.append("request_subtotal", this.qkd_ruleForm.request_subtotal);
					param.append("request_content", this.qkd_ruleForm.request_content);
					param.append("request_num", this.qkd_ruleForm.request_num);
					param.append("type", '2');
					if(this.form_approval_id != '0') {
						param.append("form_approval_id", this.form_approval_id);
					}
					param.append("balance_subtotal", this.qkd_ruleForm.balance_subtotal);
					param.append("draw_money_name", this.qkd_ruleForm.draw_money_name);
					param.append("gain_reduction_subtotal", this.qkd_ruleForm.gain_reduction_subtotal);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_request_money", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$emit('return_exam')
							} else {
								this.add_fail()
							}
						})
				}
			}
		}
	}
</script>

<style lang="scss">
	.qingkuan {
		.as {
			display: block;
			button {
				position: relative;
				bottom: 50px;
				left: 450px;
			}
		}
		.content {
			font-size: 14px;
			border-bottom: 1px solid #666666;
			position: relative;
			>div {
				line-height: 20px;
				display: block;
				max-width: 320px;
			}
			.button {
				position: absolute;
				top: 30px;
				right: 50px;
				span {
					cursor: pointer;
					color: #67C23A;
					border: 1px solid #67C23A;
					padding: 5px 10px;
					&:last-child {
						color: #409EFF;
						border: 1px solid #409EFF;
					}
				}
			}
		}
		.template_view {
			.form {
				padding: 10px;
				color: #999999;
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
						display: inline-block;
						height: 50px;
						width: 80px;
						cursor: pointer;
					}
				}
				.user {
					&:last-child {
						color: #409EFF;
						border: 1px solid #409EFF;
						margin-left: 10px;
					}
					margin-top: 10px;
					display: inline-block;
					width: 50px;
					border-bottom: none;
					cursor: pointer;
					color: #67C23A;
					border: 1px solid #67C23A;
					text-align: center;
					height: 26px;
					line-height: 26px;
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
						width: 200px;
						height: 30px;
						line-height: 30px;
						span {
							margin-left: 5px;
							color: #444444;
						}
					}
				}
			}
		}
		.as_type {
			ul {
				li {
					display: block;
					height: 30px;
					line-height: 30px;
				}
			}
		}
		table {
			background: #FFFFFF;
			td {
				border: 1px solid #ddd;
				text-indent: 14px;
				line-height: 36px;
				font-size: 12px;
				color: #666;
				.inputMid {
					width: 140px;
					height: 26px;
					border: none;
					outline: none;
				}
				i {
					display: inline-block;
					font-size: 18px;
					color: #3487E2;
					line-height: 1;
					position: relative;
					top: 2px;
				}
				input {
					width: 90%;
					height: 26px;
					border: none;
					outline: none;
				}
				.fbtInput {
					width: 400px;
					height: 26px;
					border: none;
					outline: none;
					font-size: 12px;
				}
			}
		}
	}
</style>
