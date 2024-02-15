<template>
	<div class="ownerap_container">
		<el-main class="ownerAF_box">
			<img src="../assets/images/logo1.png" style="margin-left: 43%;margin-bottom: 5px;margin-top: 5px;" />
			<div style="text-align: center; font-size: 15px; font-family: serif; margin-bottom: 5px;">申请成为房东您需要填写以下信息,请如实填写,否则可能申请失败</div>
			<div class="applyForm">
				<el-form ref="ownerApplyFormRefd" :model="ownerApplyForm" :rules="ownerApplyFormRules" label-position="right"
				 label-width="85px">
					<!-- 账号 -->
					<el-form-item label="当前账号:">
						<el-input v-model="ownerApplyForm.account" disabled></el-input>
					</el-form-item>
					<!-- 姓名 -->
					<el-form-item label="姓名:" prop="name" style="width: 50%;display: inline-block;">
						<el-input v-model="ownerApplyForm.name" placeholder="请输入您的真实姓名"></el-input>
					</el-form-item>
					<!-- 性别 -->
					<el-form-item label="性别:" style="display: inline-block;">
						<el-radio v-model="ownerApplyForm.gender" label="1"> 男</el-radio>
						<el-radio v-model="ownerApplyForm.gender" label="2"> 女</el-radio>
					</el-form-item>
					<!-- 家庭住址 -->
					<el-form-item label="家庭住址:" style="display: inline-block; width: 50%;">
						<el-cascader v-model="ownerApplyForm.homeID" size="large" :options="options"></el-cascader>
					</el-form-item>
					<!-- 年龄 -->
					<el-form-item label="年龄:" prop="age" style="display: inline-block;">
						<el-input-number v-model="ownerApplyForm.age" controls-position="right" :min="1" :max="120" step-strictly></el-input-number>
					</el-form-item>
					<!-- 详细住址 -->
					<el-form-item label="当前住址:" prop="addressDetail">
						<el-input v-model="ownerApplyForm.addressDetail" type="textarea" :rows="2" maxlength="50" show-word-limit
						 placeholder="请输入您当前的详细住址,例如:xx省xx市xx区xx街道xx小区xx幢xx室"></el-input>
					</el-form-item>
					<!-- 手机号 -->
					<el-form-item label="联系方式:" prop="phone" style="display: inline-block; width: 50%;">
						<el-input v-model="ownerApplyForm.phone" placeholder="请输入您的手机号"></el-input>
					</el-form-item>
					<!-- 微信号 -->
					<el-form-item label="微信号:" prop="vx" style="display: inline-block; width: 50%;">
						<el-input v-model="ownerApplyForm.vx" placeholder="请输入您的微信号"></el-input>
					</el-form-item>
					<!-- 预计可出售房屋数 -->
					<el-form-item label="预计可出售的房屋数量:" prop="houseNum" style="display: inline-block;" label-width="170px">
						<el-input-number v-model="ownerApplyForm.houseNum" controls-position="right" :min="0" :max="99999" step-strictly></el-input-number>
					</el-form-item>
					<!-- 预计可出售单间数 -->
					<el-form-item label="预计可出售的单间数量:" prop="roomNum" style="display: inline-block;" label-width="170px">
						<el-input-number v-model="ownerApplyForm.roomNum" controls-position="right" :min="1" :max="99999" step-strictly></el-input-number>
					</el-form-item>
					<!--其他说明-->
					<el-form-item label="其他说明:">
						<el-input v-model="ownerApplyForm.description" type="textarea" :rows="2" maxlength="50" show-word-limit
						 placeholder="其他情况说明,此项为非必填项"></el-input>
					</el-form-item>
					<!-- 照片上传 -->
					<el-form-item label="身份证件(正反两张)" prop="IDpic">
						<el-upload
						  action="/api/picup"
						  list-type="picture-card"
						  accept="image/jpeg"
						  :on-error="onErr"
						  :on-success="upSuc"
						  :on-exceed="handleExceed"
						  :before-upload="beforeUpload"
						  :before-remove="beforePicRemove"
						  :limit="2">
						  <i class="el-icon-plus"></i>
						  <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
					<!-- 按钮 -->
					<el-form-item label-width="45%">
						<el-button type="primary" @click="ownerApplyFormUP" v-show="upBtn">提交申请</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-main>		
	</div>

</template>

