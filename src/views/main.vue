<template>
	<div class="main">
		<div class="header">
			<img src="../assets/images/logo1.png" style="margin-top: 15px;" />
				<div style="float: right;line-height: 62px;" v-show="hasLogin">当前账号:{{this.lgac}}

				<i class="el-icon-circle-check" v-show="isOwner" style="margin-right: 5px;">房东</i>
				<i class="el-icon-circle-close" v-show="!isOwner" style="margin-right: 5px;">房东</i>

				<el-button @click="logOut" size="medium" class="header_button" plain>退出</el-button>
				</div>
				<el-button @click="goRegister" size="medium" plain class="header_button" v-show="!hasLogin">注册</el-button>
				<el-button @click="UserLoginFormFlag=true" size="medium" plain class="header_button" v-show="!hasLogin">登录</el-button>
				<el-dialog title="登录" :visible.sync="UserLoginFormFlag" width="500px" center>
					<el-form ref="userloginFormRef" :model="UserLoginForm" :rules="UserloginRules" label-width="80px" label-position="center">
						<el-form-item label="账 号：" prop="account">
							<el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="UserLoginForm.account"></el-input>
						</el-form-item>
						<el-form-item label="密 码：" prop="password">
							<el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="UserLoginForm.password" show-password></el-input>
						</el-form-item>
						<el-form-item label-width="190px">
							<el-button type="primary" @click="UserLogin">详询微dabocode</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
			</span>
		</div>
		<!-- 搜索区域 -->
		<div class="search">
			<el-input  placeholder="请输入要搜索的地区" v-model="HouseUpRecordInfo.account" prefix-icon="el-icon-search" clearable class="search_input">
				<el-button slot="append" icon="el-icon-search" @click="getAllOnshowHURecords"></el-button>
			</el-input>
			<el-button @click="goOwnerApply" style="margin-left: 18px;" type="primary" v-show="!isOwner">我要做房东！</el-button>
			<el-button @click="goHouseUp" style="margin-left: 18px;" type="primary" v-show="isOwner">上传房源信息</el-button>
			<div class="search_form">
				<div class="seaForm">
					<el-form :model="searchForm" size="medium">
						<!-- <el-form-item>
							<el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange">
							</el-cascader>
							<el-button type="primary" @click="send">111</el-button>
						</el-form-item> -->


						<el-form-item label-width="10px">
							<div style="display: inline-block;font-size: 18px;font-weight: 200;">房屋面积：</div>
							<template>
							  <el-radio v-model="searchForm.rentArea" label="49" border size="small">50m²以下</el-radio>
							  <el-radio v-model="searchForm.rentArea" label="50" border size="small">50m²-90m²</el-radio>
							  <el-radio v-model="searchForm.rentArea" label="90" border size="small">90m²-130m²</el-radio>
							  <el-radio v-model="searchForm.rentArea" label="130" border size="small">130m²-180m²</el-radio>
							  <el-radio v-model="searchForm.rentArea" label="181" border size="small">180m²以上</el-radio>
							</template>
						</el-form-item >
						<el-form-item label-width="10px">
							<div style="display: inline-block;font-size: 18px;font-weight: 200;">房屋价格：</div>
							<template>
							  <el-radio v-model="searchForm.monthRent" label="299999" border size="small">30万元以下</el-radio>
							  <el-radio v-model="searchForm.monthRent" label="300000" border size="small">30-60万元</el-radio>
							  <el-radio v-model="searchForm.monthRent" label="600000" border size="small">60-90万元</el-radio>
							  <el-radio v-model="searchForm.monthRent" label="900000" border size="small">90-120万元</el-radio>
							  <el-radio v-model="searchForm.monthRent" label="1200001" border size="small">120万元以上</el-radio>
							</template>
						</el-form-item>
						<!-- <el-form-item label-width="10px">
							<div style="display: inline-block;font-size: 18px;font-weight: 200;">房屋户型：</div>
							<template>
							  <el-radio v-model="searchForm.houseType" label="1" border size="small">一室</el-radio>
							  <el-radio v-model="searchForm.houseType" label="2" border size="small">两室</el-radio>
							  <el-radio v-model="searchForm.houseType" label="3" border size="small">三室</el-radio>
							  <el-radio v-model="searchForm.houseType" label="4" border size="small">四室</el-radio>
							  <el-radio v-model="searchForm.houseType" label="5" border size="small">四室以上</el-radio>
							</template>
						</el-form-item> -->

						<el-form-item label-width="10px">
							<div style="display: inline-block;font-size: 18px;font-weight: 200;">产权类型：</div>
							<template>
							  <el-radio v-model="searchForm.rentType" label="0" border size="small">大产权</el-radio>
							  <el-radio v-model="searchForm.rentType" label="1" border size="small">小产权</el-radio>
							</template>
						</el-form-item>

						<el-form-item label-width="10px">
							<div style="display: inline-block;font-size: 18px;font-weight: 200;">房屋楼层：</div>
							<template>
							  <el-radio v-model="searchForm.floor" label="1" border size="small">低楼层（1-6楼）</el-radio>
							  <el-radio v-model="searchForm.floor" label="7" border size="small">中楼层（7-12楼）</el-radio>
							  <el-radio v-model="searchForm.floor" label="13" border size="small">高楼层（13楼以上）</el-radio>
							</template>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" plain style="width: 80%;margin-left: 7%;" @click="query">查询</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>

		<!-- 主体部分 -->
		<div class="maincontent">

			<div class="left">
				<div class="top">共找到 {{this.HURecords}} 套出售房源</div>
				<div class="list">
					<el-card class="box-card-HUlist">
					  <div v-for="o in HouseUpRecordList" :key="o.houid" class="oneRecordBox">
						  <div class="list_img" @click="goHouseDetail(o.houid)">
							  <img style="width: 200px;height: 150px;" :src="'data:image/jpg;base64,' + o.housePic[0]"/>
						  </div>
						  <!-- <div style="display: inline-block;background-color: red;height: 6.25rem;width: 6.25rem;"></div> -->

						  <div  style="height: 200px;width: 400px;display: inline-block;margin-top: 25px;margin-left: 25px;">

							  <div class="house_title" style="" @click="goHouseDetail(o.houid)">{{o.addressDetail}}</div>

							  <div class="list_text"><i class="el-icon-menu"></i>房屋户型：{{o.houseType[0]}}室{{o.houseType[1]}}厅{{o.houseType[2]}}卫</div>
							  <div class="list_text"><i class="el-icon-house"></i>房屋面积：{{o.rentArea}}</div>
						      <div class="list_text"><i class="el-icon-school"></i>房屋楼层：{{o.floor}}</div>
						      <div class="list_text" v-show="o.checkList.length >= 3"><i class="el-icon-setting"></i>房屋配套设施：{{o.checkList[0]}},{{o.checkList[1]}},{{o.checkList[2]}}......</div>
							  <div class="list_text" v-show="o.checkList.length == 2"><i class="el-icon-setting"></i>房屋配套设施：{{o.checkList[0]}},{{o.checkList[1]}}</div>
							  <div class="list_text" v-show="o.checkList.length == 1"><i class="el-icon-setting"></i>房屋配套设施：{{o.checkList[0]}}</div>
							  <div class="list_text" v-show="o.checkList.length < 1"><i class="el-icon-setting"></i>房屋配套设施：无详情</div>
							  <div class="list_text"><i class="el-icon-office-building"></i>出售类型：{{o.rentType <1? '大产权' : '小产权'}}</div>
						 </div>
						  <div style="float: right; width: 150px;height: 100%;color: #fb5033;font-weight: bold;line-height: 200px;margin-right: 50px;font-size: 20px;">{{o.monthRent}}元</div>
					  </div>
					</el-card>

				</div>
				<!-- 分页 -->
				<div>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="HouseUpRecordInfo.pageSize"
					 layout="total, prev, pager, next, jumper" :total="HURecords" style="padding-left: 30%;">
					</el-pagination>
				</div>
			</div>
			<div class="right">
				<div>
					<img src="../assets/images/广告.jpg" />
				</div>
				<div class="tip_title">购房小贴士</div>
				<div class="tip_item">您可以搜索任意房源信息</div>
				<div class="tip_item">如果您想上传自己的房源信息，请先进行房东认证</div>
				<div class="tip_item">请不要轻易泄露您的个人隐私</div>
				<div class="tip_item">请不要轻易相信任何所谓客服人员私信或者房东私信</div>
				<div class="tip_item">请保障您的财产安全，不轻易进行交易</div>
				<div class="tip_title">小知识</div>
				<div class="tip_item">我国有将近2.4亿人有买房需求</div>
				<div class="tip_item">我国买房群体有近70%是95后，年轻人加油</div>
				<div class="tip_item">有超过80%的用户选择了买房</div>
				<div class="tip_item">预计至2023年，房屋出售总面积将达到83.82亿平方米，约等于32488个鸟巢</div>
			</div>
		</div>


		<el-dialog :visible.sync="refuseReasonDialog" width="35%" title="房东认证失败提示">
			<div>{{this.refuseReason}}</div>
			<el-button type="primary"style="margin-left: 42%;margin-top: 25px;" @click="goOA">确认</el-button>
		</el-dialog>

		<el-dialog :visible.sync="ownerDialog" width="35%" title="提示">
			<div>您的身份已经发生改变，请重新登录！</div>
			<el-button type="primary"style="margin-left: 42%;margin-top: 25px;" @click="logOut">确认</el-button>
		</el-dialog>

		<div class="foot">
			<div style="line-height:50px; font-weight:700; margin-left:50px; margin-right:50px; color:whitesmoke; border-bottom:1px solid aliceblue;">归园田居————为你寻找最适合的温馨小屋</div>
			<div style="color: whitesmoke; line-height: 50px; margin-left:50px;display: inline-block;font-size: 30px;">客服电话：</div>
			<div style="display: inline-block;color: #fbc700;font-size: 30px;">400-888-888</div>
			<div style="margin-left:50px;color: whitesmoke;line-height: 20px;"> 企业邮箱：88888888@163.com</div>
			<div style="margin-left:50px;margin-right:50px;padding-bottom: 6px; color: whitesmoke;line-height: 20px;border-bottom:1px solid aliceblue;">邮编号码：888888</div>
			<div style="margin-left:50px;color: whitesmoke;line-height: 47px;">归园田居有限公司 版权所有 | 网络经营许可证 京ICP备888888888号 ©2023 88888888@163.com, all rights reserved. 隐私政策</div>
		</div>
	</div>


