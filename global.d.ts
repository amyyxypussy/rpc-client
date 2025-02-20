export {};

declare global {
  const GM_setValue: (name: string, value: string) => void;
  const GM_getValue: (name: string, defaultValue?: string) => string;
  const GM_deleteValue: (name: string) => void;

  interface Window {
    deleteWinNo: () => void;
  }
}
