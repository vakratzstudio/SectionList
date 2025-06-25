import { StatusBar } from "expo-status-bar";
import { StyleSheet, SectionList, View } from "react-native";
import { Section, Alignment } from "./src/components/Section";
import { mockData, renderCard, CardItem } from "./src/mockData";
import GradientSectionList from "./src/components/GradiantSectionList";

export default function App() {
  // Render each section with its cards
  const renderSection = ({
    section,
    isFirst,
    isLast,
  }: {
    section: { data: CardItem[]; id: string; title: string };
    isFirst: boolean;
    isLast: boolean;
  }) => {
    const alignment =
      parseInt(section.id.split("-")[1]) % 2 === 0
        ? Alignment.LEFT
        : Alignment.RIGHT;

    return (
      <Section
        key={section.id}
        isFirstInList={isFirst}
        isLastInList={isLast}
        alignment={alignment}
      >
        {section.data.map((item, index) => (
          <View
            key={item.id}
            style={{ marginBottom: index < section.data.length - 1 ? 16 : 0 }}
          >
            {renderCard(item)}
          </View>
        ))}
      </Section>
    );
  };

  return (
    // <View style={styles.container}>
    //   <SectionList
    //     sections={mockData}
    //     keyExtractor={(item) => item.id}
    //     renderItem={({ item, section, index }) => {
    //       const sectionIndex = mockData.findIndex((s) => s.id === section.id);
    //       // Only render the section for the first item in each section
    //       if (index === 0) {
    //         return renderSection({
    //           section,
    //           isFirst: sectionIndex === 0,
    //           isLast: sectionIndex === mockData.length - 1,
    //         });
    //       }
    //       return null;
    //     }}
    //     renderSectionHeader={() => null}
    //     renderSectionFooter={() => null}
    //     stickySectionHeadersEnabled={false}
    //   />
    // </View>

    <GradientSectionList sections={mockData} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 40,
  },
});
