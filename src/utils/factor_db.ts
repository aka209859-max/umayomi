/**
 * Factor Scores Database Utility
 * ファクタースコアのDB操作ユーティリティ
 */

import type { FactorDisplayResult, FactorSaveCondition } from '../types/factor';

/**
 * ファクタースコアをDBに保存
 */
export async function saveFactorScore(
  factor: FactorDisplayResult,
  saveCondition?: FactorSaveCondition
): Promise<boolean> {
  // TODO: Cloudflare D1データベースへの保存実装
  // Phase 6-A で実装予定
  
  console.log('saveFactorScore called:', factor.id);
  
  // 仮実装: ローカルストレージに保存
  if (typeof localStorage !== 'undefined') {
    const key = `factor_${factor.id}`;
    localStorage.setItem(key, JSON.stringify(factor));
    return true;
  }
  
  return false;
}

/**
 * 保存済みファクタースコアを取得
 */
export async function getSavedFactorScores(): Promise<FactorDisplayResult[]> {
  // TODO: Cloudflare D1データベースから取得
  // Phase 6-A で実装予定
  
  console.log('getSavedFactorScores called');
  
  // 仮実装: ローカルストレージから取得
  if (typeof localStorage !== 'undefined') {
    const results: FactorDisplayResult[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('factor_')) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            results.push(JSON.parse(value));
          } catch (e) {
            console.error('Failed to parse factor:', e);
          }
        }
      }
    }
    return results;
  }
  
  return [];
}

/**
 * ファクターIDからスコアを取得
 */
export async function getFactorScoreById(factorId: string): Promise<FactorDisplayResult | null> {
  // TODO: Cloudflare D1データベースから取得
  // Phase 6-A で実装予定
  
  console.log('getFactorScoreById called:', factorId);
  
  // 仮実装: ローカルストレージから取得
  if (typeof localStorage !== 'undefined') {
    const key = `factor_${factorId}`;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Failed to parse factor:', e);
      }
    }
  }
  
  return null;
}

/**
 * ファクタースコアを削除
 */
export async function deleteFactorScore(factorId: string): Promise<boolean> {
  // TODO: Cloudflare D1データベースから削除
  // Phase 6-A で実装予定
  
  console.log('deleteFactorScore called:', factorId);
  
  // 仮実装: ローカルストレージから削除
  if (typeof localStorage !== 'undefined') {
    const key = `factor_${factorId}`;
    localStorage.removeItem(key);
    return true;
  }
  
  return false;
}

/**
 * 全ファクタースコアを削除
 */
export async function clearAllFactorScores(): Promise<boolean> {
  // TODO: Cloudflare D1データベースをクリア
  // Phase 6-A で実装予定
  
  console.log('clearAllFactorScores called');
  
  // 仮実装: ローカルストレージをクリア
  if (typeof localStorage !== 'undefined') {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('factor_')) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  }
  
  return false;
}
