<template>
  <div class="observation-schedule-table">
    <div class="table-header">
      <h3 class="table-title">观察表</h3>
      <div class="table-actions">
        <el-button
          size="small"
          :icon="Download"
          @click="handleExport"
        >
          导出
        </el-button>
      </div>
    </div>

    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      :empty-text="emptyText"
      max-height="500"
    >
      <!-- 期数 -->
      <el-table-column
        prop="period"
        label="期数"
        width="80"
        align="center"
      />

      <!-- 实际观察日 -->
      <el-table-column
        prop="observationDate"
        label="实际观察日"
        width="130"
        align="center"
      >
        <template #default="{ row }">
          {{ formatDate(row.observationDate) }}
        </template>
      </el-table-column>

      <!-- 观察指标 -->
      <el-table-column
        prop="underlyingTicker"
        label="观察指标"
        width="130"
        align="center"
      />

      <!-- 实际定盘价 -->
      <el-table-column
        prop="fixingPrice"
        label="实际定盘价"
        width="130"
        align="right"
      >
        <template #default="{ row }">
          <span v-if="row.fixingPrice">{{ formatNumber(row.fixingPrice) }}</span>
          <span v-else class="empty-value">--</span>
        </template>
      </el-table-column>

      <!-- 敲出价格 -->
      <el-table-column
        prop="koBarrierPrice"
        label="敲出价格"
        width="130"
        align="right"
      >
        <template #default="{ row }">
          {{ formatNumber(row.koBarrierPrice) }}
        </template>
      </el-table-column>

      <!-- 敲入价格 (仅SnowBall显示) -->
      <el-table-column
        v-if="productType === 'SnowBall'"
        prop="kiBarrierPrice"
        label="敲入价格"
        width="130"
        align="right"
      >
        <template #default="{ row }">
          <span v-if="row.kiBarrierPrice">{{ formatNumber(row.kiBarrierPrice) }}</span>
          <span v-else class="empty-value">--</span>
        </template>
      </el-table-column>

      <!-- 潜在票息金额 -->
      <el-table-column
        prop="potentialCouponAmount"
        label="潜在票息金额"
        width="150"
        align="right"
      >
        <template #default="{ row }">
          {{ formatCurrency(row.potentialCouponAmount) }}
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column
        prop="status"
        label="状态"
        width="120"
        align="center"
        fixed="right"
      >
        <template #default="{ row }">
          <el-tag
            :type="getStatusTagType(row.status)"
            size="small"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="tableData.length > 0" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ObservationRow, ProductType } from '@/types'
import dayjs from 'dayjs'

interface Props {
  data: ObservationRow[]
  productType: ProductType | ''
}

const props = defineProps<Props>()

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 计算分页后的表格数据
const tableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.data.slice(start, end)
})

// 空数据提示
const emptyText = computed(() => {
  if (props.data.length === 0) {
    return '暂无数据，请先填写交易信息和结构参数'
  }
  return '暂无数据'
})

// 格式化日期
function formatDate(date: string): string {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化数字
function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '--'
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化货币
function formatCurrency(amount: number): string {
  if (!amount) return '--'
  return `CN¥ ${formatNumber(amount)}`
}

// 获取状态标签类型
function getStatusTagType(status: string): string {
  const statusMap: Record<string, string> = {
    Pending: 'info',
    KnockedOut: 'success',
    KnockedIn: 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    Pending: '待观察',
    KnockedOut: '已敲出',
    KnockedIn: '已敲入'
  }
  return statusMap[status] || '待观察'
}

// 分页事件处理
function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

function handleCurrentChange(val: number) {
  currentPage.value = val
}

// 导出功能
function handleExport() {
  if (props.data.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  // TODO: 实现导出功能
  ElMessage.success('导出功能开发中...')
}
</script>

<style lang="scss" scoped>
.observation-schedule-table {
  background: $bg-color-light;
  border-radius: $border-radius-base;
  padding: $spacing-md;
  max-width: 100%; // 确保不超出容器

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .table-title {
      font-size: 16px;
      font-weight: 600;
      color: $text-color-primary;
    }

    .table-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  :deep(.el-table) {
    .empty-value {
      color: $text-color-placeholder;
    }
  }

  .table-pagination {
    margin-top: $spacing-md;
    display: flex;
    justify-content: flex-end;
  }
}
</style>


