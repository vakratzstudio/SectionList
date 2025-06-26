export enum Alignment {
  LEFT,
  RIGHT,
}

export type FlatCard = {
  card: CardItem;
  sectionIndex: number;
  cardIndex: number;
  totalCards: number;
  sectionId: string;
};

export type CardLayout = {
  height: number;
  y: number;
};

export type SectionLayout = {
  height: number;
  cards: Record<number, CardLayout>;
};

export interface CardItem {
  id: string;
  title: string;
  content: string;
}

export interface SectionItem {
  id: string;
  title: string;
  data: CardItem[];
}
