<template>
  <div class="chengpijian" >
    <el-form v-show="true" :model="cpj_ruleForm" :rules="cpj_rules" ref="cpj_ruleForm" label-width="150px" class="demo-cpj_ruleForm">

      <el-form-item label="呈批标题" prop="title">
        <el-input v-model="cpj_ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文件编号" prop="chengpi_num">
        <el-input v-model="cpj_ruleForm.chengpi_num"></el-input>
      </el-form-item>
      <el-form-item label="主题内容" prop="content">
        <el-input v-model="cpj_ruleForm.content"></el-input>
      </el-form-item>


      <el-upload class="upload-demo" id="picc" v-model="cpj_ruleForm.many_enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
        <i class="el-icon-plus"></i>
        <!--<el-button size="small" type="info" plain id="juz">上传图片</el-button>-->
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
      </el-upload>
      <el-upload class="upload-demo_a" v-model="cpj_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
        <el-button size="small" type="info" plain>上传文本</el-button>
        <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
      </el-upload>
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
  import {getCro} from "@/common/js/crowd";
  import chose from '@/base/unit/chose'
  import fuchose from '@/base/unit/fuchose'
  import datas from '@/base/unit/datas'
  import sec from '@/base/unit/sec'
  import { getAvatar } from '@/common/js/avatar.js'
  import { create_cengpijian_list } from '@/common/js/approval/cengpijian'
  import { mapGetters, mapMutations } from 'vuex'
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
        pic_times:0,
        file_times:0
      }
    },
    props: {
      approval_id: {
        type: String
      },
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
      datas
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
        //后缀
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
      initial_data() {
        console.log(this.approval_id)
        if(!this.approval_id) {
          return
        }
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("approval_personal_id", this.approval_id);
        this.fileList=[]
        this.$http.post("index.php/Mobile/Personal/approval_personal_process_show", param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            this.form_Lista = create_cengpijian_list(res.data.data)
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
                this.$http.post("index.php/Mobile/approval/look_enclosure",param)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    res.data.data.picture.forEach((item) => {
                      //item 就是hash
                      let obj = {}
                      var str = process.env.NODE_ENV
                      var picLeader = ''
                      str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                      let img_add = picLeader+item
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
                    var str = process.env.NODE_ENV
                    var picLeader = ''
                    str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
                    let file_data = res.data.data
                    let file_add = picLeader+ file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                    obj.name = file_data.file_name+'.'+file_data.attribute
                    obj.address = file_add
                    obj.hash = file_data.attachments
                    this.fileList_a.push(obj)
                  })
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
        this.$http.post("/index.php/Mobile/path/get_token", nparam)
          .then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
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
      //判断文件内容
      submitForm_cpj(formName) {
        this.comDepartList.forEach((item) => {
          if(item.department_name === this.cpj_ruleForm.department_name) {
            this.cpj_ruleForm.department_id = item.department_id
          }
        })
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.cpjs_submit()
            this.loading_show = true
          } else {
            this.$message.error('请将表单填写完整');
            return false;
          }
        });
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

        if(this.cpj_ruleForm.project_manager_name != '') {
          this.comPersonList.forEach((item) => {
            if(item.name === this.cpj_ruleForm.project_manager_name) {
              this.$set(this.cpj_ruleForm.project_manager, 'uid', item.uid)
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
            if(this.cpj_ruleForm.project_manager.uid) {
              param.append("project_manager", JSON.stringify(this.cpj_ruleForm.project_manager));
            }
            param.append("uid", this.user.uid);
            param.append("company_id", this.nowCompanyId);
            param.append("department_id", this.cpj_ruleForm.department_id);
            param.append("content", this.cpj_ruleForm.content);
            param.append("chengpi_num", this.cpj_ruleForm.chengpi_num);
            param.append("title", this.cpj_ruleForm.title);
            this.$http.post("/index.php/Mobile/approval/add_chengpi", param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                this.loadingShow = false
                if(res.data.code === 0) {
                  this.add_ok()
                  this.loading_show = false
                  this.$router.push({
                    path: '/work/exam'
                  })
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
                  this.$http.post("/index.php/Mobile/approval/add_attachments", param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
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
                                var current = this
                                var judge = res.data.code
                                getCro(judge,current)
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
      cpjs_submit(){
        this.picArr = []
        this.fileArr = []
        this.fileList.forEach((item)=>{
          if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf('图像') != '-1'){
            this.picArr.push(item)
          }
        })
        this.fileList_a.forEach((item)=>{
          this.fileArr.push(item)
        })
        this.pic_hash_arr = []
        this.afile_hash_arr = []
        this.file_hash_arr = []
        this.file_times = 0
        this.pic_times = 0
        this.loadingShow = true
        setTimeout(()=>{
          if(this.picArr.length == 0 && this.fileArr.length == 0){
            let param = new URLSearchParams()
            param.append('uid',this.user.uid)
            param.append('content',this.cpj_ruleForm.content)
            param.append('chengpi_num',this.cpj_ruleForm.chengpi_num)
            param.append('title',this.cpj_ruleForm.title)
            param.append('handler_uid',this.$parent.u_id)
            this.$http.post('index.php/Mobile/personal/add_personal_chengpi',param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                this.loadingShow = false
                if(res.data.code == 0){
                  this.add_ok()
                  this.$refs.cpj_ruleForm.resetFields()
                  this.$parent._reInfo()
                }else{
                  this.add_fail()
                }
              })
          }else{
            if(this.picArr.length != 0){
              var upload_enclosure_new = (fn) =>{
                for(let i = 0;i<this.picArr.length;i++){
                  let formData = new FormData
                  formData.append('file',this.picArr[i].raw)
                  formData.append('token',this.token)
                  let config = {
                    headers:{
                      'Content-Type':'multipart/form-data'
                    }
                  }
                  if(!this.picArr[i].size){
                    this.pic_hash_arr.push(this.picArr[i].hash)
                    this.pic_hash_arr.length == this.picArr.length && fn(this.picArr[i].name)
                  }else{
                    this.$http.post('http://up.qbox.me/',formData,config).then((res)=>{
                      this.pic_hash_arr.push(res.data.hash)
                      if(this.pic_hash_arr.length == this.picArr.length){
                        fn(this.picArr[i].name)
                      }
                    })
                  }
                }
              }
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append('uid',this.user.uid)
                nparam.append('picture',JSON.stringify(this.pic_hash_arr))
                this.$http.post('/index.php/Mobile/approval/upload_enclosure_new',nparam)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    getCro(judge,current)
                    this.afile_hash_arr.push({
                      'type':3,
                      'contract_id':res.data.data.enclosure_id,
                      name
                    })
                    let aDate = Date.parse(new Date())
                    this.pic_times = aDate
                  })
              })
            }
            if(this.fileArr.length != 0){
              for(let i = 0;i<this.fileArr.length;i++){
                let formData = new FormData
                formData.append('file',this.fileArr[i].raw)
                formData.append('token',this.token)
                let config = {
                  headers:{
                    'Content-Type':'multipart/form-data'
                  }
                }
                if(!this.fileArr[i].size){
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1) == '.'){
                    attribute = attribute.substr(1)
                  }
                  let file_name = this.fileArr[i].name.slice(0,index)
                  let param = new URLSearchParams()
                  param.append('uid',this.user.uid)
                  param.append('attribute',attribute)
                  param.append('attachments',this.fileArr[i].hash)
                  param.append('file_name',file_name)
                  this.$http.post('/index.php/Mobile/approval/add_attachments',param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
                      this.file_hash_arr.push({
                        'type':4,
                        'contract_id':res.data.data.attachments_id,
                        'name':this.fileArr[i].name
                      })
                      if(this.file_hash_arr.length == this.picArr.length){
                        let bDate = Date.parse(new Date())
                        this.file_times = bDate
                      }
                    })
                }else{
                  let size = this.fileArr[i].size
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1) == '.'){
                    attribute = attribute.substr(1)
                  }
                  this.$http.post('/index.php/Mobile/find/file_info')
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      getCro(judge,current)
                      let maxSize = res.data.data.max
                      let attr = res.data.data.attribute
                      if(attr.indexOf(attribute) != -1){
                        if(size<maxSize){
                          this.$http.post('https://up.qbox.me/',formData,config).then((res)=>{
                            let file_name = this.fileArr[i].name.slice(0,index)
                            let param = new URLSearchParams()
                            param.append('uid',this.user.uid)
                            param.append('attribute',attribute)
                            param.append('attachments',res.data.hash)
                            param.append('file_name',file_name)
                            this.$http.post('/index.php/Mobile/approval/add_attachments',param)
                              .then((res)=>{
                                this.file_hash_arr.push({
                                  'type':4,
                                  'contract_id':res.data.data.attachments_id,
                                  'name':this.fileArr[i].name
                                })
                                if(this.file_hash_arr.length == this.fileArr.length){
                                  let bDate = Date.parse(new Date())
                                  this.file_times = bDate
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
          param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
          this.$http.post("/index.php/Mobile/approval/add_chengpi", param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              this.loadingShow = false
              if(res.data.code === 0) {
                this.add_ok()
                this.loading_show = false
                this.$router.push({
                  path: '/work/exam'
                })
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
          param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
          this.$http.post("/index.php/Mobile/approval/add_chengpi", param)
            .then((res) => {
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              if(res.data.code === 0) {
                this.add_ok()
                this.loading_show = false
                this.$router.push({
                  path: '/work/exam'
                })
              } else {
                this.add_fail()
              }
            })
        }
      },
      file_times(){
        if(this.picArr.length != 0){
          if(this.pic_times == 0){
            return
          }
        }
        console.log(this.pic_times)
        if(this.pic_times != 0 || this.file_times != 0){
          let param = new URLSearchParams()
          param.append('uid',this.user.uid)
          param.append('content',this.cpj_ruleForm.content)
          param.append('chengpi_num',this.cpj_ruleForm.chengpi_num)
          param.append('title',this.cpj_ruleForm.title)
          param.append('handler_uid',this.$parent.u_id)
          param.append('many_enclosure',JSON.stringify([...this.file_hash_arr,...this.afile_hash_arr]))
          this.$http.post('index.php/Mobile/personal/add_personal_chengpi',param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.add_ok()
                this.$refs.cpj_ruleForm.resetFields()
                this.$parent._reInfo()
              }else{
                this.add_fail()
              }
            })
        }
      },
      pic_times(){
        if(this.fileArr.length != 0){
          if(this.file_times == 0){
            return
          }
        }
        if(this.file_times != 0 || this.pic_times != 0){
          let param = new URLSearchParams()
          param.append('uid',this.user.uid)
          param.append('content',this.cpj_ruleForm.content)
          param.append('chengpi_num',this.cpj_ruleForm.chengpi_num)
          param.append('title',this.cpj_ruleForm.title)
          param.append('handler_uid',this.$parent.u_id)
          param.append('many_enclosure',JSON.stringify([...this.file_hash_arr,...this.afile_hash_arr]))
          this.$http.post('index.php/Mobile/personal/add_personal_chengpi',param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              getCro(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.add_ok()
                this.$refs.cpj_ruleForm.resetFields()
                this.$parent._reInfo()
              }else{
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
