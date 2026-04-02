import React, { useState, useEffect, useMemo } from 'react';
import {
  Star, Heart, Sparkles, Crown, Gift, Wand2,
  ArrowRight, RotateCcw, BookOpen, AlertCircle,
  CheckCircle, XCircle
} from 'lucide-react';

// --- DATA: CÂU HỎI VÀ BÀI TẬP ---
const levelsData = [
  {
    levelId: 1,
    name: "Cấp độ 1: Khởi động 🌼",
    questions: [
      { id: 1, type: 'thua_so', text: 'Cùng giúp Thỏ Trắng tìm Thừa số bí ẩn 🌸 nhé, Anna!', equation: '🌸 × 5 = 35', options: [6, 7, 8, 9], correctAnswer: 7, explanation: 'Muốn tìm thừa số chưa biết, ta lấy tích (35) chia cho thừa số kia (5). 35 : 5 = 7. Anna giỏi quá!' },
      { id: 2, type: 'so_bi_chia', text: 'Ôi không! Số bị chia 🎀 đã đi lạc rồi. Anna tìm giúp nhé!', equation: '🎀 : 4 = 8', options: [32, 24, 12, 28], correctAnswer: 32, explanation: 'Muốn tìm số bị chia, ta lấy thương (8) nhân với số chia (4). 8 × 4 = 32. Tuyệt vời!' },
      { id: 3, type: 'so_chia', text: 'Đám mây giấu mất Số chia ☁️ rồi. Số đó là số mấy nhỉ?', equation: '18 : ☁️ = 2', options: [7, 8, 9, 6], correctAnswer: 9, explanation: 'Muốn tìm số chia, ta lấy số bị chia (18) chia cho thương (2). 18 : 2 = 9. Xuất sắc!' }
    ]
  },
  {
    levelId: 2,
    name: "Cấp độ 2: Tăng tốc 🦋",
    questions: [
      { id: 4, type: 'quy_tac', text: 'Công chúa Anna hãy đọc thần chú: Muốn tìm một THỪA SỐ chưa biết, ta làm thế nào?', equation: '', options: ['Lấy tích cộng thừa số', 'Lấy tích nhân thừa số', 'Lấy tích chia thừa số', 'Lấy tích trừ thừa số'], correctAnswer: 'Lấy tích chia thừa số', explanation: 'Đúng rồi! Câu thần chú là: Lấy Tích chia cho Thừa số đã biết nhé!' },
      { id: 5, type: 'thua_so', text: 'Phép thuật đang biến hóa! Anna tìm Thừa số 🦄 trong phép tính:', equation: '8 × 🦄 = 64', options: [6, 7, 8, 9], correctAnswer: 8, explanation: 'Ta lấy tích (64) chia cho thừa số đã biết (8). 64 : 8 = 8. Anna làm tốt lắm!' },
      { id: 6, type: 'so_bi_chia', text: 'Hộp quà 🎁 chứa Số bị chia nào đây?', equation: '🎁 : 8 = 9', options: [64, 72, 81, 17], correctAnswer: 72, explanation: 'Lấy thương (9) nhân với số chia (8). 9 × 8 = 72. Công chúa Anna thật thông minh!' }
    ]
  },
  {
    levelId: 3,
    name: "Cấp độ 3: Về đích 👑",
    questions: [
      { id: 7, type: 'so_chia', text: 'Ngôi sao 🌟 giấu Số chia nào vậy Anna?', equation: '63 : 🌟 = 7', options: [7, 8, 9, 10], correctAnswer: 9, explanation: 'Ta lấy số bị chia (63) chia cho thương (7). 63 : 7 = 9. Chuẩn không cần chỉnh!' },
      { id: 8, type: 'thua_so', text: 'Thử thách khó hơn một chút! Anna tìm số 🌷:', equation: '🌷 × 4 = 120', options: [20, 30, 40, 50], correctAnswer: 30, explanation: 'Ta lấy tích (120) chia cho thừa số kia (4). Nhẩm: 12 chục : 4 = 3 chục (30). Giỏi quá!' },
      { id: 9, type: 'so_bi_chia', text: 'Anna hãy giải cứu kẹo ngọt 🍬! Mẹ chia đều kẹo cho 6 bé, mỗi bé được 5 viên. Ban đầu có bao nhiêu viên?', equation: '🍬 : 6 = 5', options: [25, 30, 35, 11], correctAnswer: 30, explanation: 'Kẹo ban đầu chính là Số bị chia! Ta lấy 5 × 6 = 30 viên kẹo.' }
    ]
  }
];

