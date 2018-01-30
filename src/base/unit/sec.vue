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
    width: 100px;
    p{

    }
  }
</style>