</template>

<script>
	import {
		regionDataPlus,CodeToText, TextToCode
	} from 'element-china-area-data' //导入地区级联选择器

	export default {
		data() {
			return {
				input: '', //输入框搜索内容
				UserLoginFormFlag: false,

				hasLogin:false,//是否登录flag
				isOwner:false,//是否为房东flag

				lgac:'',//存放登录后的账户名称

				/*登录表单元素的初始值*/
				UserLoginForm: {
					account: '',
					password: '',
				},
				/*登录表单的表单验证规则*/
				UserloginRules: {
					account: [{
						required: true,
						message: '登录账号不能为空',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '密码为6位至12位',
							trigger: 'blur'
						}
					]
				},

				//searchKey:'',//搜索关键词
				searchForm:{
					rentArea:'49',//租房面积代码
					monthRent:'1499',//月租金代码
					houseType:'1',//房屋户型代码
					rentType:'0',//房屋出售类型代码
					floor:'1',//房屋楼层代码
					pageStart: 1,//页面初始
					pageSize: 5,//页面长度
				},

				/*地区级联选择器*/
				// options: regionDataPlus,
				// selectedOptions:[],

				refuseReasonDialog:false,//申请被拒绝理由框显示flag
				refuseReason:'',//存放拒绝理由

				ownerDialog:false,//用户身份发生改变时提示框flag

				HouseUpRecordList:[],//存放所有查询出来的列表
				HURecords:0,//查询结果数量

				HouseUpRecordInfo:{
					account:'',//存放要查询的申请记录的账号
					pageStart: 1,//页面初始
					pageSize: 5,//页面长度
				},

				scopeBase64:'',
			}
		},

		created:function(){
			this.getAllOnshowHURecords();
			if(window.sessionStorage.getItem("user")){
				this.hasLogin = window.sessionStorage.getItem("haslogin");
				this.lgac = window.sessionStorage.getItem("useraccount");
				if(window.sessionStorage.getItem("isowner") == "true"){
					//console.log("truemain");
					//控制房东专属功能显示
					this.isOwner = true;
				}else{
					//console.log("falsemain");
					this.isOwner = false;
				}
				//console.log(this.hasLogin);
				//console.log(this.isOwner);
				//console.log("created");
			}else{
				//console.log(this.hasLogin);
				//console.log(this.isOwner);
				//console.log("ffffffffff");
				return;
			}
		},


		methods: {

			//自定义sleep
			// sleep(numberMillis) {
			//     var now = new Date();
			//     var exitTime = now.getTime() + numberMillis;
			//     while (true) {
			//         now = new Date();
			//         if (now.getTime() > exitTime)
			//             return;
			//     }
			// },

			async getAllOnshowHURecords(){
				//console.log("11111111");
				const {
					data: res
				} = await this.$http.get("/api/getAllOnshowHURecords", {
					params: this.HouseUpRecordInfo
				});
				this.HouseUpRecordList = res.houseInfoArrayList;
				this.HURecords = res.HURecords;
			},

			//用户登录
			UserLogin() {
				this.$refs.userloginFormRef.validate(async valid =>{
					if(valid){
						const {data:res} = await this.$http.post("/api/userlogin",this.UserLoginForm);
						if(res.userLoginFlag == "userLoginSuccess"){
							this.$message.success("登录成功");
							window.sessionStorage.setItem("user",res.user);//存放用户所有信息

							/*登录后绑定数据*/
							this.UserLoginFormFlag = false;
							this.hasLogin = true;
							this.lgac = res.user.account;

							window.sessionStorage.setItem("haslogin",this.hasLogin);//存放用户登录标志
							window.sessionStorage.setItem("useraccount",res.user.account);//存放用户账号
							window.sessionStorage.setItem("isowner",res.user.owner);//存放用户是否为房东

							location.reload();//刷新当前页面
						}else{
							this.$message.error("登陆失败！账号或密码错误！");
							return;
						}
					}
				} )
			},

			//用户退出
			logOut(){
				//console.log("退出");
				window.sessionStorage.clear();//清空数据
				location.reload();
			},

			//跳转到注册页面
			goRegister() {
				window.open("http://localhost:8080/#/register");
			},

			//地区代码
			handleChange(value) {
				//console.log(value);
				// this.selectedOptions = value;
				console.log(this.selectedOptions);
			},
			//测试发送数据
			async send(){
				console.log(CodeToText[this.selectedOptions[1]]);
				var str = this.selectedOptions.toString();
				console.log(str);
				//const res = await this.$http.post("/searchhouser",str);
				var formData = new FormData();
				formData.append('str',str);
				formData.append('selet',this.selectedOptions);
				const {data:res} = await this.$http.put("/api/searchhouser",formData);
				console.log(res);
				// console.log(CodeToText[res.select[0]]);
				// console.log(res.hebei);
				// console.log(1245646546);
				// this.selectedOptions = res.hebei;
				//console.log(this.isOwner);
			},

			//跳转到详情页面
			goHouseDetail:function(houid){
				// if(window.sessionStorage.getItem("user")){
				// 	//console.log("跳转到详情页面")
				// }else{
				// 	this.$message.warning("查看详情需要登录！")
				// 	return;
				// }
				window.open("http://localhost:8080/#/housedetail?houid="+houid);
			},

			//地区关键字查询
			//searchButton(){
				// if(window.sessionStorage.getItem("user")){
				// 	console.log("关键字查询查询")
				// }else{
				// 	this.$message.warning("请先登录！")
				// 	return;
				// }
			// },

			//条件查询
			async query(){
				// console.log(this.HouseUpRecordInfo.account);
				// console.log(this.searchForm.rentArea);
				//console.log(this.searchForm.houseKey);
				// if(window.sessionStorage.getItem("user")){
				// 	console.log("条件查询")
				// }else{
				// 	this.$message.warning("请先登录！")
				// 	return;
				// }
				let formData = new FormData();
				formData.append('houseKey',this.HouseUpRecordInfo.account);//搜索关键词
				formData.append('rentArea',this.searchForm.rentArea);
				formData.append('monthRent',this.searchForm.monthRent);
				formData.append('houseType',this.searchForm.houseType);
				formData.append('rentType',this.searchForm.rentType);
				formData.append('floor',this.searchForm.floor);
				// formData.append('pageStart',this.searchForm.pageStart);
				// formData.append('pageSize',this.searchForm.pageSize);
				formData.append('pageStart',this.HouseUpRecordInfo.pageStart);
				formData.append('pageSize',this.HouseUpRecordInfo.pageSize);

				const {data:res} = await this.$http.put("/api/getAllOnshowHURecordsByKey", formData);
				console.log(res);
				this.HouseUpRecordList = res.houseInfoArrayList;
				this.HURecords = res.HURecords;

				// rentArea:'1',//租房面积代码
				// monthRent:'1',//月租金代码
				// houseType:'1',//房屋户型代码
				// rentType:'0',//房屋出售类型代码
				// floor:'1',//房屋楼层代码
			},

			//转向房东申请认证页面
			async goOwnerApply(){
				if(window.sessionStorage.getItem("user")){
					var formData = new FormData();
					formData.append('account',this.lgac);
					//查找当前用户是否已经进行过申请
					const {data:res} = await this.$http.put("/api/findOAByac",formData);
					//console.log(res);
					//该用户没有任何记录
					if(res.oastate == "null"){
						window.open("http://localhost:8080/#/ownerapply");
						return;
					}

					if(res.oastate == '0'){
						//console.log(res);
						this.$message.info("您的申请正在审核中，请等待管理员通过。^-^");
						return;
					}else if(res.oastate == '1'){
						this.ownerDialog = true;
						return;
					}else if(res.oastate == '2'){
						if(res.refuseNo == 1 ){
							this.refuseReason = '您的房东认证申请失败！请重新申请。失败原因：个人信息填写不规范。';
							this.refuseReasonDialog = true;
							//window.open("http://localhost:8080/#/ownerapply");
							return;

						}else if(res.refuseNo == 2){
							this.refuseReason = '您的房东认证申请失败！请重新申请。失败原因：身份证照片不合格。';
							this.refuseReasonDialog = true;
							//window.open("http://localhost:8080/#/ownerapply");
							return;
						}else if(res.refuseNo == 3){
							this.refuseReason = '您的房东认证申请失败！请重新申请。失败原因：其他特殊原因。';
							this.refuseReasonDialog = true;
							//window.open("http://localhost:8080/#/ownerapply");
							return;
						}
						return;
					}
				}else{
					this.$message.warning("请先登录！");
					return;
				}
			},

			//页面跳转，删除之前的申请记录，跳转至房东申请页面
			goOA(){
				//删除之前的申请记录
				this.$http.delete("/api/deleteRecordByaccount?account=" + window.sessionStorage.getItem("useraccount"));
				window.open("http://localhost:8080/#/ownerapply");
				return;
			},

			//转向房东上传房源信息页面
			async goHouseUp(){
				var formData = new FormData();
				formData.append('account',this.lgac);
				//查找当前用户是否身份是否改变
				const {data:res} = await this.$http.put("/api/findOAByac",formData);
				if(res.oastate == "0"){
					//console.log(res);
					this.ownerDialog = true;
					return;
				}else if(res.oastate == "1"){
					window.open("http://localhost:8080/#/personalcenter");
				}else{
					this.$message.error("服务器出错！请重试")
					return;
				}
			},

			//页面长度
			handleSizeChange(newSize) {
				this.HouseUpRecordInfo.pageSize = newSize;
				this.getAllOnshowHURecords();
			},
			//分页获取指定页面
			handleCurrentChange(newPage) {
				this.HouseUpRecordInfo.pageStart = newPage;
				this.getAllOnshowHURecords();
			},
		}
	}