<script>
	import {
		regionData,
		regionDataPlus,
		CodeToText,
		TextToCode
	} from 'element-china-area-data' //导入地区级联选择器

	
	export default {
		data() {
			//自定义手机号验证
			var validatePhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('此项为必填项！请输入您的手机号！'))
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
					if (reg.test(value)) {
						callback()
					} else {
						return callback(new Error('请输入正确的手机号！'))
					}
				}
			}
			//自定义微信号验证
			var validateVx = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('此项为必填项！请输入您的微信号！'));
				} else {
					const reg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
					if (reg.test(value)) {
						callback()
					} else {
						return callback(new Error('请输入正确的微信号！'));
					}
				}
			}
			
			//自定义图片列表验证
			var validateIDpic = (rule, value, callback) => {
				if (value.length < 1) {
					return callback(new Error('此项为必填！'));
				} else if(value.length < 2){
					return callback(new Error('请上传两张照片！'));
				};
				callback();
			}

			return {

				upBtn:true,
				
				options: regionData, //地区级联选择样式选择
				
				testimgBase64:'',//测试存放imgbase64码

				//认证列表初始数据
				ownerApplyForm: {
					account: window.sessionStorage.getItem("useraccount"),
					name: '',
					gender: '1',
					homeID: ["110000", "110100", "110101"],
					age: 1,
					addressDetail: '',
					phone: '',
					vx: '',
					houseNum: 0,
					roomNum: 1,
					description: '',
					IDpic: [],
				},
				//表单验证
				ownerApplyFormRules: {
					name: [{
							required: true,
							message: '此项为必填项！请输入您的姓名！',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 25,
							message: '名字格式不正确！',
							trigger: 'blur'
						}
					],
					age: [{
						required: true,
						message: '此项为必填项！请输入您的年龄！'
					}],
					addressDetail: [{
						required: true,
						message: '此项为必填项！请输入您的详细住址！',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						validator: validatePhone,
						trigger: 'blur'
					}],
					vx: [{
						required: true,
						validator: validateVx,
						trigger: 'blur'
					}],
					houseNum: [{
						required: true,
						message: '此项为必填项！',
						trigger: 'blur'
					}],
					roomNum: [{
						required: true,
						message: '此项为必填项！',
						trigger: 'blur'
					}],
					IDpic: [{
						required: true,
						validator: validateIDpic,
						trigger: 'blur'
					}]
				},
			}


		},

		created: function() {
			//console.log(window.sessionStorage.getItem("hasLogin"));
		},

		methods: {
			//上传时
			onPro(event, file, fileList){
				console.log("onProgress");
			},
			//上传成功函数
			upSuc(response, file, fileList){
				this.$message.success("图片上传成功");
				//var img = "data:image/png;base64,"+response;
				this.ownerApplyForm.IDpic.push(response);
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
			beforePicRemove(file,fileList){
				for(var i in fileList){
					if(file.uid == fileList[i].uid){
						this.ownerApplyForm.IDpic.splice(i,1);
						console.log(i);
					}
				}
			},
			ownerApplyFormUP(){
				this.$refs.ownerApplyFormRefd.validate(async valid=>{
					if(valid){
						var formate = new FormData();
						//将form表单转化为json字符串，因为表单中有数组，后端直接接受会为null，在此转换为json字符串后再在后端转化为对应对象
						var oaJson = JSON.stringify(this.ownerApplyForm);
						formate.append("ownerapply",oaJson);
						const {data:res} = await this.$http.put("/api/ownerapply",formate);
						//console.log("1112123");
						if(res == "success"){
							this.$message.success("提交成功");
							//this.upBtn=false;
							this.$router.push({path:"/main"});
						}else{
							this.$message.success("提交失败，请重试！");
							
						}	
					}else{
						return;
					}
				})
			
			}
		}
	}
</script>

<style lang="less" scoped>
	.ownerap_container {
		//总盒子
		background: url(//pages.anjukestatic.com/usersite/site/img/PlugLogin/bg.jpg) center center no-repeat;
		height: 100%;

		.ownerAF_box {
			width: 800px;
			height: 100%;
			background-color: white;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			border-radius: 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

			// .AF {
			// 	width: 400px;
			// }
			.applyForm {
				width: 80%;
				margin: auto;
			}
		}

		//设置滚动条不可见
		.ownerAF_box::-webkit-scrollbar {
			display: none;
		}
	}
</style>
