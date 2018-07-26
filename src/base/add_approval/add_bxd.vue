<template>
  <div class="baoxiaodan">
    <el-form :model="bxd_ruleForm" :rules="bxd_rules" ref="bxd_ruleForm" label-width="150px" class="demo-bxd_ruleForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="bxd_ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="项目负责人(部门经理)">
        <el-select v-model="bxd_ruleForm.project_manager_name" placeholder="请选择" @change="bxdSelectOk">
          <el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
            <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
            <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <div class="add_bxd">添加报销条目 <i class="el-icon-circle-plus" @click="add_bxd"></i><span style="color: red;display: inline-block" v-model="bxd_ruleForm.money">总额:{{bxd_ruleForm.money}}</span> <span style="color: red;display: block;margin-left: 135px" v-model="bxd_ruleForm.big_money">{{bxd_ruleForm.big_money}}</span></div>
      <div v-for="(item,index) in bxd_ruleForm.add" class="new_bxd">
        <div class="close"><i class="fa fa-close" v-show="bxd_ruleForm.add.length > 1" @click="closeQd(index)"></i></div>
        <el-form :inline="true" class="demo-form-inline zp">
          <el-form-item label="日期" prop="start_time">
            <el-date-picker type="date" v-model="item.month_day" style="width: 200px"></el-date-picker>
          </el-form-item>
          <el-form-item label="报销内容">
            <el-input v-model="item.content"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline zp">
          <el-form-item label="备注">
            <el-input v-model="item.remarks"></el-input>
          </el-form-item>
          <el-form-item label="单据张数">
            <el-input v-model="item.amount" @change="checkAmount(item)"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline zp">
          <el-form-item label="总额">
            <!--<el-input v-model="item.price"></el-input>-->
            <input type="tel" class="el-input__inner" @change="checkPrice(item)" v-model="item.price">
          </el-form-item>
          <el-form-item label="大写金额" >
            <el-input v-model="item.big_price" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-upload class="upload-demo" id="picc" v-model="bxd_ruleForm.many_enclosure" accept="image/jpg,image/png,image/jpeg"  multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
        <i class="el-icon-plus"></i>
        <!--<el-button size="small" type="info" plain id="juz">上传图片</el-button>-->
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
      </el-upload>
      <el-upload class="upload-demo_a" v-model="bxd_ruleForm.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
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
        <el-button type="primary" @click="submitForm_bxd('bxd_ruleForm')">立即添加</el-button>
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
            fileList_a:[],
            picArr:[],
            fileArr:[],
            bxd_ruleForm:{
              title:'',
              project_manager: {},
              project_manager_name: '',
              money:'',
              big_money:'',
              add:[{
                month_day:'',
                content:'',
                amount:'',
                price:'',
                remarks:'',
                big_price:''
              }]
            },
            bxd_rules:{
              title:[{
                required: true,
                message: '请填写标题',
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
            pic_enclosure_id: '',
            str:'',
            handler:''
          }
        },
        props: {
          approval_id:{
            type: String
          },
          userList:{

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
          resetForm(){
            this.$refs.bxd_ruleForm.resetFields()
            this.bxd_ruleForm.money = ''
            this.bxd_ruleForm.big_money =''
            var arr = this.bxd_ruleForm.add
            for(var i = 0;i<arr.length ;i++){
              arr[i].month_day = ''
              arr[i].content = ''
              arr[i].amount = ''
              arr[i].price = ''
              arr[i].remarks = ''
              arr[i].big_price = ''
            }
          },
          handlePreview(file,fileList){
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
          checkPrice:function (data) {
            var priceReg = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/
            if(!priceReg.test(data.price)){
              this.$message({
                showClose: true,
                message: '格式错误',
                type: 'error'
              })
              data.price="";
            }
            var str = this.dx(data.price)+'整'
            data.big_price = str
            var sub = this.bxd_ruleForm.add
            var tato = 0
            let val = ''
            for (var i = 0;i<sub.length;i++){
              tato +=Number(sub[i].price)
              val=Math.floor(tato * 100) / 100
            }
            this.bxd_ruleForm.money =val
            this.bxd_ruleForm.big_money = this.dx(val)+'整'
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
            let str = this.$test("/index.php/Mobile/approval/approval_process_show")
            this.$http.post(str, param)
              .then((res)=>{
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                this.form_Lista = create_baoxiaodan_list(res.data.data)
                var str = 0
                var sub = this.form_Lista.content
                for (var i = 0;i<sub.length;i++){
                  str += Number(sub[i].price)
                }
                this.bxd_ruleForm.money = str
                this.bxd_ruleForm.big_money = this.form_Lista.big_money
                this.bxd_ruleForm.add = this.form_Lista.content
                this.bxd_ruleForm.title = this.form_Lista.title
                this.bxd_ruleForm.project_manager_name = this.form_Lista.project_manager_name
                this.bxd_ruleForm.many_enclosure = this.form_Lista.many_enclosure
                this.bxd_ruleForm.project_manager = this.form_Lista.project_manager
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
                  }
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
            var arr = this.bxd_ruleForm.add
            for(var i = 0;i<arr.length;i++){
              arr[i].month_day = ''
            }
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
            let str = this.$test("/index.php/Mobile/path/get_token")
            this.$http.post(str, nparam)
              .then((res) => {
                var current = this
                var judge = res.data.code
                this.$testLogin(judge,current)
                localStorage.token = JSON.stringify(res.data.data);
                this.setToken(res.data.data)
              })
          },
          ...mapMutations({
            setToken:'SET_TOKEN'
          }),
          bxdSelectOk(tab){
            this.handler = tab
            this.comPersonList.forEach((item) => {
              if(item.uid === tab) {
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
            this.returnOk = false
            this.bxd_ruleForm.add.forEach((item)=>{
             if(item.month_day===''||item.content===''||item.price===''||item.amount===''){
               this.$message.error('请将清单条目填写完整');
               this.returnOk = true
             }
            })
            if(!this.bxd_ruleForm.project_manager){
              this.$message.error('请选择项目经理')
              return false
            }
            if(this.returnOk === true) {
              return
            }
            this.$refs[formName].validate((valid) => {
              if(valid) {
                this.$confirm('确定总额为' + this.bxd_ruleForm.money + '吗', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type:'warning'
                }).then(()=>{
                  this.bxd_submit()
                  this.loadingShow = true
                }).catch(()=>{
                  this.$message({
                    type: 'info',
                    message: '已取消操作'
                  });
                })
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
              if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1'|| item.name.indexOf("图像") != '-1'){
                this.picArr.push(item)
              }
            })
            this.fileList_a.forEach((item) =>{
              this.fileArr.push(item)
            })
            let stuf = this.bxd_ruleForm.add
            for(var i=0;i<stuf.length;i++){
              let timestamp2 = Date.parse(new Date(stuf[i].month_day));
              let date = new Date();
              date.setTime(timestamp2);
              let y = date.getFullYear();
              let m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              let d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              stuf[i].month_day = y + '-' + m + '-' + d
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
                param.append("title",this.bxd_ruleForm.title)
                param.append("money",this.bxd_ruleForm.money)
                param.append("big_money",this.bxd_ruleForm.big_money)
                param.append("content", JSON.stringify(this.bxd_ruleForm.add));
                let str = this.$test("/index.php/Mobile/approval/add_baoxiao")
                this.$http.post(str,param)
                  .then((res)=>{
                    var current = this
                    var judge = res.data.code
                    this.$testLogin(judge,current)
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
                    //请求七牛

                  }
                }
                //文档的判断
                if(this.fileArr.length != 0) {
                  for (let i = 0; i < this.fileArr.length; i++) {
                    console.log(this.fileArr[i])
                    let formData = new FormData();
                    formData.append('file', this.fileArr[i].raw);
                    formData.append('token', this.token);
                    let config = {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                    if (!this.fileArr[i].size) {
                      let index = this.fileArr[i].name.lastIndexOf('.')
                      let attribute = this.fileArr[i].name.slice(index)
                      if (attribute.substr(0, 1) == '.') {
                        attribute = attribute.substr(1)
                      }
                      let file_name = this.fileArr[i].name.slice(0, index)
                      let param = new URLSearchParams();
                      param.append("uid", this.user.uid);
                      param.append("attribute", attribute);
                      param.append("attachments", this.fileArr[i].hash);
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
                          if (this.file_hash_arr.length === this.fileArr.length) {
                            let bDate = Date.parse(new Date())
                            this.file_time = bDate
                          }
                        })
                    } else {
                      let size = this.fileArr[i].size
                      let index = this.fileArr[i].name.lastIndexOf('.')
                      let attribute = this.fileArr[i].name.slice(index)
                      if (attribute.substr(0, 1) == '.') {
                        attribute = attribute.substr(1)
                      }
                      let str = this.$test("/index.php/Mobile/find/file_info")
                      this.$http.post(str)
                        .then((res) => {
                          var current = this
                          var judge = res.data.code
                          this.$testLogin(judge,current)
                          let maxSize = res.data.data.max
                          let attr = res.data.data.attribute
                          if (attr.indexOf(attribute) != -1) {
                            if (size < maxSize) {
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
                                    if (this.file_hash_arr.length === this.fileArr.length) {
                                      let bDate = Date.parse(new Date())
                                      this.file_time = bDate
                                    }
                                  })
                              })
                            } else {
                              this.$message.error('上传文件过大 请删除')
                              this.loadingShow = false
                              return false
                            }
                          } else {
                            this.$message.error('请删除' + this.fileArr[i].name)
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
              param.append("title",this.bxd_ruleForm.title)
              param.append("money",this.bxd_ruleForm.money)
              param.append("big_money",this.bxd_ruleForm.big_money)
              param.append("content", JSON.stringify(this.bxd_ruleForm.add));
              param.append("project_manager_name",this.bxd_ruleForm.project_manager_name)
              param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
              let str = this.$test("/index.php/Mobile/approval/add_baoxiao")
              this.$http.post(str,param)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
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
              param.append("title",this.bxd_ruleForm.title)
              param.append("money",this.bxd_ruleForm.money)
              param.append("big_money",this.bxd_ruleForm.big_money)
              param.append("content", JSON.stringify(this.bxd_ruleForm.add));
              param.append("project_manager_name",this.bxd_ruleForm.project_manager_name)
              param.append("many_enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
              let str = this.$test("/index.php/Mobile/approval/add_baoxiao")
              this.$http.post(str,param)
                .then((res)=>{
                  var current = this
                  var judge = res.data.code
                  this.$testLogin(judge,current)
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
        }
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
</style>
