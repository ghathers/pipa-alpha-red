import { IncidentData } from '../types';

export const alphaRedData: IncidentData = {
  id: 'PENDING',
  name: 'AlphaRed Ransomware Incident',
  incident_kpis: {
    systems_impacted: 'Pending...',
    accounts_compromised: '0',
    target_remediation_timeframe: 'TBD',
    exfiltrated_data: 'Pending...',
    financial_impact: 'Pending...',
  },
  executive_summary: {
    narrative: 'Please upload incident context documents to generate an executive summary and remediation plan.',
    incident_dates: 'Analysis Pending...',
    threat_actor: 'Analysis Pending...',
  },
  root_cause_analysis: [],
  recovery_timeline_tasks: [
    {
      phase: 'Containment',
      task_description: 'Isolate compromised servers and networks to prevent further lateral movement.',
      owner: 'SECOPS',
      timescale: '24h',
      priority: 'P0'
    },
    {
      phase: 'Remediation',
      task_description: 'Deploy server patches to remediate vulnerabilities and rebuild encrypted systems.',
      owner: 'IT INFRASTRUCTURE',
      timescale: '2 Weeks',
      priority: 'P1'
    },
    {
      phase: 'Regulatory',
      task_description: 'Prepare and submit regulatory notifications (GDPR, HIPAA) regarding data exfiltration.',
      owner: 'LEGAL AND COMPLIANCE',
      timescale: '72h',
      priority: 'P0'
    }
  ],
  briefing_tab_data: {
    talking_points: [],
  },
  risk_radar: {
    security_risks: [],
    regulatory_risks: [],
  },
  timeline: [],
  coverageScore: 0,
};
