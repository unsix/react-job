<template>
  <div class="check">
    <p>单选</p>
    <p :choiceId="choiceId">{{tit}}</p>
    <ul>
      <li v-for="(item,index) in items">
        <input type="radio" :select_id="item.id" name="radio" @click="setCheck(item)" :checked="index==0" :value="item.value" v-model="checkValue">
        <label :for="item.id" ></label>
        <span>{{item.value}}</span>
      </li>
    </ul>
    <button @click="showCheck(checkId)">提交</button>
  </div>
</template>

<script>
  var itemData = [
    {id:'201801',value:'是'},
    {id:'201802',value:'否'}
  ]
  export default {
    data:function () {
      return{
        items:'',
        checkValue:'',
        checkId:''
      }
    },
    props:{
      tit:{

      },
      choiceId:{

      }
    },
    methods:{
      initData: function() {
        var self = this;
        self.items = itemData;
        if(itemData.length != 0) {
          self.checkValue = self.items[0].value;
          self.checkId = self.items[0].id
        }
      },
      setCheck:function (item) {
        this.checkId =item.id
      },
      showCheck: function () {
        console.log(this.checkId)
      }
    },
    created(){

    },
    mounted(){
      this.initData();
    }

  }
</script>

<style scoped>

</style>
