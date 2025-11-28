<template>
  <div class="risk-checks-panel">
    <div class="panel-header">
      <span class="panel-title">预览</span>
    </div>

    <div class="panel-content">
      <!-- 现金流预览 -->
      <div class="check-item" @click="handleCashFlowPreview">
        <div class="check-item-header">
          <span class="check-item-title">现金流预览</span>
          <div class="check-item-actions">
            <el-icon class="action-icon" @click.stop="refreshCashFlow">
              <Refresh />
            </el-icon>
            <el-icon class="action-icon">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="check-item-content">
          <el-text type="info" size="small">点击查看现金流详情</el-text>
        </div>
      </div>

      <!-- 操作风险检查 -->
      <div class="check-item" @click="handleOperationalRiskCheck">
        <div class="check-item-header">
          <span class="check-item-title">操作风险检查</span>
          <div class="check-item-actions">
            <el-icon class="action-icon" @click.stop="refreshOperationalRisk">
              <Refresh />
            </el-icon>
            <el-icon class="action-icon">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="check-item-content">
          <el-tag v-if="operationalRiskStatus" :type="operationalRiskStatus" size="small">
            {{ getOperationalRiskText() }}
          </el-tag>
          <el-text v-else type="info" size="small">待检查</el-text>
        </div>
      </div>

      <!-- 信用风险检查 -->
      <div class="check-item" @click="handleCreditRiskCheck">
        <div class="check-item-header">
          <span class="check-item-title">信用风险检查</span>
          <div class="check-item-actions">
            <el-icon class="action-icon" @click.stop="refreshCreditRisk">
              <Refresh />
            </el-icon>
            <el-icon class="action-icon">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="check-item-content">
          <el-tag v-if="creditRiskStatus" :type="creditRiskStatus" size="small">
            {{ getCreditRiskText() }}
          </el-tag>
          <el-text v-else type="info" size="small">待检查</el-text>
        </div>
      </div>

      <!-- 市场风险检查 -->
      <div class="check-item" @click="handleMarketRiskCheck">
        <div class="check-item-header">
          <span class="check-item-title">市场风险检查</span>
          <div class="check-item-actions">
            <el-icon class="action-icon" @click.stop="refreshMarketRisk">
              <Refresh />
            </el-icon>
            <el-icon class="action-icon">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="check-item-content">
          <el-tag v-if="marketRiskStatus" :type="marketRiskStatus" size="small">
            {{ getMarketRiskText() }}
          </el-tag>
          <el-text v-else type="info" size="small">待检查</el-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 风险检查状态
const operationalRiskStatus = ref<'success' | 'warning' | 'danger' | null>(null)
const creditRiskStatus = ref<'success' | 'warning' | 'danger' | null>(null)
const marketRiskStatus = ref<'success' | 'warning' | 'danger' | null>(null)

// 事件处理
function handleCashFlowPreview() {
  ElMessage.info('打开现金流预览窗口')
  // TODO: 实现现金流预览功能
}

function handleOperationalRiskCheck() {
  ElMessage.info('打开操作风险检查详情')
  // TODO: 实现操作风险检查详情
}

function handleCreditRiskCheck() {
  ElMessage.info('打开信用风险检查详情')
  // TODO: 实现信用风险检查详情
}

function handleMarketRiskCheck() {
  ElMessage.info('打开市场风险检查详情')
  // TODO: 实现市场风险检查详情
}

// 刷新功能
function refreshCashFlow() {
  ElMessage.success('刷新现金流预览')
  // TODO: 实现刷新逻辑
}

function refreshOperationalRisk() {
  ElMessage.success('刷新操作风险检查')
  // TODO: 实现检查逻辑
  operationalRiskStatus.value = 'success'
}

function refreshCreditRisk() {
  ElMessage.success('刷新信用风险检查')
  // TODO: 实现检查逻辑
  creditRiskStatus.value = 'success'
}

function refreshMarketRisk() {
  ElMessage.success('刷新市场风险检查')
  // TODO: 实现检查逻辑
  marketRiskStatus.value = 'success'
}

// 获取状态文本
function getOperationalRiskText(): string {
  if (operationalRiskStatus.value === 'success') return '通过'
  if (operationalRiskStatus.value === 'warning') return '警告'
  if (operationalRiskStatus.value === 'danger') return '失败'
  return '待检查'
}

function getCreditRiskText(): string {
  if (creditRiskStatus.value === 'success') return '通过'
  if (creditRiskStatus.value === 'warning') return '警告'
  if (creditRiskStatus.value === 'danger') return '失败'
  return '待检查'
}

function getMarketRiskText(): string {
  if (marketRiskStatus.value === 'success') return '通过'
  if (marketRiskStatus.value === 'warning') return '警告'
  if (marketRiskStatus.value === 'danger') return '失败'
  return '待检查'
}
</script>

<style lang="scss" scoped>
.risk-checks-panel {
  flex: 1; // 改为自适应，平铺剩余空间
  min-width: 300px; // 设置最小宽度，防止过小
  height: 100%;
  background-color: $bg-color-light;
  border-left: 1px solid $border-color-light;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  height: 48px;
  padding: 0 $spacing-md;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $border-color-light;

  .panel-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-color-primary;
  }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.check-item {
  background-color: $bg-color-light;
  border: 1px solid $border-color-light;
  border-radius: $border-radius-base;
  padding: $spacing-md;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: $primary-color;
    box-shadow: $box-shadow-base;
  }

  .check-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;

    .check-item-title {
      font-size: 14px;
      font-weight: 500;
      color: $text-color-primary;
    }

    .check-item-actions {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .action-icon {
        width: 16px;
        height: 16px;
        cursor: pointer;
        color: $text-color-secondary;

        &:hover {
          color: $primary-color;
        }
      }
    }
  }

  .check-item-content {
    display: flex;
    align-items: center;
    min-height: 24px;
  }
}
</style>


