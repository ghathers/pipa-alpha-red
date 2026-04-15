export interface ContextFile {
  id: string;
  name: string;
  type: string;
  status: 'Analysed' | 'Processing' | 'Pending';
  description: string;
  lastUpdated: string;
  content?: string; // Simulated content for analysis
}

export interface IncidentTimelineEvent {
  date: string;
  time: string;
  event: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitreStage?: string; // e.g., 'Initial Access', 'Exfiltration'
  ttp?: string; // e.g., 'T1566.001 - Spearphishing Attachment'
}

export interface RootCause {
  category: string;
  finding: string;
  weakness: string;
  remediation: string;
}

export interface IncidentData {
  id: string;
  name: string;
  incident_kpis: {
    systems_impacted: string;
    accounts_compromised: string;
    target_remediation_timeframe: string;
    exfiltrated_data: string;
    financial_impact: string;
  };
  executive_summary: {
    narrative: string;
    incident_dates: string;
    threat_actor: string;
  };
  root_cause_analysis: {
    stage: string;
    description: string;
  }[];
  recovery_timeline_tasks: {
    phase: 'Containment' | 'Regulatory' | 'Remediation';
    task_description: string;
    owner: string;
    timescale: string; // e.g., "24h", "2 Weeks"
    priority: 'P0' | 'P1' | 'P2';
  }[];
  briefing_tab_data: {
    talking_points: string[];
  };
  risk_radar: {
    security_risks: { category: string; summary: string }[]; // NIST CSF 2.0 focused
    regulatory_risks: { regulation: string; summary: string }[];
  };
  timeline: IncidentTimelineEvent[]; // Keep for the MITRE visual
  coverageScore: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
