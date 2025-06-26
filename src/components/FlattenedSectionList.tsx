import React, { useMemo, useCallback, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import chroma from "chroma-js";
import { isEqual } from "lodash";
import { LayoutChangeEvent, ViewStyle } from "react-native";
import MemoizedCard from "./MemoizedCard";
import { FlatCard, SectionLayout, SectionItem } from "../types";

type Props = {
  sections: SectionItem[];
};

export default function FlattenedSectionList({ sections }: Props) {
  const sectionsLength = sections.length;

  const [sectionLayouts, setSectionLayouts] = useState<
    Record<string, SectionLayout>
  >({});
  const [layoutVersion, setLayoutVersion] = useState(0);

  const flatData: FlatCard[] = useMemo(() => {
    const result: FlatCard[] = [];
    sections.forEach((section, sIndex) => {
      const { data, id: sectionId } = section;
      const totalCards = data.length;
      data.forEach((card, cIndex) => {
        result.push({
          card,
          sectionIndex: sIndex,
          cardIndex: cIndex,
          totalCards,
          sectionId,
        });
      });
    });
    return result;
  }, [sections]);

  const onCardLayout = useCallback(
    (event: LayoutChangeEvent, item: FlatCard) => {
      const { height } = event.nativeEvent.layout;
      const { sectionId, cardIndex } = item;

      setSectionLayouts((prev) => {
        const prevSection = prev[sectionId] || { height: 0, cards: {} };
        const prevCards = {
          ...prevSection.cards,
          [cardIndex]: { height, y: 0 },
        };

        let y = 0;
        const sorted = Object.entries(prevCards)
          .map(([k, v]) => ({ index: Number(k), ...v }))
          .sort((a, b) => a.index - b.index);

        const updatedCards: SectionLayout["cards"] = {};
        sorted.forEach(({ index, height }) => {
          updatedCards[index] = { height, y };
          y += height;
        });

        const newLayout = {
          height: y,
          cards: updatedCards,
        };

        const changed = !isEqual(prev[sectionId], newLayout);
        if (changed) {
          setLayoutVersion((v) => v + 1);
          return { ...prev, [sectionId]: newLayout };
        }

        return prev;
      });
    },
    []
  );

  const gradientScales = useMemo(() => {
    const rightScale = chroma.scale(["#FFFFFF", "#BBDEFB"]).mode("lab");
    const leftScale = chroma.scale(["#2196F3", "#BBDEFB"]).mode("lab");
    return { rightScale, leftScale };
  }, []);

  const getGradientColorsForCard = useCallback(
    (item: FlatCard): [string, string] => {
      const { sectionId, cardIndex, sectionIndex } = item;
      const layout = sectionLayouts[sectionId];
      const scale =
        sectionIndex % 2 === 0
          ? gradientScales.rightScale
          : gradientScales.leftScale;

      if (!layout) return [scale(0).hex(), scale(1).hex()];
      const card = layout.cards[cardIndex];
      if (!card) return [scale(0).hex(), scale(1).hex()];

      const startRatio = card.y / layout.height;
      const endRatio = (card.y + card.height) / layout.height;

      return [scale(startRatio).hex(), scale(endRatio).hex()];
    },
    [gradientScales, sectionLayouts]
  );

  const getBorderRadius = useCallback(
    (
      cardIndex: number,
      totalCards: number,
      sectionIndex: number,
      sectionsCount: number
    ): ViewStyle => {
      const isFirstCard = cardIndex === 0;
      const isLastCard = cardIndex === totalCards - 1;
      const isFirstSection = sectionIndex === 0;
      const isLastSection = sectionIndex === sectionsCount - 1;
      const isRightAligned = sectionIndex % 2 === 0;

      const getRadius = (isEdge: boolean, isRight: boolean) =>
        isEdge ? (isRight ? 32 : 0) : isRight ? 0 : 32;

      return {
        borderTopLeftRadius:
          !isFirstSection && isFirstCard ? getRadius(true, isRightAligned) : 0,
        borderTopRightRadius:
          !isFirstSection && isFirstCard ? getRadius(false, isRightAligned) : 0,
        borderBottomLeftRadius:
          !isLastSection && isLastCard ? getRadius(true, isRightAligned) : 0,
        borderBottomRightRadius:
          !isLastSection && isLastCard ? getRadius(false, isRightAligned) : 0,
        overflow: "hidden",
      };
    },
    []
  );

  const getCardKey = useCallback(
    (item: FlatCard) => `${item.sectionId}-${item.cardIndex}`,
    []
  );

  return (
    <FlashList
      data={flatData}
      extraData={layoutVersion}
      renderItem={({ item }) => (
        <MemoizedCard
          item={item}
          onLayout={onCardLayout}
          getGradientColorsForCard={() => getGradientColorsForCard(item)}
          getBorderRadius={getBorderRadius}
          sectionsCount={sectionsLength}
        />
      )}
      keyExtractor={getCardKey}
      estimatedItemSize={200}
      removeClippedSubviews={false}
      disableAutoLayout
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}
