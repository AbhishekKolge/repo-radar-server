export interface CountryRow {
  [key: string]: string;
  A2: string;
  A3: string;
  NUM: string;
  dialCode: string;
}

export type CountryCache = Record<string, string>;
