<template>
  <div class="trading-account-form form-container">
    <div class="form-title">交易账户</div>

    <el-form
      :model="formData"
      label-width="120px"
      label-position="right"
      class="account-form"
    >
      <el-row :gutter="16">
        <!-- 账户 -->
        <el-col :span="12">
          <el-form-item label="账户" required>
            <el-select
              v-model="formData.portfolio"
              placeholder="请选择"
              filterable
              style="width: 100%"
              @change="handlePortfolioChange"
            >
              <el-option
                v-for="item in portfolioOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 账户名称 -->
        <el-col :span="12">
          <el-form-item label="账户名称">
            <el-input
              v-model="formData.portfolioName"
              placeholder="自动带出"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <!-- 交易对手 -->
        <el-col :span="12">
          <el-form-item label="交易对手" required>
            <el-select
              v-model="formData.counterparty"
              placeholder="请选择"
              filterable
              style="width: 100%"
              @change="handleCounterpartyChange"
            >
              <el-option
                v-for="item in counterpartyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 交易对手名称 -->
        <el-col :span="12">
          <el-form-item label="交易对手名称">
            <el-input
              v-model="formData.counterpartyName"
              placeholder="自动带出"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TradingAccount, PortfolioOption, CounterpartyOption } from '@/types'

interface Props {
  modelValue: TradingAccount
}

interface Emits {
  (e: 'update:modelValue', value: TradingAccount): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单数据
const formData = reactive<TradingAccount>({ ...props.modelValue })

// 账户选项（示例数据）
const portfolioOptions: PortfolioOption[] = [
  { value: 'PORT001', label: 'PORT001', name: '投资组合A' },
  { value: 'PORT002', label: 'PORT002', name: '投资组合B' },
  { value: 'PORT003', label: 'PORT003', name: '投资组合C' }
]

// 交易对手选项（示例数据）
const counterpartyOptions: CounterpartyOption[] = [
  { value: 'CP001', label: 'CP001', name: '交易对手A银行' },
  { value: 'CP002', label: 'CP002', name: '交易对手B证券' },
  { value: 'CP003', label: 'CP003', name: '交易对手C基金' }
]

// 监听内部变化，同步到外部
watch(
  () => formData,
  (newValue) => {
    emit('update:modelValue', { ...newValue })
  },
  { deep: true }
)

// 监听外部变化，同步到内部
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(formData, newValue)
  },
  { deep: true }
)

// 事件处理
function handlePortfolioChange(value: string) {
  const portfolio = portfolioOptions.find((item) => item.value === value)
  if (portfolio) {
    formData.portfolioName = portfolio.name
  }
}

function handleCounterpartyChange(value: string) {
  const counterparty = counterpartyOptions.find((item) => item.value === value)
  if (counterparty) {
    formData.counterpartyName = counterparty.name
  }
}
</script>

<style lang="scss" scoped>
.trading-account-form {
  max-width: 100%; // 确保不超出容器
  
  .account-form {
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: $text-color-primary;
    }

    :deep(.el-form-item) {
      margin-bottom: 20px;
    }

    // 避免标签和输入框折行
    :deep(.el-form-item__label) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // 确保输入框内容不折行
    :deep(.el-input__inner),
    :deep(.el-select) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :deep(.el-row) {
      margin-bottom: 0;
    }

    :deep(.el-input.is-disabled) {
      .el-input__inner {
        background-color: $bg-color-dark;
        cursor: not-allowed;
      }
    }
  }
}
</style>


