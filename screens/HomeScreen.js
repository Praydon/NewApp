import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image, Animated } from 'react-native';
import { fetchArticles } from '../services/newsApi';
import { AntDesign } from '@expo/vector-icons';

const categories = [
  { label: 'Все', value: '' },
  { label: 'Бизнес', value: 'business' },
  { label: 'Развлечения', value: 'entertainment' },
  { label: 'Здоровье', value: 'health' },
  { label: 'Наука', value: 'science' },
  { label: 'Спорт', value: 'sports' },
  { label: 'Технологии', value: 'technology' },
];

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [likedArticles, setLikedArticles] = useState({});
  const scaleAnim = useRef(new Animated.Value(1)).current; // для анимации

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    const fetchedArticles = await fetchArticles(selectedCategory);
    setArticles(fetchedArticles);
    setLoading(false);
  };

  const toggleLike = (article) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setLikedArticles((prev) => {
      const updated = { ...prev };
      if (updated[article.url]) {
        delete updated[article.url];
      } else {
        updated[article.url] = article;
      }
      return updated;
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Article', { articleUrl: item.url })}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleLike(item)}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <AntDesign
                name={likedArticles[item.url] ? 'heart' : 'hearto'}
                size={24}
                color={likedArticles[item.url] ? 'red' : 'gray'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryButton,
              selectedCategory === cat.value && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(cat.value)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.value && styles.categoryTextSelected,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />

      {/* Кнопка "Избранное" */}
      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() =>
          navigation.navigate('Favorites', {
            likedArticles: Object.values(likedArticles),
          })
        }
      >
        <AntDesign name="heart" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScroll: {
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    height: 200,
    width: '100%',
  },
  textContainer: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  favoritesButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});