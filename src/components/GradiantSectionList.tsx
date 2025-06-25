import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import chroma from "chroma-js";
import { SectionItem, CardItem, renderCard } from "../mockData";

export enum Alignment {
  LEFT,
  RIGHT,
}

type FlatCard = {
  card: CardItem;
  sectionIndex: number;
  cardIndex: number;
  totalCards: number;
};

type Props = {
  sections: SectionItem[];
};

export default function GradientSectionList({ sections }: Props) {
  // Flatten cards only (no headers)
  const flatData: FlatCard[] = useMemo(() => {
    const result: FlatCard[] = [];
    sections.forEach((section, sIndex) => {
      section.data.forEach((card, cIndex) => {
        result.push({
          card,
          sectionIndex: sIndex,
          cardIndex: cIndex,
          totalCards: section.data.length,
        });
      });
    });
    return result;
  }, [sections]);

  const getBaseColors = (sectionIndex: number): [string, string] => {
    const alignment = sectionIndex % 2 === 0 ? Alignment.RIGHT : Alignment.LEFT;
    return alignment === Alignment.RIGHT
      ? ["#FFFFFF", "#BBDEFB"]
      : ["#2196F3", "#BBDEFB"];
  };

  const getGradientColorsForCard = (
    sectionIndex: number,
    cardIndex: number,
    totalCards: number
  ): [string, string] => {
    const baseColors = getBaseColors(sectionIndex);
    const scale = chroma.scale(baseColors).mode("lab");

    const startRatio = cardIndex / totalCards;
    const endRatio = (cardIndex + 1) / totalCards;

    return [scale(startRatio).hex(), scale(endRatio).hex()];
  };

  const getBorderRadius = (
    cardIndexInSection: number,
    totalCardsInSection: number,
    sectionIndex: number
  ): ViewStyle => {
    const isFirstCardInSection = cardIndexInSection === 0;
    const isLastCardInSection = cardIndexInSection === totalCardsInSection - 1;
    const isFirstSection = sectionIndex === 0;
    const isLastSection = sectionIndex === sections.length - 1;
    const alignment = sectionIndex % 2 === 0 ? Alignment.RIGHT : Alignment.LEFT;

    return {
      borderTopLeftRadius: isFirstSection
        ? 0
        : isFirstCardInSection
        ? alignment === Alignment.RIGHT
          ? 32
          : 0
        : 0,
      borderTopRightRadius: isFirstSection
        ? 0
        : isFirstCardInSection
        ? alignment === Alignment.RIGHT
          ? 0
          : 32
        : 0,
      borderBottomLeftRadius: isLastSection
        ? 0
        : isLastCardInSection
        ? alignment === Alignment.RIGHT
          ? 32
          : 0
        : 0,
      borderBottomRightRadius: isLastSection
        ? 0
        : isLastCardInSection
        ? alignment === Alignment.RIGHT
          ? 0
          : 32
        : 0,
      overflow: "hidden",
    };
  };

  const renderItem = ({ item }: { item: FlatCard }) => {
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

    const alignment =
      item.sectionIndex % 2 === 0 ? Alignment.RIGHT : Alignment.LEFT;

    return (
      <View style={styles.wrapper}>
        {/* Top half background */}
        <View style={styles.topHalf} />
        {/* Bottom half background */}
        <View
          style={[
            styles.bottomHalf,
            {
              backgroundColor:
                alignment === Alignment.RIGHT ? "#2196F3" : "#FFFFFF",
            },
          ]}
        />
        {/* Card on top */}
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
  };

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
