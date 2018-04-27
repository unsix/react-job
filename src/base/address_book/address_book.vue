<template>
	<div class="address">
    <div class="address_book" v-show="address_book_show">
      <ul>
        <li>
          <div class="avatar lzz">
            <span style="margin-left: 10px;">头像</span>
          </div>
          <div class="name lzz">
            <span>名字</span>
          </div>

          <div class="tel lzz">
            <span>联系方式</span>
          </div>
          <div class="operation lzz">
            <span>操作</span>
          </div>
        </li>
        <li v-for="(item,index) in comPersonList">
          <div class="avatar">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="name">
            <span>{{item.name}}</span>
          </div>
          <div class="tel">
            <span>{{item.phone}}</span>
          </div>
          <div class="operation">
            <el-button type="primary" round @click="view_info(item.personnel_id)">查看</el-button>
          </div>
        </li>
      </ul>
    </div>

    <div class="book_details"v-show="details_show">
      <div class="top">
        <el-button type="primary" class="btn" plain @click="_return">返回</el-button>
        <span class="title">人员详情</span>
      </div>
      <div v-model="infoArr" >
        <div class="main">
          <img :src="infoArr.avatar" alt="">
          <p>{{infoArr.name}}</p>
        </div>
        <div class="bottom">
          <div class="tel">
            <h4><p>电话</p><span>{{infoArr.phone}}</span></h4>
            <H4><P>职称</P><span>{{infoArr.job_name}}</span></H4>
            <h4><p>所属部门</p><span>{{infoArr.department_name}}</span></h4>
          </div>
          <div class="work">
            <h4 @click="look(infoArr.uid)">工作记录<span>...</span></h4>
            <h4 @click="sign(infoArr.uid)">外勤签到<span>...</span></h4>
          </div>
        </div>
      </div>
    </div>

    <div class="publish" v-show="look_show">
      <div class="top">
        <el-button type="primary" class="btn" plain @click="return_">返回</el-button>
        <span class="title">工作记录</span>
      </div>
      <div class="list">
        <ul>
          <li v-for="(item,idx) in untreated">
            <div class="main">
              <div class="avatar">
                <img :src="item.avatar">
              </div>
              <div class="name">
                <span>{{item.name}}</span>
                <span class="add_time">{{item.add_time}}</span>
              </div>
              <div class="stauts">
                <p>日志
                  <span v-show="item.reviewer_fraction == 0">未点评</span>
                  <span v-show="item.reviewer_fraction != 0">已点评{{item.reviewer_fraction}}分</span>
                </p>
              </div>
            </div>
            <div class="cc">
              <div class="cs">
                <span @click="mask(item.publish_id)"><i class="iconfont icon-shixindiqiu" style="margin-right: 5px"></i>{{item.cc_detail}}</span>
                <cc_per class="cc_per" ref="cc_pers" :pub="item.publish_id" ></cc_per>
              </div>
            </div>
            <div class="bottom">
              <div class="time">
                <span>{{item.start_time}} 由{{item.reviewer_name}}点评</span>
              </div>
               <ul>
                 <li v-for="ti in item.custom_form_elements">
                   <p>{{ti.title}}</p>
                   <span style="margin-left: 20px;display: block" v-html="ti.result"></span>
                 </li>
               </ul>
            </div>
            <div class="share">
              <div class="right">
                <span @click="lookMore(item.publish_id,item.cc_detail)"><i class="iconfont icon-more"></i>查看详情</span>
                <span @click="likeLog(item.publish_id)" :title="item.publish_id" ref="zan" style="color: black"><i class="iconfont icon-danzan"></i>点赞</span>
                <span v-show="item.uid == item.del" @click="delDate(item.publish_id)"><i class="iconfont icon-shanchu"></i>删除</span>
                <span @click="judge(item.name,item.publish_id,item.reviewer,item.log_id,item.reviewer_fraction)" class="nonebo"><i class="iconfont icon-xiaoxi"></i>回复</span>
              </div>
            </div>
          </li>
          <div class="page">
            <span @click="first_page">首页</span>
            <span @click="last_page" v-show="pageIndex > 1">上一页</span>
            <span @click="next_page" v-show="nextPageShow">下一页</span>
          </div>
        </ul>
      </div>
    </div>

    <div class="send" v-show="sendShow">
      <span class="close"><span class="huifu">回复{{sendName}}</span><i class="el-icon-close" @click="closeSend"></i></span>
      <el-input type="textarea" v-model="content"></el-input>
      <span class="sr">
        <el-button type="primary" round @click="submitCom">确定</el-button>
        <el-upload class="upload-demo" id="picc" multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
          <i class="iconfont icon-zhaopian"></i>
        </el-upload>
        <el-upload class="upload-demo_a" id="file" multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
          <i class="iconfont icon-fujian"></i>
        </el-upload>
      </span>
    </div>
    <div class="sended" v-show="sendedShow">
      <span class="close"><span><el-rate v-model="ras"></el-rate></span><span class="huifu">点评{{sendName}}</span><i class="el-icon-close" @click="closeSend"></i></span>
      <el-input type="textarea" v-model="content"></el-input>
      <span class="sr">
          <el-button type="primary" round @click="submitCom">确定</el-button>
          <el-upload class="upload-demo" id="picc" multiple accept="image/jpeg,image/png" action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" list-type="picture-card" :file-list="fileList" :auto-upload="false">
            <i class="iconfont icon-zhaopian"></i>
          </el-upload>
          <el-upload class="upload-demo_a" id="file" multiple action="https://up.qbox.me/"  :on-change="handlePreview_a" :on-remove="handleRemove_a" list-type="text" :file-list="fileList_a" :auto-upload="false">
            <i class="iconfont icon-fujian"></i>
          </el-upload>
        </span>
    </div>
    <div class="more" v-show="moreShow">
      <div class="top">
        <el-button type="primary" class="btn" plain @click="reinfo">返回</el-button>
        <span class="title">日志</span>
      </div>
      <div class="main">
        <div class="avatar">
          <img :src="moreInfo.avatar">
        </div>
        <div class="name">
          <span>{{moreInfo.name}}</span>
          <span class="add_time">{{moreInfo.add_time}}</span>
        </div>
        <div class="stauts">
          <p>日志
            <span v-show="star.reviewer_fraction == 0">未点评</span>
            <span v-show="star.reviewer_fraction != 0">已点评{{star.reviewer_fraction}}分</span>
          </p>
        </div>
      </div>
      <div class="cc">
        <div class="cs">
          <span @click="masked(moreInfo.publish_id)"><i class="iconfont icon-shixindiqiu" style="margin-right: 5px"></i>{{this.c_detail}}</span>
          <cc_per class="cc_pers" ref="cc_persd" :pub="moreInfo.publish_id" ></cc_per>
        </div>
      </div>
      <div class="bottom">
        <div class="time">
          <span>{{star.start_time}} 由{{star.reviewer_name}}点评</span>
        </div>
        <ul>
          <li v-for="ti in star.custom_form_elements">
            <p>{{ti.title}}</p>
            <span style="margin-left: 20px;display: block" v-html="ti.result"></span>
          </li>
        </ul>
      </div>
      <div class="ques" v-show="star.reviewer_fraction !=0">
       <div>
         <p>以下为点评人的点评：</p>
         <p>{{star.reviewer_name}}:{{star.reviewer_fraction}}分 {{star.reviewer_content}}</p>
         <p>{{star.reciewer_time}}</p>
       </div>
      </div>
      <div class="imgList">
        <span>图片附件：</span>
        <a v-for="(item,index) in star.img_list" v-if="star.img_list">
          <img :src="item" alt="" @click="ctrl_pic_show(star.img_list,index)" />
        </a>
      </div>
      <div class="file">
        <span>附件列表：</span>
        <a :href="item.address" v-for="(item,index) in file_arr" target="_blank" class="file">{{item.name}}</a>
      </div>
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="回复" name="first"></el-tab-pane>
          <el-tab-pane label="赞" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="comment" v-show="comShow">
        <ul>
          <li v-for="(item,index) in comArr">
            <div style="overflow: hidden">
              <div class="avatar">
                <img :src="item.avatar">
              </div>
              <div class="name">
                <span>{{item.name}}</span>
                <span class="add_time">{{item.add_time}}</span>
                <span>{{item.content}}</span>
              </div>
              <span class="huihui" @click="judges(item.publish_id,item.name,item.comment_id)"><i class="iconfont icon-xiaoxi"></i></span>
              <div class="fuj" v-if="item.enclosure">
                <div>
                  <span>图片附件：</span>
                  <a v-for="(res,idx) in item.fujImg_list">
                    <img :src="res"   @click="picShow(res,idx)"/>
                  </a>
                </div>
                <div>
                  <span>附件列表：</span>
                  <a :href="sr.address" v-for="(sr,ind) in item.fujFile" target="_blank" class="filess">{{sr.name}}</a>
                </div>
              </div>
            </div>
            <ul v-show="item.reply" style="margin-left: 35px;margin-top: 15px;background: #D9D9D9;width: 505px;">
              <li v-for="res in item.reply" style="border-bottom: none;padding: 8px !important;">
                <p>{{res.reply_name}}回复{{item.name}}</p>
                <p>{{res.content}}</p>
                <p>{{res.add_time  }}</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="like" v-show="likeShow">
        <ul>
          <li v-for="item in likeArr">
            <p>
              <img :src="item.avatar">
              <span>{{item.name}}</span>
            </p>
            <span class="add_time">
              {{item.add_time}}
            </span>
          </li>
        </ul>
      </div>
      <div class="menu">
        <span @click="judge(moreInfo.name,moreInfo.publish_id,star.reviewer,star.log_id,star.reviewer_fraction)" class="nonebo"><i class="iconfont icon-xiaoxi"></i>回复</span>
        <span @click="logLike(moreInfo.publish_id)" v-show="moreInfo.like_id< 1 "><i class="iconfont icon-danzan"></i>点赞</span>
        <span @click="logLikes(moreInfo.publish_id)" style="color: red;" v-show="moreInfo.like_id > 1"><i class="iconfont icon-danzan"></i>点赞</span>
        <span @click="delDate(moreInfo.publish_id)" v-show="star.uid == this.user.uid"><i class="iconfont icon-shanchu"></i>删除</span>
      </div>
    </div>
    <browsePic :pic_index="pic_index" ref="browe" :img_arr="arr_list"  v-show="pic_show"></browsePic>
    <div class="wide" ref="wide" v-show="wideShow"></div>
    <div class="add" v-show="addShow" style="z-index: 9999">
      <ul v-show="this.inde == 20" style="position: fixed">
        <i class="el-icon-close" @click="asShowed"></i>
        <li v-for="item in as_type" @click="asWhat(item)">{{item}}</li>
      </ul>
    </div>
    <loading v-show="loading_show" style="z-index: 9999999"></loading>

    <div class="pic" ref="pic" v-show="show_pic">
      <i class="el-icon-close" @click="close_pp"></i>
      <img ref="img" :src="linked">
    </div>

    <sign v-show="signShow" ref="sign"></sign>
  </div>
