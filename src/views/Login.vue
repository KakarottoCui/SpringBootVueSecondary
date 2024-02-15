<template>
	<!-- 管理员用户登录界面 -->
	<div class="login_container">
		<div class="login_box">
			<div class="title_box">详询微dabocode</div>
			<hr align="center" width="86%" color="dodgerblue" size="2" style="margin-top: 0;margin-bottom: 0;"/>
			<div class="login_msg">
				<el-form 
				ref="loginFormRef"
				:model="loginForm" 
				:rules="loginRules" 
				label-width="80px" 
				label-position="center">
					<!-- 用户名 -->
					<el-form-item label="账 号：" prop="phone">
						<el-input 
						v-model.number="loginForm.phone"
						placeholder="请输入管理员账号" 
						prefix-icon="el-icon-user" ></el-input><!-- 数据绑定（数字类型） 文字提示  输入框前部图标-->
					</el-form-item>
					<!-- 密码 -->
					<el-form-item label="密 码：" prop="password">
						<el-input 
						v-model="loginForm.password" 
						type="password" 
						placeholder="请输入密码" 
						prefix-icon="el-icon-lock"></el-input>
					</el-form-item>
					<!-- 拖拽验证 -->
					<el-form-item label="验 证：">
						<Verify 
						:type='3' 
						:showButton='false' 
						:barSize='verifySize'
						@success="verify(true)"
						@eooro="verify(false)"></Verify>
					</el-form-item>
					<!-- 按钮 -->
					<el-form-item label-width="0px">
						<el-button type="primary" @click="login">登录</el-button>
					</el-form-item>
				</el-form>				
			</div>	
		</div>
	</div>
</template>

<script>
import Verify from 'vue2-verify'
import { Message } from 'element-ui'
export default {
	components:{
		Verify//拖拽滑块验证
	},
	data() {
		return{
			/*登录表单元素的初始值*/
			loginForm:{
				phone:'',
				password:'',
				
			},
			verifySize: { width: '266px', height: '38px' },
			verifyStatus:false,//拖拽验证状态
			/*登录表单的表单验证规则*/
			loginRules:{
				phone:[
					{ required: true, message: '登录账号不能为空', trigger: 'blur' },
					{ type:'number', min:10000000000, max:99999999999, message: '账号必须为11位数字', trigger: 'blur' }
				],
				password:[
					{ required: true, message: '密码不能为空', trigger: 'blur' },
					{ min:6, max:12, message: '密码为6位至12位',trigger:'blur'}
				]
			}
		}
	},
	methods:{
		verify(status){//拖拽滑块验证的状态
			this.verifyStatus = status;
		},
		login(){//登录
			this.$refs.loginFormRef.validate(async valid => {//点击登录后进行表单内容预验证，返回值为布尔值valid
				//console.log(this.$refs.loginFormRef.validate());
				if(valid && this.verifyStatus){//表单内容填写正确 并且 滑块拖拽成功后，执行下一部分发起登录请求操作
					const {data:res} = await this.$http.post("/api/adminlogin",this.loginForm);//请求test页面并把返回值存入res中
					if(res.loginFlag == "adminLoginSuccess"){
						this.$message.success("登录成功！");
						window.sessionStorage.setItem("admin1",res.admin1)//存储admin对象
						this.$router.push({path:"/home"});//路由跳转至home页面
						//console.log(res.admin1);
					}else{
						this.$message.error("登录失败！账号或密码错误！");
						this.$http.post("/api/login")
						return;
					}
					//console.log(res);
					
				}else if(valid && !this.verifyStatus){
					this.$message.error('请滑动滑块进行验证！');
					//console.log('0');
					return;
				}else{
					//console.log('-1');
					return;
				}
			})
		}		
	}
}
</script>

<style lang="less" scoped>
	 .login_container{ //总盒子
		 background-color: #BBE6D6;
		 height: 100%;
	 }
	 .login_box{//登录盒子
		width: 400px;
		height: 400px;
		background-color: white;
		position:absolute;
		left:0;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border-radius: 15px;
		overflow: hidden;
		
		.title_box{//登录中的标题
			height: 100px;
			width: 100%;
			text-align: center;
			line-height: 100px;
			font-size: 30px;
			//border-bottom: 2px solid black;
		}
		
		.login_msg{//登录中的登录信息，账号密码等
			height: 273px;
			width: 100%;
			padding: 0 26px;
			text-align: center;
			margin-top: 25px;
			box-sizing: border-box;
		}
	}
</style>
