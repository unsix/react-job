<template>
  <div class="check"  :version="str">
    <p>{{tit}}</p>
    <ul>
      <li v-for="(item,index) in items" >
        <input type="radio"
               :select_id="item.choice_id"
               :name="form_element_id"
               @click="setCheck(item)"
               :checked="index==0"
               :value="item.choice_title"
               v-model="checkValue">
        <span>{{item.choice_title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data:function () {
      return{
        items:'',
        checkValue:'',
        result:'',
        checkId:''
      }
    },
    props:{
      tit:{

      },
      form_element_id:{

      },
      str:{

      },
      options:{

      },
      default_select:{

      },

    },
    methods:{
      initData: function() {
        var self = this;
        self.items = this.options;
        if(this.options.length != 0) {
          this.checkValue =this.options[this.default_select-1].choice_title;
          this.checkId = this.options[this.default_select-1].choice_id
        }
        this.result = this.checkId
      },
      setCheck:function (item) {
        this.checkId =item.choice_id
        this.result = this.checkId
      },
    },
    created(){
      this.initData();
    },
    mounted(){

    }

  }
</script>

<style scoped>

</style>
