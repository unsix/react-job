<template>
	<div class="add_psb">
		<el-form :model="psb_ruleForm" :rules="psb_rules" ref="psb_ruleForm" label-width="150px" class="demo-psb_ruleForm">
			<el-form-item label="工程名称" prop="contract_name">
				<el-input v-model="psb_ruleForm.contract_name"></el-input>
			</el-form-item>
			<el-form-item label="合同名称" prop="contract_name_new">
				<el-input v-model="psb_ruleForm.contract_name_new"></el-input>
			</el-form-item>
			<el-form-item label="甲方" prop="a_name">
				<el-input v-model="psb_ruleForm.a_name"></el-input>
			</el-form-item>
			<el-form-item label="乙方" prop="b_name">
				<el-input v-model="psb_ruleForm.b_name"></el-input>
			</el-form-item>
			<el-form-item label="执行人" prop="executor">
				<el-input v-model="psb_ruleForm.executor"></el-input>
			</el-form-item>
			<el-form-item label="单价" prop="prive">
				<el-input v-model="psb_ruleForm.prive"></el-input>
			</el-form-item>
			<el-form-item label="总价" prop="total_prive">
				<el-input v-model="psb_ruleForm.total_prive"></el-input>
			</el-form-item>
			<el-form-item label="与投标价差异" prop="difference">
				<el-input v-model="psb_ruleForm.difference"></el-input>
			</el-form-item>
			<el-form-item label="付款方式" prop="pay_method">
				<el-input v-model="psb_ruleForm.pay_method"></el-input>
			</el-form-item>
			<el-form-item label="到货时间" prop="arrive_time">
				<el-date-picker type="date" v-model="psb_ruleForm.arrive_time" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="完工时间" prop="end_time">
				<el-date-picker type="date" v-model="psb_ruleForm.end_time" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="合同编号">
				<el-input v-model="psb_ruleForm.contract_id"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="psb_ruleForm.remarks"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="psb_ruleForm.project_manager_name" placeholder="请选择" @change="psbSelectOk">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :value="item.name">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="添加图片">
				<input name="token" type="hidden" :value="token">
				<input type="file" name="" id="" @change="getPic($event)" multiple="multiple" accept="image/jpg, image/jpeg, image/png" />
			</el-form-item>
			<el-form-item label="添加文件">
				<input name="token" type="hidden" :value="token">
				<input type="file" name="" id="" @change="getFile($event)" multiple="multiple" accept="application/msword,	text/plain,	application/pdf,application/vnd.ms-excel,application/vnd.ms-powerpoint" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm_psb('psb_ruleForm')">立即添加</el-button>
				<!--<el-button @click="resetForm('psb_ruleForm')">重置</el-button>-->
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				psb_ruleForm: {
					contract_name: '',
					contract_id: '',
					a_name: '',
					b_name: '',
					prive: '',
					total_prive: '',
					difference: '',
					pay_method: '',
					arrive_time: '',
					end_time: '',
					executor: '',
					contract_name_new: '',
					remarks: '',
					project_manager_name: '',
					project_manager: {}
				},
				psb_rules: {
					contract_name: [{
						required: true,
						message: '请填写工程名称',
						trigger: 'blur'
					}],
					contract_id: [{
						required: true,
						message: '请填写合同编号',
						trigger: 'blur'
					}],
					a_name: [{
						required: true,
						message: '请填写甲方姓名',
						trigger: 'blur'
					}],
					b_name: [{
						required: true,
						message: '请填写乙方姓名',
						trigger: 'blur'
					}],
					prive: [{
						required: true,
						message: '请填写单价',
						trigger: 'blur'
					}],
					total_prive: [{
						required: true,
						message: '请填写总价',
						trigger: 'blur'
					}],
					difference: [{
						required: true,
						message: '请填写与投标价格差异',
						trigger: 'blur'
					}],
					pay_method: [{
						required: true,
						message: '请填写	付款方式',
						trigger: 'blur'
					}],
					arrive_time: [{
						type: 'date',
						required: true,
						message: '请填写到货时间',
						trigger: 'blur'
					}],
					end_time: [{
						type: 'date',
						required: true,
						message: '请填写	完工时间',
						trigger: 'blur'
					}],
					executor: [{
						required: true,
						message: '请填写	执行人',
						trigger: 'blur'
					}],
					contract_name_new: [{
						required: true,
						message: '请填写合同名称',
						trigger: 'blur'
					}]
				},
				pic_hash_arr: [],
				file_hash_arr: [],
				afile_hash_arr: [],
				file_time: 0,
				pic_time: 0,
				pic_show: false,
				pic_index: 0,
				img_arr: [],
				pic_enclosure_id: '',
				loadingShow:false
			}
		},
		props: {
			approval_id:{
				type:String
			}
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
		created() {
			this._getToken()
			this.initial_data()
		},
		components:{
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
						this.form_Lista = create_hetongpingshen_list(res.data.data)
						this.psb_ruleForm.contract_name = this.form_Lista.contract_name
						this.psb_ruleForm.contract_id = this.form_Lista.contract_id
						this.psb_ruleForm.a_name = this.form_Lista.a_name
						this.psb_ruleForm.b_name = this.form_Lista.b_name
						this.psb_ruleForm.prive = this.form_Lista.prive
						this.psb_ruleForm.total_prive = this.form_Lista.total_prive
						this.psb_ruleForm.difference = this.form_Lista.difference
						this.psb_ruleForm.pay_method = this.form_Lista.pay_method
						this.psb_ruleForm.executor = this.form_Lista.executor
						this.psb_ruleForm.contract_name_new = this.form_Lista.contract_name_new
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
			psbSelectOk(tab) {
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.$set(this.psb_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
			submitForm_psb(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {		
						this.psb_submit()
						this.loading_show = true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			psb_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				this.psb_ruleForm.arrive_time = JSON.stringify(this.psb_ruleForm.arrive_time).slice(1, 11)
				this.psb_ruleForm.end_time = JSON.stringify(this.psb_ruleForm.end_time).slice(1, 11)
				return
				if(!this.pic && !this.file) {	
					let param = new URLSearchParams();
					if(this.psb_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.psb_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("a_name", this.psb_ruleForm.a_name);
					param.append("b_name", this.psb_ruleForm.b_name);
					param.append("prive", this.psb_ruleForm.prive);
					param.append("total_prive", this.psb_ruleForm.total_prive);
					param.append("difference", this.psb_ruleForm.difference);
					param.append("pay_method", this.psb_ruleForm.pay_method);
					param.append("contract_name", this.psb_ruleForm.contract_name);
					param.append("arrive_time", this.psb_ruleForm.arrive_time);
					param.append("end_time", this.psb_ruleForm.end_time);
					param.append("executor", this.psb_ruleForm.executor);
					param.append("remarks", this.psb_ruleForm.remarks);
					param.append("contract_id", this.psb_ruleForm.contract_id);
					param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
					this.$http.post("/index.php/Mobile/approval/add_approval_conyract_company_new", param)
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
											this.pic_enclosure_id = res.data.data.enclosure_id
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
					if(this.psb_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.psb_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("a_name", this.psb_ruleForm.a_name);
					param.append("b_name", this.psb_ruleForm.b_name);
					param.append("prive", this.psb_ruleForm.prive);
					param.append("total_prive", this.psb_ruleForm.total_prive);
					param.append("difference", this.psb_ruleForm.difference);
					param.append("pay_method", this.psb_ruleForm.pay_method);
					param.append("contract_name", this.psb_ruleForm.contract_name);
					param.append("arrive_time", this.psb_ruleForm.arrive_time);
					param.append("end_time", this.psb_ruleForm.end_time);
					param.append("executor", this.psb_ruleForm.executor);
					param.append("remarks", this.psb_ruleForm.remarks);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("contract_id", this.psb_ruleForm.contract_id);
					param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
					this.$http.post("/index.php/Mobile/approval/add_approval_conyract_company_new", param)
						.then((res) => {
							this.loadingShow = false
							this.loading_show = false
							if(res.data.code === 0) {
								this.add_ok()
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
					if(this.psb_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.psb_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("a_name", this.psb_ruleForm.a_name);
					param.append("b_name", this.psb_ruleForm.b_name);
					param.append("prive", this.psb_ruleForm.prive);
					param.append("total_prive", this.psb_ruleForm.total_prive);
					param.append("difference", this.psb_ruleForm.difference);
					param.append("pay_method", this.psb_ruleForm.pay_method);
					param.append("contract_name", this.psb_ruleForm.contract_name);
					param.append("arrive_time", this.psb_ruleForm.arrive_time);
					param.append("end_time", this.psb_ruleForm.end_time);
					param.append("executor", this.psb_ruleForm.executor);
					param.append("remarks", this.psb_ruleForm.remarks);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("contract_id", this.psb_ruleForm.contract_id);
					param.append("contract_name_new", this.psb_ruleForm.contract_name_new);
					this.$http.post("/index.php/Mobile/approval/add_approval_conyract_company_new", param)
						.then((res) => {
							this.loadingShow = false
							this.loading_show = false
							if(res.data.code === 0) {
								this.add_ok()
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
	.add_psb {
		.el-select {
			width: 100%;
		}
	}
</style>