<template>
  <div class="check"  :version="str">
    <p>{{tit}}</p>
    <ul>
      <li v-for="(item,index) in items" >
        <input type="radio"
               :select_id="item.choice_id"
               :name="form_element_id"
               @click="setCheck(item)"
               :checked="index==0"
               :value="item.choice_title"
               v-model="checkValue">
        <span>{{item.choice_title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data:function () {
      return{
        items:'',
        checkValue:'',
        result:'',
        checkId:''
      }
    },
    props:{
      tit:{

      },
      form_element_id:{

      },
      str:{

      },
      options:{

      },
      default_select:{

      },

    },
    methods:{
      initData: function() {
        var self = this;
        self.items = this.options;
        if(this.options.length != 0) {
          this.checkValue =this.options[this.default_select-1].choice_title;
          this.checkId = this.options[this.default_select-1].choice_id
        }
        this.result = this.checkId
      },
      setCheck:function (item) {
        this.checkId =item.choice_id
        this.result = this.checkId
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
                  let formData = new FormData()
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
                let formData = new FormData()
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
      file_times(){
        if(this.picArr.length != 0){
          if(this.pic_times == 0){
            return
          }
        }
        if(this.pic_times != 0 || this.file_times != 0){
          let param = new URLSearchParams()
          param.append('uid',this.user.uid)
          param.append('content',this.cpj_ruleForm.content)
          param.append('chengpi_num',this.cpj_ruleForm.chengpi_num)
          param.append('title',this.cpj_ruleForm.title)
          param.append('handler_uid',this.$parent.u_id)
          param.append('many_enclosure',JSON.stringify([...this.file_hash_arr,...this.pic_hash_arr]))
          this.$http.post('index.php/Mobile/personal/add_personal_chengpi',param)
            .then((res)=>{
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
        if(this.file_times != 0 || this.pic_time != 0){
          let param = new URLSearchParams()
          param.append('uid',this.user.uid)
          param.append('content',this.cpj_ruleForm.content)
          param.append('chengpi_num',this.cpj_ruleForm.chengpi_num)
          param.append('title',this.cpj_ruleForm.title)
          param.append('handler_uid',this.$parent.u_id)
          param.append('many_enclosure',JSON.stringify([...this.file_hash_arr,...this.pic_hash_arr]))
            .then((res)=>{
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
      }
    },
    created(){
      this.initData();
    },
    mounted(){

    }

  }
</script>

<style scoped>

</style>
