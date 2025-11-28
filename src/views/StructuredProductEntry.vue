<template>
  <div class="structured-product-entry">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <div class="top-bar-left">
        <el-tabs v-model="activeTab" class="main-tabs">
          <el-tab-pane label="交易录入" name="entry" />
        </el-tabs>
      </div>
      <div class="top-bar-right">
        <el-icon class="toolbar-icon"><Plus /></el-icon>
        <el-icon class="toolbar-icon"><Box /></el-icon>
        <el-icon class="toolbar-icon"><Delete /></el-icon>
        <el-icon class="toolbar-icon"><FolderOpened /></el-icon>
        <el-icon class="toolbar-icon"><Search /></el-icon>
        <el-icon class="toolbar-icon"><Minus /></el-icon>
        <el-icon class="toolbar-icon"><FullScreenIcon /></el-icon>
        <el-icon class="toolbar-icon"><Close /></el-icon>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧导航 -->
      <SideNavigation />

      <!-- 中央表单区域 -->
      <div class="center-content">
        <div class="page-header">
          <h2 class="page-title">
            <el-icon><Lightning /></el-icon>
            <span>{{ pageTitle }}</span>
          </h2>
        </div>

        <div class="form-wrapper">
          <!-- 交易信息 -->
          <TradeInformationForm
            v-model="formData.tradeInfo"
            @update:value-date="handleValueDateChange"
            @update:tenor="handleTenorChange"
            @update:currency="handleCurrencyChange"
          />

          <!-- 结构参数 -->
          <StructureInputsForm
            v-model="formData.structureInputs"
            :product-type="formData.tradeInfo.productStructure"
            @open-ko-rule-settings="handleOpenKORuleSettings"
            @open-ki-rule-settings="handleOpenKIRuleSettings"
          />

          <!-- 交易账户 -->
          <TradingAccountForm v-model="formData.tradingAccount" />

          <!-- 观察表 -->
          <div class="observation-section">
            <ObservationScheduleTable
              :data="observationSchedule"
              :product-type="formData.tradeInfo.productStructure"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <el-button @click="handleClear">一键清空</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <RiskChecksPanel />
    </div>

    <!-- 敲出观察频率规则设置弹窗 -->
    <RuleSettingsDialog
      v-model="showKORuleSettingsDialog"
      v-model:rule-settings="formData.ruleSettings"
      :value-date="formData.tradeInfo.valueDate"
      :maturity-date="formData.tradeInfo.maturityDate"
      title="敲出观察频率规则设置"
      @update="handleRuleSettingsUpdate"
    />

    <!-- 敲入观察频率规则设置弹窗 -->
    <RuleSettingsDialog
      v-model="showKIRuleSettingsDialog"
      v-model:rule-settings="formData.ruleSettings"
      :value-date="formData.tradeInfo.valueDate"
      :maturity-date="formData.tradeInfo.maturityDate"
      title="敲入观察频率规则设置"
      @update="handleRuleSettingsUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Plus,
  Box,
  Delete,
  FolderOpened,
  Search,
  Minus,
  ZoomIn as FullScreenIcon,
  Close,
  Lightning,
  Setting
} from '@element-plus/icons-vue'
import SideNavigation from '@/components/SideNavigation.vue'
import TradeInformationForm from '@/components/TradeInformationForm.vue'
import StructureInputsForm from '@/components/StructureInputsForm.vue'
import TradingAccountForm from '@/components/TradingAccountForm.vue'
import ObservationScheduleTable from '@/components/ObservationScheduleTable.vue'
import RiskChecksPanel from '@/components/RiskChecksPanel.vue'
import RuleSettingsDialog from '@/components/RuleSettingsDialog.vue'
import type {
  StructuredProductTrade,
  ProductType
} from '@/types'
import { generateObservationSchedule } from '@/utils/observationSchedule'
import { calculateMaturityDate, calculateSettlementDate, getCurrentDate, getDefaultValueDate } from '@/utils/date'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

// 响应式数据
const activeTab = ref('entry')
const showKORuleSettingsDialog = ref(false)
const showKIRuleSettingsDialog = ref(false)

