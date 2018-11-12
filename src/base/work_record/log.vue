<template>
  <div class="log" ref="logs">
    <div v-show="logShow">
      <div class="tab">
        <el-tabs v-model="activeNames" @tab-click="handClick">
          <el-tab-pane label="日志" name="1"></el-tab-pane>
          <el-tab-pane label="周计划" name="2"></el-tab-pane>
          <el-tab-pane label="月计划" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="block">
        <div class="date">
          <div v-show="das != 'week'" class="day">
            <el-date-picker v-model="logs.user_save_time" :type="das" placeholder="选择日期" :clearable="false" @change="getdate"></el-date-picker>
          </div>
          <div v-show="das == 'week'" class="week">
            <div class="wel">
              <el-date-picker v-model="logs.user_save_time" type="date" placeholder="选择日期" :clearable="false" @change="getWeek"></el-date-picker>
              <span>-</span>
              <el-date-picker v-model="set_week" type="date" :disabled="true" :clearable="false" ></el-date-picker>
            </div>
          </div>
        </div>
        <span v-show="dates" class="zz">补发</span>
      </div>
      <div class="shu"   >
        <components :is="item.component"
                    :tit="item.tit"
                    :key="idx"
                    :ref="item.cc"
                    :line="item.line"
                    :length="item.length"
                    :str="item.version"
                    :hint="item.place"
                    :sdsd="item.fill"
                    :type="item.input_type"
                    :options="item.meta_data"
                    :default_select="item.default_select"
                    :form_element_id="item.form_element_id"
                    v-for="(item,idx) in conpents"></components>
      </div>
      <el-upload class="upload-demo" id="pic" v-model="logs.enclosure"  multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
        <i class="el-icon-plus"></i>
        <!--<el-button size="small" type="info" plain id="juz">上传图片</el-button>-->
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
      </el-upload>
      <el-upload class="upload-demo_c" v-model="logs.enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
        <el-button size="small" type="info" plain>上传文件</el-button>
        <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
      </el-upload>
      <div class="ssssss">
        <el-button size="small" type="primary" @click="cc" plain>{{copyRange}}</el-button>
        <el-button size="small" type="warning" plain @click="com">{{comPerson}}</el-button>
      </div>
      <el-button size="medium" type="success" @click="log_submit('logs')">提交</el-button>
    </div>
    <div class="cc" v-show="ccShow">
      <div class="tab">
        <el-tabs v-model="activeNames" @tab-click="handleClick">
          <el-tab-pane label="部门" name="1"></el-tab-pane>
          <el-tab-pane label="同事" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="units">
        <div class="department" v-show="deShow">
          <el-checkbox @change="check" v-model="checked">全公司</el-checkbox>
          <el-checkbox-group v-for="(item,index) in comDepartList" v-model="ccCom" :key="index" @change="handleCho">
            <el-checkbox :label="item.department_id" >{{item.department_name}} <span>({{item.department_describe}})</span></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="person" v-show="peShow">
          <el-checkbox-group v-for="(item,index) in comPersonList" v-model="ccPer" @change="handleChoose" :key="index">
            <el-checkbox :label="item.personnel_id" >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="choose">
        <p>已选择:{{this.allPan}}{{this.ccCompany}}{{this.ccPerson}}</p>
        <el-button size="small" type="primary" plain @click="cc_submit">确定</el-button>
      </div>
    </div>
    <div class="comPer" v-show="comPerShow">
      <el-button @click="_relog" size="small" type="warning" plain>返回</el-button>
      <el-radio-group v-for="(item,index) in comPersonList" v-model="comPer" @change="handleChoosen" :key="index">
        <el-radio :label="item.uid">{{item.name}}</el-radio>
      </el-radio-group>
    </div>
    <loading v-show="loadingShow" style="z-index: 9999999"></loading>

    <div class="addsd" v-show="addShow">
      <ul>
        <h2>选择日志类型</h2>
        <i class="el-icon-close" @click="asShow"></i>
        <li v-for="(item,index) in plan" :log_type_id="item.log_type_id" @click="log(item.log_type_id)">{{item.log_type_name}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
  import datas from '@/base/unit/datas'
  import {getAvatar} from '@/common/js/avatar.js'
  import sec from '@/base/unit/sec'
  import { create_depart_list } from 'common/js/initial/depart.js'
  import { mapGetters, mapMutations } from 'vuex'
  import loading from '@/base/loading/loading'
  import moment from 'moment'
  export default {
    data(){
      return{
        set_week:'',
        conpents:[],
        fileList: [],
        fileList_a:[],
        picArr: [],
        fileArr: [],
        pic_hash_arr: [],
        file_hash_arr: [],
        afile_hash_arr: [],
        file_time: 0,
        pic_time: 0,
        pic_index: 0,
        img_arr: [],
        logs:{
          enclosure : [],
          user_save_time:'',
          json:[],
          custom_form_result:[],
          reviewer:''
        },
        ccShow:false,
        logShow: false,
        deShow:false,
        activeNames:'1',
        peShow:false,
        checked:false,
        company:'',
        ccCom:[],
        ccPer:[],
        ccCompany:'',
        ccPerson:'',
        allPan:'',
        copyRange:'抄送范围',
        comPerShow:false,
        comPer:'',
        comPerson:'选择点评人',
        dates:false,
        time:'',
        loadingShow: false,
        actions:'',
        str:'',
        plan:[],
        addShow:false,
        tode:[],
        custom_form_type:'',
        log_type:'',
      }
    },
    beforeMount(){
        var id = this.nowCompanyId
        var inData = JSON.parse(localStorage.getItem("inData"+`${id}`))
        if(inData){
            this.allPan = inData.work_log_person.datatype_log.allPan
            this.ccCom = inData.work_log_person.datatype_log.ccCom
            this.copyRange = inData.work_log_person.datatype_log.copyRange
            this.comPer = inData.work_log_person.datatype_log.comPer
            this.comPerson = inData.work_log_person.datatype_log.comPerson
            this.checked = inData.work_log_person.datatype_log.checked
            this.ccPer = inData.work_log_person.datatype_log.ccPer
            this.ccCompany = inData.work_log_person.datatype_log.ccCompany
            this.ccPerson = inData.work_log_person.datatype_log.ccPerson
        }
    },
    methods:{
      msms() {
        this.conpents.splice(0,this.conpents.length)
        this.tode.forEach((item)=>{
          // if (typeof item.meta_data === 'string') {
          //    item.meta_data = JSON.parse(item.meta_data)
          // }
          if(typeof item.meta_data == 'string'){
            item.meta_data = JSON.parse(item.meta_data)
          }
          //  item.meta_data = JSON.parse(item.meta_data)
          if(item.type == "input_text"){
            this.conpents.push({
              component:sec,
              tit: item.title,
              line:item.max_lines,
              length:item.max_length,
              form_element_id: item.form_element_id,
              version:item.version,
              place:item.meta_data.hint,
              input_type:item.meta_data.input_type,
              cc: 'ceshi'
            })
          }
          if(item.type == "single_choice"){
            this.conpents.push({
              component:chose,
              form_element_id: item.form_element_id,
              version:item.version,
              tit: item.title,
              meta_data:item.meta_data.options,
              default_select:item.meta_data.default_select,
              cc: 'ceshi'
            })
          }
          if(item.type == "multi_choice"){
            this.conpents.push({
              component:fuchose,
              form_element_id: item.form_element_id,
              version:item.version,
              tit: item.title,
              meta_data:item.meta_data.options,
              default_select:item.meta_data.default_select,
              cc: 'ceshi'
            })
          }
          if(item.type == "date_select"){
            this.conpents.push({
              component:datas,
              form_element_id: item.form_element_id,
              version:item.version,
              tit: item.title,
              fill:item.meta_data.is_fill_local_time,
              cc: 'ceshi'
            })
          }
        })
      },
      fill(){
        if(this.das == 'date'){
          var date = new Date()
          var y = date.getFullYear()
          var m = date.getMonth()+1
          var d = date.getDate()
          var str = y+'-'+m+'-'+d
          var time = new Date(str)
          this.logs.user_save_time = time
          this.time = time
        }
        if(this.das == 'week'){
          var date = new Date()
          var y = date.getFullYear()
          var m = date.getMonth()+1
          var sd = date.getDay()
          var d = date.getDate()-sd+1
          var s = date.getDate()-sd+7
          var str = y+'-'+m+'-'+d
          var strd = y+'-'+m+'-'+s
          var time = new Date(str)
          var sd = new Date(strd)
          this.set_week = sd
          this.logs.user_save_time = time
          this.time = time
        }
        if(this.das == 'month'){
          var date = new Date()
          var y = date.getFullYear()
          var m = date.getMonth()+1
          var str = y + '-'+m+'-'+'1'
          var time = new Date(str)
          this.logs.user_save_time = time
          this.time = time
        }
      },
      _getToken() {
        let nparam = new URLSearchParams();
        nparam.append("uid", this.user.uid);
        let httpUrl = this.$test("/index.php/Mobile/path/get_token")
        this.$http.post(httpUrl, nparam)
          .then((res) => {
            localStorage.token = JSON.stringify(res.data.data);
            this.setToken(res.data.data)
          })
      },
      _getComDepart() {
        let param = new URLSearchParams();
        param.append("company_id", this.nowCompanyId);
        let httpUrl = this.$test("/index.php/Mobile/user/get_department_lest")
        this.$http.post(httpUrl, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            let arr = []
            res.data.data.forEach((item) => {
              arr.push(create_depart_list(item))
            })
            this.setComDepartList(arr)
          })
      },
      _getComPersonList() {
        let newparam = new URLSearchParams();
        newparam.append("company_id", this.nowCompanyId);
        let httpUrl = this.$test("/index.php/Mobile/user/get_company_personnel")
        this.$http.post(httpUrl, newparam)
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
        let httpUrl = this.$test("/index.php/Mobile/find/file_info")
        this.$http.post(httpUrl)
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
      handleClick(tab){
        let index = parseInt(tab.index)
        if(index == 0){
          this.deShow = true
          this.peShow = false
        }
        if(index == 1){
          this.peShow = true
          this.deShow = false
        }
      },
      cc(){
        this.activeNames = '1'
        this.logShow = false
        this.ccShow = true
        this.deShow = true
        this.peShow = false
      },
      com(){
        this.logShow = false
        this.comPerShow = true
      },
      check(){
        if(this.checked == true){
          this.allPan = '全公司，'
        }else{
          this.allPan = ''
        }
      },
      add_ok() {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        });
        // if (typeof airport === 'string') {
        //     airport = JSON.parse(airport)
        //   }
        let arr = JSON.parse(this.logs.custom_form_result)
        let jso = JSON.parse(this.logs.json)
        arr = []
        jso = []
        this.logs.custom_form_result = arr
        this.logs.json = []
        this.$refs.ceshi.forEach((item)=>{
          item.result = ''
        })
        this.fileList_a = []
        this.fileList = []
      },
      add_fail() {
        this.$message({
          showClose: true,
          message: '添加失败',
          type: 'error'
        });
        this.fill()
        let arr = JSON.parse(this.logs.custom_form_result)
        let jso = JSON.parse(this.logs.json)
        arr = []
        jso = []
        this.logs.custom_form_result = arr
        this.logs.json = []
      },
      handleCho(value){
        if(value.length == 1){
          this.comDepartList.forEach((re)=>{
            if(value[0] == re.department_id){
              this.ccCompany = re.department_name + '，'
            }
          })
        }
        if(value.length > 1){
          this.ccCompany = value.length + '个部门'+ '，'
        }
        if(value.length == 0){
          this.ccCompany = ''
        }
      },
      handleChoose(val){
        if(val.length == 1){
          this.comPersonList.forEach((re)=>{
            if(val[0] == re.personnel_id){
              this.ccPerson = re.name + '，'
            }
          })
        }
        if(val.length > 1){
          this.ccPerson = val.length + '个同事，'
        }
        if(val.length == 0){
          this.ccPerson = ''
        }
      },
      cc_submit(){
        let str = this.allPan + this.ccCompany + this.ccPerson
        if(str.length == 0 ){
          this.copyRange = '抄送范围'
        }else{
          this.copyRange = str
        }
        this.logShow = true
        this.ccShow = false
        this.deShow = false
        this.peShow = false
      },
      handleChoosen(){
        this.comPersonList.forEach((re)=>{
          if(this.comPer == re.uid){
            this.comPerson = re.name
          }
        })
        this.logShow = true
        this.comPerShow = false
      },
      _relog(){
        if(this.comPer.length > 0){
          this.logShow = true
          this.comPerShow = false
        }else{
          this.logShow = true
          this.comPerShow = false
          this.comPerson = '选择点评人'
        }
      },
      getdate(val){
        let str = this.time
        if(this.das == 'date'){
          if(val >= str){
            this.logs.user_save_time = str
            this.dates= false
          }else{
            this.logs.user_save_time = val
            this.dates = true
          }
        }
        if(this.das == 'month'){
          if(val >= str){
            this.logs.user_save_time = str
            this.dates = false
          }else{
            this.logs.user_save_time = val
            this.dates = true
          }
        }
      },
      getWeek(val){
        let str = this.time
        var weekOfday = moment(val).format('E')
        var last_sunday = moment(val).subtract(weekOfday, 'days').format()
        var last_monday = moment(last_sunday).add(1,'days').format()
        last_sunday = moment(last_sunday).add(7,'days').format()
        var src = new Date(last_monday)
        console.log(str)
        console.log(src)
        if(src >= str){
          this.logs.user_save_time = str
          this.dates = false
        }else{
          this.logs.user_save_time = src
          this.set_week = new Date(last_sunday)
          this.dates = true
        }
      },
      log_submit(){
        var data = this._data
        // data = {
        //   ccCompany:this._data.ccCompany,
        //   ccCom:this._data.ccCom,
        //   allPan:this._data.allPan,
        //   copyRange:this._data.copyRange,
        //   comPer:this._data.comPer,
        //   comPerson:this._data.comPerson,
        //   checked:this._data.checked,
        //   ccPer:this._data.ccPer,
        //   ccPerson:this._data.ccPerson
        // }
         data = {
           work_log_person:{
              // activeNames:this._data.activeNames,
              datatype_log:{
              ccCompany:this._data.ccCompany,
              ccCom:this._data.ccCom,
              allPan:this._data.allPan,
              copyRange:this._data.copyRange,
              comPer:this._data.comPer,
              comPerson:this._data.comPerson,
              checked:this._data.checked,
              ccPer:this._data.ccPer,
              ccPerson:this._data.ccPerson
            }
           }
        }  
        var nowCompanyId_data = this.nowCompanyId
        localStorage.setItem("inData"+`${nowCompanyId_data}`,JSON.stringify(data));
        if(this.copyRange == '抄送范围'){
          this.$message({
            message: '请选择抄送人',
            type: 'warning'
          });
          return false
        }
        if(this.comPerson == '选择点评人'){
          this.$message({
            message: '请选择点评人',
            type: 'warning'
          });
          return false
        }
        this._logs_submit()
      },
      _logs_submit(){
        var geo = this.$refs.ceshi
        geo.forEach((item)=>{
          this.logs.custom_form_result.push({
            result:item.result,
            form_element_id:item.form_element_id
          })
        })
        this.logs.custom_form_result = JSON.stringify(this.logs.custom_form_result)
        if(this.allPan == '全公司，'){
          this.logs.json.push({
            id: this.nowCompanyId,
            type:'3',
          })
        }
        if(this.ccCom.length > 0 ){
          this.ccCom.forEach((re)=>{
            this.logs.json.push({
              id:re,
              type:'2',
            })
          })
        }
        if(this.ccPer.length > 0 ){
          this.ccPer.forEach((re)=>{
            this.logs.json.push({
              id:re,
              type:'1',
            })
          })
        }
        if(this.comPer != '选择点评人'){
          this.logs.reviewer = this.comPer
        }
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
          if(this.picArr.length == 0 && this.fileArr.length === 0 ){
            let param = new URLSearchParams()
            param.append('uid',this.user.uid)
            param.append('company_id',this.nowCompanyId)
            param.append('reviewer',this.logs.reviewer)
            param.append('log_type',this.log_type)
            this.logs.user_save_time = Date.parse(new Date(this.logs.user_save_time))/1000
            param.append('user_save_time',this.logs.user_save_time)
            this.logs.json = JSON.stringify(this.logs.json)
            param.append('json',this.logs.json)
            param.append('custom_form_type',this.custom_form_type)
            param.append('custom_form_result',this.logs.custom_form_result)
            let httpUrl = this.$test('/index.php/Mobile/company/publish_log')
            this.$http.post(httpUrl,param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                this.loadingShow = false
                if(res.data.code === 0) {
                  this.add_ok()
                  this.loading_show = false
                  this.actions = '0'
                  this.$router.push({
                    path: '/work/record'
                  })
                } else {
                  this.add_fail()
                }
              })
          }else{
            if(this.picArr.length != 0){
              var upload_enclosure_new = (fn) =>{
                for(let i =0;i<this.picArr.length;i++){
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
                      if(this.pic_hash_arr.length == this.picArr.length) {
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
                let httpUrl = this.$test("/index.php/Mobile/approval/upload_enclosure_new")
                this.$http.post(httpUrl, nparam)
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
              for(let i = 0; i < this.fileArr.length; i++){
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
                  let httpUrl = this.$test("/index.php/Mobile/approval/add_attachments")
                  this.$http.post(httpUrl, param)
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
                  let httpUrl = this.$test("/index.php/Mobile/find/file_info")
                  this.$http.post(httpUrl)
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
                            let httpUrl = this.$test("/index.php/Mobile/approval/add_attachments")
                            this.$http.post(httpUrl, param)
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
        },500)
      },
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
      handClick(tab){
        this.tode = []
        let index = parseInt(tab.index)+1
        this.log_type = index
        if(index == 1){
          this.das = 'date'
          this.inde = this.log_type
          let param = new URLSearchParams()
          param.append('type',index)
          let httpUrl = this.$test('/index.php/Mobile/find/select_company_log_types')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              res.data.data.forEach((item)=>{
                this.plan.push(item)
              })
            })
          this.addShow = true
          this.logShow = false
        }
        if(index == 2 || index == 3){
          let param = new URLSearchParams()
          param.append('type',index)
          let httpUrl = this.$test('/index.php/Mobile/find/select_company_log_types')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              let ad = res.data.data[0].log_type_id
              if(ad == 100){
                this.das = 'week'
              }
              if(ad == 101){
                this.das = 'month'
              }
              this.log(ad)
            })
        }
      },
      _getData(){
        this.log_type = '1'
        this.tode = []
        this.das = 'date'
        let param = new URLSearchParams()
        param.append('type',1)
        let httpUrl = this.$test('/index.php/Mobile/find/select_company_log_types')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            res.data.data.forEach((item)=>{
              this.plan.push(item)
            })
          })
        this.addShow = true
      },
      asShow(){
        this.addShow = false
        this.plan = []
      },
      log(se){
        this.addShow = false
        this.logShow = true
        let param = new URLSearchParams()
        param.append('log_type_id',se)
        this.custom_form_type = se
        let httpUrl = this.$test('/index.php/Mobile/find/get_company_log_elements')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            res.data.data.forEach((item)=>{
              this.tode.push(item)
            })
            this.msms()
            this.fill()
            this.plan = []
          })
      },
    },
    components: {
      sec,
      datas,
      loading,
      moment
    },
    props:{
      todo:{

      },
    },
    created(){
      this._getComDepart()
      this._getComPersonList()
      this._getData()
    },
    mounted(){
      if(this.$route.path === '/work/log') {
        this.$emit('changeWorkIndex', '4-9-2')
      }
    },
    watch:{
      file_time(){
        if(this.picArr.length != 0) {
          if(this.pic_time === 0) {
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0){
          let param = new URLSearchParams();
          param.append('uid',this.user.uid)
          param.append('company_id',this.nowCompanyId)
          param.append('reviewer',this.logs.reviewer)
          param.append('log_type',this.log_type)
          this.logs.user_save_time = Date.parse(new Date(this.logs.user_save_time))/1000
          param.append('user_save_time',this.logs.user_save_time)
          param.append('enclosure',JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]))
          this.logs.json = JSON.stringify(this.logs.json)
          param.append('json',this.logs.json)
          param.append('custom_form_type',this.custom_form_type)
          param.append('custom_form_result',this.logs.custom_form_result)
          let httpUrl = this.$test('/index.php/Mobile/company/publish_log')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code === 0) {
                this.add_ok()
                this.loading_show = false
                this.actions = '0'
                this.$router.push({
                  path: '/work/record'
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
          param.append('uid',this.user.uid)
          param.append('company_id',this.nowCompanyId)
          param.append('reviewer',this.logs.reviewer)
          param.append('log_type',this.log_type)
          this.logs.user_save_time = Date.parse(new Date(this.logs.user_save_time))/1000
          param.append('user_save_time',this.logs.user_save_time)
          param.append('enclosure',JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]))
          this.logs.json = JSON.stringify(this.logs.json)
          param.append('json',this.logs.json)
          param.append('custom_form_type',this.custom_form_type)
          param.append('custom_form_result',this.logs.custom_form_result)
          let httpUrl = this.$test('/index.php/Mobile/company/publish_log')
          this.$http.post(httpUrl,param)
            .then((res)=>{
              var current = this
              var judge = res.data.code
              this.$testLogin(judge,current)
              this.loadingShow = false
              if(res.data.code === 0) {
                this.add_ok()
                this.loading_show = false
                this.$router.push({
                  path: '/work/record'
                })
              } else {
                this.add_fail()
              }
            })
        }
      }
    },
    computed:{
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ])
    }
  }