</template>

<script>
  import cc_per from '@/base/work_record/cc_per'
  import {getPic} from '@/common/js/pic.js'
	import {getAvatar} from '@/common/js/avatar.js'
  import {getCro} from "@/common/js/crowd";
  import loading from '@/base/loading/loading'
  import browsePic from '@/base/browse_pic/browse_pic'
  import browe from '@/base/browse_pic/browse_pic'
  import { mapGetters, mapMutations } from 'vuex'
  import sign from '@/base/address_book/sign'
	export default {
		data() {
			return {
			  value1:null,
        untreated:[],
        look_show:false,
        address_book_show:true,
        moreShow:false,
			  details_show : false,
        personnel_id: '',
        infoArr :{},
        moreInfo:{},
        star:{},
        loading_show: false,
        comShow:true,
        comArr:[],
        activeName:'first',
        pic_index: 0,
        pic_show: false,
        arr_list: [],
        file_arr: [],
        nextPageShow: true,
        pageIndex:1,
        likeShow:false,
        likeArr:[],
        tip:'',
        looks:'',
        sendShow:false,
        sendName:'',
        fujArr:[],
        fujFile:[],
        pic_show_now:false,
        fileList:[],
        fileList_a:[],
        pic_hash_arr: [],
        file_hash_arr: [],
        content:'',
        file_time: 0,
        pic_time: 0,
        afile_hash_arr: [],
        pub:'',
        parent_id:'',
        wideShow:false,
        c_detail:'',
        as_type:['点评','回复'],
        view:'',
        ras:null,
        sendedShow : false,
        log_id :'',
        addShow:false,
        inde:'',
        show_pic:false,
        linked:'',
        signShow:false,
        str:''
      }
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user',
				'comPersonList',
        'token'
			])
		},
		props:{
			workList:{
				type:Array
			}
		},
		methods: {
      handleRemove(file, fileList) {
        this.fileList = fileList
      },
      handlePreview(file, fileList) {
        if(file.name.indexOf('jpg') == '-1' && file.name.indexOf('png') == '-1'){
          this.$message.error('上传文件格式错误')
          this.str = file
        }
        function remove(arr,val) {
          for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
              arr.splice(i, 1);
              break;
            }
          }
        }
        remove(fileList,this.str)
        this.fileList = fileList
      },
      handleRemove_a(file, fileList_a) {
        this.fileList_a = fileList_a

      },
      handlePreview_a(file, fileList_a){
        //后缀
        let index = file.name.lastIndexOf('.')
        let attribute = file.name.slice(index)
        if(attribute.substr(0,1)=='.'){
          attribute=attribute.substr(1)
        }
        this.$http.post("/index.php/Mobile/find/file_info")
          .then((res)=>{
            let attr = res.data.data.attribute
            if(attr.indexOf(attribute) !=-1){
              this.fileList_a = fileList_a
            }else{
              this.$message.error('上传文件格式错误 请删除')
              this.fileList_a = fileList_a
            }

          })
      },
      submitCom(){
        if(this.content == ''){
          this.$message.error('请输入评论内容');
        }else{
          this.com_submit()
          this.loading_show = true
        }
      },
      com_submit(){
        this.picArr = []
        this.fileArr = []
        this.fileList.forEach((item) => {
          if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1' || item.name.indexOf("图像") != '-1') {
            this.picArr.push(item)
          }
        })
        this.fileList_a.forEach((item) =>{
          this.fileArr.push(item)
        })
        this.pic_hash_arr = []
        this.afile_hash_arr = []
        this.file_hash_arr = []
        this.file_time = 0
        this.pic_time = 0
        this.loadingShow = true
        setTimeout(()=>{
          if(this.picArr.length === 0 && this.fileArr.length === 0){
            let param = new URLSearchParams();
            if(this.sendShow == true){
              param.append('uid',this.user.uid)
              param.append('publish_id',this.pub)
              param.append('content',this.content)
              if(this.parent_id){
                param.append('parent_id',this.parent_id)
              }
              this.$http.post('/index.php/Mobile/company/user_comment',param)
                .then((res)=>{
                  this.loadingShow = false
                  if(res.data.code === 0) {
                    this.add_ok()
                    this.loading_show = false
                    this.sendShow = false
                    this.wideShow = false
                    this.likeArr.splice(0,this.likeArr.length)
                    this.comArr.splice(0,this.comArr.length)
                    if(this.moreShow == true){
                      this._getComment()
                      this._likeList()
                      this._getMoreInfo()
                    }
                    document.body.style.overflow = 'visible'
                  } else {
                    this.add_fail()
                  }
                })
            }else{
              param.append('uid',this.user.uid)
              param.append('reviewer_fraction',this.ras)
              param.append('remarks',this.content)
              param.append('log_id',this.log_id)
              this.$http.post('/index.php/Mobile/company/user_reviewer',param)
                .then((res)=>{
                  this.loadingShow = false
                  if(res.data.code === 0) {
                    this.add_ok()
                    this.loading_show = false
                    this.sendedShow = false
                    this.wideShow = false
                    this.likeArr.splice(0,this.likeArr.length)
                    this.comArr.splice(0,this.comArr.length)
                    if(this.moreShow == true){
                      this._getComment()
                      this._likeList()
                      this._getMoreInfo()
                    }
                    document.body.style.overflow = 'visible'
                  } else {
                    this.add_fail()
                  }
                })
            }
          }else{
            if(this.picArr.length != 0){
              var upload_enclosure_new = (fn)=>{
                for(let i = 0; i < this.picArr.length; i++) {
                  let formData = new FormData();
                  formData.append('file', this.picArr[i].raw);
                  formData.append('token', this.token);
                  let config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                  if(!this.picArr[i].size){
                    this.pic_hash_arr.push(this.picArr[i].hash);
                    this.pic_hash_arr.length === this.picArr.length && fn(this.picArr[i].name);
                  }else{
                    this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                      this.pic_hash_arr.push(res.data.hash)
                      if(this.pic_hash_arr.length === this.picArr.length) {
                        fn(this.picArr[i].name);
                      }
                    })
                  }
                }
              }
              upload_enclosure_new((name)=>{
                let nparam = new URLSearchParams()
                nparam.append("uid", this.user.uid);
                nparam.append("picture", JSON.stringify(this.pic_hash_arr));
                this.$http.post("/index.php/Mobile/approval/upload_enclosure_new", nparam)
                  .then((res)=>{
                    this.afile_hash_arr.push({
                      "type": 3,
                      "contract_id": res.data.data.enclosure_id,
                      name,
                    })
                    let aDate = Date.parse(new Date())
                    this.pic_time = aDate
                  })
              })
            }
            if(this.fileArr.length != 0){
              for(let i = 0; i < this.fileArr.length; i++){
                let formData = new FormData();
                formData.append('file', this.fileArr[i].raw);
                formData.append('token', this.token);
                let config = {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
                if(!this.fileArr[i].size){
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute=attribute.substr(1)
                  }
                  let file_name = this.fileArr[i].name.slice(0, index)
                  let param = new URLSearchParams();
                  param.append("uid", this.user.uid);
                  param.append("attribute", attribute);
                  param.append("attachments", this.fileArr[i].hash);
                  param.append("file_name", file_name);
                  this.$http.post("/index.php/Mobile/approval/add_attachments", param)
                    .then((res)=>{
                      this.file_hash_arr.push({
                        "type": 4,
                        "contract_id": res.data.data.attachments_id,
                        "name": this.fileArr[i].name
                      })
                      if(this.file_hash_arr.length === this.fileArr.length) {
                        let bDate = Date.parse(new Date())
                        this.file_time = bDate
                      }
                    })
                }else{
                  let size = this.fileArr[i].size
                  let index = this.fileArr[i].name.lastIndexOf('.')
                  let attribute = this.fileArr[i].name.slice(index)
                  if(attribute.substr(0,1)=='.'){
                    attribute=attribute.substr(1)
                  }
                  this.$http.post("/index.php/Mobile/find/file_info")
                    .then((res)=>{
                      let maxSize = res.data.data.max
                      let attr = res.data.data.attribute
                      if(attr.indexOf(attribute) !=-1){
                        if(size<maxSize){
                          this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
                            let file_name = this.fileArr[i].name.slice(0, index)
                            let param = new URLSearchParams();
                            param.append("uid", this.user.uid);
                            param.append("attribute", attribute);
                            param.append("attachments", res.data.hash);
                            param.append("file_name", file_name);
                            this.$http.post("/index.php/Mobile/approval/add_attachments", param)
                              .then((res) => {
                                this.file_hash_arr.push({
                                  "type": 4,
                                  "contract_id": res.data.data.attachments_id,
                                  "name": this.fileArr[i].name
                                })
                                if(this.file_hash_arr.length === this.fileArr.length) {
                                  let bDate = Date.parse(new Date())
                                  this.file_time = bDate
                                }
                              })
                          })
                        }else{
                          this.$message.error('上传文件过大 请删除')
                          this.loadingShow = false
                          return false
                        }
                      }else{
                        this.$message.error('请删除'+this.fileArr[i].name)
                        this.loadingShow = false
                        return false
                      }
                    })
                }
              }
            }
          }
        },500)
      },
      add_ok() {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        });
      },
      add_fail() {
        this.$message({
          showClose: true,
          message: '添加失败',
          type: 'error'
        });
      },
      first_page() {
        this.nextPageShow = true
        this.pageIndex = 1
      },
      last_page() {
        this.nextPageShow = true
        --this.pageIndex
      },
      next_page() {
        ++this.pageIndex
      },
      ctrl_pic_show(item, index) {
        item.forEach((res)=>{
          let current = res.indexOf('?')
          this.arr_list.push(res.slice(0,current) + '?imageslim' )
        })
        this.pic_index = index
        this.pic_show = true
      },
      lookMore(det,re){
        this.look_show = false
        this.address_book_show = false
        this.details_show = false
        this.moreShow = true
        this.publish_id = det
        this.activeName = 'first'
        this.likeShow = false
        this.comShow = true
        this.c_detail = re
        this._getMoreInfo(this.publish_id)
        this._getComment(this.publish_id)
        this._likeList(this.publish_id)
      },
      likeLog(es){
        let box = this.$refs.zan
        let str = es
        box.forEach((item)=>{
          if(str == item.title){
            if(item.style.color == 'black'){
              let param = new  URLSearchParams()
              param.append('uid',this.user.uid)
              param.append('type',1)
              param.append('publish_id',str)
              param.append('company_id',this.nowCompanyId)
              this.$http.post('/index.php/Mobile/company/like_company_log',param)
                .then((res)=>{
                  if(res.data.code == '0'){
                    this.$message({
                      message: '点赞成功',
                      type: 'success'
                    })
                    item.style.color = 'red'
                  }else{
                    this.$message({
                      message: '点赞失败',
                      type: 'error'
                    })
                  }
                })
            }else{
              let param = new  URLSearchParams()
              param.append('uid',this.user.uid)
              param.append('type',2)
              param.append('publish_id',str)
              param.append('company_id',this.nowCompanyId)
              this.$http.post('/index.php/Mobile/company/like_company_log',param)
                .then((res)=>{
                  if(res.data.code == '0'){
                    this.$message({
                      message: '取消点赞',
                      type: 'success'
                    })
                    item.style.color = 'black'
                  }else{
                    this.$message({
                      message: '取消失败',
                      type: 'error'
                    })
                  }
                })
            }
          }
        })
      },
      logLike(res){
        this.publish_id = res
        let param = new  URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('type',1)
        param.append('publish_id',this.publish_id)
        param.append('company_id',this.nowCompanyId)
        this.$http.post('/index.php/Mobile/company/like_company_log',param)
          .then((res)=>{
            if(res.data.code == '0'){
              this.$message({
                message: '点赞成功',
                type: 'success'
              })
              this._getMoreInfo(this.publish_id)
              setTimeout(()=>{
                this._likeList()
              },500)
            }else{
              this.$message({
                message: '点赞失败',
                type: 'error'
              })
            }
          })
      },
      logLikes(res){
        this.publish_id = res
        let param = new  URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('type',2)
        param.append('publish_id',this.publish_id)
        param.append('company_id',this.nowCompanyId)
        this.$http.post('/index.php/Mobile/company/like_company_log',param)
          .then((res)=>{
            if(res.data.code == '0'){
              this.$message({
                message: '取消点赞',
                type: 'success'
              })
              this._getMoreInfo(this.publish_id)
              setTimeout(()=>{
                this._likeList()
              },500)
            }else{
              this.$message({
                message: '取消失败',
                type: 'error'
              })
            }
          })
      },
      handleClick(tab){
        let index = parseInt(tab.index)
        if(index == 0){
          this.likeShow = false
          this.comShow = true
        }
        if(index == 1){
          this.likeShow = true
          this.comShow = false
        }
      },
      _getComment(){
        let param = new URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('company_id',this.nowCompanyId)
        param.append('publish_id',this.publish_id)
        this.$http.post('/index.php/Mobile/company/get_publish_comment',param)
          .then((res)=>{
            if(res.data.code != 0){
              this.comShow = false
            }else{
              res.data.data.forEach((item)=>{
                item.avatar = 'http://bbsf-file.hzxb.net/' + item.avatar
                this.$set(item,'fujImg_list')
                this.$set(item,'fujFile')
                let arr = []
                this.$set(item,'reply',arr)
                this.comArr.push(item)
                if(!item.enclosure){
                  return false
                }else{
                  item.enclosure.forEach((irt)=>{
                    if(irt.type == 3){
                      let param = new URLSearchParams();
                      param.append("enclosure_id", irt.contract_id);
                      this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
                        .then((res)=>{
                          var current = this
                          var judge = res.data.code
                          getCro(judge,current)
                          let arr = []
                          res.data.data.picture.forEach((sr) => {
                            if(sr != '') {
                              arr.push(getAvatar(sr))
                            }
                          })
                          item.fujImg_list = arr
                        })
                    }
                    if(irt.type == 4){
                      let param = new URLSearchParams();
                      param.append("attachments_id", irt.contract_id);
                      this.$http.post("/index.php/Mobile/approval/look_attachments", param)
                        .then((res) => {
                          var current = this
                          var judge = res.data.code
                          getCro(judge,current)
                          let obj = {}
                          let file_data = res.data.data
                          let file_add = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                          obj.name = file_data.file_name+'.'+file_data.attribute
                          obj.address = file_add
                          let arr = []
                          arr.push(obj)
                          item.fujFile = arr
                        })
                    }
                  })

                }
              })
              let se = this.comArr
              let sd = []
              let as = []
              for(var i =0;i<se.length;i++){
                if(se[i].reply_uid){
                  as.push(se[i])
                }
                if(se[i].reply_uid == null){
                  sd.push(se[i])
                }
              }
              for(var i = 0;i<sd.length;i++){
                for(var j = 0;j<as.length;j++){
                  if(as[j].categary_id == sd[i].comment_id){
                    sd[i].reply.push(as[j])
                  }
                }
              }
              this.comArr = sd
            }
          })
      },
      _likeList(){
        let param = new URLSearchParams()
        param.append('company_id',this.nowCompanyId)
        param.append('publish_id',this.publish_id)
        this.$http.post('/index.php/Mobile/company/like_list',param)
          .then((res)=>{
            if(res.data.code != 0){
              this.likeShow = false
              this.likeArr.splice(0,this.likeArr.length)
            }else{
              res.data.data.forEach((item)=>{
                item.avatar = 'http://bbsf-file.hzxb.net/' + item.avatar
                this.likeArr.push(item)
              })
              console.log(this.likeArr)
            }
          })
      },
		  look(res){
		    this.look_show = true
        this.address_book_show = false
        this.details_show = false
        this.look_uid = res
        this.looks = res
        this._getPublishList(this.look_uid)
      },
      delDate(res){
        this.$confirm('您确定删除此日志?','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          this.publish_id = res
          let param = new URLSearchParams()
          param.append('publish_id',this.publish_id)
          param.append('uid',this.user.uid)
          this.$http.post("/index.php/Mobile/company/del_publish",param)
            .then((res)=>{
              if(res.data.code == 0){
                this.$message({
                  message:'删除成功',
                  type:'success'
                })
                this.loading_show = true
                setTimeout(()=>{
                  this._getPublishList(this.looks)
                  if(this.moreShow == true){
                    this.moreShow = false
                    this.pageShow = true
                    this.look_show = true
                  }
                  this.loading_show = false
                },1000)
              }else{
                this.$message({
                  message:'删除失败',
                  type:'error'
                })
              }
            }).catch(()=>{
              this.$message({
                type:'info',
                message:'已取消操作'
              })
          })
        })
      },
      judge(res,pub,re,es,de){
        this.content = ''
        this.sendName = res
        this.sendShow = false
        this.wideShow = true
        this.pub = pub
        this.log_id = es
        document.body.style.overflow = 'hidden'
        if(re == this.user.uid){
          if(de>0){
            this.sendShow = true
          }else{
            this.inde = 20
            this.addShow = true
          }
        }else{
          this.sendShow = true
        }
      },
      judges(pub,res,par){
        this.pub = pub
        this.sendName = res
        this.parent_id = par
        document.body.style.overflow = 'hidden'
        this.wideShow = true
        this.sendShow = true
      },
      closeSend(){
        this.sendShow = false
        this.sendedShow = false
        this.wideShow = false
        this.parent_id = ''
        this.content = ''
        this.pub = ''
        this.log_id = ''
        document.body.style.overflow = 'visible'
      },
			view_info(res) {
        this.address_book_show=false
        this.look_show = false
        this.details_show = true
        this.personnel_id = res
        this._getCompanyUserInfo(this.personnel_id)
			},
      return_(){
        this.address_book_show=false
        this.details_show = true
        this.look_show = false
        if(this.view >0 ){
          this.mask(this.view)
        }
      },
      reinfo(){
        this.moreShow = false
        this.look_show = true
        this.details_show= false
        this.address_book_show = false
        this.likeArr.splice(0,this.likeArr.length)
        this.comArr.splice(0,this.comArr.length)
        if(this.view >0 ){
          this.maskded(this.view)
        }
      },
      _getMoreInfo(){
        let param = new URLSearchParams()
        param.append('uid',this.user.uid)
        param.append('publish_id',this.publish_id)
        param.append('company_id',this.nowCompanyId)
        this.$http.post('/index.php/Mobile/company/get_public_content',param)
          .then((res)=>{
            let ss = res.data.data
            ss.avatar = 'http://bbsf-file.hzxb.net/' + ss.avatar
            this.moreInfo = ss
            this.star = ss.form_data
            this.star.custom_form_elements.forEach((item)=>{
              item.result = item.result.replace(/[\n]/g,"<br />")
            })
            let time = this.star.start_time
            var date = new Date();
            var show_day=new Array('星期一','星期二','星期三','星期四','星期五','星期六','星期日');
            date.setTime(time * 1000);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            var day=date.getDay();
            d = d < 10 ? ('0' + d) : d;
            this.star.start_time = y+'年'+m +'月'+d+'日'+' '+show_day[day-1]
            this.getImg(this.star.enclosure)
            this.getFiles(this.star.enclosure)
          })
      },
      getImg(enclosure){
        if(!enclosure){
          return
        }
        enclosure.forEach((item)=>{
          if(item.type === 3) {
            let param = new URLSearchParams();
            param.append("enclosure_id", item.contract_id);
            this.$http.post("/index.php/Mobile/approval/look_enclosure", param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                let arr = []
                res.data.data.picture.forEach((item) => {
                  if(item != '') {
                    arr.push(getAvatar(item))
                  }
                })
                this.img_arr = arr
                this.$set(this.star, 'img_list', arr)
              })
          }
        })
      },
      getFiles(enclosure){
        this.file_arr = []
        if(!enclosure){
          return
        }
        enclosure.forEach((item)=>{
          if(item.type === 4) {
            let param = new URLSearchParams();
            param.append("attachments_id", item.contract_id);
            this.$http.post("/index.php/Mobile/approval/look_attachments", param)
              .then((res) => {
                var current = this
                var judge = res.data.code
                getCro(judge,current)
                let obj = {}
                let file_data = res.data.data
                let file_add = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name +'.'+file_data.attribute
                obj.name = file_data.file_name+'.'+file_data.attribute
                obj.address = file_add
                this.file_arr.push(obj)
              })
          }
        })
      },
      _getPublishList(res){
		    let param = new URLSearchParams()
        param.append("uid",this.user.uid)
        param.append("company_id",this.nowCompanyId)
        param.append("look_uid",res)
        param.append("p",this.pageIndex)
        param.append("each",'10')
        param.append("type","1")
        this.$http.post("/index.php/Mobile/company/personnel_publish_list",param)
          .then((res)=>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            let arr = []
            res.data.data.forEach((item) => {
              item.avatar='http://bbsf-file.hzxb.net/' + item.avatar
              let time = item.start_time
              var date = new Date();
              var show_day=new Array('星期一','星期二','星期三','星期四','星期五','星期六','星期日');
              date.setTime(time * 1000);
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              var d = date.getDate();
              var day=date.getDay();
              d = d < 10 ? ('0' + d) : d;
              item.start_time = y+'年'+m +'月'+d+'日'+' '+show_day[day-1]
              item.reviewer_fraction=item.reviewer_fraction.toString()
              item.cc = JSON.parse(item.cc)
              let sdf = item.cc
              var str = ''
              var acv = []
              var acb = []
              sdf.forEach((sr)=>{
                if(sr.type == 3){
                  str = '全公司'
                }
                if(sr.type == 2){
                  acv.push(sr.id)
                }
                if(sr.type == 1){
                  acb.push(sr.id)
                }
              })
              if(str == ''){
                this.c_all = ''
              }else{
                this.c_all = str
              }
              if(acv.length == 0){
                this.c_department = ''
              }else{
                this.c_department = acv.length + '个部门'
              }
              if(acb.length == 0){
                this.c_person = ''
              }else{
                this.c_person = acb.length + '个同事'
              }
              this.$set(item,'cc_detail')
              this.$set(item,'del')
              this.$set(item,'cc_per')
              item.del = this.user.uid
              let ss = this.c_all + this.c_department + this.c_person
              item.cc_detail = ss
              arr.push(item)
            })
            this.untreated = arr
            this.untreated.forEach((item)=>{
              var ins = item.custom_form_elements
              ins.forEach((item)=>{
                item.result = item.result.replace(/[\n]/g,"<br />")
              })
            })
            if(arr.length < 10) {
              this.nextPageShow = false
            }
          })
      },
			_getComPersonList() {
				let newparam = new URLSearchParams();
				newparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index.php/Mobile/user/get_company_personnel", newparam)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						let reaDa = []
						res.data.data.forEach((item) => {
							item.avatar = getAvatar(item.avatar)
							reaDa.push(item)
						})
						this.setComPersonList(reaDa)
					})
			},
			_getUserCompanyList() {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				this.$http.post("/index.php/Mobile/user/companies_list", param)
					.then((res) => {
            var current = this
            var judge = res.data.code
            getCro(judge,current)
						this.setCompanyList(res.data.data)
					})
			},
      _getCompanyUserInfo(){
			  let nparam = new URLSearchParams()
        nparam.append("personnel_id",this.personnel_id)
        this.$http.post("/index.php/Mobile/user/get_company_user_info",nparam)
          .then((res) =>{
            var current = this
            var judge = res.data.code
            getCro(judge,current)
            let con = res.data.data
            con.avatar = 'http://bbsf-file.hzxb.net/' + con.avatar
            this.infoArr = con
          })
      },
      mask(se){
        let box = this.$refs.cc_pers
        box.forEach((res)=>{
          if(res.pub == se){
            if(res.happen == false){
              res.happen = true
              res.ts()
              this.view = se
            }else{
              res.happen = false
              this.view = ''
            }
          }else{
            res.happen = false
          }
        })
      },
      masked(se){
        let box = this.$refs.cc_persd
        if(box.happen == false){
          box.happen = true
          box.ts()
          this.view = se
        }else{
          box.happen = false
          this.view = ''
        }
      },
      asShow(){
        this.addShow = false
        this.wideShow = false
        this.inde = 10
        this.plan = []
      },
      asShowed(){
        this.addShow = false
        this.wideShow = false
        this.inde = 0
        document.body.style.overflow = 'visible'
      },
      asWhat(pr){
        this.addShow = false
        if(pr == '点评'){
          this.sendedShow = true
        }
        if(pr == '回复'){
          this.sendShow = true
        }
      },
      close_pp(){
        this.wideShow = false
        this.show_pic = false
        this.$refs.img.src = ''
        document.body.style.overflow = 'visible'
      },
      picShow(es){
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.$refs.wide.style.height = h + 'px'
        this.$refs.pic.style.height = h + 'px'
        this.wideShow = true
        this.show_pic = true
        var str = ''
        str = es.split('?')
        this.$refs.img.src = str[0]
        document.body.style.overflow = 'hidden'
      },
      sign(per){
        this.address_book_show = false
        this.details_show = false
        this.signShow = true
        this.$refs.sign._getSign(per)
      },
      _return(){
        this.address_book_show = true
        this.details_show = false
      },
			...mapMutations({
				setUser: 'SET_USER',
				setNowCompanyId: 'SET_NOWCOMPANY_ID',
				setComPersonList: 'SET_COM_PERSON_LIST',
				setComDepartList: 'SET_COM_DEPART_LIST',
				setComPartPersonList: 'SET_COM_PART_PERSON_LIST',
				setNowCompanyName: 'SET_NOWCOMPANY_NAME',
				setToken: 'SET_TOKEN',
				setUserState: 'SET_USERSTATE',
				setCompanyList: 'SET_COMPANYLIST',
			})
		},
		created() {
			this.setNowCompanyId(JSON.parse(localStorage.nowCompanyId))
			this._getUserCompanyList()
			this._getComPersonList()
      this._getComment()
      if(!localStorage.user){
        this.$router.push({ path: '/login' })
      }
		},
    mounted(){
      if(this.$route.path === '/work/addressBook') {
        this.$emit('changeWorkIndex', 8)
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        this.$refs.wide.style.height = h + 'px'
      }
    },
      components:{
        browsePic,
        loading,
        browe,
        cc_per,
        sign
      },

		watch: {
      pageIndex() {
        this._getPublishList()
      },
			nowCompanyId() {
				this._getComPersonList()
			},
      file_time(){
        if(this.picArr.length != 0) {
          if(this.pic_time === 0) {
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0) {
          let param = new URLSearchParams();
          if(this.sendShow == true){
            param.append('uid',this.user.uid)
            param.append('publish_id',this.pub)
            param.append('content',this.content)
            param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
            if(this.parent_id){
              param.append('parent_id',this.parent_id)
            }
            this.$http.post('/index.php/Mobile/company/user_comment',param)
              .then((res)=>{
                this.loadingShow = false
                if(res.data.code === 0) {
                  this.add_ok()
                  this.loading_show = false
                  this.sendShow = false
                  this.wideShow = false
                  this.likeArr.splice(0,this.likeArr.length)
                  this.comArr.splice(0,this.comArr.length)
                  if(this.moreShow == true){
                    this._getComment()
                    this._likeList()
                    this._getMoreInfo()
                  }
                  document.body.style.overflow = 'visible'
                } else {
                  this.add_fail()
                }
              })
          }else{
            param.append('uid',this.user.uid)
            param.append('reviewer_fraction',this.ras)
            param.append('remarks',this.content)
            param.append('log_id',this.log_id)
            param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
            this.$http.post('/index.php/Mobile/company/user_reviewer',param)
              .then((res)=>{
                this.loadingShow = false
                if(res.data.code === 0) {
                  this.add_ok()
                  this.loading_show = false
                  this.sendedShow = false
                  this.wideShow = false
                  this.likeArr.splice(0,this.likeArr.length)
                  this.comArr.splice(0,this.comArr.length)
                  if(this.moreShow == true){
                    this._getComment()
                    this._likeList()
                    this._getMoreInfo()
                  }
                  document.body.style.overflow = 'visible'
                } else {
                  this.add_fail()
                }
              })
          }
        }
      },
      pic_time(){
        if(this.fileArr.length != 0) {
          if(this.file_time === 0) {
            return
          }
        }
        if(this.file_time != 0 || this.pic_time != 0) {
          let param = new URLSearchParams();
          if(this.sendShow == true){
            param.append('uid',this.user.uid)
            param.append('publish_id',this.pub)
            param.append('content',this.content)
            param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
            if(this.parent_id){
              param.append('parent_id',this.parent_id)
            }
            this.$http.post('/index.php/Mobile/company/user_comment',param)
              .then((res)=>{
                this.loadingShow = false
                if(res.data.code === 0) {
                  this.add_ok()
                  this.loading_show = false
                  this.sendShow = false
                  this.wideShow = false
                  this.likeArr.splice(0,this.likeArr.length)
                  this.comArr.splice(0,this.comArr.length)
                  if(this.moreShow == true){
                    this._getComment()
                    this._likeList()
                    this._getMoreInfo()
                  }
                  document.body.style.overflow = 'visible'
                } else {
                  this.add_fail()
                }
              })
          }else{
            param.append('uid',this.user.uid)
            param.append('reviewer_fraction',this.ras)
            param.append('remarks',this.content)
            param.append('log_id',this.log_id)
            param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
            this.$http.post('/index.php/Mobile/company/user_reviewer',param)
              .then((res)=>{
                this.loadingShow = false
                if(res.data.code === 0) {
                  this.add_ok()
                  this.loading_show = false
                  this.sendedShow = false
                  this.wideShow = false
                  this.likeArr.splice(0,this.likeArr.length)
                  this.comArr.splice(0,this.comArr.length)
                  if(this.moreShow == true){
                    this._getComment()
                    this._likeList()
                    this._getMoreInfo()
                  }
                  document.body.style.overflow = 'visible'
                } else {
                  this.add_fail()
                }
              })
          }
        }
      }
		}
	}
