<template>
	<div class="date_wrapper">
		<div class="calendar">
			<!-- 年份 月份 -->
			<div class="month">
				<ul>
					<li class="last el-icon-arrow-left" @click="pickPre(currentYear,currentMonth)"></li>
					<li class="year-month" @click="pickYear(currentYear,currentMonth)">
						<span class="choose-year">{{ currentYear }}</span>
						<span class="choose-month">{{ currentMonth }}</span>
					</li>
					<li class="next el-icon-arrow-right" @click="pickNext(currentYear,currentMonth)"></li>
				</ul>
			</div>
			<!-- 星期 -->
			<ul class="weekdays">
				<li>一</li>
				<li>二</li>
				<li>三</li>
				<li>四</li>
				<li>五</li>
				<li style="color:red">六</li>
				<li style="color:red">日</li>
			</ul>
			<!-- 日期 -->
			<ul class="days">
				<li @click="pick(day)" v-for="day in days">
					<span v-if="day.getMonth()+1 != currentMonth" class="other-month" style="color: #DDDDDD">{{ day.getDate() }}</span>
					<span v-else="">  
	            	<span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active" style="color: blue;">{{ day.getDate() }}</span>
					<span v-else="" style="color: #444444;">{{ day.getDate() }}</span>
					</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				currentDay: 1,  
			    currentMonth: 1,  
			    currentYear: 1970,  
			    currentWeek: 1,  
			    days: []
			}
		},
		created(){
			this.initData()
		},
		methods:{
			  initData(cur) {  
			      var date;  
			      if (cur) {  
			        date = new Date(cur);  
			      } else {  
			        date = new Date();  
			      }  
			      this.currentDay = date.getDate();  
			      this.currentYear = date.getFullYear();  
			      this.currentMonth = date.getMonth() + 1;  
			      this.currentWeek = date.getDay(); // 1...6,0  
			      if (this.currentWeek == 0) {  
			        this.currentWeek = 7;  
			      }  
			      var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);  
//			      console.log("today:" + str + "," + this.currentWeek);  
			      this.days.length = 0;  
			      // 今天是周日，放在第一行第7个位置，前面6个  
			      for (var i = this.currentWeek - 1; i >= 0; i--) {  
			        var d = new Date(str);  
			        d.setDate(d.getDate() - i);  
//			        console.log("y:" + d.getDate());  
			        this.days.push(d);  
			      }  
			      for (var i = 1; i <= 35 - this.currentWeek; i++) {  
			        var d = new Date(str);  
			        d.setDate(d.getDate() + i);  
			        this.days.push(d);  
			      }  
		    },  
		    // 当前日期  
		    pick(date) {  
//		      console.log(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));  
		    },  
		    // 上一月  
		    pickPre(year, month) {  
		      //  setDate(0); 上月最后一天  
		      //  setDate(-1); 上月倒数第二天  
		      //  setDate(dx) 参数dx为 上月最后一天的前后dx天  
		      var d = new Date(this.formatDate(year, month, 1));  
		      d.setDate(0);  
		      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));  
		    },  
		    // 下一月  
		    pickNext(year, month) {  
		      var d = new Date(this.formatDate(year, month, 1));  
		      d.setDate(35);  
		      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));  
		    },  
		    // 当前年月  
		    pickYear(year, month) {  
		      alert(year + "," + month);  
		    },  
		  
		    // 返回 类似 2016-01-02 格式的字符串  
		    formatDate(year, month, day) {  
		      var y = year;  
		      var m = month;  
		      if (m < 10) m = "0" + m;  
		      var d = day;  
		      if (d < 10) d = "0" + d;  
		      return y + "-" + m + "-" + d  
		    }
		  }
	}
</script>

<style lang="scss" scoped>
.date_wrapper{
	width: 280px;
	height: 250px;
	>.calendar{
		
		padding: 15px;
		padding-top: 25px;
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		>.month{
			border-top: 1px solid #EEEEEE;
			padding-top: 10px;
			height: 30px;
			line-height: 30px;
			margin-bottom: 20px;
			>ul{
				text-align: center;
				>li{
					display: inline-block;
					font-size: 16px;
					.choose-year{
						font-size: 18px;
					}
					.choose-month{
						color: #999999;
					}
					&.year-month{
						
					}
					&.last{
						float: left;
						font-size: 20px;
						padding: 2px;
						cursor: pointer;
						margin-top: 4px;
						color: #409EFF;
						font-weight:700; 
						&:hover{
							color: #199475;
						}
					}
					&.next{
						font-size: 20px;
						float: right;
						padding: 2px;
						cursor: pointer;
						margin-top: 4px;
						color: #409EFF;
						font-weight:700; 
						&:hover{
							color: #199475;
						}
					}
				}
			}
		}
		>.weekdays{
			margin-top: 5px;
			width: 100%;
			display: flex;
			>li{
				flex:1;
				height: 26px;
				height: 26px;
				text-align: center;
			}
		}
		>.days{
			width: 100%;
			>li{
				cursor:pointer;
				font-size: 14px;
				text-align: center;
				height: 26px;
				line-height: 26px;
				width: 40px;
				float: left;
				&:hover{
					color: red;	
				}
			}
		}
	}
}
</style>