// import { useEffect, useRef } from 'react'
// import { Animated, StyleSheet, Dimensions, View } from 'react-native'

// const { width, height } = Dimensions.get('window')

// function Wave({ amplitude, frequency, speed, yOffset, opacity, color }: {
//   amplitude: number
//   frequency: number
//   speed: number
//   yOffset: number
//   opacity: number
//   color: string
// }) {
//   const animValue = useRef(new Animated.Value(0)).current

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(animValue, {
//         toValue: 1,
//         duration: speed,
//         useNativeDriver: true,
//       })
//     ).start()
//   }, [])

//   const points = Array.from({ length: 80 }, (_, i) => i)

//   return (
//     <Animated.View
//       style={[
//         styles.waveContainer,
//         {
//           top: yOffset,
//           opacity,
//           transform: [{
//             translateX: animValue.interpolate({
//               inputRange: [0, 1],
//               outputRange: [-width, 0],
//             })
//           }]
//         }
//       ]}
//     >
//       <View style={styles.wavePath}>
//         {points.map((i) => (
//           <View
//             key={i}
//             style={{
//               position: 'absolute',
//               left: i * (width * 2 / 80),
//               top: amplitude * Math.sin((i / 80) * Math.PI * frequency * 2),
//               width: width * 2 / 80 + 1,
//               height: height,
//               backgroundColor: color,
//               opacity: 0.15,
//             }}
//           />
//         ))}
//       </View>
//     </Animated.View>
//   )
// }

// export default function Screensaver() {
//   const waves = [
//     { amplitude: 40, frequency: 2, speed: 8000, yOffset: height * 0.1, opacity: 0.6, color: '#FFFFFF' },
//     { amplitude: 60, frequency: 1.5, speed: 12000, yOffset: height * 0.25, opacity: 0.4, color: '#FFFFFF' },
//     { amplitude: 30, frequency: 3, speed: 6000, yOffset: height * 0.4, opacity: 0.5, color: '#AAAAAA' },
//     { amplitude: 80, frequency: 1, speed: 15000, yOffset: height * 0.55, opacity: 0.3, color: '#FFFFFF' },
//     { amplitude: 50, frequency: 2.5, speed: 9000, yOffset: height * 0.7, opacity: 0.4, color: '#888888' },
//     { amplitude: 35, frequency: 2, speed: 11000, yOffset: height * 0.85, opacity: 0.5, color: '#FFFFFF' },
//   ]

//   return (
//     <View style={styles.container}>
//       {waves.map((wave, index) => (
//         <Wave key={index} {...wave} />
//       ))}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#0A0A0A',
//     overflow: 'hidden',
//   },
//   waveContainer: {
//     position: 'absolute',
//     left: 0,
//     width: width * 2,
//   },
//   wavePath: {
//     position: 'relative',
//     width: width * 2,
//     height: 200,
//   },
// })