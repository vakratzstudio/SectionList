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
        <View style={[styles.half, { backgroundColor: "#BBDEFB" }]} />
        <View
          style={[
            styles.half,
            {
              backgroundColor:
                alignment === Alignment.RIGHT ? "#2196F3" : "#FFFFFF",
            },
          ]}
        />
      </View>

      {/* Card Content */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={
            alignment === Alignment.RIGHT
              ? ["#FFFFFF", "#BBDEFB"] // White to light blue for right alignment
              : ["#2196F3", "#BBDEFB"] // Dark blue to light blue for left alignment
          }
          style={[
            { width: "100%", padding: 16 },
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
  },
  firstInList: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  lastInList: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  right: { borderBottomLeftRadius: 34, borderTopLeftRadius: 34 },
  left: { borderBottomRightRadius: 34, borderTopRightRadius: 34 },
});

// Wrap the component in React.memo for performance optimization
export const Section = React.memo(SectionComponent);
