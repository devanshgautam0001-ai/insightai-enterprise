import { useState, useEffect } from 'react';
import copilotService from '../services/copilot.service';
import { BusinessInsight, RecommendationItem, SavedPrompt } from '../types/copilot';
import { useUIStore } from '../store';

export const useCopilot = () => {
  const { activeProject, activeDataset } = useUIStore();
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    if (activeProject) {
      copilotService.getDynamicInsights(String(activeProject.id), activeDataset?.id)
        .then(setInsights)
        .catch(() => {
          setInsights(copilotService.getInsights());
        });

      copilotService.getDynamicRecommendations(String(activeProject.id), activeDataset?.id)
        .then(setRecommendations)
        .catch(() => {
          setRecommendations(copilotService.getRecommendations());
        });
    } else {
      setInsights([]);
      setRecommendations([]);
    }
    setPrompts(copilotService.getSavedPrompts());
  }, [activeProject, activeDataset]);

  const addCustomPrompt = (title: string, promptText: string, category: string) => {
    const newPrompt: SavedPrompt = {
      id: `custom-pr-${Date.now()}`,
      title,
      prompt: promptText,
      category
    };
    setPrompts((prev) => [...prev, newPrompt]);
  };

  const removeCustomPrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const getExportData = (format: 'pdf' | 'pptx' | 'md' | 'html', conversation: any[]) => {
    return copilotService.exportReport(format, conversation);
  };

  return {
    insights,
    recommendations,
    prompts,
    addCustomPrompt,
    removeCustomPrompt,
    getExportData
  };
};

export default useCopilot;
