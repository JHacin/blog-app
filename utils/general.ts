import staticTextEntries from '../assets/static_text.json';

export type StaticTextKey = keyof typeof staticTextEntries;

export const getText = (key: StaticTextKey): string => {
  if (key in staticTextEntries) {
    return staticTextEntries[key];
  }

  return key;
};
