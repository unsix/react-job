<template>
  <div style="overflow: hidden">
    <div class="fra" v-show="fra_show">
      <iframe id="mom" class="win" ref="indx" scrolling="yes" height="100%" :src="linked" seamless frameborder="0"></iframe>
      <el-form :model="ysd_ruleForm" :rules="ysd_rules" ref="ysd_ruleForm" label-width="150px" class="demo-cpj_ruleForm" style="margin-top: 20px">
        <el-form-item label="项目负责人(部门经理)">
          <el-select v-model="ysd_ruleForm.project_manager_name" placeholder="请选择" @change="cpjSelectOk">
            <el-option v-for="item in comPersonList"
                       :key="item.personnel_id"  :label="item.name" :value="item.uid">
              <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
              <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组负责人" prop="class_manager_name">
          <el-input v-model="ysd_ruleForm.class_manager_name"></el-input>
        </el-form-item>
        <el-upload class="upload-demo" id="picc" v-model="ysd_ruleForm.many_enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
        <el-upload class="upload-demo_a" v-model="ysd_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
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
        <el-button type="primary" class="btns" @click="submitForm_ysd">立即添加</el-button>
      </el-form>
    </div>

    <div class="approval_person" v-show="person_show">
      <div class="top">
        <el-button @click="_relog" size="small" type="warning" plain>返回</el-button>
        <p>选择审批人</p>
        <b @click="submit_ysd">确定</b>
      </div>
      <div class="ofs">
        <el-checkbox-group v-for="(item,index) in comPersonList" v-model="ccPer_arr" :key="index">
          <el-checkbox :label="item.uid" >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <loading v-show="loadingShow" style="z-index: 9999"></loading>
  </div>


