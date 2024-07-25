<template>
  <div class="container">
    <div class="container-body">
      <div class="top">
        <img class="logo" src="/static/logo.png" alt="" />
      </div>
      <div class="block1">
        <div class="block1_1">
          欢迎使用<span style="color: #06d8ed">憨猴</span>生态浏览器
        </div>
        <div class="block1_2">Welcome to use Hanhou Eco Browser</div>
      </div>
      <div class="block2 total_box">
        <div class="total_box_1">
          <img class="icon" src="/static/total3.png" alt="" />
          <span class="title">今日流转数量</span>
        </div>
        <div class="total_box_2">{{ overviewData.day_transaction_num }}</div>
      </div>
      <div class="block3 total_box">
        <div class="total_box_1">
          <img class="icon" src="/static/total1.png" alt="" />
          <span class="title">最新区块高度</span>
        </div>
        <div class="total_box_2">{{ overviewData.chain_height }}</div>
      </div>
      <div class="block4 total_box">
        <div class="total_box_1">
          <img class="icon" src="/static/total2.png" alt="" />
          <span class="title">累计流转数量</span>
        </div>
        <div class="total_box_2">{{ overviewData.total_transaction_num }}</div>
      </div>
      <div class="block5">
        <input
          class="keyword"
          type="text"
          placeholder="请输入流转哈希/区块高度/TokenID搜索"
          v-model="params.value"
          @keyup="handEntSearch"
        />
        <div class="vertical"></div>
        <div class="search" @click="handSearch">搜索</div>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="max-width: 100%"
          @sort-change="sortChange"
        >
          <el-table-column prop="transaction_hash" label="流转哈希">
            <template #default="scope">
              <span class="ent nowrap" @click="handGoInfo(scope.row)">{{
                scope.row.transaction_hash
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="transaction_time"
            label="流转时间"
            sortable="custom"
          >
            <template #default="scope">
              <div class="nowrap">
                {{
                  dayjs(scope.row.chain_time * 1000).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="form_address" label="发送者">
            <template #default="scope">
              <div class="nowrap">{{ scope.row.form_address }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="to_address" label="接收者">
            <template #default="scope">
              <div class="nowrap">{{ scope.row.to_address }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="chain_type" label="流转类型">
            <template #default="scope">
              <div class="nowrap">
                <span v-if="scope.row.chain_type === 1">integral</span>
                <span v-else-if="scope.row.chain_type === 2">contribute</span>
                <span v-else-if="scope.row.chain_type === 3">nft</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="option_type" label="操作类型">
            <template #default="scope">
              <div class="nowrap">
                <span v-if="scope.row.option_type === 1">mint</span>
                <span v-else-if="scope.row.option_type === 2">transfer</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="block_chain_height" label="区域高度">
            <template #default="scope">
              <div class="nowrap">
                <span class="ent" @click="handGoInfo(scope.row)">{{
                  scope.row.block_chain_height
                }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page_control">
        <el-pagination
          v-model:current-page="params.page"
          v-model:page-size="params.page_size"
          :default-page-size="params.page_size"
          :small="true"
          :disabled="false"
          :background="true"
          layout="prev, pager, next, jumper"
          :total="total_count"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createApp, ref, reactive, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import axios from "../../request/index";
import { browser_overview, browser_transactionList } from "../../request/api";
import dayjs from "dayjs";
// import { ElMessage } from "element-plus";

interface SearchData {
  page: number;
  page_size: number;
  value: string;
  order: number;
}
interface OverviewData {
  chain_height: any;
  day_transaction_num: any;
  total_transaction_num: any;
}
interface TableItem {
  transaction_hash: string;
  chain_time: any;
}

const app = createApp({});
console.log("app", app);

const router = useRouter();

const loading = ref(false);

const overviewLoading = ref(false);

let timer: any = null;
const overviewData = ref<OverviewData>({
  chain_height: 0,
  day_transaction_num: 0,
  total_transaction_num: 0,
});
let total_count = ref(0);
let tableData = ref<TableItem[]>([]);
const params = ref<SearchData>({
  page: 1,
  page_size: 10,
  value: "",
  order: 1, //1倒序 2正序
});
const getOverview = () => {
  const req = () => {
    overviewLoading.value = true;
    axios
      .get(browser_overview, {
        params: {},
      })
      .then((res: any) => {
        console.log(res);
        overviewLoading.value = false;
        if (res.code !== 200) {
          clearTimeout(timer);
          return ElMessage.error(res.msg);
        }
        overviewData.value = res.data;
      });
  };
  req();
  timer = setInterval(() => {
    req();
  }, 10000);
};
// 获取表格数据
const getList = () => {
  loading.value = true;
  axios.post(browser_transactionList, params.value).then((res: any) => {
    loading.value = false;
    if (res.code !== 200) {
      return ElMessage.error(res.msg);
    }
    tableData.value = res.data.list;
    total_count.value = res.data.total_count;
    if (
      res.data.total_count === 1000 &&
      Math.ceil(res.data.total_count / params.value.page_size) ===
        params.value.page
    ) {
      console.log("1000");
      ElMessage({
        type: "warning",
        message: "最多显示1000条数据,如没有找到数据请使用精准搜索",
        duration: 5000,
      });
    }
  });
};
// 点击按钮搜索
const handSearch = () => {
  params.value.page = 1;
  getList();
};
//回车搜索
const handEntSearch = (e: any) => {
  if (e.keyCode !== 13) return false;
  e.target.blur();
  params.value.page = 1;
  getList();
};

// 页码改变
const handleCurrentChange = () => {
  console.log(params);
  getList();
};
// 表格排序
const sortChange = (e: any) => {
  console.log(e);

  if (e.order === "ascending") {
    // 升序
    params.value.order = 2;
  } else if (e.order === "descending") {
    // 降序
    params.value.order = 1;
  } else {
    // 正常顺序
    params.value.order = 1;
  }
  getList();
};
// 进入详情
const handGoInfo = (item: TableItem) => {
  console.log(item);
  router.push({
    path: "/info",
    query: {
      transaction_hash: item.transaction_hash,
    },
  });
};
// 挂载前钩子
onBeforeMount(() => {
  getOverview();
  getList();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped lang="less">
.container {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #0d0c10;
  background-image: url("/static/background.png");
  background-size: 604px 531px;
  background-position: 723px 85px;
  background-repeat: no-repeat;
  .container-body {
    position: relative;
    .top {
      position: relative;
      height: 89px;
      border-bottom: 1px solid #616161;
      .logo {
        position: absolute;
        top: 17px;
        left: 48px;
        width: 140px;
        height: 48px;
      }
    }
    .block1 {
      position: absolute;
      top: 151px;
      left: 54px;
      .block1_1 {
        font-size: 46px;
        font-weight: 500;
        line-height: 63.94px;
        text-align: left;
        letter-spacing: 0.03em;
      }
      .block1_2 {
        margin-top: 9px;
        font-family: PingFang HK;
        font-size: 18px;
        font-weight: 500;
        line-height: 25.02px;
        letter-spacing: 0.03em;
        text-align: left;
      }
    }
    .block2 {
      position: absolute;
      left: 934px;
      top: 141px;
    }
    .block3 {
      position: absolute;
      left: 686px;
      top: 293px;
    }
    .block4 {
      position: absolute;
      left: 1124px;
      top: 319px;
    }

    .total_box {
      display: flex;
      flex-direction: column;
      min-width: 220px;
      min-height: 120px;
      border: 1px solid #616161;
      border-radius: 19px;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(7px);
      .total_box_1 {
        display: flex;
        align-items: center;
        padding-top: 17px;
        padding-left: 27px;
        .icon {
          width: 38px;
          height: 38px;
        }
        .title {
          text-indent: 6.32px;
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 500;
          line-height: 22.24px;
          letter-spacing: 0.03em;
          color: #d3d3d3;
        }
      }
      .total_box_2 {
        padding-top: 10.9px;
        padding-left: 27px;
        font-family: Sintony;
        font-size: 32px;
        font-weight: 700;
        line-height: 44.48px;
        text-align: left;
        color: #ffffff;
      }
    }
    .block5 {
      position: absolute;
      left: 55px;
      top: 319px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 498px;
      height: 68px;
      border: 1px solid #606060;
      border-radius: 13px;
      box-shadow: 0 0 0px 6px #202020;
      .keyword {
        flex: 1;
        height: 68px;
        padding: 0 18px;
        border-radius: 13px 0 0 13px;
        border: none;
        // outline: none;
        font-size: 18px;
        font-weight: 400;
        line-height: 30.6px;
        letter-spacing: 0.05em;
        background-color: transparent;
        color: #fff;
      }
      .vertical {
        width: 1px;
        height: 24px;
        background-color: #b8b8b8;
      }
      .search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 77px;
        height: 68px;
        border-radius: 0 13px 13px 0;
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 400;
        text-align: center;
        color: #06d8ed;
        user-select: none;
        cursor: pointer;
        &:active {
          opacity: 0.7;
        }
      }
    }
    .content {
      margin: 380px 48px 0 48px;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(7px);
      border: 1px solid #606060;
      border-radius: 13px;
      padding: 26px 40px;

      :deep(.el-table) {
        --el-table-border: 1px solid #606060;
        --el-table-text-color: #ffffff;
        --el-table-header-text-color: #ffffff;
        --el-table-bg-color: transparent;
        --el-table-header-bg-color: transparent;
        --el-table-tr-bg-color: transparent;
        --el-table-row-hover-bg-color: transparent;
        --el-table-border-color: transparent;
        font-family: PingFang HK;
        font-size: 16px;
        font-weight: 400;
        line-height: 22.24px;
        letter-spacing: 0.03em;
      }
      :deep(.el-table .el-table__cell) {
        padding: 28px 0;
      }

      .ent {
        color: #06d8ed;
        cursor: pointer;
      }
    }
    .page_control {
      display: flex;
      justify-content: flex-end;
      margin: 24px 48px;
      :deep(.el-pagination.is-background .btn-next),
      :deep(.el-pagination.is-background .btn-prev),
      :deep(.el-pagination.is-background .el-pager li:not(.disabled)) {
        /* 进行修改未选中背景和字体 */
        background-color: transparent;
        font: PingFang HK 16px none;
        color: #fff;
        // border: 1px solid #07e7f9;
      }
      :deep(
          .el-pagination.is-background .el-pager li:not(.is-disabled).is-active
        ) {
        /* 进行修改选中背景和字体 */
        background-color: transparent;
        color: #07e7f9;
        border: 1px solid #07e7f9;
      }
      :deep(.el-input__wrapper) {
        border: 1px solid #606060;
        background-color: transparent;
      }
      :deep(.el-pagination__jump) {
        color: #fff;
      }
    }
  }
}
</style>