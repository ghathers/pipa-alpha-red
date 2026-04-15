import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, FileText, ArrowRight, Sparkles, Database, Lock, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContextFile } from '../types';

interface LandingPageProps {
  onStart: (files: ContextFile[]) => Promise<void>;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [files, setFiles] = useState<ContextFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (files.length + selectedFiles.length > 5) {
      alert("Maximum 5 documents allowed.");
      return;
    }

    const newFiles: ContextFile[] = await Promise.all(selectedFiles.map(async (file) => {
      let content = `This is a simulated forensic report for ${file.name}. 
      The incident involved a ransomware attack by the 'AlphaRed' group. 
      Initial access was gained via a phishing email on 2026-03-12. 
      Lateral movement was detected on 2026-03-14. 
      Data exfiltration of approximately 2.2TB of PII occurred on 2026-03-15. 
      Encryption started on 2026-03-16. 
      Remediation plan includes MFA rollout by 2026-06-01 and server patching.`;

      // Basic text extraction for txt/log files
      if (file.type === 'text/plain' || file.name.endsWith('.log') || file.name.endsWith('.txt')) {
        try {
          const text = await file.text();
          if (text && text.trim().length > 0) {
            content = text.slice(0, 6000); // Limit to 6k chars for prompt safety
          }
        } catch (err) {
          console.error("Error reading file:", file.name, err);
        }
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        status: 'Pending',
        description: `Uploaded file: ${file.name}.`,
        lastUpdated: new Date().toISOString().split('T')[0],
        content
      };
    }));

    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleStart = async () => {
    console.log("LandingPage handleStart initiated", { filesCount: files.length });
    if (files.length === 0) {
      alert("Please add at least one incident context document.");
      return;
    }
    setIsAnalyzing(true);
    try {
      console.log("Calling onStart (handleRegenerate) with files...");
      await onStart(files);
      console.log("onStart (handleRegenerate) call returned successfully");
    } catch (error) {
      console.error("Landing page onStart failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to start analysis: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
      console.log("LandingPage handleStart process completed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-black flex flex-col items-center justify-center p-6 text-center font-sans overflow-y-auto selection:bg-[#00FF00] selection:text-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full space-y-12 py-12"
      >
        <div className="space-y-4 relative">
          <div className="absolute -top-20 -left-10 opacity-10 pointer-events-none">
            <Shield size={200} strokeWidth={0.5} />
          </div>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FF00] text-black text-[10px] font-bold uppercase tracking-[0.2em] border border-black"
          >
            <Shield size={12} />
            Post-Incident Planning Assistant
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
            PIPA <span className="text-[#00FF00] stroke-black stroke-1" style={{ WebkitTextStroke: '1px black' }}>AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto font-medium leading-tight">
            Upload forensic reports, remediation plans, or debrief slides. 
            PIPA AI analyzes the context to build your post-incident plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-y border-black py-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 01</label>
              <h3 className="text-2xl font-bold uppercase italic leading-none">Upload Context</h3>
              <p className="text-sm text-gray-500">Drag and drop your incident documentation here. PIPA supports forensic logs, strategy docs, and more.</p>
            </div>
            
            <div 
              className={`border-2 border-dashed p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-gray-50 hover:bg-[#00FF00]/5 border-black`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".pdf,.pptx,.docx,.txt"
              />
              <div className="p-4 bg-black text-white rounded-full">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold uppercase text-sm">Click to Add Files</p>
                <p className="text-xs text-gray-400">PDF, DOCX, PPTX, TXT</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step 02</label>
              <h3 className="text-2xl font-bold uppercase italic leading-none">Review & Plan</h3>
              <p className="text-sm text-gray-500">Verify the uploaded documents and trigger the AI analysis to generate your single pane of glass.</p>
            </div>

            <div className="space-y-3 min-h-[150px]">
              <AnimatePresence mode="popLayout">
                {files.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded p-8 text-gray-400 italic text-sm"
                  >
                    No documents added yet
                  </motion.div>
                ) : (
                  files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="flex items-center justify-between p-3 bg-white border border-black group hover:bg-black hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-[#00FF00]" />
                        <div>
                          <p className="text-sm font-bold truncate max-w-[180px] uppercase tracking-tight">{file.name}</p>
                          <p className="text-[10px] opacity-60 font-mono uppercase">Ready for analysis</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleStart}
                disabled={isAnalyzing || files.length === 0}
                className={`w-full h-16 text-xl font-black uppercase italic tracking-tighter transition-all rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${
                  isAnalyzing ? 'bg-gray-200 text-gray-500' : 'bg-[#00FF00] text-black hover:bg-[#00FF00]'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield size={24} />
                    </motion.div>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Let's Plan
                    <ArrowRight size={24} />
                  </div>
                )}
              </Button>
              {isAnalyzing && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4 animate-pulse">
                  PIPA AI is processing your incident context...
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-12 flex items-center justify-center gap-8 opacity-30 grayscale">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest"><Lock size={14} /> Stateless</div>
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest"><Sparkles size={14} /> AI Powered</div>
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest"><FileText size={14} /> CONTEXT CURIOUS</div>
        </div>
      </motion.div>
    </div>
  );
};
