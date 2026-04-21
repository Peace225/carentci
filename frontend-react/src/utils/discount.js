export const DISCOUNT_TABLE = {
  3:10000,4:13000,5:17000,6:20000,7:25000,8:35000,9:40000,10:50000,
  11:53000,12:55000,13:58000,14:60000,15:65000,16:68000,17:70000,
  18:75000,19:80000,20:100000,21:110000,22:120000,23:130000,24:140000,
  25:150000,26:160000,27:170000,28:180000,29:190000,30:200000
}

export function getDiscount(days) {
  return DISCOUNT_TABLE[days] || 0
}

export function formatPrice(amount) {
  return Number(amount).toLocaleString('fr-FR') + ' FCFA'
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}
