import React from 'react';
import { IncidentTimelineEvent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Shield, Target, Zap, Lock, UserPlus, EyeOff, Key, Search, MoveRight, Layers, Radio, Share2, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineProps {
  events: IncidentTimelineEvent[];
}

const MITRE_STAGES = [
  { name: 'Reconnaissance', icon: Search, color: 'bg-blue-500' },
  { name: 'Resource Development', icon: Layers, color: 'bg-indigo-500' },
  { name: 'Initial Access', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Execution', icon: Target, color: 'bg-orange-500' },
  { name: 'Persistence', icon: Lock, color: 'bg-red-500' },
  { name: 'Privilege Escalation', icon: UserPlus, color: 'bg-purple-500' },
  { name: 'Defense Evasion', icon: EyeOff, color: 'bg-gray-500' },
  { name: 'Credential Access', icon: Key, color: 'bg-cyan-500' },
  { name: 'Discovery', icon: Info, color: 'bg-teal-500' },
  { name: 'Lateral Movement', icon: MoveRight, color: 'bg-emerald-500' },
  { name: 'Collection', icon: Share2, color: 'bg-green-500' },
  { name: 'Command and Control', icon: Radio, color: 'bg-pink-500' },
  { name: 'Exfiltration', icon: Share2, color: 'bg-rose-500' },
  { name: 'Impact', icon: AlertTriangle, color: 'bg-black' },
];

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  // Group events by MITRE stage
  const eventsByStage = MITRE_STAGES.reduce((acc, stage) => {
    acc[stage.name] = events.filter(e => e.mitreStage === stage.name);
    return acc;
  }, {} as Record<string, IncidentTimelineEvent[]>);

  return (
    <Card className="w-full rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b border-black">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
          <Shield size={14} className="text-[#00FF00]" />
          MITRE ATT&CK Framework Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex p-6 gap-4 min-w-max">
            {MITRE_STAGES.map((stage, idx) => {
              const stageEvents = eventsByStage[stage.name] || [];
              const hasEvents = stageEvents.length > 0;
              const Icon = stage.icon;

              return (
                <div key={stage.name} className="flex flex-col gap-4 w-[280px]">
                  {/* Stage Header */}
                  <div className={`p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 ${hasEvents ? 'bg-white' : 'bg-gray-50 opacity-40'}`}>
                    <div className={`w-8 h-8 flex items-center justify-center border border-black ${hasEvents ? stage.color + ' text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Stage {String(idx + 1).padStart(2, '0')}</p>
                      <p className="text-[10px] font-black uppercase tracking-tighter leading-tight">{stage.name}</p>
                    </div>
                  </div>

                  {/* Events in this stage */}
                  <div className="flex flex-col gap-3">
                    {hasEvents ? (
                      stageEvents.map((event, eIdx) => (
                        <motion.div
                          key={eIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: eIdx * 0.1 }}
                          className="p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,255,0,1)] relative overflow-hidden"
                        >
                          <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-black uppercase border-l border-b border-black ${
                            event.impact === 'critical' ? 'bg-red-600 text-white' :
                            event.impact === 'high' ? 'bg-orange-500 text-white' :
                            'bg-[#00FF00] text-black'
                          }`}>
                            {event.impact}
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{event.date} • {event.time}</p>
                            <h4 className="text-xs font-black uppercase italic leading-tight mb-2">{event.event}</h4>
                            {event.description && (
                              <p className="text-[10px] leading-relaxed text-gray-600 font-medium whitespace-normal">
                                {event.description}
                              </p>
                            )}
                          </div>

                          {event.ttp && (
                            <div className="mt-3 pt-3 border-t border-black border-dashed">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap size={10} className="text-[#00FF00]" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Technique</span>
                              </div>
                              <p className="text-[10px] font-black bg-black text-[#00FF00] inline-block px-2 py-0.5">
                                {event.ttp}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="h-32 border-2 border-black border-dashed bg-gray-50 flex items-center justify-center p-6 opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest text-center">No Activity Detected</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="bg-gray-100" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
