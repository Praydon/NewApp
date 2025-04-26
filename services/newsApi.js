import axios from 'axios';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig.extra.apiKey;

export const fetchArticles = async (category = '') => {
  try {
    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    if (category) {
      url += `&category=${category}`;
    }
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    console.error('Ошибка при загрузке новостей:', error.message);
    return [];
  }
};