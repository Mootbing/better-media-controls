import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ios, web } from './ids';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: web,
    iosClientId: ios,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken])

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    let userInfo = await response.json();
    setUser(userInfo);
  }

  const ShowUserInfo = () => {
    if (user) {
      return <View>
        <Text style={{ color: '#fff' }}>Welcome {user.name}</Text>
        <Image source={{ uri: user.picture }} style={{ width: 100, height: 100 }} />
      </View>
    }
    return null;
  }
  
  return <View style={{display: "flex", width: "100%", height: "100%", justifyContent: "center"}}>
    {user && <ShowUserInfo />}
    {!user && <TouchableOpacity onPress={() => promptAsync()} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 5 }}><Text>Log In</Text></TouchableOpacity>}
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
