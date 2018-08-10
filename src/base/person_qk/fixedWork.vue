<template>
    <div>
      <div class="font_form" v-show="mainShow">
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
          <el-form-item label="本次请款月份">
            <el-date-picker v-model="todo.once_month" type="month" placeholder="选择日期" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item class="mar">
            <p>基本工资</p>
          </el-form-item>
          <el-form-item label="全勤奖">
            <el-input v-model="todo.all_day_price" @change="check_all_day_price(todo)"></el-input>
          </el-form-item>
          <el-form-item label="通讯补贴">
            <el-input v-model="todo.phone_subsidy" @change="check_phone_subsidy(todo)"></el-input>
          </el-form-item>
          <el-form-item label="住房补贴">
            <el-input v-model="todo.house_subsidy" @change="check_house_subsidy(todo)"></el-input>
          </el-form-item>
          <el-form-item label="基本生活工资">
            <el-input v-model="todo.base_life_pay" @change="check_base_life_pay(todo)"></el-input>
          </el-form-item>
          <el-form-item label="学历工资">
            <el-input v-model="todo.educate_pay" @change="check_educate_pay(todo)"></el-input>
          </el-form-item>
          <el-form-item label="工龄工资">
            <el-input v-model="todo.work_age_pay" @change="check_work_age_pay(todo)"></el-input>
          </el-form-item>
          <el-form-item label="职称工资">
            <el-input v-model="todo.profession_pay" @change="check_profession_pay(todo)"></el-input>
          </el-form-item>
          <el-form-item label="环境津贴">
            <el-input v-model="todo.environment_price" @change="check_environment_price(todo)"></el-input>
            <span>小计：{{todo.easy}}</span>
          </el-form-item>
          <el-form-item label="加班工资">
            <el-input v-model="todo.overtime_pay" @change="check_overtime_pay(todo)"></el-input>
          </el-form-item>
          <el-form-item label="绩效工资">
            <el-input v-model="todo.merit_pay" @change="check_merit_pay(todo)"></el-input>
          </el-form-item>
          <el-form-item label="补贴">
            <el-input v-model="todo.subsidy" @change="check_subsidy(todo)"></el-input>
          </el-form-item>
          <el-form-item label="合计">
            <el-input v-model="todo.total" placeholder="0" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item class="mar">
            <p>扣款项目</p>
          </el-form-item>
          <el-form-item label="社保">
            <el-input v-model="todo.social_security" @change="check_social_security(todo)"></el-input>
          </el-form-item>
          <el-form-item label="个税">
            <el-input v-model="todo.personal_tax" @change="check_personal_tax(todo)"></el-input>
          </el-form-item>
          <el-form-item label="缺勤">
            <el-input v-model="todo.absent_cost" @change="check_absent_cost(todo)"></el-input>
          </el-form-item>
          <el-form-item label="住宿">
            <el-input v-model="todo.house_cost" @change="check_house_cost(todo)"></el-input>
          </el-form-item>
          <el-form-item label="代扣水电">
            <el-input v-model="todo.hydropower_cost" @change="check_hydropower_cost(todo)"></el-input>
          </el-form-item>
          <el-form-item label="绩效扣分">
            <el-input v-model="todo.performance_deduction" @change="check_performance_deduction(todo)"></el-input>
          </el-form-item>
          <el-form-item label="绩效扣款">
            <el-input v-model="todo.performance_cost" @change="check_performance_cost(todo)"></el-input>
          </el-form-item>
          <el-form-item label="扣款小计">
            <el-input v-model="todo.cut_money" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item class="mar">
            <p>实发金额（元）：{{todo.sum}}</p>
          </el-form-item>
          <el-upload style="margin-left: 10px" class="upload-demo"  ref="res" id="picc" v-model="todo.many_enclosure" accept="image/jpg,image/png,image/jpeg"  multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="todo.fileList" :auto-upload="false">
            <i class="el-icon-plus" ></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
          <el-upload style="margin-left: 10px" class="upload-demo_a" v-model="todo.many_enclosure"  multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="todo.fileList_a" :auto-upload="false">
            <el-button size="small" type="info" plain>上传文本</el-button>
            <div slot="tip" class="el-upload__tip">信息附件上传，只传文本格式文件</div>
          </el-upload>
          <span class="page_number" v-show="pages >1">{{current+1}}/{{pages}}</span>
        </el-form>
      </div>
      <name v-if="nameshow" @transet="transet"></name>
    </div>
</template>

