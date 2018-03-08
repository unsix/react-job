<template>
  <div class="data" >
    <p :form_element_id="form_element_id" :version="str">{{tit}}</p>
    <span class="sd" :is_fill_local_time="sdsd" @click="showData">{{data}}</span>
    <Calendar v-show="dax" :mark_array=[20,21] :is_hide_otherday=false @chose_day="clickday"></Calendar>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dax:false,
        data:'',
        result:''
      };
    },
    methods: {
      showData(){
        this.dax = true
      },
      clickday(data) {
        let sr = data
        this.data = data
        this.dax = false
        this.result = parseInt((new Date(sr)).getTime()/1000)
        // if(more !=''){
        //   if(this.result < more){
        //     this.$message({
        //       showClose: true,
        //       message: '错误',
        //       type: 'error'
        //     })
        //     return
        //   }else if(this.result > less){
        //     this.$message({
        //       showClose: true,
        //       message: '错误',
        //       type: 'error'
        //     })
        //     return
        //   }
        // }
      },

      _fill(){
        if(this.sdsd == true){
          var data = new Date()
          var y = data.getFullYear()
          var m = data.getMonth() + 1
          var d = data.getDate()
          this.data = y +'/'+ m+'/' +d
          this.result = parseInt(new Date(this.n).getTime()/1000)
        }else{
          this.data = '-1';
          this.result = '-1'
        }
      }


    },
    created(){
      this._fill()
    },
    props:{
      sdsd:{

      },
      more:{

      },
      less:{

      },
      tit:{

      },
      form_element_id:{

      },
      str:{

      },
    }
  };
</script>

<style lang="scss">
  .sd{
    display: block;
    width: 200px;
    height: 30px;
    border: 1px solid blue;
  }
  .wh_content_all{
    width: 310px;
    background-color: white;
    .wh_content_item{
      height: 32px;
      width: 42px;
      line-height: 32px;
      color: #000;
      cursor: pointer;
    }
  }
  .wh_jiantou1{
    border-top: 2px solid #409eff;
    border-left: 2px solid #409eff;
  }
  .wh_top_changge{
    margin-top: 40px;
    border-top: 1px solid #eee;
    margin-bottom: 10px;
  }
  .wh_top_changge li{
    color: #000;
  }
  .wh_jiantou2{
    border-top: 2px solid #409eff;
    border-right: 2px solid #409eff;
  }
  .wh_is_today{
    width: 26px;
    height: 32px;
    margin-top: 0px;
    line-height: 32px;
    color: blue;
  }
  .wh_is_mark{
    width: 26px;
    height: 32px;
    margin-top: 0px;
    line-height: 32px;
    border: none;
  }
</style>
