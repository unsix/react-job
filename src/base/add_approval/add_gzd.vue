<template>
    <div name="工资单" class="gzd">
      <el-form v-show="form_show" :model="gzd_ruleForm" :rules="gzd_rules" ref="gzd_ruleForm" label-width="150px" class="demo-gzd_ruleForm">
        <el-form-item label="工程名称" prop="project_name">
          <el-input v-model="gzd_ruleForm.project_name"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract_name">
          <el-input v-model="gzd_ruleForm.contract_name" style="width:195px;"></el-input>
          <el-button type="info" plain @click="viewHt" v-if="!btn_show" style="float: right;margin-right: 5px;" >查看合同</el-button>
        </el-form-item>
        <el-form-item label="工种" prop="work_type">
          <el-input v-model="gzd_ruleForm.work_type"></el-input>
        </el-form-item>
        <el-form-item label="请款单位" prop="request_unit">
          <el-input v-model="gzd_ruleForm.request_unit"></el-input>
        </el-form-item>
        <el-form-item label="请款人姓名" prop="request_name">
          <el-select v-model="gzd_ruleForm.request_name" placeholder="请选择" @change="gzdSelect">
            <el-option v-for="item in comPersonList"
                       :key="item.personnel_id"  :label="item.name" :value="item.uid">
              <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
              <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="request_phone	">
          <el-input v-model="gzd_ruleForm.request_phone"></el-input>
        </el-form-item>
        <el-form-item label="合同执行进度" prop="contract_process">
          <el-input v-model="gzd_ruleForm.contract_process"></el-input>
        </el-form-item>
        <el-form-item label="请款内容" prop="request_content">
          <el-input v-model="gzd_ruleForm.request_content"></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="contract_money" >
          <el-input v-model="gzd_ruleForm.contract_money" @change="check_money(gzd_ruleForm.contract_money,1)"></el-input>
        </el-form-item>
        <el-form-item label="已领金额" prop="receive_money">
          <el-input v-model="gzd_ruleForm.receive_money" @change="check_money(gzd_ruleForm.receive_money,2)"></el-input>
        </el-form-item>
        <el-form-item label="本次请款" prop="request_money">
          <el-input v-model="gzd_ruleForm.request_money" @change="check_money(gzd_ruleForm.request_money,3)"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人" prop="project_manager_name">
          <el-select v-model="gzd_ruleForm.project_manager_name" placeholder="请选择" @change="gzdSelectOk">
            <el-option v-for="item in comPersonList"
                       :key="item.personnel_id"  :label="item.name" :value="item.uid">
              <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
              <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <div style="margin: 20px 0">
          <p style="cursor: pointer" @click="show_qk_list">+本次请款清单 <span style="color: red;" v-show="gzd_ruleForm.sum_money > 0">(￥{{gzd_ruleForm.sum_money}})</span></p>
          <ul class="salary_items" v-show="gzd_ruleForm.salary_item_ids.length > 0">
            <li v-for="item in checkedItems">
              <img :src="item.avatar" alt="">
              <div class="name">
                <p>{{item.name}}</p>
                <p>{{item.phone}}</p>
              </div>
              <div class="price">
                <p>请款月份：{{item.month}}</p>
                <p>应付金额：{{item.pay_amount}}</p>
              </div>
              <div class="status">
                <p>{{item.add_time}}</p>
                <p v-html="item.pryroll_status"></p>
              </div>
            </li>
          </ul>
        </div>
        <el-upload class="upload-demo" id="picc" v-model="gzd_ruleForm.many_enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
        <el-upload class="upload-demo_a" v-model="gzd_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
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
          <el-button type="primary" @click="submitForm_gzd('gzd_ruleForm')">立即添加</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="loadingShow"></loading>
      <div v-show="salary_item_show" class="salary_item">
        <div style="overflow: hidden">
          <el-button style="float: right;margin-right: 20px" type="primary" size="small" @click="sure_items">确定</el-button>
        </div>
        <el-checkbox-group v-model="checkedItems">
          <el-checkbox v-for="(item,index) in untreated" :label="item" :key="index">
            <img :src="item.avatar" alt="">
            <div class="name">
              <p>{{item.name}}</p>
              <p>{{item.phone}}</p>
            </div>
            <div class="price">
              <p>请款月份：{{item.month}}</p>
              <p>应付金额：{{item.pay_amount}}</p>
            </div>
            <div class="status">
              <p>{{item.add_time}}</p>
              <p v-html="item.pryroll_status"></p>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <div class="page">
          <span @click="first_page">首页</span>
          <span @click="last_page" v-show="pageIndex > 1">上一页</span>
          <span @click="next_page" v-show="nextPageShow">下一页</span>
        </div>
      </div>
      <div class="fra" v-show="fra_show">
        <iframe id="mom" class="win" ref="indx" scrolling="yes" height="100%" :src="linked" seamless frameborder="0"></iframe>
        <el-button type="primary" class="btns" @click="gzd_submit">我同意</el-button>
      </div>
    </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import loading from '@/base/loading/loading'
  import {getAvatar} from '@/common/js/avatar.js'
  import moment from 'moment'
  import * as math from 'mathjs'
  import more from '@/base/add_approval/more'
  export default {
    data(){
      return{
        gzd_ruleForm:{
          project_name:'',
          contract_name:'',
          work_type:'',
          request_unit:'',
          contract_money:'',
          receive_money:'',
          request_money:'',
          request_name:'',
          request_phone:'',
          contract_process:'',
          request_content:'',
          salary_item_ids:[],
          many_enclosure:[],
          project_manager:{},
          project_manager_name:'',
          sum_money:''
        },
        gzd_rules:{
          project_name:[{
            required: true,
            message: '请填写项目名称',
            trigger: 'blur'
          }],
          request_name:[{
            required: true,
            message: '请选择请款人',
            trigger: 'change'
          }],
          request_content:[{
            required: true,
            message: '请填写请款内容',
            trigger: 'blur'
          }],
          contract_process:[{
            required: true,
            message: '请填写合同执行进度',
            trigger: 'blur'
          }],
          contract_name:[{
            required: true,
            message: '请填写合同名称',
            trigger: 'blur'
          }],
          work_type:[{
            required: true,
            message: '请填写工种',
            trigger: 'blur'
          }],
          request_unit:[{
            required: true,
            message: '请填写请款单位',
            trigger: 'blur'
          }],
          contract_money:[{
            required: true,
            message: '请填写合同金额',
            trigger: 'blur'
          }],
          receive_money:[{
            required: true,
            message: '请填写已领金额',
            trigger: 'blur'
          }],
          request_money:[{
            required: true,
            message: '请填写本次请款',
            trigger: 'blur'
          }],
          project_manager_name:[{
            required: true,
            message: '请选择项目经理',
            trigger: 'change'
          }],
        },
        loadingShow:false,
        form_show:true,
        salary_item_show:false,
        pageIndex:1,
        untreated:[],
        checkedItems:[],
        pic_hash_arr: [],
        file_hash_arr: [],
        afile_hash_arr: [],
        file_time: 0,
        pic_time: 0,
        fileList_a:[],
        picArr: [],
        fileArr: [],
        fileList: [],
        fra_show:false,
        linked:'',
        nextPageShow:false
      }
    },
    methods:{
      ...mapMutations({
        setToken: 'SET_TOKEN'
      }),
      submitForm_gzd(formName){
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.gzd_ruleForm.salary_item_ids.length < 1){
              this.$message.error('至少选择一个请款清单')
              return false
            }else{
              this.show_chennuo()
            }
          } else {
            this.$message.error('请将表单填写完整');
            return false;
          }
        });
      },
      viewHt(){
        let str = this.$test('/index.php/Mobile/skey/look_draft?id=')
        window.open( str+this.contract+'&operation=2&view=1')
      },
      show_chennuo(){
        let httpUrl = this.$test('/index.php/Mobile/index/letter_invitation?')
        let preview_arg = {}
        this.$set(preview_arg,'project_name',this.gzd_ruleForm.project_name)
        this.$set(preview_arg,'contract_name',this.gzd_ruleForm.contract_name)
        this.$set(preview_arg,'work_type',this.gzd_ruleForm.work_type)
        this.$set(preview_arg,'request_unit',this.gzd_ruleForm.request_unit)
        this.$set(preview_arg,'request_name',this.gzd_ruleForm.request_name)
        this.$set(preview_arg,'request_phone',this.gzd_ruleForm.request_phone)
        this.$set(preview_arg,'contract_money',this.gzd_ruleForm.contract_money)
        this.$set(preview_arg,'receive_money',this.gzd_ruleForm.receive_money)
        this.$set(preview_arg,'request_money',this.gzd_ruleForm.request_money)
        this.$set(preview_arg,'request_content',this.gzd_ruleForm.request_content)
        this.$set(preview_arg,'contract_process',this.gzd_ruleForm.contract_process)
        this.$set(preview_arg,'salary_item_ids',JSON.stringify(this.gzd_ruleForm.salary_item_ids))
        this.$set(preview_arg,'project_manager',JSON.stringify(this.gzd_ruleForm.project_manager))
        preview_arg = JSON.stringify(preview_arg)
        this.linked = `${httpUrl}uid=${this.user.uid}&company_id=${this.nowCompanyId}&preview_arg=${preview_arg}`
        this.linked = encodeURI(this.linked)
        this.fra_show = true
        this.form_show = false
        this.$parent.forms = false
      },
      check_money(data,pr){
        let str = /^[1-9]\d*$/
        if(!str.test(data)){
          this.$message.error('只能输入数字')
          switch (pr) {
            case 1:
              this.gzd_ruleForm.contract_money = '0'
              break;
            case 2:
              this.gzd_ruleForm.receive_money = '0'
              break;
            case 3:
              this.gzd_ruleForm.request_money = '0'
              break;
          }
        }
      },
      gzd_submit(){
        this.loadingShow = true
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
        setTimeout(()=>{
          if(this.picArr.length === 0 && this.fileArr.length === 0) {
            let param = new URLSearchParams()
            param.append('company_id',this.nowCompanyId)
            param.append('project_name',this.gzd_ruleForm.project_name)
            param.append('contract_name',this.gzd_ruleForm.contract_name)
            param.append('work_type',this.gzd_ruleForm.work_type)
            param.append('request_unit',this.gzd_ruleForm.request_unit)
            param.append('request_name',this.gzd_ruleForm.request_name)
            param.append('request_phone',this.gzd_ruleForm.request_phone)
            param.append('contract_money',this.gzd_ruleForm.contract_money)
            param.append('receive_money',this.gzd_ruleForm.receive_money)
            param.append('request_money',this.gzd_ruleForm.request_money)
            param.append('request_content',this.gzd_ruleForm.request_content)
            param.append('contract_process',this.gzd_ruleForm.contract_process)
            param.append('salary_item_ids',JSON.stringify(this.gzd_ruleForm.salary_item_ids))
            param.append('project_manager',JSON.stringify(this.gzd_ruleForm.project_manager))
            param.append('sum_money',this.gzd_ruleForm.sum_money)
            if(!this.btn_show){
              param.append('contract_request_id',this.contract)
            }
            let str =this.$test('/index.php/Mobile/approval/add_payroll')
            this.$http.post(str,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                this.loadingShow = false
                if(res.data.code == 0){
                  this.$message.success('添加成功')
                  if(this.btn_show){
                    this.$router.push({
                      path: '/work/exam'
                    })
                  }else{
                    this.$emit('return_exam')
                  }
                }else{
                  this.$message.error(res.data.message)
                }
              })
          }else{
            if(this.fileList.length != 0){
              var upload_enclosure_new = (fn) =>{
                this.fileList.forEach((item)=>{
                  let formData = new FormData()
                  formData.append('file',item.raw)
                  formData.append('token',this.token)
                  let config = {
                    'Content-Type': 'multipart/form-data'
                  }
                  if(!item.size){
                    this.pic_hash_arr.push(item.hash)
                    this.pic_hash_arr.length == this.fileList.length && fn(item.name)
                  }else{
                    this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                      this.pic_hash_arr.push(res.data.hash)
                      if(this.pic_hash_arr.length === this.fileList.length) {
                        fn(item.name);
                      }
                    })
                  }
                })
              }
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append('uid',this.user.uid)
                nparam.append('picture',JSON.stringify(this.pic_hash_arr))
                let str = this.$test('/index.php/Mobile/approval/upload_enclosure_new')
                this.$http.post(str,nparam)
                  .then((res)=>{
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
            if(this.fileList_a.length!=0){
              this.fileList_a.forEach((item)=>{
                let formData = new FormData()
                formData.append('file',item.raw)
                formData.append('token',this.token)
                let config = {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
                if(!item.size){
                  let index = item.name.lastIndexOf('.')
                  let attribute = item.name.slice(index)
                  if(attribute.substr(0,1) == '.'){
                    attribute = attribute.substr(1)
                  }
                  let file_name = item.name.slice(0,index)
                  let param = new URLSearchParams()
                  param.append('uid',this.user.uid)
                  param.append('attribute',attribute)
                  param.append('attachments',item.hash)
                  param.append('file_name',file_name)
                  let str = this.$test('/index.php/Mobile/approval/add_attachments')
                  this.$http.post(str,param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      this.file_hash_arr.push({
                        "type": 4,
                        "contract_id": res.data.data.attachments_id,
                        "name": item.name
                      })
                      if (this.file_hash_arr.length === this.fileArr.length) {
                        let bDate = Date.parse(new Date())
                        this.file_time = bDate
                      }
                    })
                }else{
                  let size = item.size
                  let index = item.name.lastIndexOf('.')
                  let attribute = item.name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute = attribute.substr(1)
                  }
                  let str = this.$test('/index.php/Mobile/find/file_info')
                  this.$http.post(str)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      let maxSize = res.data.data.max
                      let attr = res.data.data.attribute
                      if(attr.indexOf(attribute) != -1){
                        if(size < maxSize){
                          this.$http.post('https://up.qbox.me/',formData,config).then((res)=>{
                            let file_name = item.name.slice(0,index)
                            let param = new URLSearchParams()
                            param.append('uid',this.user.uid)
                            param.append('attribute',attribute)
                            param.append('attachments',res.data.hash)
                            param.append("file_name",file_name)
                            let str = this.$test('/index.php/Mobile/approval/add_attachments')
                            this.$http.post(str,param)
                              .then((res)=>{
                                var current = this
                                var judge = res.data.code
                                this.$testLogin(judge,current)
                                this.file_hash_arr.push({
                                  "type": 4,
                                  "contract_id": res.data.data.attachments_id,
                                  "name": item.name
                                })
                                if (this.file_hash_arr.length === this.fileArr.length) {
                                  let bDate = Date.parse(new Date())
                                  this.file_time = bDate
                                }
                              })
                          })
                        }else{
                          this.$message.error('上传文件过大 请删除')
                          this.$parent.$parent.loadingShow = false
                          return false
                        }
                      }else{
                        this.$message.error('请删除'+this.fileList_a[i].name)
                        this.$parent.$parent.loadingShow = false
                        return false
                      }
                    })
                }
              })
            }
          }
        })
      },
      show_qk_list(){
        this.form_show = false
        this.salary_item_show = true
        this.$parent.forms = false
        this.get_item_data()
      },
      get_item_data(){
        this.checkedItems = []
        this.gzd_ruleForm.salary_item_ids = []
        let param = new URLSearchParams()
        param.append('p',this.pageIndex)
        param.append('each',10)
        let str = this.$test('/index.php/Mobile/payroll/get_payroll_choice_list')
        this.$http.post(str,param)
          .then((res)=>{
            if(res.data.code == 0){
              this.untreated = res.data.data
              this.untreated.forEach((item)=>{
                item.avatar = getAvatar(item.avatar)
                item.month = moment(item.month).format('YYYY年MM月')
                item.pryroll_status = get_state(item.pryroll_status)
              })
              if(this.untreated.length < 10){
                this.nextPageShow =  false
              }
            }else{
              this.salary_item_show = false
            }
          })
        function get_state(state){
          if(state === '0'){
            return '<span style="color:#409EFF">待处理<i class="el-icon-loading" style="margin-left:4px"></i></span>'
          }else if(state === '1'){
            return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }else if(state === '2'){
            return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
          }else if(state === '-1'){
            return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
          }else if(state === '99'){
            return '<span style="color:#67C23A">已完结<i class="el-icon-success" style="margin-left:4px"></i></span>'
          }
        }
      },
      sure_items(){
        if(!this.checkedItems){
          return
        }
        if(this.checkedItems){
          var str = 0
          this.checkedItems.forEach((item)=>{
            this.gzd_ruleForm.salary_item_ids.push(item.payroll_id)
            str += math.eval(Number(item.pay_amount))
          })
          this.gzd_ruleForm.sum_money = math.format(str, {precision: 14})
          this.form_show = true
          this.salary_item_show = false
          this.$parent.forms = true
        }

      },
      gzdSelectOk(tab){
        this.gzd_ruleForm.project_manager={}
        this.comPersonList.forEach((item) => {
          if(item.uid === tab) {
            this.$set(this.gzd_ruleForm.project_manager, 'uid', item.uid)
          }
        })
      },
      gzdSelect(tab){
        this.comPersonList.forEach((item) => {
          if(item.uid === tab) {
            this.gzd_ruleForm.request_name = item.name
            this.gzd_ruleForm.request_phone = item.phone
          }
        })
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
      initial_data: function () {
        if (!this.approval_id) {
          return
        }
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        param.append("approval_id", this.approval_id);
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
        this.$http.post(str, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge, current)
            var form_Lista = res.data.data
            this.gzd_ruleForm.project_name = form_Lista.project_name
            this.gzd_ruleForm.contract_name = form_Lista.contract_name
            this.gzd_ruleForm.work_type = form_Lista.work_type
            this.gzd_ruleForm.request_unit = form_Lista.request_unit
            this.gzd_ruleForm.request_name = form_Lista.request_name
            this.gzd_ruleForm.request_phone = form_Lista.request_phone
            this.gzd_ruleForm.contract_process = form_Lista.contract_process
            this.gzd_ruleForm.request_content = form_Lista.request_content
            this.gzd_ruleForm.contract_money = form_Lista.contract_money
            this.gzd_ruleForm.receive_money = form_Lista.receive_money
            this.gzd_ruleForm.request_money = form_Lista.request_money
            this.gzd_ruleForm.project_manager_name = form_Lista.project_manager_name.name
            this.gzd_ruleForm.project_manager = JSON.parse(form_Lista.project_manager)
            this.gzd_ruleForm.salary_item_ids = JSON.parse(form_Lista.salary_item_ids)
            this.gzd_ruleForm.sum_money = form_Lista.sum_money
            form_Lista.salary_items.forEach((item)=>{
              item.avatar = getAvatar(item.avatar)
              item.month = moment(item.month).format('YYYY年MM月')
              item.pryroll_status = get_state(item.pryroll_status)
              this.checkedItems.push(item)
              function get_state(state){
                if(state === '0'){
                  return '<span style="color:#409EFF">待处理<i class="el-icon-loading" style="margin-left:4px"></i></span>'
                }else if(state === '1'){
                  return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
                }else if(state === '2'){
                  return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
                }else if(state === '-1'){
                  return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
                }else if(state === '99'){
                  return '<span style="color:#67C23A">已完结<i class="el-icon-success" style="margin-left:4px"></i></span>'
                }
              }
            })
            if(form_Lista.many_enclosure){
              form_Lista.many_enclosure.forEach((item)=>{
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
                        let img_add = picLeader+item
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
            }
          })
      },
      first_page() {
        this.pageIndex = 1
      },
      last_page() {
        this.nextPageShow = true
        --this.pageIndex
      },
      next_page() {
        ++this.pageIndex
      },
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ]),
    },
    created(){
      this._getToken()
      this.get_item_data()
      this.initial_data()
    },
    props:{
      approval_id: {
        type: String
      },
      userList:{

      },
      contract:{

      },
      btn_show:{
        default:true
      }
    },
    watch:{
      file_time(){
        if(this.picArr.length != 0){
          if(this.pic_time === 0) {
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0){
          let param = new URLSearchParams()
          param.append('company_id',this.nowCompanyId)
          param.append('project_name',this.gzd_ruleForm.project_name)
          param.append('contract_name',this.gzd_ruleForm.contract_name)
          param.append('work_type',this.gzd_ruleForm.work_type)
          param.append('request_unit',this.gzd_ruleForm.request_unit)
          param.append('request_name',this.gzd_ruleForm.request_name)
          param.append('request_phone',this.gzd_ruleForm.request_phone)
          param.append('contract_money',this.gzd_ruleForm.contract_money)
          param.append('receive_money',this.gzd_ruleForm.receive_money)
          param.append('contract_process',this.gzd_ruleForm.contract_process)
          param.append('request_money',this.gzd_ruleForm.request_money)
          param.append('request_content',this.gzd_ruleForm.request_content)
          param.append('salary_item_ids',JSON.stringify(this.gzd_ruleForm.salary_item_ids))
          param.append('project_manager',JSON.stringify(this.gzd_ruleForm.project_manager))
          param.append('sum_money',this.gzd_ruleForm.sum_money)
          param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
          let str =this.$test('/index.php/Mobile/approval/add_payroll')
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.$message.success('添加成功')
                if(this.btn_show){
                  this.$router.push({
                    path: '/work/exam'
                  })
                }else{
                  this.$emit('return_exam')
                }
              }else{
                this.$message.error(res.data.message)
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
          let param = new URLSearchParams()
          param.append('company_id',this.nowCompanyId)
          param.append('project_name',this.gzd_ruleForm.project_name)
          param.append('contract_name',this.gzd_ruleForm.contract_name)
          param.append('work_type',this.gzd_ruleForm.work_type)
          param.append('request_unit',this.gzd_ruleForm.request_unit)
          param.append('request_name',this.gzd_ruleForm.request_name)
          param.append('request_phone',this.gzd_ruleForm.request_phone)
          param.append('contract_money',this.gzd_ruleForm.contract_money)
          param.append('contract_process',this.gzd_ruleForm.contract_process)
          param.append('receive_money',this.gzd_ruleForm.receive_money)
          param.append('request_money',this.gzd_ruleForm.request_money)
          param.append('request_content',this.gzd_ruleForm.request_content)
          param.append('salary_item_ids',JSON.stringify(this.gzd_ruleForm.salary_item_ids))
          param.append('project_manager',JSON.stringify(this.gzd_ruleForm.project_manager))
          param.append('sum_money',this.gzd_ruleForm.sum_money)
          param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
          let str =this.$test('/index.php/Mobile/approval/add_payroll')
          if(!this.btn_show){
            param.append('contract_request_id',this.contract)
          }
          this.$http.post(str,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code == 0){
                this.$message.success('添加成功')
                if(this.btn_show){
                  this.$router.push({
                    path: '/work/exam'
                  })
                }else{
                  this.$emit('return_exam')
                }
              }else{
                this.$message.error(res.data.message)
              }
            })
        }
      },
      pageIndex(){
        this.get_item_data()
      }
    },
    components:{
      loading,
      moment,
      more
    }
  }
