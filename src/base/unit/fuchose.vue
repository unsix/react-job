<template>

  <div class="check-area" v-show="items.length!=0">
    <h3>多选按钮</h3>
    <ul>
      <li class="border-1px" v-for="(item,index) in items">
        <input class="self-checkbox" type="checkbox"
               :id="item.id"
               :data-id="item.id" name="radio"
               :value="item.value"
               v-model="checkValues"
               @click="setCheckValue($event,item)">
        <label :for="item.id"></label>
        <span>{{item.value}}</span>
      </li>
    </ul>
    <p>您选择了：<span v-show="checkValues.length">{{filterCheckValues}}</span></p>
    <div class="btn">
      <button @click="showCheck(checkIds)">按钮</button>
      <span v-show="checkIds.length">{{checkIds}}</span>
    </div>
  </div>
</template>

<script>
  var itemData = [
    {id: '20170811001', value: '香蕉'},
    {id: '20170811002', value: '苹果'},
    {id: '20170811003', value: '梨子'},
    {id: '20170811004', value: '葡萄'}]
  export default {
    data:function () {
      return{
        items: '',
        checkValues: [],
        checkIds: []
      }
    },
    computed: {
      filterCheckValues: function () {
        var value = this.checkValues;
        var reValue = '';
        for (var i = 0; i < value.length; i++) {
          reValue += value[i] + '、'
        }
        reValue = reValue.substring(0, reValue.length - 1)
        return reValue;
      }
    },
    methods:{
      initData: function () {
        var self = this;
        self.items = itemData;
        if (itemData.length != 0) {
        //self.checkValues[0] = self.items[0].value;
        //self.checkIds[0] = 'food-' + self.items[0].id;
        }
      },
      setCheckValue: function (ev, item) {
        var id = item.id;
        if (ev.target.checked) {
          this.checkIds.push(id);
        } else if (this.checkIds.indexOf(id) > -1) {
          this.checkIds.remove(id);
        }
      },
      showCheck: function () {
        console.log(this.checkIds)
      }


    },
    filter: {},
    mounted: function () {
      this.initData();
    }
  }
  Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if(index > -1) {
      this.splice(index, 1);
    }
  };
</script>

<style scoped>

</style>
