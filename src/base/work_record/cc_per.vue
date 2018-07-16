<template>
  <div v-show="happen">
    <transition>
      <ul>
        <li v-show="false"></li>
          <li v-for="(item,index) in this.cc_range" >
            <div class="avatar">
              <img :src="item.avatar" alt="" />
            </div>
            <div class="name">
              <span>{{item.name}}</span>
            </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
  import {getCro} from "@/common/js/crowd";
  import {getAvatar} from '@/common/js/avatar.js'
  export default {
    data(){
      return{
        happen :false,
        cc_range:[],
        infoArr :{},
      }
    },
    methods:{
      ts(){
        this.cc_range = []
        let param = new URLSearchParams()
        param.append('publish_id',this.pub)
        this.$http.post('/index.php/Mobile/company/look_cc_user_name',param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            res.data.data.forEach((item)=>{
              item.avatar = getAvatar(item.avatar)
              this.cc_range.push(item)
            })
          })
      },
    },
    props:{
      pub:{

      }
    }
  }
</script>

<style lang="scss" scoped>
.happen{
  ul{
    padding: 10px;
    >li{
      cursor: default;
      display: block;
      border-bottom: 1px solid #DDDDDD;
      font-size: 14px;
      transition: .3s;
      .el-button.is-round {
        padding: 5px 10px;
      }
      &:first-child {
        border-bottom: 1px solid transparent;
        &:hover {
          background: none;
        }
      }
      &:nth-child(even) {
        background: rgb(245, 247, 250);
      }
      &:hover {
        background: #EEEEEE;
      }
      >div {
        margin-top: 10px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
      }
      .avatar {
        vertical-align: top;
        width: 90px;
        margin-right: 20px;
        margin-left: 4px;
        img {
          margin-left: 10px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .name {
        width: 150px;
      }
      .tel {
        width: 200px;
      }
      .operation {
        width: 80px;
        button {
          display: block;
        }
      }
    }
  }
}
</style>
