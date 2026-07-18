import { useState } from 'react';
import {
  GitMerge, Play, Plus, Trash2, Mail, CloudUpload,
  Bot, Eye, Sparkles, Loader2, CheckCircle2, ArrowRight,
  FileText, DownloadCloud, X, Link as LinkIcon, Code, Globe, Info
} from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import { Button } from '@/components/ui/Button';

const PIPELINE_NODES = {
  triggers: [
    { id: 'linkedin_ingest', name: 'LinkedIn Extractor', icon: Bot, type: 'trigger', desc: 'Extracts profile data from a LinkedIn URL.' },
    { id: 'github_ingest', name: 'GitHub Extractor', icon: Code, type: 'trigger', desc: 'Fetches public repos and bio from a GitHub URL.' },
    { id: 'portfolio_ingest', name: 'Website Scraper', icon: Globe, type: 'trigger', desc: 'Scrapes text content from any portfolio URL.' }
  ],
  processors: [
    { id: 'ai_extract', name: 'AI Resume Builder', icon: Sparkles, type: 'processor', desc: 'Uses Gemini to generate a professional resume.' }
  ],
  outputs: [
    { id: 'generate_pdf', name: 'PDF Generator', icon: DownloadCloud, type: 'output', desc: 'Converts structured AI output into a formatted PDF.' },
    { id: 'email', name: 'Email Client', icon: Mail, type: 'output', desc: 'Sends PDF attachment to client address.' }
  ]
};

// Helper to find a node globally
const findNode = (nodeType) => {
  return [...PIPELINE_NODES.triggers, ...PIPELINE_NODES.processors, ...PIPELINE_NODES.outputs].find(n => n.id === nodeType);
};

