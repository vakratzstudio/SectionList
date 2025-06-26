import React from "react";
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { renderCard } from "../mockData";
import { FlatCard } from "../types";

type Props = {
  item: FlatCard;
  onLayout: (event: LayoutChangeEvent, item: FlatCard) => void;
  getGradientColorsForCard: (
    cardIndex: number,
    sectionIndex: number,
    totalCards: number
  ) => [string, string];
  getBorderRadius: (
    cardIndex: number,
    totalCards: number,
    sectionIndex: number,
    sectionsCount: number
  ) => ViewStyle;
  sectionsCount: number;
};

const MemoizedCard = React.memo(function MemoizedCard({
  item,
  onLayout,
  getGradientColorsForCard,
  getBorderRadius,
  sectionsCount,
}: Props) {
  const { sectionIndex, cardIndex, totalCards, sectionId } = item;

  const colors = getGradientColorsForCard(cardIndex, sectionIndex, totalCards);
  const borderRadius = getBorderRadius(
    cardIndex,
    totalCards,
    sectionIndex,
    sectionsCount
  );

  const isRightAligned = sectionIndex % 2 === 0;
  const backgroundColor = isRightAligned ? "#2196F3" : "#FFFFFF";

  const cardPadding = {
    paddingTop: cardIndex === 0 ? 50 : 10,
    paddingBottom: cardIndex === totalCards - 1 ? 50 : 10,
  };

  return (
    <View style={styles.wrapper} onLayout={(e) => onLayout(e, item)}>
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
});

export default MemoizedCard;

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
    marginVertical: -0.5,
  },
});
