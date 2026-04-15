import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import { DownloadReport } from './components/DownloadReport';
import { IncidentContext } from './components/IncidentContext';
import { LandingPage } from './components/LandingPage';
import { alphaRedData } from './data/alphaRed';
import { generateIncidentPlan } from './services/gemini';
import { ContextFile, IncidentData } from './types';
import { LayoutDashboard, MessageSquare, ShieldAlert, Settings, LogOut, Database, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidentData, setIncidentData] = useState<IncidentData>(alphaRedData);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpload = (file: File) => {
    const newFile: ContextFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      status: 'Pending',
      description: `Uploaded file: ${file.name}. Pending analysis.`,
      lastUpdated: new Date().toISOString().split('T')[0],
      content: `Simulated content for ${file.name}. In a real app, this would be extracted text.`
    };
    setContextFiles(prev => [...prev, newFile]);
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    setContextFiles(prev => prev.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const handleRegenerate = async (filesToAnalyze?: ContextFile[] | React.MouseEvent) => {
    console.log("handleRegenerate triggered", { 
      hasFilesToAnalyze: !!filesToAnalyze, 
      isArray: Array.isArray(filesToAnalyze),
      contextFilesCount: contextFiles.length 
    });

    // Ensure we only use filesToAnalyze if it's actually an array of files, not a MouseEvent
    const targetFiles = Array.isArray(filesToAnalyze) ? filesToAnalyze : contextFiles;
    
    console.log("handleRegenerate targetFiles count:", targetFiles.length);
    if (targetFiles.length === 0) {
      console.warn("No files to analyze - returning early");
      return;
    }

    setIsRegenerating(true);
    console.log("Starting analysis with", targetFiles.length, "files...");
    try {
      const newPlan = await generateIncidentPlan(targetFiles);
      console.log("Plan generation successful, ID:", newPlan.id, "Name:", newPlan.name);
      
      setIncidentData(newPlan);
      setContextFiles(targetFiles.map(f => ({ ...f, status: 'Analysed' })));
      setHasChanges(false);
      setActiveTab('dashboard');
      setIsStarted(true);
      console.log("App state updated, isStarted set to true");
    } catch (error) {
      console.error("Analysis failed in handleRegenerate:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`PIPA AI analysis failed: ${errorMessage}. Please ensure your documents contain readable text and try again.`);
    } finally {
      setIsRegenerating(false);
      console.log("handleRegenerate finished");
    }
  };

  if (!isStarted) {
    return <LandingPage onStart={handleRegenerate} />;
  }

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-black overflow-hidden font-sans selection:bg-[#00FF00] selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black bg-white flex flex-col shrink-0 relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center text-white font-black italic border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,255,0,1)]">
              P
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">PIPA <span className="text-[#00FF00]">AI</span></h1>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                activeTab === 'dashboard' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,255,0,1)]' : 'text-gray-500 border-transparent hover:border-black'
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                activeTab === 'chat' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,255,0,1)]' : 'text-gray-500 border-transparent hover:border-black'
              }`}
            >
              <MessageSquare size={16} /> PIPA Assistant
            </button>
            <button 
              onClick={() => setActiveTab('context')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                activeTab === 'context' ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,255,0,1)]' : 'text-gray-500 border-transparent hover:border-black'
              }`}
            >
              <Database size={16} /> Incident Context
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-black">
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-widest text-red-600 border-2 border-transparent hover:border-red-600 transition-all"
          >
            <LogOut size={16} /> Reset Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F2F2F2] relative">
        <header className="h-20 border-b border-black bg-white flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current Incident</h2>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-[#00FF00] border border-black" />
                <span className="text-lg font-black uppercase italic tracking-tight">{incidentData.name}</span>
                <span className="text-[10px] text-gray-400 font-mono border border-gray-200 px-2 py-0.5">ID: {incidentData.id}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-64">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Remediation Coverage</p>
                <p className="text-[10px] font-mono font-black">{incidentData.coverageScore}%</p>
              </div>
              <div className="h-3 w-full bg-gray-100 border border-black rounded-none overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${incidentData.coverageScore}%` }}
                  className="h-full bg-[#00FF00]"
                />
              </div>
            </div>
            <div className="text-right border-l border-black pl-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Session Security</p>
              <p className="text-xs font-black text-green-600 uppercase italic">Stateless Mode</p>
            </div>
            <div className="border-l border-black pl-8">
              <DownloadReport incident={incidentData} />
            </div>
          </div>
        </header>
 
        <div className={`flex-1 p-8 relative ${activeTab === 'chat' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeTab === 'dashboard' ? (
                <Dashboard incident={incidentData} />
              ) : activeTab === 'chat' ? (
                <div className="h-full flex flex-col">
                  <Chat incident={incidentData} />
                </div>
              ) : (
                <IncidentContext 
                  files={contextFiles} 
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                  onRegenerate={handleRegenerate}
                  isRegenerating={isRegenerating}
                  hasChanges={hasChanges}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isRegenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-4 border-black border-t-[#00FF00]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert size={32} className="text-black" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">PIPA AI is Analyzing</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">Building your incident plan...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
