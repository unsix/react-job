<template>
    <label>
      <p>{{title}}</p><textarea v-model="result"></textarea>
    </label>
</template>

<script>
export default {
  data(){
    return{
      result:''
    }
  },
  props:{
    title:{
      type:String
    }
  }
}
</script>

<style lang="scss">
  label{
    overflow: hidden;
    height: 55px;
    display: block;
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
    textarea{
      min-height: 33px;
      display: inline-block;
      resize: none;
      padding: 5px 15px;
      line-height: 1.5;
      box-sizing: border-box;
      width: 75%;
      font-size: 14px;
      color: #606266;
      background-color: #FFf;
      background-image: none;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      &:focus{
        outline: 0;
        border-color: #5393ff;
      }
    }
  }
</style>
