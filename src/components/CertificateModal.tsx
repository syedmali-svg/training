import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Course, CertificateRecord } from '../types';

interface CertificateModalProps {
  course: Course;
  certificate?: CertificateRecord;
  userName: string;
  onUpdateUserName: (name: string) => void;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  certificate,
  userName,
  onUpdateUserName,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(userName || 'Muhammad Ali');
  const [isEditingName, setIsEditingName] = useState(false);

  const credentialId = certificate?.credentialId || `CERT-${course.id.toUpperCase().slice(7, 15)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const issueDate = certificate?.issuedDate || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveName = () => {
    onUpdateUserName(nameInput);
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:m-0 print:w-full">
        {/* Controls header (hidden on print) */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">Certificate of Achievement</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{course.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Document */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center relative overflow-hidden print:text-black print:bg-white print:p-8">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg" />

          {/* Watermark subtle logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] text-indigo-400">
            <Award className="w-96 h-96" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Industry Certification
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-serif">
                Certificate of Competence
              </h1>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                TrainingSite Engineering Academy &bull; Accredited Technical Track
              </p>
            </div>

            <p className="text-xs text-slate-400 italic">This certifies that</p>

            {/* Recipient Name with editable option */}
            <div className="py-2">
              {isEditingName ? (
                <div className="inline-flex items-center gap-2 print:hidden">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-indigo-500 text-white font-serif text-xl text-center focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="group cursor-pointer inline-block" onClick={() => setIsEditingName(true)}>
                  <h2 className="text-2xl md:text-3xl font-bold text-amber-300 font-serif border-b border-amber-500/30 pb-1 px-4 inline-block">
                    {nameInput}
                  </h2>
                  <span className="block text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition print:hidden">
                    (Click name to customize)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              has successfully completed all required modules, rigorous technical assessments, and practical implementation labs for
            </p>

            <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
              {course.title}
            </h3>

            {/* Verification & Signatures */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 gap-8 text-left max-w-xl mx-auto text-xs">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Credential ID</span>
                </div>
                <p className="font-mono text-slate-200 text-[11px] font-semibold">{credentialId}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Issued: {issueDate}</p>
              </div>

              <div className="text-right">
                <div className="text-slate-400 mb-1 font-serif italic text-base text-amber-200">
                  {course.instructor.name}
                </div>
                <p className="font-semibold text-slate-200">{course.instructor.name}</p>
                <p className="text-[10px] text-slate-500">{course.instructor.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
