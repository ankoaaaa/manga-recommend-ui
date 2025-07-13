// 履歴データの型を定義
export interface HistoryItem {
  id: number;
  inputTitles: string[];
  recommendations: any[]; // AIの応答をそのまま保存
  date: string;
}

const HISTORY_KEY = 'manga-recommend-history';

// 履歴を読み込む関数
export const loadHistory = (): HistoryItem[] => {
  const historyJson = localStorage.getItem(HISTORY_KEY);

  if (!historyJson) {
    return [];
  }

  try {
    const history = JSON.parse(historyJson);
    return history;
  } catch (e) {
    console.error('履歴のパースに失敗しました:', e);
    localStorage.removeItem(HISTORY_KEY); // 壊れたデータを削除
    return [];
  }
};

// 履歴を保存する関数
export const saveHistory = (history: HistoryItem[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};
