import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Check, 
  Copy,
  Terminal,
  Sparkles
} from 'lucide-react';
import { CodeExercise } from '../types';

interface CodePlaygroundProps {
  exercise?: CodeExercise;
  onExerciseComplete?: () => void;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  exercise,
  onExerciseComplete
}) => {
  const defaultCode = exercise?.starterCode || `// Welcome to the Interactive Code Sandbox!
// Try creating a function that processes data:

const teamMembers = [
  { name: 'Sarah', role: 'Architect', level: 'Senior' },
  { name: 'Marcus', role: 'DevOps', level: 'Lead' },
  { name: 'Elena', role: 'AI Engineer', level: 'Senior' },
  { name: 'Syed', role: 'FullStack', level: 'Engineer' }
];

function summarizeTeam(members) {
  const seniors = members.filter(m => m.level.includes('Senior') || m.level.includes('Lead'));
  return {
    total: members.length,
    seniorCount: seniors.length,
    roles: members.map(m => m.role)
  };
}

console.log("Team Summary Result:", JSON.stringify(summarizeTeam(teamMembers), null, 2));
`;

  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    setStatus('running');
    const logs: string[] = [];

    // Custom console wrapper
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('[ERROR] ' + args.map(a => String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('[WARN] ' + args.map(a => String(a)).join(' '));
      }
    };

    try {
      // Evaluate within a safe function closure
      const runFn = new Function('console', code);
      runFn(customConsole);

      if (logs.length === 0) {
        logs.push('Execution completed with 0 outputs. Use console.log(...) to print values.');
      }
      setOutput(logs);

      // Validate against tests if exercise provided
      let passedAll = true;
      if (exercise?.tests && exercise.tests.length > 0) {
        for (const test of exercise.tests) {
          if (!test.validate(code)) {
            passedAll = false;
            break;
          }
        }
      }

      if (passedAll) {
        setStatus('success');
        if (onExerciseComplete) {
          onExerciseComplete();
        }
      } else {
        setStatus('idle');
      }
    } catch (err: any) {
      setOutput([`Runtime Error: ${err.message}`]);
      setStatus('error');
    }
  };

  const resetCode = () => {
    setCode(exercise?.starterCode || defaultCode);
    setOutput([]);
    setStatus('idle');
    setShowSolution(false);
  };

  const applySolution = () => {
    if (exercise?.solutionCode) {
      setCode(exercise.solutionCode);
      setShowSolution(true);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Exercise Instructions banner if present */}
      {exercise && (
        <div className="p-4 bg-indigo-950/40 border-b border-indigo-900/40 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Exercise Challenge
              </span>
              <span className="text-xs text-slate-400">Language: {exercise.language.toUpperCase()}</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              {exercise.instructions}
            </p>
          </div>
          {exercise.solutionCode && (
            <button
              onClick={applySolution}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 shrink-0"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              {showSolution ? 'Solution Applied' : 'Reveal Solution'}
            </button>
          )}
        </div>
      )}

      {/* Editor toolbar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-slate-400 ml-2">sandbox.js</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetCode}
            className="p-1.5 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            title="Reset to starter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runCode}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Code
          </button>
        </div>
      </div>

      {/* Code Input Area */}
      <div className="relative flex-1 min-h-[220px]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 selection:bg-indigo-500/30"
          placeholder="// Type your code here..."
        />
      </div>

      {/* Console output panel */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 font-mono">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            Terminal Output
          </span>
          {status === 'success' && (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Passed Validations
            </span>
          )}
          {status === 'error' && (
            <span className="text-red-400 flex items-center gap-1 font-semibold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              Execution Error
            </span>
          )}
        </div>

        <div className="p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
          {output.length === 0 ? (
            <p className="text-slate-600 italic">Press "Run Code" above to execute and view output.</p>
          ) : (
            output.map((line, idx) => (
              <pre
                key={idx}
                className={`whitespace-pre-wrap ${
                  line.startsWith('Runtime Error') || line.startsWith('[ERROR]')
                    ? 'text-red-400'
                    : line.startsWith('[WARN]')
                    ? 'text-amber-300'
                    : 'text-emerald-300'
                }`}
              >
                {line}
              </pre>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
