<template>
  <div>
    <div class="contain" v-show="contr_show">
      <div class="top">
        <el-button type="success" size="small" @click="_return">返回</el-button>
        <p>发布工程</p>
      </div>
      <div class="mains">
        <el-form :model="project_form" :rules="project_rules" ref="project_form" label-width="100px" class="demo-project_form">
          <el-form-item label="所在公司" prop="company_id" v-show="handle">
            <el-select v-model="project_form.company_id" placeholder="请选择所在公司" style="display: block">
              <el-option v-for="item in com_list" :value="item.company_big_name" :key="item.company_big_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工程名称" prop="title">
            <el-input v-model="project_form.title" placeholder="请输入工程名称"></el-input>
          </el-form-item>
          <el-form-item label="工种选择" prop="type">
            <div >
              <el-checkbox-group v-model="project_form.type" class="group">
                <el-checkbox v-for="(item,index) in work_type" :key="item.wid" :label="item.wid" :value="item.wid">{{item.type_name}}
                  <el-input style="width: 75px;" size="mini" type="number" :min="1" v-model="item.num"></el-input>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="预算" prop="budget">
            <el-input v-model="project_form.budget" placeholder="请输入预算" :disabled="open" style="width: 330px"></el-input>
            <el-switch style="float: right;margin-top: 8.5px" v-model="open" active-color="#13ce66" active-text="面议" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="地点" prop="place">
            <el-input v-model="project_form.place" :disabled="true" style="width: 330px"></el-input>
            <el-button type="info" size="small" style="float: right;margin-top: 5px" @click="showMap">选择地点</el-button>
          </el-form-item>
          <el-form-item label="开始时间" prop="arrive_time" >
            <el-date-picker type="date" v-model="project_form.arrive_time" style="width: 100%;" @change="curr"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker type="date" v-model="project_form.end_time" style="width: 100%;" @change="srts"></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="project_form.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="float: right;margin-right: 50px" @click="trues('project_form')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>

      </div>
    </div>

    <div class="maps" v-show="map">
      <div class="top">
        <el-button type="primary" size="small" @click="_remap">返回</el-button>
        <p>定位</p>
        <b @click="sure" style="cursor: pointer">确定</b>
      </div>
      <div class="map" id="mapsd"></div>
    </div>

    <loading v-show="loadingShow" style="z-index: 9999999"></loading>

    <div class="addsdd" v-show="addShow">
      <ul>
        <h2>选择地点</h2>
        <i class="el-icon-close" @click="asShow"></i>
        <li v-for="(item,index) in pois"  @click="log(item.addr)">
          <p>{{item.addr}} <span style="float: right">{{item.name}}</span></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getCro} from "@/common/js/crowd";
  import loading from '@/base/loading/loading'
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
export default {
  data(){
    return{
      project_form:{
        title:'',
        type:[],
        budget:'',
        place:'',
        arrive_time:'',
        end_time:'',
        remark:'',
        company_id:''
      },
      open:false,
      project_rules:{
        company_id: [{
          required: true,
          message: '请选择公司',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请填写工程姓名',
          trigger: 'blur'
        }],
        place: [{
          required: true,
          message: '请填写地点',
          trigger: 'blur'
        }],
        arrive_time: [{
          type: 'date',
          required: true,
          message: '请填写到货时间',
          trigger: 'change'
        }],
        end_time: [{
          type: 'date',
          required: true,
          message: '请填写	完工时间',
          trigger: 'change'
        }],
      },
      work_type:[],
      loadingShow:false,
      contr_show:true,
      map:false,
      x:'',
      y:'',
      caors:'',
      langs:'',
      pois:[],
      addShow:false,
      nums:[],
      com_list:[]
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
    _return(){
      this.$parent.mains = true
      this.$parent.projectShow = false
      this.$parent.company_show =true
    },
    _getType(){
      let param = new URLSearchParams()
      param.append('type',2)
      this.$http.post('/index.php/Mobile/Find/worker_type',param)
        .then((res)=>{
          var current = this
          var judge = res.data.code
          getCro(judge,current)
          if(res.data.code == 0){
            res.data.data.forEach((item)=>{
              this.$set(item,'num',1)
              this.work_type.push(item)
            })
          }
        })
    },
    trues(formName){
      this.$refs[formName].validate((valid) => {
        if(valid) {
          if(!this.open){
            if(this.project_form.budget == ''){
              this.$message.info('请填写预算')
              return false
            }
          }else{
            this.project_form.budget = ''
          }
          if(this.project_form.type.length == 0){
            this.$message.info('请选择至少一个工种')
            return false
          }
          var str = moment(this.project_form.arrive_time).format('YYYY-MM-DD')
          var see= moment(this.project_form.end_time).format('YYYY-MM-DD')
          if(moment(see).isBefore(str)){
            this.$message.error('结束时间小于开始时间')
            return false
          }
          this.show_form()
        } else {
          this.$message.error('请将表单填写完整');
          return false;
        }
      });
    },
    show_form(){
      this.loadingShow = true
      this.work_type.forEach((item)=>{
        this.project_form.type.forEach((pr)=>{
          if(item.wid == pr){
            this.nums.push(item.num)
          }
        })
      })
      var rc = moment(this.project_form.end_time)-moment(this.project_form.arrive_time)
      rc = moment(rc).format('D')
      var curr = moment(this.project_form.arrive_time).format('YYYY-MM-DD')
      var sedd = moment(this.project_form.end_time).format('YYYY-MM-DD')
      let param = new URLSearchParams()
      if(!this.project_form.company_id){
        param.append('company_id',this.nowCompanyId)
      }else{
        param.append('company_id',this.project_form.company_id)
      }
      param.append('title',this.project_form.title)
      param.append('budget',this.project_form.budget)
      let str = ''
      this.open ? str = '1' : str = '0'
      param.append('isface',str)
      param.append('start_time',curr)
      param.append('end_time',sedd)
      param.append('schedule',rc)
      param.append('address',this.project_form.place)
      param.append('typeId',this.project_form.type.toString())
      param.append('typenum',this.nums.toString())
      param.append('longitude',this.langs)
      param.append('latitude',this.caors)
      param.append('remark',this.project_form.remark)
      this.$http.post('index.php/Mobile/Find/release',param)
        .then((res)=>{
          this.loadingShow =false
          if(res.data.code == 0){
            this.$message.success('发布成功')
            this.$router.push({
              path: '/work/nearWork'
            })
          }else{
            this.$message.error('发布失败')
          }
        })
    },
    showMap(){
      this.contr_show = false
      this.map = true
      this.loadingShow = true
      setTimeout(()=>{
        this.loadingShow = false
        this._getInfo()
        this.$message.info('点击地图选择地理位置')
      },200)
    },
    _getInfo(){
      let param = new URLSearchParams()
      param.append('uid',this.user.uid)
      this.$http.post('index.php/Mobile/Find/worker_info',param)
        .then((res)=>{
          if(res.data.code == 0){
            let info = res.data.data.worker
            this.x = info.longitude
            this.y = info.latitude
            this._creatMap()
          }
        })
    },
    _remap(){
      this.map = false
      this.contr_show = true
      this.x = ''
      this.y = ''
      this.caors = ''
      this.langs = ''
    },
    _creatMap(){
      var map = new BMap.Map("mapsd");
      if(this.x != '' || this.y != ''){
        var point = new BMap.Point(this.x,this.y)
      }else{
        var point = new BMap.Point(116.404, 39.915)
      }
      map.centerAndZoom(point,14)
      map.enableScrollWheelZoom(true)
      map.addControl(new BMap.ScaleControl())
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.MapTypeControl())
      var marker = new BMap.Marker(point)
      map.addOverlay(marker);
      var that = this
      map.addEventListener("click",function(e){
        map.clearOverlays()
        var points = new BMap.Point(e.point.lng, e.point.lat)
        that.caors = e.point.lng
        that.langs = e.point.lat
        var markers = new BMap.Marker(points)
        map.addOverlay(markers);
        markers.setAnimation(BMAP_ANIMATION_BOUNCE)
      });
    },
    sure(){
      if(!this.caors && !this.langs){
        this.$message.info('请在地图上选择一个点')
        return false
      }else{
        var str = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${this.langs},${this.caors}&output=json&pois=1&ak=fyKtzB7I2n7PLscY90x7kUQMcr1DmcqD&jsoncallback=?`
        this.$jsonp(str)
          .then((res)=>{
            this.pois = res.result.pois
            this.map = false
            this.addShow = true
          })
      }
    },
    asShow(){
      this.addShow = false
      this.contr_show = true
    },
    log(pr){
      this.addShow = false
      this.contr_show = true
      this.project_form.place = pr
    },
    curr(){
      var str = moment(this.project_form.arrive_time).format('YYYY-MM-DD')
      var now = moment().format('YYYY-MM-DD')
      if(moment(str).isBefore(now)){
        this.$message.error('请选择当前日期之后的时间')
        this.project_form.arrive_time = moment()._d
      }
    },
    srts(){
      var str = moment(this.project_form.end_time).format('YYYY-MM-DD')
      var now = moment().format('YYYY-MM-DD')
      if(moment(str).isBefore(now)){
        this.$message.error('请选择当前日期之后的时间')
        this.project_form.end_time = moment()._d
      }
    },
    _getCompany(){
      this.$http.post('index.php/Mobile/find/get_my_big_company')
        .then((res)=>{
          this.com_list = res.data.data
        })
    }
  },
  created(){
    this._getType()
    this._getCompany()
  },
  components:{
    loading,
    moment
  },
  props:{
    handle:{

    }
  },
  computed: {
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
}
</script>

<style lang="scss">
  .contain{
    width: 100%;
    .top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #FFF;
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
    .mains{
      width: 100%;
      background: #FFF;
      padding: 30px 0;
      .demo-project_form{
        width: 90%;

        margin: 0 auto;
      }
    }
  }
  .group{
    label{
      width: 160px;
      margin-left: 30px;
    }
  }
  .maps{
    width: 100%;
    background: #Fff;
    overflow: hidden;
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
  #mapsd{
    height: 600px;
  }
  .addsdd{
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
      width: 500px;
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
