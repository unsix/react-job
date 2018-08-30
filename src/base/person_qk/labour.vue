<template>
  <div>
    <div v-show="mainShow" class="font_form">
      <el-form label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="todo.name"  @click.native="getNmae('姓名')"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="todo.phone" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="开户行" class="mar">
          <el-input v-model="todo.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="开户账号">
          <el-input v-model="todo.bank_account"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="todo.id_card"></el-input>
        </el-form-item>
        <el-form-item label="工种">
          <el-input v-model="todo.work_type"></el-input>
        </el-form-item>
        <el-form-item label="本次请款月份">
          <el-date-picker v-model="todo.once_month" type="month" placeholder="选择日期" :clearable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="承包单价">
          <el-input v-model="todo.unit" placeholder="0" @change="check_unit(todo)"></el-input>
        </el-form-item>
        <el-form-item label="本次完成面积">
          <el-input v-model="todo.amount" placeholder="0" @change="check_amount(todo)"></el-input>
        </el-form-item>
        <el-form-item label="奖罚￥">
          <el-input v-model="todo.sanction_price" placeholder="0" @change="check_san(todo)"></el-input>
        </el-form-item>
        <el-form-item label="金额￥">
          <el-input v-model="todo.price" placeholder="0" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="已领金额￥">
          <el-input v-model="todo.received_price" placeholder="0" @change="check_pay(todo)"></el-input>
        </el-form-item>
        <el-form-item label="应付金额￥">
          <el-input v-model="todo.should_pay_price" placeholder="0"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="第三方确认人">
          <el-input v-model="todo.thr_true_people" @click.native="getNmae('确认人')"></el-input>
        </el-form-item>
        <el-form-item label="确认人">
          <el-input v-model="todo.true_people" :disabled="true"></el-input>
        </el-form-item>
        <el-upload style="margin-left: 10px" class="upload-demo"  ref="res" id="picc" v-model="todo.many_enclosure" accept="image/jpg,image/png,image/jpeg"  multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="todo.fileList" :auto-upload="false">
          <i class="el-icon-plus" ></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
        <el-upload style="margin-left: 10px" class="upload-demo_a" v-model="todo.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="todo.fileList_a" :auto-upload="false">
          <el-button size="small" type="info" plain>上传文件</el-button>
          <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
        </el-upload>
        <span class="page_number" v-show="pages >1">{{current+1}}/{{pages}}</span>
      </el-form>
    </div>
    <name v-if="nameshow" @transet="transet" ></name>
  </div>
</template>

