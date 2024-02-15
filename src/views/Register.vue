<template>
	<!-- 用户注册界面 -->
	<div class="login_container">
		<div class="login_box">
			<div class="title_box">欢迎您，请注册</div>
			<!-- 分割线 -->
			<hr align="center" width="86%" color="dodgerblue" size="2" style="margin-top: 0;margin-bottom: 0;" />
			<div class="login_msg">
				<el-form ref="UserRegisterFormRef" :model="UserRegisterForm" :rules="RegisterRules" label-width="140px"
				 label-position="center">
					<!-- 用户名 -->
					<el-form-item label="请输入账号：" prop="account">
						<el-input v-model="UserRegisterForm.account" placeholder="请输入用户账号" prefix-icon="el-icon-user"></el-input><!-- 数据绑定（数字类型） 文字提示  输入框前部图标-->
					</el-form-item>
					<!-- 密码 -->
					<el-form-item label="请输入密码：" prop="password">
						<el-input v-model="UserRegisterForm.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
					</el-form-item>
					<el-form-item label="再次输入密码：" prop="password1">
						<el-input v-model="password1" type="password" placeholder="请再次输入密码" prefix-icon="el-icon-lock" show-password></el-input>
					</el-form-item>
					<!-- 拖拽验证 -->
					<el-form-item label="验 证：" :label-width="YlabelWidth">
						<Verify :type='3' :showButton='false' :barSize='verifySize' @success="verify(true)" @eooro="verify(false)"></Verify>
					</el-form-item>
					<!-- 按钮 -->
					<el-form-item label-width="0px">
						<el-button type="primary" @click='userRegister'>注册</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import Verify from 'vue2-verify'
	import {
		Message
	} from 'element-ui'
	export default {
		components: {
			Verify //拖拽滑块验证
		},
		data() {
			var checkPwd = (rule, value, callback) => {
				if (this.password1 == '') {
					callback(new Error('请再次输入密码'));
				} else if (this.password1 != this.UserRegisterForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};

			return {
				/*登录表单元素的初始值*/
				YlabelWidth: '80px',
				UserRegisterForm: {
					account: '',
					password: '',
				},
				password1: '', //第二次输入的密码
				verifySize: {
					width: '266px',
					height: '38px'
				},
				verifyStatus: false, //拖拽验证状态
				/*登录表单的表单验证规则*/
				RegisterRules: {
					account: [{
							required: true,
							message: '注册账号不能为空',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '账号至少6位，至多12位',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '密码至少6位，至多12位',
							trigger: 'blur'
						}
					],
					password1: [{
						validator: checkPwd,
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			verify(status) { //拖拽滑块验证的状态
				this.verifyStatus = status;
			},
			userRegister(){
				this.$refs.UserRegisterFormRef.validate(async valid =>{
					if(valid && this.verifyStatus){//表单内容填写正确 并且 滑块拖拽成功后，执行下一部分发起登录请求操作
						var formData = new FormData();
						formData.append('account',this.UserRegisterForm.account);
						formData.append('password',this.UserRegisterForm.password);
						const {data:res} = await this.$http.put("/api/adduser",formData);
						// const {data:res} = await this.$http.post("/adduser",this.UserRegisterForm);
						if(res == "success"){
							this.$message.success("注册成功！请登录！");
							this.$router.push({path:"/main"});//路由跳转至main页面
						}else{
							this.$message.error("注册失败账号重复！请重新尝试！");
							return;
						}
					}else if(valid && !this.verifyStatus){
						this.$message.error('请滑动滑块进行验证！');
						return;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.login_container {
		//总盒子
		background: url(//pages.anjukestatic.com/usersite/site/img/PlugLogin/bg.jpg) center center no-repeat;
		height: 100%;
	}

	.login_box {
		//登录盒子
		width: 400px;
		height: 450px;
		background-color: white;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border-radius: 5px;
		overflow: hidden;

		.title_box {
			//登录中的标题
			height: 100px;
			width: 100%;
			text-align: center;
			line-height: 100px;
			font-size: 30px;
			//border-bottom: 2px solid black;
		}

		.login_msg {
			//登录中的登录信息，账号密码等
			height: 273px;
			width: 100%;
			padding: 0 26px;
			text-align: center;
			margin-top: 25px;
			box-sizing: border-box;
		}
	}
</style>