// --- UTILS: AUDIO ---
const playSound = (type) => {
  const sounds = {
    click: 'https://actions.google.com/sounds/v1/ui/click.ogg',
    correct: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg',
    incorrect: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
    levelup: 'https://actions.google.com/sounds/v1/cartoon/slip_and_slide_swish.ogg',
    win: 'https://actions.google.com/sounds/v1/crowds/kids_cheering.ogg'
  };
  const audio = new Audio(sounds[type]);
  audio.volume = 0.5;
  audio.play().catch(() => { });
};

// --- DECORATION COMPONENTS ---
const Cloud = ({ className, style, size = 100 }) => (
  <svg className={className} style={style} viewBox="0 0 200 100" width={size} height={size / 2} fill="white">
    <path d="M 40 85 A 25 25 0 0 1 45 40 A 35 35 0 0 1 110 20 A 35 35 0 0 1 165 45 A 25 25 0 0 1 160 85 Z" opacity="0.6" />
  </svg>
);

const Bird = ({ className, style, color = "#93c5fd" }) => (
  <div className={`absolute ${className}`} style={style}>
    <svg viewBox="0 0 100 100" width="40" height="40">
      <path d="M 70 50 L 95 40 L 90 55 Z" fill={color} opacity="0.8" />
      <ellipse cx="50" cy="50" rx="20" ry="12" fill={color} />
      <circle cx="35" cy="45" r="10" fill={color} />
      <circle cx="32" cy="43" r="1.5" fill="black" />
      <path d="M 50 45 C 50 45, 65 10, 80 25 Z" fill={color} className="animate-wing-flap origin-[50px_45px]" />
    </svg>
  </div>
);

const AnimatedBackground = React.memo(() => (
  <div
    className="fixed inset-0 z-[-1] overflow-hidden bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/background.png')" }}
  >
    <Cloud className="absolute animate-cloud-slow top-[5%] right-[-15%]" size={80} />
    <Cloud className="absolute animate-cloud-fast top-[15%] right-[-20%]" size={60} style={{ animationDelay: '10s' }} />
    <Bird className="animate-fly-bird top-[12%] right-[-10%]" color="#93c5fd" />
    <Bird className="animate-fly-bird top-[25%] right-[-10%]" color="#f9a8d4" style={{ animationDelay: '8s' }} />
    <Bird className="animate-fly-bird top-[8%] right-[-10%]" color="#fde047" style={{ animationDelay: '15s' }} />
  </div>
));

