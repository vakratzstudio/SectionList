import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SectionItem, renderCard } from "../mockData";
import { Alignment, Section } from "./Section";

type Props = {
  sections: SectionItem[];
};

export default function SectionList({ sections }: Props) {
  const renderSection = React.useCallback(
    (section: SectionItem, index: number) => {
      const alignment = index % 2 === 0 ? Alignment.RIGHT : Alignment.LEFT;
      const isFirst = index === 0;
      const isLast = index === sections.length - 1;

      return (
        <Section
          key={section.id}
          isFirstInList={isFirst}
          isLastInList={isLast}
          alignment={alignment}
        >
          {section.data.map((item, itemIndex) => (
            <View
              key={item.id}
              style={{
                marginBottom: itemIndex < section.data.length - 1 ? 16 : 0,
              }}
            >
              {renderCard(item)}
            </View>
          ))}
        </Section>
      );
    },
    [sections.length]
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderSection(item, index)}
        estimatedItemSize={200}
      />
    </View>
  );
}