<script>
  import name from '@/base/person_qk/Named'
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  import * as math from 'mathjs'
  export default {
    data(){
      return{
        mainShow:true,
        nameshow:false,
        choice:"",
        pic_hash_arr:[],
        afile_hash_arr:[],
        file_hash_arr:[],
      }
    },
    methods:{
      ...mapMutations({
        setUser: 'SET_USER',
        setToken: 'SET_TOKEN',
        setComPersonList: 'SET_COM_PERSON_LIST',
      }),
      handlePreview(file,fileList){
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
        this.todo.fileList = fileList
      },
      handleRemove(file,fileList){
        this.todo.fileList = fileList
      },
      handleRemove_a(file, fileList_a) {
        this.todo.fileList_a = fileList_a
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
              this.todo.fileList_a = fileList_a
            }else{
              this.$message.error('上传文件格式错误 请删除')
              this.todo.fileList_a = fileList_a
            }
          })
      },
      getNmae:function (res) {
        this.mainShow = false
        this.nameshow = true
        this.choice = res
      },
      transet(res){
        this.nameshow = false
        this.mainShow = true
        switch (this.choice) {
          case '姓名':
            this.todo.name = res.name
            this.todo.phone = res.phone
            this.todo.uid = res.uid
            this.todo.confirm_uid = res.uid
            this.todo.true_people = res.name
            break;
          case '确认人':
            this.todo.thr_true_people = res.name
            this.todo.third_uid = res.uid
            break;
        }
      },
      check_san(data){
        var numReg = /^([+-]?)\d*\.?\d+$/
        if(!numReg.test(data.sanction_price)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.sanction_price = "0";
        }
        this.get_result(data)
      },
      check_pay(data){
        var numReg =  /^[1-9]\d*$/
        if(!numReg.test(data.received_price)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.received_price = "0";
        }
        this.get_result(data)
      },
      check_unit(data){
        var numReg =  /^[1-9]\d*$/
        if(!numReg.test(data.unit)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.unit = "0";
        }
        this.get_result(data)
      },
      check_amount(data){
        if(data.amount < 10){
          data.amount = `${data.amount}.0`
        }
        var numReg =  /^[1-9]\d*.\d*|0.\d*[1-9]\d*$/
        if(!numReg.test(data.amount)){
          this.$message({
            showClose: true,
            message: '格式错误',
            type: 'error'
          })
          data.amount = "0";
        }
        this.get_result(data)
      },
      get_result(pr){
        let once_res = math.eval(Number(pr.unit) * Number(pr.amount) + Number(pr.sanction_price) - Number(pr.received_price))
        once_res = math.format(once_res, {precision: 14})
        pr.price = once_res
        pr.should_pay_price = once_res
      },
      submit(){
        if(!this.todo.name){
          this.$message.info('名字不可为空')
          return false
        }else if(!this.todo.bank_name){
          this.$message.info('开户行不可为空')
          return false
        }else if(!this.todo.bank_account){
          this.$message.info('开户账号不可为空')
          return false
        }else if(!this.todo.id_card){
          this.$message.info('身份证号不可为空')
          return false
        }else if(!this.todo.work_type){
          this.$message.info('工种不可为空')
          return false
        }else if(!this.todo.once_month){
          this.$message.info('本次请款月份不可为空')
          return false
        }else if(!this.todo.amount){
          this.$message.info('本次完成面积不可为空')
          return false
        }else if(!this.todo.should_pay_price){
          this.$message.info('应付金额不可为空')
          return false
        }else if(!this.todo.thr_true_people){
          this.$message.info('确认人不可为空')
          return false
        }else if(!this.todo.unit){
          this.$message.info('承包单价不可为空')
          return false
        }else{
          this.submit_lab()
        }
      },
      submit_lab(){
        this.pic_hash_arr = []
        this.afile_hash_arr = []
        this.file_hash_arr = []
        if(this.todo.once_month){
          this.todo.month = moment(this.todo.once_month).format('YYYY-MM')
        }
        if(this.todo.fileList_a.length ==0 && this.todo.fileList.length == 0){
          this.todo.many_enclosure = []
          this.$emit('submit_lab_son',this.todo)
        }else{
          if(this.todo.fileList.length != 0){
            var upload_enclosure_new = (fn) =>{
              this.todo.fileList.forEach((item)=>{
                let formData = new FormData()
                formData.append('file',item.raw)
                formData.append('token',this.token)
                let config = {
                  'Content-Type': 'multipart/form-data'
                }
                if(!item.size){
                  this.pic_hash_arr.push(item.hash)
                  this.pic_hash_arr.length == this.todo.fileList.length && fn(item.name)
                }else{
                  this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
                    this.pic_hash_arr.push(res.data.hash)
                    if(this.pic_hash_arr.length === this.todo.fileList.length) {
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
                  let obj = {
                    'type':3,
                    'contract_id':res.data.data.enclosure_id,
                    name
                  }
                  this.todo.many_enclosure.push(obj)
                })
            })
          }
          if(this.todo.fileList_a.length!=0){
            this.todo.fileList_a.forEach((item)=>{
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
                    this.todo.many_enclosure.push({
                      'type':4,
                      'contract_id':res.data.data.attachments_id,
                      'name':item.name
                    })
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
                              this.todo.many_enclosure.push({
                                'type':4,
                                'contract_id':res.data.data.attachments_id,
                                'name':item.name
                              })
                            })
                        })
                      }else{
                        this.$message.error('上传文件过大 请删除')
                        this.$parent.$parent.loadingShow = false
                        return false
                      }
                    }else{
                      this.$message.error('请删除'+this.todo.fileList_a[i].name)
                      this.$parent.$parent.loadingShow = false
                      return false
                    }
                  })
              }
            })
          }
        }
      }
    },
    watch:{
      todo:{
        handler:function (newVal){
          var len = 0
          newVal.fileList.length > 1 ? len = 1 :  len = newVal.fileList.length
          var str = Number(len) + Number(newVal.fileList_a.length)
          if(str > 0){
            if(newVal.many_enclosure.length == str){
              this.$emit('submit_lab_son',newVal)
            }
          }
        },
        deep:true
      }
    },
    components:{
      name,
      moment
    },
    props:{
      todo:{

      },
      current:{

      },
      pages:{

      },
      keys:{

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
    },
  }
</script>

<style lang="scss">
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
        .el-input{
          font-size: 12px;
          input{
            height: 30px;
          }
        }
        .el-date-editor{
          width: 195px;
        }
      }
    }
  }
  .mar{
    width: 100%!important;
  }

  .page_number{
    float: right;
    margin-bottom: 10px;
    color: #5a5e66;
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