</script>

<style lang="less" scoped>
	.main {
		width: 1200px;
		padding-left: 11%;
		padding-right: 11%;
		height: 100%;
		overflow-y: scroll;
	}

	.header {
		//头部
		width: 100%;
		height: 60px;
		//background-color: skyblue;
		overflow: hidden;
		box-sizing: border-box;

		.header_button {
			//头部按钮
			float: right;
			line-height: 45px;
			border: 0px;
		}
	}

	.search {
		//搜索区域
		width: 100%;
		height: 400px;
		//border: 1px solid black;
		background-image: url(../assets/images/背景3.jpg);
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;

		.search_input {
			width: 68%;
			margin-top: 10px;
			margin-left: 10%;
		}
		.search_form{
			width: 80%;
			height: 80%;
			margin-top: 10px;
			margin-left: 10%;
			background-color:rgba(255,255,255,0.95);
			border-radius: 3px;

		}
		.seaForm{
			width: 100%;
			height: 80%;
			display: inline-block;
			margin-top: 30px;
			margin-left: 40px;
		}
	}
	.maincontent{
		width: 100%;
		height: 1250px;
		//background-color: red;
		margin-top: 20px;
		padding-right: 5px;
		.top{
			width: 98%;
			height: 50px;
			line-height: 50px;
			overflow-x: hidden;
			font-size: 18px;
			border-bottom: 1px solid black;
		}
		.left{
			display: inline-block;
			width: 80%;
			height: 1250px;
			overflow-x: hidden;
			//background-color: blue;
		}
		.right{
			display: inline-block;
			float: right;
			overflow-x: hidden;
			width: 20%;
			height: auto;
			img{
				width: 120%;
				height: auto;
			}
		}
	}
	.tip_title{
		font-weight: bold;
		line-height: 50px;
		font-size: 17px;
		color: #323942;
		// color: white;
	}
	.tip_item{
		//font-weight: bold;
		font-size: 13px;
		line-height: 25px;
		color: #323942;
		//color: white;
	}
	.box-card-HUlist{
		width: 100%;
		height: 100%;
	}
	.oneRecordBox{
		width: 100%;
		height: 200px;
		//background-color: red;
		overflow: hidden;
		border: 1px solid skyblue;
		border-radius: 5px;
		//padding-top: 10px;
		margin-top: 15px;

	}
	.list_img{
		width: 200px;
		height: 150px;
		//background-color: red;
		//display: inline-block;
		margin-top: 25px;
		margin-left: 25px;
		float: left;
		cursor: pointer;
	}
	.list_text{
		height: 22px;
		line-height: 22px;
		color: #535d6a;
		// float: left;
	}
	.foot{
		width: 100%;
		height: 220px;
		//background-color: #1b242b;
		background-color: cadetblue;
	}
	.house_title{
		font-size: 20px;
		color: #323942;
		height: 40px;
		line-height: 40px;
		font-weight: 700;
		cursor:pointer;
	}
	.house_title:hover{
		color: blue;
	}
</style>
