export type QuestionOption = {
  label: string;
  value: string;
};

export type Question = {
  id: number;
  text: string;
  options: QuestionOption[];
};

export type UserAnswers = Record<number, string>;

export enum ChimdumProduct {
  GHANGA_TONIC = 'Ghanga Tonic',
  IMMUNE_BOOSTER = 'Chimdum Immune Booster',
  BITTERS = 'Chimdum Bitters',
  VITALITY_DUO = 'Vitality Duo (Ghanga Tonic + Immune Booster)',
  DAILY_RESET = 'Daily Reset (Immune Booster + Bitters)',
  TOTAL_BALANCE = 'Total Balance Bundle',
}

export interface RecommendationResult {
  product: ChimdumProduct;
  insight: string;
  routine: string;
}
