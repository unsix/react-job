<template>
	<div class="everyday_wrapper">
		<div class="everyday">
			<div class="postLog">
				<div class="state" v-show="stateShow" @click="stateShow = !stateShow">
					<i class="fa fa-edit"></i>
					<span>填写工作日志...</span>
				</div>
				<div v-show="!stateShow">
					<div class="text">
						<div>
							<span>请填写本{{dayType}}工作总结<i class="fa fa-close" @click="stateShow = !stateShow"></i></span>
							<textarea v-model="todayTxt"></textarea>
						</div>
						<div>
							<span>请填写明{{dayType}}工作计划</span>
							<textarea v-model="tomorrowTxt"></textarea>
						</div>
						<div>
							<span>请填写工作心得体会</span>
							<textarea v-model="workExp"></textarea>
						</div>
					</div>
					<div class="opera">
						<el-upload class="upload-demo" multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
							<i class="fa fa-picture-o"></i>
							<i class="fa fa-paperclip"></i>
						</el-upload>
					</div>
					<div class="choosePanel">
						<div class="top">
							<span v-for="(item,index) in chooseDayList" :class="{'active':currentIndex === index}" @click="chooseDay(item,index)">
								{{item}}
							</span>
						</div>
						<div class="info1" v-show="info1Show">
							<div>
								<span>时间：</span>
								<el-date-picker v-model="time1" type="date" placeholder="选择日期" @change="chooseTime">
								</el-date-picker>
								<span class="retroactive" v-show="time1 != nowTime">补签</span>
							</div>
							<div>
								<span>点评人：</span>
								<el-form>
									<el-select v-model="people" placeholder="选择点评人">
										<el-option :label="item.name" :value="item.name" v-for="(item,index) in comPersonList" :key="index"></el-option>
									</el-select>
									</el-form-item>
								</el-form>
							</div>
						</div>
						<div class="info2" v-show="info2Show">
							<div>
								<span>时间：</span>
								<el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
							</div>
							<div>
								<span>点评人：</span>
								<el-form>
									<el-select v-model="people" placeholder="选择点评人">
										<el-option :label="item.name" :value="item.name" v-for="(item,index) in comPersonList" :key="index"></el-option>
									</el-select>
									</el-form-item>
								</el-form>
							</div>
						</div>
						<div class="info3" v-show="info3Show">
							<div>
								<span>时间：</span>
								<el-date-picker type="month" placeholder="选择月">
								</el-date-picker>
							</div>
							<div>
								<span>点评人：</span>
								<el-form>
									<el-select v-model="people" placeholder="选择点评人">
										<el-option :label="item.name" :value="item.name" v-for="(item,index) in comPersonList" :key="index"></el-option>
									</el-select>
									</el-form-item>
								</el-form>
							</div>
						</div>
					</div>
					<div class="ccRange">
						<span>刘忠哲<i class="fa fa-close"></i></span>
						<div class="choose" @click="chooseRange">
							<i class="fa fa-plus"></i>
							<span>选择抄送范围</span>
						</div>
					</div>
					<div class="ccForm" v-show="ccFormShow">
						<div class="nav">
							<span v-for="(item,index) in navGroup" :class="{'active':navIndex === index}" @click="navClick(index)">{{item}}</span>
						</div>
						<div class="chooseColleague" v-show="chooseColleagueShow">
							<el-checkbox-group v-model="checkPersonList">
								<el-checkbox :label="item.name" v-for="(item,index) in comPersonList"></el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="chooseDepartment" v-show="!chooseColleagueShow">
							<el-checkbox-group v-model="checkDepartList">
								<el-checkbox :label="item.department_name" v-for="(item,index) in comDepartList" :key="index"></el-checkbox>
							</el-checkbox-group>
						</div>
						<div class="button">
							<el-button plain @click="cancelCC">取消</el-button>
							<el-button type="info" @click="resetCC">重置</el-button>
							<el-button type="primary" @click="submitCC">确定</el-button>
						</div>
					</div>
					<div class="posted">
						<el-button type="primary" @click="posted">发布</el-button>
					</div>
				</div>
			</div>
			<div class="logList">
				<ul>
					<li v-for="(item,index) in dayList">
						<div class="info">
							<div class="avatar">
								<img :src="item.avatar" alt="" />
							</div>
							<div class="content">
								<span class="name">{{item.name}}</span>
								<span class="time">发布时间：{{item.add_time}}</span>
							</div>
							<div class="state1" v-show="item.form_type === '1'">
								<i></i>
								<span>日志</span>
							</div>
						</div>
						<div class="content">
							<p style="color: #999999; margin-bottom: 10px; font-size:14px;">{{item.start_time}}<span style="margin-left: 5px;">日计划</span></p>
							<div class="today">
								<p>今日工作总结</p>
								<span>
									{{item.summary_today}}
								</span>
							</div>
							<div class="tomorrow">
								<p>明日工作计划</p>
								<span>
									{{item.tomorrow_plan}}
								</span>
							</div>
							<div class="work_exp">
								<p>工作心得体会</p>
								<span>
									{{item.work_exp}}
								</span>
							</div>
							<div class="file">
								<a :href="list.address" v-for="list in item.fList" target="_blank" class="file">{{list.name}}</a>
							</div>
							<div class="img">
								<a v-for="(list,index) in item.imgList" @click="cl_pic(item,index)">
									<img :src="list" alt="" />
								</a>
							</div>
						</div>
						<div class="opera">
							<div>
								<a @click="comment(item,index)">回复</a>
							</div>
							<div>
								<i class="fa fa-thumbs-up" :class="{'liked':item.like_id}" @click="like(item)"></i>
							</div>
							<div>
								<a>删除</a>
							</div>
							<div>
								<a @click="remark(item,index)">点评</a>
							</div>
						</div>
						<div class="comment" v-show="commentIndex === index">
							<div class="txt">
								<textarea placeholder="添加回复..." v-model="commentTxt"></textarea>
								<div class="opera">
									<el-upload class="upload-demo" multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
										<i class="fa fa-picture-o"></i>
										<i class="fa fa-paperclip"></i>
									</el-upload>
								</div>
							</div>
							<div class="button">
								<el-button type="primary" @click="replyComment(item)">回复</el-button>
								<el-button>取消</el-button>
							</div>
							<div class="commentInfo" v-for="(item,index) in commentInfo">
								<div class="avatar">
									<img src="http://bbsf-file.hzxb.net/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns" alt="" />
								</div>
								<div class="content">
									<span class="name">{{item.name}}:</span>
									<span class="msg">{{item.content}}</span>
									<div class="imgShow">
										<img :src="list" v-for="(list,index) in item.iList" @click="commentPic(item,index)" />
									</div>
									<div class="fileShow">
										<a :href="list.address" v-for="(list,index) in item.fList" target="_blank" class="file">{{list.name}}</a>
									</div>
									<div class="time">
										<span>{{item.add_time}}</span>
										<a>回复</a>
									</div>

								</div>
							</div>
						</div>
						<div class="remark" v-show="remarkIndex === index">
							<div class="txt">
								<textarea placeholder="添加回复..." v-model="remarkTxt"></textarea>
								<div class="opera">
									<el-upload class="upload-demo" multiple action="https://up.qbox.me/" :on-change="handlePreview" :on-remove="handleRemove" :file-list="remarkFileList" :auto-upload="false">
										<i class="fa fa-picture-o"></i>
										<i class="fa fa-paperclip"></i>
									</el-upload>
								</div>
							</div>
							<div class="button">
								<el-button type="primary" @click="replyComment(item)">回复</el-button>
								<el-button>取消</el-button>
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
		<browsePic :pic_index="pic_index" :img_arr="img_arr" :pic_show="pic_show" @left="last_one" @right="next_one" @close_pic="close_pic"></browsePic>
		<loading v-show="loadingShow"></loading>
	</div>
