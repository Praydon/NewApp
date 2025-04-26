import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ArticleScreen({ route }) {
  const { articleUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: articleUrl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});