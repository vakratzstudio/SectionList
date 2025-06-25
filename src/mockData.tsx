import React from "react";
import { Text, View, StyleSheet } from "react-native";

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

const generateCards = (count: number, sectionIndex: number): CardItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `section-${sectionIndex}-card-${i}`,
    title: `Card ${i + 1}`,
    content:
      `This is card ${i + 1} in section ${sectionIndex + 1}. ` +
      `It contains some sample content to demonstrate the layout. ` +
      `Each card can have different amounts of content and different heights.`,
  }));
};

export const mockData: SectionItem[] = [
  {
    id: "section-1",
    title: "First Section",
    data: generateCards(3, 0),
  },
  {
    id: "section-2",
    title: "Second Section",
    data: generateCards(2, 1),
  },
  {
    id: "section-3",
    title: "Third Section",
    data: generateCards(4, 2),
  },
  {
    id: "section-4",
    title: "Fourth Section",
    data: generateCards(1, 3),
  },
  {
    id: "section-5",
    title: "Fifth Section",
    data: generateCards(7, 4),
  },
];

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "white",
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardContent: {
    fontSize: 14,
    color: "#666",
  },
});

export const renderCard = (item: CardItem) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardContent}>{item.content}</Text>
  </View>
);
