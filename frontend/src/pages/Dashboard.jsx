import { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoodContext } from '../context/MoodContext';
import { AuthContext } from '../context/AuthContext';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Modal = ({ message, onClose, type = 'error' }) => {
  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)'
    }}>
      <div className="card" style={{ maxWidth: 400, width: '90%', textAlign: 'center', animation: 'slideUp 0.3s ease', transform: 'none', border: `2px solid ${type === 'error' ? 'var(--angry)' : 'var(--primary)'}` }}>
        <div style={{ fontSize: '4rem', marginBottom: 15, animation: 'pulse-slow 2s infinite' }}>
          {type === 'error' ? '🛑' : '🎉'}
        </div>
        <h2 style={{ marginBottom: 10 }}>{type === 'error' ? 'Hold on!' : 'Awesome!'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 25, fontSize: '1.05rem', lineHeight: 1.5 }}>{message}</p>
        <button className="btn" onClick={onClose} style={{ width: '100%', background: type === 'error' ? 'var(--angry)' : '' }}>
          {type === 'error' ? 'Understood' : 'Keep it up!'}
        </button>
      </div>
    </div>,
    document.body
  );
};

const moodsData = [
  { type: 'Happy', emoji: '😊', score: '+2' },
  { type: 'Neutral', emoji: '😐', score: '0' },
  { type: 'Sad', emoji: '😞', score: '-1' },
  { type: 'Angry', emoji: '😡', score: '-2' },
  { type: 'Tired', emoji: '😴', score: '-1' }
];

const availableTags = ['Work', 'Health', 'Sleep', 'Friends', 'Family'];

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { moods, score, fetchMoods, fetchInsightsAndScore, addOrUpdateMood } = useContext(MoodContext);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Custom Modal Portal State
  const [modalMeta, setModalMeta] = useState({ isOpen: false, message: '', type: 'error' });

  useEffect(() => {
    fetchMoods();
    fetchInsightsAndScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      setModalMeta({ isOpen: true, message: 'Please select a mood emoji first!', type: 'error' });
      return;
    }
    setSubmitting(true);
    try {
      await addOrUpdateMood(selectedMood, note, selectedTags);
      setModalMeta({ isOpen: true, message: 'Your mood has been logged securely. Dashboard updated!', type: 'success' });
    } catch (err) {
      setModalMeta({ isOpen: true, message: err.response?.data?.msg || 'You have already logged your mood for today! Come back tomorrow.', type: 'error' });
    }
    setSubmitting(false);
    setSelectedMood('');
    setSelectedTags([]);
    setNote('');
  };

  // Calculate Streak
  let currentStreak = 0;
  let longestStreak = 0;
  
  if (moods.length > 0) {
    let dates = moods.map(m => new Date(m.date).setHours(0,0,0,0));
    dates = [...new Set(dates)].sort((a,b) => b - a);
    
    let tempStreak = 1;
    let maxStreak = 1;
    let today = new Date().setHours(0,0,0,0);
    
    let diff = (today - dates[0]) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
       for (let i = 0; i < dates.length - 1; i++) {
         let dayDiff = (dates[i] - dates[i+1]) / (1000*60*60*24);
         if (dayDiff === 1) tempStreak++;
         else break;
       }
       currentStreak = tempStreak;
    } else {
       currentStreak = 0;
    }

    let l_tempStreak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      let dayDiff = (dates[i] - dates[i+1]) / (1000*60*60*24);
      if (dayDiff === 1) {
        l_tempStreak++;
        if (l_tempStreak > maxStreak) maxStreak = l_tempStreak;
      } else {
        l_tempStreak = 1;
      }
    }
    if (longestStreak === 0 && moods.length > 0) longestStreak = 1;
    if (maxStreak > longestStreak) longestStreak = maxStreak;
  }

  const displayScore = score > 0 ? `+${score}` : `${score}`;

  const heatmapValues = moods.map(m => ({
    date: new Date(m.date).toISOString().split('T')[0],
    mood: m.mood
  }));
  
  const today = new Date();
  
  // Start the calendar explicitly from April 1st of the current year
  const heatmapStart = new Date(today.getFullYear(), 3, 1);
  heatmapStart.setDate(heatmapStart.getDate() - 1); // Render precisely starting April
  
  // End on December 31st to show a fixed 9-month scale
  const heatmapEnd = new Date(today.getFullYear(), 11, 31);

  return (
    <div>
      {/* React Portal Custom Modal */}
      {modalMeta.isOpen && <Modal message={modalMeta.message} type={modalMeta.type} onClose={() => setModalMeta({ ...modalMeta, isOpen: false })} />}

      <h1 style={{marginBottom: 20}}>Welcome, {user?.name || 'Friend'} 👋</h1>
      <div style={{display: 'flex', gap: 20, flexWrap: 'wrap'}}>
        <div className="card" style={{flex: 1, textAlign: 'center', minWidth: 200}}>
          <h3>🔥 Current Streak</h3>
          <h1 style={{color: 'var(--primary)', margin: '10px 0'}}>{currentStreak} Days</h1>
          <p style={{opacity: 0.7, fontSize: '0.9rem'}}>Longest: {longestStreak}</p>
        </div>
        <div className="card" style={{flex: 1, textAlign: 'center', minWidth: 200}}>
          <h3>🏆 Weekly Score</h3>
          <h1 style={{color: score >= 0 ? 'var(--primary)' : 'var(--angry)', margin: '10px 0'}}>
            {displayScore}
          </h1>
          <p style={{opacity: 0.7, fontSize: '0.9rem'}}>Points over last 7 days</p>
        </div>
      </div>

      <div className="card">
        <h2>How are you feeling today?</h2>
        <div className="mood-grid">
          {moodsData.map((m) => (
            <div key={m.type} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <button 
                type="button"
                className={`mood-btn ${selectedMood === m.type ? 'selected' : ''}`}
                onClick={() => setSelectedMood(m.type)}
                title={m.type}
              >
                {m.emoji}
              </button>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '12px', color: 'var(--text-color)' }}>
                {m.type}
              </span>
              <span style={{fontSize: '0.85rem', opacity: 0.7, marginTop: '4px', fontWeight: 700, color: m.score.includes('+') ? 'var(--happy)' : m.score.includes('-') ? 'var(--angry)' : 'inherit'}}>
                {m.score} pts
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          
          <div style={{marginBottom: 20}}>
            <h4 style={{marginBottom: 10}}>What's affecting your mood? (Triggers)</h4>
            <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
              {availableTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <input 
            className="input" 
            placeholder="Add an optional note..." 
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button className="btn" type="submit" disabled={submitting} style={{marginTop: 15}}>
            {submitting ? 'Saving...' : 'Log Mood'}
          </button>
        </form>
      </div>

      <div className="card">
         <h3 style={{marginBottom: 20}}>📅 Monthly Mood Map</h3>
         {/* Removed overflow constraints: calendar natively scales, banishing the scrollbar */}
         <div style={{width: '100%', padding: '0 5px'}}>
            <CalendarHeatmap
              startDate={heatmapStart}
              endDate={heatmapEnd}
              values={heatmapValues}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                return `color-${value.mood.toLowerCase()}`;
              }}
              showMonthLabels={true}
              showWeekdayLabels={true}
              tooltipDataAttrs={value => {
                if (!value || !value.date) return { 'data-tooltip': 'No mood recorded' };
                return { 'data-tooltip': `${value.date}: ${value.mood}` };
              }}
            />
         </div>
      </div>
    </div>
  );
}

export default Dashboard;
