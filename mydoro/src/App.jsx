import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'

  useEffect(() => {
    if (!timerActive || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(25 * 60); // Reset to 25 minutes for Pomodoro
    setMode('pomodoro');
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div>
        Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
      </div>
      <button onClick={toggleTimer}>{timerActive ? 'Pause' : 'Start'}</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default App;
