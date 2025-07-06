import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Alignment } from "../types";

interface SectionProps {
  children: ReactNode;
  isFirstInList?: boolean;
  isLastInList?: boolean;
  alignment?: Alignment;
  style?: StyleProp<ViewStyle>;
}

const SectionComponent: React.FC<SectionProps> = ({
  children,
  isFirstInList = false,
  isLastInList = false,
  alignment = Alignment.LEFT,
}) => {
  return (
    <View style={styles.container}>
      {/* Split Background */}
      <View style={styles.background}>
        <View style={[styles.half, { backgroundColor: "#009FDB" }]} />
        <View
          style={[
            styles.half,
            {
              backgroundColor:
                alignment === Alignment.RIGHT ? "#00338F" : "#FFFFFF",
            },
          ]}
        />
      </View>

      {/* Card Content */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={
            alignment === Alignment.RIGHT
              ? ["#FFFFFF", "#009FDB"] // White to light blue for right alignment
              : ["#00338F", "#009FDB"] // Dark blue to light blue for left alignment
          }
          style={[
            { width: "100%", paddingHorizontal: 24, paddingVertical: 50 },
            alignment === Alignment.LEFT ? styles.left : styles.right,
            isFirstInList ? styles.firstInList : {},
            isLastInList ? styles.lastInList : {},
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {children}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    zIndex: 0,
  },
  half: {
    flex: 1,
  },
  cardWrapper: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  firstInList: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  lastInList: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  right: { borderBottomLeftRadius: 50, borderTopLeftRadius: 50 },
  left: { borderBottomRightRadius: 50, borderTopRightRadius: 50 },
});

// Wrap the component in React.memo for performance optimization
export const Section = React.memo(SectionComponent);