// 表单数据
const formData = reactive<StructuredProductTrade>({
  tradeInfo: {
    productStructure: '' as ProductType | '',
    underlyingType: '',
    underlying: '',
    currentMarketPrice: undefined,
    tradeDirection: '',
    tradeDate: getCurrentDate(),
    valueDate: '',
    pricingDate: '',
    tenor: '',
    maturityDate: '',
    settlementDate: '',
    principalAmount: null,
    principalCurrency: '',
    dayCountBasis: ''
  },
  structureInputs: {
    initialPrice: null,
    koBarrierPercent: null,
    stepDownPercent: null,
    coupon: null,
    koObsFreq: '1M',
    paymentFreq: 'MT',
    kiBarrierPercent: null,
    kiObsFreq: '1D',
    floorReturn: 0
  },
  tradingAccount: {
    portfolio: '',
    portfolioName: '',
    counterparty: '',
    counterpartyName: ''
  },
  ruleSettings: {
    generationRule: 'Forward',
    startDate: '',
    endDate: '',
    holidayRule: ['CNY'],
    businessDayConvention: 'Modified Following'
  },
  observationSchedule: []
})

// 计算属性
const pageTitle = computed(() => {
  const productType = formData.tradeInfo.productStructure
  if (productType === 'SnowBall') {
    return '雪球期权 交易录入'
  } else if (productType === 'AutoCall') {
    return '自动敲出 交易录入'
  }
  return '结构化产品 交易录入'
})

// 观察表数据
const observationSchedule = computed(() => {
  return generateObservationSchedule(
    formData.tradeInfo,
    formData.structureInputs,
    formData.ruleSettings
  )
})

// 监听交易日变化，自动设置起息日
watch(
  () => formData.tradeInfo.tradeDate,
  (tradeDate) => {
    if (tradeDate) {
      const valueDate = formData.tradeInfo.valueDate
      const tradeDateObj = dayjs(tradeDate)
      
      // 如果起息日为空或早于交易日，自动设置为交易日+1
      if (!valueDate || dayjs(valueDate).isBefore(tradeDateObj, 'day')) {
        const newValueDate = getDefaultValueDate(tradeDate, 1)
        formData.tradeInfo.valueDate = newValueDate
        handleValueDateChange(newValueDate)
      }
    }
  }
)

// 监听起息日和期限变化，自动计算到期日
watch(
  () => [formData.tradeInfo.valueDate, formData.tradeInfo.tenor],
  ([valueDate, tenor]) => {
    if (valueDate && tenor) {
      const maturityDate = calculateMaturityDate(valueDate, tenor)
      if (maturityDate) {
        formData.tradeInfo.maturityDate = maturityDate
        // 自动计算结算日
        formData.tradeInfo.settlementDate = calculateSettlementDate(maturityDate)
        // 更新规则设置的结束日
        if (!formData.ruleSettings.endDate) {
          formData.ruleSettings.endDate = maturityDate
        }
      }
    }
  }
)

// 监听到期日变化，自动更新结算日和规则设置的结束日
watch(
  () => formData.tradeInfo.maturityDate,
  (maturityDate) => {
    if (maturityDate) {
      // 自动计算结算日（如果结算日为空或早于到期日）
      const settlementDate = formData.tradeInfo.settlementDate
      if (!settlementDate || dayjs(settlementDate).isBefore(dayjs(maturityDate), 'day')) {
        formData.tradeInfo.settlementDate = calculateSettlementDate(maturityDate)
      }
      // 更新规则设置的结束日
      if (!formData.ruleSettings.endDate) {
        formData.ruleSettings.endDate = maturityDate
      }
    }
  }
)

// 监听起息日变化，自动更新定价日和规则设置
watch(
  () => formData.tradeInfo.valueDate,
  (valueDate) => {
    if (valueDate) {
      // 如果定价日为空或晚于起息日，自动设置为起息日
      const pricingDate = formData.tradeInfo.pricingDate
      if (!pricingDate || dayjs(pricingDate).isAfter(dayjs(valueDate), 'day')) {
        formData.tradeInfo.pricingDate = valueDate
      }
      // 更新规则设置的起始日
      if (!formData.ruleSettings.startDate) {
        formData.ruleSettings.startDate = valueDate
      }
    }
  }
)

// 监听规则设置和结构参数变化，更新观察表
watch(
  () => [
    formData.tradeInfo.valueDate,
    formData.tradeInfo.maturityDate,
    formData.structureInputs.koObsFreq,
    formData.structureInputs.stepDownPercent,
    formData.structureInputs.initialPrice,
    formData.structureInputs.koBarrierPercent,
    formData.ruleSettings
  ],
  () => {
    updateObservationSchedule()
  },
  { deep: true }
)

