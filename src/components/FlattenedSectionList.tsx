import React, { useMemo, useCallback, useState } from "react";
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import chroma from "chroma-js";
import { SectionItem, CardItem, renderCard } from "../mockData";

type CardLayout = {
  height: number;
  y: number;
};

type SectionLayout = {
  height: number;
  cards: Record<number, CardLayout>;
};

type FlatCard = {
  card: CardItem;
  sectionIndex: number;
  cardIndex: number;
  totalCards: number;
  sectionId: string;
};

type Props = {
  sections: SectionItem[];
};

export default function FlattenedSectionList({ sections }: Props) {
  // Memoize sections length to prevent unnecessary recalculations
  const sectionsLength = sections.length;

  // Track section and card layouts
  const [sectionLayouts, setSectionLayouts] = useState<
    Record<string, SectionLayout>
  >({});

  // Flatten cards and track section info
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

  // Update card layout when a card's height is measured
  const onCardLayout = useCallback(
    (
      event: LayoutChangeEvent,
      cardIndex: number,
      sectionId: string,
      totalCards: number
    ) => {
      const { height } = event.nativeEvent.layout;

      setSectionLayouts((prev) => {
        const section = prev[sectionId] || { height: 0, cards: {} };

        // Calculate section height based on card count and height
        const sectionHeight = height * totalCards;

        // Calculate y position based on card index
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

  // Memoize gradient scale creation to avoid recreating it on every render
  const gradientScales = useMemo(() => {
    const rightScale = chroma.scale(["#FFFFFF", "#BBDEFB"]).mode("lab");
    const leftScale = chroma.scale(["#2196F3", "#BBDEFB"]).mode("lab");
    return { rightScale, leftScale };
  }, []);

  // Calculate gradient colors based on card's position in section with slight overlap
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

      // Calculate position with slight overlap to prevent gaps
      const overlap = 0.001;
      const startRatio = Math.max(0, (cardIndex - overlap) / totalCards);
      const endRatio = Math.min(1, (cardIndex + 1 + overlap) / totalCards);

      return [scale(startRatio).hex(), scale(endRatio).hex()];
    },
    [gradientScales]
  );

  // Calculate border radius based on card position
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

      const getRadius = (isEdge: boolean, isRight: boolean) => {
        if (isEdge) return isRight ? 32 : 0;
        return isRight ? 0 : 32;
      };

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

  // Render function for individual card items
  const renderItem = useCallback(
    ({ item }: { item: FlatCard }) => {
      const colors = getGradientColorsForCard(
        item.cardIndex,
        item.sectionIndex,
        item.totalCards
      );

      const borderRadius = getBorderRadius(
        item.cardIndex,
        item.totalCards,
        item.sectionIndex,
        sections.length
      );

      const isRightAligned = item.sectionIndex % 2 === 0;
      const backgroundColor = isRightAligned ? "#2196F3" : "#FFFFFF";
      const cardPadding = {
        paddingTop: item.cardIndex === 0 ? 50 : 10,
        paddingBottom: item.cardIndex === item.totalCards - 1 ? 50 : 10,
      };

      return (
        <View
          style={styles.wrapper}
          onLayout={(e) =>
            onCardLayout(e, item.cardIndex, item.sectionId, item.totalCards)
          }
        >
          <View style={styles.topHalf} />
          <View style={[styles.bottomHalf, { backgroundColor }]} />
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.cardGradient, borderRadius, cardPadding]}
          >
            {renderCard(item.card)}
          </LinearGradient>
        </View>
      );
    },
    [getGradientColorsForCard, getBorderRadius, onCardLayout, sections.length]
  );

  // Get a unique key for each card to help with recycling
  const getCardKey = useCallback(
    (item: FlatCard) => `${item.sectionId}-${item.cardIndex}`,
    []
  );

  return (
    <FlashList
      data={flatData}
      renderItem={renderItem}
      keyExtractor={getCardKey}
      estimatedItemSize={100}
      removeClippedSubviews={false}
      disableAutoLayout
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    minHeight: 100,
  },
  topHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "50%",
    backgroundColor: "#BBDEFB",
  },
  bottomHalf: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardGradient: {
    position: "relative",
    paddingHorizontal: 24,
    overflow: "hidden",
    flex: 1,
    // Add a tiny overlap to prevent sub-pixel gaps
    marginVertical: -0.5,
  },
});
