<template>
  <div class="input_type" :id="form_element_id" :version="str" >
    <label >
      <p>{{tit}}</p>
      <input :type="stype" @focus="look(result)"  :placeholder="hint" v-model="result" :maxlength="max_length" ><!--@change="check(result)"-->
    </label>
  </div>
</template>

<script>
  export default {
    data:function(){
      return{
        result:'',
        stype:'',
      }
    },
    props:{
      tit:{
        type:String
      },
      hint:{
        type:String
      },
      input_type:{
        type:String
      },
      form_element_id:{

      },
      str:{

      },
      max_length:{

      }
    },
    methods:{
      look:function (sor) {
        if(this.input_type == 'text'){
          this.stype = 'text'
        }
        if(this.input_type == 'number'){
          this.stype = 'tel'
          // let re = /^\d+$/
          // if(sor != ''){
          //   if(!re.test(sor)){
          //     this.$message({
          //       showClose: true,
          //       message: '请输入正整数',
          //       type: 'error'
          //     })
          //     this.result = ''
          //   }
          // }
        }
        if(this.input_type == 'number_decimal') {
          this.stype = 'tel'
          // let re =  /^d+.{0,1}d{0,}$/
          // if(sor != ''){
          //   if(!re.test(sor)) {
          //     this.$message({
          //       showClose: true,
          //       message: '请输入正整数',
          //       type: 'error'
          //     })
          //     this.result = ''
          //   }
          // }
        }
        if(this.input_type == 'number_signed'){
          this.stype = 'tel'
          // let re =  /^-{0,1}d+$/
          // if(sor != ''){
          //   if(!re.test(sor)) {
          //     this.$message({
          //       showClose: true,
          //       message: '请输入整数',
          //       type: 'error'
          //     })
          //     this.result = ''
          //   }
          // }
        }
        if(this.input_type == 'text_password'){
          this.stype = 'password'
        }
        if(this.input_type == 'number_password'){
          this.stype = 'password'
          // let re = /^\d+$/
          // if(sor != ''){
          //   if(!re.test(sor)){
          //     this.$message({
          //       showClose: true,
          //       message: '请输入正整数',
          //       type: 'error'
          //     })
          //     this.result = ''
          //   }
          // }
        }
      }
      // check:function (res) {
      //   var re = /^\d+$/
      //   if(!re.test(res)){
      //     this.$message({
      //       showClose: true,
      //       message: '格式错误',
      //       type: 'error'
      //     })
      //     this.result = ''
      //   }
      // }
    },
    created(){
      console.log(this.input_type)
    },
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
  .input_type{
    width: 100px;
    p{

    }
  }
</style>
