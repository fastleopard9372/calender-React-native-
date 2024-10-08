import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, MD3Colors } from 'react-native-paper';

function Message({ message }: { message: string }) {
  return <View style={styles.container}>
    <Text>{message}</Text>
  </View>

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4444",
    justifyContent: 'space-between',
  },
});

export default Message;