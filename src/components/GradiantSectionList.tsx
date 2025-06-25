import React, { useMemo, useCallback } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import chroma from "chroma-js";
import { SectionItem, CardItem, renderCard } from "../mockData";

type FlatCard = {
  card: CardItem;
  sectionIndex: number;
  cardIndex: number;
  totalCards: number;
};

type Props = {
  sections: SectionItem[];
};

export default function FlattenedSectionList({ sections }: Props) {
  // Memoize sections length to prevent unnecessary recalculations
  const sectionsLength = sections.length;

  // Flatten cards only (no headers)
  const flatData: FlatCard[] = useMemo(() => {
    const result: FlatCard[] = [];
    sections.forEach((section, sIndex) => {
      const { data } = section;
      const totalCards = data.length;
      data.forEach((card, cIndex) => {
        result.push({
          card,
          sectionIndex: sIndex,
          cardIndex: cIndex,
          totalCards,
        });
      });
    });
    return result;
  }, [sections]);

  // Memoize gradient scale creation to avoid recreating it on every render
  const gradientScales = useMemo(() => {
    const rightScale = chroma.scale(["#FFFFFF", "#BBDEFB"]).mode("lab");
    const leftScale = chroma.scale(["#2196F3", "#BBDEFB"]).mode("lab");
    return { rightScale, leftScale };
  }, []);

  // Memoize gradient color calculation
  const getGradientColorsForCard = useCallback(
    (
      sectionIndex: number,
      cardIndex: number,
      totalCards: number
    ): [string, string] => {
      const isRightAligned = sectionIndex % 2 === 0;
      const scale = isRightAligned
        ? gradientScales.rightScale
        : gradientScales.leftScale;

      const startRatio = cardIndex / totalCards;
      const endRatio = (cardIndex + 1) / totalCards;

      return [scale(startRatio).hex(), scale(endRatio).hex()];
    },
    [gradientScales]
  );

  // Memoize border radius calculation
  const getBorderRadius = useCallback(
    (
      cardIndexInSection: number,
      totalCardsInSection: number,
      sectionIndex: number
    ): ViewStyle => {
      const isFirstCard = cardIndexInSection === 0;
      const isLastCard = cardIndexInSection === totalCardsInSection - 1;
      const isFirstSection = sectionIndex === 0;
      const isLastSection = sectionIndex === sectionsLength - 1;
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
    [sectionsLength]
  );

  // Memoize the renderItem function to prevent recreation on each render
  const renderItem = useCallback(
    ({ item }: { item: FlatCard }) => {
      const colors = getGradientColorsForCard(
        item.sectionIndex,
        item.cardIndex,
        item.totalCards
      );

      const borderRadius = getBorderRadius(
        item.cardIndex,
        item.totalCards,
        item.sectionIndex
      );

      const isRightAligned = item.sectionIndex % 2 === 0;
      const backgroundColor = isRightAligned ? "#2196F3" : "#FFFFFF";

      return (
        <View style={styles.wrapper}>
          <View style={styles.topHalf} />
          <View style={[styles.bottomHalf, { backgroundColor }]} />
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.cardGradient, borderRadius]}
          >
            {renderCard(item.card)}
          </LinearGradient>
        </View>
      );
    },
    [getGradientColorsForCard, getBorderRadius]
  );

  return (
    <FlashList
      data={flatData}
      estimatedItemSize={350}
      keyExtractor={(item) => item.card.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    minHeight: 150,
  },
  topHalf: {
    height: "50%",
    backgroundColor: "#BBDEFB",
  },
  bottomHalf: {
    height: "50%",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
});
