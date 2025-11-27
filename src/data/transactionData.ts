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
    const amountUSD = Math.floor(amountNGN / (currency.rate || 1));

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

    const settlementStatus = status === 'Settled' ? 'Settled' : status === 'Failed' ? 'Failed' : status === 'Pending Confirmation' ? 'Pending' : 'Confirmed';

    const confirmedDate = status !== 'Pending Confirmation'
      ? new Date(tradeDate.getTime() + Math.random() * 4 * 60 * 60 * 1000)
      : new Date(tradeDate.getTime());

    const settledDate = status === 'Settled'
      ? new Date(tradeDate.getTime() + (Math.random() * 48 + 24) * 60 * 60 * 1000)
      : new Date(tradeDate.getTime() + 48 * 60 * 60 * 1000);

    const confirmationDelay = (confirmedDate.getTime() - tradeDate.getTime()) / (1000 * 60 * 60);
    const settlementDelay = (settledDate.getTime() - confirmedDate.getTime()) / (1000 * 60 * 60);

    const isBuy = direction === 'Buy';
    const currencySold = isBuy ? 'NGN' : currency.pair.split('/')[0];
    const currencyBought = isBuy ? currency.pair.split('/')[0] : 'NGN';
    const amountSold = isBuy ? amountNGN : amountUSD;
    const amountBought = isBuy ? amountUSD : amountNGN;

    trades.push({
      trade_id: `TRD-${tradeDate.toISOString().split('T')[0].replace(/-/g, '')}-${String(i).padStart(3, '0')}`,
      trade_date: tradeDate.toISOString().split('T')[0],
      trade_time: tradeDate.toISOString().split('T')[1],
      value_date: tradeDate.toISOString().split('T')[0],
      settlement_date: settledDate.toISOString().split('T')[0],
      product_type: product,
      currency_pair: currency.pair,
      currency_sold: currencySold,
      currency_bought: currencyBought,
      amount_sold: amountSold,
      amount_bought: amountBought,
      amount_ngn_equivalent: amountNGN,
      amount_usd_equivalent: amountUSD,
      exchange_rate: currency.rate || 1,
      interest_rate: Math.random() * 15 + 5,
      tenor: product.includes('Forward') ? '30D' : 'Spot',
      maturity_date: settledDate.toISOString().split('T')[0],
      counterparty_id: counterparty.counterparty_id,
      counterparty_name: counterparty.name,
      desk: counterparty.desk_assignment,
      trader: counterparty.relationship_manager,
      book: 'BOOK-' + counterparty.desk_assignment.replace(/\s/g, ''),
      portfolio: 'PORT-' + product.replace(/\s/g, ''),
      trade_direction: direction,
      trade_type: 'Principal',
      status,
      confirmation_status: status === 'Pending Confirmation' ? 'Pending' : 'Confirmed',
      confirmation_time: confirmedDate.toISOString(),
      confirmation_method: 'Email',
      settlement_status: settlementStatus,
      settlement_account_ngn: 'NGN-ACC-' + Math.floor(Math.random() * 1000),
      settlement_account_usd: 'USD-ACC-' + Math.floor(Math.random() * 1000),
      nostro_account: 'NOSTRO-' + currencySold + '-' + Math.floor(Math.random() * 100),
      mtm_value: amountNGN * (0.98 + Math.random() * 0.04),
      mtm_currency: 'NGN',
      pnl_realized: status === 'Settled' ? Math.floor(Math.random() * 5000000) : 0,
      pnl_unrealized: status !== 'Settled' ? Math.floor(Math.random() * 2000000) : 0,
      trade_fee: Math.floor(amountNGN * 0.0001),
      broker_commission: Math.floor(amountNGN * 0.0002),
      settlement_delay_hours: settlementDelay,
      delay_reason: settlementDelay > 48 ? 'System delay' : '',
      break_status: status === 'Failed' ? 'Break' : 'None',
      booking_timestamp: tradeDate.toISOString(),
      last_modified_timestamp: new Date().toISOString(),
      modified_by: counterparty.relationship_manager,
      notes: status === 'Failed' ? 'Requires follow-up with counterparty' : '',
    });
  }

  return trades.sort((a, b) => new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime());
};

export const allTrades = generateTrades(200);
