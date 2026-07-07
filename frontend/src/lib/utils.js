import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateStr, format = 'short') {
  const date = new Date(dateStr);
  if (format === 'relative') {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
  }
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: format === 'long' ? 'long' : 'medium'
  }).format(date);
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const DOCUMENT_TYPE_LABELS = {
  invoice: 'Invoice',
  quotation: 'Quotation',
  offer_letter: 'Offer Letter',
  certificate: 'Certificate',
  report: 'Report',
  question_paper: 'Question Paper',
  resume: 'Resume'
};