/**
 * 结构化产品交易录入系统 - 类型定义
 */

// 产品类型
export type ProductType = 'SnowBall' | 'AutoCall'

// 挂钩类型
export type UnderlyingType = 'Equity' | 'Stock'

// 交易方向
export type TradeDirection = 'BUY' | 'SELL'

// 货币类型
export type Currency = 'CNY' | 'USD' | 'HKD' | 'EUR' | 'GBP'

// 观察频率
export type ObservationFreq = '1D' | '1W' | '2W' | '1M' | '3M' | '6M' | '1Y' | 'MT'

// 计息基础
export type DayCountBasis = 'ACT/365' | 'ACT/360' | '30/360'

// 生成规则
export type GenerationRule = 'Forward' | 'Backward'

// 假日调整惯例
export type BusinessDayConvention = 
  | 'None' 
  | 'Modified Following' 
  | 'Following' 
  | 'Preceding' 
  | 'Modified Preceding'

// 交易信息
export interface TradeInformation {
  productStructure: ProductType | ''
  underlyingType: UnderlyingType | ''
  underlying: string
  currentMarketPrice?: number
  tradeDirection: TradeDirection | ''
  tradeDate: string
  valueDate: string
  pricingDate: string
  tenor: string // 格式: "6M", "1Y"
  maturityDate: string
  settlementDate: string
  principalAmount: number | null
  principalCurrency: Currency | ''
  dayCountBasis: DayCountBasis | ''
}

// 结构参数
export interface StructureInputs {
  initialPrice: number | null
  koBarrierPercent: number | null
  stepDownPercent?: number | null
  coupon: number | null
  koObsFreq: ObservationFreq | ''
  paymentFreq: ObservationFreq | ''
  // SnowBall 独有字段
  kiBarrierPercent?: number | null
  kiObsFreq?: ObservationFreq | ''
  floorReturn?: number | null
}

// 交易账户
export interface TradingAccount {
  portfolio: string
  portfolioName: string
  counterparty: string
  counterpartyName: string
}

// 规则设置
export interface RuleSettings {
  generationRule: GenerationRule
  startDate: string
  endDate: string
  holidayRule: string[]
  businessDayConvention: BusinessDayConvention
}

// 观察表行数据
export interface ObservationRow {
  period: number
  observationDate: string
  underlyingTicker: string
  fixingPrice: string | null
  koBarrierPrice: number
  kiBarrierPrice?: number // SnowBall 独有
  potentialCouponAmount: number
  status: 'Pending' | 'KnockedOut' | 'KnockedIn'
}

// 完整的交易数据
export interface StructuredProductTrade {
  tradeInfo: TradeInformation
  structureInputs: StructureInputs
  tradingAccount: TradingAccount
  ruleSettings: RuleSettings
  observationSchedule: ObservationRow[]
}

// 账户选项
export interface PortfolioOption {
  value: string
  label: string
  name: string
}

// 交易对手选项
export interface CounterpartyOption {
  value: string
  label: string
  name: string
}

// 挂钩标的选项
export interface UnderlyingOption {
  value: string
  label: string
  currentPrice?: number
}


