import React, { useMemo, useCallback, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import chroma from "chroma-js";
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
      const { sectionId, cardIndex, totalCards } = item;

      setSectionLayouts((prev) => {
        const section = prev[sectionId] || { height: 0, cards: {} };
        if (section.cards[cardIndex]?.height === height) return prev;

        const sectionHeight = height * totalCards;
        const y = height * cardIndex;

        return {
          ...prev,
          [sectionId]: {
            height: sectionHeight,
            cards: {
              ...section.cards,
              [cardIndex]: { height, y },
            },
          },
        };
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
    (
      cardIndex: number,
      sectionIndex: number,
      totalCards: number
    ): [string, string] => {
      const isRightAligned = sectionIndex % 2 === 0;
      const scale = isRightAligned
        ? gradientScales.rightScale
        : gradientScales.leftScale;

      const overlap = 0.001;
      const startRatio = Math.max(0, (cardIndex - overlap) / totalCards);
      const endRatio = Math.min(1, (cardIndex + 1 + overlap) / totalCards);

      return [scale(startRatio).hex(), scale(endRatio).hex()];
    },
    [gradientScales]
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
      renderItem={({ item }) => (
        <MemoizedCard
          item={item}
          onLayout={onCardLayout}
          getGradientColorsForCard={getGradientColorsForCard}
          getBorderRadius={getBorderRadius}
          sectionsCount={sectionsLength}
        />
      )}
      keyExtractor={getCardKey}
      estimatedItemSize={100}
      removeClippedSubviews={false}
      disableAutoLayout
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}
