import { useState, useRef, useCallback } from 'react';
import {
  FileText, ShieldCheck, HeartPulse, LineChart,
  BookOpen, Sparkles, Send, Loader2, Upload, X, FileCheck2, AlertTriangle, ChevronDown,
  UserCircle, Scan, Globe, LayoutGrid, Layers
} from 'lucide-react';
import { runAgentWorkflow } from '@/api/agent.api';
import { useNotificationStore } from '@/stores/notification.store';
import { Button } from '@/components/ui/Button';
import MetallicPaint from '@/components/ui/MetallicPaint';

const ANALYZERS = [
  { id: 'resume', name: 'Resume Analyzer', icon: UserCircle, color: 'from-emerald-400 to-teal-500', desc: 'Evaluate resume relevance and ATS compatibility', 
    fields: [{key: 'targetRole', label: 'Target Role', placeholder: 'e.g., Full Stack Developer, AI Engineer, Data Scientist'}] 
  },
  { id: 'medical', name: 'Medical Interpreter', icon: HeartPulse, color: 'from-red-400 to-pink-500', desc: 'Interpret medical reports and values',
    fields: [{key: 'analysisFocus', label: 'Analysis Focus', placeholder: 'e.g., report summary, abnormal values, medication explanation'}] 
  },
  { id: 'legal', name: 'Legal Analyzer', icon: ShieldCheck, color: 'from-blue-400 to-indigo-500', desc: 'Review legal agreements and clauses',
    fields: [{key: 'analysisFocus', label: 'Analysis Focus', placeholder: 'e.g., clause review, risk assessment, compliance check'}] 
  },
  { id: 'invoice', name: 'Invoice Analyzer', icon: FileText, color: 'from-amber-400 to-orange-500', desc: 'Extract invoice details and verify totals',
    fields: [{key: 'analysisGoal', label: 'Analysis Goal', placeholder: 'e.g., extract invoice details, verify totals, tax calculation'}] 
  },
  { id: 'research', name: 'Research Paper Analyzer', icon: BookOpen, color: 'from-cyan-400 to-blue-500', desc: 'Summarize methodology and key findings',
    fields: [{key: 'analysisObjective', label: 'Analysis Objective', placeholder: 'e.g., summary, methodology explanation, key findings'}] 
  },
  { id: 'finance', name: 'Financial Statement Analyzer', icon: LineChart, color: 'from-green-400 to-emerald-500', desc: 'Analyze profitability and cash flow',
    fields: [{key: 'analysisFocus', label: 'Analysis Focus', placeholder: 'e.g., profitability analysis, cash flow analysis, ratios'}] 
  },
  { id: 'contract_risk', name: 'Contract Risk Analyzer', icon: AlertTriangle, color: 'from-rose-400 to-red-500', desc: 'Analyze legal and financial risks',
    fields: [{key: 'riskFocus', label: 'Risk Assessment Focus', placeholder: 'e.g., analyze legal risks, financial risks, liability clauses'}] 
  },
  { id: 'universal', name: 'Universal AI Analyzer', icon: Sparkles, color: 'from-purple-400 to-violet-500', desc: 'Analyze, summarize, extract, or explain any document',
    fields: [{key: 'instructions', label: 'Instructions', placeholder: 'Describe what you want the AI to analyze, summarize, extract, explain, or review...'}] 
  }
];

const EXTRACTORS = [
  { id: 'ocr', name: 'OCR Extractor', icon: Scan, color: 'from-blue-400 to-cyan-500', desc: 'Extract structured text from scanned files',
    fields: [{key: 'extractionMode', label: 'Extraction Mode', placeholder: 'e.g., plain text, tables, forms, key-value pairs, structured JSON'}] 
  },
  { id: 'translate', name: 'Translation Agent', icon: Globe, color: 'from-fuchsia-400 to-pink-500', desc: 'Translate preserving document structure',
    fields: [{key: 'translationRequirement', label: 'Translation Requirement', placeholder: 'e.g., Target language and any formatting requirements'}] 
  }
];

