<template>
    <div name="工资单" class="gzd">
      <el-form :model="gzd_ruleForm" :rule="gzd_rules" ref="gzd_ruleForm" label-width="150px" class="demo-gzd_ruleForm">
        <el-form-item>
          <p>类型：点工月工资请款单</p>
        </el-form-item>
        <el-form-item label="姓名">
          <el-select style="display: block" v-model="gzd_ruleForm.name" placeholder="请选择" @change="gzdPro">
            <el-option v-for="item in comPersonList" :key="item.personnel_id" :label="item.name" :value="item.uid">
              <img :src="item.avatar" style="width: 30px; float: left;vertical-align: middle;margin-top: 5px; border-radius: 50%;" />
              <span style="float: left;margin-left: 20px;">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="gzd_ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="gzd_ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="工种">
          <el-input v-model="gzd_ruleForm.work_type"></el-input>
        </el-form-item>
        <el-form-item label="本次请款月份">
          <el-input v-model="gzd_ruleForm.once_month"></el-input>
        </el-form-item>
        <el-form-item label="日工资">
          <el-input v-model="gzd_ruleForm.day_money"></el-input>
        </el-form-item>
        <el-form-item label="工作天数">
          <el-input v-model.number="gzd_ruleForm.work_day"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="gzd_ruleForm.money"></el-input>
        </el-form-item>
        <el-form-item label="奖罚">
          <el-input v-model="gzd_ruleForm.promise"></el-input>
        </el-form-item>
        <el-form-item label="已领金额">
          <el-input v-model="gzd_ruleForm.have_money"></el-input>
        </el-form-item>
        <el-form-item label="应付金额">
          <el-input v-model="gzd_ruleForm.pay_money"></el-input>
        </el-form-item>
        <el-form-item label="确认人">
          <el-input v-model="gzd_ruleForm.trust_person"></el-input>
        </el-form-item>
        <el-form-item label="第三方确认人">
          <el-input v-model="gzd_ruleForm.thr_trust_person"></el-input>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        gzd_ruleForm:{
          name:'',
          phone:'',
          account:'',
          work_type:'',
          once_month:'',
          day_money:'',
          work_day:'',
          money:'',
          promise:'',
          have_money:'',
          pay_money:'',
          trust_person:'',
          thr_trust_person:''
        },
        gzd_rules:{
          name:[{

          }],
          phone:[{

          }]
        }
      }
    },
    methods:{
      ...mapMutations({
        setToken: 'SET_TOKEN'
      }),
      gzdPro(tab){
        this.comPersonList.forEach((item)=>{
          if(item.uid == tab){
            this.gzd_ruleForm.name = item.name
            this.gzd_ruleForm.phone = item.phone
            return
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'comPersonList',
        'user',
        'nowCompanyId',
        'comDepartList',
        'token'
      ]),
    },
  }
</script>

<style lang="scss">
.gzd{
  width: 100%;

}
</style>
