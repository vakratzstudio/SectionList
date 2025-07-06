import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// Generate a random height between 100 and 300 each render
const getRandomHeight = () => 100; // Math.floor(Math.random() * 201) + 100;

export const ShimmerCard: React.FC = () => {
  const height = React.useMemo(() => getRandomHeight(), []);
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 30,
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 100,
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
    borderRadius: 30,
  },
});

export default ShimmerCard;
