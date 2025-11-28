<template>
  <div class="trade-information-form form-container">
    <div class="form-title">交易信息</div>

    <el-form
      :model="formData"
      label-width="100px"
      label-position="right"
      class="trade-form"
    >
      <!-- 第1行：产品结构 | 挂钩类型 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="产品结构" required>
            <el-select
              v-model="formData.productStructure"
              placeholder="请选择"
              style="width: 100%"
              @change="handleProductStructureChange"
            >
              <el-option label="雪球期权 (SnowBall)" value="SnowBall" />
              <el-option label="自动敲出 (AutoCall)" value="AutoCall" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="挂钩类型" required>
            <el-select
              v-model="formData.underlyingType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="权益 (Equity)" value="Equity" />
              <el-option label="股票 (Stock)" value="Stock" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第2行：挂钩标的 | 当前市价 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="挂钩标的" required>
            <el-select
              v-model="formData.underlying"
              placeholder="请选择"
              filterable
              style="width: 100%"
              @change="handleUnderlyingChange"
            >
              <el-option
                v-for="item in underlyingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="当前市价">
            <el-input-number
              v-model="formData.currentMarketPrice"
              :precision="2"
              :min="0"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第3行：交易方向 | 本金金额 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="交易方向" required>
            <el-select
              v-model="formData.tradeDirection"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="买入 (BUY)" value="BUY" />
              <el-option label="卖出 (SELL)" value="SELL" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="本金金额" required>
            <el-input-number
              v-model="formData.principalAmount"
              :precision="2"
              :min="0"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第4行：本金货币 | 交易日 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="本金货币" required>
            <el-select
              v-model="formData.principalCurrency"
              placeholder="请选择"
              style="width: 100%"
              @change="handleCurrencyChange"
            >
              <el-option label="CNY" value="CNY" />
              <el-option label="USD" value="USD" />
              <el-option label="HKD" value="HKD" />
              <el-option label="EUR" value="EUR" />
              <el-option label="GBP" value="GBP" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="交易日" required>
            <el-date-picker
              v-model="formData.tradeDate"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              @change="handleTradeDateChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第5行：起息日 | 定价日 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="起息日" required>
            <el-date-picker
              v-model="formData.valueDate"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              @change="handleValueDateChange"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="定价日" required>
            <el-date-picker
              v-model="formData.pricingDate"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              @change="handlePricingDateChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第6行：期限 | 到期日 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="期限(天)" required>
            <el-input
              v-model="formData.tenor"
              placeholder="请输入，如：6M, 1Y"
              @change="handleTenorChange"
              @blur="handleTenorChange"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="到期日" required>
            <el-date-picker
              v-model="formData.maturityDate"
              type="date"
              placeholder="系统自动计算"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第7行：结算日 | 计息基础 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="结算日" required>
            <el-date-picker
              v-model="formData.settlementDate"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              @change="handleSettlementDateChange"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="计息基础" required>
            <el-select
              v-model="formData.dayCountBasis"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="ACT/365" value="ACT/365" />
              <el-option label="ACT/360" value="ACT/360" />
              <el-option label="30/360" value="30/360" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import type { TradeInformation, UnderlyingOption } from '@/types'
import { getDefaultValueDate, calculateSettlementDate, calculateMaturityDate } from '@/utils/date'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface Props {
  modelValue: TradeInformation
}

