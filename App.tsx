import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  StatusBar,
} from "react-native";
import { renderCard, getSectionIds, getSectionById } from "./src/mockData";
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
  const [mockData, setMockData] = useState<SectionItem[]>([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [allSectionIds, setAllSectionIds] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch section IDs and first 4 sections on mount
  React.useEffect(() => {
    let isMounted = true;
    getSectionIds().then(ids => {
      setAllSectionIds(ids);
      const firstFour = ids.slice(0, 4);
      return Promise.all(firstFour.map(getSectionById));
    }).then(sections => {
      const validSections = sections.filter(Boolean) as SectionItem[];
      if (isMounted) {
        setMockData(validSections);
        if (validSections.length > 0) {
          setSelectedSection(validSections[0].id);
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Handler to load next 4 sections
  const handleLoadMoreSections = React.useCallback(() => {
    if (loadingMore || allSectionIds.length === 0) return;
    const loadedCount = mockData.length;
    const nextIds = allSectionIds.slice(loadedCount, loadedCount + 4);
    if (nextIds.length === 0) return;
    setLoadingMore(true);
    Promise.all(nextIds.map(getSectionById)).then(sections => {
      const validSections = sections.filter(Boolean) as SectionItem[];
      setMockData(prev => [...prev, ...validSections]);
      setLoadingMore(false);
    });
  }, [loadingMore, allSectionIds, mockData.length]);

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
      prevData.map((section: SectionItem) => {
        if (section.id !== selectedSection) return section;
        const insertIndex = Math.floor(Math.random() * (section.data.length + 1));
        const newData = [
          ...section.data.slice(0, insertIndex),
          newCard,
          ...section.data.slice(insertIndex)
        ];
        return { ...section, data: newData };
      })
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
        {/* <FlattenedSectionList sections={mockData} /> */}
        <SectionList
          sections={
            mockData.length > 0
              ? mockData
              : Array.from({ length: 4 }).map((_, i) => ({
                  id: `placeholder-section-${i}`,
                  title: '',
                  data: [
                    {
                      id: `placeholder-card-${i}`,
                      title: '',
                      content: '',
                      isPlaceholder: true,
                    },
                  ],
                }))
          }
          onLoadMore={handleLoadMoreSections}
        />
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