</script>

<style lang="scss">
.gzd{
  width: 100%;
  .salary_item{
    width: 100%;
    .el-checkbox{
      background: #FFF;
      margin-top: 5px;
      overflow: hidden;
      padding:5px 0px 5px 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: default;
      border-bottom: 1px solid #DDDDDD;
      transition: .3s;
      oz-box-shadow: 1px 1px 2px #999999;
      -webkit-box-shadow: 1px 1px 2px #999999;
      box-shadow: 1px 1px 2px #999999;
      margin-bottom: 5px;
      margin-left: 0px !important;
      img{
        width: 50px !important;
        height: 50px;
        display: block;
        float: left;
      }
      .name{
        width: 85px;
        float: left;
        margin: 0 10px;
        line-height: 20px;
      }
      .price{
        width: 180px;
        float: left;
        margin: 0 15px;
      }
    }
    .page {
      padding: 4px;
      text-align: center;
      background: #FFFFFF;
      span {
        cursor: pointer;
        font-size: 12px;
        &:hover {
          color: #409EFF;
        }
      }
    }
  }
}
.el-select {
  width: 100%;
}
.fra{
  overflow: hidden;
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
}
.salary_items{
  width: 100%;
  li{
    background: #FFF;
    margin-top: 5px;
    overflow: hidden;
    padding:5px 0px 5px 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    cursor: default;
    border-bottom: 1px solid #DDDDDD;
    transition: .3s;
    oz-box-shadow: 1px 1px 2px #999999;
    -webkit-box-shadow: 1px 1px 2px #999999;
    box-shadow: 1px 1px 2px #999999;
    margin-bottom: 5px;
    margin-left: 0px !important;
    img{
      width: 50px !important;
      height: 50px;
      display: block;
      float: left;
    }
    .name{
      width: 85px;
      float: left;
      margin: 0 10px;
      line-height: 20px;
    }
    .price{
      width: 180px;
      float: left;
      margin: 0 15px;
    }
  }
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
</style>
