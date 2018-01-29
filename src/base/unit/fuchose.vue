<template>

  <div class="check-area" v-show="items.length!=0">
    <p :form_element_id="form_element_id" :version="str">{{tit}}</p>
    <ul>
      <li class="border-1px" v-for="(item,index) in items">
        <input class="self-checkbox" type="checkbox"
               :id="item.choice_id"
               :data-id="item.choice_id"
               name="radio"
               :value="item.choice_title"
               v-model="checkValues"
               @click="setCheckValue($event,item)">
        <span>{{item.choice_title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data:function () {
      return{
        items: '',
        checkValues: [],
        result: []
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

      }
    },
    computed: {

    },
    methods:{
      initData: function () {
        var self = this;
        self.items = this.options;
        if (this.options.length != 0) {
          var st = this.default_select
          for(var i=0;i<st.length;i++){
            self.checkValues[i] = self.items[st[i]-1].choice_title;
            self.result[i] = self.items[st[i]-1].choice_id;
          }
        }
      },
      setCheckValue: function (ev, item) {
        var id = item.choice_id;
        if (ev.target.checked) {
          this.result.push(id);
        } else if (this.result.indexOf(id) > -1) {
          let i = this.result.indexOf(id)
          this.result.splice(i,1);
        }
      },
    },
    filter: {},
    mounted: function () {
      this.initData();
    }
  }
</script>

<style scoped>

</style>
