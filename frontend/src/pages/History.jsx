import { useState, useContext, useEffect } from 'react';
import { MoodContext } from '../context/MoodContext';

const emojiMap = {
  'Happy': '😊',
  'Neutral': '😐',
  'Sad': '😞',
  'Angry': '😡',
  'Tired': '😴'
};

function History() {
  const { moods, fetchMoods } = useContext(MoodContext);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchMoods();
  }, []);

  const filteredMoods = filter === 'All' ? moods : moods.filter(m => m.mood === filter);

  return (
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
        <h2>Mood History</h2>
        <select className="input" style={{width: 150}} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Moods</option>
          <option value="Happy">Happy</option>
          <option value="Neutral">Neutral</option>
          <option value="Sad">Sad</option>
          <option value="Angry">Angry</option>
          <option value="Tired">Tired</option>
        </select>
      </div>

      <div>
        {filteredMoods.length === 0 ? (
          <p>No moods logged yet.</p>
        ) : (
          filteredMoods.map(m => (
            <div key={m._id} className="history-item">
              <div className="history-emoji">{emojiMap[m.mood]}</div>
              <div className="history-content">
                <h4 style={{margin: '0 0 5px 0'}}>{m.mood}</h4>
                <p style={{margin: 0, opacity: 0.8, fontSize: '0.9rem'}}>{m.note || 'No note added.'}</p>
                <small style={{opacity: 0.5}}>{new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString()}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