</script>

<style lang="scss">
  .log{
    width: 100%;
    overflow: hidden;
    background: #ffffff;
    margin-top: 3px;
    .tab {
      width: 100%;
      height: 40px;
      overflow: hidden;
      background: #ffffff;
      .el-tabs__header{
        margin-bottom: 5px;
      }
      .el-tabs__active-bar {
        width: 33.3%;
      }
      .el-tabs__nav {
        width: 100%;
      }
      .el-tabs__item {
        font-size: 15px;
        font-weight: 700;
        width: 33.3%;
        text-align: center;
      }
    }
    .block{
      width: 100%;
      overflow: hidden;
      .date{
        width: 80%;
        float: left;
      }
      .day{
        width: 200px;
        margin: 0 auto;
        .el-date-editor{
          margin-top: 20px;
          margin-bottom: 20px;
        }
      }
      .week{
        .wel{
          margin: 0 auto;
          width: 300px;
          .el-date-editor{
            width: 140px;
            margin: 20px auto;
          }
        }
      }
    }
  }
  .zz{
    display: block;
    float: left;
    margin-top: 25px;
    font-size: 14px;
    padding: 5px;
    background: #FF7A4C;
    color: white;
    border-radius: 4px
  }
  #pic{
    width: 95%;
    margin: 0 auto;
    ul{
      li{
        width: 85px;
        height: 85px;
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
  .el-icon-plus{
    position: relative;
    top: -25px;
  }
  .upload-demo_c{
    width: 95%;
    margin: 20px auto 0;
  }
  .log .el-button--primary{
    margin: 20px;
  }
  .log .el-button--warning{
    float: right;
    margin: 20px;
  }
  .log .el-button--success{
    margin: 0px 20px 20px;
  }
  .cc{
    >.tab {
      width: 100%;
      height: 40px;
      overflow: hidden;
      background: #ffffff;
      .el-tabs__header{
        margin-bottom: 5px;
      }
      .el-tabs__active-bar {
        width: 50%;
      }
      .el-tabs__nav {
       width: 100%;
      }
      .el-tabs__item {
        font-size: 15px;
        font-weight: 700;
        width: 50%;
        text-align: center;
      }
    }
  }
  .units{
    width: 100%;
    height: 500px;
    overflow: auto;
    .el-checkbox{
      margin-top: 10px;
      margin-left: 15px;
    }
  }
  .choose{
    width: 100%;
    border-top: 1px solid black;
    p{
      display: inline-block;
      margin-top: 20px;
      font-size: 14px;
    }
    .el-button{
      float: right;
      margin: 10px !important;
    }
  }
  .comPer{
    width: 100%;
    height: 500px;
    overflow: auto;
    .el-radio-group{
      width: 500px;
      display: block;
      margin-top: 10px;
      margin-left: 15px;
    }
  }
  .addsd{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10;
    ul {
      width: 200px;
      background: #FFFFFF;
      margin: 200px auto;
      padding: 10px;
      border-radius: 4px;
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 20px;
        color: #409EFF;
      }
      i {
        font-size: 20px;
        float: right;
        cursor: pointer;
        &:hover {
          color: #FA5555
        }
      }
      li {
        cursor: pointer;
        display: block;
        height: 24px;
        line-height: 24px;
        font-size: 15px;
        &:hover {
          color: #5A5E66;
        }
      }
    }
  }
</style>
