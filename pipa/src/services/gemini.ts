import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Message, IncidentData, ContextFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function checkApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Please add it to your environment variables.");
  }
}

const SYSTEM_PROMPT = `You are PIPA (Post-Incident Planning Assistant), a friendly post-incident support agent.
Your goal is to support security leadership and management in the post-incident planning process.
You must analyze incident context (forensic reports, remediation plans, debrief slides) to provide a single pane of glass dashboard.

REGULATORY SCOPE:
You must specifically look for risks and non-compliance across:
- GDPR (General Data Protection Regulation)
- NIS2 (Network and Information Systems Directive 2)
- HIPAA (Health Insurance Portability and Accountability Act)
- SOC2 (Service Organization Control 2)
- PCI DSS (Payment Card Industry Data Security Standard)

Be concise, professional, and supportive. Help the user understand root causes and amend their recovery plans.
GAP ANALYSIS & EXPERT INFERENCE:
If the provided incident context has gaps in the Root Cause Analysis (RCA) or the proposed Remediation Plan, you MUST use your expert security knowledge to infer likely root causes and propose industry-standard remediation steps. 
- Clearly identify inferred findings (e.g., "Inferred: [Finding Name]").
- Ensure proposed remediation steps are actionable and relevant to the incident type.
- Do NOT hallucinate dates (keep strict date validation), but DO provide expert analysis where technical details are missing.`;

export async function getPipaResponse(messages: Message[], incidentContext: IncidentData) {
  checkApiKey();
  const model = "gemini-3.1-pro-preview";
  
  console.log("PIPA Chat Request:", { messages, context: incidentContext.id });
  
  const contextString = `
Incident ID: ${incidentContext.id}
KPIs: ${JSON.stringify(incidentContext.incident_kpis)}
Executive Summary: ${JSON.stringify(incidentContext.executive_summary)}
Root Cause Analysis: ${JSON.stringify(incidentContext.root_cause_analysis)}
Recovery Tasks: ${JSON.stringify(incidentContext.recovery_timeline_tasks)}
Briefing Data: ${JSON.stringify(incidentContext.briefing_tab_data)}
Timeline: ${JSON.stringify(incidentContext.timeline)}
`;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT + "\n\nCURRENT INCIDENT CONTEXT:\n" + contextString,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "There was an error connecting to PIPA. Please check your API key.";
  }
}

