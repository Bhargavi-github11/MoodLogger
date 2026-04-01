import { useContext, useEffect } from 'react';
import { MoodContext } from '../context/MoodContext';
import { Bar } from 'react-chartjs-2';

const colorMap = {
  'Happy': '#4ade80',
  'Neutral': '#d1d5db',
  'Sad': '#93c5fd',
  'Angry': '#fca5a5',
  'Tired': '#facc15'
};

function Analytics() {
  const { weeklyMoods, fetchWeeklyMoods, insights, fetchInsightsAndScore } = useContext(MoodContext);

  useEffect(() => {
    fetchWeeklyMoods();
    fetchInsightsAndScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = { Happy: 0, Neutral: 0, Sad: 0, Angry: 0, Tired: 0 };
  weeklyMoods.forEach(m => {
    if (counts[m.mood] !== undefined) counts[m.mood]++;
  });

  const data = {
    labels: ['Happy', 'Neutral', 'Sad', 'Angry', 'Tired'],
    datasets: [{
      label: 'Mood Count (Last 7 Days)',
      data: [counts.Happy, counts.Neutral, counts.Sad, counts.Angry, counts.Tired],
      backgroundColor: [colorMap.Happy, colorMap.Neutral, colorMap.Sad, colorMap.Angry, colorMap.Tired],
      borderWidth: 1,
    }],
  };

  const options = { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } };

  return (
    <div>
      <div className="card" style={{marginBottom: 20}}>
        <h2>Data Insights</h2>
        <p>Your emotional patterns analyzed by the system.</p>
        
        {insights ? (
          <div style={{marginTop: 20, padding: 20, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 12, border: '1px solid var(--primary)'}}>
            <h3 style={{color: 'var(--primary)', marginBottom: 10}}>🧠 AI Pattern Detection</h3>
            <p style={{fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5}}>
              {insights.insight}
            </p>
          </div>
        ) : <p>Loading insights...</p>}
      </div>

      <div className="card">
        <h3>Weekly Activity</h3>
        <div style={{marginTop: 30}}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
