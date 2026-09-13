export function formatDate(value: string) {
  if (!value) return ''
  return new Date(value).toLocaleString('vi-VN')
}

export function formatCurrency(value: number) {
  if (value === undefined || value === null) return '-'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