interface Emits {
  (e: 'update:modelValue', value: TradeInformation): void
  (e: 'update:value-date', value: string): void
  (e: 'update:tenor', value: string): void
  (e: 'update:currency', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单数据
const formData = reactive<TradeInformation>({ ...props.modelValue })

// 挂钩标的选项
const underlyingOptions: UnderlyingOption[] = [
  { value: 'SH000905', label: '中证500 (SH000905)', currentPrice: 6000 },
  { value: 'SH000300', label: '沪深300 (SH000300)', currentPrice: 4200 },
  { value: 'SZ399001', label: '深证成指 (SZ399001)', currentPrice: 14000 }
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

// 监听起息日和期限变化，自动计算到期日和结算日
watch(
  () => [formData.valueDate, formData.tenor],
  ([valueDate, tenor]) => {
    if (valueDate && tenor) {
      const maturityDate = calculateMaturityDate(valueDate, tenor)
      if (maturityDate && maturityDate !== formData.maturityDate) {
        formData.maturityDate = maturityDate
        // 自动计算结算日
        const settlementDate = calculateSettlementDate(maturityDate)
        if (settlementDate) {
          formData.settlementDate = settlementDate
        }
      }
    }
  }
)

// 事件处理
function handleProductStructureChange(value: string) {
  // 选择产品结构后，默认挂钩类型为股票
  if (!formData.underlyingType) {
    formData.underlyingType = 'Stock'
  }
}

function handleUnderlyingChange(value: string) {
  const underlying = underlyingOptions.find((item) => item.value === value)
  if (underlying && underlying.currentPrice) {
    formData.currentMarketPrice = underlying.currentPrice
  }
}

function handleTradeDateChange(value: string) {
  if (!value) return
  
  const tradeDateObj = dayjs(value)
  
  // 如果起息日为空或早于交易日，自动设置为交易日+1
  if (!formData.valueDate || dayjs(formData.valueDate).isBefore(tradeDateObj, 'day')) {
    formData.valueDate = getDefaultValueDate(value, 1)
    emit('update:value-date', formData.valueDate)
  } else {
    // 验证起息日不能早于交易日
    if (dayjs(formData.valueDate).isBefore(tradeDateObj, 'day')) {
      ElMessage.warning('起息日不能早于交易日，已自动调整')
      formData.valueDate = getDefaultValueDate(value, 1)
      emit('update:value-date', formData.valueDate)
    }
  }
}

function handleValueDateChange(value: string) {
  if (!value) return
  
  emit('update:value-date', value)
  
  const valueDateObj = dayjs(value)
  const tradeDateObj = dayjs(formData.tradeDate)
  
  // 验证起息日不能早于交易日
  if (valueDateObj.isBefore(tradeDateObj, 'day')) {
    ElMessage.warning('起息日不能早于交易日')
    return
  }
  
  // 默认定价日等于起息日，或者如果定价日晚于起息日则自动调整
  if (!formData.pricingDate || dayjs(formData.pricingDate).isAfter(valueDateObj, 'day')) {
    formData.pricingDate = value
    if (formData.pricingDate && dayjs(formData.pricingDate).isAfter(valueDateObj, 'day')) {
      ElMessage.info('定价日已自动调整为起息日')
    }
  }
  
  // 如果期限已填写，重新计算到期日和结算日
  if (formData.tenor) {
    const maturityDate = calculateMaturityDate(value, formData.tenor)
    if (maturityDate) {
      formData.maturityDate = maturityDate
      formData.settlementDate = calculateSettlementDate(maturityDate)
    }
  }
}

// 处理定价日变化
function handlePricingDateChange(value: string) {
  if (!value) return
  
  const pricingDateObj = dayjs(value)
  const valueDateObj = dayjs(formData.valueDate)
  
  // 验证定价日不能晚于起息日
  if (valueDateObj && pricingDateObj.isAfter(valueDateObj, 'day')) {
    ElMessage.warning('定价日不能晚于起息日')
    formData.pricingDate = formData.valueDate
  }
}

// 处理结算日变化
function handleSettlementDateChange(value: string) {
  if (!value) return
  
  const settlementDateObj = dayjs(value)
  const maturityDateObj = dayjs(formData.maturityDate)
  
  // 验证结算日不能早于到期日
  if (maturityDateObj && settlementDateObj.isBefore(maturityDateObj, 'day')) {
    ElMessage.warning('结算日不能早于到期日')
    if (formData.maturityDate) {
      formData.settlementDate = calculateSettlementDate(formData.maturityDate)
    }
  }
}

function handleTenorChange(value?: string | Event) {
  // 获取当前期限值
  const tenorValue = formData.tenor
  
  if (tenorValue) {
    emit('update:tenor', tenorValue)
    
    // 如果起息日和期限都已填写，自动计算到期日和结算日
    if (formData.valueDate && tenorValue) {
      const maturityDate = calculateMaturityDate(formData.valueDate, tenorValue)
      if (maturityDate) {
        formData.maturityDate = maturityDate
        formData.settlementDate = calculateSettlementDate(maturityDate)
      }
    }
  }
}

function handleCurrencyChange(value: string) {
  emit('update:currency', value)
  // 如果货币是CNY，默认计息基础为ACT/365
  if (value === 'CNY' && !formData.dayCountBasis) {
    formData.dayCountBasis = 'ACT/365'
  }
}
</script>

<style lang="scss" scoped>
.trade-information-form {
  max-width: 100%; // 确保不超出容器
  
  .trade-form {
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
    :deep(.el-input-number),
    :deep(.el-select) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :deep(.el-row) {
      margin-bottom: 0;
    }
  }
}
</style>
