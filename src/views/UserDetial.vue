<template>
	<div style="width: 60%;margin-left: 20%;">
			  <el-form  label-position="right" ref="ownerApplyFormRef" :rules="ownerApplyFormRules"  :model="ownerApplyForm" label-width="85px">
			  	<!-- 账号 -->
			  	<el-form-item label="当前账号:">
			  		<el-input v-model="ownerApplyForm.account" disabled></el-input>
			  	</el-form-item>
			  	<!-- 姓名 -->
			  	<el-form-item label="姓名:" prop="name" style="width: 50%;display: inline-block;">
			  		<el-input v-model="ownerApplyForm.name"></el-input>
					<!-- <div>{{this.ownerApplyForm.name}}</div> -->
			  	</el-form-item>
			  	<!-- 性别 -->
			  	<el-form-item label="性别:" style="display: inline-block;">
			  		<el-radio v-model="ownerApplyForm.gender"  label="1"> 男</el-radio>
			  		<el-radio v-model="ownerApplyForm.gender"  label="2"> 女</el-radio>
			  	</el-form-item>
			  	<!-- 家庭住址 -->
			  	<el-form-item label="家庭住址:" style="display: inline-block; width: 50%;">
			  		<el-cascader v-model="ownerApplyForm.homeID" size="large" :options="options" ></el-cascader>
			  	</el-form-item>
			  	<!-- 年龄 -->
			  	<el-form-item label="年龄:" prop="age" style="display: inline-block;width: 50%;">
			  		<el-input-number v-model="ownerApplyForm.age" controls-position="right" :min="1" :max="120" step-strictly ></el-input-number>
			  	</el-form-item>
			  	<!-- 详细住址 -->
			  	<el-form-item label="当前住址:" prop="addressDetail">
			  		<el-input v-model="ownerApplyForm.addressDetail" type="textarea" ></el-input>
					<!-- <div>{{this.ownerApplyForm.addressDetail}}</div> -->
			  	</el-form-item>
			  	<!-- 手机号 -->
			  	<el-form-item label="联系方式:" prop="phone" style="display: inline-block; width: 50%;">
			  		<el-input v-model="ownerApplyForm.phone" ></el-input>
			  	</el-form-item>
			  	<!-- 微信号 -->
			  	<el-form-item label="微信号:" prop="vx" style="display: inline-block; width: 50%;">
			  		<el-input v-model="ownerApplyForm.vx" ></el-input>
			  	</el-form-item>
			  	<!-- 预计可出售房屋数 -->
			  	<el-form-item label="预计可出售的房屋数量:" prop="houseNum" style="display: inline-block;" label-width="170px">
			  		<el-input-number v-model="ownerApplyForm.houseNum" controls-position="right" :min="0" :max="99999" step-strictly ></el-input-number>
			  	</el-form-item>
			  	<!-- 预计可出售单间数 -->
			  	<el-form-item label="预计可出售的单间数量:" prop="roomNum" style="display: inline-block;" label-width="170px">
			  		<el-input-number v-model="ownerApplyForm.roomNum" controls-position="right" :min="1" :max="99999" step-strictly ></el-input-number>
			  	</el-form-item>
			  	<!--其他说明-->
			  	<el-form-item label="其他说明:">
			  		<el-input v-model="ownerApplyForm.description" type="textarea" :rows="2" maxlength="50" show-word-limit ></el-input>
			  	</el-form-item>
				<el-form-item label-width="45%">
					<el-button type="primary" @click="editAndSave">修改并保存</el-button>
				</el-form-item>
			  </el-form>
			  <!-- <el-dialog title="图片详情" :visible.sync="showbigIDpic" append-to-body>
				  <img :src="showBigBase64" style="width: 100%;"/>
			  </el-dialog>
			  <div style="width: 100%;height: 200px;overflow: scroll;">
				  <img :src="showIDpic[0]" @click="showbigIDpic=true,showBig(showIDpic[0])"/>
				  <img :src="showIDpic[1]" @click="showbigIDpic=true,showBig(showIDpic[1])"/>
			  </div> -->
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
		
		//该页面创建
		created() {
			this.getUserDetail();
		},
		
		
		data(){
			
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
			
			return{
				
				options: regionData,//家庭住址选择器样式
				
				ownerApplyForm: {
					account: window.sessionStorage.getItem("useraccount"),
					name: '',
					gender: '2',
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
				// showIDpic:[],
				// showBigBase64:''
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
					}]
				}
			}
		},
		methods:{
			async getUserDetail(){
				let formData = new FormData();
				formData.append("account",this.ownerApplyForm.account)
				const {data:res} = await this.$http.get("/api/findOneOAByAccount?account="+this.ownerApplyForm.account);
				this.ownerApplyForm.name = res.name;
				this.ownerApplyForm.gender = res.gender.toString();
				this.ownerApplyForm.homeID = res.homeId;
				this.ownerApplyForm.age = res.age;
				this.ownerApplyForm.addressDetail = res.addressDetail;
				this.ownerApplyForm.phone = res.phone;
				this.ownerApplyForm.vx = res.vx;
				this.ownerApplyForm.houseNum = res.houseNum;
				this.ownerApplyForm.roomNum = res.roomNum;
				this.ownerApplyForm.description = res.description;
			
				//修改格式，src显示
				// this.showIDpic[0] = 'data:image/jpg;base64,'+this.ownerApplyForm.IDpic[0];
				// this.showIDpic[1] = 'data:image/jpg;base64,'+this.ownerApplyForm.IDpic[1];
				//console.log(res);
			},
			editAndSave(){
				this.$refs.ownerApplyFormRef.validate(async valid=>{
					if(valid){
						let formData = new FormData();
						formData.append("editOAForm",JSON.stringify(this.ownerApplyForm));
						const {data:editres} = await this.$http.put("/api/updateOARecordAll",formData);
						if(editres == "success"){
							this.$message.success("修改保存成功!");
							this.getUserDetail();
							return;
						}else{
							this.$message.error("保存失败！请重试！");
							return;
						}				
					}else{
						return
					}
				})
			}
		}
	}
	
</script>

<style lang="less" scoped>
	img{
		width: 48%;
		margin-left: 3px;
	}
</style>
