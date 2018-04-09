<template>
  <div>
    <div class="main">
      <div class="top" v-show="mean">
        <p>工程列表</p>
        <el-button type="success" size="small" @click="show_sea">搜索</el-button>
      </div>
      <div class="top">
        <el-select filterable remote v-model="name" :remote-method="remoteMethod" :loading="loading" @blur="shoe"  placeholder="请输入工人姓名或手机号码">
          <el-option class="inset" v-for="(item,index) in listed" :key="index" :value="item.name" >
            <div @click="search(item.uid)">
              <img :src="item.avatar">
              <div class="main">
                <p>{{item.name}}</p>
                <span>{{item.type}}</span>
              </div>
              <div class="phone">
                <span><i class="iconfont icon-xiaoxi"></i>{{item.phone}}</span>
              </div>
              <div class="distance">
                <p>{{item.distance}}KM</p>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      mean:true,
      name:'',
      listed:[],
      loading:false,
    }
  },
  methods:{
    show_sea(){

    },
    shoe(){

    },
    remoteMethod(res){
      if(res != ''){
        this.loading = true
        setTimeout(()=>{
          this.loading = false
          let param = new URLSearchParams()
          param.append('keyword',res)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
