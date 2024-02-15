<template>
	<div>
		<!-- 搜索部分 -->
		<div>
			<el-input placeholder="请输入要查询用户的账号" v-model="userInfo.account" class="input-with-select">
				<!-- 搜索输入框 -->
				<el-select v-model="userInfo.isOwner" slot="prepend" placeholder="请选择" class="el-select">
					<el-option label="所有用户" value='-1'></el-option>
					<el-option label="普通用户" value='0'></el-option>
					<el-option label="房东用户" value='1'></el-option>
				</el-select>
				<el-button slot="append" icon="el-icon-search" @click='getUserList()'></el-button>
			</el-input>
		</div>
		<!-- 用户列表部分 -->
		<div class="table">
			<el-table :data="userList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="用户账号" prop="account"></el-table-column>
				<el-table-column label="用户密码" prop="password"></el-table-column>
				<el-table-column label="房东权限" prop="owner">
					<!-- 作用域插槽 -->
					<template slot-scope="scope">
						<el-switch v-model="scope.row.owner" @change='changeOwner(scope.row)'></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="small" @click="editDialogVisible=true,editUserPwd=scope.row.password,editUserAccount=scope.row.account"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="small" @click='deleteUser(scope.row.account)'></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 修改密码的对话框 -->
			<el-dialog title="修改用户密码" :visible.sync="editDialogVisible">
				<el-form>
					<el-form-item label="用户账号" :label-width="editWidth">
						<el-input v-model="editUserAccount" disabled></el-input>
					</el-form-item>
					<el-form-item label="用户密码" :label-width="editWidth">
						<el-input v-model="editUserPwd" ></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="editUserPwd=editUserAccount">重设密码为账号</el-button>
					<el-button @click="editDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="editPwd(editUserAccount,editUserPwd)">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 分页 -->
		<div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="userInfo.pageSize"
			 layout="total, prev, pager, next, jumper" :total="userCounts" style="padding-left: 30%;">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {

		created() {
			this.getUserList();
		},

		data() {
			return {
				//查询功能所需要的数据
				userInfo: {
					isOwner: '-1',
					account: '',
					pageStart: 1,
					pageSize: 8,
				},
				userList: [], //用户列表
				userCounts: 0, //总记录数
				editUserAccount:'',//存储要修改密码的账号
				editUserPwd: '', //存储修改用户的新密码
				editDialogVisible: false, // 显示/隐藏修改窗口flag
				editWidth:'100px',
			}
		},
		methods: {
			//获取所有用户
			async getUserList() {
				//console.log(this.userInfo.pageSize);
				const {
					data: res
				} = await this.$http.get("/api/getuser", {
					params: this.userInfo
				});
				this.userList = res.userList;
				this.userCounts = res.userCounts;
				//console.log(123);
			},
			//修改用户房东权限
			async changeOwner(currentLine) {
				var formData = new FormData();
				formData.append('account', currentLine.account);
				
				//查找当前用户是否已经进行过申请
				const {data:res0} = await this.$http.put("/api/findOAByac",formData);
				if(res0.toString() == "false"){
					currentLine.account = !currentLine.account;
					this.$message.error("该用户没有提交申请信息，无法设置为房东！");
					this.getUserList();
					return;
				}
				
				//修改申请记录为已经通过
				this.$http.put("/api/updateOARecord",formData);
				
				const {
					data: res
				} = await this.$http.put('/api/updateuserowner', formData);
				if (res != "success") {
					currentLine.account = !currentLine.account;
					return this.$message.error("修改权限失败！")
				}
				this.$message.success("修改权限成功！");
			},
			//页面长度
			handleSizeChange(newSize) {
				this.userInfo.pageSize = newSize;
				this.getUserList();
			},
			//分页获取指定页面
			handleCurrentChange(newPage) {
				this.userInfo.pageStart = newPage;
				this.getUserList();
			},
			//删除用户操作
			async deleteUser(account) {
				const confirRes = await this.$confirm('确认删除该用户？删除后不可恢复', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirRes != 'confirm') {
					//取消
					return this.$message.info("已取消")
				}
				
				//删除该用户的所有记录
				let formData = new FormData();
				formData.append('account', account);
				const {
					data: searchRes
				} = await this.$http.put('/api/submitApply', formData);
				if(searchRes != "false"){
					this.$http.delete("/api/deleteRecordByaccount?account="+account);
				}
				
				
				//删除该用户
				const {
					data: res
				} = await this.$http.delete("/api/deleteuser?account=" + account);
				if (res != "success") {
					return this.$message.error("删除失败！");
				}
				this.$message.success("删除成功！");
				this.getUserList();
			},
			
			//修改用户密码
			async editPwd(account,pwd) {
				if(pwd==''){
					this.$message.error("密码不能为空，请重新设置");
					return false;
				}
				var formData = new FormData();
				formData.append('account',account);
				formData.append('password',pwd);
				const {data:res} = await this.$http.put("/api/edituser",formData);
				if(res != "success"){
					return this.$message.error("密码修改失败")
				}
				this.$message.success("密码修改成功！");
				this.getUserList();
				this.editDialogVisible = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-select {
		width: 120px;
	}

	.input-with-select {
		background-color: #fff;
		width: 100%;
	}

	.table {
		margin-top: 15px;
	}
</style>