</template>

<script>
	import browsePic from '@/base/browse_pic/browse_pic'
	import loading from '@/base/loading/loading'
	import { create_depart_list } from 'common/js/initial/depart.js'
	import { createDayList } from '@/common/js/day.js'
	import { creaetCommentList } from '@/common/js/comment.js'
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				pageIndex: 1,
				dayList: [],
				chooseDayList: ['日计划', '周计划', '月计划'],
				navGroup: ['同事', '部门'],
				currentIndex: 0,
				people: '',
				time1: '',
				nowTime: '',
				info1Show: true,
				info2Show: false,
				info3Show: false,
				ccFormShow: false,
				dayType: '日',
				navIndex: 0,
				checkPersonList: [],
				checkDepartList: [],
				commentIndex: -1,
				remarkIndex: -1,
				todayTxt: '',
				tomorrowTxt: '',
				workExp: '',
				chooseColleagueShow: true,
				ccArr: [],
				stateShow: true,
				commentTxt: '',
				postData: {
					token: ''
				},
				fileHeaders: {
					'Content-Type': 'multipart/form-data'
				},
				fileList: [],
				remarkFileList: [],
				pic_hash_arr: [],
				picArr: [],
				fileArr: [],
				afile_hash_arr: [],
				file_hash_arr: [],
				pic_index: 0,
				pic_time: 0,
				file_time: 0,
				nowpublishId: 0,
				nowDoWhat: '发布日志',
				file_arr: [],
				img_arr: [],
				pic_show: false,
				loadingShow: false,
				pageIndex: 1,
				nextPageShow: true,
				commentInfo: [],
				remarkTxt: ''

			}
		},
		computed: {
			...mapGetters([
				'token',
				'user',
				'nowCompanyId',
				'comPersonList',
				'comDepartList'
			])
		},
		components: {
			browsePic,
			loading
		},
		methods: {
			like(item) {

				let type
				if(item.like_id) {
					item.like_id = null
					type = 2
				} else {
					item.like_id = null - 1
					type = 1
				}
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("publish_id", item.publish_id);
				param.append("type", type);
				this.$http.post("/index/Mobile/company/like_company_log", param)
					.then((res) => {
						if(res.data.code === 0) {
							if(type = 2) {
								this.$message({
									message: '取消点赞成功！',
									type: 'success'
								});
							} else {
								this.$message({
									message: '点赞成功！',
									type: 'success'
								});
							}

						} else {
							this.$message.error('点赞失败');
						}
					})
			},
			commentPic(item, index) {
				this.img_arr = item.iList
				this.pic_index = index
				this.pic_show = true
			},
			cl_pic(item, index) {
				this.img_arr = item.imgList
				this.pic_index = index
				this.pic_show = true
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
			close_pic() {
				this.pic_show = false
			},
			last_one() {
				if(this.pic_index === 0) {
					return
				}
				--this.pic_index
			},
			next_one() {
				if(this.pic_index === this.img_arr.length - 1) {
					return
				}
				++this.pic_index
			},
			getFile(enclosure, index) {
				if(!enclosure) {
					return
				}
				let farr = []
				enclosure.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_enclosure", param)
							.then((res) => {
								let arr = []
								res.data.data.picture.forEach((item) => {
									if(item != '') {
										arr.push('http://bbsf-file.hzxb.net/' + item)
									}
								})
								this.$set(this.dayList[index], 'imgList', arr)
							})
					} else if(item.type === 4) {
						let param = new URLSearchParams();
						param.append("attachments_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_attachments", param)
							.then((res) => {
								let obj = {}
								let file_data = res.data.data
								obj.name = file_data.file_name
								obj.address = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name + file_data.attribute
								farr.push(obj)
								this.$set(this.dayList[index], 'fList', farr)

							})
					}
				})
			},
			getCommentFile(enclosure, index) {
				console.log()
				if(!enclosure) {
					return
				}
				let farr = []
				enclosure.forEach((item) => {
					if(item.type === 3) {
						let param = new URLSearchParams();
						param.append("enclosure_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_enclosure", param)
							.then((res) => {
								let arr = []
								res.data.data.picture.forEach((item) => {
									if(item != '') {
										arr.push('http://bbsf-file.hzxb.net/' + item)
									}
								})
								this.$set(this.commentInfo[index], 'iList', arr)
							})
					} else if(item.type === 4) {
						let param = new URLSearchParams();
						param.append("attachments_id", item.contract_id);
						this.$http.post("/index/Mobile/approval/look_attachments", param)
							.then((res) => {
								let obj = {}
								let file_data = res.data.data
								obj.name = file_data.file_name
								obj.address = 'http://bbsf-file.hzxb.net/' + file_data.attachments + '?attname=' + file_data.file_name + file_data.attribute
								farr.push(obj)
								this.$set(this.commentInfo[index], 'fList', farr)
							})
					}
				})
			},
			handleRemove(file, fileList) {
				this.fileList = fileList
			},
			handlePreview(file, fileList) {
				this.fileList = fileList
			},
			chooseTime() {
				let odate = JSON.stringify(this.time1).slice(1, 11)
				let ndate = parseInt(odate.slice(8, 11)) + 1
				if(ndate < 10) {
					let adate = '0' + ndate
					this.time1 = JSON.stringify(this.time1).slice(1, 9) + adate

				} else {
					this.time1 = JSON.stringify(this.time1).slice(1, 9) + ndate
				}

			},
			getNowDate() {
				var date = new Date();
				var seperator1 = "-";
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
				this.nowTime = currentdate
				this.time1 = currentdate
			},
			comment(item, index) {
				this.commentInfo = []
				if(this.commentIndex === index) {
					this.commentIndex = -1
					return
				}
				this.commentIndex = index
				this.getComment(item.publish_id)
			},
			remark(item, index) {
				if(this.remarkIndex === index) {
					this.remarkIndex = -1
					return
				}
				this.remarkIndex = index
			},
			getComment(pid) {
				let param = new URLSearchParams();
				param.append("uid", this.user.uid);
				param.append("company_id", this.nowCompanyId);
				param.append("publish_id", pid);
				this.$http.post("/index/Mobile/company/get_publish_comment", param)
					.then((res) => {
						if(res.data.data.message.length === 0){
							return
						}
						let arr = []
						res.data.data.forEach((item, index) => {
							this.commentInfo.push(item)
							this.getCommentFile(item.enclosure, index)
						})
					})
			},
			replyRemark(item){

			},
			replyComment(item) {
				this.loadingShow = true
				this.nowDoWhat = '评论'
				this.nowpublishId = item.publish_id
				this.picArr = []
				this.fileArr = []
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.pic_time = 0
				this.file_time = 0
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1') {
						this.picArr.push(item)
					} else {
						this.fileArr.push(item)
					}
				})
				setTimeout(() => {
					if(this.picArr.length === 0 && this.fileArr.length === 0) {
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("publish_id", this.nowpublishId);
						param.append("content", this.commentTxt);
						this.$http.post("/index/Mobile/company/user_comment", param)
							.then((res) => {
								console.log(res)
								this.commentTxt = ''
								this.loadingShow = false
								if(res.data.code === 0) {
									this.$message({
										message: '回复成功！',
										type: 'success'
									});
								} else {
									this.$message.error('回复失败');
								}
							})
					}
					if(this.picArr.length != 0) {
						for(let i = 0; i < this.picArr.length; i++) {
							let formData = new FormData();
							formData.append('file', this.picArr[i].raw);
							formData.append('token', this.token);
							let config = {
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
							this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
								this.pic_hash_arr.push(res.data.hash)
								if(this.pic_hash_arr.length === this.picArr.length) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {
											this.afile_hash_arr.push({
												"type": 3,
												"contract_id": res.data.data.enclosure_id,
												"name": this.picArr[i].name
											})
											if(this.afile_hash_arr.length === this.picArr.length) {
												let aDate = Date.parse(new Date())
												this.pic_time = aDate
											}
										})
								}
							})
						}
					}
					if(this.fileArr.length != 0) {
						for(let i = 0; i < this.fileArr.length; i++) {
							let formData = new FormData();
							formData.append('file', this.fileArr[i]);
							formData.append('token', this.token);
							let config = {
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
							this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
								let index = this.fileArr[i].name.indexOf('.')
								let attribute = this.fileArr[i].name.slice(index)
								let file_name = this.fileArr[i].name.slice(0, index)
								let param = new URLSearchParams();
								param.append("uid", this.user.uid);
								param.append("attribute", attribute);
								param.append("attachments", res.data.hash);
								param.append("file_name", this.fileArr[i].name);
								this.$http.post("/index/Mobile/approval/add_attachments", param)
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
						}
					}
				}, 300)

			},
			posted() {
				this.loadingShow = true
				this.nowDoWhat = '发布日志'
				this.picArr = []
				this.fileArr = []
				this.pic_hash_arr = []
				this.afile_hash_arr = []
				this.file_hash_arr = []
				this.pic_time = 0
				this.file_time = 0
				this.fileList.forEach((item) => {
					if(item.name.indexOf('jpg') != '-1' || item.name.indexOf('png') != '-1') {
						this.picArr.push(item)
					} else {
						this.fileArr.push(item)
					}
				})
				setTimeout(() => {
					if(this.picArr.length === 0 && this.fileArr.length === 0) {
						let logType
						if(this.dayType === '日') {
							logType = 1
						} else if(this.dayType === '周') {
							logType = 2
						} else {
							logType = 3
						}
						let reviewerId
						this.comPersonList.forEach((item) => {
							if(item.name === this.people) {
								reviewerId = item.uid
							}
						})
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("company_id", this.nowCompanyId);
						param.append("summary_today", this.todayTxt);
						param.append("tomorrow_plan", this.tomorrowTxt);
						param.append("work_exp", this.workExp);
						param.append("reviewer", reviewerId);
						param.append("json", JSON.stringify(this.ccArr));
						param.append("log_type", 1);
						if(this.time1 === this.nowTime) {
							let save_time = Date.parse(new Date()).toString().slice(0, 10)
							param.append("user_save_time", save_time);
						}
						if(this.time1 != this.nowTime) {
							let date = new Date(Date.parse(this.time1.replace(/-/g, "/"))).getTime()
							let save_time = date.toString().slice(0, 10)
							param.append("user_save_time", save_time);
						}
						param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
						this.$http.post("/index/Mobile/company/publish_log", param)
							.then((res) => {
								this.loadingShow = false
								if(res.data.code === '0') {
									this.getData()
									this.stateShow = true
									this.$message({
										message: '发布日志成功！',
										type: 'success'
									});
								} else {
									this.$message.error('发布日志失败');
								}
							})
					}
					if(this.picArr.length != 0) {
						for(let i = 0; i < this.picArr.length; i++) {
							let formData = new FormData();
							formData.append('file', this.picArr[i].raw);
							formData.append('token', this.token);
							let config = {
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
							this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
								this.pic_hash_arr.push(res.data.hash)
								if(this.pic_hash_arr.length === this.picArr.length) {
									let nparam = new URLSearchParams();
									nparam.append("uid", this.user.uid);
									nparam.append("picture", JSON.stringify(this.pic_hash_arr));
									this.$http.post("/index/Mobile/approval/upload_enclosure_new", nparam)
										.then((res) => {

											this.afile_hash_arr.push({
												"type": 3,
												"contract_id": res.data.data.enclosure_id,
												"name": this.picArr[i].name
											})

											setTimeout(() => {
												let aDate = Date.parse(new Date())
												this.pic_time = aDate
												console.log(this.pic_time)
											}, 500)

										})
								}
							})
						}
					}
					if(this.fileArr.length != 0) {
						for(let i = 0; i < this.fileArr.length; i++) {
							let formData = new FormData();
							formData.append('file', this.fileArr[i]);
							formData.append('token', this.token);
							let config = {
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}
							this.$http.post('https://up.qbox.me/', formData, config).then((res) => {
								let index = this.fileArr[i].name.indexOf('.')
								let attribute = this.fileArr[i].name.slice(index)
								let file_name = this.fileArr[i].name.slice(0, index)
								let param = new URLSearchParams();
								param.append("uid", this.user.uid);
								param.append("attribute", attribute);
								param.append("attachments", res.data.hash);
								param.append("file_name", this.fileArr[i].name);
								this.$http.post("/index/Mobile/approval/add_attachments", param)
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
						}
					}
				}, 500)

			},
			cancelCC() {
				this.ccFormShow = false
			},
			resetCC() {

			},
			submitCC() {
				this.ccArr = []
				this.ccFormShow = false
				this.checkPersonList.forEach((name) => {
					this.comPersonList.forEach((item) => {
						if(item.name === name) {

							let obj = {}
							obj.id = item.personnel_id
							obj.type = 1
							this.ccArr.push(obj)
						}
					})
				})
				this.checkDepartList.forEach((name) => {
					this.comDepartList.forEach((item) => {
						if(item.department_name === name) {
							let obj = {}
							obj.id = item.department_id
							obj.type = 2
							this.ccArr.push(obj)
						}
					})
				})

			},
			chooseRange() {
				this._getComDepart()
				this.ccFormShow = true
			},
			navClick(index) {
				this.navIndex = index
				if(index === 0) {
					this.chooseColleagueShow = true
				} else {
					this.chooseColleagueShow = false
				}
			},
			chooseDay(item, index) {
				this.currentIndex = index
				this.info1Show = false
				this.info2Show = false
				this.info3Show = false
				if(index === 0) {
					this.info1Show = true
					this.dayType = '日'
				} else if(index === 1) {
					this.info2Show = true
					this.dayType = '周'
				} else if(index === 2) {
					this.info3Show = true
					this.dayType = '月'
				}
			},
			getData() {
				setTimeout(() => {
					let param = new URLSearchParams();
					param.append("uid", this.user.uid);
					param.append("company_id", this.nowCompanyId);
					param.append("each", 5);
					param.append("p", this.pageIndex);
					this.$http.post("/index/Mobile/company/publish_look_two", param)
						.then((res) => {
							let narr = []
							if(res.data.data.length < 8) {
								this.nextPageShow = false
							}

							res.data.data.forEach((item, index) => {
								narr.push(createDayList(item))
								this.getFile(item.enclosure, index)
							})
							this.dayList = narr
							//							this.dayList = narr.reverse()

						})
				}, 1000)
			},
			compare(property) {
				return function(a, b) {
					var value1 = a[property];
					var value2 = b[property];
					return value1 - value2;
				}
			},
			_getComPersonList() {
				let newparam = new URLSearchParams();
				newparam.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_company_personnel", newparam)
					.then((res) => {
						let reaDa = []
						res.data.data.forEach((item) => {
							item.avatar = 'http://bbsf-file.hzxb.net/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
							reaDa.push(item)
						})
						this.setComPersonList(reaDa)

					})
			},
			_getComDepart() {
				let param = new URLSearchParams();
				param.append("company_id", this.nowCompanyId);
				this.$http.post("/index/Mobile/user/get_department_lest", param)
					.then((res) => {
						let arr = []
						res.data.data.forEach((item) => {
							arr.push(create_depart_list(item))
						})
						this.setComDepartList(arr)
					})
			},
			...mapMutations({
				setComDepartList: 'SET_COM_DEPART_LIST',
				setComPersonList: 'SET_COM_PERSON_LIST'
			})
		},
		watch: {
			file_time() {
				if(this.nowDoWhat === '评论') {
					if(this.picArr.length != 0) {
						if(this.pic_time === 0) {
							return
						}
					}
					if(this.file_time != 0 || this.pic_time != 0) {
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("publish_id", this.nowpublishId);
						param.append("content", this.commentTxt);
						param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
						this.$http.post("/index/Mobile/company/user_comment", param)
							.then((res) => {
								this.fileList = []
								console.log(res)
								this.loadingShow = false
								if(res.data.code === 0) {
									this.commentTxt = ''
									this.$message({
										message: '回复成功！',
										type: 'success'
									});
								} else {
									this.$message.error('回复失败');
								}
							})
					}
				}
				if(this.nowDoWhat === '发布日志') {
					if(this.picArr.length != 0) {
						if(this.pic_time === 0) {
							return
						}
					}
					if(this.file_time != 0 || this.pic_time != 0) {
						let logType
						if(this.dayType === '日') {
							logType = 1
						} else if(this.dayType === '周') {
							logType = 2
						} else {
							logType = 3
						}
						let reviewerId
						this.comPersonList.forEach((item) => {
							if(item.name === this.people) {
								reviewerId = item.uid
							}
						})
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("company_id", this.nowCompanyId);
						param.append("summary_today", this.todayTxt);
						param.append("tomorrow_plan", this.tomorrowTxt);
						param.append("work_exp", this.workExp);
						param.append("reviewer", reviewerId);
						param.append("json", JSON.stringify(this.ccArr));
						param.append("log_type", 1);
						if(this.time1 === this.nowTime) {
							let save_time = Date.parse(new Date()).toString().slice(0, 10)
							param.append("user_save_time", save_time);
						}
						if(this.time1 != this.nowTime) {
							let date = new Date(Date.parse(this.time1.replace(/-/g, "/"))).getTime()
							let save_time = date.toString().slice(0, 10)
							param.append("user_save_time", save_time);
						}
						param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
						this.$http.post("/index/Mobile/company/publish_log", param)
							.then((res) => {
								console.log(res)
								this.fileList = []
								this.loadingShow = false
								if(res.data.code === 0) {
									this.getData()
									this.stateShow = true
									this.$message({
										message: '发布日志成功！',
										type: 'success'
									});
								} else {
									this.$message.error('发布日志失败');
								}
							})
					}

				}

			},
			pic_time() {
				if(this.nowDoWhat === '评论') {
					if(this.fileArr.length != 0) {
						if(this.file_time === 0) {
							return
						}
					}
					if(this.file_time != 0 || this.pic_time != 0) {
						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("publish_id", this.nowpublishId);
						param.append("content", this.commentTxt);
						param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
						this.$http.post("/index/Mobile/company/user_comment", param)
							.then((res) => {
								console.log(res)
								this.loadingShow = false
								if(res.data.code === 0) {
									this.$message({
										message: '回复成功！',
										type: 'success'
									});
								} else {
									this.$message.error('回复失败');
								}
							})
					}
				}
				if(this.nowDoWhat === '发布日志') {
					if(this.fileArr.length != 0) {
						if(this.file_time === 0) {
							return
						}
					}
					if(this.file_time != 0 || this.pic_time != 0) {

						let logType
						if(this.dayType === '日') {
							logType = 1
						} else if(this.dayType === '周') {
							logType = 2
						} else {
							logType = 3
						}
						let reviewerId
						this.comPersonList.forEach((item) => {
							if(item.name === this.people) {
								reviewerId = item.uid
							}
						})

						let param = new URLSearchParams();
						param.append("uid", this.user.uid);
						param.append("company_id", this.nowCompanyId);
						param.append("summary_today", this.todayTxt);
						param.append("tomorrow_plan", this.tomorrowTxt);
						param.append("work_exp", this.workExp);
						param.append("reviewer", reviewerId);
						param.append("json", JSON.stringify(this.ccArr));
						param.append("log_type", 1);
						if(this.time1 === this.nowTime) {
							let save_time = Date.parse(new Date()).toString().slice(0, 10)
							param.append("user_save_time", save_time);
						}
						if(this.time1 != this.nowTime) {
							let date = new Date(Date.parse(this.time1.replace(/-/g, "/"))).getTime()
							let save_time = date.toString().slice(0, 10)
							param.append("user_save_time", save_time);
						}
						param.append("enclosure", JSON.stringify([...this.file_hash_arr, ...this.afile_hash_arr]));
						this.$http.post("/index/Mobile/company/publish_log", param)
							.then((res) => {
								console.log(res)
								this.loadingShow = false
								if(res.data.code === 0) {
									this.getData()
									this.stateShow = true
									this.$message({
										message: '发布日志成功！',
										type: 'success'
									});
								} else {
									this.$message.error('发布日志失败');
								}
							})
					}
				}
			},
			pageIndex() {
				this.getData()
			}
		},
		created() {
			this.$set(this.postData, 'token', JSON.parse(localStorage.token))
			this.getData()
			this.getNowDate()
			this._getComPersonList()
		}

	}
