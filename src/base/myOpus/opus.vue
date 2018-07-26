<template>
  <div>
    <div class="opus" v-show="opus">
      <div class="top">
        <el-button v-show="insert == 6" type="primary" size="small" @click="_returned">返回</el-button>
        <p v-show="insert == 0">我的作品</p>
        <p v-show="insert == 6">往期作品</p>
      </div>
      <div class="main">
        <ul>
          <li v-for="(item,index) in untreated">
            <img :src="item.img_List[0]" alt="" @click="ctrl_pic_show(item.img_List,0)">
            <p>{{item.content}}</p>
            <span>{{item.works_time}}</span>
            <i v-show="insert == 0" @click="delete_work(item.works_id)" class="el-icon-close zsp"></i>
          </li>
        </ul>
      </div>
      <div class="bottom" v-show="insert == 0">
        <el-button type="primary" @click="show_up">上传作品</el-button>
      </div>
    </div>

    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>

    <div class="upload" v-show="upload">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>上传作品</p>
      </div>
      <div class="main" style="overflow: hidden">
        <el-form :model="work" :rules="work_rule" ref="work" label-width="100px" style="width: 95%;margin: 40px auto;overflow: hidden">
          <el-form-item label="作品名称" prop="content">
            <el-input v-model="work.content"></el-input>
          </el-form-item>
          <el-form-item label="开工日期" prop="works_time">
            <el-date-picker v-model="work.works_time" type="date" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="works_end_time">
            <el-date-picker type="date" style="width: 100%;" v-model="work.works_end_time"></el-date-picker>
          </el-form-item>
          <el-upload class="upload-demo" id="picc" multiple action="https://up.qbox.me/" accept="image/jpg,image/png,image/jpeg" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card"  :file-list="fileList" :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="submit('work')">上传</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <loading v-show="loadingShow"></loading>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {getAvatar} from '@/common/js/avatar.js'
  import browsePic from '@/base/browse_pic/browse_pic'
  import loading from '@/base/loading/loading'