<script>
  import name from '@/base/person_qk/Named'
  import * as math from 'mathjs'
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        mainShow:true,
        nameshow:false,
        choice:"",
        tips:''
      }
    },
    methods:{
      ...mapMutations({
        setUser: 'SET_USER',
        setToken: 'SET_TOKEN',
        setComPersonList: 'SET_COM_PERSON_LIST',
      }),
      handlePreview(file,fileList){
        if(file.name.indexOf('jpg') == '-1' && file.name.indexOf('png') == '-1'){
          this.$phone_subsidy.error('上传文件格式错误')
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
              this.$phone_subsidy.error('上传文件格式错误 请删除')
              this.todo.fileList_a = fileList_a
            }
          })
      },
      getNmae(res){
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
            break;
        }
      },
      check_data(res){
        if(res < 10){
          res = `${res}.0`
        }
        var num_reg = /^[1-9]\d*.\d*|0.\d*[1-9]\d*$/
        if(!num_reg.test(res)){
          this.$phone_subsidy({
            showClose: true,
            phone_subsidy: '格式错误',
            type: 'error'
          })
          this.tips = '错误'
        }
      },
      get_result(pr){
        //小计
        let val = math.eval(Number(pr.all_day_price) + Number(pr.phone_subsidy) + Number(pr.house_subsidy) + Number(pr.base_life_pay) + Number(pr.educate_pay) + Number(pr.work_age_pay) + Number(pr.profession_pay) + Number(pr.environment_price))
        let tot = math.eval(Number(val) + Number(pr.overtime_pay) + Number(pr.merit_pay) + Number(pr.subsidy))
        let cut = math.eval(Number(pr.social_security) + Number(pr.personal_tax) + Number(pr.absent_cost) + Number(pr.house_cost) + Number(pr.hydropower_cost) + Number(pr.performance_cost))
        let sec = math.eval(Number(tot) - Number(cut))
        pr.easy = math.format(val, {precision: 14})
        pr.total = math.format(tot, {precision: 14})
        pr.cut_money = math.format(cut, {precision: 14})
        pr.sum = math.format(sec, {precision: 14})
      },
      check_all_day_price(data){
        this.check_data(data.all_day_price)
        if(this.tips == '错误'){
          data.all_day_price = '0'
        }
        this.get_result(data)
      },
      check_phone_subsidy(data){
        this.check_data(data.phone_subsidy)
        if(this.tips == '错误'){
          data.phone_subsidy = '0'
        }
        this.get_result(data)
      },
      check_house_subsidy(data){
        this.check_data(data.house_subsidy)
        if(this.tips == '错误'){
          data.house_subsidy = '0'
        }
        this.get_result(data)
      },
      check_base_life_pay(data){
        this.check_data(data.base_life_pay)
        if(this.tips == '错误'){
          data.base_life_pay = '0'
        }
        this.get_result(data)
      },
      check_educate_pay(data){
        this.check_data(data.educate_pay)
        if(this.tips == '错误'){
          data.educate_pay = '0'
        }
        this.get_result(data)
      },
      check_work_age_pay(data){
        this.check_data(data.work_age_pay)
        if(this.tips == '错误'){
          data.work_age_pay = '0'
        }
        this.get_result(data)
      },
      check_profession_pay(data){
        this.check_data(data.profession_pay)
        if(this.tips == '错误'){
          data.profession_pay = '0'
        }
        this.get_result(data)
      },
      check_environment_price(data){
        this.check_data(data.environment_price)
        if(this.tips == '错误'){
          data.environment_price = '0'
        }
        this.get_result(data)
      },
      check_overtime_pay(data){
        this.check_data(data.overtime_pay)
        if(this.tips == '错误'){
          data.overtime_pay = '0'
        }
        this.get_result(data)
      },
      check_merit_pay(data){
        this.check_data(data.merit_pay)
        if(this.tips == '错误'){
          data.merit_pay = '0'
        }
        this.get_result(data)
      },
      check_subsidy(data){
        this.check_data(data.subsidy)
        if(this.tips == '错误'){
          data.subsidy = '0'
        }
        this.get_result(data)
      },
      check_social_security(data){
        this.check_data(data.social_security)
        if(this.tips == '错误'){
          data.social_security = '0'
        }
        this.get_result(data)
      },
      check_personal_tax(data){
        this.check_data(data.personal_tax)
        if(this.tips == '错误'){
          data.personal_tax = '0'
        }
        this.get_result(data)
      },
      check_absent_cost(data){
        this.check_data(data.absent_cost)
        if(this.tips == '错误'){
          data.absent_cost = '0'
        }
        this.get_result(data)
      },
      check_house_cost(data){
        this.check_data(data.house_cost)
        if(this.tips == '错误'){
          data.house_cost = '0'
        }
        this.get_result(data)
      },
      check_hydropower_cost(data){
        this.check_data(data.hydropower_cost)
        if(this.tips == '错误'){
          data.hydropower_cost = '0'
        }
        this.get_result(data)
      },
      check_performance_deduction(data){
        this.check_data(data.performance_deduction)
        if(this.tips == '错误'){
          data.performance_deduction = '0'
        }
        this.get_result(data)
      },
      check_performance_cost(data){
        this.check_data(data.performance_cost)
        if(this.tips == '错误'){
          data.performance_cost = '0'
        }
        this.get_result(data)
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
        }else{
          this.submit_fix()
        }
      },
      submit_fix(){
        this.pic_hash_arr = []
        this.afile_hash_arr = []
        this.file_hash_arr = []
        if(this.todo.once_month){
          this.todo.month = moment(this.todo.once_month).format('YYYY-MM')
        }
        if(this.todo.fileList_a.length ==0 && this.todo.fileList.length == 0){
          this.todo.many_enclosure = []
          this.$emit('submit_fix_son',this.todo)
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
              this.$emit('submit_fix_son',newVal)
            }
          }
        },
        deep:true
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
    }
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
