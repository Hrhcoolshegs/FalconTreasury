import { Trade } from '../types';
import { allCounterparties } from './dummyData';

const products = ['FX Spot', 'FX Forward', 'Money Market', 'Treasury Bills', 'Bonds'];
const currencies = [
  { pair: 'USD/NGN', rate: 1450 },
  { pair: 'EUR/NGN', rate: 1680 },
  { pair: 'GBP/NGN', rate: 1920 },
  { pair: 'NGN/USD', rate: 0.00069 },
];
const statuses = ['Confirmed', 'Pending Confirmation', 'Settled', 'Failed', 'Cancelled'];
const directions = ['Buy', 'Sell'];

export const generateTrades = (count: number = 200): Trade[] => {
  const trades: Trade[] = [];
  const baseDate = new Date('2025-11-25');

  for (let i = 1; i <= count; i++) {
    const counterparty = allCounterparties[Math.floor(Math.random() * allCounterparties.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const tradeDate = new Date(baseDate);
    tradeDate.setDate(tradeDate.getDate() - Math.floor(Math.random() * 90));

    const amountNGN = Math.floor(Math.random() * 900000000) + 100000000;
    const amountUSD = Math.floor(amountNGN / currency.rate);

    const statusWeights = [0.7, 0.1, 0.15, 0.03, 0.02];
    const rand = Math.random();
    let status = statuses[0];
    let cumulative = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (rand <= cumulative) {
        status = statuses[j];
        break;
      }
    }

    const confirmedDate = status !== 'Pending Confirmation'
      ? new Date(tradeDate.getTime() + Math.random() * 4 * 60 * 60 * 1000)
      : null;

    const settledDate = status === 'Settled'
      ? new Date(tradeDate.getTime() + (Math.random() * 48 + 24) * 60 * 60 * 1000)
      : null;

    const confirmationDelay = confirmedDate
      ? (confirmedDate.getTime() - tradeDate.getTime()) / (1000 * 60 * 60)
      : null;

    const settlementDelay = settledDate && confirmedDate
      ? (settledDate.getTime() - confirmedDate.getTime()) / (1000 * 60 * 60)
      : null;

    trades.push({
      trade_id: `TRD-${tradeDate.toISOString().split('T')[0].replace(/-/g, '')}-${String(i).padStart(3, '0')}`,
      counterparty_id: counterparty.counterparty_id,
      counterparty_name: counterparty.name,
      trade_date: tradeDate.toISOString(),
      settlement_date: settledDate?.toISOString() || null,
      product_type: product,
      direction,
      currency_pair: currency.pair,
      notional_amount_ngn: amountNGN,
      notional_amount_usd: amountUSD,
      exchange_rate: currency.rate,
      trader_name: counterparty.relationship_manager,
      desk_assignment: counterparty.desk_assignment,
      status,
      confirmation_status: status === 'Pending Confirmation' ? 'Pending' : 'Confirmed',
      confirmation_timestamp: confirmedDate?.toISOString() || null,
      confirmation_delay_hours: confirmationDelay,
      settlement_delay_hours: settlementDelay,
      failure_reason: status === 'Failed' ? 'Counterparty system unavailable' : null,
      pnl_ngn: status === 'Settled' ? Math.random() * 5000000 : 0,
      pnl_usd: status === 'Settled' ? Math.random() * 3500 : 0,
      created_by: counterparty.relationship_manager,
      notes: status === 'Failed' ? 'Requires follow-up with counterparty' : null,
    });
  }

  return trades.sort((a, b) => new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime());
};

export const allTrades = generateTrades(200);
