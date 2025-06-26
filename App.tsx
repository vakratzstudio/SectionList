import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  StatusBar,
} from "react-native";
import { mockData as initialMockData, renderCard } from "./src/mockData";
import FlattenedSectionList from "./src/components/FlattenedSectionList";
import { useState } from "react";
import SectionList from "./src/components/SectionList";
import { SectionItem, CardItem, Alignment } from "./src/types";

// Simple ID generator for React Native
const generateId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function App() {
  const [mockData, setMockData] = useState<SectionItem[]>(initialMockData);
  const [selectedSection, setSelectedSection] = useState(mockData[0]?.id || "");

  // Generate a random card
  const generateRandomCard = (): CardItem => {
    const repeatCount = Math.floor(Math.random() * 8) + 1; // 1 to 8 times
    const content = Array.from({ length: repeatCount })
      .fill("This is a randomly generated card with some sample content. ")
      .join("");

    return {
      id: `card-${generateId()}`,
      title: `Card ${Math.floor(Math.random() * 1000)}`,
      content: content.trim(),
    };
  };

  // Add a random card to the selected section
  const addRandomCard = () => {
    if (!selectedSection) return;

    const newCard = generateRandomCard();
    setMockData((prevData: SectionItem[]) =>
      prevData.map((section: SectionItem) =>
        section.id === selectedSection
          ? { ...section, data: [...section.data, newCard] }
          : section
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.controlsContainer}>
        <Text style={styles.label}>Select Section:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sectionScroll}
          contentContainerStyle={styles.sectionScrollContent}
        >
          {mockData.map((section, index) => (
            <View
              key={section.id}
              style={[
                styles.sectionButton,
                selectedSection === section.id && styles.selectedSectionButton,
              ]}
            >
              <Button
                title={`${index + 1}`}
                onPress={() => setSelectedSection(section.id)}
                color={selectedSection === section.id ? "#fff" : "#2196F3"}
              />
            </View>
          ))}
        </ScrollView>
        <Button
          title="Add Random Card"
          onPress={addRandomCard}
          color="#4CAF50"
        />
      </View>

      <View style={styles.listContainer}>
        <FlattenedSectionList sections={mockData} />
        {/* <SectionList sections={mockData} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 40,
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  sectionScroll: {
    maxHeight: 50,
    marginBottom: 12,
  },
  sectionScrollContent: {
    paddingHorizontal: 4,
  },
  sectionButton: {
    marginHorizontal: 4,
    borderRadius: 20,
    overflow: "hidden",
  },
  selectedSectionButton: {
    backgroundColor: "#2196F3",
  },
});
