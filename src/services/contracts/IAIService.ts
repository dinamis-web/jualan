export interface GenerateMessageRequest {
  recipientName: string;
  tone: 'sopan' | 'santai' | 'promo';
  contextType: string;
  offerDetails?: string;
}

export interface GenerateMessageResponse {
  message: string;
  source: 'gemini' | 'template';
}

export interface ProspectAnalysisRequest {
  prospectName: string;
  status: string;
  potential: number;
  lastActivity: string;
  notes?: string;
}

export interface ProspectAnalysisResponse {
  recommendation: string;
  suggestedAction: string;
}

export interface IAIService {
  generateFollowUpMessage(request: GenerateMessageRequest): Promise<GenerateMessageResponse>;
  analyzeProspectNextStep(request: ProspectAnalysisRequest): Promise<ProspectAnalysisResponse>;
}