// 事件处理
function handleValueDateChange(valueDate: string) {
  formData.tradeInfo.valueDate = valueDate
  
  // 如果定价日为空或晚于起息日，自动设置为起息日
  if (!formData.tradeInfo.pricingDate || dayjs(formData.tradeInfo.pricingDate).isAfter(dayjs(valueDate), 'day')) {
    formData.tradeInfo.pricingDate = valueDate
  }
  
  // 更新规则设置的起始日
  if (!formData.ruleSettings.startDate) {
    formData.ruleSettings.startDate = valueDate
  }
  
  // 如果起息日变化，重新计算到期日（如果期限已填写）
  if (formData.tradeInfo.tenor) {
    const maturityDate = calculateMaturityDate(valueDate, formData.tradeInfo.tenor)
    if (maturityDate) {
      formData.tradeInfo.maturityDate = maturityDate
      formData.tradeInfo.settlementDate = calculateSettlementDate(maturityDate)
      // 更新规则设置的结束日
      if (!formData.ruleSettings.endDate) {
        formData.ruleSettings.endDate = maturityDate
      }
    }
  }
}

function handleTenorChange(tenor: string) {
  formData.tradeInfo.tenor = tenor
}

function handleCurrencyChange(currency: string) {
  formData.tradeInfo.principalCurrency = currency as any
  // 如果货币是CNY，默认计息基础为ACT/365
  if (currency === 'CNY' && !formData.tradeInfo.dayCountBasis) {
    formData.tradeInfo.dayCountBasis = 'ACT/365'
  }
}

function handleRuleSettingsUpdate() {
  updateObservationSchedule()
}

// 打开敲出观察频率规则设置弹窗
function handleOpenKORuleSettings() {
  showKORuleSettingsDialog.value = true
}

// 打开敲入观察频率规则设置弹窗
function handleOpenKIRuleSettings() {
  showKIRuleSettingsDialog.value = true
}

function updateObservationSchedule() {
  formData.observationSchedule = generateObservationSchedule(
    formData.tradeInfo,
    formData.structureInputs,
    formData.ruleSettings
  )
}

function handleClear() {
  // 重置所有表单数据
  Object.assign(formData.tradeInfo, {
    productStructure: '' as ProductType | '',
    underlyingType: '',
    underlying: '',
    currentMarketPrice: undefined,
    tradeDirection: '',
    tradeDate: getCurrentDate(),
    valueDate: '',
    pricingDate: '',
    tenor: '',
    maturityDate: '',
    settlementDate: '',
    principalAmount: null,
    principalCurrency: '',
    dayCountBasis: ''
  })

  Object.assign(formData.structureInputs, {
    initialPrice: null,
    koBarrierPercent: null,
    stepDownPercent: null,
    coupon: null,
    koObsFreq: '1M',
    paymentFreq: 'MT',
    kiBarrierPercent: null,
    kiObsFreq: '1D',
    floorReturn: 0
  })

  Object.assign(formData.tradingAccount, {
    portfolio: '',
    portfolioName: '',
    counterparty: '',
    counterpartyName: ''
  })

  formData.observationSchedule = []
}

function handleSubmit() {
  // 表单验证
  if (!validateForm()) {
    return
  }

  // TODO: 提交到后端
  console.log('提交数据:', formData)
  ElMessage.success('提交成功')
}

function validateForm(): boolean {
  // 基本验证逻辑
  if (!formData.tradeInfo.productStructure) {
    ElMessage.error('请选择产品结构')
    return false
  }

  if (!formData.tradeInfo.principalAmount || formData.tradeInfo.principalAmount <= 0) {
    ElMessage.error('本金金额必须大于0')
    return false
  }

  // 更多验证...
  return true
}
</script>

<style lang="scss" scoped>
.structured-product-entry {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-color;
  overflow: hidden;
}

.top-bar {
  height: 48px;
  background-color: $bg-color-light;
  border-bottom: 1px solid $border-color-light;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $spacing-md;
  flex-shrink: 0;

  .top-bar-left {
    flex: 1;
  }

  .top-bar-right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .toolbar-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      color: $text-color-regular;

      &:hover {
        color: $primary-color;
      }
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: $bg-color-light;
  margin: $spacing-md;
  border-radius: $border-radius-base;
  padding: $spacing-md;
  overflow-y: auto;
  max-width: 1000px; // 限制最大宽度，让表单更紧凑
}

.page-header {
  margin-bottom: $spacing-md;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: $text-color-primary;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .el-icon {
      font-size: 24px;
      color: $primary-color;
    }
  }
}

.form-wrapper {
  flex: 1;
  max-width: 950px; // 限制表单内容的最大宽度，让它更紧凑靠左
}

.observation-section {
  margin-top: $spacing-lg;
}

.form-actions {
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1px solid $border-color-light;
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
}

:deep(.main-tabs) {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
