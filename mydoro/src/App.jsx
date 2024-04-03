import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';

const App = () => {
  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : null;
  };

  const loadThemeSetting = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light'; // default to 'light' theme
  };

  const defaultTimes = { pomodoro: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  const savedSettings = loadSavedSettings();
  
  const [timeLeft, setTimeLeft] = useState(savedSettings?.pomodoro ?? defaultTimes.pomodoro);
  const [timerActive, setTimerActive] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [customTimes, setCustomTimes] = useState(savedSettings ?? defaultTimes);
  const [theme, setTheme] = useState(loadThemeSetting());

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const playSound = () => {
    const audio = new Audio('./alarm.mp3');
    audio.play();
  };

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound();
      alert("Time's up!");
      setTimerActive(false);
      setTimeLeft(customTimes[mode]);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, mode, customTimes]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(customTimes));
    localStorage.setItem('theme', theme); // Persist theme setting
  }, [customTimes, theme]);

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(customTimes[mode]);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setTimerActive(false);
    setTimeLeft(customTimes[newMode]);
  };

  const handleTimeChange = (mode, minutes) => {
    setCustomTimes((prevTimes) => ({
      ...prevTimes,
      [mode]: parseInt(minutes, 10) * 60,
    }));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const percentage = (timeLeft / customTimes[mode]) * 100;

  return (
    <div className={`App ${theme}`}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <h1>Pomodoro Timer</h1>
      <CircularProgressbar value={percentage} text={`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}`} />
      <div className="buttons">
        <button onClick={toggleTimer}>{timerActive ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div className="mode-selector">
        <button onClick={() => changeMode('pomodoro')}>Pomodoro</button>
        <button onClick={() => changeMode('shortBreak')}>Short Break</button>
        <button onClick={() => changeMode('longBreak')}>Long Break</button>
      </div>
      <div className="settings">
        <div>
          Pomodoro (mins): <input type="number" value={customTimes.pomodoro / 60} onChange={(e) => handleTimeChange('pomodoro', e.target.value)} />
        </div>
        <div>
          Short Break (mins): <input type="number" value={customTimes.shortBreak / 60} onChange={(e) => handleTimeChange('shortBreak', e.target.value)} />
        </div>
        <div>
          Long Break (mins): <input type="number" value={customTimes.longBreak / 60} onChange={(e) => handleTimeChange('longBreak', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default App;