const ACCEPTED_TYPES = ['.pdf', '.txt', '.csv', '.md', '.jpg', '.png'];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FlashcardItem({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer bg-[#0a0d0b]/80 border border-cyan-500/10 hover:border-cyan-500/30 rounded-2xl p-6 min-h-[120px] flex flex-col justify-between transition-all select-none shadow-md hover:shadow-cyan-500/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-bl">
        {flipped ? 'ANSWER' : 'QUESTION'}
      </div>
      <div className="text-xs font-semibold text-white leading-relaxed">
        {flipped ? card.answer : card.question}
      </div>
    </div>
  );
}

function QuizQuestionItem({ q, idx }) {
  const [selectedOpt, setSelectedOpt] = useState(null);
  return (
    <div className="bg-[#0a0d0b]/60 border border-emerald-500/10 rounded-2xl p-5 space-y-3 shadow-inner">
      <div className="text-xs font-bold text-white leading-relaxed">Q{idx+1}: {q.question}</div>
      <div className="grid grid-cols-1 gap-2">
        {q.options?.map((opt, optIdx) => {
          let optStyle = 'border-emerald-500/10 hover:bg-emerald-500/5';
          if (selectedOpt !== null) {
            if (optIdx === q.correctIndex) {
              optStyle = 'border-green-500 bg-green-500/10 text-green-300';
            } else if (optIdx === selectedOpt) {
              optStyle = 'border-red-500 bg-red-500/10 text-red-300';
            }
          }
          return (
            <button
              key={optIdx}
              disabled={selectedOpt !== null}
              onClick={() => setSelectedOpt(optIdx)}
              className={`text-left text-xs p-3 rounded-xl border transition-all ${optStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AgentStudioPage() {
  const [activeCategory, setActiveCategory] = useState('analyzers'); // 'analyzers' | 'extractors'
  const [selectedAgent, setSelectedAgent] = useState('resume');
  const [dynamicInputs, setDynamicInputs] = useState({});
  const [docContext, setDocContext] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'text'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const { success, error } = useNotificationStore();

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      error('File too large', 'Maximum file size is 10 MB.');
      return;
    }
    setUploadedFile(file);
  }, [error]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleCategorySwitch = (category) => {
    setActiveCategory(category);
    setSelectedAgent(category === 'analyzers' ? 'resume' : 'ocr');
    setDynamicInputs({});
    setResult(null);
  };

  const handleAgentSwitch = (e) => {
    setSelectedAgent(e.target.value);
    setDynamicInputs({});
    setResult(null);
  };

  const handleRunAgent = async () => {
    const currentAgentList = activeCategory === 'analyzers' ? ANALYZERS : EXTRACTORS;
    const activeAgentInfo = currentAgentList.find(a => a.id === selectedAgent);
    
    for (let field of activeAgentInfo.fields) {
      if (!dynamicInputs[field.key] || !dynamicInputs[field.key].trim()) {
        error('Missing Information', `Please fill out the ${field.label} field.`);
        return;
      }
    }

    if (inputMode === 'file' && !uploadedFile && !docContext.trim()) {
      error('Document required', 'Please upload a document or switch to text mode and paste content.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const compiledPrompt = Object.entries(dynamicInputs)
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
        .join('\n');

      const data = await runAgentWorkflow(
        selectedAgent,
        compiledPrompt,
        inputMode === 'text' ? docContext : '',
        inputMode === 'file' ? uploadedFile : null
      );
      setResult(data);
      success('Processing Complete', `The ${activeAgentInfo.name} has compiled the report.`);
    } catch (err) {
      error('Execution failed', err.message || 'The agent failed to process the request.');
    } finally {
      setLoading(false);
    }
  };

  const currentAgentList = activeCategory === 'analyzers' ? ANALYZERS : EXTRACTORS;
  const activeAgentInfo = currentAgentList.find(a => a.id === selectedAgent) || currentAgentList[0];

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <MetallicPaint />
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header & Main Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-emerald-500/20 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
              <Sparkles className="text-[var(--color-primary)]" size={32} />
              AI Analyzer & Extractor Hub
            </h1>
            <p className="text-emerald-100/70 text-sm mt-2 max-w-2xl leading-relaxed">
              Select an intelligent Analyzer or a Data Extractor. Provide your specific focus, and our agents will process your documents instantly.
            </p>
          </div>
          
          <div className="flex bg-[#0a0d0b]/80 border border-emerald-500/30 p-1.5 rounded-2xl shadow-lg">
            <button
              onClick={() => handleCategorySwitch('analyzers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeCategory === 'analyzers'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={16} /> Analyzers
            </button>
            <button
              onClick={() => handleCategorySwitch('extractors')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeCategory === 'extractors'
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Layers size={16} /> Data Extractors
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Col: Setup & Config */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-tile p-8 rounded-[2rem] border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-black/40 space-y-6">
              
              {/* Agent Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider">
                  Select {activeCategory === 'analyzers' ? 'Analyzer' : 'Extractor'}
                </label>
                <div className="relative">
                  <select
                    value={selectedAgent}
                    onChange={handleAgentSwitch}
                    className="w-full appearance-none bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-2xl p-4 text-white text-sm font-semibold focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer shadow-inner"
                  >
                    {currentAgentList.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 px-1">{activeAgentInfo.desc}</p>
              </div>

              {/* Dynamic Inputs based on selected Agent */}
              <div className="space-y-4 pt-2 border-t border-emerald-500/10">
                {activeAgentInfo.fields.map(field => (
                  <div key={field.key} className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider">{field.label}</label>
                    <textarea
                      value={dynamicInputs[field.key] || ''}
                      onChange={(e) => setDynamicInputs({ ...dynamicInputs, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors min-h-[80px] resize-none placeholder:text-gray-600 shadow-inner"
                    />
                  </div>
                ))}
              </div>

              {/* Input Mode Toggle for Document Base */}
              <div className="pt-2 border-t border-emerald-500/10">
                <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2 block">Source Document</label>
                <div className="flex items-center gap-2 bg-[#0a0d0b]/60 border border-emerald-500/10 rounded-2xl p-1.5 mb-4">
                  <button
                    onClick={() => setInputMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      inputMode === 'file'
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-lg'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Upload size={16} /> File Upload
                  </button>
                  <button
                    onClick={() => setInputMode('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      inputMode === 'text'
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-lg'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <FileText size={16} /> Paste Text
                  </button>
                </div>

                {/* File Upload Zone */}
                {inputMode === 'file' && (
                  <div className="space-y-3">
                    {!uploadedFile ? (
                      <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                          isDragOver
                            ? 'border-emerald-400/80 bg-emerald-500/15 shadow-[0_0_30px_rgba(0,228,118,0.2)]'
                            : 'border-emerald-500/20 bg-[#0a0d0b]/50 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={ACCEPTED_TYPES.join(',')}
                          onChange={handleFileInput}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                            isDragOver ? 'bg-emerald-500/30 text-emerald-300' : 'bg-[#111815] text-emerald-500/50'
                          }`}>
                            <Upload size={28} />
                          </div>
                          <div>
                            <p className="text-base font-bold text-white">
                              {isDragOver ? 'Drop to analyze' : 'Drag & Drop your file here'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1.5 font-medium">Supports PDF, TXT, CSV, Images (Max 10 MB)</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,228,118,0.05)]">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-inner">
                          <FileCheck2 size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{uploadedFile.name}</p>
                          <p className="text-xs text-emerald-200/70 mt-1 font-medium">{formatBytes(uploadedFile.size)} · Ready</p>
                        </div>
                        <button
                          onClick={() => setUploadedFile(null)}
                          className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 flex items-center justify-center text-red-400 transition-colors flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Text Paste Mode */}
                {inputMode === 'text' && (
                  <textarea
                    value={docContext}
                    onChange={(e) => setDocContext(e.target.value)}
                    placeholder="Paste the document text content here..."
                    className="w-full bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-emerald-400 transition-colors min-h-[140px] resize-none placeholder:text-gray-600"
                  />
                )}
              </div>

              <Button
                onClick={handleRunAgent}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 font-extrabold text-sm py-4 rounded-2xl transition-all ${
                  activeCategory === 'analyzers' 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-[0_0_20px_rgba(0,228,118,0.3)] hover:shadow-[0_0_30px_rgba(0,228,118,0.5)]'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Run {activeCategory === 'analyzers' ? 'Analyzer' : 'Extractor'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Col: Structured Output Panel */}
          <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
            <div className="glass-tile flex-1 p-8 rounded-[2rem] border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl bg-black/40 min-h-[650px] flex flex-col relative overflow-hidden">
              
              <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none ${activeCategory === 'analyzers' ? 'bg-emerald-500/10' : 'bg-cyan-500/10'}`} />
              
              <div className="flex items-center justify-between pb-6 border-b border-emerald-500/10 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeAgentInfo.color} flex items-center justify-center text-white shadow-lg border border-white/10`}>
                    <activeAgentInfo.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-xl">{activeAgentInfo.name} Output</h3>
                    <span className={`text-xs font-bold uppercase tracking-widest ${activeCategory === 'analyzers' ? 'text-emerald-400/80' : 'text-cyan-400/80'}`}>
                      {activeCategory === 'analyzers' ? 'Analysis Report' : 'Extracted Payload'}
                    </span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative z-10">
                  <div className="relative">
                    <Loader2 className={`animate-spin ${activeCategory === 'analyzers' ? 'text-emerald-400' : 'text-cyan-400'}`} size={56} />
                  </div>
                  <p className="text-emerald-100/70 text-sm font-medium tracking-wide text-center">
                    {activeCategory === 'analyzers' ? 'Running deep contextual analysis...' : 'Extracting and structuring data patterns...'}
                  </p>
                </div>
              ) : result ? (
                <div className="flex-1 space-y-8 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar relative z-10">
                  
                  {/* RESUME ANALYZER */}
                  {selectedAgent === 'resume' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                          <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">{result.atsScore || 0}%</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">ATS Score</div>
                        </div>
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
                          <div className="text-4xl font-extrabold text-teal-400 tracking-tight">{result.resumeScore || 0}%</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Design Quality</div>
                        </div>
                      </div>

                      {result.missingSkills?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Missing Skills to Upgrade</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.missingSkills.map((skill, idx) => (
                              <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-xl font-medium shadow-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.improvedBullets?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ATS-Optimized Experience Bullets</h4>
                          <div className="space-y-2">
                            {result.improvedBullets.map((bullet, idx) => (
                              <div key={idx} className="bg-[#0a0d0b]/50 border border-emerald-500/10 p-4 rounded-2xl text-emerald-50/80 text-sm leading-relaxed relative group">
                                <span className="text-emerald-400 font-bold mr-2">•</span>
                                {bullet}
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(bullet);
                                    success('Copied!', 'Optimized bullet copied to clipboard.');
                                  }}
                                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded transition-all"
                                >
                                  Copy
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.coverLetter && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Generated Cover Letter Draft</h4>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(result.coverLetter);
                                success('Copied!', 'Cover letter copied.');
                              }}
                              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              Copy All
                            </button>
                          </div>
                          <pre className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-2xl p-5 text-emerald-50/90 text-sm whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                            {result.coverLetter}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MEDICAL INTERPRETER */}
                  {selectedAgent === 'medical' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {result.summary && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Layperson Medical Summary</h4>
                          <p className="text-sm text-emerald-50/90 leading-relaxed bg-[#0a0d0b]/80 p-5 rounded-2xl border border-emerald-500/20 shadow-inner">
                            {result.summary}
                          </p>
                        </div>
                      )}

                      {result.abnormalValues?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Attention Flags / Abnormal Metrics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.abnormalValues.map((v, idx) => (
                              <div key={idx} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm flex justify-between items-center shadow-md">
                                <div>
                                  <div className="font-bold text-rose-400 text-base">{v.metric}</div>
                                  <div className="text-gray-500 text-[10px] mt-0.5">Reference Range: {v.referenceRange}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-extrabold text-white text-lg">{v.value}</div>
                                  <span className="text-[9px] text-red-300 font-bold uppercase tracking-wider bg-red-500/20 px-2 py-0.5 rounded border border-red-500/35">
                                    {v.flag}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.questionsForDoctor?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Suggested Questions for your Doctor</h4>
                          <div className="space-y-2">
                            {result.questionsForDoctor.map((q, idx) => (
                              <div key={idx} className="flex gap-3 bg-[#0a0d0b]/40 p-4 rounded-2xl border border-emerald-500/5 leading-relaxed text-sm text-emerald-50/80">
                                <span className="text-rose-400 font-extrabold font-mono">?</span>
                                <span>{q}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEGAL ANALYZER */}
                  {selectedAgent === 'legal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-[#0a0d0b]/80 border border-blue-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <div className="text-4xl font-extrabold text-blue-400 tracking-tight">{result.riskScore || 0}%</div>
                        <div className="text-xs text-blue-100/60 mt-1 uppercase tracking-widest font-bold">Overall Legal Risk</div>
                      </div>

                      {result.summary && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Executive Legal Summary</h4>
                          <p className="text-sm text-emerald-50/80 leading-relaxed bg-[#0a0d0b]/60 p-5 rounded-2xl border border-emerald-500/10 shadow-inner">
                            {result.summary}
                          </p>
                        </div>
                      )}

                      {result.missingClauses?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Missing Crucial Clauses</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.missingClauses.map((clause, idx) => (
                              <span key={idx} className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs px-3 py-1.5 rounded-xl font-medium">
                                {clause}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.riskyClauses?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Identified Risk Areas</h4>
                          <div className="space-y-3">
                            {result.riskyClauses.map((c, idx) => (
                              <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 text-sm shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                                <div className="font-bold text-red-400 mb-1 pl-2">Clause: &quot;{c.clause}&quot;</div>
                                <div className="text-gray-400 pl-2 leading-relaxed">{c.explanation}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.rewriteSuggestions?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Rewrite Suggestions</h4>
                          <div className="space-y-4">
                            {result.rewriteSuggestions.map((s, idx) => (
                              <div key={idx} className="rounded-2xl overflow-hidden border border-emerald-500/10 shadow-md">
                                <div className="bg-red-500/10 p-4 text-xs text-red-300 border-b border-emerald-500/5 leading-relaxed">
                                  <span className="font-extrabold uppercase tracking-widest text-[9px] block mb-1 text-red-400">Original text</span>
                                  {s.original}
                                </div>
                                <div className="bg-emerald-500/10 p-4 text-xs text-emerald-300 leading-relaxed">
                                  <span className="font-extrabold uppercase tracking-widest text-[9px] block mb-1 text-emerald-400">Suggested Safe Alternative</span>
                                  {s.suggested}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* INVOICE ANALYZER */}
                  {selectedAgent === 'invoice' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{result.verificationStatus || 'Unknown'}</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Verification Status</div>
                        </div>
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />
                          <div className="text-sm font-semibold text-white mt-2 truncate">{result.summary || 'Compiled Invoice'}</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Summary Details</div>
                        </div>
                      </div>

                      {result.extractedData?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Extracted Document Data</h4>
                          <div className="border border-emerald-500/10 rounded-2xl overflow-hidden bg-[#0c0f0d]/50">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-emerald-500/10 bg-[#0f1412]/50 text-gray-400">
                                  <th className="p-3 font-semibold">Key Parameters</th>
                                  <th className="p-3 font-semibold">Extracted Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-emerald-500/5 text-gray-300">
                                {result.extractedData.map((data, idx) => (
                                  <tr key={idx} className="hover:bg-emerald-500/5 transition-all">
                                    <td className="p-3 font-semibold text-emerald-400">{data.key}</td>
                                    <td className="p-3 font-mono text-white">{data.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {result.actionableInsights?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Actionable Insights & Warnings</h4>
                          <div className="space-y-2">
                            {result.actionableInsights.map((insight, idx) => (
                              <div key={idx} className="bg-amber-500/10 border-l-2 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
                                <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={14} />
                                <p className="text-xs text-gray-300 leading-relaxed">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RESEARCH PAPER ANALYZER */}
                  {selectedAgent === 'research' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {result.summary && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Academic summary</h4>
                          <p className="text-sm text-emerald-50/90 leading-relaxed bg-[#0a0d0b]/80 p-5 rounded-2xl border border-emerald-500/20 shadow-inner">
                            {result.summary}
                          </p>
                        </div>
                      )}

                      {result.keyFindings?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Key Findings & Methodology</h4>
                          <div className="space-y-2">
                            {result.keyFindings.map((finding, idx) => (
                              <div key={idx} className="bg-[#0a0d0b]/40 border border-emerald-500/10 p-4 rounded-2xl text-emerald-50/80 text-sm leading-relaxed">
                                <span className="text-cyan-400 font-extrabold mr-2"># {idx + 1}</span>
                                {finding}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.flashcards?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Study Flashcards (Click to flip)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.flashcards.map((card, idx) => (
                              <FlashcardItem key={idx} card={card} />
                            ))}
                          </div>
                        </div>
                      )}

                      {result.quiz?.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Academic Knowledge Quiz</h4>
                          <div className="space-y-4">
                            {result.quiz.map((q, idx) => (
                              <QuizQuestionItem key={idx} q={q} idx={idx} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FINANCIAL STATEMENT ANALYZER */}
                  {selectedAgent === 'finance' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {result.clientName && (
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-5 text-center shadow-lg">
                          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">{result.clientName}</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Client / Entity Name</div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400" />
                          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">${result.totalAmount || 0}</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Total Invoiced Amount</div>
                        </div>
                        <div className="bg-[#0a0d0b]/80 border border-emerald-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400" />
                          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">${result.gstAmount || 0}</div>
                          <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Tax ({result.taxRate || 0}%)</div>
                        </div>
                      </div>

                      {result.accountingEntry && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Double-Entry Bookkeeping Visualizer</h4>
                          <div className="border border-emerald-500/10 rounded-2xl overflow-hidden bg-[#0c0f0d]/50">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-emerald-500/10 bg-[#0f1412]/50 text-gray-400">
                                  <th className="p-3 font-semibold">Account Category</th>
                                  <th className="p-3 font-semibold text-right">Debit</th>
                                  <th className="p-3 font-semibold text-right">Credit</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-emerald-500/5 text-gray-300">
                                <tr className="hover:bg-emerald-500/5 transition-all">
                                  <td className="p-3 font-semibold text-emerald-400">{result.accountingEntry.debit || 'Cash/Receivables'}</td>
                                  <td className="p-3 font-mono text-white text-right">${result.totalAmount || 0}</td>
                                  <td className="p-3 font-mono text-gray-600 text-right">-</td>
                                </tr>
                                <tr className="hover:bg-emerald-500/5 transition-all">
                                  <td className="p-3 font-semibold text-emerald-400 pl-6">{result.accountingEntry.credit || 'Revenue/Services'}</td>
                                  <td className="p-3 font-mono text-gray-600 text-right">-</td>
                                  <td className="p-3 font-mono text-emerald-400 font-bold text-right">${result.totalAmount || 0}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {result.auditReport && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Financial Auditor Commentary</h4>
                          <p className="text-sm text-emerald-50/80 leading-relaxed bg-[#0a0d0b]/80 p-5 rounded-2xl border border-emerald-500/20 shadow-inner">
                            {result.auditReport}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CONTRACT RISK ANALYZER */}
                  {selectedAgent === 'contract_risk' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-[#0a0d0b]/80 border border-red-500/20 rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                        <div className="text-4xl font-extrabold text-red-500 tracking-tight">{result.overallRiskScore || 0}%</div>
                        <div className="text-xs text-red-200/60 mt-1 uppercase tracking-widest font-bold">Overall Liabilities Risk</div>
                      </div>

                      {result.riskSummary && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Risk Summary Report</h4>
                          <p className="text-sm text-emerald-50/80 leading-relaxed bg-[#0a0d0b]/60 p-5 rounded-2xl border border-emerald-500/10 shadow-inner">
                            {result.riskSummary}
                          </p>
                        </div>
                      )}

                      {result.criticalRisks?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Critical Identified Risks</h4>
                          <div className="space-y-2">
                            {result.criticalRisks.map((c, idx) => (
                              <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex justify-between items-center text-xs">
                                <span className="font-semibold text-white">{c.risk}</span>
                                <span className={`font-bold px-2 py-0.5 rounded border uppercase text-[9px] ${
                                  c.severity === 'High' ? 'bg-red-500/20 border-red-500 text-red-300' :
                                  c.severity === 'Medium' ? 'bg-orange-500/20 border-orange-500 text-orange-300' :
                                  'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                                }`}>
                                  {c.severity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.mitigationStrategies?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Risk Mitigation Actions</h4>
                          <div className="space-y-2">
                            {result.mitigationStrategies.map((strategy, idx) => (
                              <div key={idx} className="bg-[#0a0d0b]/40 border border-emerald-500/10 p-4 rounded-2xl text-emerald-50/80 text-xs leading-relaxed">
                                <span className="text-red-400 font-extrabold mr-2">•</span>
                                {strategy}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* UNIVERSAL AI ANALYZER */}
                  {selectedAgent === 'universal' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {result.analysisOverview && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Analysis Overview</h4>
                          <p className="text-sm text-emerald-50/80 leading-relaxed bg-[#0a0d0b]/60 p-5 rounded-2xl border border-emerald-500/10 shadow-inner">
                            {result.analysisOverview}
                          </p>
                        </div>
                      )}

                      {result.extractedPoints?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Extracted Key Points</h4>
                          <div className="space-y-2">
                            {result.extractedPoints.map((point, idx) => (
                              <div key={idx} className="bg-[#0a0d0b]/40 border border-emerald-500/10 p-4 rounded-2xl text-emerald-50/80 text-xs leading-relaxed">
                                <span className="text-purple-400 font-extrabold mr-2">•</span>
                                {point}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.detailedFindings?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Detailed Analysis Findings</h4>
                          <div className="grid grid-cols-1 gap-3">
                            {result.detailedFindings.map((finding, idx) => (
                              <div key={idx} className="bg-[#0a0d0b]/80 border border-purple-500/10 rounded-2xl p-5 space-y-2 shadow-md">
                                <div className="font-bold text-white text-sm">{finding.topic}</div>
                                <div className="text-xs text-gray-400 leading-relaxed">{finding.details}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OCR EXTRACTOR */}
                  {selectedAgent === 'ocr' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-[#0a0d0b]/80 border border-blue-500/20 rounded-3xl p-5 text-center shadow-lg">
                        <div className="text-2xl font-extrabold text-blue-400 tracking-tight">{result.extractionModeUsed || 'Plain Text'}</div>
                        <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Extraction Mode Used</div>
                      </div>

                      {result.extractedText && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Digitized Raw Text</h4>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(result.extractedText);
                                success('Copied!', 'Extracted raw text copied.');
                              }}
                              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Copy Text
                            </button>
                          </div>
                          <pre className="bg-[#0c0f0d] border border-cyan-500/10 rounded-2xl p-5 text-gray-300 text-xs whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                            {result.extractedText}
                          </pre>
                        </div>
                      )}

                      {result.structuredData && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Structured JSON Payload</h4>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(result.structuredData, null, 2));
                                success('Copied!', 'Structured JSON copied.');
                              }}
                              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Copy JSON
                            </button>
                          </div>
                          <pre className="bg-[#0c0f0d] border border-cyan-500/10 rounded-2xl p-5 text-emerald-400 text-xs whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                            {JSON.stringify(result.structuredData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TRANSLATION AGENT */}
                  {selectedAgent === 'translate' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-[#0a0d0b]/80 border border-fuchsia-500/20 rounded-3xl p-5 text-center shadow-lg">
                        <div className="text-2xl font-extrabold text-fuchsia-400 tracking-tight">{result.targetLanguage || 'Translated'}</div>
                        <div className="text-xs text-emerald-100/60 mt-1 uppercase tracking-widest font-bold">Target Language</div>
                      </div>

                      {result.translatedText && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Translated Document Output</h4>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(result.translatedText);
                                success('Copied!', 'Translated text copied.');
                              }}
                              className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                            >
                              Copy Translation
                            </button>
                          </div>
                          <pre className="bg-[#0c0f0d] border border-fuchsia-500/10 rounded-2xl p-5 text-gray-300 text-xs whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                            {result.translatedText}
                          </pre>
                        </div>
                      )}

                      {result.translationNotes?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Translation Notes & Nuances</h4>
                          <div className="space-y-2">
                            {result.translationNotes.map((note, idx) => (
                              <div key={idx} className="bg-fuchsia-500/5 border-l-2 border-fuchsia-500 p-4 rounded-r-xl flex items-start gap-3">
                                <span className="text-fuchsia-400 font-extrabold mr-1">•</span>
                                <p className="text-xs text-gray-300 leading-relaxed">{note}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                  <div className="w-24 h-24 rounded-full bg-[#0a0d0b]/80 border border-emerald-500/20 flex items-center justify-center text-emerald-500/40 shadow-inner">
                    <Sparkles size={40} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xl">Awaiting Configuration</h4>
                    <p className="text-emerald-100/50 text-sm mt-3 max-w-sm leading-relaxed mx-auto">
                      Fill out the target constraints on the left and upload your document. The output payload will be generated here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
