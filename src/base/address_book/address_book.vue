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
            <h4>工作记录<span>...</span></h4>
            <h4>外勤签到<span>...</span></h4>
          </div>
        </div>
      </div>
    </div>

    <div class="publish">
      <div class="top">
        <el-button type="primary" class="btn" plain @click="return_">返回</el-button>
        <span class="title">人员详情</span>
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
        address_book_show:true,
			  details_show : false,
        personnel_id: '',
        infoArr :{}
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
			view_info(res) {
        this.address_book_show=false
        this.details_show = true
        this.personnel_id = res
        this._getCompanyUserInfo(this.personnel_id)
			},
      return_(){
        this.address_book_show=true
        this.details_show = false
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
</style>
