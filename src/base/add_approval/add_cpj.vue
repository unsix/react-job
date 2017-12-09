<template>
	<div class="chengpijian">
		<el-form :model="cpj_ruleForm" :rules="cpj_rules" ref="cpj_ruleForm" label-width="150px" class="demo-cpj_ruleForm">
			<el-form-item label="呈批部门" prop="department_name">
				<el-select v-model="cpj_ruleForm.department_name" placeholder="请选择呈批部门">
					<el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="呈批标题" prop="content">
				<el-input v-model="cpj_ruleForm.content"></el-input>
			</el-form-item>
			<el-form-item label="文件编号" prop="chengpi_num">
				<el-input v-model="cpj_ruleForm.chengpi_num"></el-input>
			</el-form-item>
			<el-form-item label="主题内容" prop="title">
				<el-input v-model="cpj_ruleForm.title"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="cpj_ruleForm.project_manager_name" placeholder="请选择" @change="cpjSelectOk">
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
				<el-button type="primary" @click="submitForm_cpj('cpj_ruleForm')">立即添加</el-button>
				<el-button @click="resetForm('cpj_ruleForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { mapGetters ,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				cpj_ruleForm: {
					department_id: '',
					department_name: '',
					content: '',
					chengpi_num: '',
					title: '',
					project_manager_name: '',
					project_manager: {}
				},
				cpj_rules: {
					department_name: [{
						required: true,
						message: '请填写呈批部门',
						trigger: 'change'
					}],
					content: [{
						required: true,
						message: '请填写主题内容',
						trigger: 'blur'
					}],
					chengpi_num: [{
						required: true,
						message: '请填写文件编号',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请填写呈批标题',
						trigger: 'blur'
					}]
				},
				pic_hash_arr: [],
				file_hash_arr: [],
				afile_hash_arr: [],
				file_time: 0,
				pic_time: 0,
				pic_show: false,
				loadingShow:false,
				pic_index: 0,
				img_arr: [],
				pic_enclosure_id:''

			}
		},
		props: {
			approval_id:{
				type:String
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
						this.form_Lista = create_cengpijian_list(res.data.data)
						this.cpj_ruleForm.department_id = this.form_Lista.department_id
						this.cpj_ruleForm.department_name = this.form_Lista.department_name
						this.cpj_ruleForm.content = this.form_Lista.content
						this.cpj_ruleForm.chengpi_num = this.form_Lista.chengpi_num
						this.cpj_ruleForm.title = this.form_Lista.title
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
				console.log(this.pic)
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
			cpjSelectOk(tab) {
				this.comPersonList.forEach((item) => {
					if(item.name === tab) {
						this.$set(this.cpj_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
			submitForm_cpj(formName) {
				this.comDepartList.forEach((item) => {
					if(item.department_name === this.cpj_ruleForm.department_name) {
						this.cpj_ruleForm.department_id = item.department_id
					}
				})
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.cpj_submit()
						this.loading_show = true
					} else {
						this.$message.error('请将表单填写完整');
						return false;
					}
				});
			},
			cpj_submit() {
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				if((!this.pic || this.pic.length === 0) && (!this.file || this.file.length === 0)) {
					let param = new URLSearchParams();
					if(this.cpj_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", parseInt(this.cpj_ruleForm.chengpi_num));
					param.append("title", this.cpj_ruleForm.title);
					this.$http.post("/index.php/Mobile/approval/add_chengpi", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$router.push({ path: '/work/exam' })
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
					if(this.cpj_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", parseInt(this.cpj_ruleForm.chengpi_num));
					param.append("title", this.cpj_ruleForm.title);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_chengpi", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$router.push({ path: '/work/exam' })
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
					if(this.cpj_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", parseInt(this.cpj_ruleForm.chengpi_num));
					param.append("title", this.cpj_ruleForm.title);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					this.$http.post("/index.php/Mobile/approval/add_chengpi", param)
						.then((res) => {
							this.loadingShow = false
							if(res.data.code === 0) {
								this.add_ok()
								this.loading_show = false
								this.$router.push({ path: '/work/exam' })
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
	.el-select {
		width: 100%;
	}
</style>