</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import loading from '@/base/loading/loading'
  import { create_yanshoudan_list } from "@/common/js/approval/yanshoudan";
  import more from '@/base/add_approval/more'

  export default {
  data(){
    return{
      fra_show:true,
      person_show:false,
      ccPer_arr:[],
      result:'',
      loadingShow:false,
      form_Lista:{},
      linked:'',
      ysd_ruleForm:{
        project_manager_name:'',
        class_manager_name:'',
        project_manager:{},
        many_enclosure:[]
      },
      ysd_rules:{},
      fileList: [],
      fileList_a:[],
      picArr: [],
      fileArr: [],
      pic_hash_arr: [],
      file_hash_arr: [],
      afile_hash_arr: [],
      file_time: 0,
      pic_time: 0,
    }
  },
  methods:{
    ...mapMutations({
      setUser: 'SET_USER',
      setNowCompanyId: 'SET_NOWCOMPANY_ID',
      setComPersonList: 'SET_COM_PERSON_LIST',
      setComDepartList: 'SET_COM_DEPART_LIST',
      setComPartPersonList: 'SET_COM_PART_PERSON_LIST',
      setNowCompanyName: 'SET_NOWCOMPANY_NAME',
      setToken: 'SET_TOKEN',
      setUserState: 'SET_USERSTATE',
      setCompanyList: 'SET_COMPANYLIST'
    }),
    submitForm_ysd(){
      this.$parent.forms = false
      let result = this.$refs.indx.contentWindow.getCustomFormResult()
      if(result){
        this.result = result
        this.loadingShow = true
        this.$refs.more.submit()
        setTimeout(()=>{
          this.submit_ysd()
        },500)
      }
    },
    cpjSelectOk(){

    },
    _relog(){
      this.fra_show = true
      this.person_show = false
      this.ccPer = []
    },
    _getComPersonList() {
      let newparam = new URLSearchParams();
      newparam.append("company_id", this.nowCompanyId);
      let str = this.$test("/index.php/Mobile/user/get_company_personnel")
      this.$http.post(str, newparam)
        .then((res) => {
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          let reaDa = []
          res.data.data.forEach((item) => {
            item.avatar = 'http://bbsf-file.hzxb.net/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
            reaDa.push(item)
          })
          this.setComPersonList(reaDa)
        })
    },
    submit_ysd(){
      this.picArr = []
      this.fileArr = []
      this.fileList.forEach((item) => {
        if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
          this.picArr.push(item)
        }
      })
      this.fileList_a.forEach((item)=>{
        this.fileArr.push(item)
      })
      this.pic_hash_arr = []
      this.afile_hash_arr = []
      this.file_hash_arr = []
      this.file_time = 0
      this.pic_time = 0
      this.loadingShow = true
      var more = this.$refs.more
      setTimeout(()=>{
        if(this.picArr.length == 0 && this.fileArr.length == 0){
          let param = new URLSearchParams()
          param.append('company_id',this.nowCompanyId)
          if(this.insdent){param.append('contract_request_id',this.insdent)}
          param.append('content',this.result)
          param.append('inspection_type_id',this.inspection_type_id)
          let todo = JSON.stringify(this.cpj_ruleForm.project_manager)
          if(todo != 'null'){
            param.append("project_manager", todo);
          }
          if(more.file.length > 0){
            param.append("many_enclosure", JSON.stringify([...more.file]));
          }
          param.append('class_manager_name',this.ysd_ruleForm.class_manager_name)
          let str = this.$test('/index.php/Mobile/approval/add_inspection')
          this.$http.post(str,param)
            .then(()=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.person_show = false
                this.$message.success(res.data.message)
                this.$emit('return_exam')
              }else{
                this.$message.error(res.data.message)
                this.person_show = false
                this.ccPer_arr = []
                this.result = ''
                more.file = []
              }
            })
        }else{
          if(this.picArr.length != 0){
            var upload_enclosure_new = (fn) =>{
              for(let i = 0;i<this.picArr.length;i++){
                let formData = new FormData()
                formData.append('file',this.picArr[i].raw)
                formData.append('token',this.token)
                let config = {
                  headers:{
                    'Content-Type': 'multipart/form-data'
                  }
                }
                if(!this.picArr[i].size){
                  this.pic_hash_arr.push(this.picArr[i].hash)
                  this.pic_hash_arr.length == this.picArr.length && fn(this.picArr[i].name)
                }else{
                  this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
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
              let str = this.$test('/index.php/Mobile/approval/upload_enclosure_new')
              this.$http.post(str,nparam)
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
          }
          if(this.fileArr.length != 0){
            for (let i = 0;i<this.fileArr.length;i++){
              let formData = new FormData()
              formData.append('file',this.fileArr[i].raw)
              formData.append('token',this.token)
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
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
                let str = this.$test("/index.php/Mobile/approval/add_attachments")
                this.$http.post(str,param)
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
    initial_data(){
      if(!this.approval_id){
        return
      }
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      param.append('approval_id',this.approval_id)
      let str = this.$test('/index.php/Mobile/approval/approval_process_show')
      this.$http.post(str,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          this.form_Lista = create_yanshoudan_list(res.data.data)
          let str = this.$test('/index.php/Mobile/skey/look_inspection_company?type_id')
          this.linked = `${str}=${this.form_Lista.type_id}&form_id=${this.form_Lista.form_id}`
        })
    },
    add_html(){
      let str = this.$test('/index.php/Mobile/skey/look_inspection_company?type_id')
      this.linked = `${str}=${this.inspection_type_id}&form_id=`
    },
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
  },
  props:{
    inspection_type_id:{

    },
    approval_id:{
      type: String
    },
    insdent:{

    },
    userList:{}
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
    loading,
    more
  },
  created(){
    this.add_html()
    this._getComPersonList()
    this.initial_data()
  },
  watch:{
    inspection_type_id(){
      let str = this.$test('/index.php/Mobile/skey/look_inspection_company?type_id')
      this.linked = `${str}=${this.inspection_type_id}&form_id=`
    },
    file_time(){
      if(this.picArr.length != 0){
        if(this.pic_time == 0){
          return
        }
      }
      if(this.file_time != 0 || this.pic_time != 0){
        let param = new URLSearchParams()
        if(this.ysd_ruleForm.project_manager.uid){
          param.append("project_manager", JSON.stringify(this.ysd_ruleForm.project_manager));
        }
        param.append('company_id',this.nowCompanyId)
        if(this.insdent){param.append('contract_request_id',this.insdent)}
        param.append('content',this.result)
        param.append('inspection_type_id',this.inspection_type_id)
        var more = this.$refs.more
        param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr,...more.file]));
        let str = this.$test('/index.php/Mobile/approval/add_inspection')
        this.$http.post(str,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.loadingShow = false
            if(res.data.code == 0){
              this.person_show = false
              this.$message.success(res.data.message)
              this.$emit('return_exam')
            }else{
              this.$message.error(res.data.message)
              this.person_show = false
              this.ccPer_arr = []
              this.result = ''
              more.file = []
            }
          })
      }
    },
    pic_time(){
      if(this.fileArr.length != 0){
        if(this.file_time == 0){
          return
        }
      }
      if(this.file_time != 0 || this.pic_time != 0){
        let param = new URLSearchParams()
        if(this.ysd_ruleForm.project_manager.uid){
          param.append("project_manager", JSON.stringify(this.ysd_ruleForm.project_manager));
        }
        param.append('company_id',this.nowCompanyId)
        if(this.insdent){param.append('contract_request_id',this.insdent)}
        param.append('content',this.result)
        param.append('inspection_type_id',this.inspection_type_id)
        var more = this.$refs.more
        param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr,...more.file]));
        let str = this.$test('/index.php/Mobile/approval/add_inspection')
        this.$http.post(str,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.loadingShow = false
            if(res.data.code == 0){
              this.person_show = false
              this.$message.success(res.data.message)
              this.$emit('return_exam')
            }else{
              this.$message.error(res.data.message)
              this.person_show = false
              this.ccPer_arr = []
              this.result = ''
              more.file = []
            }
          })
      }
    }
  }
}
</script>

<style lang="scss">
  .win{
    width: 100%;
    height:700px;
    border-bottom: 1px solid #e3e4e9;
    margin-top: 20px;
  }
  .btns{
    float: right;
    margin-right: 20px;
  }
  .approval_person{
    width: 100%;
    position: relative;
    top: -20px;
    z-index: 99;
    .top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      .el-button{
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p{
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      b{
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    .ofs{
      margin-left: 40px;
      width: 80%;
      float: left;
      height: 600px;
      overflow-y: auto;
      .el-checkbox-group{
        padding: 10px 0 0;
      }
    }
  }
</style>
