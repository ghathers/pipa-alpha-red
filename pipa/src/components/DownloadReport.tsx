import React, { useState, useRef, useEffect } from 'react';
import { Download, FileCode, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IncidentData } from '../types';

interface DownloadReportProps {
  incident: IncidentData;
}

export const DownloadReport: React.FC<DownloadReportProps> = ({ incident }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateMarkdown = () => {
    return `# PIPA EXECUTIVE SUMMARY REPORT
**Generated:** ${new Date().toLocaleDateString()}
**Incident ID:** ${incident.id || 'N/A'}
**Duration:** ${incident.executive_summary?.incident_dates || 'N/A'}
**Threat Actor:** ${incident.executive_summary?.threat_actor || 'Unknown'}

## EXECUTIVE SUMMARY
${incident.executive_summary?.narrative || 'No summary available.'}

## IMPACT ASSESSMENT (KPIs)
- **Systems Impacted:** ${incident.incident_kpis?.systems_impacted || 'TBD'}
- **Accounts Compromised:** ${incident.incident_kpis?.accounts_compromised || 'TBD'}
- **Data Exfiltrated:** ${incident.incident_kpis?.exfiltrated_data || 'TBD'}
- **Target Remediation:** ${incident.incident_kpis?.target_remediation_timeframe || 'TBD'}

## ROOT CAUSE ANALYSIS
${incident.root_cause_analysis?.map(rc => `### ${rc.stage}\n${rc.description}`).join('\n\n') || 'No RCA data available.'}

## RECOVERY TIMELINE TASKS
${incident.recovery_timeline_tasks?.map(task => `- **[${task.phase}]** ${task.task_description} *(Owner: ${task.owner})*`).join('\n') || 'No recovery tasks defined.'}

## EXECUTIVE TALKING POINTS
${incident.briefing_tab_data?.talking_points?.map(tp => `- ${tp}`).join('\n') || 'No talking points available.'}

## RISK RADAR (SECURITY & REGULATORY)
### SECURITY RISKS (NIST CSF 2.0)
${incident.risk_radar?.security_risks?.map(r => `- **[${r.category}]** ${r.summary}`).join('\n') || 'No security risks identified.'}

### REGULATORY RISKS
${incident.risk_radar?.regulatory_risks?.map(r => `- **[${r.regulation}]** ${r.summary}`).join('\n') || 'No regulatory risks identified.'}

---
**ROOT TO REMEDIATION COVERAGE:** ${incident.coverageScore || 0}%
*CONFIDENTIAL - PIPA ASSISTANT INTERNAL REPORT*
`;
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PIPA Report - ${incident.name || incident.id}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1, h2, h3 { color: #000; border-bottom: 2px solid #000; padding-bottom: 0.5rem; }
        h3 { border-bottom: 1px solid #ccc; }
        .meta { background: #f4f4f4; padding: 1rem; border-left: 4px solid #000; margin-bottom: 2rem; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .kpi-card { background: #000; color: #fff; padding: 1rem; border-radius: 4px; }
        .kpi-card.highlight { background: #00ff00; color: #000; }
        .kpi-value { font-size: 1.5rem; font-weight: bold; font-family: monospace; }
        .kpi-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; }
        ul { padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        .footer { margin-top: 3rem; padding-top: 1rem; border-top: 2px solid #000; font-size: 0.8rem; text-align: center; font-weight: bold; }
    </style>
</head>
<body>
    <h1>PIPA EXECUTIVE SUMMARY REPORT</h1>
    <div class="meta">
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Incident ID:</strong> ${incident.id || 'N/A'}</p>
        <p><strong>Duration:</strong> ${incident.executive_summary?.incident_dates || 'N/A'}</p>
        <p><strong>Threat Actor:</strong> ${incident.executive_summary?.threat_actor || 'Unknown'}</p>
    </div>

    <h2>EXECUTIVE SUMMARY</h2>
    <p>${incident.executive_summary?.narrative || 'No summary available.'}</p>

    <h2>IMPACT ASSESSMENT (KPIs)</h2>
    <div class="kpi-grid">
        <div class="kpi-card highlight">
            <div class="kpi-value">${incident.incident_kpis?.systems_impacted || 'TBD'}</div>
            <div class="kpi-label">Systems Impacted</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${incident.incident_kpis?.accounts_compromised || 'TBD'}</div>
            <div class="kpi-label">Accounts Compromised</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${incident.incident_kpis?.exfiltrated_data || 'TBD'}</div>
            <div class="kpi-label">Data Exfiltrated</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-value">${incident.incident_kpis?.target_remediation_timeframe || 'TBD'}</div>
            <div class="kpi-label">Target Remediation</div>
        </div>
    </div>

    <h2>ROOT CAUSE ANALYSIS</h2>
    ${incident.root_cause_analysis?.map(rc => `<h3>${rc.stage}</h3><p>${rc.description}</p>`).join('') || '<p>No RCA data available.</p>'}

    <h2>RECOVERY TIMELINE TASKS</h2>
    <ul>
    ${incident.recovery_timeline_tasks?.map(task => `<li><strong>[${task.phase}]</strong> ${task.task_description} <em>(Owner: ${task.owner})</em></li>`).join('') || '<li>No recovery tasks defined.</li>'}
    </ul>

    <h2>EXECUTIVE TALKING POINTS</h2>
    <ul>
    ${incident.briefing_tab_data?.talking_points?.map(tp => `<li>${tp}</li>`).join('') || '<li>No talking points available.</li>'}
    </ul>

    <h2>RISK RADAR (SECURITY & REGULATORY)</h2>
    <h3>SECURITY RISKS (NIST CSF 2.0)</h3>
    <ul>
    ${incident.risk_radar?.security_risks?.map(r => `<li><strong>[${r.category}]</strong> ${r.summary}</li>`).join('') || '<li>No security risks identified.</li>'}
    </ul>

    <h3>REGULATORY RISKS</h3>
    <ul>
    ${incident.risk_radar?.regulatory_risks?.map(r => `<li><strong>[${r.regulation}]</strong> ${r.summary}</li>`).join('') || '<li>No regulatory risks identified.</li>'}
    </ul>

    <div class="footer">
        <p>ROOT TO REMEDIATION COVERAGE: ${incident.coverageScore || 0}%</p>
        <p>CONFIDENTIAL - PIPA ASSISTANT INTERNAL REPORT</p>
    </div>
</body>
</html>`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 px-4 text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-none hover:bg-black hover:text-white transition-all gap-2 flex items-center bg-white text-black`}
      >
        <Download size={14} /> Download my PIPA report <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col">
          <button 
            onClick={() => downloadFile(generateHTML(), `PIPA_Report_${incident.id || 'export'}.html`, 'text/html')}
            className="flex items-center gap-3 px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 border-b border-black transition-colors"
          >
            <FileCode size={14} className="text-blue-600" /> 
            <div>
              <span>HTML Format</span>
              <span className="block text-[8px] text-gray-500 normal-case tracking-normal">Best for human reading</span>
            </div>
          </button>
          <button 
            onClick={() => downloadFile(generateMarkdown(), `PIPA_Report_${incident.id || 'export'}.md`, 'text/markdown')}
            className="flex items-center gap-3 px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
          >
            <FileText size={14} className="text-green-600" /> 
            <div>
              <span>Markdown Format</span>
              <span className="block text-[8px] text-gray-500 normal-case tracking-normal">Best for AI agents</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
