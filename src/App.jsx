import React, { useState, useEffect, useMemo } from 'react';
import {
  Star, Heart, Sparkles, Crown, Gift, Wand2,
  ArrowRight, RotateCcw, BookOpen, AlertCircle,
  CheckCircle, XCircle, Flag
} from 'lucide-react';

// --- DATA: HÀNH TRÌNH 15 CÂU HỎI TỪ CƠ BẢN ĐẾN NÂNG CAO ---
const stagesData = [
  {
    stageId: 1,
    name: "Chặng 1: Ôn Luyện Thần Chú 🌼",
    questions: [
      { id: 1, type: 'quy_tac', text: 'Công chúa Anna hãy đọc thần chú đầu tiên: Muốn tìm một THỪA SỐ chưa biết, ta làm thế nào?', equation: '', options: ['Lấy tích cộng thừa số', 'Lấy tích nhân thừa số', 'Lấy tích chia thừa số', 'Lấy tích trừ thừa số'], correctAnswer: 'Lấy tích chia thừa số', explanation: 'Chính xác! Lấy Tích chia cho Thừa số đã biết Anna nhé!' },
      { id: 2, type: 'thua_so', text: 'Áp dụng ngay nào! Cùng tìm Thừa số bí ẩn 🌸 nhé!', equation: '🌸 × 8 = 72', options: [7, 8, 9, 6], correctAnswer: 9, explanation: 'Ta lấy tích (72) chia cho thừa số kia (8). 72 : 8 = 9. Anna khởi động rất tốt!' },
      { id: 3, type: 'quy_tac', text: 'Câu thần chú thứ hai: Muốn tìm SỐ BỊ CHIA (số lớn nhất), Anna làm sao nhỉ?', equation: '', options: ['Lấy thương nhân số chia', 'Lấy số chia chia thương', 'Lấy thương cộng số chia', 'Lấy bị chia nhân thương'], correctAnswer: 'Lấy thương nhân số chia', explanation: 'Đúng rồi! Số bị chia luôn là số lớn nhất, nên ta phải làm phép NHÂN nhé.' },
      { id: 4, type: 'so_bi_chia', text: 'Hộp quà 🎀 đang giấu Số bị chia nào đây?', equation: '🎀 : 6 = 8', options: [48, 42, 54, 14], correctAnswer: 48, explanation: 'Ta lấy thương (8) nhân với số chia (6). 8 × 6 = 48. Tuyệt vời!' },
      { id: 5, type: 'quy_tac', text: 'Thần chú cuối cùng: Muốn tìm SỐ CHIA, Anna làm thế nào?', equation: '', options: ['Lấy số bị chia nhân thương', 'Lấy thương nhân số chia', 'Lấy thương chia số bị chia', 'Lấy số bị chia chia thương'], correctAnswer: 'Lấy số bị chia chia thương', explanation: 'Hoàn hảo! Muốn tìm số chia, ta lấy số bị chia chia cho thương nhé!' }
    ]
  },
  {
    stageId: 2,
    name: "Chặng 2: Vượt Rừng Sâu (Tính Toán & Toán Đố) 🦋",
    questions: [
      { id: 6, type: 'so_chia', text: 'Đám mây giấu mất Số chia ☁️ rồi. Số đó là số mấy nhỉ?', equation: '54 : ☁️ = 9', options: [5, 6, 7, 8], correctAnswer: 6, explanation: 'Ta lấy số bị chia (54) chia cho thương (9). 54 : 9 = 6. Xuất sắc!' },
      { id: 7, type: 'thua_so', text: 'Thử thách phép tính lớn hơn! Tìm Thừa số 🦄:', equation: '🦄 × 4 = 124', options: [31, 32, 21, 41], correctAnswer: 31, explanation: 'Ta lấy 124 : 4. Nhẩm: 12 chia 4 được 3, 4 chia 4 được 1. Kết quả là 31!' },
      { id: 8, type: 'so_bi_chia', text: 'Phép tính này giấu Số bị chia rất to nè:', equation: '🎁 : 5 = 16', options: [70, 80, 90, 85], correctAnswer: 80, explanation: 'Ta lấy 16 × 5. Nhẩm: 10 × 5 = 50, 6 × 5 = 30. 50 + 30 = 80. Anna nhẩm siêu quá!' },
      { id: 9, type: 'toan_do_thua_so', text: 'Cô giáo xếp đều 84 quyển vở thành các phần quà, mỗi phần có 4 quyển. Hỏi có bao nhiêu phần quà?', equation: 'X × 4 = 84', options: [21, 22, 31, 12], correctAnswer: 21, explanation: 'Số phần quà chính là Thừa số chưa biết. Ta lấy tổng số vở (84) chia cho số vở mỗi phần (4). 84 : 4 = 21.' },
      { id: 10, type: 'toan_do_so_bi_chia', text: 'Anna chia kẹo cho 6 bạn, mỗi bạn được 12 viên và Anna vừa hết kẹo. Ban đầu Anna có bao nhiêu viên kẹo?', equation: '🍬 : 6 = 12', options: [72, 62, 18, 2], correctAnswer: 72, explanation: 'Kẹo ban đầu chính là Số bị chia. Ta lấy số kẹo một bạn (12) nhân với số bạn (6). 12 × 6 = 72.' }
    ]
  },
  {
    stageId: 3,
    name: "Chặng 3: Thử Thách Nữ Hoàng (Biểu Thức) 👑",
    questions: [
      { id: 11, type: 'so_chia', text: 'Tìm Số chia 🌟 là số tròn chục:', equation: '150 : 🌟 = 5', options: [20, 30, 40, 50], correctAnswer: 30, explanation: 'Ta lấy 150 : 5. Nhẩm 15 chục chia 5 bằng 3 chục (30).' },
      { id: 12, type: 'toan_do_so_chia', text: 'Xếp 120 bông hoa vào các lọ, mỗi lọ cắm 5 bông. Hỏi Anna cắm được bao nhiêu lọ hoa?', equation: '120 : 🏺 = 5', options: [20, 24, 25, 30], correctAnswer: 24, explanation: 'Số lọ hoa chính là Thương (hoặc số chia). Ta lấy 120 : 5 = 24 lọ.' },
      { id: 13, type: 'bieu_thuc_thua_so', text: 'Nâng cấp tư duy 2 bước! Tìm bông hoa 🌷 biết:', equation: '🌷 × 3 = 100 - 10', options: [20, 30, 40, 90], correctAnswer: 30, explanation: 'Bước 1: Tính 100 - 10 = 90. Bước 2: Ta có 🌷 × 3 = 90. Vậy 🌷 = 90 : 3 = 30.' },
      { id: 14, type: 'bieu_thuc_so_bi_chia', text: 'Thử thách vương miện 👑! Tìm số bí ẩn:', equation: '👑 : 4 = 15 + 5', options: [60, 80, 100, 20], correctAnswer: 80, explanation: 'Bước 1: Tính 15 + 5 = 20. Bước 2: Ta có 👑 : 4 = 20. Vậy 👑 = 20 × 4 = 80.' },
      { id: 15, type: 'bieu_thuc_so_chia', text: 'Câu hỏi cuối cùng để nhận danh hiệu Nữ Hoàng! Tìm viên kim cương 💎:', equation: '64 : 💎 = 2 × 4', options: [6, 7, 8, 9], correctAnswer: 8, explanation: 'Bước 1: Tính 2 × 4 = 8. Bước 2: Ta có 64 : 💎 = 8. Vậy 💎 = 64 : 8 = 8. Hoàn hảo!' }
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
  const [gameState, setGameState] = useState('start'); // start, playing, stage_transition, end, review
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentStageData = stagesData[currentStageIndex];
  const currentQ = currentStageData?.questions[currentQuestionIndex];

  // Tổng hợp tiến độ
  const totalQuestions = stagesData.reduce((acc, stage) => acc + stage.questions.length, 0);
  const globalQuestionNumber = history.length + 1;
  const score = history.filter(h => h.isCorrect).length;

  const startGame = () => {
    playSound('click');
    setGameState('playing');
    setCurrentStageIndex(0);
    setCurrentQuestionIndex(0);
    setHistory([]);
    setFeedback(null);
    setSelectedAnswer(null);
  };

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

    // Nếu vẫn còn câu hỏi trong chặng hiện tại
    if (currentQuestionIndex < currentStageData.questions.length - 1) {
      playSound('click');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    // Nếu hết câu hỏi trong chặng hiện tại
    else {
      // Nếu chưa phải chặng cuối -> Chuyển chặng
      if (currentStageIndex < stagesData.length - 1) {
        playSound('levelup');
        setGameState('stage_transition');
      }
      // Nếu đã xong chặng cuối -> Kết thúc
      else {
        playSound('win');
        setGameState('end');
      }
    }
  };

  const nextStage = () => {
    playSound('click');
    setCurrentStageIndex(currentStageIndex + 1);
    setCurrentQuestionIndex(0);
    setGameState('playing');
  };

  const getWeaknesses = () => {
    const mistakes = history.filter(h => !h.isCorrect);
    if (mistakes.length === 0) return null;
    const weakTypes = {};
    mistakes.forEach(m => { weakTypes[m.question.type] = (weakTypes[m.question.type] || 0) + 1; });
    const advice = [];

    if (weakTypes['thua_so']) advice.push("🌸 Nhớ lại nhé: Muốn tìm Thừa số, ta lấy Tích chia cho Thừa số kia.");
    if (weakTypes['so_bi_chia']) advice.push("🎀 Số bị chia là số lớn nhất. Phải làm phép Nhân (Thương × Số chia).");
    if (weakTypes['so_chia']) advice.push("☁️ Mẹo tìm Số chia: Lấy Số bị chia chia cho Thương là ra ngay!");
    if (Object.keys(weakTypes).some(key => key.includes('toan_do'))) {
      advice.push("📜 Ở bài Toán đố, Anna hãy đọc chậm lại xem đề bài cho gì và hỏi gì để chọn phép tính đúng nhé.");
    }
    if (Object.keys(weakTypes).some(key => key.includes('bieu_thuc'))) {
      advice.push("🔮 Với biểu thức phức tạp, Anna nhớ tính kết quả phép tính ở một bên trước, rồi mới đi tìm số bí ẩn nha!");
    }

    return advice.length > 0 ? advice : null;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-pink-100 relative">
      <AnimatedBackground />

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border-4 border-green-300 animate-zoom-in">
          <Crown className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 mb-3 leading-tight">
            Hành Trình Toán Học Của Anna
          </h1>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-8 text-left space-y-2">
            <p className="text-gray-700 font-medium text-sm sm:text-base">✨ Hôm nay, Anna sẽ trải qua một hành trình 15 thử thách liên tục để ôn luyện toàn bộ bí kíp Toán học:</p>
            <ul className="text-sm text-green-700 font-bold space-y-1 ml-4 list-disc">
              <li>Chặng 1: Ôn Luyện Thần Chú</li>
              <li>Chặng 2: Vượt Rừng Sâu</li>
              <li>Chặng 3: Thử Thách Nữ Hoàng</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg sm:text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Flag size={24} /> Bắt Đầu Hành Trình
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="bg-white/95 backdrop-blur-sm p-5 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl max-w-3xl w-full border-4 border-white animate-slide-up">
          {/* Progress Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">Hành trình Nữ Hoàng</span>
                <h3 className="text-sm sm:text-lg font-black text-gray-800">{currentStageData.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-gray-400">Câu {globalQuestionNumber}/{totalQuestions}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${(globalQuestionNumber / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-6 text-center leading-relaxed">
            {currentQ.text}
          </h2>

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
                className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-bold transition-all border-2 
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
                    {feedback === 'correct' ? 'Tuyệt vời!' : 'Chưa đúng mất rồi!'}
                  </h4>
                  <p className="text-gray-700 mt-1 text-sm sm:text-base leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
              <button onClick={nextQuestion} className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 rounded-xl font-bold shadow-md transition-all">Tiếp tục hành trình</button>
            </div>
          )}
        </div>
      )}

      {/* STAGE TRANSITION */}
      {gameState === 'stage_transition' && (
        <div className="bg-white/95 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl max-w-md w-full text-center border-4 border-yellow-300 animate-zoom-in">
          <div className="text-5xl sm:text-7xl mb-6 animate-bounce">
            {currentStageIndex === 0 ? '🦋' : '👑'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-orange-500 mb-4">Tuyệt Vời Anna!</h1>
          <p className="text-gray-600 mb-8 font-medium text-sm sm:text-base">Anna đã hoàn thành <span className="font-bold text-pink-500">{stagesData[currentStageIndex].name}</span>.</p>
          <div className="bg-orange-50 p-4 rounded-2xl mb-8 border border-orange-100">
            <p className="text-orange-700 font-bold text-sm sm:text-base">Sẵn sàng tiến vào chặng tiếp theo khó hơn chưa nào?</p>
          </div>
          <button
            onClick={nextStage}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            Tiến vào Chặng {currentStageIndex + 2} <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* END SCREEN */}
      {gameState === 'end' && (
        <div className="bg-white/95 p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-4 border-yellow-300 animate-zoom-in max-h-[90vh] overflow-y-auto">
          <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-black text-blue-600 mb-2 leading-tight">Lễ Đăng Quang!</h1>
          <p className="text-gray-500 mb-6 font-bold uppercase tracking-widest text-[10px] sm:text-xs italic">Nữ hoàng Toán học Anna</p>
          <div className="bg-blue-50 p-5 rounded-2xl mb-6 border-2 border-blue-100">
            <p className="text-blue-800 font-black text-3xl sm:text-4xl mb-1">⭐ {score} / {totalQuestions}</p>
            <p className="text-blue-600 text-xs sm:text-sm font-bold">Điểm số tổng kết hành trình</p>
          </div>

          {score === totalQuestions ? (
            <div className="bg-green-100 p-4 rounded-2xl mb-6 border border-green-200">
              <p className="text-green-700 font-bold">100 điểm trọn vẹn! Anna đích thị là Thần đồng Toán học! 💖👑</p>
            </div>
          ) : getWeaknesses() && (
            <div className="text-left bg-orange-50 p-4 rounded-2xl border border-orange-200 mb-6">
              <h4 className="font-bold text-orange-700 flex items-center gap-2 mb-2 text-sm sm:text-base"><AlertCircle size={18} /> Cú Mèo nhắc nhở Anna:</h4>
              <ul className="text-xs sm:text-sm space-y-2 text-gray-700 italic">
                {getWeaknesses().map((w, i) => <li key={i}>- {w}</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button onClick={() => setGameState('review')} className="bg-blue-100 text-blue-600 p-4 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-200 transition-all text-sm sm:text-base"><BookOpen className="mr-2" size={20} /> Xem lại bài làm</button>
            <button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-all text-sm sm:text-base">Thử sức lại từ đầu</button>
          </div>
        </div>
      )}

      {/* REVIEW SCREEN */}
      {gameState === 'review' && (
        <div className="bg-white/95 p-4 sm:p-6 rounded-3xl shadow-xl max-w-3xl w-full h-[85vh] overflow-hidden flex flex-col border-4 border-blue-200 animate-zoom-in">
          <div className="flex justify-between items-center mb-4 sm:mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h2 className="text-lg sm:text-xl font-black text-blue-800 flex items-center gap-2"><BookOpen /> Bài Kiểm Tra Của Anna</h2>
            <button onClick={() => setGameState('end')} className="text-gray-400 hover:text-gray-600 font-black text-sm">ĐÓNG</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 custom-scrollbar">
            {history.map((h, i) => (
              <div key={i} className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${h.isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                <div className="flex justify-between font-bold mb-2">
                  <span className="text-gray-400 uppercase text-[10px] sm:text-xs tracking-wider">Câu {i + 1}</span>
                  {h.isCorrect ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />}
                </div>
                <p className="font-bold text-gray-800 mb-2 leading-relaxed text-sm sm:text-base">{h.question.text}</p>
                {h.question.equation && <p className="text-xl sm:text-2xl font-black text-blue-500 mb-3">{h.question.equation}</p>}
                <div className="text-xs sm:text-sm bg-white/70 p-3 sm:p-4 rounded-xl border border-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <p>Anna chọn: <span className={`font-bold ${h.isCorrect ? 'text-green-600' : 'text-red-500'}`}>{h.selected}</span></p>
                    <p>Đáp án đúng: <span className="text-green-600 font-bold">{h.question.correctAnswer}</span></p>
                  </div>
                  {!h.isCorrect && <p className="mt-2 pt-2 border-t border-gray-200 text-gray-600 font-medium">✨ Giải thích: {h.question.explanation}</p>}
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
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
    `}} />
  );
}