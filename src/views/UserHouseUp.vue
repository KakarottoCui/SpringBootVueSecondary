<template>
	<div style="width: 60%;margin-left: 20%;">
		<el-form  label-position="right" ref="houseUpFormRef" :rules="houseUpFormRules"  :model="houseUpForm" label-width="85px">
			<!-- 账号 -->
			<el-form-item label="当前账号:">
				<el-input v-model="houseUpForm.account" disabled></el-input>
			</el-form-item>
			
			<!-- 房屋户型 -->
			<el-form-item label="房屋户型:" style="display: inline-block; width: 100%;">
				<el-input-number v-model="houseUpForm.houseType[0]" controls-position="right" @change="changeBedroom" :min="1" :max="100" step-strictly></el-input-number>(室)
				<el-input-number v-model="houseUpForm.houseType[1]" controls-position="right" @change="changeHall" :min="0" :max="100" step-strictly></el-input-number>(厅)
				<el-input-number v-model="houseUpForm.houseType[2]" controls-position="right" @change="changeToilet" :min="1" :max="100" step-strictly></el-input-number>(卫)
			</el-form-item>
			<!-- 房屋地区 -->
			<el-form-item label="房屋地区:" style="display: inline-block; width: 45%;">
				<el-cascader v-model="houseUpForm.houseID" size="large" :options="options" ></el-cascader>
			</el-form-item>
			
			<!-- 出售类型 -->
			<el-form-item label="出售类型:" style="display: inline-block; width: 45%;">
				<el-select v-model="houseUpForm.rentType" placeholder="请选择">
				    <el-option
				      v-for="item in rentTypeOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
			</el-form-item>
			
			<!-- 房屋面积 -->
			<el-form-item label="房屋面积:" style="display: inline-block; width: 45%;">
				<el-input-number v-model="houseUpForm.rentArea" controls-position="right" @change="changeRentArea" :min="1" :max="99999" step-strictly></el-input-number>(m²)
			</el-form-item>
			
			<!-- 房屋楼层 -->
			<el-form-item label="房屋楼层:" style="display: inline-block; width: 45%;">
				<el-input-number v-model="houseUpForm.floor" controls-position="right" @change="changefloor" :min="1" :max="99999" step-strictly></el-input-number>(楼层)
			</el-form-item>
			
			
			<!-- 详细地址 -->
			<el-form-item label="详细地址:" prop="addressDetail">
				<el-input v-model="houseUpForm.addressDetail" type="textarea" :rows="2" maxlength="50" show-word-limit 
				placeholder="请输入出租房屋的详细地址,例如:xx省xx市xx区xx街道xx小区xx幢xx室"></el-input>
			</el-form-item>
			
			<!-- 房屋配套设置设施 -->
			<el-form-item label="配套设施:">
				  <el-checkbox-group v-model="houseUpForm.checkList">  
				    <el-checkbox label="冰箱"></el-checkbox>
				    <el-checkbox label="洗衣机"></el-checkbox>
				    <el-checkbox label="热水器"></el-checkbox>
					<el-checkbox label="微波炉"></el-checkbox>
					<el-checkbox label="燃气灶"></el-checkbox>
					<el-checkbox label="油烟机"></el-checkbox>
					<el-checkbox label="空调"></el-checkbox>
				    <el-checkbox label="沙发"></el-checkbox>
				    <el-checkbox label="宽带"></el-checkbox>
					<el-checkbox label="WIFI"></el-checkbox>
					<el-checkbox label="床"></el-checkbox>
					<el-checkbox label="洗漱用具"></el-checkbox>
					<el-checkbox label="衣柜"></el-checkbox>
					<el-checkbox label="卫生间"></el-checkbox>
					<el-checkbox label="阳台"></el-checkbox>
				  </el-checkbox-group>
			</el-form-item>
			
			<!-- 出售价格 -->
			<el-form-item label="出售价格:">
				<el-input-number v-model="houseUpForm.monthRent" controls-position="right" @change="changeMonthRent" :min="1" :max="99999999" step-strictly></el-input-number>(元)
			</el-form-item>
			
			<!--房屋详情-->
			<el-form-item label="房屋详情:" prop="description">
				<el-input v-model="houseUpForm.description" type="textarea" :rows="4" maxlength="300" show-word-limit 
				placeholder="请简要描述您需要出租房屋的整体情况,包括但不限于卫生环境,交通,商业街等周边概况"></el-input>
			</el-form-item>
			
			<!-- 照片上传 -->
			<el-form-item label="房屋照片" prop="housePic">
				<el-upload
				  action="/api/picup"
				  list-type="picture-card"
				  accept="image/jpg"
				:on-error="onErr"
				:on-success="upSuc"
				:on-exceed="handleExceed"
				:before-upload="beforeUpload"
				:before-remove="beforePicRemove"
				  :limit="5">
				  <i class="el-icon-plus"></i>
				  <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb，不超过5张</div>
				</el-upload>
			</el-form-item>
			
			<el-form-item label-width="45%">
				<el-button type="primary" @click="houseUp" >提交审核</el-button>
			</el-form-item>
		</el-form>
		<!-- <button @click="test">ceshi</button> -->
	</div>
