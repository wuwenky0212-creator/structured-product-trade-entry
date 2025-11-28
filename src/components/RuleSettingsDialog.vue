<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title || '规则设置'"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      :model="localRuleSettings"
      label-width="180px"
      label-position="right"
      class="rule-settings-form"
    >
      <!-- 生成规则 -->
      <el-form-item label="生成规则">
        <el-select
          v-model="localRuleSettings.generationRule"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="从前往后 (Forward)" value="Forward" />
          <el-option label="从后往前 (Backward)" value="Backward" />
        </el-select>
      </el-form-item>

      <!-- 起始日 -->
      <el-form-item label="起始日">
        <el-date-picker
          v-model="localRuleSettings.startDate"
          type="date"
          placeholder="请选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 结束日 -->
      <el-form-item label="结束日">
        <el-date-picker
          v-model="localRuleSettings.endDate"
          type="date"
          placeholder="请选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 假日规则 -->
      <el-form-item label="假日规则">
        <el-select
          v-model="localRuleSettings.holidayRule"
          multiple
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="CNY (中国)" value="CNY" />
          <el-option label="USD (美国)" value="USD" />
          <el-option label="HKD (香港)" value="HKD" />
          <el-option label="EUR (欧洲)" value="EUR" />
        </el-select>
      </el-form-item>

      <!-- 假日调整惯例 -->
      <el-form-item label="假日调整惯例">
        <el-select
          v-model="localRuleSettings.businessDayConvention"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="None" value="None" />
          <el-option label="Modified Following" value="Modified Following" />
          <el-option label="Following" value="Following" />
          <el-option label="Preceding" value="Preceding" />
          <el-option label="Modified Preceding" value="Modified Preceding" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import type { RuleSettings } from '@/types'

interface Props {
  modelValue: boolean
  ruleSettings: RuleSettings
  valueDate: string
  maturityDate: string
  title?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:rule-settings', value: RuleSettings): void
  (e: 'update'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 弹窗显示状态
const dialogVisible = ref(props.modelValue)

// 本地规则设置（用于编辑）
const localRuleSettings = reactive<RuleSettings>({ ...props.ruleSettings })

// 监听外部显示状态变化
watch(
  () => props.modelValue,
  (newValue) => {
    dialogVisible.value = newValue
    if (newValue) {
      // 打开弹窗时，初始化本地数据并设置默认值
      Object.assign(localRuleSettings, props.ruleSettings)
      
      // 设置默认起始日为起息日
      if (props.valueDate && !localRuleSettings.startDate) {
        localRuleSettings.startDate = props.valueDate
      }
      
      // 设置默认结束日为到期日
      if (props.maturityDate && !localRuleSettings.endDate) {
        localRuleSettings.endDate = props.maturityDate
      }
    }
  }
)

// 监听本地显示状态变化，同步到外部
watch(dialogVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听起息日和到期日变化，更新默认值
watch(
  () => [props.valueDate, props.maturityDate],
  ([valueDate, maturityDate]) => {
    if (dialogVisible.value) {
      // 更新起始日（如果为空，使用起息日）
      if (valueDate) {
        if (!localRuleSettings.startDate) {
          localRuleSettings.startDate = valueDate
        }
        // 如果起息日变化，且当前起始日为空或早于起息日，自动更新
        if (localRuleSettings.startDate && dayjs(localRuleSettings.startDate).isBefore(dayjs(valueDate), 'day')) {
          localRuleSettings.startDate = valueDate
        }
      }
      // 更新结束日（如果为空，使用到期日）
      if (maturityDate) {
        if (!localRuleSettings.endDate) {
          localRuleSettings.endDate = maturityDate
        }
        // 如果到期日变化，且当前结束日为空或早于到期日，自动更新
        if (localRuleSettings.endDate && dayjs(localRuleSettings.endDate).isBefore(dayjs(maturityDate), 'day')) {
          localRuleSettings.endDate = maturityDate
        }
      }
    }
  }
)

// 事件处理
function handleClose() {
  dialogVisible.value = false
}

function handleCancel() {
  // 取消时恢复原始数据
  Object.assign(localRuleSettings, props.ruleSettings)
  dialogVisible.value = false
}

function handleConfirm() {
  // 确认时保存数据
  emit('update:rule-settings', { ...localRuleSettings })
  emit('update')
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.rule-settings-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: $text-color-primary;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
}
</style>


