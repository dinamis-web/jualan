export function formatRupiah(value: number): string {
  if (isNaN(value)) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/g, '');
}

export function parseRupiahInput(input: string): number {
  const clean = input.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export function calculateProgressPercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  const pct = Math.round((current / target) * 100);
  return Math.min(Math.max(pct, 0), 100);
}

export function sanitizePhoneForWhatsApp(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62') && clean.length > 5) {
    clean = '62' + clean;
  }
  return clean;
}