export async function generateIncidentPlan(files: ContextFile[]): Promise<IncidentData> {
  checkApiKey();
  // Using Gemini 3.1 Pro for high-fidelity analysis
  const model = "gemini-3.1-pro-preview";
  
  console.log("Generating Incident Plan for files:", files.map(f => f.name));
  
  const fileDescriptions = files.map(f => `File: ${f.name}\nDescription: ${f.description}\nContent Snippet: ${f.content || "No content provided"}`).join("\n\n");

  const prompt = `Based on the following incident context files, generate a comprehensive post-incident plan in JSON format.
Include a descriptive name for the incident, KPIs, executive summary, root cause analysis, recovery timeline tasks, and briefing data.

CRITICAL INSTRUCTIONS:
0. STRATEGIC DEPTH: The "executive_summary.narrative" and "root_cause_analysis" descriptions MUST be detailed and comprehensive (approx 300-500 words total for the narrative). 
   - EXECUTIVE SUMMARY: Provide a multi-paragraph narrative. Paragraph 1: Business impact and operational disruption. Paragraph 2: Strategic response actions taken. Paragraph 3: Key decisions required from leadership to finalize recovery and harden posture.
   - ROOT CAUSE ANALYSIS: For each stage, provide a detailed technical explanation of the failure, the specific vulnerability exploited, and the strategic decision or policy change required to prevent recurrence.
   - NOTE: Be detailed but avoid repetitive filler text to stay within token limits.
1. INCIDENT NAME: Generate a short, descriptive name for the incident (e.g., "AlphaRed Ransomware Attack", "Q3 Data Breach").
2. STRICT DATE VALIDATION: Extract ALL dates (incident start, incident end, timeline events, and remediation deadlines) ONLY from the provided documents. 
   - DO NOT use the current date.
   - DO NOT hallucinate dates.
   - DO NOT use placeholder dates like "2026-01-01" unless they are explicitly written in the files.
    - If a specific date (e.g., incident start/end) is NOT mentioned in the documents, return "TBD" for that field.
3. FORENSIC PRECISION: You MUST extract specific numbers and metrics from the forensic reports.
   - For "incident_kpis.accounts_compromised", look for specific record counts (e.g., "450,000 records").
   - For "incident_kpis.exfiltrated_data", look for specific sizes (e.g., "2.2TB PII").
   - For "incident_kpis.financial_impact", look for direct and projected costs (e.g., "$1.2M Direct / $4.5M Projected").
   - For "incident_kpis.systems_impacted", look for specific percentages or cluster names (e.g., "40% of Operational DBs").
4. TARGET REMEDIATION ESTIMATION: For "incident_kpis.target_remediation_timeframe", do NOT just look for a date in the context. Instead, ANALYZE the scale and complexity of the proposed recovery tasks and ESTIMATE a feasible completion timeframe (e.g., "6 Months", "2026-12-15"). Provide a realistic timeframe based on industry standards for the actions required.
5. FORENSIC TRUTH: For "executive_summary.incident_dates" and "incident_kpis.exfiltrated_data", you MUST cross-reference all provided documents to ensure these fields reflect the absolute forensic truth found in the context. If multiple files provide conflicting data, prioritize the most recent forensic report or the one with the highest level of technical detail.
6. GAP ANALYSIS: If the uploaded documents lack a clear Root Cause Analysis, Recovery Plan, or Executive Summary, use your security expertise to create a comprehensive and realistic set of findings and steps based on the incident type described. Clearly identify these as expert inferences where applicable.
7. MITRE ATT&CK TIMELINE: The "timeline" MUST be structured according to the MITRE ATT&CK attack path. 
    - Map incident activities to phases: Reconnaissance, Resource Development, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, and Impact.
    - For each phase, identify the specific activity, date, and TTP from the context. Use YYYY-MM-DD format for dates.
    - The "mitreStage" field should be the phase name.
    - The "ttp" field should include the MITRE TTP ID and name if identifiable. If no specific TTP is identified or inferred, leave the "ttp" field as an empty string.
    - If no context is identified for a specific MITRE ATT&CK phase and no inference can be made, set the "event" to the phase name, but leave the "ttp" and "description" fields blank (empty string).
8. KPI SUCCINCTNESS: The "incident_kpis" values MUST be extremely succinct. Use only a few words or numbers (e.g., "450,000 records", "2.2TB", "$1.2M", "40% DBs", "6 Months"). Do NOT provide full sentences or long descriptions in these fields.

FILES:
${fileDescriptions}

Return ONLY the JSON object matching the IncidentData interface.`;

  try {
    console.log("Calling Gemini API for plan generation...");
    
    // Add a longer timeout to prevent stalling (240s)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("PIPA AI is taking longer than expected. This can happen with complex documents. Please try again or use fewer files.")), 240000)
    );

    const startTime = Date.now();
    const apiCall = ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
        responseSchema: {
          type: Type.OBJECT,
          required: ["id", "name", "incident_kpis", "executive_summary", "root_cause_analysis", "recovery_timeline_tasks", "briefing_tab_data", "risk_radar", "timeline", "coverageScore"],
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING, description: "Descriptive name for the incident" },
            incident_kpis: {
              type: Type.OBJECT,
              required: ["systems_impacted", "accounts_compromised", "target_remediation_timeframe", "exfiltrated_data", "financial_impact"],
              properties: {
                systems_impacted: { type: Type.STRING, description: "Succinct metric (e.g., '40% DBs')" },
                accounts_compromised: { type: Type.STRING, description: "Succinct metric (e.g., '450k records')" },
                target_remediation_timeframe: { type: Type.STRING, description: "Succinct timeframe (e.g., '6 Months')" },
                exfiltrated_data: { type: Type.STRING, description: "Succinct size (e.g., '2.2TB')" },
                financial_impact: { type: Type.STRING, description: "Succinct cost (e.g., '$1.2M')" },
              }
            },
            executive_summary: {
              type: Type.OBJECT,
              required: ["narrative", "incident_dates", "threat_actor"],
              properties: {
                narrative: { type: Type.STRING },
                incident_dates: { type: Type.STRING },
                threat_actor: { type: Type.STRING },
              }
            },
            root_cause_analysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["stage", "description"],
                properties: {
                  stage: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            recovery_timeline_tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["phase", "task_description", "owner", "timescale", "priority"],
                properties: {
                  phase: { type: Type.STRING, enum: ['Containment', 'Regulatory', 'Remediation'] },
                  task_description: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  timescale: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['P0', 'P1', 'P2'] },
                }
              }
            },
            briefing_tab_data: {
              type: Type.OBJECT,
              properties: {
                talking_points: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            },
            risk_radar: {
              type: Type.OBJECT,
              required: ["security_risks", "regulatory_risks"],
              properties: {
                security_risks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["category", "summary"],
                    properties: {
                      category: { type: Type.STRING, description: "NIST CSF 2.0 Category (e.g., Protect, Detect)" },
                      summary: { type: Type.STRING }
                    }
                  }
                },
                regulatory_risks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["regulation", "summary"],
                    properties: {
                      regulation: { type: Type.STRING, description: "Regulation Name (e.g., GDPR, HIPAA)" },
                      summary: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["date", "time", "event", "impact", "description", "mitreStage", "ttp"],
                properties: {
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  event: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
                  description: { type: Type.STRING },
                  mitreStage: { type: Type.STRING },
                  ttp: { type: Type.STRING },
                }
              }
            },
            coverageScore: { type: Type.NUMBER }
          }
        }
      }
    });

    const response = await Promise.race([apiCall, timeoutPromise]) as any;
    const duration = Date.now() - startTime;
    console.log(`Gemini API response received in ${duration}ms`);
    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      throw new Error("Invalid JSON response from PIPA AI");
    }
  } catch (error) {
    console.error("Plan Generation Error:", error);
    throw error;
  }
}
