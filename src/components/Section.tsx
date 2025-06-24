import React, { ReactNode } from "react";
import { View, StyleSheet, StyleProp, ViewStyle, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// alignment === "LEFT"
// ? ["#2196F3", "#64B5F6"] // Blue to light blue for LEFT
// : ["#BBDEFB", "#FFFFFF"]

{
  /* <LinearGradient
        colors={
          alignment === "RIGHT"
            ? ["#FFFFFF", "#BBDEFB"] // Blue to light blue for LEFT
            : ["#2196F3", "#BBDEFB"] // Light blue to white for RIGHT
        }
        style={[
          { zIndex: 10, padding: 16 },
          { width: "100%" },
          alignment === "LEFT" ? styles.left : styles.right,
          isFirstInList ? styles.firstInList : {},
          isLastInList ? styles.lastInList : {},
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {children}
      </LinearGradient> */
}

type Alignment = "LEFT" | "RIGHT";

interface SectionProps {
  children: ReactNode;
  isFirstInList?: boolean;
  isLastInList?: boolean;
  alignment?: Alignment;
  style?: StyleProp<ViewStyle>;
}

export const Section: React.FC<SectionProps> = ({
  children,
  isFirstInList = false,
  isLastInList = false,
  alignment = "LEFT",
}) => {
  return (
    <View style={styles.container}>
      {/* Split Background */}
      <View style={styles.background}>
        <View style={[styles.half, { backgroundColor: "#BBDEFB" }]} />
        <View
          style={[
            styles.half,
            { backgroundColor: alignment === "RIGHT" ? "#2196F3" : "#FFFFFF" },
          ]}
        />
      </View>

      {/* Card Content */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={
            alignment === "RIGHT"
              ? ["#FFFFFF", "#BBDEFB"] // Blue to light blue for LEFT
              : ["#2196F3", "#BBDEFB"] // Light blue to white for RIGHT
          }
          style={[
            { width: "100%", padding: 16 },
            alignment === "LEFT" ? styles.left : styles.right,
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
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
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
