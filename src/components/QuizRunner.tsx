import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onCompleteQuiz: (scorePercent: number) => void;
  previousScore?: number;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  questions,
  onCompleteQuiz,
  previousScore
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const total = questions.length;

  const handleSelectOption = (optionIndex: number) => {
    if (revealed[currentIndex]) return; // locked once checked
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleCheckAnswer = () => {
    setRevealed(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correct++;
        }
      });
      const score = Math.round((correct / total) * 100);
      setIsFinished(true);
      onCompleteQuiz(score);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setRevealed({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  if (isFinished) {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / total) * 100);
    const passed = finalScore >= 70;

    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-center space-y-6 max-w-xl mx-auto">
        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
          passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }`}>
          {passed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">
            {passed ? 'Quiz Passed! Excellent Work' : 'Quiz Completed - Needs Review'}
          </h3>
          <p className="text-xs text-slate-400">
            You scored {correctCount} out of {total} questions correctly ({finalScore}%).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around text-xs">
          <div>
            <span className="text-slate-500 block">Correct Answers</span>
            <span className="text-lg font-bold text-emerald-400">{correctCount}</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <span className="text-slate-500 block">Total Score</span>
            <span className={`text-lg font-bold ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {finalScore}%
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <span className="text-slate-500 block">Benchmark</span>
            <span className="text-lg font-bold text-slate-300">70%</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const selectedOpt = selectedAnswers[currentIndex];
  const isRevealed = revealed[currentIndex];
  const isSelectedCorrect = selectedOpt === currentQ.correctAnswer;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top progress tracker */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
        <span className="font-semibold text-indigo-300">
          Question {currentIndex + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          {previousScore !== undefined && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Previous best: {previousScore}%
            </span>
          )}
          <span className="font-mono text-slate-500">
            {Math.round(((currentIndex + 1) / total) * 100)}%
          </span>
        </div>
      </div>

      {/* Question prompt */}
      <div>
        <h3 className="text-base font-semibold text-white leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === currentQ.correctAnswer;

          let btnClass = 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 text-slate-300';

          if (isRevealed) {
            if (isCorrect) {
              btnClass = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 font-medium';
            } else if (isSelected && !isCorrect) {
              btnClass = 'border-red-500/50 bg-red-950/30 text-red-300';
            } else {
              btnClass = 'border-slate-800/50 bg-slate-950/30 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            btnClass = 'border-indigo-500 bg-indigo-950/30 text-indigo-200 ring-1 ring-indigo-500';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isRevealed}
              className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-center justify-between gap-3 ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[11px] font-semibold text-slate-400 shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>

              {isRevealed && isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isRevealed && isSelected && !isCorrect && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation callout when revealed */}
      {isRevealed && (
        <div className={`p-4 rounded-xl text-xs space-y-1.5 border ${
          isSelectedCorrect
            ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
            : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
        }`}>
          <div className="font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            {isSelectedCorrect ? 'Correct Explanation:' : 'Review Concept:'}
          </div>
          <p className="text-slate-300 leading-relaxed">
            {currentQ.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          {!isRevealed ? 'Select an answer to check correctness' : 'Click next to advance'}
        </span>

        {!isRevealed ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedOpt === undefined}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition flex items-center gap-2"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-2"
          >
            <span>{currentIndex < total - 1 ? 'Next Question' : 'Complete Quiz'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
