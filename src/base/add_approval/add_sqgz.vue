<template>
	<div class="shenqinggongzhang">
		<el-form :model="sqgz_ruleForm" :rules="sqgz_rules" ref="sqgz_ruleForm" label-width="150px" class="demo-sqgz_ruleForm">
			<el-form-item label="用章部门" prop="departmental">
				<el-select v-model="sqgz_ruleForm.departmental" placeholder="请选择申请部门">
					<el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="申请人" prop="user_name">
				<el-input v-model="sqgz_ruleForm.user_name"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="sqgz_ruleForm.project_manager_name" placeholder="请选择" @change="sqgzSelectOk">
					<el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<div class="add_sqgz">添加清单条目 <i class="el-icon-circle-plus" @click="add_sqgz"></i></div>
			<div>
				<el-form v-for="(item,index) in sqgz_ruleForm.add" :rules="sqgz_rules"  label-width="150px" :key="index">
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
					<el-form-item label="数量" prop="num">
						<!--<el-input v-model.number="item.num"></el-input>-->
            <input type="tel" class="el-input__inner" @change="checkNum(item)" v-model="item.num" id="num">
					</el-form-item>
					<el-form-item label="公司名称">
						<el-input v-model="item.name_company"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="item.remarks"></el-input>
					</el-form-item>
				</el-form>
			</div>

			<el-upload class="upload-demo" id="picc" multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" accept="image/jpg,image/png,image/jpeg" :file-list="fileList" list-type="picture-card"  :auto-upload="false">
        <i class="el-icon-plus"></i>
        <!--<el-button size="small" type="info" plain id="juz">上传图片</el-button>-->
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
			</el-upload>

      <el-upload class="upload-demo_a" multiple action="https://up.qbox.me/" :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
        <el-button size="small" type="info" plain>上传文本</el-button>
        <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
      </el-upload>
      <div style="color: #5a5e66;font-size: 14px;margin-top: 10px">
        <p>审批流程</p>
        <li v-for="(item,index) in userList" style="list-style: none;margin-top: 5px;margin-left: 10px">
          <span>{{item.name}}(<span v-for="list in item.require">{{list}},</span><span v-for="pr in item.option">{{pr}},</span><span v-show="item.enclosure_describe">附件:{{item.enclosure_describe}}</span>)</span>
        </li>
      </div>
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
  import {getCro} from "@/common/js/crowd";
	import { mapGetters, mapMutations } from 'vuex'
	import { create_gongzhang_list } from '@/common/js/approval/gongzhang.js'
	export default {
		data() {
			return {
				fileList: [],
        fileList_a:[],
				picArr: [],
				fileArr: [],
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
					name_company: [{
						required: true,
						message: '请填写公司名称',
						trigger: 'change'
					}],
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
        str:'',
        handler:''
			}
		},
		props: {
			approval_id: {
				type: String
			},
      userList:{

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
			handleRemove(file, fileList) {
				this.fileList = fileList
			},
			handlePreview(file, fileList) {
        if(file.name.indexOf('jpg') == '-1' && file.name.indexOf('png') == '-1'){
          this.$message.error('上传文件格式错误')
          this.str = file
        }
        function remove(arr,val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        remove(fileList,this.str)
        this.fileList = fileList
			},
      handleRemove_a(file, fileList_a) {
        this.fileList_a = fileList_a
      },
      handlePreview_a(file, fileList_a){
        let index = file.name.lastIndexOf('.')
        let attribute = file.name.slice(index)
        if(attribute.substr(0,1)=='.'){
          attribute=attribute.substr(1)
        }
        this.$http.post("/index.php/Mobile/find/file_info")
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            let attr = res.data.data.attribute
            if(attr.indexOf(attribute) !=-1){
              this.fileList_a = fileList_a
            }else{
              this.$message.error('上传文件格式错误 请删除')
              this.fileList_a = fileList_a
            }

          })
      },
      checkNum:function (data) {
        var numReg =  /^[1-9]\d*$/
        if(!numReg.test(data.num)){
          this.$message({
            showClose: true,
            message: '请输入正整数',
            type: 'error'
          })
          data.num = "";
        }
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
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						this.form_Lista = create_gongzhang_list(res.data.data)
						this.sqgz_ruleForm.user_name = this.form_Lista.user_name
						this.sqgz_ruleForm.departmental = this.form_Lista.department_name
						this.sqgz_ruleForm.department_id = this.form_Lista.department_id
						this.sqgz_ruleForm.add = this.form_Lista.info
						this.sqgz_ruleForm.project_manager_name = this.form_Lista.project_manager_name
            this.sqgz_ruleForm.project_manager = this.form_Lista.project_manager
						this.sqgz_ruleForm.add.forEach((item, index) => {
							if(item.seal_type === '公章') {
								this.sqgz_ruleForm.add[index].seal_type = '1'
							} else if(item.seal_type === '法人章') {
								this.sqgz_ruleForm.add[index].seal_type = '2'
							} else if(item.seal_type === '财务章') {
								this.sqgz_ruleForm.add[index].seal_type = '3'
							} else if(item.seal_type === '发票章') {
								this.sqgz_ruleForm.add[index].seal_type = '4'
							} else if(item.seal_type === '合同章') {
								this.sqgz_ruleForm.add[index].seal_type = '5'
							}

						})
            this.sqgz_ruleForm.many_enclosure = this.form_Lista.many_enclosure
            this.form_Lista.many_enclosure.forEach((item)=>{
              if (item.type === 3) {
                let img_name = item.name
                let param = new URLSearchParams();
                param.append("enclosure_id", item.contract_id);
                this.$http.post("index.php/Mobile/approval/look_enclosure", param)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    res.data.data.picture.forEach((item) => {
                      //item 就是hash
                      let obj = {}
                      let img_add = 'http://bbsf-file.hzxb.net/' + item
                      console.log(img_add)
                      obj.hash = item
                      obj.name = img_name
                      obj.url = img_add
                      this.fileList.push(obj)
                      console.log(this.fileList)
                    })
                  })
              }else if(item.type === 4){
                let param = new URLSearchParams();
                param.append("attachments_id", item.contract_id);
                this.$http.post("/index.php/Mobile/approval/look_attachments", param)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    let obj = {}
                    let file_data = res.data.data
                    let file_add = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                    obj.name = file_data.file_name+'.'+file_data.attribute
                    obj.address = file_add
                    obj.hash = file_data.attachments
                    this.fileList_a.push(obj)
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
			  this.handler = tab
				this.comPersonList.forEach((item) => {
					if(item.uid === tab) {
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
					var re = /^[0-9]+$/;　　
					if(!re.test(item.num)) {　　　　
						this.$message.error('数量请填正整数');　　　　
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
						return false;
					}
				});
			},
			sqgz_submit() {
				this.picArr = []
				this.fileArr = []
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1'|| item.name.indexOf("图像") != '-1') {
						this.picArr.push(item)
					}
				// 	else {
				// 		this.fileArr.push(item)
				// 	}
				})
        this.fileList_a.forEach((item) =>{
          this.fileArr.push(item)
        })
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.file_time = 0
				this.pic_time = 0
				this.loadingShow = true
				setTimeout(() => {
					if(this.picArr.length === 0 && this.fileArr.length === 0) {
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
                var current = this
                var judge = res.data.code
                getCro(judge,current)
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
              }
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append("uid", this.user.uid);
                nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    this.afile_hash_arr.push({
                      "type": 3,
                      "contract_id": res.data.data.enclosure_id,
                      name,
                    })
                    let aDate = Date.parse(new Date())//看下把
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
                }else{
                  let size = this.fileArr[i].size
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute=attribute.substr(1)
                  }
                  this.$http.post("/index.php/Mobile/find/file_info")
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
                      let maxSize = res.data.data.max
                      let attr = res.data.data.attribute
                      if(attr.indexOf(attribute) !=-1){
                        if(size<maxSize){
                          this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
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
                        }else{
                          this.$message.error('上传文件过大 请删除')
                          this.loadingShow = false
                          return false
                        }
                      }else{
                        this.$message.error('请删除'+this.fileArr[i].name)
                        this.loadingShow = false
                        return false
                      }
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
				if(this.picArr.length != 0) {
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
              var current = this
              var judge = res.data.code
              getCro(judge,current)
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
				if(this.fileArr.length) {
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
              var current = this
              var judge = res.data.code
              getCro(judge,current)
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
