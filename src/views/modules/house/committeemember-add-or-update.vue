<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="业主委员会ID" prop="committeeId">
      <el-input v-model="dataForm.committeeId" placeholder="业主委员会ID"></el-input>
    </el-form-item>
    <el-form-item label="用户ID.与用户表关联" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="用户ID.与用户表关联"></el-input>
    </el-form-item>
    <el-form-item label="委员姓名" prop="memberName">
      <el-input v-model="dataForm.memberName" placeholder="委员姓名"></el-input>
    </el-form-item>
    <el-form-item label="委员手机号" prop="memberMobile">
      <el-input v-model="dataForm.memberMobile" placeholder="委员手机号"></el-input>
    </el-form-item>
    <el-form-item label="委员邮箱" prop="memberMail">
      <el-input v-model="dataForm.memberMail" placeholder="委员邮箱"></el-input>
    </el-form-item>
    <el-form-item label="委员格言" prop="memberMotto">
      <el-input v-model="dataForm.memberMotto" placeholder="委员格言"></el-input>
    </el-form-item>
    <el-form-item label="委员备注" prop="memberRemark">
      <el-input v-model="dataForm.memberRemark" placeholder="委员备注"></el-input>
    </el-form-item>
    <el-form-item label="委员状态" prop="memberStatus">
      <el-input v-model="dataForm.memberStatus" placeholder="委员状态"></el-input>
    </el-form-item>
    <el-form-item label="委员详情" prop="memberContent">
      <el-input v-model="dataForm.memberContent" placeholder="委员详情"></el-input>
    </el-form-item>
    <el-form-item label="委员性别" prop="memberSex">
      <el-input v-model="dataForm.memberSex" placeholder="委员性别"></el-input>
    </el-form-item>
    <el-form-item label="委员教育" prop="memberEducation">
      <el-input v-model="dataForm.memberEducation" placeholder="委员教育"></el-input>
    </el-form-item>
    <el-form-item label="委员民族" prop="memberFolk">
      <el-input v-model="dataForm.memberFolk" placeholder="委员民族"></el-input>
    </el-form-item>
    <el-form-item label="委员年龄" prop="memberAge">
      <el-input v-model="dataForm.memberAge" placeholder="委员年龄"></el-input>
    </el-form-item>
    <el-form-item label="业委会职位ID" prop="memberPositionId">
      <el-input v-model="dataForm.memberPositionId" placeholder="业委会职位ID"></el-input>
    </el-form-item>
    <el-form-item label="逻辑删除字段[0不显示，1显示]" prop="showStatus">
      <el-input v-model="dataForm.showStatus" placeholder="逻辑删除字段[0不显示，1显示]"></el-input>
    </el-form-item>
    <el-form-item label="排序字段" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序字段"></el-input>
    </el-form-item>
    <el-form-item label="创建人名称" prop="createName">
      <el-input v-model="dataForm.createName" placeholder="创建人名称"></el-input>
    </el-form-item>
    <el-form-item label="创建人ID" prop="createBy">
      <el-input v-model="dataForm.createBy" placeholder="创建人ID"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新人名称" prop="updateName">
      <el-input v-model="dataForm.updateName" placeholder="更新人名称"></el-input>
    </el-form-item>
    <el-form-item label="更新人ID" prop="updateBy">
      <el-input v-model="dataForm.updateBy" placeholder="更新人ID"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          committeeId: '',
          userId: '',
          memberName: '',
          memberMobile: '',
          memberMail: '',
          memberMotto: '',
          memberRemark: '',
          memberStatus: '',
          memberContent: '',
          memberSex: '',
          memberEducation: '',
          memberFolk: '',
          memberAge: '',
          memberPositionId: '',
          showStatus: '',
          sort: '',
          createName: '',
          createBy: '',
          createTime: '',
          updateName: '',
          updateBy: '',
          updateTime: ''
        },
        dataRule: {
          committeeId: [
            { required: true, message: '业主委员会ID不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '用户ID.与用户表关联不能为空', trigger: 'blur' }
          ],
          memberName: [
            { required: true, message: '委员姓名不能为空', trigger: 'blur' }
          ],
          memberMobile: [
            { required: true, message: '委员手机号不能为空', trigger: 'blur' }
          ],
          memberMail: [
            { required: true, message: '委员邮箱不能为空', trigger: 'blur' }
          ],
          memberMotto: [
            { required: true, message: '委员格言不能为空', trigger: 'blur' }
          ],
          memberRemark: [
            { required: true, message: '委员备注不能为空', trigger: 'blur' }
          ],
          memberStatus: [
            { required: true, message: '委员状态不能为空', trigger: 'blur' }
          ],
          memberContent: [
            { required: true, message: '委员详情不能为空', trigger: 'blur' }
          ],
          memberSex: [
            { required: true, message: '委员性别不能为空', trigger: 'blur' }
          ],
          memberEducation: [
            { required: true, message: '委员教育不能为空', trigger: 'blur' }
          ],
          memberFolk: [
            { required: true, message: '委员民族不能为空', trigger: 'blur' }
          ],
          memberAge: [
            { required: true, message: '委员年龄不能为空', trigger: 'blur' }
          ],
          memberPositionId: [
            { required: true, message: '业委会职位ID不能为空', trigger: 'blur' }
          ],
          showStatus: [
            { required: true, message: '逻辑删除字段[0不显示，1显示]不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序字段不能为空', trigger: 'blur' }
          ],
          createName: [
            { required: true, message: '创建人名称不能为空', trigger: 'blur' }
          ],
          createBy: [
            { required: true, message: '创建人ID不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateName: [
            { required: true, message: '更新人名称不能为空', trigger: 'blur' }
          ],
          updateBy: [
            { required: true, message: '更新人ID不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/house/committeemember/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.committeeId = data.committeeMember.committeeId
                this.dataForm.userId = data.committeeMember.userId
                this.dataForm.memberName = data.committeeMember.memberName
                this.dataForm.memberMobile = data.committeeMember.memberMobile
                this.dataForm.memberMail = data.committeeMember.memberMail
                this.dataForm.memberMotto = data.committeeMember.memberMotto
                this.dataForm.memberRemark = data.committeeMember.memberRemark
                this.dataForm.memberStatus = data.committeeMember.memberStatus
                this.dataForm.memberContent = data.committeeMember.memberContent
                this.dataForm.memberSex = data.committeeMember.memberSex
                this.dataForm.memberEducation = data.committeeMember.memberEducation
                this.dataForm.memberFolk = data.committeeMember.memberFolk
                this.dataForm.memberAge = data.committeeMember.memberAge
                this.dataForm.memberPositionId = data.committeeMember.memberPositionId
                this.dataForm.showStatus = data.committeeMember.showStatus
                this.dataForm.sort = data.committeeMember.sort
                this.dataForm.createName = data.committeeMember.createName
                this.dataForm.createBy = data.committeeMember.createBy
                this.dataForm.createTime = data.committeeMember.createTime
                this.dataForm.updateName = data.committeeMember.updateName
                this.dataForm.updateBy = data.committeeMember.updateBy
                this.dataForm.updateTime = data.committeeMember.updateTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/house/committeemember/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'committeeId': this.dataForm.committeeId,
                'userId': this.dataForm.userId,
                'memberName': this.dataForm.memberName,
                'memberMobile': this.dataForm.memberMobile,
                'memberMail': this.dataForm.memberMail,
                'memberMotto': this.dataForm.memberMotto,
                'memberRemark': this.dataForm.memberRemark,
                'memberStatus': this.dataForm.memberStatus,
                'memberContent': this.dataForm.memberContent,
                'memberSex': this.dataForm.memberSex,
                'memberEducation': this.dataForm.memberEducation,
                'memberFolk': this.dataForm.memberFolk,
                'memberAge': this.dataForm.memberAge,
                'memberPositionId': this.dataForm.memberPositionId,
                'showStatus': this.dataForm.showStatus,
                'sort': this.dataForm.sort,
                'createName': this.dataForm.createName,
                'createBy': this.dataForm.createBy,
                'createTime': this.dataForm.createTime,
                'updateName': this.dataForm.updateName,
                'updateBy': this.dataForm.updateBy,
                'updateTime': this.dataForm.updateTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
