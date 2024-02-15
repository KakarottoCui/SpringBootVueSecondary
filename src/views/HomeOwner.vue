<template>
	<div>
		<div>
			<el-input placeholder="请输入您要搜索房东认证申请记录的用户账号" v-model="OARecordsInfo.account">
				<el-button slot="append" icon="el-icon-search" @click="getOARecordList"></el-button>
			</el-input>
		</div>
		<div class="table">
			<el-table :data="ownerApplyList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="申请人账号" prop="account"></el-table-column>
				<el-table-column label="申请人姓名" prop="name"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="info" size="small" @click="applydetail=true,getApplyDetail(scope.row)">查看详情</el-button>
						<el-button type="primary" size="small" @click="OAsubmit(scope.row.account)">通过</el-button>
						<el-button type="primary" size="small" @click="OArefuse(scope.row.account)">拒绝</el-button>
						<el-button type="danger" icon="el-icon-delete" size="small" @click='deleteOARecord(scope.row.account)'></el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<div>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-size="OARecordsInfo.pageSize"
			 layout="total, prev, pager, next, jumper" :total="OARecords" style="padding-left: 30%;">
			</el-pagination>
		</div>
		
		<el-dialog
		  title="申请内容详情"
		  :visible.sync="applydetail">
			  <el-form  label-position="right" :model="ownerApplyForm" label-width="85px">
			  	<!-- 账号 -->
			  	<el-form-item label="当前账号:">
			  		<el-input v-model="ownerApplyForm.account" ></el-input>
			  	</el-form-item>
			  	<!-- 姓名 -->
			  	<el-form-item label="姓名:" prop="name" style="width: 50%;display: inline-block;" >
			  		<el-input v-model="ownerApplyForm.name" ></el-input>
			  	</el-form-item>
			  	<!-- 性别 -->
			  	<el-form-item label="性别:" style="display: inline-block;">
			  		<el-radio v-model="ownerApplyForm.gender"  label="1"> 男</el-radio>
			  		<el-radio v-model="ownerApplyForm.gender"  label="2"> 女</el-radio>
			  	</el-form-item>
			  	<!-- 家庭住址 -->
			  	<el-form-item label="家庭住址:" style="display: inline-block; width: 80%;">
			  		<el-cascader v-model="ownerApplyForm.homeID" size="large" :options="options" ></el-cascader>
			  	</el-form-item>
			  	<!-- 年龄 -->
			  	<el-form-item label="年龄:" prop="age" style="display: inline-block;">
			  		<el-input-number v-model="ownerApplyForm.age" controls-position="right" :min="1" :max="120" step-strictly ></el-input-number>
			  	</el-form-item>
			  	<!-- 详细住址 -->
			  	<el-form-item label="当前住址:" prop="addressDetail">
			  		<el-input v-model="ownerApplyForm.addressDetail" type="textarea" ></el-input>
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
			  </el-form>
			  <el-dialog title="图片详情" :visible.sync="showbigIDpic" append-to-body>
				  <img :src="showBigBase64" style="width: 100%;"/>
			  </el-dialog>
			  <div style="width: 100%;height: 200px;overflow: scroll;">
				  <img :src="showIDpic[0]" @click="showbigIDpic=true,showBig(showIDpic[0])"/>
				  <img :src="showIDpic[1]" @click="showbigIDpic=true,showBig(showIDpic[1])"/>
			  </div>
		  </el-dialog>
		  <el-dialog :visible.sync="refuseDialog" width="30%" title="请选择拒绝理由">
			  <el-form>
				  <el-form-item>
					 
					    <el-radio-group v-model="refuseReaNo">
					      <el-radio :label="1" class="refuseRadio">个人信息填写不符合要求。</el-radio>
					      <el-radio :label="2" class="refuseRadio">身份证照片不符合要求。</el-radio>
					      <el-radio :label="3" class="refuseRadio">其他原因。</el-radio>
					    </el-radio-group>
				  </el-form-item>
				  <el-form-item label-width="42%">
				  	<el-button type="primary" @click="refuseApply">确认</el-button>
				  </el-form-item>
			  </el-form>
			  
		  </el-dialog>
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
		
		//该页面创建
		created() {
			this.getOARecordList();
		},
		
		data() {
			return {
				
				
				options: regionData,//家庭住址选择器样式
				
				OARecordsInfo: {
					account: '',//存放要查询申请记录的用户账号
					pageStart: 1,//页面初始
					pageSize: 8,//页面长度
				},
				
				ownerApplyList: [], //存放查询出来的所有申请列表
				OARecords: 0, //记录数
				
				applydetail:false,//申请详情页面
				showbigIDpic:false,//展示大图片
				
				ownerApplyForm: {
					account: 'test',
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
				showIDpic:[],
				showBigBase64:'',
				
				refuseDialog:false,//拒绝理由窗口开关标志
				refuseReaNo:1,//拒绝理由号
				refuseAccount:'',//存放要拒绝用户的账号
			}
		},
		methods:{
			
			test(){
				console.log(this.ownerApplyForm.IDpic[0])
			},
			
			//获取所有用户
			async getOARecordList() {
				//console.log(this.userInfo.pageSize);
				const {
					data: res
				} = await this.$http.get("/api/findAllOAList", {
					params: this.OARecordsInfo
				});
				this.ownerApplyList = res.ownerApplyList;
				this.OARecords = res.OARecords;
				//console.log(res.ownerApplyList);
				//console.log(123);
			},
			
			//查看指定用户的信息
			async getApplyDetail(user1){
				this.ownerApplyForm.account = user1.account;
				this.ownerApplyForm.name = user1.name;
				this.ownerApplyForm.gender = user1.gender.toString();
				this.ownerApplyForm.homeID = user1.homeId;
				this.ownerApplyForm.age = user1.age;
				this.ownerApplyForm.addressDetail = user1.addressDetail;
				this.ownerApplyForm.phone = user1.phone;
				this.ownerApplyForm.vx = user1.vx;
				this.ownerApplyForm.houseNum = user1.houseNum;
				this.ownerApplyForm.roomNum = user1.roomNum;
				this.ownerApplyForm.description = user1.description;
				this.ownerApplyForm.IDpic = user1.iDpic;
				//修改格式，src显示
				this.showIDpic[0] = 'data:image/jpg;base64,'+this.ownerApplyForm.IDpic[0];
				this.showIDpic[1] = 'data:image/jpg;base64,'+this.ownerApplyForm.IDpic[1];
			},
			
			showBig(base64){
				this.showBigBase64 = base64;
			},
			
			//通过申请
			async OAsubmit(account){
				let formData = new FormData();
				formData.append('account', account);
				//修改对应账户权限
				const {
					data: res
				} = await this.$http.put('/api/submitApply', formData);
				
				//将该条申请状态更改为申请通过状态 值为1
				const {
					data: res1
				} = await this.$http.delete("/api/updateOARecord?account=" + account);
				
				if(res1 != "success"){
					this.$message.error("操作失败，服务器错误！");
					return;
				}
				this.$message.success("操作成功！")
				//重新获取数据
				this.getOARecordList();
			},
			
			//打开拒绝申请窗口
			OArefuse(account){
				this.refuseDialog = true;
				this.refuseAccount = account;
			},
			
			//拒绝操作
			async refuseApply(){
				let formData = new FormData();
				formData.append('account', this.refuseAccount);
				formData.append('refusereason',this.refuseReaNo);
				
				const {
					data: res
				} = await this.$http.put('/api/refuseOARecord', formData);
				
				if(res == "success"){
					this.$message.success("拒绝成功！");
					//关闭窗口
					this.refuseDialog = false;
					this.getOARecordList();	
					return;
				}else{
					this.$message.error("操作失败请重试");
					this.refuseDialog = false;
					return;
				}
			},
			
			// 删除指定用户
			async deleteOARecord(account) {
				const confirRes = await this.$confirm('确认拒绝该用户申请？删除后不可恢复', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if (confirRes != 'confirm') {
					//取消
					return this.$message.info("已取消")
				}
				const {
					data: res
				} = await this.$http.delete("/api/deleteRecordByaccount?account=" + account);
				if (res != "success") {
					return this.$message.error("删除失败！");
				}
				this.$message.success("删除成功！");
				this.getOARecordList();
			},
			//页面长度
			handleSizeChange(newSize) {
				this.OARecordsInfo.pageSize = newSize;
				//this.$message.info(newSize);
				this.getOARecordList();
			},
			//分页获取指定页面
			handleCurrentChange(newPage) {
				this.OARecordsInfo.pageStart = newPage;
				this.getOARecordList();
			},
		}
	}
</script>

<style lang="less" scoped>
	.table {
			margin-top: 15px;
		}
	img{
		width: 48%;
		margin-left: 3px;
	}
	.refuseRadio{
		display: block;
		margin-top: 5px;
	}

</style>