export default {
  data(){
    return{
      untreated:[],
      pic_index: 0,
      arr_list: [],
      pic_show:false,
      opus:true,
      upload:false,
      work:{
        content:'',
        works_time:'',
        works_end_time:''
      },
      work_rule:{
        content: [{
          required: true,
          message: '请填写作品名称',
          trigger: 'blur'
        }],
        works_time: [{
          type: 'date',
          required: true,
          message: '请填写开工日期',
          trigger: 'change'
        }],
      },
      fileList:[],
      loadingShow:false,
      picArr:[],
      pic_hash_arr:[],
      pic_time: 0,
      afile_hash_arr:[],
      insert:'0'
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
    _getInfo(){
      this.untreated = []
      let param = new URLSearchParams()
      if(this.insert == 0){
        param.append('uid',this.user.uid)
      }else if(this.insert == 6){
        param.append('uid',this.worker_id)
      }
      let httpUrl = this.$test('/index.php/Mobile/works/works')
      this.$http.post(httpUrl,param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          this.$testLogin(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.untreated.push(item)
              this.get_img(item.picture,item)
            })
          }
        })
    },
    get_img(pre,re){
      let arr = []
      pre.forEach((item)=>{
        arr.push(getAvatar(item))
      })
      this.$set(re,'img_List',arr)
    },
    ctrl_pic_show(item,index){
      item.forEach((res)=>{
        let current = res.indexOf('?')
        this.arr_list.push(res.slice(0,current) + '?imageslim' )
      })
      this.pic_index = index
      this.pic_show = true
    },
    _return(){
      this.opus = true
      this.upload = false
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePreview(file, fileList) {
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
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if(valid) {
          if(this.fileList.length < 2){
            this.$message.error('至少选择两张图片');
          }else{
            this.psb_submit()
            this.loadingShow = true
          }
        } else {
          this.$message.error('请将表单填写完整');
          return false;
        }
      });
    },
    psb_submit(){
      this.picArr = []
      this.fileList.forEach((item) => {
        if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
          this.picArr.push(item)
        }
      })
      let timestamp2 = Date.parse(new Date(this.work.works_time));
      let date = new Date();
      date.setTime(timestamp2);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      this.work.works_time = y + '-' + m + '-' + d

      if(this.work.works_end_time){
        let timestamp3 = Date.parse(new Date(this.work.works_end_time));
        let date1 = new Date();
        date1.setTime(timestamp3);
        let y1 = date1.getFullYear();
        let m1 = date1.getMonth() + 1;
        m1 = m1 < 10 ? ('0' + m1) : m1;
        let d1 = date1.getDate();
        d1 = d1 < 10 ? ('0' + d1) : d1;
        this.work.works_end_time = y1 + '-' + m1 + '-' + d1
      }

      this.pic_hash_arr = []
      this.pic_time = []
      for(let i = 0;i<this.picArr.length;i++){
        let formData = new FormData()
        formData.append('file',this.picArr[i].raw)
        formData.append('token',this.token)
        let config = {
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        }
        this.$http.post('https://up.qbox.me/', formData, config).then((res)=>{
          this.pic_hash_arr.push(res.data.hash)
        })
      }
      setTimeout(()=>{
        let param = new URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('content',this.work.content)
        param.append('works_time',this.work.works_time)
        if(this.work.works_end_time){
          param.append('works_end_time',this.work.works_end_time)
        }
        param.append('picture',JSON.stringify(this.pic_hash_arr))
        let httpUrl = this.$test('/index.php/Mobile/works/upload_works_new')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(res.data.code == 0){
              this.loadingShow = false
              this.upload = false
              this.opus = true
              this._getInfo()
              this.work.content = ''
              this.work.works_time = ''
              this.work.works_end_time = ''
              this.fileList = []
            }else{
              this.$message.error(res.data.message)
            }
          })
      },500)
    },
    show_up(){
      this.opus = false
      this.upload = true
    },
    delete_work(pr){
      this.$confirm('确认删除此作品','提示',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.loadingShow = true
        let param = new URLSearchParams()
        param.append('works_id',pr)
        let httpUrl = this.$test('/index.php/Mobile/works/del_works')
        this.$http.post(httpUrl,param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            this.$testLogin(judge,current)
            if(res.data.code == 0){
              this.$message.success('删除成功')
              this._getInfo()
              this.loadingShow = false
            }else{
              this.$message.error('删除失败')
            }
          })
      }).catch(()=>{
        this.$message.warning('取消操作')
      })
    },
    _returned(){
      this.$parent.deta = true
      this.$parent.infos = true
      this.$parent.op_if = false
      this.insert = 0
    }
  },
  created(){
    this._getInfo()
  },
  props:{
    worker_id:{
      type:String
    }
  },
  mounted(){
    if(this.$route.path === '/work/opus') {
      this.$emit('changeWorkIndex', '8-1')
    }
  },
  computed:{
    ...mapGetters([
      'user',
      'token',
      'nowCompanyName',
      'userState',
      'nowCompanyId',
      'comDepartList',
      'companyList'
    ])
  },
  components:{
    browsePic,
    loading
  }
}
</script>

<style lang="scss">
.opus{
  width: 100%;
  .top{
    position: relative;
    border-bottom: 1px solid #e3e4e9;
    background: #fff;
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
    }
  }
  .main{
    margin-top: 4px;
    width: 100%;
    background: #fff;
    height: 600px;
    overflow-y: auto;
    ul{
      overflow: hidden;
      li{
        margin: 10px 18px;
        width: 250px;
        border: 1px solid #e3e4e9;
        float: left;
        position: relative;
        img{
          width: 50px;
          height: 50px;
          display: block;
          margin: 10px auto;
          border: 1px solid #e1f3d8;
          cursor: pointer;
        }
        p{
          text-align: center;
        }
        span{
          display: block;
          text-align: center;
          margin: 5px 0;
        }
        .zsp{
          position: absolute;
          top: 5px;
          right: 5px;
        }
      }
    }
  }
  .bottom{
    width: 100%;
    background: #Fff;
    button{
      width: 80%;
      margin-left: 60px;
      margin-bottom: 10px;
    }
  }
}
.upload{
  width: 100%;
  background: #FFF;
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
    }
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
</style>
