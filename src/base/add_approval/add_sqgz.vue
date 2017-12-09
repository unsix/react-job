<template>
	<div class="shenqinggongzhang">
		<el-form :model="sqgz_ruleForm" :rules="sqgz_rules" ref="sqgz_ruleForm" label-width="150px" class="demo-sqgz_ruleForm">
			<el-form-item label="用章部门" prop="departmental">
				<el-select v-model="sqgz_ruleForm.departmental" placeholder="请选择呈批部门">
					<el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="申请人" prop="user_name">
				<el-input v-model="sqgz_ruleForm.user_name"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="sqgz_ruleForm.project_manager_name" placeholder="请选择" @change="sqgzSelectOk">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :value="item.name">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<div class="add_sqgz">添加清单条目 <i class="el-icon-circle-plus" @click="add_sqgz"></i></div>
			<div>
				<el-form v-for="(item,index) in sqgz_ruleForm.add" label-width="150px" :key="index">
					<div class="close"></div>
					<el-form-item label="印章类别">
						<el-radio-group v-model="item.seal_type">
							<el-radio label="1">公章</el-radio>
							<el-radio label="2">法人章</el-radio>
							<el-radio label="3">财务章</el-radio>
							<el-radio label="4">发票章</el-radio>
							<el-radio label="5">合同章</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="盖章事由">
						<el-input v-model="item.reason"></el-input>
					</el-form-item>
					<el-form-item label="资料名称">
						<el-input v-model="item.contract_name"></el-input>
					</el-form-item>
					<el-form-item label="数量">
						<el-input v-model.number="item.num"></el-input>
					</el-form-item>
					<el-form-item label="公司名称">
						<el-input v-model="item.name_company"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="item.remarks"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<el-form-item label="添加图片">
				<input name="token" type="hidden" :value="token">
				<input type="file" name="" id="" @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
			</el-form-item>
			<el-form-item label="添加文件">
				<input name="token" type="hidden" :value="token">
				<input type="file" name="" id="" @change="getFile($event)" multiple="multiple" accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm_sqgz('sqgz_ruleForm')">立即添加</el-button>
				<!--<el-button @click="resetForm('sqgz_ruleForm')">重置</el-button>-->
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import { mapGetters, mapMutations } from 'vuex'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang.js'
	export default {
		data() {
			return {
				sqgz_ruleForm: {
					departmental: '',
					user_name: '',
					department_id: '',
					project_manager_name: '',
					project_manager: {},
					add: [{
						seal_type: '1',
						reason: "",
						contract_name: "",
						num: "",
						remarks: "",
						company_type: "1",
						name_company: ""
					}]
				},
				sqgz_rules: {
					departmental: [{
						required: true,
						message: '请填写用章部门',
						trigger: 'change'
					}],
					user_name: [{
						required: true,
						message: '请填写申请人姓名',
						trigger: 'change'
					}],
					reason: [{
						required: true,
						message: '请填写盖章事由',
						trigger: 'change'
					}],
					contract_name: [{
						required: true,
						message: '请填写呈资料名称',
						trigger: 'change'
					}],
					num: [{
							required: true,
							message: '请填写数量'
						},
						{
							type: 'number',
							message: '数量必须为数字值'
						}
					],
					name_company: [{
						required: true,
						message: '请填写公司名称',
						trigger: 'change'
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
				img_arr: []
			}
		},
		props: {
			approval_id: {
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
			loading
		},
		methods: {
			initial_data() {
				if(!this.approval_id) {
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", this.approval_id);
				this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
					.then((res) => {
						
						this.form_Lista = create_gongzhang_list(res.data.data)
						
						this.sqgz_ruleForm.user_name = this.form_Lista.user_name
						this.sqgz_ruleForm.departmental = this.form_Lista.department_name
						this.sqgz_ruleForm.department_id = this.form_Lista.department_id
						this.sqgz_ruleForm.add = this.form_Lista.info
						this.sqgz_ruleForm.add.forEach((item,index)=>{
							if(item.seal_type ==='公章'){
								this.sqgz_ruleForm.add[index].seal_type = '1'
							}else if(item.seal_type ==='法人章'){
								this.sqgz_ruleForm.add[index].seal_type = '2'
							}else if(item.seal_type ==='财务章'){
								this.sqgz_ruleForm.add[index].seal_type = '3'
							}else if(item.seal_type ==='发票章'){
								this.sqgz_ruleForm.add[index].seal_type = '4'
							}else if(item.seal_type ==='合同章'){
								this.sqgz_ruleForm.add[index].seal_type = '5'
							}
							
						})
						
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
			ctrl_pic_show(index) {
				this.pic_index = index
				this.pic_show = true
			},
			getPic(event) {
				this.pic = event.target.files;
			},
			getFile(event) {
				this.file = event.target.files;
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
			sqgzSelectOk(tab) {
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.$set(this.sqgz_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
			add_sqgz() {
				let obj = {
					seal_type: '1',
					reason: "",
					contract_name: "",
					num: "",
					remarks: "",
					company_type: "1",
					name_company: ""
				}
				this.sqgz_ruleForm.add.push(obj)
			},
			submitForm_sqgz(formName) {
				this.returnOk = false
				this.sqgz_ruleForm.add.forEach((item) => {
					if(item.reason === '' || item.contract_name === '' || item.num === '' || item.remarks === '' ||
						item.company_type === '' || item.name_company === '') {
						this.$message.error('请将清单条目填写完整');
						this.returnOk = true
					}
				})
				if(this.returnOk === true) {
					return
				}
				this.comDepartList.forEach((item) => {
					if(item.department_name === this.sqgz_ruleForm.departmental) {
						this.sqgz_ruleForm.department_id = item.department_id
					}
				})
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.sqgz_submit()
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			sqgz_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				if((!this.pic || this.pic.length === 0) && (!this.file || this.file.length === 0)) {
					let param = new URLSearchParams();
					if(this.sqgz_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.sqgz_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("departmental", this.sqgz_ruleForm.department_id);
					param.append("user_name", this.sqgz_ruleForm.user_name);
					param.append("info", JSON.stringify(this.sqgz_ruleForm.add));
					this.$http.post("/index.php/Mobile/approval/add_request_seal", param)
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
					if(this.pic) {
						for(let i = 0; i < this.pic.length; i++) {
							let formData = new FormData();
							formData.append('file', this.pic[i]);
							formData.append('token', this.token);
							let config = {
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								this.pic_hash_arr.push(res.data.hash)
								if(this.pic_hash_arr.length === this.pic.length) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											this.afile_hash_arr.push({
												"type": 3,
												"contract_id": res.data.data.enclosure_id,
												"name": this.pic[i].name
											})
											let aDate = Date.parse(new Date())
											this.pic_time = aDate
										})
								}
							})
						}
					}
					if(this.file) {
						for(let i = 0; i < this.file.length; i++) {
							let formData = new FormData();
							formData.append('file', this.file[i]);
							formData.append('token', this.token);
							let config = {
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
							this.$http.post('http://up.qiniu.com', formData, config).then((res) => {
								let index = this.file[i].name.indexOf('.')
								let attribute = this.file[i].name.slice(index)
								let file_name = this.file[i].name.slice(0, index)
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
											"name": this.file[i].name
										})
										if(this.file_hash_arr.length === this.file.length) {
											let bDate = Date.parse(new Date())
											this.file_time = bDate
										}
									})
							})
						}
					}
				}

			},
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
					if(this.sqgz_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.sqgz_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("departmental", this.sqgz_ruleForm.department_id);
					param.append("user_name", this.sqgz_ruleForm.user_name);
					param.append("info", JSON.stringify(this.sqgz_ruleForm.add));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_request_seal", param)
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
					if(this.sqgz_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.sqgz_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("departmental", this.sqgz_ruleForm.department_id);
					param.append("user_name", this.sqgz_ruleForm.user_name);
					param.append("info", JSON.stringify(this.sqgz_ruleForm.add));
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_request_seal", param)
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
	.shenqinggongzhang {
		.add_sqgz {
			font-size: 14px;
			color: #5a5e66;
			cursor: pointer;
			margin-left: 10px;
			i {
				&:hover {
					color: #3487E2;
				}
			}
		}
	}
</style>