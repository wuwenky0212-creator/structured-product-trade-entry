/**
 * 测试辅助函数
 */

import type {
  TradeInformation,
  StructureInputs,
  TradingAccount,
  RuleSettings
} from '@/types'

/**
 * 创建测试用的交易信息数据
 */
export function createTestTradeInfo(): TradeInformation {
  return {
    productStructure: 'SnowBall',
    underlyingType: 'Stock',
    underlying: 'SH000905',
    currentMarketPrice: 6000,
    tradeDirection: 'BUY',
    tradeDate: '2025-01-27',
    valueDate: '2025-01-28',
    pricingDate: '2025-01-28',
    tenor: '6M',
    maturityDate: '2025-07-28',
    settlementDate: '2025-07-30',
    principalAmount: 1000000,
    principalCurrency: 'CNY',
    dayCountBasis: 'ACT/365'
  }
}

/**
 * 创建测试用的结构参数数据
 */
export function createTestStructureInputs(): StructureInputs {
  return {
    initialPrice: 6000,
    koBarrierPercent: 103,
    stepDownPercent: 1.0,
    coupon: 15.0,
    koObsFreq: '1M',
    paymentFreq: 'MT',
    kiBarrierPercent: 80,
    kiObsFreq: '1D',
    floorReturn: 0
  }
}

/**
 * 创建测试用的交易账户数据
 */
export function createTestTradingAccount(): TradingAccount {
  return {
    portfolio: 'PORT001',
    portfolioName: '投资组合A',
    counterparty: 'CP001',
    counterpartyName: '交易对手A银行'
  }
}

/**
 * 创建测试用的规则设置数据
 */
export function createTestRuleSettings(): RuleSettings {
  return {
    generationRule: 'Forward',
    startDate: '2025-01-28',
    endDate: '2025-07-28',
    holidayRule: ['CNY'],
    businessDayConvention: 'Modified Following'
  }
}

/**
 * 验证交易信息数据
 */
export function validateTradeInfo(tradeInfo: TradeInformation): boolean {
  if (!tradeInfo.productStructure) return false
  if (!tradeInfo.underlyingType) return false
  if (!tradeInfo.underlying) return false
  if (!tradeInfo.tradeDirection) return false
  if (!tradeInfo.tradeDate) return false
  if (!tradeInfo.valueDate) return false
  if (!tradeInfo.principalAmount || tradeInfo.principalAmount <= 0) return false
  if (!tradeInfo.principalCurrency) return false
  return true
}

/**
 * 验证结构参数数据
 */
export function validateStructureInputs(structureInputs: StructureInputs): boolean {
  if (!structureInputs.initialPrice || structureInputs.initialPrice <= 0) return false
  if (!structureInputs.koBarrierPercent || structureInputs.koBarrierPercent <= 0) return false
  if (!structureInputs.coupon || structureInputs.coupon < 0) return false
  if (!structureInputs.koObsFreq) return false
  return true
}


