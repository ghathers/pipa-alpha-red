import React from 'react';
import { RootCause } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Zap, Lock, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface RCADiagramProps {
  causes: RootCause[];
}

const iconMap: Record<string, any> = {
  'Identity Management': Lock,
  'Patch Management': Zap,
  'Egress Filtering': ShieldAlert,
};

export const RCADiagram: React.FC<RCADiagramProps> = ({ causes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {causes.map((cause, index) => {
        const Icon = iconMap[cause.category] || Search;
        return (
          <motion.div
            key={cause.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full rounded-none border-2 border-black bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group">
              <CardHeader className="pb-2 border-b border-black mb-4 bg-gray-50 group-hover:bg-[#00FF00] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black text-white border border-black">
                    <Icon size={18} />
                  </div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {cause.category}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Finding</p>
                  <p className="text-sm font-bold leading-tight">{cause.finding}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Weakness</p>
                  <p className="text-xs text-gray-600 leading-tight italic font-medium">"{cause.weakness}"</p>
                </div>
                <div className="pt-4 border-t-2 border-black border-dashed">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Remediation</p>
                  <p className="text-sm font-black text-black leading-tight uppercase italic">{cause.remediation}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
