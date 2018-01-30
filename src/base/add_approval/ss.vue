<template>
  <div class="chengpijian" >
    <button @click="msms()">展示</button>
    <components :is="item.component"
                :tit="item.tit"
                :key="idx"
                :ref="item.cc"
                :str="item.version"
                :hint="item.place"
                :sdsd="item.fill"
                :type="item.input_type"
                :options="item.meta_data"
                :default_select="item.default_select"
                :form_element_id="item.form_element_id"
                v-for="(item,idx) in conpents"></components>
    <!--<textarea v-model="shuju" cols="30" rows="10"></textarea>-->
    <button @click="wode">提交</button>
    <!--<textarea v-model="ts"  cols="30" rows="10"></textarea>-->
    <button @click="mtmt">填充</button>
  </div>
</template>

<script>
  import chose from '@/base/unit/chose'
  import fuchose from '@/base/unit/fuchose'
  import datas from '@/base/unit/datas'
  import sec from '@/base/unit/sec'
  export default {
    data() {
      return {
        todo:[],
        // ts:[],
        shuju:[],
        conpents:[],
        ts:[{"result":"1","form_element_id":1},{"result":['2','3'],"form_element_id":2},{"result":"1514476800","form_element_id":3},{"result":"是","form_element_id":76},{"result":"2 ","form_element_id":77},{"result":"2","form_element_id":73}],
        todo:[{
          "form_element_id": "1",
          "type": "single_choice",
          "version": "0",
          "title": "测试单选框",
          "meta_data": "{\"options\":[{\"choice_id\":\"1\",\"choice_title\":\"今天\"},{\"choice_id\":\"2\",\"choice_title\":\"明天\"},{\"choice_id\":\"3\",\"choice_title\":\"后天\"}],\"default_select\":\"3\"}"
        },
          {
            "form_element_id": "2",
            "type": "multi_choice",
            "version": "0",
            "title": "测试多选框",
            "meta_data": "{\"options\":[{\"choice_id\":\"1\",\"choice_title\":\"今天\"},{\"choice_id\":\"2\",\"choice_title\":\"明天\"},{\"choice_id\":\"3\",\"choice_title\":\"后天\"}],\"default_select\":[\"1\", \"3\"]}"
          },
          {
            "form_element_id": "3",
            "type": "date_select",
            "version": "0",
            "title": "测试选择日期",
            "meta_data": "{\"is_fill_local_time\": true}"
          },
          {
            "form_element_id": "76",
            "title": "今日完成",
            "type": "input_text",
            "version": "0",
            "meta_data": "{\"hint\": \"请输入今日完成\"}\n"
          },
          {
            "form_element_id": "77",
            "title": "明日计划",
            "type": "input_text",
            "version": "0",
            "meta_data": "{\"hint\": \"请输入明日计划\"}\n"
          },
          {
            "form_element_id": "73",
            "title": "工作心得",
            "type": "input_text",
            "version": "0",
            "meta_data": "{\"hint\": \"请输入工作心得\"}\n"
          }
        ],
      }
    },
    computed: {
    },
    components: {
      chose,
      fuchose,
      sec,
      datas
    },
    methods: {
      msms:function () {
        console.log(this.todo)
        let str = eval(this.todo)
        str.forEach((item)=>{
          item.meta_data = JSON.parse(item.meta_data)
          if(item.type == "input_text"){
            this.conpents.push({
              component:sec,
              tit: item.title,
              form_element_id: item.form_element_id,
              version:item.version,
              place:item.meta_data.hint,
              input_type:item.meta_data.input_type,
              cc: 'ceshi'
            })
          }
          if(item.type == "single_choice"){
            this.conpents.push({
              component:chose,
              form_element_id: item.form_element_id,
              version:item.version,
              tit: item.title,
              meta_data:item.meta_data.options,
              default_select:item.meta_data.default_select,
              cc: 'ceshi'
            })
            //四个组件的ref名字改一下
          }
          if(item.type == "multi_choice"){
            this.conpents.push({
              component:fuchose,
              form_element_id: item.form_element_id,
              version:item.version,
              tit: item.title,
              meta_data:item.meta_data.options,
              default_select:item.meta_data.default_select,
              cc: 'ceshi'
            })
          }
          if(item.type == "date_select"){
            this.conpents.push({
              component:datas,
              form_element_id: item.form_element_id,
              version:item.version,
              tit: item.title,
              fill:item.meta_data.is_fill_local_time,
              cc: 'ceshi'
            })
          }
        })
      },
      wode:function () {
        var geo = this.$refs.ceshi
        geo.forEach((item)=>{
          this.shuju.push({
            result:item.result,
            form_element_id:item.form_element_id
          })
        })
        console.log(this.shuju)
        this.shuju = JSON.stringify(this.shuju)
      },
      mtmt:function () {
        var geo = this.$refs.ceshi
        console.log(geo)
        let sr = eval(this.ts)
        for(var i=0;i<sr.length;i++){
          if(sr[i].form_element_id == geo[i].form_element_id){
            geo[i].result = sr[i].result
          }
        }
      },
    }
  }
</script>

<style lang="scss">

</style>