export default function App() {
  const [gameState, setGameState] = useState('start');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentLevelData = levelsData[currentLevelIndex];
  const currentQ = currentLevelData?.questions[currentQuestionIndex];
  const score = history.filter(h => h.isCorrect).length;

  const handleAnswer = (answer) => {
    if (feedback !== null) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQ.correctAnswer;
    setHistory([...history, { question: currentQ, selected: answer, isCorrect }]);
    if (isCorrect) { playSound('correct'); setFeedback('correct'); }
    else { playSound('incorrect'); setFeedback('incorrect'); }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex < currentLevelData.questions.length - 1) {
      playSound('click');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      playSound('levelup');
      setGameState('level_transition');
    }
  };

  const getWeaknesses = () => {
    const mistakes = history.filter(h => !h.isCorrect);
    if (mistakes.length === 0) return null;
    const weakTypes = {};
    mistakes.forEach(m => { weakTypes[m.question.type] = (weakTypes[m.question.type] || 0) + 1; });
    const advice = [];
    if (weakTypes['thua_so']) advice.push("🌸 Anna thi thoảng quên tìm Thừa số. Nhớ: Lấy Tích chia Thừa số kia nha!");
    if (weakTypes['so_bi_chia']) advice.push("🎀 Số bị chia hay trốn kỹ. Nhớ đây là số lớn nhất, phải làm phép Nhân (Thương × Số chia).");
    if (weakTypes['so_chia']) advice.push("☁️ Số chia trốn trong mây. Mẹo: Lấy Số bị chia chia cho Thương là ra ngay!");
    return advice;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-pink-100 relative">
      <AnimatedBackground />

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-xl max-w-md w-full text-center border-4 border-green-300 animate-zoom-in">
          <Crown className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600 mb-2 leading-tight">Vườn Toán Của Anna</h1>
          <p className="text-gray-700 mb-8 font-medium text-sm sm:text-base">Chào mừng công chúa Anna! Hãy bắt đầu hành trình chinh phục những con số nhé! 🌸</p>
          <button
            onClick={() => { playSound('click'); setGameState('select_level'); }}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Vào Vườn Chọn Bài
          </button>
        </div>
      )}

      {/* SELECT LEVEL */}
      {gameState === 'select_level' && (
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-xl max-w-4xl w-full text-center border-4 border-blue-300 animate-zoom-in">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-blue-600 mb-8 uppercase tracking-wide">Anna muốn học bài nào hôm nay? 🌟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {levelsData.map((lvl, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentLevelIndex(idx); setCurrentQuestionIndex(0); setGameState('playing'); playSound('click'); }}
                className="bg-white p-6 rounded-2xl border-2 border-sky-200 hover:border-sky-500 hover:scale-105 transition-all shadow-md group"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:animate-bounce">{idx === 0 ? '🌼' : idx === 1 ? '🦋' : '👑'}</div>
                <h3 className="font-bold text-sky-800 text-sm sm:text-base md:text-lg leading-snug">{lvl.name}</h3>
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button
              onClick={() => { setGameState('end'); playSound('win'); }}
              className="mt-8 sm:mt-10 bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
            >
              Xem Kết Quả Chung
            </button>
          )}
        </div>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl max-w-2xl w-full border-4 border-white animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{currentLevelData.name}</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Câu {currentQuestionIndex + 1}/{currentLevelData.questions.length}</span>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-6 sm:mb-8 text-center leading-relaxed">{currentQ.text}</h2>

          {currentQ.equation && (
            <div className="bg-green-50 rounded-2xl py-6 sm:py-8 mb-8 text-3xl sm:text-4xl md:text-5xl font-black text-green-600 text-center tracking-widest shadow-inner border border-green-100">
              {currentQ.equation}
            </div>
          )}

          <div className={`grid gap-3 sm:gap-4 ${typeof currentQ.options[0] === 'string' ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={feedback !== null}
                className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold transition-all border-2 
                  ${feedback === null ? 'bg-white border-gray-100 hover:border-green-400 hover:bg-green-50' :
                    opt === currentQ.correctAnswer ? 'bg-green-100 border-green-500 text-green-700 scale-[1.02] shadow-md' :
                      opt === selectedAnswer ? 'bg-red-50 border-red-300 text-red-400 opacity-80' : 'bg-gray-50 border-gray-100 opacity-40'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-8 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 animate-zoom-in ${feedback === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl">{feedback === 'correct' ? '💖' : '🌸'}</div>
                <div className="flex-1">
                  <h4 className={`font-black text-base sm:text-lg ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                    {feedback === 'correct' ? 'Đúng rồi! Anna thật giỏi!' : 'Cố gắng nhẩm lại nhé Anna!'}
                  </h4>
                  <p className="text-gray-700 mt-1 text-sm sm:text-base leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
              <button onClick={nextQuestion} className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 rounded-xl font-bold shadow-md transition-all">Tiếp tục nào Anna!</button>
            </div>
          )}
        </div>
      )}

      {/* LEVEL TRANSITION */}
      {gameState === 'level_transition' && (
        <div className="bg-white/95 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl max-w-md w-full text-center border-4 border-yellow-300 animate-zoom-in">
          <div className="text-5xl sm:text-7xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-black text-orange-500 mb-4">Tuyệt Vời Anna!</h1>
          <p className="text-gray-600 mb-8 font-medium italic text-sm sm:text-base">Anna đã chinh phục thành công thử thách này rồi nhé!</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setGameState('select_level')} className="bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105">Chọn bài học khác</button>
            <button onClick={() => { setGameState('end'); playSound('win'); }} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105">Xem Lễ Đăng Quang 👑</button>
          </div>
        </div>
      )}

      {/* END SCREEN */}
      {gameState === 'end' && (
        <div className="bg-white/95 p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-4 border-yellow-300 animate-zoom-in max-h-[90vh] overflow-y-auto">
          <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-black text-blue-600 mb-2 leading-tight">Lễ Đăng Quang!</h1>
          <p className="text-gray-500 mb-6 font-bold uppercase tracking-widest text-[10px] sm:text-xs italic">Nữ hoàng Toán học Anna</p>
          <div className="bg-blue-50 p-5 rounded-2xl mb-6 border-2 border-blue-100">
            <p className="text-blue-800 font-black text-2xl sm:text-3xl">⭐ {score} / {history.length}</p>
            <p className="text-blue-600 text-[10px] sm:text-xs font-bold uppercase mt-1">Số sao thu thập được</p>
          </div>

          {getWeaknesses() && (
            <div className="text-left bg-orange-50 p-4 rounded-2xl border border-orange-200 mb-6">
              <h4 className="font-bold text-orange-700 flex items-center gap-2 mb-2 text-sm sm:text-base"><AlertCircle size={18} /> Quân sư Cú Mèo nhắc:</h4>
              <ul className="text-xs sm:text-sm space-y-2 text-gray-700 italic">
                {getWeaknesses().map((w, i) => <li key={i}>- {w}</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => setGameState('review')} className="bg-blue-100 text-blue-600 p-4 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-200 transition-all text-sm sm:text-base"><BookOpen className="mr-2" size={20} /> Nhật ký phép thuật</button>
            <button onClick={() => { setHistory([]); setGameState('start'); }} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-all text-sm sm:text-base">Học lại từ đầu</button>
          </div>
        </div>
      )}

      {/* REVIEW SCREEN */}
      {gameState === 'review' && (
        <div className="bg-white/95 p-4 sm:p-6 rounded-3xl shadow-xl max-w-2xl w-full h-[85vh] overflow-hidden flex flex-col border-4 border-blue-200 animate-zoom-in">
          <div className="flex justify-between items-center mb-4 sm:mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h2 className="text-lg sm:text-xl font-black text-blue-800 flex items-center gap-2"><BookOpen /> Nhật ký của Anna</h2>
            <button onClick={() => setGameState('end')} className="text-gray-400 hover:text-gray-600 font-black text-sm">ĐÓNG</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 custom-scrollbar">
            {history.map((h, i) => (
              <div key={i} className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${h.isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex justify-between font-bold mb-2">
                  <span className="text-gray-400 uppercase text-[10px]">Câu {i + 1}</span>
                  {h.isCorrect ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                </div>
                <p className="font-bold text-gray-800 mb-2 leading-relaxed text-sm sm:text-base">{h.question.text}</p>
                {h.question.equation && <p className="text-xl sm:text-2xl font-black text-blue-500 mb-3">{h.question.equation}</p>}
                <div className="text-xs sm:text-sm bg-white/60 p-3 rounded-xl border border-white">
                  <p>Anna đã chọn: <span className={h.isCorrect ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{h.selected}</span></p>
                  <p className="mt-1">Đáp án đúng: <span className="text-green-600 font-bold">{h.question.correctAnswer}</span></p>
                  {!h.isCorrect && <p className="mt-2 pt-2 border-t border-red-50 text-gray-500 italic text-[10px] sm:text-xs">Ghi chú: {h.question.explanation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CSSAnimations />
    </div>
  );
}

// --- CSS KEYFRAMES ---
function CSSAnimations() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes cloud { from { transform: translateX(20vw); } to { transform: translateX(-150vw); } }
      @keyframes flyBird { 0% { transform: translate(20vw, 0) scale(1); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(-60vw, 5vh) scale(1.05); } 100% { transform: translate(-150vw, 0) scale(1); opacity: 0; } }
      @keyframes flap { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(45deg); } }
      @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      .animate-cloud-slow { animation: cloud 75s linear infinite; }
      .animate-cloud-fast { animation: cloud 50s linear infinite; }
      .animate-fly-bird { animation: flyBird 30s linear infinite; }
      .animate-wing-flap { animation: flap 0.3s ease-in-out infinite; }
      .animate-zoom-in { animation: zoomIn 0.4s ease-out; }
      .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
    `}} />
  );
}