<template>
  <div>
    <div class="dete" v-show="deta">
      <div class="top">
        <el-button type="primary" size="small" @click="_return">返回</el-button>
        <p>{{moreInfo.name}}</p>
      </div>
      <div class="main">
        <div class="cen">
          <div>
            <img :src="moreInfo.avatar" alt="">
          </div>
          <p><i class="iconfont icon-weibiaoti-" style="color: #7CC7FF"></i>{{moreInfo.phone}}</p>
          <p><i class="iconfont icon-xiaoxi" style="color: #50BCBC;"></i>与我沟通</p>
          <ul>
            <li>工程名称<span>{{moreInfo.title}}</span></li>
            <li>数量<span>{{moreInfo.aid}}</span></li>
            <li>工期<span>{{moreInfo.schedule}}</span></li>
            <li>预算<span>{{moreInfo.budget}}</span></li>
            <li>开始时间<span>{{moreInfo.start_time}}</span></li>
            <li>位置<span @click="showMap(moreInfo.latitude,moreInfo.longitude)">位置<i class="iconfont icon-xiazai19" style="color: #62A4D7;cursor: pointer"></i></span></li>
            <li>备注<p>{{moreInfo.remark}}</p></li>
          </ul>
          <el-button type="primary" style="width: 200px;margin-left: 195px;margin-bottom: 35px;margin-top: 10px">申请用工</el-button>
        </div>
      </div>
    </div>

    <div class="maps" v-show="map">
      <div class="top">
        <el-button type="primary" size="small" @click="_remap">返回</el-button>
        <p>定位</p>
      </div>
      <div class="map" id="map" style="height: 600px;"></div>
    </div>

    <loading v-show="load"></loading>
  </div>
</template>

<script>
  import {getAvatar} from '@/common/js/avatar.js'
  import loading from '@/base/loading/loading'
export default {
  data(){
    return{
      moreInfo:'',
      deta:true,
      map:false,
      load:false
    }
  },
  methods:{
    _getInfo(pr,re){
      let param = new URLSearchParams()
      param.append('uid',re)
      param.append('iid',pr)
      this.$http.post('/index.php/Mobile/Myinfo/workDetails',param)
        .then((res)=>{
          if(res.data.code == 0){
            this.moreInfo = res.data.data
            this.moreInfo.avatar = getAvatar(this.moreInfo.avatar)
            console.log(this.moreInfo)
          }
        })
    },
    _return(){
      this.$parent.mains = true
      this.$parent.detail_show = false
    },
    showMap(pr,se){
      this.deta = false
      this.map = true
      this.load = true
      setTimeout(()=>{
        this.load = false
        this._creatMap(pr,se)
      },200)
    },
    _remap(){
      this.deta = true
      this.map = false
    },
    _creatMap(pr,se){
      var map = new BMap.Map("map");
      if(pr != '' || se != ''){
        var point = new BMap.Point(pr,se)
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
    },
  },
  components:{
    loading
  }
}
</script>

<style lang="scss">
.dete{
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
  }
}
.main{
  width: 100%;
  .cen{
    div{
      width: 50px;
      height: 50px;
      margin: 10px auto;
    }
    p{
      text-align: center;
      margin-top: 10px;
    }
    ul{
      margin-top: 10px;
      li{
        padding: 10px 20px;
        border-top: 1px solid #e3e4e9;
        color: #6f7180;
        span{
          float: right;
        }
        p{
          height: 200px;
          background: #EEEEEE;
          text-align: left;
        }
      }
    }
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
  }
}
</style>
