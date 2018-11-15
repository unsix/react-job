<template>
  <div>
    <div v-show="mainShow" >
      <div class="font_form">
        <el-form label-width="100px" ref="ele_rules" :model="construction_list"  :rules="ele_rules">
          <el-form-item label="工程项目名称" placeholder="例：茶山保利东岸花园项目1-2楼" prop="work_type">
            <el-input v-model="todo.project_name"></el-input>
          </el-form-item>
          <el-form-item label="施工位置" placeholder="例：1号楼" prop="work_type">
            <el-input v-model="todo.project_adress"></el-input>
          </el-form-item>
          <el-form-item label="施工班组" placeholder="例：张三 泥水" prop="work_type">
            <el-input v-model="todo.project_construction_name"></el-input>
          </el-form-item>
          <el-form-item label="施工人员"  prop="name" >
            <el-input v-model="todo.name"  @click.native="getNmae('姓名')"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="todo.phone"></el-input>
          </el-form-item>
          <el-form-item label="开户行"  prop="bank_name">
            <el-input v-model="todo.bank_name"></el-input>
          </el-form-item>
          <el-form-item label="开户账号" prop="bank_account">
            <el-input v-model="todo.bank_account"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="id_card">
            <el-input v-model="todo.id_card"></el-input>
          </el-form-item>
          <!--<el-form-item label="工种" prop="work_type">-->
            <!--<el-input v-model="todo.work_type"></el-input>-->
          <el-form-item label="施工进场时间" prop="once_month">
            <el-date-picker v-model="todo.project_start_time" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
          </el-form-item>
          <!--</el-form-item>-->

          <el-form-item label="截止时间" prop="once_month">
            <el-date-picker v-model="todo.project_end_time" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-button class="addconstrution" type="primary"  size="small" @click="addConstruction_list" >添加施工内容</el-button>
          <!--<el-button class="addconstrution" type="danger"  size="small" @click="construction_list.splice(index,1)" >删除施工内容</el-button>-->
          <el-button class="addconstrution" v-show="this.construction_list.length>1" type="danger"  size="small" @click="deleteConstruction_list(index)" >删除施工内容</el-button>
          <li v-for='(item,index) in construction_list' >
            <el-button class="addconstrution" type="primary"  size="small"  >{{index+1}}</el-button>
            <el-form-item label="施工内容" prop="todo_content" class="mar">
              <el-input v-model="item.todo_content" placeholder="例子:2-17楼户内墙砖完成，2-楼户内地砖完成" ></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="todo_unit">
              <el-input v-model="item.todo_unit"  placeholder="m2" ></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="todo_number">
              <el-input v-model="item.todo_number"  placeholder="0"></el-input>
            </el-form-item>
            <el-form-item label="单价" prop="todo_unit_price">
              <el-input v-model="item.todo_unit_price" placeholder="0" ></el-input>
            </el-form-item>
            <el-form-item label="金额" prop="received_price"  @change="check_pay(todo)" class="automatic">
              <!--<el-input v-model="" value="0" ></el-input>-->
              {{item.todo_unit_price&&item.todo_number!=''?Math.round(parseFloat(item.todo_unit_price*item.todo_number)*100)/100:'自动计算'}}
            </el-form-item>
            <el-form-item label="备注" prop="price" class="mar">
              <el-input  placeholder="" ></el-input>
            </el-form-item>
          </li>
          <el-form-item label="累计已领金额" prop="should_pay_price" >
            <el-input v-model="todo.lead_price" placeholder="" ></el-input>
          </el-form-item>
          <el-form-item label="工人剩余工资" prop="should_pay_price" class="automatic" >
            <!--<el-input v-model="todo.surplus_price" placeholder="" ></el-input>-->
            {{ sum-todo.lead_price>=0||sum-todo.lead_price<0?sum-todo.lead_price:'自动计算'}}
          </el-form-item>
          <el-form-item label="班组确认人" prop="thr_true_people">
            <el-input v-model="todo.thr_true_people" @click.native="getNmae('确认人')"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人" prop="true_people">
            <el-input v-model="todo.true_people" @click.native="getNmae('负责人')" ></el-input>
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
        list: [{ company: "", number: "", price: "" }],
        construction_list:[{
          todo_cotent:'',
          todo_unit:'',
          todo_number:'',
          todo_unit_price:'',
          todo_remark:''
        }],
        ele_rules:{
          todo_content:[{
            message: '请填写施工内容',
            trigger: 'blur'
          }],
          todo_unit:[{
            message: '请填写单位',
            trigger: 'blur'
          }],
          todo_number:[{
            message: '请填写数量',
            trigger: 'blur'
          }],
          todo_unit_price:[{
            message: '请填写单价',
            trigger: 'blur'
          }],
        },
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
      addConstruction_list(){
        this.construction_list.push({
          todo_cotent:'',
          todo_unit:'',
          todo_number:'',
          todo_unit_price:'',
          todo_remark:''
        });
      },
        // deleteConstruction_list(item){
        //   item.forEach(i=>{
        //     if(this.construction_list.length>1){
        //       item.splice(i,1)
        //       console.log()
        //     }
        //   })
        // },
      deleteConstruction_list(index){
          if(this.construction_list.length>1){
            this.construction_list.splice(index,1)
          }

      },
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
      transet(res){
        this.nameshow = false
        this.mainShow = true
        switch (this.choice) {
          case '姓名':
            this.todo.name = res.name
            this.todo.phone = res.phone
            this.todo.uid = res.uid
            this.todo.bank_name = res.bank_name
            this.todo.bank_account = res.bank_account
            this.todo.id_card = res.id_card
            this.todo.confirm_uid = res.uid
            this.todo.true_people = res.name
            break;
          case '确认人':
            this.todo.thr_true_people = res.name
            this.todo.third_uid = res.uid
            break;
          case '负责人':
            this.todo.true_people = res.name
            this.todo.third_uid = res.uid
            break;
        }
      },
      getNmae:function(res){
        this.mainShow = false
        this.nameshow = true
        this.choice = res
      },
      // check_Day(data){
      //   var numReg =  /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/
      //   if(!numReg.test(data.unit)){
      //     this.$message({
      //       showClose: true,
      //       message: '格式错误',
      //       type: 'error'
      //     })
      //     data.unit = "0";
      //   }
      //   this.get_result(data)
      // },
      check_work(data){
        var numReg =  /^[1-9]\d*$/
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
      // check_san(data){
      //   var numReg = /^([+-]?)\d*\.?\d+$/
      //   if(!numReg.test(data.sanction_price)){
      //     this.$message({
      //       showClose: true,
      //       message: '格式错误',
      //       type: 'error'
      //     })
      //     data.sanction_price = "0";
      //   }
      //   this.get_result(data)
      // },
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
      get_result(pr){
        let once_res = math.eval(Number(pr.unit) * Number(pr.amount) + Number(pr.sanction_price) - Number(pr.received_price))
        once_res = math.format(once_res, {precision: 14})
        pr.price = once_res
        pr.should_pay_price = once_res
      },
      submit(){
        if(!this.todo.project_name){
            this.$message.info('工程名称不可为空')
            this.$parent.loadingShow = false
            return false
        }
        if(!this.todo.project_adress){
          this.$message.info('施工位置不可为空')
          this.$parent.loadingShow = false
          return false
        }
        if(!this.todo.project_construction_name){
          this.$message.info('施工班组不可为空')
          this.$parent.loadingShow = false
          return false
        }
        if(!this.todo.name){
          this.$message.info('施工人员不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.bank_name){
          this.$message.info('开户行不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.bank_account){
          this.$message.info('开户账号不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.id_card){
          this.$message.info('身份证号不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.project_start_time){
          this.$message.info('施工进场时间不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.project_end_time){
          this.$message.info('截止时间不可为空')
          this.$parent.loadingShow = false
          return false
        }
        // else if(!this.item.todo_content){
        //   this.$message.info('施工内容不可为空')
        //   this.$parent.loadingShow = false
        //   return false
        // }
        // else if(!this.item.todo_unit){
        //   this.$message.info('单位不可为空')
        //   this.$parent.loadingShow = false
        //   return false
        // }
        // else if(!this.item.todo_number){
        //   this.$message.info('数量不可为空')
        //   this.$parent.loadingShow = false
        //   return false
        // }
        // else if(!this.item.todo_unit_price){
        //   this.$message.info('单价不可为空')
        //   this.$parent.loadingShow = false
        //   return false
        // }
        else if(!this.todo.lead_price){
          this.$message.info('累计已领不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.thr_true_people){
          this.$message.info('确认人不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else if(!this.todo.true_people){
          this.$message.info('项目负责人不可为空')
          this.$parent.loadingShow = false
          return false
        }
        else{
          this.submit_ele()
        }
      },
      submit_ele(){
        this.pic_hash_arr = []
        this.afile_hash_arr = []
        this.file_hash_arr = []
        if(this.todo.start_month){
          this.todo.month = moment(this.todo.start_month).format('YYYY-MM-dd')
        }
        if(this.todo.fileList_a.length ==0 && this.todo.fileList.length == 0){
          this.todo.many_enclosure = []
          this.$emit('submit_ele_son',this.todo)
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
      },
    },
    watch:{
      todo:{
        handler:function (newVal){
          var len = 0
          newVal.fileList.length > 1 ? len = 1 :  len = newVal.fileList.length
          var str = Number(len) + Number(newVal.fileList_a.length)
          if(str > 0){
            if(newVal.many_enclosure.length == str){
              this.$emit('submit_ele_son',newVal)
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
      sum() {
        let _list = this.construction_list;
        let sums = 0;
        _list.forEach(i => {
          let s = i.todo_number * i.todo_unit_price;
          sums += Math.round(parseFloat(s)*100)/100;
        });
        return sums;
      }
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
  li{
    list-style: none;
  }
  .addconstrution{
    clear: both;
    margin-left: 26px;
    margin-top: 10px;
  }
  .automatic{
    color: #409EFF;
  }
</style>
