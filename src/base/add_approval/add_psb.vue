<template>
	<div class="add_psb">
		<el-form :model="psb_ruleForm" :rules="psb_rules" ref="psb_ruleForm" label-width="150px" class="demo-psb_ruleForm">
			<el-form-item label="工程名称" prop="contract_name">
				<el-input v-model="psb_ruleForm.contract_name"></el-input>
			</el-form-item>
			<el-form-item label="合同名称" prop="contract_name_new">
				<el-input v-model="psb_ruleForm.contract_name_new" style="width:195px;"></el-input>
				<el-button type="info" plain @click="chooseHetong" style="float: right;">选择合同</el-button>
				<el-button type="info" plain @click="viewHt" style="float: right;margin-right: 5px;" v-show="psb_ruleForm.contract_id != '' ">查看合同</el-button>
			</el-form-item>
			<el-form-item label="合同编号" prop="contract_num">
				<el-input v-model="psb_ruleForm.contract_num"></el-input>
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
			<el-form-item label="合同主要内容" prop="remarks">
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
			<el-upload class="upload-demo" multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
				<el-button size="small" type="info" plain>上传文件</el-button>
			</el-upload>
			<el-form-item>
				<el-button type="primary" @click="submitForm_psb('psb_ruleForm')">立即添加</el-button>
				<!--<el-button @click="resetForm('psb_ruleForm')">重置</el-button>-->
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
		<div class="hetongList" v-show="hetongListShow">
			<el-button type="primary" plain>主要按钮</el-button>
			<div class="list" v-for="(item,index) in hetongList">
				<div class="content">
					<span>{{item.add_time}}</span>
					<span>{{item.b_name}}</span>
				</div>
				<div class="view">
					<el-button type="primary" round @click="viewHetong(item)">查看</el-button>
					<el-button type="success" round @click="userHetong(item)">使用</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
	import { create_hetongpingshen_list } from '@/common/js/approval/hetongpingshen'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				hetongListShow: false,
				fileList:[],
				psb_ruleForm: {
					contract_name: '',
					contract_num: '',
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
					project_manager: {},
					contract_id: '',
          many_enclosure:{}
				},
				psb_rules: {
					contract_name: [{
						required: true,
						message: '请填写工程名称',
						trigger: 'blur'
					}],
					contract_num: [{
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
						trigger: 'change'
					}],
					end_time: [{
						type: 'date',
						required: true,
						message: '请填写	完工时间',
						trigger: 'change'
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
					}],
					remarks: [{
						required: true,
						message: '请填写合同主要内容',
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
				loadingShow: false,
				hetongList: [],
				picArr: [],
				fileArr: []
			}
		},
		props: {
			approval_id: {
				type: String
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
		components: {
			loading
		},
		methods: {
			handleRemove(file, fileList) {
				this.fileList = fileList
			},
			handlePreview(file, fileList) {
				this.fileList = fileList
			},
			viewHt() {
				window.open('/index.php/Mobile/skey/look_draft?id=' + this.psb_ruleForm.contract_id)
			},
			userHetong(item) {
				this.hetongListShow = false
				this.psb_ruleForm.contract_id = item.contract_draft_id
			},
			viewHetong(item) {
				window.open('/index.php/Mobile/skey/look_draft?id=' + item.contract_draft_id)
			},
			chooseHetong() {
				this.hetongListShow = true
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/find/draft_list", param)
					.then((res) => {
						this.hetongList = res.data.data
					})
			},
			initial_data() {
				if(!this.approval_id) {
					return
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("approval_id", this.approval_id);
				this.fileList=[]
				this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
					.then((res) => {
            console.log(res)
						this.form_Lista = create_hetongpingshen_list(res.data.data)
						this.psb_ruleForm.contract_name = this.form_Lista.contract_name
						this.psb_ruleForm.contract_num = this.form_Lista.contract_num
						this.psb_ruleForm.a_name = this.form_Lista.a_name
						this.psb_ruleForm.b_name = this.form_Lista.b_name
            this.psb_ruleForm.arrive_time = this.form_Lista.arrive_time
            if(this.psb_ruleForm.arrive_time){
              let strDate = this.psb_ruleForm.arrive_time
              var time = new Date(strDate)
              this.psb_ruleForm.arrive_time = time
              console.log(typeof(this.psb_ruleForm.arrive_time))
            }
            this.psb_ruleForm.end_time = this.form_Lista.end_time
            if(this.psb_ruleForm.end_time){
              let strDate1 = this.psb_ruleForm.end_time
              var time1 = new Date(strDate1)
              this.psb_ruleForm.end_time = time1
            }
						this.psb_ruleForm.prive = this.form_Lista.prive
						this.psb_ruleForm.total_prive = this.form_Lista.total_prive
						this.psb_ruleForm.difference = this.form_Lista.difference
						this.psb_ruleForm.pay_method = this.form_Lista.pay_method
						this.psb_ruleForm.executor = this.form_Lista.executor
						this.psb_ruleForm.contract_name_new = this.form_Lista.contract_name_new
						this.psb_ruleForm.remarks = this.form_Lista.remarks
						this.psb_ruleForm.contract_id = this.form_Lista.contract_id
						this.psb_ruleForm.project_manager_name = this.form_Lista.project_manager_name
            this.psb_ruleForm.many_enclosure = this.form_Lista.many_enclosure
            this.form_Lista.many_enclosure.forEach((item)=>{
              let img_name = item.name
              if (item.type === 3){
                let param = new URLSearchParams();
                param.append("enclosure_id", item.contract_id);
                this.$http.post("index.php/Mobile/approval/look_enclosure",param)
                  .then((res)=>{
                    res.data.data.picture.forEach((item) => {
                      console.log(item)
                      let obj = {}
                      let img_add = 'http://bbsf-file.hzxb.net/'+item
                      obj.name = img_name
                      obj.url = img_add
                      obj.hash = item
                      this.fileList.push(obj)
                    })
                  })
              }else if(item.type === 4){
                let param = new URLSearchParams();
                param.append("attachments_id", item.contract_id);
                this.$http.post("/index.php/Mobile/approval/look_attachments", param)
                  .then((res) => {
                    console.log(res)
                    let obj = {}
                    let file_data = res.data.data
                    let file_add = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                    obj.name = file_data.file_name+'.'+file_data.attribute
                    obj.address = file_add
                    obj.hash = file_data.attachments
                    this.fileList.push(obj)
                  })
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
				this.picArr = []
				this.fileArr = []
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1') {
						this.picArr.push(item)
					} else {
						this.fileArr.push(item)
					}
				})

        console.log(typeof(this.psb_ruleForm.arrive_time))
        console.log(this.psb_ruleForm.arrive_time)
				this.psb_ruleForm.arrive_time = JSON.stringify(this.psb_ruleForm.arrive_time).slice(1, 11)
        let timestamp2 = Date.parse(new Date(this.psb_ruleForm.arrive_time));
				timestamp2 = timestamp2 / 1000 + 64800
				let date = new Date();
				date.setTime(timestamp2 * 1000);
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				this.psb_ruleForm.arrive_time = y + '-' + m + '-' + d

				this.psb_ruleForm.end_time = JSON.stringify(this.psb_ruleForm.end_time).slice(1, 11)
				let timestamp3 = Date.parse(new Date(this.psb_ruleForm.end_time));
				timestamp3 = timestamp3 / 1000 + 64800
				let date1 = new Date();
				date1.setTime(timestamp3 * 1000);
				let y1 = date1.getFullYear();
				let m1 = date1.getMonth() + 1;
				m1 = m1 < 10 ? ('0' + m1) : m1;
				let d1 = date1.getDate();
				d1 = d1 < 10 ? ('0' + d1) : d1;
				this.psb_ruleForm.end_time = y1 + '-' + m1 + '-' + d1

				if(this.psb_ruleForm.project_manager_name != '') {
					this.comPersonList.forEach((item) => {
						if(item.name === this.psb_ruleForm.project_manager_name) {
							this.$set(this.psb_ruleForm.project_manager, 'uid', item.uid)
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
						param.append("contract_num", this.psb_ruleForm.contract_num);
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
						if(this.picArr.length != 0) {
              var upload_enclosure_new = (fn)=>{
                for(let i = 0; i < this.picArr.length; i++) {
                  let formData = new FormData();
                  formData.append('file', this.picArr[i].raw);
                  formData.append('token', this.token);
                  let config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                  if(!this.picArr[i].size){
                    this.pic_hash_arr.push(this.picArr[i].hash);
                    this.pic_hash_arr.length === this.picArr.length && fn(this.picArr[i].name);
                  }else{
                    this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                      this.pic_hash_arr.push(res.data.hash)
                      if(this.pic_hash_arr.length === this.picArr.length) {
                        fn(this.picArr[i].name);
                      }
                    })
                  }
                }
              };
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append("uid", this.user.uid);
                nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
                  .then((res)=>{
                    this.afile_hash_arr.push({
                      "type": 3,
                      "contract_id": res.data.data.enclosure_id,
                      name,
                    })
                    let aDate = Date.parse(new Date());
                    this.pic_time = aDate
                  })
              })
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
                if(!this.fileArr[i].size){
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute=attribute.substr(1)
                  }
                  let file_name = this.fileArr[i].name.slice(0, index)
                  let param = new URLSearchParams();
                  param.append("uid", this.user.uid);
                  param.append("attribute", attribute);
                  param.append("attachments", this.fileArr[i].hash);
                  param.append("file_name", file_name);
                  this.$http.post("/index.php/Mobile/approval/add_attachments", param)
                    .then((res)=>{
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
                }else {
                  this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
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
					}
				}, 500)

			},
		},
		watch: {
			file_time() {
				console.log(this.picArr.length)
				if(this.picArr.length != 0) {
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
					param.append("contract_id", this.psb_ruleForm.contract_id);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("contract_num", this.psb_ruleForm.contract_num);
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
				console.log(this.fileArr.length)
				if(this.fileArr.length != 0) {
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
					param.append("contract_id", this.psb_ruleForm.contract_id);
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
					param.append("contract_num", this.psb_ruleForm.contract_num);
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
		position: relative;
		.el-select {
			width: 100%;
		}
	}

	.hetongExhibit {
		position: absolute;
		top: -100px;
		left: -10px;
		width: 580px;
		background: darkseagreen;
		height: 1300px;
		z-index: 10;
		background: #FFFFFF;
	}

	.hetongList {
		position: absolute;
		top: -100px;
		left: -10px;
		width: 560px;
		background: cornflowerblue;
		height: 1280px;
		z-index: 10;
		padding: 10px;
		background: #FFFFFF;
		>.list {
			font-size: 14px;
			height: 70px;
			oz-box-shadow: 1px 1px 2px #999999;
			-webkit-box-shadow: 1px 1px 2px #999999;
			box-shadow: 1px 1px 2px #999999;
			margin-top: 10px;
			>.content {
				display: inline-block;
				width: 470px;
				margin-left: 10px;
				span {
					height: 28px;
					line-height: 28px;
					display: block;
				}
			}
			>.view {
				display: inline-block;
				>button {
					margin: 0;
					display: block;
					padding: 4px 12px;
					margin-top: 8px;
				}
			}
		}
	}
</style>
