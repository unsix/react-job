<template>
	<div class="worker_list" ref="workerList" @click="all">
		<div class="list">
			<table  border="0" cellspacing="1" cellpadding="0">
				<tr class="tr">
					<td width="50" height="30">头像</td>
					<td width="100">姓名</td>
					<td width="130">联系方式</td>
					<td width="90">工龄</td>
					<td width="170">
						<span>工种:<a ref="wkTypeTxt">全部</a></span>
						<img src="../../assets/downFFF.svg" alt="" @click.stop="wokerType"/>
							<div class="choose_wrapper" v-show="wokerTypeShow">
								<div class="choose">
									<a v-for="(item,index) in workerType" @click="wokerTypeShowF(item)">{{item}}</a>
								</div>
							</div>
					</td>
					<td width="170">
						<span>籍贯:<a ref="hmTypeTxt">全国</a></span>
						<img src="../../assets/downFFF.svg" alt="" @click.stop="wokerHome"/>
						<div class="choose_wrapper" v-show="wokerHomeShow">
							<div class="choose">
								<a v-for="(item,index) in workerHome" @click="wokerHomeShowF(item)">
									{{item}}
								</a>
							</div>
						</div>
					</td>
					<td width="100">
						<span >好评数</span>
						<img src="../../assets/downFFF.svg" alt="" @click="nice" ref="nice"/>
					</td>
					<td width="100">
						<span>雇用数</span>
						<img src="../../assets/downFFF.svg" alt="" @click="employ" ref="employ"/>
					</td>
				</tr>
				<tr class="trInfo" v-for="(item,index) in workerInfo">
					<td height="40">	<img :src="item.avatar" alt="" /></td>
					<td>{{item.name}}</td>
					<td>{{item.phone}}</td>
					<td>{{item.work_years}}</td>
					<td>{{item.type}}</td>
					<td>{{item.hometown}}</td>
					<td style="color: #FA5555; text-align: center" >1</td>
					<td style="color: #67C23A; text-align: center">1</td>

				</tr>
			</table>
		</div>
	</div>
</template>

