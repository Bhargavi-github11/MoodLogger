import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const API_URL = 'https://moodlogger-1.onrender.com';

export const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [moods, setMoods] = useState([]);
  const [weeklyMoods, setWeeklyMoods] = useState([]);
  const [insights, setInsights] = useState(null);
  const [score, setScore] = useState(0);
  const { token } = useContext(AuthContext);

  const getHeaders = useCallback(() => ({ headers: { 'x-auth-token': token } }), [token]);

  const fetchMoods = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/moods`, getHeaders());
      setMoods(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token, getHeaders]);

  const fetchWeeklyMoods = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/api/moods/week`, getHeaders());
      setWeeklyMoods(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token, getHeaders]);

  const fetchInsightsAndScore = useCallback(async () => {
    if (!token) return;
    try {
      const [insRes, scoreRes] = await Promise.all([
        axios.get(`${API_URL}/api/moods/insights`, getHeaders()),
        axios.get(`${API_URL}/api/moods/score`, getHeaders())
      ]);
      setInsights(insRes.data);
      setScore(scoreRes.data.weeklyScore);
    } catch (err) {
      console.error(err);
    }
  }, [token, getHeaders]);

  const addOrUpdateMood = async (mood, note, tags) => {
    try {
      await axios.post(`${API_URL}/api/moods`, { mood, note, tags }, getHeaders());
      await fetchMoods();
      await fetchWeeklyMoods();
      await fetchInsightsAndScore();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/moods/${id}`, getHeaders());
      await fetchMoods();
      await fetchWeeklyMoods();
      await fetchInsightsAndScore();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MoodContext.Provider value={{ 
      moods, weeklyMoods, insights, score, 
      fetchMoods, fetchWeeklyMoods, fetchInsightsAndScore, 
      addOrUpdateMood, deleteMood 
    }}>
      {children}
    </MoodContext.Provider>
  );
};
