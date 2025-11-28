/**
 * 观察表生成工具函数
 */
import { StructureInputs, TradeInformation, ObservationRow, RuleSettings } from '@/types'
import dayjs from 'dayjs'
import { parseTenor } from './date'

/**
 * 计算降敲后的敲出价格百分比
 */
function calculateKOBarrierPercent(
  initialPercent: number,
  stepDown: number | null | undefined,
  period: number,
  floor?: number
): number {
  if (!stepDown) {
    return initialPercent
  }

  const calculated = initialPercent - (period - 1) * stepDown

  if (floor !== undefined && calculated < floor) {
    return floor
  }

  return calculated
}

/**
 * 计算潜在票息金额
 */
function calculatePotentialCouponAmount(
  principal: number,
  coupon: number,
  valueDate: string,
  observationDate: string,
  dayCountBasis: string
): number {
  const start = dayjs(valueDate)
  const end = dayjs(observationDate)
  const days = end.diff(start, 'day')

  let basisDays = 365
  if (dayCountBasis === 'ACT/360') {
    basisDays = 360
  } else if (dayCountBasis === '30/360') {
    basisDays = 360
  }

  return principal * (coupon / 100) * (days / basisDays)
}

/**
 * 生成观察日列表（简化版本，实际需要考虑假日规则）
 */
function generateObservationDates(
  startDate: string,
  endDate: string,
  frequency: string
): string[] {
  const dates: string[] = []
  let current = dayjs(startDate)
  const end = dayjs(endDate)

  const freqMap: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '2W': 14,
    '1M': 1,
    '3M': 3,
    '6M': 6,
    '1Y': 12
  }

  const unitMap: Record<string, 'day' | 'month'> = {
    '1D': 'day',
    '1W': 'day',
    '2W': 'day',
    '1M': 'month',
    '3M': 'month',
    '6M': 'month',
    '1Y': 'month'
  }

  const increment = freqMap[frequency]
  const unit = unitMap[frequency] || 'month'

  while (current.isSameOrBefore(end)) {
    dates.push(current.format('YYYY-MM-DD'))
    
    if (unit === 'day') {
      current = current.add(increment, 'day')
    } else {
      current = current.add(increment, 'month')
    }
  }

  return dates
}

/**
 * 生成观察表
 */
export function generateObservationSchedule(
  tradeInfo: TradeInformation,
  structureInputs: StructureInputs,
  ruleSettings: RuleSettings
): ObservationRow[] {
  const schedule: ObservationRow[] = []

  if (!tradeInfo.valueDate || !structureInputs.initialPrice || !structureInputs.koBarrierPercent) {
    return schedule
  }

  const startDate = ruleSettings.startDate || tradeInfo.valueDate
  const endDate = ruleSettings.endDate || tradeInfo.maturityDate

  if (!startDate || !endDate) {
    return schedule
  }

  // 生成观察日期列表
  const observationDates = generateObservationDates(
    startDate,
    endDate,
    structureInputs.koObsFreq || '1M'
  )

  // 生成每一期的数据
  observationDates.forEach((date, index) => {
    const period = index + 1

    // 计算敲出价格百分比
    const koBarrierPercent = calculateKOBarrierPercent(
      structureInputs.koBarrierPercent!,
      structureInputs.stepDownPercent,
      period
    )

    // 计算敲出价格绝对值
    const koBarrierPrice = structureInputs.initialPrice! * (koBarrierPercent / 100)

    // 计算敲入价格绝对值（仅SnowBall）
    let kiBarrierPrice: number | undefined
    if (structureInputs.kiBarrierPercent) {
      kiBarrierPrice = structureInputs.initialPrice! * (structureInputs.kiBarrierPercent / 100)
    }

    // 计算潜在票息金额
    const potentialCouponAmount =
      tradeInfo.principalAmount && structureInputs.coupon
        ? calculatePotentialCouponAmount(
            tradeInfo.principalAmount,
            structureInputs.coupon,
            tradeInfo.valueDate,
            date,
            tradeInfo.dayCountBasis || 'ACT/365'
          )
        : 0

    schedule.push({
      period,
      observationDate: date,
      underlyingTicker: tradeInfo.underlying || '',
      fixingPrice: null, // 未来定盘价，录入时为null
      koBarrierPrice,
      kiBarrierPrice,
      potentialCouponAmount,
      status: 'Pending'
    })
  })

  return schedule
}
