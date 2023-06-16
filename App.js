import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { rtdb } from './src/firebase_auth';

export default function App() {

  const [count, setCount] = useState(0);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    rtdb.ref("count").on("value", (snapshot) => {
      setCount(snapshot.val());
    })
  }, [])
  
  useEffect(() => {
    rtdb.ref("count").set(count);
  }, [count])

  useEffect(() => {
    if (offline) {
      rtdb.goOffline();
    } else {
      rtdb.goOnline();
    }
  }, [offline])
  
  return (
    <View style={styles.container}>
      <View style={{flexDirection: "row"}}>
        <Button title="+" onPress={() => setCount(count + 1)} />
        <Text style={{marginLeft: 25, marginRight: 25, color: "white", fontSize: 30}}>{count}</Text>
        <Button title="-" onPress={() => setCount(count - 1)} />
      </View>
      <Button title={offline ? "go online (offline rn)" : "go offline (online rn)"} onPress={() => setOffline(!offline)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