export function WorkflowBuilderPage() {
  const [pipeline, setPipeline] = useState({
    trigger: { id: 'node_1', type: 'github_ingest', name: 'GitHub Extractor' },
    processor: { id: 'node_2', type: 'ai_extract', name: 'AI Resume Builder' },
    output: { id: 'node_3', type: 'generate_pdf', name: 'PDF Generator' }
  });
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Configuration Modal State
  const [showConfig, setShowConfig] = useState(false);
  const [triggerInput, setTriggerInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [pdfResult, setPdfResult] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);

  const { success, error } = useNotificationStore();

  const addNode = (nodeType) => {
    const nodeInfo = findNode(nodeType);
    if (!nodeInfo) return;

    let slot = '';
    if (nodeInfo.type === 'trigger') slot = 'trigger';
    if (nodeInfo.type === 'processor') slot = 'processor';
    if (nodeInfo.type === 'output') slot = 'output';

    setPipeline(prev => ({
      ...prev,
      [slot]: {
        id: `node_${Date.now()}`,
        type: nodeType,
        name: nodeInfo.name
      }
    }));
    success('Slot Updated', `Assigned ${nodeInfo.name} to the ${slot} phase.`);
  };

  const removeNode = (slot) => {
    setPipeline(prev => ({ ...prev, [slot]: null }));
  };

  const openTestConfig = () => {
    if (!pipeline.trigger || !pipeline.processor || !pipeline.output) {
      error('Incomplete Pipeline', 'Please fill all 3 slots (Trigger, Processor, Output) to execute.');
      return;
    }
    setPdfResult(null);
    setExecutionLogs([]);
    setShowConfig(true);
  };

  const runPipeline = async () => {
    if (!triggerInput.trim()) {
      error('Input required', 'Please provide a trigger input.');
      return;
    }
    if (pipeline.output?.type === 'email' && !emailInput.trim()) {
      error('Email required', 'Please provide a recipient email address.');
      return;
    }
    
    setShowConfig(false);
    setRunning(true);
    setCompletedSteps(new Set());
    setPdfResult(null);
    
    try {
      const pipelineArray = [pipeline.trigger, pipeline.processor, pipeline.output];
      
      // Create visual step simulation while the backend is processing
      for (let i = 0; i < pipelineArray.length; i++) {
        setActiveStep(pipelineArray[i].id);
        await new Promise(resolve => setTimeout(resolve, 800)); 
      }

      const res = await fetch('http://localhost:5000/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline: pipelineArray.map(p => p.type),
          triggerData: { url: triggerInput, email: emailInput }
        })
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Workflow execution failed');
      }

      // Mark all steps as complete visually
      setCompletedSteps(new Set(pipelineArray.map(p => p.id)));
      
      setExecutionLogs(data.log || []);
      
      if (data.pdfDataUri) {
        setPdfResult(data.pdfDataUri);
        success('Pipeline Executed', 'PDF generated successfully!');
      } else {
        success('Pipeline Executed', 'All automation steps completed successfully!');
      }

    } catch (err) {
      error('Execution Failed', err.message);
      setCompletedSteps(new Set());
    } finally {
      setActiveStep(null);
      setRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative z-10">
      
      {/* Config Modal Overlay */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a0d0b] border border-emerald-500/20 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Play className="text-emerald-400" size={20} /> Configure Run
              </h3>
              <button onClick={() => setShowConfig(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {(() => {
                const getTriggerConfig = () => {
                  switch(pipeline.trigger?.type) {
                    case 'github_ingest': return { label: 'GitHub URL', placeholder: 'https://github.com/torvalds', desc: 'Enter a public GitHub profile URL.' };
                    case 'linkedin_ingest': return { label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/williamhgates', desc: 'Enter a LinkedIn profile URL (Stealth Scraper).' };
                    case 'portfolio_ingest': return { label: 'Website / Portfolio URL', placeholder: 'https://leerob.io', desc: 'Enter a personal website or blog URL.' };
                    default: return { label: 'Trigger Input (URL)', placeholder: 'https://...', desc: 'Enter the target URL.' };
                  }
                };
                const configOpts = getTriggerConfig();
                
                return (
                  <div>
                    <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider block mb-2">{configOpts.label}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="text-emerald-500/50" size={16} />
                      </div>
                      <input
                        type="text"
                        value={triggerInput}
                        onChange={(e) => setTriggerInput(e.target.value)}
                        placeholder={configOpts.placeholder}
                        className="w-full bg-[var(--bg-deep)] border border-emerald-500/20 rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">{configOpts.desc}</p>
                  </div>
                );
              })()}

              {pipeline.output?.type === 'email' && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider block mb-2">Recipient Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-emerald-500/50" size={16} />
                    </div>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-[var(--bg-deep)] border border-emerald-500/20 rounded-xl py-3 pl-10 pr-4 text-[var(--text-primary)] text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">The generated PDF will be sent as an attachment here.</p>
                </div>
              )}
            </div>

            <Button
              onClick={runPipeline}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              Start Execution
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-emerald-500/10">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-3">
            <GitMerge className="text-[var(--color-primary)]" />
            Workflow Automation
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Design no-code AI pipelines to build professional resumes from external sources.</p>
        </div>
        <Button
          onClick={openTestConfig}
          disabled={running}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold flex items-center gap-2 py-3 px-6 rounded-2xl hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          {running ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          Test Pipeline
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Toolbox */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-tile p-6 rounded-3xl border border-emerald-500/10 space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Available Actions</h2>
            <div className="space-y-6">
              
              {Object.entries(PIPELINE_NODES).map(([category, nodes]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-bold text-emerald-500/80 uppercase tracking-wider pl-1">
                    {category}
                  </h3>
                  {nodes.map((node) => {
                    const Icon = node.icon;
                    return (
                      <div
                        key={node.id}
                        className="p-4 rounded-2xl bg-[var(--bg-surface-el)] border border-emerald-500/5 hover:border-emerald-500/10 transition-all flex flex-col space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                              <Icon size={16} />
                            </div>
                            <span className="font-bold text-[var(--text-primary)] text-sm">{node.name}</span>
                          </div>
                          <button
                            onClick={() => addNode(node.id)}
                            className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{node.desc}</p>
                      </div>
                    );
                  })}
                </div>
              ))}
              
            </div>
          </div>
        </div>

        {/* Builder Board & Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-tile p-8 rounded-3xl border border-emerald-500/10 min-h-[500px] flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(0,228,118,0.01)_0%,_transparent_70%)]">
            
            {/* Grid dot background effect */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(0, 228, 118, 0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-8">
              
              <div className="flex flex-col items-center w-full max-w-lg space-y-4">
                
                {/* SLOT 1: TRIGGER */}
                <div className="w-full flex flex-col items-center">
                  <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest mb-2">Phase 1: Data Source</div>
                  {!pipeline.trigger ? (
                    <div className="w-full max-w-sm p-6 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-[#0f1412]/50 text-center hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all group flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Plus className="text-emerald-500/40 group-hover:text-emerald-400 group-hover:scale-110 transition-all" size={24} />
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">Select a Trigger</div>
                        <div className="text-xs text-[var(--text-muted)]">Click a data source from the sidebar</div>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full max-w-sm p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                      activeStep === pipeline.trigger.id ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(0,228,118,0.15)] animate-pulse'
                        : completedSteps.has(pipeline.trigger.id) ? 'bg-emerald-500/5 border-emerald-500/20 text-[var(--text-secondary)]'
                        : 'bg-[var(--bg-surface-el)] border-emerald-500/5 text-[var(--text-primary)]'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completedSteps.has(pipeline.trigger.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {completedSteps.has(pipeline.trigger.id) ? <CheckCircle2 size={18} /> : <GitMerge size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--text-primary)]">{pipeline.trigger.name}</div>
                          <div className="text-xs text-[var(--text-muted)] capitalize">Trigger</div>
                        </div>
                      </div>
                      <button onClick={() => removeNode('trigger')} disabled={running} className="text-[var(--text-muted)] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                  <div className="relative py-2 flex justify-center">
                    <div className={`h-12 w-1 rounded-full bg-gradient-to-b transition-all ${
                      activeStep === pipeline.trigger?.id || completedSteps.has(pipeline.trigger?.id) 
                        ? 'from-emerald-500/80 to-emerald-500/20 shadow-[0_0_10px_rgba(0,228,118,0.5)]' 
                        : 'from-emerald-500/20 to-emerald-500/5'
                    }`}></div>
                    {(activeStep === pipeline.trigger?.id) && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* SLOT 2: PROCESSOR */}
                <div className="w-full flex flex-col items-center">
                  <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest mb-2">Phase 2: AI Processing</div>
                  {!pipeline.processor ? (
                    <div className="w-full max-w-sm p-6 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-[#0f1412]/50 text-center hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all group flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Plus className="text-emerald-500/40 group-hover:text-emerald-400 group-hover:scale-110 transition-all" size={24} />
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">Select an AI Processor</div>
                        <div className="text-xs text-[var(--text-muted)]">Click a processor from the sidebar</div>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full max-w-sm p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                      activeStep === pipeline.processor.id ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(0,228,118,0.15)] animate-pulse'
                        : completedSteps.has(pipeline.processor.id) ? 'bg-emerald-500/5 border-emerald-500/20 text-[var(--text-secondary)]'
                        : 'bg-[var(--bg-surface-el)] border-emerald-500/5 text-[var(--text-primary)]'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completedSteps.has(pipeline.processor.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {completedSteps.has(pipeline.processor.id) ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--text-primary)]">{pipeline.processor.name}</div>
                          <div className="text-xs text-[var(--text-muted)] capitalize">Processor</div>
                        </div>
                      </div>
                      <button onClick={() => removeNode('processor')} disabled={running} className="text-[var(--text-muted)] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                  <div className="relative py-2 flex justify-center">
                    <div className={`h-12 w-1 rounded-full bg-gradient-to-b transition-all ${
                      activeStep === pipeline.processor?.id || completedSteps.has(pipeline.processor?.id) 
                        ? 'from-emerald-500/80 to-emerald-500/20 shadow-[0_0_10px_rgba(0,228,118,0.5)]' 
                        : 'from-emerald-500/20 to-emerald-500/5'
                    }`}></div>
                    {(activeStep === pipeline.processor?.id) && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* SLOT 3: OUTPUT */}
                <div className="w-full flex flex-col items-center">
                  <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest mb-2">Phase 3: Destination</div>
                  {!pipeline.output ? (
                    <div className="w-full max-w-sm p-6 rounded-2xl border-2 border-dashed border-emerald-500/30 bg-[#0f1412]/50 text-center hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all group flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Plus className="text-emerald-500/40 group-hover:text-emerald-400 group-hover:scale-110 transition-all" size={24} />
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">Select a Destination</div>
                        <div className="text-xs text-[var(--text-muted)]">Click an output format from the sidebar</div>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full max-w-sm p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${
                      activeStep === pipeline.output.id ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(0,228,118,0.15)] animate-pulse'
                        : completedSteps.has(pipeline.output.id) ? 'bg-emerald-500/5 border-emerald-500/20 text-[var(--text-secondary)]'
                        : 'bg-[var(--bg-surface-el)] border-emerald-500/5 text-[var(--text-primary)]'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completedSteps.has(pipeline.output.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {completedSteps.has(pipeline.output.id) ? <CheckCircle2 size={18} /> : <DownloadCloud size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--text-primary)]">{pipeline.output.name}</div>
                          <div className="text-xs text-[var(--text-muted)] capitalize">Output</div>
                        </div>
                      </div>
                      <button onClick={() => removeNode('output')} disabled={running} className="text-[var(--text-muted)] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Execution Results */}
              {pdfResult && !running && (
                <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500 w-full max-w-lg">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                      <DownloadCloud size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)]">Pipeline Execution Complete</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">The workflow generated a formatted PDF document.</p>
                    </div>
                    <a
                      href={pdfResult}
                      download="workflow_generated_profile.pdf"
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-6 rounded-xl transition-colors"
                    >
                      <DownloadCloud size={16} /> Download PDF
                    </a>
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
