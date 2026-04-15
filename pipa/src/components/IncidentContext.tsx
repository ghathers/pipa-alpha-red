import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, FileType, Clock, CheckCircle2, Trash2, RefreshCw, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { ContextFile } from '../types';

interface IncidentContextProps {
  files: ContextFile[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  hasChanges: boolean;
}

export const IncidentContext: React.FC<IncidentContextProps> = ({ 
  files, 
  onUpload, 
  onDelete, 
  onRegenerate,
  isRegenerating,
  hasChanges
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase italic">Incident Context</h2>
          <p className="text-sm text-muted-foreground">Manage and view the source documents being analysed by PIPA.</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button
                onClick={() => onRegenerate()}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-all shadow-lg shadow-black/20"
              >
                <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
                {isRegenerating ? 'Updating...' : 'Update Plan'}
              </button>
            </motion.div>
          )}
          <Badge variant="outline" className="px-4 py-1 border-black font-bold">
            {files.length} Documents Loaded
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:border-black transition-colors group relative">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                    <FileType size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg">{file.name}</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onDelete(file.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        {file.status === 'Analysed' ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none flex gap-1 items-center">
                            <CheckCircle2 size={12} /> Analysed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none flex gap-1 items-center">
                            <Clock size={12} /> {file.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={12} /> {file.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Updated {file.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.pptx,.docx,.txt"
      />

      <Card 
        className="bg-gray-50 border-dashed border-2 border-gray-300 hover:border-black transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Upload className="text-gray-400" />
          </div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Add New Context</h4>
          <p className="text-xs text-muted-foreground mb-4">Upload PDF, PPTX, or DOCX files to expand the analysis.</p>
          <button className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors">
            Upload Files
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
