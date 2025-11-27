import { useState, useEffect } from 'react';
import { Counterparty } from '../types';
import { counterparties as initialCounterparties } from '../data/dummyData';

export function useCounterparties() {
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('falcon_counterparties');
    if (stored) {
      setCounterparties(JSON.parse(stored));
    } else {
      setCounterparties(initialCounterparties);
      localStorage.setItem('falcon_counterparties', JSON.stringify(initialCounterparties));
    }
  }, []);

  const saveToStorage = (data: Counterparty[]) => {
    localStorage.setItem('falcon_counterparties', JSON.stringify(data));
    setCounterparties(data);
  };

  const createCounterparty = (counterparty: Omit<Counterparty, 'counterparty_id'>) => {
    const newId = `CP-NG-${String(counterparties.length + 1).padStart(3, '0')}`;
    const newCounterparty: Counterparty = {
      ...counterparty,
      counterparty_id: newId,
    };
    const updated = [...counterparties, newCounterparty];
    saveToStorage(updated);
    return newCounterparty;
  };

  const updateCounterparty = (id: string, updates: Partial<Counterparty>) => {
    const updated = counterparties.map(cp =>
      cp.counterparty_id === id ? { ...cp, ...updates } : cp
    );
    saveToStorage(updated);
  };

  const deleteCounterparty = (id: string) => {
    const updated = counterparties.filter(cp => cp.counterparty_id !== id);
    saveToStorage(updated);
  };

  const getCounterparty = (id: string) => {
    return counterparties.find(cp => cp.counterparty_id === id);
  };

  return {
    counterparties,
    createCounterparty,
    updateCounterparty,
    deleteCounterparty,
    getCounterparty,
  };
}
