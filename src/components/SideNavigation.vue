<template>
  <div class="side-navigation">
    <div class="nav-header">
      <span class="nav-title">金融产品</span>
    </div>

    <div class="nav-search">
      <el-input
        v-model="searchText"
        placeholder="请输入..."
        :prefix-icon="Search"
        clearable
      />
    </div>

    <div class="nav-menu">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        class="product-menu"
        @select="handleMenuSelect"
      >
        <!-- 外汇市场 -->
        <el-sub-menu index="forex">
          <template #title>
            <span>外汇市场</span>
          </template>
          <el-sub-menu index="forex-options">
            <template #title>
              <span>外汇期权</span>
            </template>
            <el-menu-item index="forex-european-option">
              外汇欧式期权
            </el-menu-item>
            <el-menu-item index="forex-american-option">
              外汇美式期权
            </el-menu-item>
            <el-menu-item index="forex-barrier-option">
              外汇障碍期权
            </el-menu-item>
            <el-menu-item index="forex-digital-option">
              外汇数字期权
            </el-menu-item>
            <el-menu-item index="forex-touch-option">
              外汇触碰期权
            </el-menu-item>
            <el-menu-item index="ndf">
              无本金交割远期
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>

        <!-- 结构化产品 -->
        <el-menu-item
          index="structured-product"
          class="parent-menu-item"
          :class="{ 'is-active': activeMenu === 'structured-product' || activeMenu === 'snowball' || activeMenu === 'autocall' }"
        >
          <span>结构化产品</span>
        </el-menu-item>
        <el-menu-item
          index="snowball"
          class="child-menu-item"
          :class="{ 'is-active': activeMenu === 'snowball' }"
        >
          雪球期权 (SnowBall)
        </el-menu-item>
        <el-menu-item
          index="autocall"
          class="child-menu-item"
          :class="{ 'is-active': activeMenu === 'autocall' }"
        >
          自动敲出 (AutoCall)
        </el-menu-item>

        <!-- 其他分类（折叠状态） -->
        <el-sub-menu index="money-market">
          <template #title>
            <span>货币市场</span>
          </template>
        </el-sub-menu>

        <el-sub-menu index="bond-market">
          <template #title>
            <span>债券市场</span>
          </template>
        </el-sub-menu>

        <el-sub-menu index="fees">
          <template #title>
            <span>费用</span>
          </template>
        </el-sub-menu>

        <el-sub-menu index="interest-rates">
          <template #title>
            <span>利率</span>
          </template>
        </el-sub-menu>

        <el-sub-menu index="commodities">
          <template #title>
            <span>商品</span>
          </template>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchText = ref('')
const activeMenu = ref('snowball')

function handleMenuSelect(key: string) {
  activeMenu.value = key
  // 触发路由跳转或事件
  if (key === 'snowball' || key === 'autocall') {
    // 通知父组件切换产品类型
    // emit('product-change', key)
  }
}
</script>

<style lang="scss" scoped>
.side-navigation {
  width: $sidebar-width;
  height: 100%;
  background-color: $bg-color-light;
  border-right: 1px solid $border-color-light;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.nav-header {
  height: 48px;
  padding: 0 $spacing-md;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $border-color-light;

  .nav-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-color-primary;
  }
}

.nav-search {
  padding: $spacing-md;
  border-bottom: 1px solid $border-color-light;
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
}

:deep(.product-menu) {
  border-right: none;

  .el-menu-item.is-active {
    background-color: rgba(64, 158, 255, 0.1);
    color: $primary-color;
  }

  .el-sub-menu__title {
    font-size: 14px;
    color: $text-color-primary;
  }

  .el-menu-item {
    font-size: 14px;
    color: $text-color-regular;

    &:hover {
      background-color: rgba(64, 158, 255, 0.08);
    }
  }

  // 结构化产品子项样式（缩进显示）
  .child-menu-item {
    padding-left: 48px !important;
  }
}
</style>


