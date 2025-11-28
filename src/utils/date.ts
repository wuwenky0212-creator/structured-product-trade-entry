/**
 * 日期工具函数
 */
import dayjs, { Dayjs } from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)

/**
 * 解析期限字符串（如 "6M", "1Y"）为月数
 */
export function parseTenor(tenor: string): number | null {
  const match = tenor.match(/^(\d+)([MY])$/)
  if (!match) return null

  const value = parseInt(match[1])
  const unit = match[2]

  if (unit === 'M') {
    return value
  } else if (unit === 'Y') {
    return value * 12
  }

  return null
}

/**
 * 计算到期日（起息日 + 期限）
 */
export function calculateMaturityDate(valueDate: string, tenor: string): string {
  if (!valueDate || !tenor) return ''

  const months = parseTenor(tenor)
  if (months === null) return ''

  return dayjs(valueDate).add(months, 'month').format('YYYY-MM-DD')
}

/**
 * 计算结算日（到期日 + 2个工作日）
 * 简化版本：直接加2天，实际应该考虑工作日历
 */
export function calculateSettlementDate(maturityDate: string): string {
  if (!maturityDate) return ''
  return dayjs(maturityDate).add(2, 'day').format('YYYY-MM-DD')
}

/**
 * 验证日期格式
 */
export function isValidDate(dateString: string): boolean {
  return dayjs(dateString).isValid()
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: string | Dayjs): string {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * 获取当前日期
 */
export function getCurrentDate(): string {
  return dayjs().format('YYYY-MM-DD')
}

/**
 * 获取交易日后的默认起息日（T+1 或 T+2）
 */
export function getDefaultValueDate(tradeDate: string, offset: number = 1): string {
  if (!tradeDate) return ''
  return dayjs(tradeDate).add(offset, 'day').format('YYYY-MM-DD')
}


