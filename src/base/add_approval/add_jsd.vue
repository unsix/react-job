<template>
    <div >
      <el-form :model="jsd_ruleForm" :rules="jsd_rules" ref="jsd_ruleForm" label-width="150px" class="new_bxd demo-jsd_ruleForm">
        <el-form-item label="工程项目名称" prop="project_name" class="mar">
          <el-input v-model="jsd_ruleForm.project_name"></el-input>
        </el-form-item>
        <el-form-item label="施工位置" prop="project_adress" class="mar">
          <el-input v-model="jsd_ruleForm.project_adress"></el-input>
        </el-form-item>
        <el-form-item label="请款施工班组" prop="construction_name" class="mar">
          <el-input v-model="jsd_ruleForm.construction_name"></el-input>
        </el-form-item>
        <el-form-item label="截止日期" prop="closing_data" class="mar">
          <el-date-picker v-model="jsd_ruleForm.closing_data" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract_name" >
          <el-input v-model="jsd_ruleForm.contract_name" style="width:195px;"></el-input>
          <el-button type="info" plain @click="viewHt" style="float: right;margin-right: 5px;" v-show="btnShow">查看合同</el-button>
        </el-form-item>
        <el-form-item label="合同金额" prop="contract_price" class="mar">
          <el-input v-model="jsd_ruleForm.contract_price"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人" class="mar">
          <el-select v-model="jsd_ruleForm.project_manager_name" placeholder="请选择" @change="cpjSelectOk">
            <el-option v-for="item in comPersonList"
                       :key="item.personnel_id"  :label="item.name" :value="item.uid">
              <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
              <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-button class="addconstrution" type="primary"  size="small" @click="add_jsd" >添加施工内容</el-button>
        <!--<el-button class="addconstrution" v-show="jsd_ruleForm.add.length > 1" type="primary"  size="small" @click="closeQd(index)" >添加施工内容</el-button>-->
        <li v-for="(item,index) in jsd_ruleForm.add">
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <div class="close"><i class="fa fa-close" v-show="jsd_ruleForm.add.length > 1" @click="closeQd_add(index)"></i></div>
          <el-form-item label="施工内容" prop="unit" class="mar">
            <el-input type="textarea"
                      autosize
                      v-model="item.content"
                      placeholder="例子:2-17楼户内墙砖完成，2-楼户内地砖完成" >
            </el-input>
          </el-form-item>
          <el-form-item  label="单位">
            <el-input v-model="item.unit"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="item.amount" @change="checkAmount(item)"></el-input>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="item.unit_price" @change="checkUnit(item)"></el-input>
          </el-form-item>
          <el-form-item label="合计" class="automatic">
            <!--<input type="tel" class="el-input__inner" :readonly="true" v-model="item.sum_price">-->
            {{item.amount&&item.unit_price!=''?item.amount*item.unit_price:'自动计算'}}
          </el-form-item>
          <el-form-item label="备注" >
            <el-input v-model="item.remarks" ></el-input>
          </el-form-item>
        </li>
        <el-form-item label="班组产值合计" class="automatic">
          {{sum_Team!=0?sum_Team:'自动计算'}}
        </el-form-item>
        <div>
          <el-button class="addconstrution" type="info" plain>已支付</el-button>
        </div>
        <el-button  type="primary" class="addconstrution"  size="small" @click="add_jsds" >添加支付工程款</el-button>
        <!--<el-button class="addconstrution" v-show="jsd_ruleForm.add.length > 1" type="primary"  size="small" @click="closeQd(index)" >添加施工内容</el-button>-->
        <li v-for="(item,index) in jsd_ruleForm.adds">
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <div class="close"><i class="fa fa-close"  @click="closeQd_adds(index)"></i></div>
          <el-form-item label="内容" prop="unit" class="mar">
            <el-input type="textarea"
                      autosize
                      v-model="item.content"
                      placeholder="例子:2-17楼户内墙砖完成，2-楼户内地砖完成" >
            </el-input>
          </el-form-item>
          <el-form-item  label="金额">
            <el-input v-model="item.sum_price"></el-input>
          </el-form-item>
        </li>
        <el-form-item label="累计支付工程款" class="automatic" >
          {{sum_Pay!=0?sum_Pay:'自动计算'}}
        </el-form-item>
        <div>
          <el-button class="addconstrution" type="info" plain>扣款项</el-button>
        </div>
        <el-button  type="primary" class="addconstrution"  size="small" @click="add_jsdss" >添加扣款项</el-button>
        <!--<el-button class="addconstrution" v-show="jsd_ruleForm.add.length > 1" type="primary"  size="small" @click="closeQd(index)" >添加施工内容</el-button>-->
        <li v-for="(item,index) in jsd_ruleForm.addss">
          <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
          <div class="close"><i class="fa fa-close"  @click="closeQd_addss(index)"></i></div>
          <el-form-item label="内容" prop="unit" class="mar">
            <el-input type="textarea"
                      autosize
                      v-model="item.content"
                      placeholder="例子:2-17楼户内墙砖完成，2-楼户内地砖完成" >
            </el-input>
          </el-form-item>
          <el-form-item  label="金额">
            <el-input v-model="item.sum_price"></el-input>
          </el-form-item>
        </li>
        <el-form-item label="扣款项合计" class="automatic">
          {{sum_Cut!=0?sum_Cut:'自动计算'}}
        </el-form-item>
        <div>
          <el-button class="addconstrution" type="info" plain>剩余工程款</el-button>
        </div>
        <el-form-item label="剩余工程款"  class="automatic">
          <!--{{ sum_Team-sum_Pay-sum_Cut!=0?sum_Team-sum_Pay-sum_Cut:'自动计算'}}-->
          {{sum_Surplus!=0?sum_Surplus:'自动计算'}}
        </el-form-item>
        <el-upload class="upload-demo" id="picc" v-model="jsd_ruleForm.many_enclosure" accept="image/jpg,image/png,image/jpeg"  multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
          <i class="el-icon-plus"></i>
          <!--<el-button size="small" type="info" plain id="juz">上传图片</el-button>-->
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
        <el-upload class="upload-demo_a" v-model="jsd_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
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
          <el-button type="primary" @click="submitForm_jsd('jsd_ruleForm')">立即添加</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="loadingShow"></loading>
    </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import loading from '@/base/loading/loading'
  import * as math from 'mathjs'
  import more from '@/base/add_approval/more'
  export default {
    data(){
      return{
        jsd_rules:{
          project_name: [{
            required: true,
            message: '请填写工程项目名称',
            trigger: 'change'
          }],
          construction_name: [{
            required: true,
            message: '请填写施工队名称',
            trigger: 'blur'
          }],
          contract_name: [{
            required: true,
            message: '请填写合同名称',
            trigger: 'blur'
          }],
          contract_price: [{
            required: true,
            message: '请填写合同金额',
            trigger: 'blur'
          }]
        },
        jsd_ruleForm:{
          project_name:'',
          construction_name:'',
          contract_name:'',
          contract_price:'',
          money:'',
          big_money:'',
          adds:[],
          addss:[],
          add:[{
            content:'',
            unit:'',
            amount:'',
            unit_price:'',
            sum_price:'',
            remarks:''
          }],
          contract_id:'',
          project_manager:{},
          project_manager_name:'',
          many_enclosure:[],
          contract_request_id:''
        },
        fileList:[],
        fileList_a:[],
        picArr:[],
        fileArr:[],
        pic_hash_arr:[],
        afile_hash_arr:[],
        file_hash_arr:[],
        file_time:0,
        pic_time:0,
        loadingShow:false,
        form_Lista:{}
      }
    },
    methods:{
      ...mapMutations({
        setToken: 'SET_TOKEN'
      }),
      cpjSelectOk(tab){
        this.handler = tab
        this.jsd_ruleForm.project_manager = new Object()
        this.comPersonList.forEach((item) => {
          if(item.uid === tab) {
            this.$set(this.jsd_ruleForm.project_manager, 'uid', item.uid)
          }
        })
      },
      chooseHetong(){
        this.hetongListShow = true
        let param = new URLSearchParams();
        param.append("uid", this.user.uid);
        let str = this.$test("/index.php/Mobile/find/draft_list")
        this.$http.post(str, param)
          .then((res) => {
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.hetongList = res.data.data
          })
      },
      viewHt(){
        let str = this.$test('/index.php/Mobile/skey/look_draft?id=')
        window.open( str+this.jsd_ruleForm.contract_request_id+'&operation=2&view=4')
      },
      add_jsd(){
        let obj = {
          content:'',
          unit:'',
          amount:'',
          unit_price:'',
          sum_price:'',
          remarks:''
        }
        this.jsd_ruleForm.add.push(obj)
      },
      closeQd_add(index){
        this.jsd_ruleForm.add.splice(index,1)
      },
      add_jsds(){
        let obj = {
          content_build:'',
          sum_price_build:''
        }
        this.jsd_ruleForm.adds.push(obj)
      },
      closeQd_adds(index){
        this.jsd_ruleForm.adds.splice(index,1)
      },
      add_jsdss(){
        let obj = {
          content:'',
          sum_price:''
        }
        this.jsd_ruleForm.addss.push(obj)
      },
      closeQd_addss(index){
        this.jsd_ruleForm.addss.splice(index,1)
      },
      submitForm_jsd(formName){
        this.loadingShow = true
        this.$refs.more.submit()
        setTimeout(()=>{
          this.$refs[formName].validate((valid) => {
            if(valid) {
              this.jsd_submit()
              this.loading_show = true
            } else {
              this.$message.error('请将表单填写完整');
              this.$refs.more.file = []
              return false;
            }
          });
        },500)
      },
      handlePreview(file, fileList){
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
      handleRemove(file, fileList){
        this.fileList = fileList
      },
      handlePreview_a(file, fileList_a){
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
      handleRemove_a(file, fileList_a){
        this.fileList_a = fileList_a
      },
      checkAmount:function (data) {
        var priceReg = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/
        if(!priceReg.test(data.amount)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.amount="";
        }
      },
      checkUnit:function (data) {
        var priceReg = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/
        if(!priceReg.test(data.unit_price)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.unit_price="";
        }
      },
      dx:function (n) {
        var unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分",
          str = "";
        n += "00";
        var p = n.indexOf('.');
        if(p >= 0){
          n = n.substring(0, p) + n.substr(p + 1, 2);
        }
        unit = unit.substr(unit.length - n.length);
        for(var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(兆|万|亿|元)/g, "$1").replace(/(兆|亿)万/g, "$1").replace(/(京|兆)亿/g, "$1").replace(/(京)兆/g, "$1").replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, "$1$2零$3仟").replace(/(^元零?|零分)$/g, "").replace(/(元|角)$/g, "$1");
      },
      jsd_submit(){
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
        setTimeout(()=>{
          if(this.picArr.length === 0 && this.fileArr.length === 0){
            let param = new URLSearchParams()
            if(this.jsd_ruleForm.contract_id){
              param.append('approval_contract_id',this.jsd_ruleForm.contract_id)
            }else{
              param.append('contract_request_id',this.jsd_ruleForm.contract_request_id)
            }
            param.append('project_name',this.jsd_ruleForm.project_name)
            param.append('construction_name',this.jsd_ruleForm.construction_name)
            param.append('contract_name',this.jsd_ruleForm.contract_name)
            param.append('contract_price',this.jsd_ruleForm.contract_price)
            param.append('list_json',JSON.stringify(this.jsd_ruleForm.add))
            param.append('total_price',this.jsd_ruleForm.money)
            param.append('company_id',this.nowCompanyId)
            let todo = JSON.stringify(this.jsd_ruleForm.project_manager)
            if(todo != 'null'){
              param.append("project_manager", todo);
            }
            if(more.file.length > 0){
              param.append("many_enclosure", JSON.stringify([...more.file]));
            }
            let str = this.$test("/index.php/Mobile/approval/add_settlement")
            this.$http.post(str, param)
              .then((res)=>{
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
          }else{
            if(this.picArr.length != 0){
              var upload_enclosure_new = (fn) =>{
                this.picArr.forEach((item)=>{
                  let formData = new FormData()
                  formData.append('file',item.raw)
                  formData.append('token',this.token)
                  let config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                  if(!item.size){
                    this.pic_hash_arr.push(item.hash)
                    this.pic_hash_arr.length == this.picArr.length && fn(item.name)
                  }else{
                    this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                      this.pic_hash_arr.push(res.data.hash)
                      if(this.pic_hash_arr.length === this.picArr.length){
                        fn(item.name)
                      }
                    })
                  }
                })
              }
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append('uid',this.user.uid)
                nparam.append('picture',JSON.stringify(this.pic_hash_arr))
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
            }
            if(this.fileArr.length != 0){
              this.fileArr.forEach((item)=>{
                let formData = new FormData()
                formData.append('file',item.raw)
                formData.append('token',this.token)
                let config = {
                  headers:{
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
                  let str = this.$test("/index.php/Mobile/approval/add_attachments")
                  this.$http.post(str, param)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      this.file_hash_arr.push({
                        "type": 4,
                        "contract_id": res.data.data.attachments_id,
                        "name": item.name
                      })
                      if(this.file_hash_arr.length === this.fileArr.length) {
                        let bDate = Date.parse(new Date())
                        this.file_time = bDate
                      }
                    })
                }else{
                  let size = item.size
                  let index = item.name.lastIndexOf('.')
                  let attribute = item.name.slice(index)
                  if(attribute.substr(0,1) == '.'){
                    attribute = attribute.substr(1)
                  }
                  let str = this.$test("/index.php/Mobile/find/file_info")
                  this.$http.post(str)
                    .then((res)=>{
                      var current = this
                      var judge = res.data.code
                      this.$testLogin(judge,current)
                      let maxSize = res.data.data.max
                      let attr = res.data.data.attribute
                      if(attr.indexOf(attribute)!= -1){
                        if(size < maxSize){
                          this.$http.post('https://up.qbox.me/',formData,config).then((res)=>{
                            let file_name = item.name.slice(0,index)
                            let param = new URLSearchParams()
                            param.append('uid',this.user.uid)
                            param.append('attribute',attribute)
                            param.append('attachments',res.data.hash)
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
                                  "name": item.name
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
              })
            }
          }
        },500)
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
      initial_data(){
        if(this.contract_name){
          this.jsd_ruleForm.contract_request_id = this.contract
          this.jsd_ruleForm.contract_name = this.contract_name
        }
        if(!this.approval_id || this.approval_id === '') {
          return
        }
        let param = new URLSearchParams()
        param.append("uid",this.user.uid);
        param.append("approval_id",this.approval_id)
        let str = this.$test("/index.php/Mobile/approval/approval_process_show")
        this.$http.post(str, param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            this.form_Lista = res.data.data
            var str = 0
            var sub = this.form_Lista.list_json
            for (var i = 0;i<sub.length;i++){
              str += Number(sub[i].sum_price)
            }
            this.jsd_ruleForm.money = str
            this.jsd_ruleForm.big_money = this.dx(str)
            this.jsd_ruleForm.add = this.form_Lista.list_json
            this.jsd_ruleForm.project_name = this.form_Lista.project_name
            this.jsd_ruleForm.project_manager = JSON.parse(this.form_Lista.project_manager)
            this.jsd_ruleForm.construction_name = this.form_Lista.construction_name
            this.jsd_ruleForm.contract_price = this.form_Lista.contract_price
            this.jsd_ruleForm.contract_name = this.form_Lista.contract_name
            this.jsd_ruleForm.project_manager_name = this.form_Lista.project_manager_name.name
            if(this.form_Lista.contract_request_id){
              this.jsd_ruleForm.contract_request_id = this.form_Lista.contract_request_id
            }else{
              //缺少else语句
            }
            this.form_Lista.many_enclosure.forEach((item)=>{
              let img_name = item.name
              if(item.type == 3){
                let param = new URLSearchParams()
                param.append('enclosure_id',item.contract_id)
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
              }else if(item.type == 4){
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
      }
    },
    watch:{
      file_time(){
        if(this.picArr.length != 0){
          if(this.pic_time == 0){
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0){
          let param = new URLSearchParams()
          if(this.jsd_ruleForm.contract_id){
            param.append('approval_contract_id',this.jsd_ruleForm.contract_id)
          }else{
            param.append('contract_request_id',this.jsd_ruleForm.contract_request_id)
          }
          param.append('project_name',this.jsd_ruleForm.project_name)
          param.append('construction_name',this.jsd_ruleForm.construction_name)
          param.append('contract_name',this.jsd_ruleForm.contract_name)
          param.append('contract_price',this.jsd_ruleForm.contract_price)
          param.append('list_json',JSON.stringify(this.jsd_ruleForm.add))
          param.append('total_price',this.jsd_ruleForm.money)
          param.append('company_id',this.nowCompanyId)
          let todo = JSON.stringify(this.jsd_ruleForm.project_manager)
          if(todo != 'null'){
            param.append("project_manager", todo);
          }
          var more = this.$refs.more
          param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr,...more.file]));
          let str = this.$test("/index.php/Mobile/approval/add_settlement")
          this.$http.post(str, param)
            .then((res)=>{
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
      pic_time(){
        if(this.fileArr.length != 0) {
          if(this.file_time === 0) {
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0) {
          let param = new URLSearchParams()
          if(this.jsd_ruleForm.contract_id){
            param.append('approval_contract_id',this.jsd_ruleForm.contract_id)
          }else{
            param.append('contract_request_id',this.jsd_ruleForm.contract_request_id)
          }
          param.append('project_name',this.jsd_ruleForm.project_name)
          param.append('construction_name',this.jsd_ruleForm.construction_name)
          param.append('contract_name',this.jsd_ruleForm.contract_name)
          param.append('contract_price',this.jsd_ruleForm.contract_price)
          param.append('list_json',JSON.stringify(this.jsd_ruleForm.add))
          param.append('total_price',this.jsd_ruleForm.money)
          param.append('company_id',this.nowCompanyId)
          let todo = JSON.stringify(this.jsd_ruleForm.project_manager)
          if(todo != 'null'){
            param.append("project_manager", todo);
          }
          let str = this.$test("/index.php/Mobile/approval/add_settlement")
          var more = this.$refs.more
          param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr,...more.file]));
          this.$http.post(str, param)
            .then((res)=>{
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
      }
    },
    created(){
      this.initial_data()
    },
    props: {
      approval_id:{
        type: String
      },
      userList:{

      },
      contract_name:{

      },
      contract:{

      },
      btnShow:{
        default:false
      }
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ]),
      sum_Team() {
        let _list = this.jsd_ruleForm.add;
        let sum = 0;
        _list.forEach(i => {
          let s = i.amount * i.unit_price;
          sum += s;
        });
        return sum;
      },
      sum_Pay(){
        let _list = this.jsd_ruleForm.adds;
        let sum = 0;
        _list.forEach(i => {
          let s = i.sum_price;
          sum += s;
        });
        return sum;
      },
      sum_Cut(){
        let _list = this.jsd_ruleForm.addss;
        let sum = 0;
        _list.forEach(i => {
          let s = i.sum_price;
          sum += s;
        });
        return sum;
      },
      sum_Surplus(){
        let sum = 0;
        let team = this.sum_Team;
        let pay = this.sum_Pay;
        let cut = this.sum_Cut;
        if(pay&&cut!=0){
          sum = team-pay-cut
        }
        else if(pay!=0&&cut==0){
          sum = team-pay
        }
        else if(pay==0&&cut!=0){
          sum = team-cut
        }
        else {
          sum = team
        }
        return sum
      }
    },
    components:{
      loading,
      more
    },
  }
</script>

<style lang="scss">
  .el-form--inline .el-form-item{
    margin-left: 10px !important;
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
  .zp{
    .el-input__inner{
      width: 200px;
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
  .addconstrution{
    clear: both;
    margin-left: 26px;
    margin-top: 10px;
  }
  .font_form{
    width: 98%;
    padding-right: 2%;
    overflow: hidden;
    border-bottom: 1px solid #e3e4e9;
    .el-form-item{
      margin-bottom: 5px;
      width: 50%;
      float: left;
      .el-form-item__label{
        font-size: 12px;
      }
      .el-form-item__content{
        font-size: 12px;
        margin-left: 350px;
        .el-input{
          font-size: 12px;
          input{
            height: 30px;
          }
        }
        .el-date-editor{
          width: 195px;
        }
        .el-button--primary{
          margin-left: 90px;
        }
      }
    }
  }
  .mar{
    width: 100%!important;
  }
   li {
    list-style: none;
  }
  .automatic{
    color: #409EFF;
  }
</style>
