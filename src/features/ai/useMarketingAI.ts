import { useState, useCallback } from 'react';
import { aiService } from '../../services';

export function useMarketingAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSource, setGenerationSource] = useState<'gemini' | 'template' | null>(null);

  const generateMessage = useCallback(
    async (params: {
      recipientName: string;
      tone: 'sopan' | 'santai' | 'promo';
      contextType: string;
      offerDetails?: string;
    }) => {
      setIsGenerating(true);
      try {
        const res = await aiService.generateFollowUpMessage(params);
        setGenerationSource(res.source);
        return res.message;
      } catch (err) {
        console.error('Marketing AI generation failed:', err);
        return '';
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    generateMessage,
    isGenerating,
    generationSource,
  };
}
