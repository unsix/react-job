<template>
  <div class="input_type" :id="form_element_id" :version="str" >
    <label>
      <p>{{tit}}</p>
      <input  :type="stype"
              @focus="look()"
              v-model="result"
              :placeholder="hint"
              :maxlength="max_length"
              >
      <!--:max_lines="lines"-->
    </label>
  </div>
</template>

<script>
  export default {
    data:function(){
      return{
        result:'',
        stype:'',
        id:'',

      }
    },
    props:{
      tit:{
        type:String
      },
      hint:{
        type:String
      },
      type:{
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
      look:function () {
        //写验证

      },
    },
    created(){
      if(this.type == 'input_text'){
        this.stype = 'text'
      }
      if(this.type == 'number'){
        this.stype = 'tel'
      }
      if(this.type == 'number_decimal') {
        this.stype = 'tel'
      }
      if(this.type == 'number_signed'){
        this.stype = 'tel'
      }
      if(this.type == 'text_password'){
        this.stype = 'password'
      }
      if(this.type == 'number_password'){
        this.stype = 'password'
      }
    },
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
  .input_type{
    width: 100%;
    margin-bottom: 30px;
    p{
      width: 15%;
      float: left;
      text-align: right;
      vertical-align: middle;
      font-size: 14px;
      color: #5a5e66;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    input{
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #d8dce5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #5a5e66;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 1;
      outline: 0;
      padding: 0 15px;
      font-size: 14px;
      width: 75%;
    }
    input::-webkit-input-placeholder{
      color: #AEB5C7;
    }
    input:-moz-placeholder{
      color: #AEB5C7;
    }
    input::-moz-placeholder{
      color: #AEB5C7;
    }
    input:-ms-input-placeholder{
      color: #AEB5C7;
    }
  }
</style>
