Architecture and Design Decisions: Post-Incident Planning App (PIPA)
1. Architectural Overview
The Post-Incident Planning App (PIPA) is designed to ingest highly technical forensic data and executive summaries, synthesizing them into a rigid, data-dense dashboard. The application utilizes a multimodal Retrieval-Augmented Generation (RAG) pipeline powered by the Gemini 3.1 Flash Preview model via Google AI Studio.

2. Core Design Decisions
Model Selection: The Gemini 3.1 Flash Preview was selected for its ability to execute "Pro-level" reasoning with near-instant latency. It successfully handled the "Conflict Resolution Logic" required to cross-reference the optimistic Executive Slides against the stark reality of the Forensic Report.

Structured Output (JSON): The AI's output was strictly constrained to a predefined JSON schema mapped explicitly to the visual hierarchy of the UI, ensuring discrete buckets for KPIs, Root Cause Analysis, and the Recovery Timeline.

Multimodal Grounding: By importing the Stitch PNGs back into AI Studio during the final iteration, the model gained structural awareness of the UI. This allowed it to analyze the exact visual layout of the remediation timeline table and programmatically generate missing contextual data (like a label key) required by the design.

3. Prompt Diffs & Reasoning Improvements
V1 to V2: Added truth-checking constraints. The model successfully cross-referenced the incident context, overriding the executive narrative to ensure that the incident_dates and exfiltrated_data KPIs reflected the factual forensic truth.

V2 to V3: Added the multimodal UI constraint. The model analyzed the uploaded screenshot of the dashboard showing the remediation timeline. It successfully enriched the output by inferring and appending estimated timescales, sorting the JSON array into a logical priority order, and generating a timeline_key object to explain the shorthand labels (C, R, Rem) native to the UI's compact table design.
