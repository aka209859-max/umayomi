/**
 * Shared State Manager
 * ルート間でデータを共有するためのグローバル状態管理
 * 
 * TODO: Replace with D1 Database in production
 */

import type { HCRecord } from '../parsers/ck/hc';

// Global state
export const globalState = {
  // Tomorrow races data
  tomorrowRaces: new Map<string, HCRecord[]>(),
  uploadedDate: '',
  
  // Factors data
  factorsStore: [] as any[],
  
  // Helper methods
  addFactor(factor: any) {
    this.factorsStore.push(factor);
  },
  
  getFactor(id: number) {
    return this.factorsStore.find(f => f.id === id);
  },
  
  deleteFactor(id: number) {
    const index = this.factorsStore.findIndex(f => f.id === id);
    if (index !== -1) {
      this.factorsStore.splice(index, 1);
    }
  },
  
  updateFactor(id: number, updates: any) {
    const factor = this.getFactor(id);
    if (factor) {
      Object.assign(factor, updates);
    }
  },
  
  getAllFactors() {
    return this.factorsStore;
  }
};
