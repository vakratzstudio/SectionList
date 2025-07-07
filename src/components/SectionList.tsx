import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { renderCard } from "../mockData";
import ShimmerCard from "./ShimmerCard";
import { Section } from "./Section";
import { Alignment, SectionItem } from "../types";

type Props = {
  sections: SectionItem[];
  onLoadMore?: () => void;
};

export default function SectionList({ sections, onLoadMore }: Props) {
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
                marginVertical: 10,
              }}
            >
              {item.isPlaceholder ? <ShimmerCard /> : renderCard(item)}
            </View>
          ))}
        </Section>
      );
    },
    [sections.length]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* make this sure flashlist is better prefforming then flatlist,in my case on iphine 16 bpro max flatlist worked better*/}
      <FlashList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderSection(item, index)}
        estimatedItemSize={200}
        onEndReached={onLoadMore}
      />
    </View>
  );
}
