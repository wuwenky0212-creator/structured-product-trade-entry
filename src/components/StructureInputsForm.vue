<template>
  <div class="structure-inputs-form form-container">
    <div class="form-title">结构参数 (Structure Inputs)</div>

    <el-form
      :model="formData"
      label-width="120px"
      label-position="right"
      class="structure-form"
    >
      <!-- 第1行：期初价格 | 敲出价格(%) -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="期初价格" required>
            <el-input-number
              v-model="formData.initialPrice"
              :precision="2"
              :min="0"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="敲出价格(%)" required>
            <el-input-number
              v-model="formData.koBarrierPercent"
              :precision="2"
              :min="0"
              placeholder="请输入，如：100, 103"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第2行：降敲幅度(%) | 敲入价格(%) (仅SnowBall) -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="降敲幅度(%)">
            <el-input-number
              v-model="formData.stepDownPercent"
              :precision="2"
              :min="0"
              placeholder="请输入，如：0.5"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="productType === 'SnowBall'" :span="12">
          <el-form-item label="敲入价格(%)" required>
            <el-input-number
              v-model="formData.kiBarrierPercent"
              :precision="2"
              :min="0"
              placeholder="请输入，如：80, 75"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <!-- AutoCall不需要敲入价格，占位 -->
        </el-col>
      </el-row>

      <!-- 第3行：敲出票息率(%) | 保底收益率 (仅SnowBall) -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="敲出票息率(%)" required>
            <el-input-number
              v-model="formData.coupon"
              :precision="2"
              :min="0"
              placeholder="请输入，如：15.00"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col v-if="productType === 'SnowBall'" :span="12">
          <el-form-item label="保底收益率">
            <el-input-number
              v-model="formData.floorReturn"
              :precision="2"
              :min="0"
              placeholder="默认值：0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <!-- AutoCall不需要保底收益率，占位 -->
        </el-col>
      </el-row>

      <!-- 第4行：敲出观察频率（含规则设置按钮） | 敲入观察频率（含规则设置按钮，仅SnowBall） -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="敲出观察频率" required>
            <div class="obs-freq-with-button">
              <el-select
                v-model="formData.koObsFreq"
                placeholder="请选择"
                class="obs-freq-select"
              >
                <el-option label="每日 (1D)" value="1D" />
                <el-option label="每周 (1W)" value="1W" />
                <el-option label="每两周 (2W)" value="2W" />
                <el-option label="每月 (1M)" value="1M" />
                <el-option label="每季度 (3M)" value="3M" />
                <el-option label="每半年 (6M)" value="6M" />
                <el-option label="每年 (1Y)" value="1Y" />
                <el-option label="到期时 (MT)" value="MT" />
              </el-select>
              <el-button
                link
                type="primary"
                :icon="Setting"
                @click="handleOpenKORuleSettings"
                class="rule-settings-link-button"
              >
                规则设置
              </el-button>
            </div>
          </el-form-item>
        </el-col>

        <el-col v-if="productType === 'SnowBall'" :span="12">
          <el-form-item label="敲入观察频率" required>
            <div class="obs-freq-with-button">
              <el-select
                v-model="formData.kiObsFreq"
                placeholder="请选择"
                class="obs-freq-select"
              >
                <el-option label="每日 (1D)" value="1D" />
                <el-option label="每周 (1W)" value="1W" />
                <el-option label="每两周 (2W)" value="2W" />
                <el-option label="每月 (1M)" value="1M" />
                <el-option label="每季度 (3M)" value="3M" />
                <el-option label="每半年 (6M)" value="6M" />
                <el-option label="每年 (1Y)" value="1Y" />
                <el-option label="到期时 (MT)" value="MT" />
              </el-select>
              <el-button
                link
                type="primary"
                :icon="Setting"
                @click="handleOpenKIRuleSettings"
                class="rule-settings-link-button"
              >
                规则设置
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <!-- AutoCall不需要敲入观察频率，占位 -->
        </el-col>
      </el-row>

      <!-- 第5行：支付频率 | 空 -->
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="支付频率">
            <el-select
              v-model="formData.paymentFreq"
              placeholder="请选择"
              style="width: 100%"
              disabled
            >
              <el-option label="到期时 (MT)" value="MT" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- 右侧占位，保持布局对称 -->
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import type { StructureInputs, ProductType } from '@/types'

interface Props {
  modelValue: StructureInputs
  productType: ProductType | ''
}

interface Emits {
  (e: 'update:modelValue', value: StructureInputs): void
  (e: 'open-ko-rule-settings'): void
  (e: 'open-ki-rule-settings'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 打开敲出观察频率规则设置弹窗
function handleOpenKORuleSettings() {
  emit('open-ko-rule-settings')
}

// 打开敲入观察频率规则设置弹窗
function handleOpenKIRuleSettings() {
  emit('open-ki-rule-settings')
}

// 表单数据
const formData = reactive<StructureInputs>({ ...props.modelValue })

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

// 监听产品类型变化，重置SnowBall特有字段
watch(
  () => props.productType,
  (newType) => {
    if (newType !== 'SnowBall') {
      // AutoCall不需要敲入相关字段
      formData.kiBarrierPercent = undefined
      formData.kiObsFreq = undefined
      formData.floorReturn = undefined
    } else {
      // SnowBall默认值
      if (!formData.kiObsFreq) {
        formData.kiObsFreq = '1D'
      }
      if (formData.floorReturn === undefined || formData.floorReturn === null) {
        formData.floorReturn = 0
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.structure-inputs-form {
  max-width: 100%; // 确保不超出容器
  
  .structure-form {
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

    :deep(.el-divider) {
      margin: 12px 0;
    }

    :deep(.el-row) {
      margin-bottom: 0;
    }
  }

  // 观察频率和规则设置按钮的布局样式
  .obs-freq-with-button {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;

    .obs-freq-select {
      flex: 1;
      min-width: 0; // 允许缩小
    }

    .rule-settings-link-button {
      flex-shrink: 0;
      padding: 0 $spacing-xs;
      white-space: nowrap;
      
      :deep(.el-icon) {
        margin-right: 4px;
      }
    }
  }
}
</style>


