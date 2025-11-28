# 结构化产品交易录入系统

## 项目简介

这是一个基于 Vue 3 + TypeScript 开发的结构化产品交易录入系统，支持 SnowBall（雪球期权）和 AutoCall（自动敲出）两种产品的交易信息录入。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Element Plus** - 基于 Vue 3 的组件库
- **Vite** - 下一代前端构建工具
- **SCSS** - CSS 预处理器
- **Day.js** - 轻量级日期处理库

## 项目结构

```
Tradebooking/
├── src/
│   ├── components/          # 组件目录
│   │   ├── SideNavigation.vue              # 左侧导航组件
│   │   ├── TradeInformationForm.vue        # 交易信息表单组件
│   │   ├── StructureInputsForm.vue         # 结构参数表单组件
│   │   ├── TradingAccountForm.vue          # 交易账户表单组件
│   │   ├── RuleSettingsDialog.vue          # 规则设置弹窗组件
│   │   ├── ObservationScheduleTable.vue    # 观察表组件
│   │   └── RiskChecksPanel.vue             # 风险检查面板组件
│   ├── views/               # 页面组件
│   │   └── StructuredProductEntry.vue      # 主页面组件
│   ├── types/               # 类型定义
│   │   └── index.ts                        # 类型定义文件
│   ├── utils/               # 工具函数
│   │   ├── date.ts                         # 日期工具函数
│   │   └── observationSchedule.ts          # 观察表生成工具
│   ├── styles/              # 样式文件
│   │   ├── variables.scss                  # SCSS 变量
│   │   └── global.scss                     # 全局样式
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── PRD.md                   # 产品需求文档

```

## 功能特性

### 1. 交易信息录入
- 产品结构选择（SnowBall / AutoCall）
- 挂钩类型和标的选择
- 交易方向和日期设置
- 本金金额和货币配置
- 自动计算到期日和结算日

### 2. 结构参数配置
- 期初价格设置
- 敲出价格和降敲幅度配置
- 敲出票息率设置
- 观察频率配置
- SnowBall 特有的敲入参数

### 3. 交易账户管理
- 账户选择（自动带出账户名称）
- 交易对手选择（自动带出对手名称）

### 4. 规则设置
- 生成规则配置（从前往后/从后往前）
- 观察期起始日和结束日设置
- 假日规则和调整惯例配置

### 5. 观察表自动生成
- 根据输入参数自动生成观察表
- 支持降敲结构的动态计算
- 计算潜在票息金额
- 支持分页和导出

### 6. 风险检查面板
- 现金流预览
- 操作风险检查
- 信用风险检查
- 市场风险检查

## 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 核心业务逻辑

### 日期计算
- **到期日** = 起息日 + 期限（考虑工作日历）
- **结算日** = 到期日 + 2个工作日（默认）

### 降敲计算
第 n 期的敲出价格(%) = P_init - [(n-1) × Step]

其中：
- P_init = 期初敲出价格(%)
- Step = 降敲幅度(%)
- n = 当前期数

### 潜在票息金额计算
潜在票息金额 = 本金 × 票息率 × (持有天数 / 计息基础)

## 组件说明

### StructuredProductEntry.vue
主页面组件，整合所有子组件，管理整体状态和业务逻辑。

### TradeInformationForm.vue
交易信息表单组件，包含产品基本信息、日期字段和金额字段。

### StructureInputsForm.vue
结构参数表单组件，根据产品类型（SnowBall/AutoCall）动态显示字段。

### ObservationScheduleTable.vue
观察表组件，自动生成和展示观察日数据，支持分页和导出。

### RuleSettingsDialog.vue
规则设置弹窗组件，配置观察表生成规则。

### RiskChecksPanel.vue
右侧风险检查面板，提供各种风险检查功能入口。

## 代码规范

- 使用 TypeScript 进行类型约束
- 使用 Vue 3 Composition API
- 使用 Scoped SCSS 编写样式
- 所有响应式数据使用 `ref` 或 `reactive`
- 保持代码整洁，添加必要的中文注释

## 开发计划

- [ ] 完善表单验证逻辑
- [ ] 实现观察表的完整生成逻辑（考虑工作日历）
- [ ] 实现风险检查功能
- [ ] 实现数据导出功能
- [ ] 添加数据持久化
- [ ] 完善单元测试

## 许可证

MIT

## 联系方式

如有问题或建议，请联系开发团队。