</template>

<script>
	import {
		regionData,
		regionDataPlus,
		CodeToText,
		TextToCode
	} from 'element-china-area-data' //导入地区级联选择器
	
	export default{
		data(){
			
			//自定义图片列表验证
			var validatHousePic = (rule, value, callback) => {
				if (value.length == 0) {
					return callback(new Error('此项为必填！请上传至少一张图片'));
				};
				callback();
			}
			
			return{
				options: regionData,//家庭住址选择器样式
				
				rentTypeOptions:[{
					value:0,
					label:'大产权',
				},{
					value:1,
					label:'小产权',
				}
				],
				
				houseUpForm:{
					account:window.sessionStorage.getItem("useraccount"),//当前房东账号
					houseType:[1,0,0],//户型 x室x厅x卫
					houseID:["110000", "110100", "110101"],//出租屋地区代号
					rentType:1,//出售类型
					rentArea:115,//房屋面积
					floor:1,//房屋楼层
					addressDetail:'',//详细地址
					checkList:[],//配套设施列表
					monthRent:1000,//月租金
					description:'',//房屋详情
					housePic:[]//房屋照片
				},
				
				//表单验证
				houseUpFormRules: {
					addressDetail: [{
						required: true,
						message: '此项为必填项！请输入房屋地址！',
						trigger: 'blur'
					}],
					description: [{
						required: true,
						message: '此项为必填项！请填写房屋简介！',
						trigger: 'blur'
					}],
					housePic: [{
						required: true,
						validator: validatHousePic,
						trigger: 'blur'
					}]
				},
			}
		},
		methods:{
			
			test(){
				console.log(this.houseUpForm.checkList);
			},
			
			//修改室数量
			changeBedroom(value){
				this.houseUpForm.houseID[0] = value;
			},
			//修改厅数量
			changeHall(value){
				this.houseUpForm.houseID[1] = value;
			},
			//修改卫数量
			changeToilet(value){
				this.houseUpForm.houseID[2] = value;
			},
			//修改房屋面积
			changeRentArea(value){
				this.houseUpForm.rentArea = value;
			},
			//修改楼层
			changefloor(value){
				this.houseUpForm.floor = value;
			},
			//修改月租金
			changeMonthRent(value){
				this.houseUpForm.monthRent = value;
			},
			
			//上传成功函数
			upSuc(response, file, fileList){
				this.$message.success("图片上传成功");
				//var img = "data:image/png;base64,"+response;
				this.houseUpForm.housePic.push(response);
				//console.log(img);
			},
			//上传出错函数
			onErr(err, file, fileList){
				this.$message.error("图片上传失败，请重新上传")
			},
			//处理上传超出数量限制
			handleExceed(){
				this.$message.error("超出图片上传数量！")
			},
			//上传前处理函数
			beforeUpload(file){
				if(file.size >= 500*1024){
					this.$message.error("文件过大，请重新上传");
					return false;
				};
				var testmsg = file.name.substring(file.name.lastIndexOf('.')+1);
				const extension = testmsg === 'jpg';
				// const extension2 = testmsg === 'png';
				// if(!extension && (!extension2)){
				// 	this.$message.error("上传文件类型错误，请重新上传");
				// 	return false;
				// }
				if(!extension){
					this.$message.error("上传文件类型错误，请重新上传");
					return false;
				}
			},
			//在被删除前，删除list中的base64码
			beforePicRemove(file,fileList){
				for(var i in fileList){
					if(file.uid == fileList[i].uid){
						this.houseUpForm.housePic.splice(i,1);
						//console.log(i);
					}
				}
			},
			houseUp(){
				this.$refs.houseUpFormRef.validate(async valid =>{
					if(valid){
						var formate = new FormData();
						//将form表单转化为json字符串，因为表单中有数组，后端直接接受会为null，在此转换为json字符串后再在后端转化为对应对象
						var huJson = JSON.stringify(this.houseUpForm);
						formate.append("houseUpForm",huJson);
						const {data:res} = await this.$http.put("/api/addHouseUpRecord",formate);
						if(res == "success"){
							this.$message.success("提交成功！您可以在房源管理栏查看。");
							this.$router.push("/userhousemanger");
							return;
						}else{
							this.$message.error("提交失败！请重试！")
							return;
						}
					}else{		
						return;
					}
				})
				
			}
		}
	}
	
</script>

<style>
</style>
