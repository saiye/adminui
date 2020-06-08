<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="商户列表" :inline="true" name="list">
      <el-form :inline="true" :model="form_list" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="form_list.company_name" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form_list.real_name" placeholder="请输入联系人名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form_list.region" clearable placeholder="请选择国家">
            <el-option
              v-for="item in state"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-date-picker
          v-model="form_list.listDate"
          type="datetimerange"
          align="right"
          :picker-options="pickerOptions"
          start-placeholder="请选择起始日期"
          end-placeholder="请选择结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearchList" round>查询</el-button>
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="24">
          <el-button
            size="mini"
            style="float: right;margin-right: 20px;margin-bottom: 10px;"
            @click="dialogVisible=true"
            round
          >添加商户</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="BusinessLoading"
        :data="tableBusinessData"
        border
        stripe
        highlight-current-row
        header-cell-class-name="table-header-class"
        style="width:100%"
      >
        <el-table-column prop="company_id" label="序号"></el-table-column>
        <el-table-column prop="manage.account" label="账号"></el-table-column>
        <el-table-column prop="company_name" label="商户名称"></el-table-column>
        <el-table-column prop="state.name" label="国家"></el-table-column>
        <el-table-column prop="manage.real_name" label="联系人"></el-table-column>
        <el-table-column prop="manage.phone" label="联系电话"></el-table-column>
        <el-table-column prop="created_at" label="注册日期"></el-table-column>
        <el-table-column prop="check" label="状态"></el-table-column>

        <el-table-column align="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleBusinessCheck(scope.$index, scope.row)" round>冻结</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              background
              v-if="BusinessPaginate.total > 0"
              :page-sizes="BusinessPaginate.pageSizes"
              :page-size="BusinessPaginate.pageSize"
              :layout="BusinessPaginate.layout"
              :total="BusinessPaginate.total"
              :current-page="BusinessPaginate.pageIndex"
              @current-change="handleBusinessChangePage"
              @size-change="handleBusinessChangeSize"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog title="添加商户" :visible.sync="dialogVisible" width="700px">
        <div class="add-dialog-box">
          <el-form ref="form" :model="dialog_form" label-width="80px">
            <el-form-item label="商户名称">
              <el-input v-model="dialog_form.company_name"></el-input>
            </el-form-item>
            <el-form-item label="所在国家">
              <el-select v-model="dialog_form.state_id" clearable placeholder="请选择活动区域">
                <el-option
                  v-for="item in state"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="营业执照">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog
                width="30%"
                title="营业执照-原图"
                :visible.sync="dialogImgVisible"
                append-to-body
              >
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>

            <el-form-item label="联系人">
              <el-input v-model="dialog_form.real_name">
                <template slot="append">
                  <el-radio v-model="dialog_form.sex" label="1">男</el-radio>
                  <el-radio v-model="dialog_form.sex" label="2">女</el-radio>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="dialog_form.phone">
                <template slot="prepend">+86中国大陆</template>
              </el-input>
            </el-form-item>

            <el-form-item label="分成比例">
              <el-input v-model="dialog_form.proportion"></el-input>
            </el-form-item>
            <el-form-item label="商户账号">
              <el-input v-model="dialog_form.account"></el-input>
            </el-form-item>
            <el-form-item label="商户密码">
              <el-input v-model="dialog_form.password" show-password></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="businessDialogCance">取 消</el-button>
          <el-button type="primary" @click="businessDialogConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="商户审核" name="check">
      <el-form :inline="true" :model="check_list" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="check_list.company_name" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="check_list.real_name" placeholder="请输入联系人名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="check_list.region" clearable placeholder="请选择国家">
            <el-option
              v-for="item in state"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-date-picker
          v-model="check_list.listDate"
          type="datetimerange"
          align="right"
          :picker-options="pickerOptions"
          start-placeholder="请选择起始日期"
          end-placeholder="请选择结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearchCheckList" round>查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="BusinessCheckLoading"
        :data="tableCheckBusinessData"
        border
        stripe
        highlight-current-row
        header-cell-class-name="table-header-class"
        style="width:100%"
      >
        <el-table-column prop="company_id" label="序号"></el-table-column>
        <el-table-column prop="manage.account" label="账号"></el-table-column>
        <el-table-column prop="company_name" label="商户名称"></el-table-column>
        <el-table-column prop="state.name" label="国家"></el-table-column>
        <el-table-column prop="manage.real_name" label="联系人"></el-table-column>
        <el-table-column prop="manage.phone" label="联系电话"></el-table-column>
        <el-table-column prop="created_at" label="注册日期"></el-table-column>
        <el-table-column prop="check" label="状态"></el-table-column>
        <el-table-column align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleCheckPass(scope.$index, scope.row)"
              round
            >通过</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleCheckReject(scope.$index, scope.row)"
              round
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              background
              v-if="BusinessCheckPaginate.total > 0"
              :page-sizes="BusinessCheckPaginate.pageSizes"
              :page-size="BusinessCheckPaginate.pageSize"
              :layout="BusinessCheckPaginate.layout"
              :total="BusinessCheckPaginate.total"
              :current-page="BusinessCheckPaginate.pageIndex"
              @current-change="handleBusinessChangePage"
              @size-change="handleBusinessChangeSize"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import {
  addCompany,
  companyList,
  checkCompany,
  getStateData
} from "@/api/company";
export default {
  data() {
    return {
      dialogVisible: false,
      activeName: "list",
      formLabelWidth: "120px",
      tableBusinessData: [],
      tableCheckBusinessData: [],
      BusinessPaginate: {
        total: 0, // 总数
        pageIndex: 1, // 当前位于哪页
        pageSize: 15, // 1页显示多少条
        pageSizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      BusinessCheckPaginate: {
        total: 0, // 总数
        pageIndex: 1, // 当前位于哪页
        pageSize: 15, // 1页显示多少条
        pageSizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      dialogImageUrl: "",
      dialogImgVisible: false,
      BusinessLoading: false,
      BusinessCheckLoading: false,
      CheckLoading: false,
      form_list: {
        account: "",
        company_name: "",
        real_name: "",
        region: [],
        start_date: "",
        end_date: "",
        listDate: "",
        page: 1,
        limit: 15,
        check: [0, 2]
      },
      check_list: {
        account: "",
        company_name: "",
        real_name: "",
        region: [],
        start_date: "",
        end_date: "",
        listDate: "",
        page: 1,
        limit: 15,
        check: [0, 2]
      },
      dialog_form: {
        company_name: "",
        state_id: "",
        real_name: "",
        phone: "",
        proportion: 100,
        account: "",
        password: "",
        sex: 1
      },
      state: null,
      check: [1, 2],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.loadBusinessListData();
    this.loadStateData();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab.name);
      if (tab.name == "list") {
        this.loadBusinessListData();
      } else {
        this.loadCheckListData();
      }
    },
    loadBusinessListData() {
      this.form_list.check = [1];
      (this.form_list.limit = this.BusinessPaginate.pageSize),
        (this.form_list.page = this.BusinessPaginate.pageIndex),
        companyList(this.form_list)
          .then(response => {
            this.tableBusinessData = response.data.data.data;
            this.loading = false;
            this.BusinessPaginate.total = response.data.data.total;
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            console.log("add role onSubmit");
          });
    },
    loadStateData() {
      getStateData()
        .then(response => {
          this.state = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {});
    },
    loadCheckListData() {
      this.check_list.check = [0, 2];
      (this.check_list.limit = this.BusinessPaginate.pageSize),
        (this.check_list.page = this.BusinessPaginate.pageIndex),
        companyList(this.check_list)
          .then(response => {
            this.tableCheckBusinessData = response.data.data.data;
            this.loading = false;
            this.BusinessCheckPaginate.total = response.data.data.total;
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            console.log("add role onSubmit");
          });
    },
    handleBusinessChangePage(page) {
      (this.check_list.page = page), this.loadBusinessListData();
    },
    onSearchList() {},
    onSearchCheckList() {},
    handleBusinessChangeSize(pageSize) {
      this.paginations.pageSize = pageSize;
      this.loadBusinessListData();
    },
    onSubmit() {
      console.log("submit!");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogImgVisible = true;
    },
    businessDialogCance() {
      this.dialogVisible = false;
    },
    businessDialogConfirm() {
      addCompany(this.dialog_form)
        .then(response => {
          this.dialogVisible = false;
          this.loadBusinessListData();
          this.loadCheckListData();
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          console.log("add role onSubmit");
        });
    },
    handleCheckPass(index, row) {
      let param = {
        check: 1,
        company_id: row.company_id
      };
      checkCompany(param)
        .then(response => {
          console.log("ok");
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          console.log("add role onSubmit");
        });
    },
    handleCheckReject(index, row) {
      let param = {
        check: 2,
        company_id: row.company_id
      };
      checkCompany(param)
        .then(response => {
          console.log("ok");
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(function() {
          console.log("add role onSubmit");
        });
    }
  }
};
</script>

<style>
.add-dialog-box {
  width: 600px;
}
</style>

