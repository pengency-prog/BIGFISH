import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { A1_CONTENT, CONVERSATIONS, SONGS } from './data/A1Content';

const App = () => {
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedModules, setCompletedModules] = useState([]); // Transient state
  
  // Speaking Practice State
  const [activeConversation, setActiveConversation] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null); // 'success' | 'error' | null
  
  // Gamification State
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  
  const userLevel = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const levelNames = ["Apprenti", "Voyageur", "Explorateur", "Expert", "Maître", "Légende"];
  const currentLevelName = levelNames[Math.min(userLevel - 1, levelNames.length - 1)];

  const addXP = (amount) => {
    setTotalXP(prev => prev + amount);
  };

  const unlockBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges(prev => [...prev, badgeId]);
      // You could add a "Badge Unlocked!" notification here if desired
    }
  };

  const recognitionRef = useRef(null);

  // Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [quizFinished, setQuizFinished] = useState(false);

  // Musical Learning State
  const [activeSong, setActiveSong] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const singSong = async (song) => {
    setActiveSong(song);
    setIsPlaying(true);
    setCurrentLineIndex(0);

    for (let i = 0; i < song.lines.length; i++) {
      setCurrentLineIndex(i);
      await new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(song.lines[i].fr);
        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(v => v.lang.startsWith('fr')) || voices.find(v => v.lang.includes('FR'));
        if (frVoice) utterance.voice = frVoice;
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8; 
        
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        
        window.speechSynthesis.speak(utterance);
      });
      // Small pause between lines
      await new Promise(r => setTimeout(r, 600));
    }

    setIsPlaying(false);
    setCurrentLineIndex(-1);
  };

  const stopSong = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentLineIndex(-1);
  };

  const generateQuiz = () => {
    const activeModule = A1_CONTENT.find(m => m.id === currentModuleId);
    const moduleVocab = activeModule.lessons.flatMap(l => l.vocabulary || []);
    const activeLesson = activeModule.lessons[currentLessonIndex];
    const lessonVocab = activeLesson.vocabulary || [];
    
    let questionPool = [...lessonVocab];
    const otherModuleVocab = moduleVocab.filter(v => !lessonVocab.find(lv => lv.french === v.french));
    
    // Shuffle other vocab to pick unique additions
    const shuffledOthers = [...otherModuleVocab].sort(() => 0.5 - Math.random());
    
    while (questionPool.length < 20 && shuffledOthers.length > 0) {
      questionPool.push(shuffledOthers.pop());
    }
    
    const finalPool = questionPool.slice(0, 20).sort(() => 0.5 - Math.random());
    
    const questions = finalPool.map((item) => {
      const type = Math.random() > 0.5 ? 'fr-en' : 'en-fr';
      const questionText = type === 'fr-en' ? item.french : item.english;
      const answer = type === 'fr-en' ? item.english : item.french;
      
      let distractors = moduleVocab
        .filter(v => v.french !== item.french && v.english !== item.english)
        .map(v => type === 'fr-en' ? v.english : v.french);
      
      // Ensure unique distractors
      distractors = [...new Set(distractors)].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      const options = [answer, ...distractors].sort(() => 0.5 - Math.random());
      
      return { question: questionText, options, answer, type };
    });
    
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizFeedback(null);
    setIsQuizActive(true);
    setQuizFinished(false);
  };

  const handleQuizAnswer = (selectedOption) => {
    if (quizFeedback) return;

    const isCorrect = selectedOption === quizQuestions[currentQuizIndex].answer;
    
    // Pronounce the word if it's French (en-fr type)
    if (quizQuestions[currentQuizIndex].type === 'en-fr') {
      handleSpeak(selectedOption);
    }

    if (isCorrect) {
      setQuizScore(quizScore + 1);
      setQuizFeedback('correct');
      addXP(10); // Reward for correct answer
    } else {
      setQuizFeedback('wrong');
    }

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setQuizFeedback(null);
      } else {
        setQuizFinished(true);
        // Check for perfect score bonus
        if (quizScore + (isCorrect ? 1 : 0) === 20) {
          addXP(100);
          unlockBadge('quiz_master');
        }
      }
    }, 1200);
  };

  useEffect(() => {
    const initSpeech = () => {
      if (window.webkitSpeechRecognition || window.SpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'fr-FR';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
          const result = event.results[0][0].transcript;
          setTranscript(result);
          validateSpeech(result);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            alert("Microphone access denied. Please enable microphone permissions in your browser.");
          }
        };
      }
    };

    // Pre-load voices for SpeechSynthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    initSpeech();
  }, [activeConversation, currentStepIndex]);

  const validateSpeech = (speech) => {
    if (!activeConversation) return;
    const currentStep = activeConversation.steps[currentStepIndex];
    const normalizedSpeech = speech.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const normalizedExpected = currentStep.expectedKeyword.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");

    if (normalizedSpeech.includes(normalizedExpected)) {
      setFeedback('success');
    } else {
      setFeedback('error');
    }
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        setFeedback(null);
        setIsRecording(true);
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start recording:", err);
        setIsRecording(false);
      }
    } else {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
    }
  };

  const currentModule = A1_CONTENT.find(m => m.id === currentModuleId);
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const handleModuleSelect = (id) => {
    setCurrentModuleId(id);
    setCurrentLessonIndex(null); // Show lesson list first
    setIsFlipped(false);
    setActiveConversation(null);
  };

  const handleLessonSelect = (index) => {
    setCurrentLessonIndex(index);
    setIsFlipped(false);
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr')) || voices.find(v => v.lang.includes('FR'));
    
    if (frVoice) {
      utterance.voice = frVoice;
    }
    
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85; // Slightly slower for clearer learning
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeConversation.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTranscript('');
      setFeedback(null);
    } else {
      setActiveConversation(null);
      setCurrentStepIndex(0);
    }
  };

  const handleNextLesson = () => {
    addXP(50); // XP for completing lesson cards
    unlockBadge('first_lesson');
    
    // Trigger quiz every 10 lessons (at L10, L20, L30)
    // currentLessonIndex is 0-based, so L10 is index 9, L20 is index 19, L30 is index 29.
    const isQuizPoint = (currentLessonIndex + 1) % 10 === 0 && (currentLessonIndex + 1) > 0;

    if (isQuizPoint) {
      generateQuiz();
    } else if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setIsFlipped(false);
    }
  };

  const [isLessonFinished, setIsLessonFinished] = useState(false);

  const handleNextModule = () => {
    const nextId = currentModuleId + 1;
    const nextModule = A1_CONTENT.find(m => m.id === nextId);
    if (nextModule) {
      setCurrentModuleId(nextId);
      setCurrentLessonIndex(null);
      setIsLessonFinished(false);
      setIsFlipped(false);
    } else {
      setCurrentModuleId(null);
      setIsLessonFinished(false);
    }
  };

  return (
    <div className="app-container">
      <nav>
        <div className="logo" onClick={() => { setCurrentModuleId(null); setActiveConversation(null); }} style={{ cursor: 'pointer' }}>
          <span>AF</span> PRINCE
        </div>
        
        <div className="xp-status" style={{ flex: 1, margin: '0 2rem', maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
            <span style={{ fontWeight: 800 }}>Level {userLevel}: {currentLevelName}</span>
            <span>{xpInLevel} / 500 XP</span>
          </div>
          <div className="xp-bar" style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div className="xp-fill" style={{ width: `${(xpInLevel / 500) * 100}%`, height: '100%', background: 'var(--secondary)', transition: 'width 0.5s ease' }}></div>
          </div>
        </div>

        <div className="nav-links">
          <button className="btn btn-outline" onClick={() => { setCurrentModuleId(null); setActiveConversation(null); setActiveSong(null); stopSong(); }}>Home</button>
        </div>
      </nav>

      <main className="container">
        {!currentModuleId && !activeConversation && !activeSong ? (
          <div className="home-screen">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Bienvenue à <span style={{ color: 'var(--primary)' }}>AF PRINCE</span></h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Master French through interaction, practice, and play.</p>
              
              {unlockedBadges.length > 0 && (
                <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {unlockedBadges.map(badgeId => (
                    <div key={badgeId} className="badge-item" style={{ 
                      background: 'white', 
                      padding: '0.6rem 1.2rem', 
                      borderRadius: '50px', 
                      border: '2px solid' + (badgeId === 'quiz_master' ? ' #ecc94b' : ' var(--secondary)'),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      animation: 'fadeIn 0.5s ease-out'
                    }}>
                      <span>{
                        badgeId === 'first_lesson' ? '🥇 First Step' : 
                        badgeId === 'quiz_master' ? '🏆 Quiz Master' : 
                        badgeId === 'module_maestro' ? '💎 Module Maestro' : 
                        '🌟 Achiever'
                      }</span>
                    </div>
                  ))}
                </div>
              )}
            </header>
            
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ marginBottom: '2rem' }}>Learning Modules</h2>
              <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {A1_CONTENT.map((module) => (
                  <div key={module.id} className="card" onClick={() => handleModuleSelect(module.id)}>
                    <div className="module-header">
                       <div className="module-badge">
                         <span>Module</span>
                         <span>{module.id}</span>
                       </div>
                       <h3>{module.title.replace(/Module \d+:? /, '')}</h3>
                    </div>
                    {completedModules.includes(module.id) && (
                      <div className="completion-badge" style={{ background: '#38a169', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: '800', marginBottom: '1rem', display: 'inline-block' }}>✓ Completed</div>
                    )}
                    <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>{module.description}</p>
                    <div style={{ marginTop: '1.5rem', color: 'var(--secondary)', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {module.lessons.length} Lessons <span style={{ fontSize: '1.2rem' }}>→</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ marginBottom: '2rem' }}>🗣️ One-on-One Speaking Practice</h2>
              <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {CONVERSATIONS.map((conv) => (
                  <div key={conv.id} className="card practice-card" onClick={() => { setActiveConversation(conv); setCurrentStepIndex(0); setFeedback(null); setTranscript(''); }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗣️</div>
                    <h3>{conv.title}</h3>
                    <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Practice speaking in a simulated conversation.</p>
                    <button className="btn btn-primary" style={{ width: '100%' }}>
                      Start Practice →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ marginBottom: '2rem' }}>🎵 Musical Learning (Sing Along)</h2>
              <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {SONGS.map((song) => (
                  <div key={song.id} className="card practice-card" onClick={() => singSong(song)}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎶</div>
                    <h3>{song.title}</h3>
                    <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>{song.description}</p>
                    <button className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)', boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)' }}>
                      Listen & Sing →
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : activeSong ? (
          <div className="song-stage lesson-content" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <button className="btn btn-outline" onClick={() => { stopSong(); setActiveSong(null); }}>← Exit Stage</button>
              <h1 style={{ margin: 0 }}>{activeSong.title}</h1>
              <div style={{ background: isPlaying ? 'var(--secondary)' : '#718096', color: 'white', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800' }}>
                {isPlaying ? '● SINGING' : 'READY'}
              </div>
            </div>

            <div className="lyrics-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {activeSong.lines.map((line, idx) => (
                <div key={idx} className={`lyric-line ${currentLineIndex === idx ? 'active' : ''}`} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '2rem', 
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  background: currentLineIndex === idx ? 'rgba(229, 62, 62, 0.05)' : 'transparent',
                  border: currentLineIndex === idx ? '2px solid var(--secondary)' : '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: currentLineIndex === idx ? 'scale(1.02)' : 'scale(1)',
                  opacity: currentLineIndex === idx ? 1 : 0.6
                }}>
                  <div className="lyric-fr" style={{ fontSize: '1.4rem', fontWeight: '800', color: currentLineIndex === idx ? 'var(--secondary)' : 'var(--primary)' }}>
                    {line.fr}
                  </div>
                  <div className="lyric-en" style={{ fontSize: '1.1rem', opacity: 0.7, fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {line.en}
                  </div>
                </div>
              ))}
            </div>

            <div className="song-controls">
              {!isPlaying && (
                <button className="btn btn-primary" onClick={() => singSong(activeSong)} style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
                  Play Again 🔄
                </button>
              )}
            </div>
          </div>
        ) : activeConversation ? (
          <div className="practice-screen">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <button className="btn btn-outline" onClick={() => setActiveConversation(null)}>← Exit Practice</button>
              <h2>{activeConversation.title}</h2>
              <div className="progress">Step {currentStepIndex + 1} of {activeConversation.steps.length}</div>
            </div>

            <div className="chat-container">
              <div className="tutor-bubble chat-bubble">
                <div className="tutor-label">Tutor</div>
                <div className="tutor-content">
                  <p className="french-text">{activeConversation.steps[currentStepIndex].tutor}</p>
                  <p className="translation-text">{activeConversation.steps[currentStepIndex].translation}</p>
                  <button className="btn-icon" onClick={() => handleSpeak(activeConversation.steps[currentStepIndex].tutor)}>🔊</button>
                </div>
              </div>

              {transcript && (
                <div className={`user-bubble chat-bubble ${feedback}`}>
                  <div className="user-label">You</div>
                  <p>&quot;{transcript}&quot;</p>
                </div>
              )}

              {feedback === 'error' && (
                <div className="hint-container">
                   <p><strong>Try again!</strong> {activeConversation.steps[currentStepIndex].hint}</p>
                </div>
              )}
            </div>

            <div className="controls-area">
              {!feedback || feedback === 'error' ? (
                <button 
                  className={`btn-mic ${isRecording ? 'recording' : ''}`} 
                  onClick={startRecording}
                  disabled={isRecording}
                >
                  {isRecording ? 'Listening...' : '🎤 Press & Speak'}
                </button>
              ) : (
                <div className="success-area">
                  <p className="success-msg">Excellent ! ✨</p>
                  <button className="btn btn-primary" onClick={handleNextStep}>
                    {currentStepIndex < activeConversation.steps.length - 1 ? 'Next Step' : 'Finish Session'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : currentModuleId && currentLessonIndex === null ? (
          <div className="lesson-selection-screen">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <button className="btn btn-outline" onClick={() => setCurrentModuleId(null)}>← Back</button>
              <h1>{currentModule.title.replace(/Module \d+:? /, '')}</h1>
            </div>
            <div className="lesson-list">
              {currentModule.lessons.map((lesson, index) => (
                <div key={lesson.id} className="card lesson-item" onClick={() => handleLessonSelect(index)} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--secondary)', marginRight: '1rem' }}>{index + 1}</span>
                    <span style={{ fontWeight: 600 }}>{lesson.title}</span>
                  </div>
                  <span style={{ opacity: 0.5 }}>Start Lesson →</span>
                </div>
              ))}
            </div>
          </div>
        ) : isLessonFinished ? (
          <div className="lesson-content" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Félicitations ! 🏁</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '3rem' }}>You have completed {currentModule.title}.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
               <button className="btn btn-primary" onClick={() => { setIsLessonFinished(false); setCurrentModuleId(null); }}>Back to Dashboard</button>
            </div>
          </div>
        ) : isQuizActive ? (
          <div className="quiz-screen lesson-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            {!quizFinished ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0 }}>Lesson Quiz ✍️</h2>
                  <div className="progress" style={{ fontSize: '1.2rem', fontWeight: '800' }}>Question {currentQuizIndex + 1} of 20</div>
                </div>
                
                <div className="progress-bar" style={{ height: '10px', marginBottom: '3rem' }}>
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentQuizIndex + 1) / 20) * 100}%`, background: 'var(--secondary)' }}
                  ></div>
                </div>

                <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {quizQuestions[currentQuizIndex]?.type === 'fr-en' ? 'Translate to English' : 'Translate to French'}
                  </p>
                  <h3 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--primary)' }}>{quizQuestions[currentQuizIndex]?.question}</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  {quizQuestions[currentQuizIndex]?.options.map((option, idx) => (
                    <button 
                      key={idx} 
                      className="btn btn-outline"
                      style={{ 
                        padding: '1.2rem', 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        backgroundColor: quizFeedback && option === quizQuestions[currentQuizIndex].answer ? '#f0fff4' : '',
                        borderColor: quizFeedback && option === quizQuestions[currentQuizIndex].answer ? '#38a169' : '',
                        color: quizFeedback && option === quizQuestions[currentQuizIndex].answer ? '#38a169' : ''
                      }}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={!!quizFeedback}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {quizFeedback && (
                  <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    {quizFeedback === 'correct' ? 
                      <p style={{ color: '#38a169', fontWeight: '800', fontSize: '1.5rem' }}>Excellent ! ✨</p> : 
                      <p style={{ color: '#e53e3e', fontWeight: '800', fontSize: '1.5rem' }}>Oops! The correct answer was: {quizQuestions[currentQuizIndex].answer}</p>
                    }
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Quiz Complete! 🎉</h2>
                <p style={{ fontSize: '1.5rem', opacity: 0.7, marginBottom: '3rem' }}>You scored **{quizScore} / 20**</p>
                
                <div className="card" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(255,255,255,0.5)' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Your Level:</h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>
                    {quizScore >= 18 ? 'Parfait ! You are a master! 🏆' : quizScore >= 14 ? 'Très bien ! Great job! 🌟' : 'Good effort! Keep practicing! 💪'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                   <button className="btn btn-outline" onClick={() => { setIsQuizActive(false); }}>Review Lessons</button>
                   
                   {quizScore >= 14 ? (
                     (currentLessonIndex + 1) < currentModule.lessons.length ? (
                       <button className="btn btn-primary" onClick={() => { 
                         setIsQuizActive(false); 
                         setCurrentLessonIndex(currentLessonIndex + 1);
                         setIsFlipped(false);
                       }}>
                         Next Lesson →
                       </button>
                     ) : (
                       <button className="btn btn-primary" onClick={() => { 
                         setIsQuizActive(false); 
                         if (!completedModules.includes(currentModuleId)) {
                           setCompletedModules([...completedModules, currentModuleId]);
                           addXP(200);
                           unlockBadge('module_maestro');
                         }
                         setIsLessonFinished(true); 
                       }}>
                         Complete Module 🏁
                       </button>
                     )
                   ) : (
                     <button className="btn btn-primary" style={{ background: '#e53e3e' }} onClick={() => { generateQuiz(); }}>
                       Retake Quiz 🔄
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="learning-screen">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setCurrentLessonIndex(null)}>← Lessons</button>
              <h2>{currentModule.title.replace(/Module \d+:? /, '')}</h2>
              <div className="progress">Lesson {currentLessonIndex + 1} of {currentModule.lessons.length}</div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentLessonIndex + 1) / currentModule.lessons.length) * 100}%` }}
              ></div>
            </div>

            <div className="lesson-content">
              <h3>{currentLesson.title}</h3>
              <p style={{ marginBottom: '2rem', color: '#666' }}>Click the cards to see the translation and pronunciation.</p>

              <div className="flashcard-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {(currentLesson.vocabulary || currentLesson.phrases).map((item, idx) => (
                  <div key={idx} className="flashcard-wrapper" style={{ position: 'relative' }}>
                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                      <div className="flashcard-inner">
                        <div className="flashcard-front card">
                          <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{item.french}</span>
                          <div style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.9rem' }}>French</div>
                        </div>
                        <div className="flashcard-back card">
                          <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{item.english}</span>
                          <div style={{ marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.9rem' }}>[{item.pronunciation}]</div>
                          <div style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.8rem' }}>English</div>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn-speak" 
                      onClick={(e) => { e.stopPropagation(); handleSpeak(item.french); }}
                      title="Listen to pronunciation"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button 
                  className="btn btn-outline" 
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  ← Previous Lesson
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNextLesson}
                >
                  {(currentLessonIndex + 1) === currentModule.lessons.length ? 'Take Final Quiz ✍️' : ((currentLessonIndex + 1) % 10 === 0 ? 'Take Progress Quiz ✍️' : 'Next Lesson →')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '3rem', opacity: 0.5, fontSize: '0.9rem' }}>
        &copy; 2026 AF PRINCE Learning. A1 Discovery Stage.
      </footer>
    </div>
  );
};

export default App;