<script>
import BScroll from '@/base/scroll/scroll'
import {prefixStyle} from '@/common/js/dom'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
    data() {
      return {
      	workerInfo:[],
      	activeIndex: '1',
        activeIndex2: '1',
        wokerTypeShow:false,
        wokerHomeShow:false,
        wokerNice:true,
        wokerEmploy:true,
        workerType:['全部','木地板','会计',
        	'出纳',
        	'地板安装工',
        	'晾衣架',
        	'卫浴类',
        	'室内装修',
        	'美工',
        	'程序员',
        	'工人类全能',
        	'电脑监控',
        	'硅藻泥技工',
        	'所有工种都有人',
        	'墙绘艺术漆金箔工',
        	'防水工',
        	'项目组组长',
        	'项目组',
        	'防水',
        	'专业防水',
        	'设计师',
        	'预算员',
        	'仓管',
        	'防水工',
        	'架子工',
        	'铁焊工',
        	'项目经理',
        	'施工员',
        	'安全员',
        	'材料员',
        	'木工',
        	'瓦工',
        	'油漆工',
        	'水电工',
        	'不锈钢工',
        	'玻璃胶工',
        	'墙纸工',
        	'铁工',
        	'保洁工',
        	'杂工',
        	'下水道疏通'
        ],
      	workerHome:['全国','北京市','天津市','上海市',
      	'重庆市',
      	'河北省',
      	'山西省',
      	'辽宁省',
      	'吉林省',
      	'黑龙江省',
      	'江苏省',
      	'浙江省',
      	'安徽省',
      	'福建省',
      	'江西省',
      	'山东省',
      	'河南省',
      	'湖北省',
      	'湖南省',
      	'广东省',
      	'海南省',
      	'四川省',
      	'贵州省',
      	'云南省',
      	'陕西省',
      	'甘肃省',
      	'青海省',
      	'内蒙古自治区',
      	'广西壮族自治区',
      	'西藏自治区',
      	'宁夏回族自治区',
      	'新疆维吾尔自治区',
      	'台湾省',
      	'香港',
      	'澳门'
      	]
      }
    },
    created(){
    	this.getData()
    },
    components:{
    	BScroll
    },
    methods:{
		nice(){
			this.$refs.nice.style.transition = 'all 0.4s'
			if(this.wokerNice){
				this.$refs.nice.style[transform] = `rotate(180deg)`
			}else{
				this.$refs.nice.style[transform] = `rotate(360deg)`
			}
			this.wokerNice = !this.wokerNice
		},
		employ(){
			this.$refs.employ.style.transition = 'all 0.4s'
			if(this.wokerEmploy){
				this.$refs.employ.style[transform] = `rotate(180deg)`
			}else{
				this.$refs.employ.style[transform] = `rotate(360deg)`
			}
			this.wokerEmploy = !this.wokerEmploy
		},
	    wokerType(){
	    	this.wokerTypeShow = !this.wokerTypeShow
	    	this.wokerHomeShow = false
	    },
	    wokerHome(){
	    	this.wokerHomeShow = !this.wokerHomeShow
	    	this.wokerTypeShow = false
	    },
	    wokerTypeShowF(item){
	    	this.$refs.wkTypeTxt.text=item
	    	this.wokerTypeShow = false
	    },
	    wokerHomeShowF(item){
	    	this.$refs.hmTypeTxt.text=item
	    	this.wokerHomeShow = false
	    },
	  	showType(){
	  		alert()
	  	},
	  	all(){
			this.wokerTypeShow = false
        	this.wokerHomeShow = false
	  	},
    	getData(){
		    let rec=[]
        var str = process.env.NODE_ENV
        var picLeader = ''
        str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
		    let param = new URLSearchParams();
		    param.append("uid","10000163");
		    this.$http.post("/index/Mobile/Find/nearby_worker",param)
		    .then((res)=>{
		    	 for (let x in res.data.data.nworker)
				  {
				    if(res.data.data.nworker[x].avatar.indexOf('jpg')!== -1){
				   		res.data.data.nworker[x].avatar = 'http://bbsf-file.hzxb.net/FnF0MmO7g-WONz-QYU6BsWMTwNR_'
				    }else{
				   	 	res.data.data.nworker[x].avatar = picLeader + res.data.data.nworker[x].avatar
				    }
				    if(res.data.data.nworker[x].type){
				    	res.data.data.nworker[x].type = res.data.data.nworker[x].type[0]
				    }
				  }
		     	this.workerInfo=res.data.data.nworker
		    })
    	}
    }
  }
</script>

<style lang="scss">
	/* Table Head */

	.worker_list{

		width: 100%;
		.list{
			position:relative;
			width: 800px;
			margin: 10px auto;
			font-size: 14px;
			table{
				td{
					background:#FFF;
				}
				.tr{

					td{
						text-indent: 6px;
						line-height: 30px;
						position: relative;
						background: rgb(81,130,188);
						color: #fff;
						.choose_wrapper{
							position: absolute;
							left: -1px;
							background:  rgb(81,130,188);
							width: 123px;
							height: 150px;
							overflow: hidden;
							border:1px solid #bababa;
							.choose{
								width: 100%;
							    height: 100%;
							    overflow-y: scroll;
							    padding-right: 17px;
							}
							a{
								display: block;
								height: 22px;
								margin-left: 17px;
								line-height: 22px;
								font-size: 14px;
								cursor: default;
								&:hover{
									background:burlywood;
								}
							}
						}
						img{
							width: 12px;
							vertical-align: top;
							position: relative;
							top: 10px;
							left: 4px;
							cursor: pointer;
						}
					}
				}
				.trInfo{
					border-bottom: 1px solid rgb(81, 130, 187);
					td{
						line-height: 40px;
						text-indent: 6px;

						img{
							height: 36px;
							vertical-align: middle;
						}
					}
				}
			}
			}
		}
</style>
