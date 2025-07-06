import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CardItem, SectionItem } from "./types";

const generateCards = (count: number, sectionIndex: number): CardItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const repeatCount = Math.floor(Math.random() * 8) + 1; // 1 to 8 times
    const repeatedContent = Array.from({ length: repeatCount })
      .fill(
        `This is card ${i + 1} in section ${
          sectionIndex + 1
        }. It contains some sample content to demonstrate the layout. `
      )
      .join(" ");

    return {
      id: `section-${sectionIndex}-card-${i}`,
      title: `Card ${i + 1}`,
      content: repeatedContent,
    };
  });
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
  {
    id: "section-6",
    title: "Sixth Section",
    data: generateCards(1, 5),
  },
  {
    id: "section-7",
    title: "Seventh Section",
    data: generateCards(3, 6),
  },
  {
    id: "section-8",
    title: "Eighth Section",
    data: generateCards(2, 7),
  },
  {
    id: "section-9",
    title: "Ninth Section",
    data: generateCards(4, 8),
  },
  {
    id: "section-10",
    title: "Tenth Section",
    data: generateCards(1, 9),
  },
];

// --- Mock API helpers ---
function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function getSectionIds(): Promise<string[]> {
  const ids = mockData.map((section) => section.id);
  return delay(600, ids); // 600ms delay
}

export function getSectionById(id: string): Promise<SectionItem | undefined> {
  const section = mockData.find((section) => section.id === id);
  return delay(700, section); // 700ms delay
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 30,
    backgroundColor: "white",
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
