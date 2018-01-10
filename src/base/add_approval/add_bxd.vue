<template>
  <div class="baoxiaodan">
    <el-form :model="bxd_ruleForm" :rules="bxd_rules" ref="bxd_ruleForm" label-width="150px" class="demo-bxd_ruleForm">
      <el-form-item label="报销部门" prop="department_name">
        <el-select v-model="bxd_ruleForm.department_name" placeholder="请选择报销部门">
          <el-option v-for="item in comDepartList" :value="item.department_name" :key="item.department_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报销人" prop="baoxiaoren">
        <el-input v-model="bxd_ruleForm.baoxiaoren"></el-input>
      </el-form-item>

      <div class="add_bxd">添加报销条目 <i class="el-icon-circle-plus" @click="add_bxd"></i></div>
      <div v-for="(item,index) in bxd_ruleForm.add" class="new_bxd">
        <div class="close"><i class="fa fa-close" v-show="bxd_ruleForm.add.length > 1" @click="closeQd(index)"></i></div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="日期" prop="start_time">
            <el-date-picker type="date" v-model="bxd_ruleForm.month_day" style="width: 200px"></el-date-picker>
          </el-form-item>
          <el-form-item label="报销内容">
            <el-input v-model="item.content"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="金额">
            <el-input v-model="item.price"></el-input>
          </el-form-item>
          <el-form-item label="单据张数">
            <el-input v-model="item.amount"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="备注">
            <el-input v-model="item.remarks"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <el-form-item label="项目负责人(部门经理)">
        <el-select v-model="bxd_ruleForm.project_manager_name" placeholder="请选择" @change="bxdSelectOk">
          <el-option v-for="item in comPersonList" :key="item.personnel_id" :value="item.name">
            <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
            <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-upload class="upload-demo" v-model="bxd_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
        <el-button size="small" type="info" plain>上传文件</el-button>
      </el-upload>

      <el-form-item>
        <el-button type="primary" @click="submitForm_bxd('bxd_ruleForm')">立即添加</el-button>
        <!--<el-button @click="resetForm('cpj_ruleForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
    <loading v-show="loadingShow"></loading>
  </div>
</template>

