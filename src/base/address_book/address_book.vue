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
        <el-button type="primary" class="btn" plain @click="return_">返回</el-button>
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
            <h4>外勤签到<span>...</span></h4>
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
          <li v-for="(item,index) in untreated">
            <div class="main">
              <div class="avatar">
                <img :src="item.avatar">
              </div>
              <div class="name">
                <span>{{item.name}}</span>
                <span class="add_time">{{item.add_time}}</span>
              </div>
              <div class="stauts">
                <span>日志 未点评</span>
                <div class="btn">
                  <el-button round type="primary">回复</el-button>
                  <el-button round type="warning">删除</el-button>
                  <el-button round type="success">赞</el-button>
                </div>
              </div>
            </div>
            <div class="cc">
              <span>全公司</span>
            </div>
            <div class="bottom">
              <div class="time">
                <span>{{item.start_time}} 由{{item.reviewer_name}}点评</span>
              </div>
               <ul>
                 <li v-for="ti in item.custom_form_elements">
                   <p>{{ti.title}}</p>
                   <span style="margin-left: 20px">sssssssssasdasda</span>
                 </li>
               </ul>
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
  </div>
</template>

<script>
	import {getPic} from '@/common/js/pic.js'
	import {getAvatar} from '@/common/js/avatar.js'
  import {getCro} from "@/common/js/crowd";
  import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
        untreated:[],
        look_show:false,
        address_book_show:true,
			  details_show : false,
        personnel_id: '',
        infoArr :{},
        nextPageShow: true,
        pageIndex:1
      }
		},
		computed: {
			...mapGetters([
				'nowCompanyId',
				'user',
				'comPersonList'
			])
		},
		props:{
			workList:{
				type:Array
			}
		},
		methods: {
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
		  look(res){
		    this.look_show = true
        this.address_book_show = false
        this.details_show = false
        this.look_uid = res
        this._getPublishList(this.look_uid)
      },
			view_info(res) {
        this.address_book_show=false
        this.look_show = false
        this.details_show = true
        this.personnel_id = res
        this._getCompanyUserInfo(this.personnel_id)
			},
      return_(){
        this.address_book_show=true
        this.details_show = false
      },
      _getPublishList(){
		    let param = new URLSearchParams()
        param.append("uid",this.user.uid)
        param.append("company_id",this.nowCompanyId)
        param.append("look_uid",this.look_uid)
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
              arr.push(item)
            })
            this.untreated = arr
            console.log(this.untreated)
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
            console.log(this.infoArr)
          })
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
		},
		mounted() {
		},
		watch: {
      pageIndex() {
        this._getPublishList()
      },
			nowCompanyId() {
				this._getComPersonList()
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
    .list{
      width: 100%;
      ul{
        list-style: none;
        margin-top: 20px;
        background: #D8D8D8;
        overflow: hidden;
        li{
          background: #ffffff;
          margin-bottom: 10px;
          margin-top: 10px;
          box-shadow: 0 0 2px rgba(0, 0, 0, .2);
          -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, .2);
          .main{
            overflow: hidden;
            .avatar{
              width: 80px;
              height: 80px;
              border: 1px solid red;
              margin-left: 15px;
              margin-top: 15px;
              float: left;
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
              width: 130px;
              float: right;
              overflow: hidden;
              margin-top: 15px;
              span{

              }
              .btn{
                overflow: hidden;
                button{
                  padding: 4px 12px;
                  margin-left: 18px;
                  margin-top: 5px;
                }
              }
            }
          }
          .cc{
            overflow: hidden;
            span{
              display: block;
              margin-left: 15px;
              padding: 4px 0;
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
        }
      }
    }
  }
</style>
