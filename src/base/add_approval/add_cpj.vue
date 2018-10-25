<template>
	<div class="chengpijian" >
		<el-form v-show="true" :model="cpj_ruleForm" :rules="cpj_rules" ref="cpj_ruleForm" label-width="150px" class="demo-cpj_ruleForm">
			<el-form-item label="呈批部门" prop="department_name">
				<el-select v-model="cpj_ruleForm.department_name" placeholder="请选择呈批部门">
					<el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="呈批标题" prop="title">
				<el-input v-model="cpj_ruleForm.title"></el-input>
			</el-form-item>
			<el-form-item label="文件编号" prop="chengpi_num">
				<el-input v-model="cpj_ruleForm.chengpi_num"></el-input>
			</el-form-item>
			<el-form-item label="主题内容" prop="content">
				<el-input v-model="cpj_ruleForm.content"></el-input>
			</el-form-item>
			<el-form-item label="项目负责人(部门经理)">
				<el-select v-model="cpj_ruleForm.project_manager_name" placeholder="请选择" @change="cpjSelectOk">
					<el-option v-for="item in comPersonList"
                     :key="item.personnel_id"  :label="item.name" :value="item.uid">
						<img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
						<span style="float: left;margin-left: 20px;">{{ item.name }}</span>
						<span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
					</el-option>
				</el-select>
			</el-form-item>

      <el-upload class="upload-demo" id="picc" v-model="cpj_ruleForm.many_enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
      </el-upload>
      <el-upload class="upload-demo_a" v-model="cpj_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
        <el-button size="small" type="info" plain>上传文件</el-button>
        <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
      </el-upload>
      <more ref="more"></more>
      <div style="color: #5a5e66;font-size: 14px;margin-top: 10px">
        <p>审批流程</p>
        <li v-for="(item,index) in userList" style="list-style: none;margin-top: 5px;margin-left: 10px">
          <span>{{item.name}}(<span v-for="list in item.require">{{list}},</span><span v-for="pr in item.option">{{pr}},</span><span v-show="item.enclosure_describe">附件:{{item.enclosure_describe}}</span>)</span>
        </li>
      </div>
			<el-form-item>
				<el-button type="primary" @click="submitForm_cpj('cpj_ruleForm')">立即添加</el-button>
			</el-form-item>
		</el-form>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
	import loading from '@/base/loading/loading'
  import { getPic } from '@/common/js/pic.js'
  import chose from '@/base/unit/chose'
  import fuchose from '@/base/unit/fuchose'
  import datas from '@/base/unit/datas'
  import sec from '@/base/unit/sec'
  import { getAvatar } from '@/common/js/avatar.js'
	import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
	import { mapGetters, mapMutations } from 'vuex'
  import more from '@/base/add_approval/more'
	export default {
		data() {
			return {
				fileList: [],
        shuju:[],
        conpents:[],
        fileList_a:[],
				picArr: [],
				fileArr: [],
				cpj_ruleForm: {
					department_id: '',
					department_name: '',
					content: '',
					chengpi_num: '',
					title: '',
					project_manager_name: '',
					project_manager: {},
          many_enclosure : {}
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
				loadingShow: false,
				pic_index: 0,
				img_arr: [],
				pic_enclosure_id: '',
        res:'',
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
			loading,
      chose,
      fuchose,
      sec,
      datas,
      more
		},
		methods: {
			handleRemove(file, fileList) {
				this.fileList = fileList
			},
			handlePreview(file, fileList) {
        if(file.name.toLowerCase().indexOf('jpg') == '-1' && file.name.toLowerCase().indexOf('png') == '-1'){
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
			  //后缀
        let index = file.name.lastIndexOf('.')
        let attribute = file.name.slice(index)
        if(attribute.substr(0,1)=='.'){
          attribute=attribute.substr(1)
        }
        let str = this.$test("/index.php/Mobile/find/file_info")
        this.$http.post(str)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            let attr = res.data.data.attribute
            if(attr.indexOf(attribute) !=-1){
              this.fileList_a = fileList_a
            }else{
              this.$message.error('上传文件格式错误 请删除')
              this.fileList_a = fileList_a
            }

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
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
				this.$http.post(str, param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
						this.form_Lista = create_cengpijian_list(res.data.data)
						this.cpj_ruleForm.department_id = this.form_Lista.department_id
						this.cpj_ruleForm.department_name = this.form_Lista.department_name
            this.cpj_ruleForm.project_manager = JSON.parse(this.form_Lista.project_manager)
						this.cpj_ruleForm.content = this.form_Lista.content
						this.cpj_ruleForm.chengpi_num = this.form_Lista.chengpi_num
						this.cpj_ruleForm.title = this.form_Lista.title
						this.cpj_ruleForm.project_manager_name = this.form_Lista.project_manager_name
            this.cpj_ruleForm.many_enclosure = this.form_Lista.many_enclosure
            this.form_Lista.many_enclosure.forEach((item)=>{
              let img_name = item.name
              if (item.type === 3){
                let param = new URLSearchParams();
                param.append("enclosure_id", item.contract_id);
                let str = this.$test("/index.php/Mobile/approval/look_enclosure")
                this.$http.post(str,param)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    res.data.data.picture.forEach((item) => {
                      //item 就是hash
                      let obj = {}
                      var str = process.env.NODE_ENV
                      var picLeader = ''
                      str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                      let img_add = picLeader +item
                      obj.hash = item
                      obj.name = img_name
                      obj.url = img_add
                      this.fileList.push(obj)
                    })
                  })
              }else if(item.type === 4){
                let param = new URLSearchParams();
                param.append("attachments_id", item.contract_id);
                let str = this.$test("/index.php/Mobile/approval/look_attachments")
                this.$http.post(str, param)
                  .then((res) => {
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    let obj = {}
                    let file_data = res.data.data
                    var str = process.env.NODE_ENV
                    var picLeader = ''
                    str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                    let file_add = picLeader + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                    obj.name = file_data.file_name+'.'+file_data.attribute
                    obj.address = file_add
                    obj.hash = file_data.attachments
                    this.fileList_a.push(obj)
                  })
              }else if(item.type === 5){
                let param = new URLSearchParams();
                param.append("id", item.contract_id);
                let str = this.$test('/index.php/Mobile/approval/look_enclosure_approval')
                this.$http.post(str,param)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    if(res.data.code == 0){
                      res.data.data.forEach((item)=>{
                        switch (item.type) {
                          case '12':
                            item.type ='验收单'
                            break;
                          case '14':
                            item.type ='结算单'
                            break;
                        }
                        item.approval_state = get_state(item.approval_state)
                        this.$refs.more.ys_list.push(item)
                      })
                    }
                  })
                function get_state(state){
                  if(state === '0'){
                    return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
                  }else if(state === '1'){
                    return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
                  }else if(state === '2'){
                    return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
                  }else if(state === '3'){
                    return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
                  }
                }
              }else if(item.type === 6){
                let param = new URLSearchParams();
                param.append("id", item.contract_id);
                let str = this.$test('/index.php/Mobile/approval/look_enclosure_payroll')
                this.$http.post(str,param)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    if(res.data.code == 0){
                      res.data.data.forEach((item)=>{
                        item.pryroll_status = get_states(item.pryroll_status)
                        this.$refs.more.gz_list.push(item)
                      })
                    }
                  })
                function get_states(state){
                  if(state === '0'){
                    return '<span style="color:#409EFF">待处理<i class="el-icon-loading" style="margin-left:4px"></i></span>'
                  }else if(state === '1'){
                    return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
                  }else if(state === '2'){
                    return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
                  }else if(state === '-1'){
                    return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
                  }else if(state === '99'){
                    return '<span style="color:#67C23A">已确认<i class="el-icon-success" style="margin-left:4px"></i></span>'
                  }
                }
              }
            })
					})
			},
      //触发事件
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
        let str = this.$test("/index.php/Mobile/path/get_token")
				this.$http.post(str, nparam)
					.then((res) => {
						localStorage.token = JSON.stringify(res.data.data);
						this.setToken(res.data.data)
					})
			},
			...mapMutations({
				setToken: 'SET_TOKEN'
			}),
			cpjSelectOk(tab) {
        this.handler = tab
        if(!this.cpj_ruleForm.project_manager){
          this.cpj_ruleForm.project_manager = new Object()
        }
				this.comPersonList.forEach((item) => {
					if(item.uid === tab) {
						this.$set(this.cpj_ruleForm.project_manager, 'uid', item.uid)
					}
				})
			},
      //判断文件内容
			submitForm_cpj(formName) {
        this.loading_show = true
        this.$refs.more.submit()
        setTimeout(()=>{
          this.comDepartList.forEach((item) => {
            if(item.department_name === this.cpj_ruleForm.department_name) {
              this.cpj_ruleForm.department_id = item.department_id
            }
          })
          this.$refs[formName].validate((valid) => {
            if(valid) {
              this.cpj_submit()
            } else {
              this.$message.error('请将表单填写完整');
              this.$refs.more.file = []
              return false;
            }
          });
        },500)
			},
      //提交
			cpj_submit() {
				this.picArr = []
				this.fileArr = []
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
						this.picArr.push(item)
					}
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
        var more = this.$refs.more
				setTimeout(() => {
          if(this.picArr.length === 0 && this.fileArr.length === 0 ) {
						let param = new URLSearchParams();
						let todo = JSON.stringify(this.cpj_ruleForm.project_manager)
            if(todo != 'null'){
              param.append("project_manager", todo);
            }
						param.append("uid", this.user.uid);
						param.append("company_id", this.nowCompanyId);
						param.append("department_id", this.cpj_ruleForm.department_id);
						param.append("content", this.cpj_ruleForm.content);
						param.append("chengpi_num", this.cpj_ruleForm.chengpi_num);
						param.append("title", this.cpj_ruleForm.title);
						if(more.file.length > 0){
              param.append("many_enclosure", JSON.stringify([...more.file]));
            }
            let str = this.$test("/index.php/Mobile/approval/add_chengpi")
						this.$http.post(str, param)
							.then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
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
					  //图片的判断
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
                let str = this.$test("/index.php/Mobile/approval/upload_enclosure_new")
                this.$http.post(str, nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
                    this.afile_hash_arr.push({
                      "type": 3,
                      "contract_id": res.data.data.enclosure_id,
                      name,
                    })
                    let aDate = Date.parse(new Date())
                    this.pic_time = aDate
                  })
              })
              // Promise.all(this.picArr.map((item,i)=>{
              //   if(!item.size){
              //     return  item.hash
              //   }else{
              //     return new Promise((resolve,reject)=>{
              //       let formData = new FormData();
              //       formData.append('file', item.raw);
              //       formData.append('token', this.token);
              //       let config = {
              //         headers: {
              //           'Content-Type': 'multipart/form-data'
              //         }
              //       }
              //       this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
              //         resolve(res.data.hash)
              //       })
              //     })
              //   }
              // })).then((pic_hash_arr)=>{
              //   let nparam = new URLSearchParams()
              //   nparam.append("uid", this.user.uid);
              //   nparam.append("picture", JSON.stringify(pic_hash_arr));
              //   this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
              //     .then((res)=>{
              //       this.afile_hash_arr.push({
              //         "type": 3,
              //         "contract_id": res.data.data.enclosure_id,
              //         name: this.picArr[0].name,
              //       })
              //       let aDate = Date.parse(new Date())//看下把
              //       this.pic_time = aDate
              //     })
              // })
						}
						//文档的判断
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
                  let str = this.$test("/index.php/Mobile/approval/add_attachments")
                  this.$http.post(str, param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
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
                  let str = this.$test("/index.php/Mobile/find/file_info")
                  this.$http.post(str)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
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
                            let str = this.$test("/index.php/Mobile/approval/add_attachments")
                            this.$http.post(str, param)
                              .then((res) => {
                                var current = this
                                var judge = res.data.code
                                this.$testLogin(judge,current)
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
				},500)
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
					if(this.cpj_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", this.cpj_ruleForm.chengpi_num);
					param.append("title", this.cpj_ruleForm.title);
          var more = this.$refs.more
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr,...more.file]));
          let str = this.$test("/index.php/Mobile/approval/add_chengpi")
					this.$http.post(str, param)
						.then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
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
					if(this.cpj_ruleForm.project_manager.uid) {
						param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
					}
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("department_id", this.cpj_ruleForm.department_id);
					param.append("content", this.cpj_ruleForm.content);
					param.append("chengpi_num", this.cpj_ruleForm.chengpi_num);
					param.append("title", this.cpj_ruleForm.title);
          var more = this.$refs.more
					param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr,...more.file]));
          let str = this.$test("/index.php/Mobile/approval/add_chengpi")
					this.$http.post(str, param)
						.then((res) => {
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
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
		}
	}
</script>

<style lang="scss">
	.el-select {
		width: 100%;
	}
  .el-upload--picture-card{
    width: 85px;
    height: 85px;
    .el-upload-list__item.is-success{
      width: 85px;
      height: 85px;
    }
  }
  #picc{
    ul{
      li{
        width: 85px;
        height: 85px;
      }
    }
  }
  .el-icon-plus{
    position: relative;
    top: -25px;
  }
  .upload-demo_a{
    margin-top: 20px;
  }
  .el-button.el-button--primary{
    margin-top: 10px;
  }
</style>
