import { ReactNode } from 'react';

export type NavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

export type ConversionResult = {
  success: boolean;
  data: string;
  error?: string;
};

export interface HashingAlgorithm {
  name: string;
  func: (input: string) => Promise<string>;
}