</script>

<style lang="scss">
	.address_book {
		background: #FFFFFF;
		box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
		>ul {
			padding: 10px;
			>li {
				cursor: default;
				display: block;
				border-bottom: 1px solid #DDDDDD;
				font-size: 14px;
				transition: .3s;
				.el-button.is-round {
					padding: 5px 10px;
				}
				>.lzz {
					font-weight: 700;
					font-size: 15px;
					text-indent: 2px;
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
  .book_details{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    .top{
      .btn{
        margin: 20px;
      }
     .title{
        display: block;
        text-align: center;
        font-size: 20px;
      }
    }
    .main{
      img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: block;
        margin: 20px auto;
      }
      p{
        text-align: center;
        font-size: 18px;
      }
    }
    .bottom{
      width: 50%;
      margin: 0 auto;
      .tel{
        margin: 20px 0;
        overflow: hidden;
        h4{
          margin-bottom: 10px;
          overflow: hidden;

          p{
            width: 100px;
            float: left;
            text-align: left;
          }
          span{
            float: right;
            width: 200px;
            text-align: right;
          }
        }
      }
      .work{
        margin: 20px 0;
        overflow: hidden;
        h4{
          margin-bottom: 10px;
          overflow: hidden;
          cursor: pointer;
          p{
            width: 100px;
            float: left;
            text-align: left;
          }
          span{
            float: right;
            width: 200px;
            text-align: right;
          }
        }
      }
    }
  }
  .publish{
    width: 100%;
    overflow: hidden;
    .top{
      background: #FFFFFF;
      .btn{
        margin: 20px;
      }
      .title{
        display: block;
        text-align: center;
        font-size: 20px;
        padding-bottom: 10px;
      }
    }
    .list{
      width: 100%;
      ul{
        list-style: none;
        margin-top: 5px;
        background: #D8D8D8;
        overflow: hidden;
        li{
          background: #ffffff;
          margin-bottom: 5px;
          /*margin-top: 10px;*/
          overflow: hidden;
          box-shadow: 0 0 2px rgba(0, 0, 0, .2);
          -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
          .main{
            overflow: hidden;
            .avatar{
              width: 80px;
              height: 80px;
              margin-left: 15px;
              margin-top: 15px;
              float: left;
              border-radius: 100%;
             img{
               width: 80px;
               height: 80px;
               border-radius: 100%;
             }
            }
            .name{
              float: left;
              span{
                display: block;
                font-size: 20px;
                margin-top: 15px;
                margin-left: 15px;
              }
              .add_time{
                font-size: 18px;
              }
            }
            .stauts{
              width: 150px;
              float: right;
              overflow: hidden;
              margin-top: 15px;
              span{

              }
            }
          }
          .cc{
            .cs {
              display: inline-block;
              border: 1px solid #74c3ff;
              border-radius: 10px;
              padding: 8px 0;
              margin: 5px 0px 5px 15px;
              cursor: pointer;
              position: relative;
              span {
                text-align: center;
                padding: 0 9px;
                color: #74c3ff;
              }
              .cc_per{
                position: absolute;
                width: 250px;
                height: 200px;
                left: 95px;
                top: -40px;
                z-index: 9999;
                overflow: auto;
                border: 1px solid #DDDDDD;
                background: #DDDDDD;
                ul{
                  margin-top: 0px !important;
                  >li{
                    cursor: default;
                    display: block;
                    border-bottom: 1px solid #DDDDDD;
                    font-size: 14px;
                    transition: .3s;
                    box-shadow: none !important;
                    margin-bottom: 0px !important;
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
                    .avatar {
                      vertical-align: top;
                      width: 40px;
                      float: left;
                      margin-left: 10px;
                      img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                      }
                    }
                    .name {
                      float: left;
                      width: 150px;
                      height: 40px;
                      text-align: center;
                      line-height: 40px;
                      span{
                        color: black;
                      }
                    }
                  }
                }
              }
            }
          }
          .bottom{
            .time{
              font-size: 18px;
              margin-left: 20px;
              padding: 5px 0;
              color: #686868;
            }
            p{
              color: #686868;
              margin-left: 15px;
              span{
                margin-top: 5px;
                display: block;
                font-size: 16px;
              }
            }
            ul{
              margin-top: 0;
              background: #ffffff;
              li{
                margin-top: 5px;
                box-shadow: none;
                margin-bottom: 0;
              }
            }
          }
          .share {
            margin-top: 15px;
            background: #f5f7fd;
            padding-top: 10px;
            padding-bottom: 10px;
            overflow: hidden;
            .right {
              width: 350px;
              float: right;
              display: flex;
              display: -webkit-flex;
              span {
                flex-grow: 1;
                display: inline-block;
                cursor: pointer;
                text-align: center;
              }
            }
          }
        }
      }
      .page{
        padding: 4px;
        text-align: center;
        background: #FFFFFF;
        margin-bottom: 10px;
        span {
          cursor: pointer;
          font-size: 12px;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }
  .more{
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    margin-bottom: 100px;
    .top{
      .btn{
        margin: 20px;
      }
      .title{
        display: block;
        text-align: center;
        font-size: 20px;
      }
    }
    .main{
      overflow: hidden;
      .avatar {
        width: 80px;
        height: 80px;
        margin-left: 15px;
        margin-top: 15px;
        float: left;
        img {
          width: 80px;
          height: 80px;
          border-radius: 100%;
        }
      }
      .name{
        float: left;
        span{
          display: block;
          font-size: 20px;
          margin-top: 15px;
          margin-left: 15px;
        }
        .add_time{
          font-size: 18px;
        }
      }
      .stauts{
        width: 150px;
        float: right;
        overflow: hidden;
        margin-top: 15px;
      }
    }
    .cc{
      .cs {
        display: inline-block;
        border: 1px solid #74c3ff;
        border-radius: 10px;
        padding: 8px 0;
        margin: 5px 0px 5px 15px;
        cursor: pointer;
        position: relative;
        span {
          text-align: center;
          padding: 0 9px;
          color: #74c3ff;
        }
        .cc_pers{
          position: absolute;
          width: 250px;
          height: 200px;
          left: 95px;
          top: -40px;
          z-index: 9999;
          overflow: auto;
          border: 1px solid #DDDDDD;
          background: #DDDDDD;
          ul{
            margin-top: 0px !important;
            >li{
              cursor: default;
              display: block;
              border-bottom: 1px solid #DDDDDD;
              font-size: 14px;
              transition: .3s;
              box-shadow: none !important;
              overflow: hidden;
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
              .avatar {
                vertical-align: top;
                width: 40px;
                float: left;
                margin-left: 10px;
                img {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                }
              }
              .name {
                float: left;
                width: 150px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                span{
                  color: black;
                }
              }
            }
          }
        }
      }
    }
    .bottom{
      .time{
        font-size: 18px;
        margin-left: 20px;
        padding: 5px 0;
        color: #686868;
      }
      p{
        color: #686868;
        margin-left: 15px;
        span{
          margin-top: 5px;
          display: block;
          font-size: 16px;
        }
      }
      ul{
        margin-top: 0;
        background: #ffffff;
        li{
          margin-top: 5px;
          box-shadow: none;
          margin-bottom: 0;
        }
      }
    }
    .ques{
      text-align: center;
      background: #eeeeee;
      width: 95%;
      margin: 10px auto;
      line-height: 23px;
      overflow: hidden;
      border-radius: 10px;
      >div{
        margin: 10px 0;
        p{
          color: #686868;
        }
      }
    }
    .imgList{
      margin-left: 15px;
      margin-top: 15px;
      overflow: hidden;
      span{
        color: #686868;
        display: block;
        float: left;
      }
      a{
        display: inline-block;
        margin-left: 5px;
      }
    }
    .file{
      margin-left: 15px;
      margin-top: 15px;
      overflow: hidden;
      span{
        color: #686868;
        display: block;
        float: left;
      }
      a{
        font-size: 14px;
        margin: 4px auto;
        display: block;
        height: 24px;
        width: 80%;
        line-height: 24px;
        color: #5A5E66;
        border: 1px solid #F9F9F9;
        border-radius: 4px;
        background: #DDDDDD;
        text-align: center;
        margin-left: 80px;
      }
    }
    .tab{
      margin-top: 5px;
      .el-tabs__nav{
        margin-left: 15px;
      }
      .el-tab-pane{
        margin-left: 15px;
      }
    }
    .comment{
      li{
        overflow: hidden;
        padding-bottom: 20px;
        border-bottom: 1px solid #707070;
        .avatar {
          width: 60px;
          height: 60px;
          margin-left: 15px;
          margin-top: 15px;
          float: left;
          img {
            width: 60px;
            height: 60px;
            border-radius: 100%;
          }
        }
        .name{
          float: left;
          margin-top: 5px;
          span{
            display: block;
            font-size: 18px;
            margin-top: 10px;
            margin-left: 15px;
            .reply{
              display: inline;
            }
          }
          .add_time{
            font-size: 16px;
          }
        }
        .huihui{
          display: inline-block;
          float: right;
          margin-right: 50px;
          margin-top: 50px;
          font-size: 23px;
          cursor: pointer;
        }
        .fuj{
          width: 100%;
          float: left;
          >div{
            overflow: hidden;
            margin-top: 10px;
            span{
              display: block;
              float: left;
              img{
                margin-left: 5px;
              }
            }
            .filess{
              font-size: 14px;
              margin: 4px auto;
              display: block;
              height: 24px;
              width: 80%;
              line-height: 24px;
              color: #5A5E66;
              border: 1px solid #F9F9F9;
              border-radius: 4px;
              background: #DDDDDD;
              text-align: center;
              margin-left: 80px;
            }
          }
        }
      }
    }
    .like{
      li{
        overflow: hidden;
        p{
          margin-left: 15px;
          overflow: hidden;
          width: 400px;
          float: left;
          img{
            width: 45px;
            height: 45px;
            border-radius: 100%;
            float: left;
          }
          span{
            display: inline-block;
            margin-left: 10px;
            margin-top: 13px;
          }
        }
        .add_time{
          display: inline-block;
          margin-top: 13px;
        }
      }
    }
    .menu{
      background: #f5f7fd;
      border-top: 1px solid #ffffff;
      display: flex;
      display: -webkit-flex;
      span{
        flex-grow: 1;
        padding: 10px 0;
        display: inline-block;
        text-align: center;
        font-size: 17px;
        cursor: pointer;
      }
    }
  }
  .send{
    width: 450px;
    background: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -270px;
    margin-top: -75px;
    z-index: 999;
    .close{
      display: block;
      width: 100%;
      overflow: hidden;
      text-align: center;
      .huifu{
        line-height: 53px;
        font-size: 16px;
      }
      i{
        float: right;
        font-size: 16px;
        margin: 20px 10px 0;
        cursor: pointer;
        border-radius: 100%;
        border: 1px solid black;
        color: #000;
      }
    }
    .el-textarea{
      display: block;
      width: 90%;
      margin: 0 auto;
    }
    .sr{
      overflow: hidden;
      display: block;
      margin-top: 10px;
      padding-bottom: 10px;
      #picc{
        position: relative;
        width: 70%;
        .el-upload-list__item{
          position: relative;
          top: 30px;
          left: 15px;
          width: 50px;
          height: 50px;
        }
        .el-upload{
          display: block;
        }
        .el-upload--picture-card{
          z-index: 999;
          position: absolute;
          left: 3px;
          top: 0px;
          width: 0px;
          height: 0px;
          margin-top: 12px;
          margin-left: 27px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
            z-index: 999;
          }
        }
      }
      #file{
        width: 70%;
        position: relative;
        .el-upload-list--text{
          position: relative;
          top: 0px;
          left: 15px;
          width: 100%;
        }
        .el-upload--text{
          width: 0px;
          height: 0px;
          margin-top: 40px;
          margin-left: 30px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
          }
        }
      }
      .el-button{
        padding: 4px 10px;
        float: right;
        margin-right: 20px;
        margin-top: 14px;
      }
    }
  }
  .wide{
    width: 100%;
    z-index: 99;
    /*height: 3000px;*/
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
  }
  .add{
    z-index: 999;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -100px;
    ul {
      width: 200px;
      background: #FFFFFF;
      margin: 200px auto;
      padding: 10px;
      border-radius: 4px;
      h2 {
        display: inline-block;
        margin-bottom: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      i {
        font-size: 20px;
        float: right;
        cursor: pointer;
        &:hover {
          color: #FA5555
        }
      }
      li {
        cursor: pointer;
        display: block;
        height: 24px;
        line-height: 24px;
        font-size: 15px;
        &:hover {
          color: #5A5E66;
        }
      }
    }
  }
  .sended{
    width: 450px;
    background: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -270px;
    margin-top: -75px;
    z-index: 999;
    .close{
      display: block;
      width: 100%;
      overflow: hidden;
      .huifu{
        line-height: 53px;
        font-size: 16px;
        margin-left: 50px;
      }
      i{
        float: right;
        font-size: 16px;
        margin: 20px 10px 0;
        cursor: pointer;
        border-radius: 100%;
        border: 1px solid black;
        color: #000;
      }
      .el-rate{
        width: 150px;
        float: left;
        line-height: 53px;
        text-align: center;
        .el-rate__item{
          line-height: 0px;
          margin: 0;
          i{
            margin: 3px;
            border: none;
            font-size: 18px;
          }
        }
      }
    }
    .el-textarea{
      display: block;
      width: 90%;
      margin: 0 auto;
    }
    .sr{
      overflow: hidden;
      display: block;
      margin-top: 10px;
      padding-bottom: 10px;
      #picc{
        position: relative;
        width: 70%;
        .el-upload-list__item{
          position: relative;
          top: 30px;
          left: 15px;
          width: 50px;
          height: 50px;
        }
        .el-upload{
          display: block;
        }
        .el-upload--picture-card{
          z-index: 999;
          position: absolute;
          left: 3px;
          top: 0px;
          width: 0px;
          height: 0px;
          margin-top: 12px;
          margin-left: 27px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
            z-index: 999;
          }
        }
      }
      #file{
        width: 70%;
        position: relative;
        .el-upload-list--text{
          position: relative;
          top: 0px;
          left: 15px;
          width: 100%;
        }
        .el-upload--text{
          width: 0px;
          height: 0px;
          margin-top: 40px;
          margin-left: 30px;
          outline: none;
          background: none;
          border: none;
          border-radius: 0;
          line-height: 0;
          i{
            font-size: 20px;
          }
        }
      }
      .el-button{
        padding: 4px 10px;
        float: right;
        margin-right: 20px;
        margin-top: 14px;
      }
    }
  }
</style>
