<template>
  <div>
    <div class="company" v-if="false">
      <div class="top">
        <p>公司列表</p>
      </div>

      <div class="main">
        <el-table :data="arr.slice((currentPage-1)*pagesize,currentPage*pagesize)" border style="width: 100%" max-height="760" :default-sort = "{prop: 'version', order: 'descending'}" @sort-change="sss">
          <el-table-column prop="version" label="版本号" align="center" sortable :sort-method="sort">
            <template slot-scope="scope">
              <el-tag size="small">{{scope.row.version}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="发布日期" align="center" sortable></el-table-column>
        </el-table>

        <div class="page">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pagesize" :page-sizes="[10, 20, 30]" layout="total, sizes, prev, pager, next, jumper" :total="PublishDatas.length"></el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        todo:{
          "0.1.1": {
            "update_time": "2017-6-03-10:04",
            "version": "0.1.1"
          },
          "0.1.2": {
            "update_time": "2017-6-05-15:13",
            "version": "0.1.2"
          },
          "0.2.0": {
            "update_time": "2017-6-07-21:19",
            "version": "0.2.0"
          },
          "0.2.1": {
            "update_time": "2017-6-09-19:07",
            "version": "0.2.1"
          },
          "0.2.2": {
            "update_time": "2017-6-13-13:41",
            "version": "0.2.2"
          },
          "0.3.0": {
            "update_time": "2017-6-15-20:15",
            "version": "0.3.0"
          },
          "0.3.1": {
            "update_time": "2017-6-16-17:21",
            "version": "0.3.1"
          },
          "0.3.2": {
            "update_time": "2017-8-09-14:12",
            "version": "0.3.2"
          },
          "0.3.3": {
            "update_time": "2017-9-21-15:19",
            "version": "0.3.3"
          },
          "1.0.0": {
            "update_time": "2018-1-15-17:58",
            "version": "1.0.0"
          },
          "1.1.0": {
            "update_time": "2018-1-27-15:39",
            "version": "1.1.0"
          },
          "1.2.0": {
            "update_time": "2018-2-02-10:06",
            "version": "1.2.0"
          },
          "1.2.1": {
            "update_time": "2018-2-24-11:22",
            "version": "1.2.1"
          },
          "1.2.2": {
            "update_time": "2018-2-26-09:52",
            "version": "1.2.2"
          },
          "1.2.3": {
            "update_time": "2018-2-26-14:55",
            "version": "1.2.3"
          },
          "1.2.4": {
            "update_time": "2018-3-09-09:59",
            "version": "1.2.4"
          },
          "1.2.5": {
            "update_time": "2018-3-10-15:09",
            "version": "1.2.5"
          },
          "1.2.6": {
            "update_time": "2018-3-15-16:44",
            "version": "1.2.6"
          }
        },
        arr:[],
        query: null,
        PublishDatas: [],
        infolog: [],
        publishlog: [],
        currentPage: 1,
        pagesize: 10,
        publishdata: [],
        publishlabel: []
      }
    },
    methods:{
      _get_company(){
        // let arr = []
        // for (let i in this.todo) {
        //   let publish = {
        //     version:  this.todo[i].version,
        //     date:  this.todo[i].update_time,
        //     logVisible: false,
        //     infoVisible: false
        //   }
        //   arr.push(publish)
        //   this.arr = arr
        // }
        this.$message.info('功能完善中')
      },
      sort(a, b) {
        // console.log(a)
      },
      handleSizeChange(val) {
        this.pagesize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val
      },
      compare(newVal, curVal) {
        if (newVal.version < curVal.version) {
          return 1
        } else if (newVal.version > curVal.version) {
          return -1
        } else {
          return 0
        }
      },
      sss({ column, prop, order }){
        console.log(column)
        console.log(prop)
        console.log(order)
      }
    },
    created(){
      this._get_company()
    },
    mounted(){
      if(this.$route.path === '/work/company') {
        this.$emit('changeWorkIndex', '2-4')
      }
    }
  }
</script>

<style lang="scss">
  .company{
    width: 100%;
    .top{
      position: relative;
      background: #Fff;
      p{
        text-align: center;
        font-size: 18px;
        font-weight: bolder;
        padding: 20px 0;
      }
      .el-button--success{
        position: absolute;
        top: 13px;
        right: 15px;
      }
    }
  }
  .main {
    width: calc(100% - 40px);
    .head {
      width: 100%;
      font-size: 14px;
      padding: 20px 0;
    }
    .el-loading-spinner .el-loading-text {
      padding-top: 10px;
      font-size: 18px;
    }
    .el-loading-spinner i {
      font-size: 30px;
    }
    .el-dialog__header {
      text-align: left;
    }
    .el-dialog__body {
      text-align: left;
    }
    .page {
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
