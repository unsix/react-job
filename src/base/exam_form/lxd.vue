<template>
    <div class="form" name="工作联系单">
      <div class="top">
        <el-button size="small" type="info" plain @click="return_qk">返回列表</el-button>
        <p class="title">工作联系单</p>
      </div>
      <div>
        <span>工程标题：</span><span>{{form_Lista.project_name}}</span>
      </div>
      <div>
        <span>编号:</span><span>{{form_Lista.num}}</span>
      </div>
      <div>
        <span>事由:</span><span>{{form_Lista.carse_content}}</span>
      </div>
      <div class="lists"><span>主送人</span>
        <ul>
          <li v-for="item in form_Lista.main_send_info">
            <img width="30px" :src="item.avatar" alt=""><span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="lists"><span>抄送人</span>
        <ul>
          <li v-for="item in form_Lista.part_send_info">
            <img width="30px" :src="item.avatar" alt=""><span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div>
        <span>事宜:</span><span>{{form_Lista.detail_content}}</span>
      </div>
      <div>
        <span>发起时间:</span><span>{{form_Lista.add_time}}</span>
      </div>
    </div>
</template>

<script>
  export default {
    data(){
      return{

      }
    },
    methods:{
      return_qk(){
        this.$emit('return_psb')
      }
    },
    props:{
      form_Lista:{

      }
    },
  }
</script>

<style lang="scss">
  .form{
    background: #FFF;
    padding: 10px;
    color: #999999;
    >.top{
      position: relative;
      border-bottom: 1px solid #e3e4e9;
      background: #fff;
      .el-button {
        position: absolute;
        top: 8px;
        left: 5px;
        margin: 0 !important;
      }
      p {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        font-weight: bolder;
        padding: 15px 0;
      }
      b {
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
      }
    }
    >div {
      display: block;
      border-bottom: 1px solid #DDDDDD;
      >span {
        vertical-align: top;
        font-size: 14px;
        line-height: 24px;
        &:nth-child(2) {
          margin-left: 5px;
          color: #444444;
        }
      }
      .approval {
        display: inline-block;
        span {
          font-size: 14px;
          line-height: 24px;
        }
      }
      img {
        margin-right: 10px;
        display: inline-block;
        width: 80px;
        cursor: pointer;
      }
    }
    .lists{
      ul{
        margin: 5px 10px;
        li{
          border-bottom: 1px solid #878d99;
          padding: 4px 0;
          overflow: hidden;
          img{
            margin-left: 30px;
            float: left;
            width: 40px !important;
          }
          span{
            line-height: 30px;
            margin-left: 15px;
          }
        }
      }
    }
  }
</style>
