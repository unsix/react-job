<template>
  <div class="content">
    <Calendar
              :mark_array=[20,21]
              :is_hide_otherday=false
    ></Calendar>
    <br/>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {

    }
  };

</script>

<style lang="scss">
 .wh_content_all{
   background-color: white;
   .wh_content_item{
     height: 32px;
     width: 42px;
     line-height: 32px;
     color: #000;
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