</script>

<style lang="scss">
	.everyday_wrapper {
		width: 100%;
		height: 100%;
		font-size: 14px;
		.everyday {
			min-height: 400px;
			>.postLog {
				background: #FFFFff;
				box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
				padding: 10px 25px;
				position: relative;
				>.state {
					font-size: 18px;
					color: #DDDDDD;
					cursor: pointer;
					transition: .2s;
					&:hover {
						color: #999999;
					}
				}
				.ccForm {
					position: absolute;
					z-index: 10;
					left: 150px;
					top: 580px;
					width: 300px;
					height: 450px;
					background: #FFFFFF;
					box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
					>.nav {
						font-size: 14px;
						height: 30px;
						width: 100%;
						cursor: pointer;
						span {
							background: #F9F9F9;
							color: #3487E2;
							display: inline-block;
							width: 50%;
							box-sizing: border-box;
							float: left;
							text-align: center;
							line-height: 30px;
							&.active {
								background: #FFFFFF;
								color: #444444;
							}
						}
					}
					>.chooseColleague {
						padding: 10px 0;
						height: 330px;
						overflow-y: scroll;
					}
					>.chooseDepartment {
						padding: 10px 0;
						height: 330px;
						overflow-y: scroll;
					}
					>.button {
						margin-top: 20px;
						margin-left: 35px;
						.el-button--info {
							margin-left: 20px;
						}
						.el-button+.el-button {
							margin-left: 6px;
						}
					}
					.el-checkbox {
						display: block;
						height: 26px;
						margin-left: 30px;
					}
				}
				.posted {
					margin-top: 10px;
					margin-left: 480px;
				}
				.ccRange {
					margin-top: 10px;
					border: 1px solid #DDDDDD;
					padding: 8px;
					>.choose {
						cursor: pointer;
						font-size: 13px;
						display: inline-block;
						color: #3487E2;
					}
					>span {
						margin: 0 8px 4px 0;
						display: inline-block;
						padding: 4px 10px;
						background: #3D83E9;
						border-radius: 10px;
						color: #FFF;
						cursor: pointer;
						>i {
							margin-left: 4px;
							font-size: 14px;
						}
					}
				}
				.choosePanel {
					margin-top: 20px;
					height: 150px;
					border: 1px solid #ddd;
					background: #f9f9f9;
					>.info1 {
						>div {
							padding: 10px;
							>span {
								display: inline-block;
								text-indent: 5px;
								width: 70px;
								color: #999;
								font-size: 12px;
							}
							>form {
								display: inline-block;
							}
							>.retroactive {
								display: inline-block;
								width: 34px;
								height: 18px;
								line-height: 18px;
								text-align: center;
								-webkit-border-radius: 29px;
								border-radius: 29px;
								text-indent: 0;
								background-color: #fff9f2;
								border: 1px solid #ffc787;
								color: #f09835;
							}
						}
					}
					>.info2 {
						>div {
							padding: 10px;
							>span {
								display: inline-block;
								text-indent: 5px;
								width: 70px;
								color: #999;
								font-size: 12px;
							}
							>form {
								display: inline-block;
							}
						}
					}
					>.info3 {
						>div {
							padding: 10px;
							>span {
								display: inline-block;
								text-indent: 5px;
								width: 70px;
								color: #999;
								font-size: 12px;
							}
							>form {
								display: inline-block;
							}
						}
					}
					>.top {
						height: 30px;
						background: #FFFFFF;
						>span {
							cursor: pointer;
							width: 60px;
							text-align: center;
							display: inline-block;
							height: 30px;
							line-height: 30px;
							font-size: 12px;
							color: #0082CB;
							&.active {
								background: #f9f9f9;
								color: #000000;
								font-weight: 700;
							}
						}
					}
				}
				.opera {
					text-align: left;
					background: #F9F9F9;
					border: 1px solid #ddd;
					border-top: none;
					.el-upload {
						outline: none;
					}
					i {
						cursor: pointer;
						font-size: 16px;
						margin: 10px;
						margint: 10px;
					}
				}
				.title {
					font-size: 14px;
				}
				.text {
					padding: 0 10px 46px;
					border: 1px solid #ddd;
					border-bottom: none;
					>div {
						margin-top: 8px;
						>span {
							color: #999;
							display: block;
							>i {
								cursor: pointer;
								padding: 2px;
								float: right;
								color: #CCCCCC;
								&:hover {
									color: #999999;
								}
							}
						}
						>textarea {
							width: 500px;
							outline: none;
							min-height: 60px;
							border: none;
							resize: none;
							border-bottom: 1px dashed #ddd;
							font-size: 14px;
						}
					}
				}
			}
			>.logList {
				margin-top: 10px;
				>ul {
					>.page {
						width: 100%;
						height: 26px;
						line-height: 26px;
						text-align: center;
						background: #FFFFFF;
						box-shadow: 0 0 2px rgba(0, 0, 0, .2);
						-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
						margin-bottom: 20px;
						margin-top: -5px;
						span {
							cursor: pointer;
							font-size: 12px;
							&:hover {
								color: #409EFF;
							}
						}
					}
					>li {
						background: #FFFFFF;
						display: block;
						margin-bottom: 10px;
						color: #2D2F33;
						font-size: 13px;
						/*border: 1px solid #CCCCCC;*/
						box-shadow: 0 0 2px rgba(0, 0, 0, .2);
						-webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
						>.comment {
							background: #F9FBFF;
							padding: 10px 24px;
							>.commentInfo {
								>.avatar {
									display: inline-block;
									margin-top: 11px;
									margin-right: 10px;
									vertical-align: top;
									>img {
										width: 35px;
										height: 35px;
										-webkit-border-radius: 6px;
										border-radius: 6px;
									}
								}
								>.content {
									display: inline-block;
									line-height: 24px;
									padding-bottom: 10px;
									padding-top: 8px;
									border-bottom: 1px solid #DDDDDD;
									max-width: 484px;
									>.name {
										color: #3487E2;
									}
									>.msg {
										color: #333333;
									}
									>.imgShow {
										img {
											cursor: pointer;
											margin-right: 5px;
											margin-top: 5px;
											width: 50px;
										}
									}
									>.fileShow {
										>a {
											display: block;
											height: 24px;
											line-height: 24px;
											color: #000000;
											padding: 2px 10px;
											background: #EEEEEE;
											text-align: center;
											&:hover {
												background: #DDDDDD;
											}
										}
									}
									>.time {
										color: #999;
										margin-top: 10px;
										>a {
											margin-left: 329px;
											cursor: pointer;
											color: #6c7a95;
											float: right;
											&:hover {
												text-decoration: underline;
											}
										}
									}
								}
							}
							>.txt {
								border: 1px solid #DDDDDD;
								textarea {
									border: none;
									resize: none;
									outline: none;
									width: 546px;
									height: 50px;
									text-indent: 10px;
									padding-top: 10px;
								}
								>.opera {
									width: 100%;
									background: #F9F9F9;
									transition: .5s;
									.el-upload {
										outline: none;
									}
									.el-upload-list__item {
										outline:none &:first-child {
											margin-top: 0;
										}
										line-height: 1;
									}
									.el-upload-list__item:hover {
										background: #DDDDDD;
									}
									i {
										cursor: pointer;
										margin: 10px;
										color: #666666;
										font-size: 16px;
										&:hover {
											color: #444444;
										}
									}
								}
							}
							>.button {
								margin-top: 8px;
								>.el-button {
									padding: 4px 10px;
								}
							}
						}
						>.remark {
							background: #F9FBFF;
							padding: 10px 24px;
							>.txt {
								border: 1px solid #DDDDDD;
								textarea {
									border: none;
									resize: none;
									outline: none;
									width: 546px;
									height: 50px;
									text-indent: 10px;
									padding-top: 10px;
								}
								>.opera {
									width: 100%;
									background: #F9F9F9;
									transition: .5s;
									.el-upload {
										outline: none;
									}
									.el-upload-list__item {
										outline:none &:first-child {
											margin-top: 0;
										}
										line-height: 1;
									}
									.el-upload-list__item:hover {
										background: #DDDDDD;
									}
									i {
										cursor: pointer;
										margin: 10px;
										color: #666666;
										font-size: 16px;
										&:hover {
											color: #444444;
										}
									}
								}
							}
							>.button {
								margin-top: 8px;
								>.el-button {
									padding: 4px 10px;
								}
							}
						}
						>.opera {
							background-color: #f4f7fd;
							height: 46px;
							position: relative;
							line-height: 46px;
							padding-left: 20px;
							>div {
								cursor: pointer;
								padding: 0 12px;
								height: 18px;
								border-right: 1px solid #DDDDDD;
								margin-top: 14px;
								display: inline-block;
								float: right;
								&:first-child {
									border-right: none;
								}
								>i {
									display: inline-block;
									font-size: 16px;
									position: relative;
									bottom: 13px;
									color: #6c7a95;
									&:hover {
										color: #FC923F;
									}
									&.liked {
										color: #FC923F;
									}
								}
								>a {
									position: relative;
									bottom: 13px;
									color: #6c7a95;
									&:hover {
										text-decoration: underline;
									}
								}
							}
						}
						>.info {
							padding: 20px 25px 0 25px;
							>.avatar {
								display: inline-block;
								vertical-align: top;
								>img {
									width: 45px;
									height: 45px;
									border-radius: 6px;
								}
							}
							>.content {
								display: inline-block;
								margin-left: 10px;
								margin-top: 2px;
								>span {
									display: block;
									line-height: 20px;
									&.name {
										font-weight: 700;
									}
									&.time {
										color: #969696;
									}
								}
							}
							>.state1 {
								float: right;
								display: inline-block;
								>i {
									display: inline-block;
									width: 8px;
									height: 8px;
									border-radius: 50%;
									background: #199475;
								}
								>span {
									font-size: 14px;
								}
							}
							>.state2 {
								float: right;
								display: inline-block;
								>i {
									display: inline-block;
									width: 8px;
									height: 8px;
									border-radius: 50%;
									background: #9DB5FB;
								}
								>span {
									font-size: 14px;
								}
							}
						}
						>.content {
							padding: 20px 25px 0 25px;
							>div {
								>p {
									line-height: 18px;
									font-size: 13px;
									color: #999;
								}
								>span {
									display: block;
									margin: 10px 0;
									color: #444444;
									line-height: 27px;
									font-size: 14px;
								}
								img {
									cursor: pointer;
									width: 100px;
									margin-right: 5px;
									margin-bottom: 5px;
								}
								&.file {
									>a {
										display: block;
										height: 24px;
										line-height: 24px;
										color: #000000;
										padding: 2px 10px;
										background: #EEEEEE;
										margin-bottom: 2px;
										text-align: center;
										&:hover {
											background: #DDDDDD;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>-->