<script>
  import loading from '@/base/loading/loading'
  import { getPic } from '@/common/js/pic.js'
  import { getAvatar } from '@/common/js/avatar.js'
  import { create_baoxiaodan_list } from '@/common/js/approval/baoxiaodan'
  import { mapGetters, mapMutations } from 'vuex'
      export default {
        data(){
          return{
            fileList:[],
            picArr:[],
            fileArr:[],
            bxd_ruleForm:{
              department_id:'',
              department_name:'',
              content:'',
              project_manager: {},
              project_manager_name: '',
              add:[{
                month_day:'',
                content:'',
                amount:'',
                price:'',
                remarks:''
              }]

            },
            bxd_rules:{
              department_name:[{
                required: true,
                message: '请填写报销部门',
                trigger: 'change'
              }],
              baoxiaoren:[{
                required: true,
                message: '请填写报销人',
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
            img_arr: [],
            pic_enclosure_id: ''
          }
        },
        props: {
          approval_id:{
            type: String
          }
        },
        created(){
          this._getToken()
          this.initial_data()
        },
        computed:{
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
        methods:{
          handleRemove(file,fileList){
            this.fileList = fileList
          },
          handlePreview(file,fileList){
            this.fileList=fileList
          },
          closeQd(index){
            this.bxd_ruleForm.add.splice(index,1)
          },
          initial_data(){
            if(!this.approval_id || this.approval_id === '') {
              return
            }
            let param = new URLSearchParams();
            param.append("uid",this.user.uid);
            param.append("approval_id",this.approval_id)
            this.$http.post("/index.php/Mobile/approval/approval_process_show", param)
              .then((res)=>{
                this.form_Lista = create_baoxiaodan_list(res.data.data)
                let department_name
                setTimeout(()=>{
                  this.comDepartList.forEach((item)=>{
                    if(item.department_id === this.form_Lista.request_buy_department) {
                      department_name = item.department_name
                    }
                  })
                  this.bxd_ruleForm.department_id = department_id
                })
              })
          },
          add_ok(){
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            });
          },
          add_fail(){
            this.$message({
              showClose: true,
              message: '添加失败',
              type: 'error'
            })
          },
          ctrl_pic_show(index){
            this.pic_index = index
            this.pic_show =true
          },
          getPic(event){
            this.pic = event.target.files;
          },
          getFile(event){
            this.file = event.target.files;
          },
          last_one(){
            if(this.pic_index ===0){
              return
            }
            --this.pic_index
          },
          next_one(){
            if(this.pic_index === this.img_arr.length - 1) {
              return
            }
            ++this.pic_index
          },
          close_pic(){
            this.pic_show = false
          },
          _getToken(){
            let nparam = new URLSearchParams();
            nparam.append("uid", this.user.uid);
            this.$http.post("/index.php/Mobile/path/get_token", nparam)
              .then((res) => {
                localStorage.token = JSON.stringify(res.data.data);
                this.setToken(res.data.data)
              })
          },
          ...mapMutations({
            setToken:'SET_TOKEN'
          }),
          bxdSelectOk(tab){
            this.comPersonList.forEach((item) => {
              console.log(item)
              if(item.name === tab) {
                this.$set(this.bxd_ruleForm.project_manager, 'uid', item.uid)
              }
            })
          },
          add_bxd(){
            let obj = {
              month_day:'',
              content:'',
              amount:'',
              price:'',
              remarks:''
            }
            this.bxd_ruleForm.add.push(obj)
          },
          submitForm_bxd(formName){
            this.comDepartList.forEach((item) => {
              if(item.department_name === this.bxd_ruleForm.department_name) {
                this.bxd_ruleForm.department_id = item.department_id
              }
            })
            this.$refs[formName].validate((valid) => {
              if(valid) {
                this.bxd_submit()
                this.loading_show = true
              } else {
                this.$message.error('请将表单填写完整');
                return false;
              }
            });
          },
          bxd_submit(){
            this.picArr =[]
            this.fileArr = []
            this.fileList.forEach((item)=>{
              if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1'){
                this.picArr.push(item)
              } else {
                this.fileArr.push(item)
              }
            })
            if (this.bxd_ruleForm.project_manager_name != ''){
              this.comPersonList.forEach((item) => {
                if(item.name === this.bxd_ruleForm.project_manager_name) {
                  this.$set(this.bxd_ruleForm.project_manager, 'uid', item.uid)
                }
              })
            }
            this.pic_hash_arr = []
            this.afile_hash_arr = []
            this.file_hash_arr = []
            this.file_time = 0
            this.pic_time = 0
            this.loadingShow = true
            setTimeout(()=>{
              if(this.picArr.length === 0 && this.fileArr.length === 0){
                let param = new URLSearchParams();
                if (this.bxd_ruleForm.project_manager.uid){
                  param.append("project_manager", JSON.stringify(this.bxd_ruleForm.project_manager));
                }
                param.append("uid",this.user.uid)
                param.append("company_id",this.nowCompanyId)
                param.append("department_id",this.bxd_ruleForm.department_id)
                param.append("content",this.bxd_ruleForm.content)
                param.append("month_day",this.bxd_ruleForm.month_day)
                param.append("amount",this.bxd_ruleForm.amount)
                param.append("price",this.bxd_ruleForm.price)
                param.append("remarks",this.bxd_ruleForm.remarks)
                param.append("money",this.bxd_ruleForm.money)
                param.append("title",this.bxd_ruleForm.title)

                this.$http.post("index.php/Mobile/approval/add_baoxiao",param)
                  .then((res)=>{
                    this.loading_show = false
                    if (res.data.code ===0){
                      this.add_ok()
                      this.loading_show = false
                      this.$router.push({
                        path: '/work/exam'
                      })
                    }else{
                      this.add_fail()
                    }
                  })
              }else{
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
                    //就是这一段加上判断是上传过的还是没上传
                    if(!this.picArr[i].size){
                      //foreach一下
                      this.pic_hash_arr.push(this.picArr[i].hash)
                      console.log(this.picArr[i].hash)
                      let nparam = new URLSearchParams()
                      nparam.append("uid", this.user.uid);
                      nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                      this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
                        .then((res)=>{
                          this.afile_hash_arr.push({
                            "type": 3,
                            "contract_id": res.data.data.enclosure_id,
                            "name": this.picArr[i].name
                          })
                          let aDate = Date.parse(new Date())
                          this.pic_time = aDate
                        })
                    }else{
                      this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
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
                    //请求七牛

                  }
                }
                //文档的判断
                if(this.fileArr.length != 0) {
                  for(let i = 0; i < this.fileArr.length; i++) {
                    console.log(this.fileArr[i])
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
                      this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                        let index = this.fileArr[i].name.lastIndexOf('.')
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
                    //这里

                  }
                }


              }
            },500)
          },
        },
        watch:{
          file_time(){
            if(this.picArr.length != 0){
              if(this.pic_time === 0) {
                return
              }
            }
            if(this.file_time != 0 || this.pic_time != 0){
              let param = new URLSearchParams();
              if(this.bxd_ruleForm.project_manager.uid){
                param.append("project_manager", JSON.stringify(this.bxd_ruleForm.project_manager));
              }
              param.append("uid",this.user.uid)
              param.append("company_id",this.nowCompanyId)
              param.append("department_id",this.bxd_ruleForm.department_id)
              param.append("content",this.bxd_ruleForm.content)
              param.append("month_day",this.bxd_ruleForm.month_day)
              param.append("amount",this.bxd_ruleForm.amount)
              param.append("price",this.bxd_ruleForm.price)
              param.append("remarks",this.bxd_ruleForm.remarks)
              param.append("money",this.bxd_ruleForm.money)
              param.append("title",this.bxd_ruleForm.title)
              this.$http.post("index.php/Mobile/approval/add_baoxiao",param)
                .then((res)=>{
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
          pic_time(){
            if(this.fileArr.length != 0) {
              if(this.file_time === 0) {
                return
              }
            }
            if(this.file_time != 0 || this.pic_time != 0){
              let param = new URLSearchParams();
              if(this.bxd_ruleForm.project_manager.uid) {
                param.append("project_manager", JSON.stringify(this.bxd_ruleForm.project_manager));
              }
              param.append("uid",this.user.uid)
              param.append("company_id",this.nowCompanyId)
              param.append("department_id",this.bxd_ruleForm.department_id)
              param.append("content",this.bxd_ruleForm.content)
              param.append("month_day",this.bxd_ruleForm.month_day)
              param.append("amount",this.bxd_ruleForm.amount)
              param.append("price",this.bxd_ruleForm.price)
              param.append("remarks",this.bxd_ruleForm.remarks)
              param.append("money",this.bxd_ruleForm.money)
              param.append("title",this.bxd_ruleForm.title)
              this.$http.post("index.php/Mobile/approval/add_baoxiao",param)
                .then((res)=>{
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
          }
        }
      }
</script>

<style lang="scss">
  .el-form--inline .el-form-item{
    margin-left: 10px;
  }

  .el-select {
    width: 100%;
  }

  .new_bxd{
    position: relative;
    .close{
      display: block;
      height: 20px;
      font-size: 16px;
      color: #3487E2;
      i {
        float: right;
        cursor: pointer;
        &:hover{
          color: #fa5555;
        }
      }
    }
  }

  .add_bxd{
    display: block;
    height: 30px;
    font-size: 14px;
    margin-left: 50px;
    i {
      cursor: pointer;
      display: inline-block;
      &:hover {
        color: #FA5555;
      }
    }
  }

  .el-form-item[data-v-1e3f67aa]{
    &:nth-child(1) {
      margin-bottom: 10px;
    }
    &:nth-child(2) {
      margin-bottom: 10px;
    }
  }
</style>
