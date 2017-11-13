<template>
	<div class="contractApproval" v-show="contractApprovalShow">
		<div style="height: 30px;">
			<!--<div class="return">
				<i class="el-icon-d-arrow-left" @click="returnList"></i>
			</div>-->
			<div class="addPerson">
				<el-button type="primary" round style="margin-right: 10px;" v-show="submitAddPersonShow" @click="submitAddPersonShow =!submitAddPersonShow">收起</el-button>
				<el-button type="primary" round @click="addContractApprovalPerson">添加</el-button>

			</div>
			<div class="submitAddPerson">
				<el-button type="primary" round @click="dialogVisible = true" v-show="submitAddPersonShow">确认添加</el-button>
			</div>
		</div>
		<div class="chooseApprovalPerson" id="chooseApprovalPerson" v-show="submitAddPersonShow">
			<div class="depart">
				<ul>
					<li v-for="(group,index) in jurisdictionPersonList">
						<span>{{group.department_name}}</span>
						<div class="per" v-for="item in group.person" @click="chooseContractApprovalPerson(item)">
							<div class="perInfo">
								<img :src="item.avatar" alt="" />
								<span>{{item.name}}</span>
							</div>

						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="jurisdictionFormList">
			<ul>
				<li v-for="(item,index) in jurisdictionFormList">
					<!--	<span class="group">{{item.department_name}}</span>-->
					<div class="info">
						<img :src="item.avatar" alt="" />
						<span>{{item.department_name}}-{{item.name}}</span>
						<i class="delete el-icon-error" @click="deletejurisdictionFormList(item,index)"></i>
						<i class="up el-icon-caret-top" @click="upjurisdictionFormList(item,index)" v-show="index!=0"></i>
						<i class="down el-icon-caret-bottom" @click="downjurisdictionFormList(item,index)" v-show="index != jurisdictionFormList.length-1"></i>
					</div>

				</li>
			</ul>
		</div>
		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>确认添加？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submit">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import {createPersonInfo} from 'common/js/person_info'
	export default {
		data(){
			return{
				contractApprovalShow:false,
				submitAddPersonShow:false,
				jurisdictionPersonList:[],
				originalJurisdictionFormList:[],
				dialogVisible: false,
				numOne:0
			}
		},
		props:{
			jurisdictionFormList:{
				type:Array,
				default:[]
			}
		},
		methods:{
			returnList(){
				this.submitAddPersonShow=false,
				this.$emit('return')
			},
			submit(){
				console.log(this.jurisdictionFormList)
				this.dialogVisible=false
			},
			addContractApprovalPerson(){
				this.originalJurisdictionFormList = this.jurisdictionFormList
				this._getjurisdictionPersonList()
				document.getElementById('chooseApprovalPerson').style.height="300px"
				document.getElementById('chooseApprovalPerson').style.border="1px solid #DFE4ED"
					this.submitAddPersonShow=true
			},
//			选择合同评审表人员
			chooseContractApprovalPerson(item){
				this.jurisdictionFormList.push(item)
			},
//			删除合同评审表人员
			deletejurisdictionFormList(index){
				this.jurisdictionFormList.splice(index,1)
			},
			upjurisdictionFormList(item,index){
				if(index === 0){
					return
				}
				let nowItem = this.jurisdictionFormList[index]
				let upItem = this.jurisdictionFormList[index-1]
				this.$set(this.jurisdictionFormList, index, upItem);
				this.$set(this.jurisdictionFormList, index-1, nowItem);
			},
			downjurisdictionFormList(item,index){
				let len = this.jurisdictionFormList.length
				if(index === len-1){
					return
				}
				let nowItem = this.jurisdictionFormList[index]
				let downItem = this.jurisdictionFormList[index+1]
				this.$set(this.jurisdictionFormList, index, downItem);
				this.$set(this.jurisdictionFormList, index+1, nowItem);
			},
			_getjurisdictionPersonList(){
				let param = new URLSearchParams();
				param.append("company_id","131");
			    this.$http.post("/index/Mobile/user/get_department_lest",param)
			    .then((res)=>{
			    	let resData=res.data.data
			    	
			    	for(let j = 0,len=resData.length; j < len; j++) {
			    		if(this.numOne>=len){
			    			return
			    		}
			    		let obj={}
   						this.$set(obj,'department_name',resData[j].department_name)
						let newparam = new URLSearchParams();
					    newparam.append("company_id","131"); 
					    newparam.append("department_id",resData[j].department_id);
					    this.$http.post("/index/Mobile/user/get_company_personnel",newparam)
					    .then((res)=>{
					    	let reaDa=[]
					    	res.data.data.forEach((item)=>{
					    		reaDa.push(createPersonInfo(item))
					    	})
					    	this.$set(obj,'person',reaDa)					    	
					    	this.jurisdictionPersonList.push(obj)
					    })	
					    this.numOne++
					   
					}
			    	
			    })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contractApproval {
		position: relative;
		.addPerson {
			display: inline-block;
			float: right;
		}
		.submitAddPerson {
			position: absolute;
			top: 360px;
			right: 10px;
			display: inline-block;
			float: right;
		}
		.jurisdictionFormList {
			margin-top: 10px;
			width: 300px;
			ul {
				li {
					.group {
						display: block;
						height: 20px;
						color: #FFFFFF;
						background: #878D99;
						line-height: 20px;
						-webkit-border-radius: 4px;
						-moz-border-radius: 4px;
						border-radius: 4px;
						text-indent: 10px;
					}
					.info {
						display: block;
						height: 30p;
						font-size: 0;
						cursor: default;
						position: relative;
						border-bottom: 1px solid #5A5E66;
						img {
							width: 26px;
							height: 26px;
							-webkit-border-radius: 50%;
							-moz-border-radius: 50%;
							border-radius: 50%;
							vertical-align: top;
							margin-top: 2px;
							margin-left: 4px;
						}
						span {
							font-size: 14px;
							line-height: 30px;
							margin-left: 10px;
						}
						.up {
							line-height: 30px;
							font-size: 14px;
							float: right;
							position: absolute;
							right: 45px;
							cursor: pointer;
							display: inline-block;
						}
						.down {
							display: inline-block;
							line-height: 30px;
							font-size: 14px;
							float: right;
							position: absolute;
							right: 80px;
							cursor: pointer;
						}
						.delete {
							line-height: 30px;
							font-size: 14px;
							float: right;
							margin-right: 10px;
							color: #878D99;
							&:hover {
								color: #FA5555;
							}
						}
					}
				}
			}
		}
		.chooseApprovalPerson {
			position: absolute;
			right: 10px;
			top: 50px;
			width: 200px;
			height: 300px;
			background: #FFFFFF;
			.depart {
				position: absolute;
				top: 0;
				left: 0;
				width: 200px;
				height: 100%;
				overflow-y: scroll;
				ul {
					li {
						width: 100%;
						span {
							display: block;
							text-align: center;
							height: 24px;
							line-height: 24px;
							font-size: 14px;
							cursor: default;
						}
						i {
							margin-top: 10px;
							font-size: 14px;
							margin-right: 10px;
							float: right;
							color: #c3d1e4;
						}
						.per {
							background: #DDDDDD;
							height: 24px;
							cursor: pointer;
							margin-bottom: 2px;
							.perInfo {
								height: 24px;
								font-size: 0;
								img {
									display: inline-block;
									width: 20px;
									height: 20px;
									-webkit-border-radius: 50%;
									-moz-border-radius: 50%;
									border-radius: 50%;
									vertical-align: top;
									margin: 2px 2px 0 6px;
								}
								span {
									display: inline-block;
									font-size: 14px;
									line-height: 24px;
									padding: 0;
									margin-left: 6px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>