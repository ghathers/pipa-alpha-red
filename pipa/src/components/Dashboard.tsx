import React from 'react';
import { IncidentData } from '../types';
import { Timeline } from './Timeline';
import { RCADiagram } from './RCADiagram';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, ShieldCheck, Database, FileText, Calendar, User as UserIcon, Sparkles, Download, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  incident: IncidentData;
}

export const Dashboard: React.FC<DashboardProps> = ({ incident }) => {
  return (
    <div className="space-y-8">
      {/* Header Stats (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-black text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,255,0,1)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Database className="text-[#00FF00]" size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter font-mono">{incident.incident_kpis?.systems_impacted || 'TBD'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mt-1">Systems Impacted</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <UserIcon className="text-black" size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter font-mono">{incident.incident_kpis?.accounts_compromised || 'TBD'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">Accounts Compromised</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="text-black" size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter font-mono">{incident.incident_kpis?.target_remediation_timeframe || 'TBD'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">Target Remediation</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="text-black" size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter font-mono">{incident.incident_kpis?.exfiltrated_data || 'TBD'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">Exfiltrated Data</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-red-600" size={20} />
            </div>
            <p className="text-3xl font-black tracking-tighter font-mono">{incident.incident_kpis?.financial_impact || 'TBD'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">Financial Impact</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Briefing Points (Full Width) */}
      <Card className="w-full border-2 border-black rounded-none bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,255,0,1)]">
        <CardHeader className="border-b border-white/20">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Sparkles size={14} className="text-[#00FF00]" /> Briefing Points
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#00FF00]">Executive Talking Points</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {incident.briefing_tab_data?.talking_points?.map((point, i) => (
                <div key={i} className="text-xs font-medium leading-relaxed flex gap-2">
                  <span className="text-[#00FF00]">•</span> {point}
                </div>
              ))}
              {(!incident.briefing_tab_data?.talking_points || incident.briefing_tab_data.talking_points.length === 0) && (
                <p className="text-xs opacity-50 italic">No talking points generated.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Executive Summary & Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Executive Summary */}
        <div className="lg:col-span-2">
          <Card className="h-full rounded-none border-2 border-black bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 border-b border-black mb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <FileText size={14} /> Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                {incident.executive_summary?.narrative || 'No summary available.'}
              </p>
              <div className="grid grid-cols-2 gap-6 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-black">
                  <Calendar size={14} className="text-gray-400" />
                  <span>Incident Dates: <span className="text-black font-black">{incident.executive_summary?.incident_dates || 'N/A'}</span></span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-black">
                  <UserIcon size={14} className="text-gray-400" />
                  <span>Threat Actor: <span className="text-black font-black">{incident.executive_summary?.threat_actor || 'Unknown'}</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Radar */}
        <div className="lg:col-span-1">
          <Card className="h-full border-2 border-black rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b border-black">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-600" /> Risk Radar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Security (NIST CSF 2.0)</p>
                <div className="space-y-3">
                  {incident.risk_radar?.security_risks?.map((risk, i) => (
                    <div key={i} className="border-l-2 border-black pl-3 py-1">
                      <p className="text-[9px] font-black uppercase text-black mb-1">{risk.category}</p>
                      <p className="text-[11px] font-medium leading-tight text-gray-600">{risk.summary}</p>
                    </div>
                  ))}
                  {(!incident.risk_radar?.security_risks || incident.risk_radar.security_risks.length === 0) && (
                    <p className="text-[10px] italic text-gray-400">No security risks identified.</p>
                  )}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-black/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Regulatory Risks</p>
                <div className="space-y-3">
                  {incident.risk_radar?.regulatory_risks?.map((risk, i) => (
                    <div key={i} className="border-l-2 border-blue-600 pl-3 py-1">
                      <p className="text-[9px] font-black uppercase text-blue-600 mb-1">{risk.regulation}</p>
                      <p className="text-[11px] font-medium leading-tight text-gray-600">{risk.summary}</p>
                    </div>
                  ))}
                  {(!incident.risk_radar?.regulatory_risks || incident.risk_radar.regulatory_risks.length === 0) && (
                    <p className="text-[10px] italic text-gray-400">No regulatory risks identified.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: RCA & Recovery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Root Cause Analysis */}
        <div className="lg:col-span-2">
          <section className="h-full">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-[#00FF00] border border-black" />
              Root Cause Analysis 
              <div className="flex-1 h-[1px] bg-black opacity-20" />
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {incident.root_cause_analysis?.map((rc, i) => (
                <Card key={i} className="rounded-none border-2 border-black bg-white p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black text-[#00FF00] px-2 py-1">{rc.stage}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 whitespace-pre-wrap">{rc.description}</p>
                </Card>
              ))}
              {(!incident.root_cause_analysis || incident.root_cause_analysis.length === 0) && (
                <div className="p-8 border-2 border-dashed border-black text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No RCA Findings</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recovery Timeline Tasks */}
        <div className="lg:col-span-1">
          <Card className="h-full border-2 border-black rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b border-black flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em]">
                Recovery Timeline
              </CardTitle>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-600 border border-black" />
                  <span className="text-[8px] font-black uppercase">Contain</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-600 border border-black" />
                  <span className="text-[8px] font-black uppercase">Reg</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#00FF00] border border-black" />
                  <span className="text-[8px] font-black uppercase">Rem</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                {(incident.recovery_timeline_tasks || [])
                  .sort((a, b) => (a.priority || 'P2').localeCompare(b.priority || 'P2'))
                  .map((task, i) => (
                  <div key={i} className="flex gap-4 text-sm border-b border-black/5 pb-4 last:border-0 relative">
                    <div className={`flex-shrink-0 w-8 h-8 text-[10px] flex flex-col items-center justify-center font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      task.phase === 'Containment' ? 'bg-red-600 text-white' :
                      task.phase === 'Regulatory' ? 'bg-blue-600 text-white' :
                      'bg-[#00FF00] text-black'
                    }`}>
                      {task.phase === 'Containment' ? 'C' : task.phase === 'Regulatory' ? 'Reg' : 'Rem'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold leading-tight">{task.task_description}</p>
                        <Badge variant="outline" className="rounded-none border-black text-[8px] font-black uppercase px-1 h-4">
                          {task.priority || 'P1'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Owner: {task.owner}</p>
                        <div className="flex items-center gap-1 text-[10px] font-black text-black bg-gray-100 px-2 py-0.5 border border-black/10">
                          <Calendar size={10} />
                          {task.timescale || 'TBD'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!incident.recovery_timeline_tasks || incident.recovery_timeline_tasks.length === 0) && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center py-4">No tasks defined</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: MITRE Timeline (Full Width) */}
      <div className="w-full">
        <Timeline events={incident.timeline || []} />
      </div>
    </div>
  );
};
