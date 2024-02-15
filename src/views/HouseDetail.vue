<template>
	<div>
		<div class="top">
			<img style="width: 200px;margin-top: 20px;" src="../assets/images/logo1.png" />
			<div style="color: #999;font-weight: 700;">欢迎您访问归园田居房屋销售网站!  为您寻找最合适的温馨小屋。</div>
		</div>
		<div class="main">
			<div class="left">
				<div style="font-size: 30px;color: #333;height: 65px;line-height: 45px;font-weight: 700;">{{this.addressDetail}}</div>
				<div style="width: 100%;height: 500px;overflow: hidden;">
					<img style="width: 100%;height: 500px;" :src="showHousepic[0]"/>
				</div>
				<div>
					<div class="smalltitle">房源详情</div>
					<div>房屋价格： {{this.monthRent}}元</div>
					<div>房屋户型： {{this.houseType[0]}}室{{this.houseType[1]}}厅{{this.houseType[2]}}卫</div>
					<div>房屋面积： {{this.rentArea}}m²</div>
					<div>所在楼层： {{this.floor}}</div>
					<div>出售类型： {{this.rentType < 1 ? '大产权':'小产权'}}</div>
					<div>配套设施：
						<div style="display: inline-block;margin-right: 6px;" v-show="checkList.length == 0">无详情</div>
						<div style="display: inline-block;margin-right: 6px;" v-for="o in checkList" :key="o">{{o}}</div>
					</div>

				</div>
				<div>
					<div class="smalltitle">房屋简介</div>
					<div style="height: 80px;">{{this.description}}</div>
				</div>
				<div>
					<div class="smalltitle">房屋图片</div>
					<!-- <img class="showimg" :src="showHousepic[0]" v-show="showHousepic[0]!=''"/>
					<img class="showimg" :src="showHousepic[1]" v-show="showHousepic[1]!=''"/>
					<img class="showimg" :src="showHousepic[2]" v-show="showHousepic[2]!=''"/>
					<img class="showimg" :src="showHousepic[3]" v-show="showHousepic[3]!=''"/>
					<img class="showimg" :src="showHousepic[4]" v-show="showHousepic[4]!=''"/> -->
					<el-carousel :interval="4000" type="card" height="300px">
					        <el-carousel-item v-for="o in showHousepic" :key="o">
					          <h3 class="small">
					            <img style=" width: 100%; height: 300px;" :src="o" />
					          </h3>
					        </el-carousel-item>
					 </el-carousel>
				</div>
			</div>
			<div class="right">
				<div class="ownerBox">
					<div class="right_title">房东简介</div>
					<div class="right_title_item" style="margin-top: 10px;">房东姓名：{{this.ownerName}}</div>
					<div class="right_title_item">联系方式：{{this.ownerPhong}}</div>
					<div class="right_title_item">微信账号：{{this.ownerVx}}</div>
					<div style="color: red;font-size: 10px;">请保护好您的个人隐私和财产安全，不要轻易泄露重要信息，不要轻信他人，谨防诈骗！</div>
				</div>
				<div style="margin-top: 15px;">
					<div class="right_title">房源推荐</div>
					<div v-for="o in recommendList" :key="o.houid">
						<div style="margin-top: 15px;" @click="goHouseDetail(o.houid)">
							<img style="width: 100%;height: 150px;cursor:pointer;" :src="'data:image/jpg;base64,' + o.housePic[0]"/>
						</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<div style="text-align: center;color: #333;padding-top: 10px">归园田居有限公司 版权所有 | 网络经营许可证 京ICP备88888888号 ©2023 88888888@163.com, all rights reserved. 隐私政策</div>
				<div style="text-align: center;color: #333;padding-bottom: 35px;">企业邮箱 88888888@163.com</div>
			</div>
		</div>

	</div>
</template>

<script>
	export default{
		created:async function(){
		    var houid = this.$route.query.houid;
			const {data:res} = await this.$http.put("/api/getHouseDetailByhouid?houid="+houid);
			//console.log(res);
			this.addressDetail = res.house.addressDetail;
			this.monthRent = res.house.monthRent;
			this.houseType = res.house.houseType
			this.rentArea = res.house.rentArea;
			this.floor = res.house.floor;
			this.rentType = res.house.rentType;
			this.checkList = res.house.checkList;
			this.description = res.house.description;
			//this.showHousepic = res.house.housePic;


			for(var i=0;i<res.house.housePic.length;i++){
				if(res.house.housePic[i] != ''){
					this.showHousepic[i] = 'data:image/jpg;base64,'+res.house.housePic[i];
				}else{
					break;
				}
			}
			//console.log(this.showHousepic[0])

			this.ownerName = res.owner.name;
			this.ownerPhong = res.owner.phone;
			this.ownerVx = res.owner.vx;

			this.getRecommendList();
		},
		data(){
			return{
				//房屋信息
				addressDetail:'xx省xx市xx区xx小区xx幢xx室',
				monthRent:'',//月租金
				houseType:[],//房屋类型
				rentArea:'',//房屋面积
				floor:'',//所在楼层
				rentType:'',//出售类型
				checkList:'',//配套设施列表
				description:'',//房屋简介
				showHousepic:[],//图片格式代码和base64拼接后的图片src数组

				//房东信息
				ownerName:'',//房东姓名
				ownerPhong:'',//手机号码
				ownerVx:'',//微信号码

				recommendList:[],//推荐列表

				//获取推荐列表参数
				HouseUpRecordInfo:{
					account:'',//存放要查询的申请记录的账号
					pageStart: 1,//页面初始
					pageSize: 6,//页面长度
				},
			}
		},
		methods:{
			async getRecommendList(){
				//console.log("11111111");
				const {
					data: res
				} = await this.$http.get("/api/getAllOnshowHURecords", {
					params: this.HouseUpRecordInfo
				});
				this.recommendList = res.houseInfoArrayList;
			},
			//跳转到详情页面
			goHouseDetail:function(houid){

				window.open("http://localhost:8080/#/housedetail?houid="+houid);
			},
		}
	}

</script>

<style lang="less" scoped>
	.top{
		width: 80%;
		height: 120px;
		margin: 0 auto;
		// background-color: red;
		//border:1px solid red;
	}
	.main{
		width: 80%;
		height: 1200px;
		margin: 0 auto;
		/* background-color: blue; */
	}
	.left{
		//margin-right: 10px;
		width: 78%;
		display: inline-block;
	}
	.right{
		width: 20%;
		float: right;
		margin-top: 65px;
		// display:inline-block;
		//background-color: red;
	}
	.smalltitle{
		font-size: 24px;
		font-weight:700;
		color: #333;
		height: 80px;
		line-height: 80px;
	}
	.showimg{
		width: 48%;
		margin-right: 2%;
		height: 270px;
	}
	.footer{
		margin-top: 50px;
		border-top: 1px solid black;
	}
	.ownerBox{
		border: 1px solid lightblue;
		//background-color: lightblue;
		border-radius: 5px;
	}
	.right_title{
		font-size: 24px;
		font-weight:700;
		color: #333;
	}
	.right_title_item{
		font-weight: 700;
		color: #333;
		height: 30px;
		// line-height: 50px;
	}
</style>
