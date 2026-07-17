import { ChatMessage, BusinessInsight, RecommendationItem, SavedPrompt } from '../types/copilot';
import { api } from '../lib/api.ts';
import { useUIStore } from '../store';

class CopilotService {
  private mockInsights: BusinessInsight[] = [
    {
      id: 'ins-1',
      title: 'Q2 Revenue Elasticity Signal',
      category: 'revenue',
      description: 'Transaction amount analysis reveals Enterprise segment accounts for 68% of total volume but represents only 15% of transactions. Margin is highly elastic to bulk purchase discounts.',
      impactScore: 8,
      actionItem: 'Implement volume-tiered pricing limits for SMB models to stabilize Q3 gross margins above 12%.',
      timestamp: '2026-07-13'
    },
    {
      id: 'ins-2',
      title: 'Retention Risks on Attrition Trajectory',
      category: 'risk',
      description: 'Historical records identify high correlation between customers with session duration under 45 minutes and high churn flags. 24 active high-margin targets currently fall into this threshold.',
      impactScore: 9,
      actionItem: 'Trigger automated onboarding touchpoint sequence and offer temporary platform credits.',
      timestamp: '2026-07-13'
    },
    {
      id: 'ins-3',
      title: 'Segment Cross-Selling Opportunity',
      category: 'marketing',
      description: 'Mid-Market segments show higher-than-average retention indicators, yet are heavily underserved in volume-discount products.',
      impactScore: 7,
      actionItem: 'Launch target email campaign showcasing high-efficiency enterprise pipeline features to mid-market users.',
      timestamp: '2026-07-13'
    }
  ];

  private mockRecommendations: RecommendationItem[] = [
    {
      id: 'rec-1',
      title: 'Standardize Missing Segments',
      type: 'cleaning',
      description: 'Analyze null records inside segment structures and impute based on standard margin patterns.',
      benefit: 'Prevents predictive degradation in downstream XGBoost pipelines.'
    },
    {
      id: 'rec-2',
      title: 'Ensemble XGBoost with Ridge Stack',
      type: 'ml',
      description: 'Combine trained tree weights with secondary linear regularization models.',
      benefit: 'Lowers cross-validation residual variances by up to 4.5%.'
    },
    {
      id: 'rec-3',
      title: 'Optimize Core Retention Charts',
      type: 'visualization',
      description: 'Deploy time-series visualizations with 95% confidence intervals to identify seasonal margin dips.',
      benefit: 'Enables quick early-warning systems for executive review tables.'
    }
  ];

  private defaultPrompts: SavedPrompt[] = [
    {
      id: 'pr-1',
      title: 'Analyze Business Revenue Metrics',
      prompt: 'Provide an executive summary of current transaction amounts, including segment-wise margin averages.',
      category: 'Business Analytics'
    },
    {
      id: 'pr-2',
      title: 'Predictive Churn Diagnostics',
      prompt: 'Generate an analysis identifying the primary correlation triggers between session durations and active churn flags.',
      category: 'Machine Learning'
    },
    {
      id: 'pr-3',
      title: 'Generate SQL Query for SMBs',
      prompt: 'Write an optimized SQL query listing all Mid-Market transactions with transaction margins over 15%.',
      category: 'Database & SQL'
    },
    {
      id: 'pr-4',
      title: 'Pandas Dataframe Imputation',
      prompt: 'Draft a Python script to perform outlier detection on transaction amounts using IQR bounds and impute them.',
      category: 'Python & Pandas'
    }
  ];

  public getSavedPrompts(): SavedPrompt[] {
    return this.defaultPrompts;
  }

  public getInsights(): BusinessInsight[] {
    return this.mockInsights;
  }

  public getRecommendations(): RecommendationItem[] {
    return this.mockRecommendations;
  }

  public async getDynamicInsights(projectId: string, datasetId?: string): Promise<BusinessInsight[]> {
    try {
      const res = await api.post('/api/copilot/insights', { projectId, datasetId });
      return res.insights || this.mockInsights;
    } catch (err) {
      return this.mockInsights;
    }
  }

  public async getDynamicRecommendations(projectId: string, datasetId?: string): Promise<RecommendationItem[]> {
    try {
      const res = await api.post('/api/copilot/recommendations', { projectId, datasetId });
      return res.recommendations || this.mockRecommendations;
    } catch (err) {
      return this.mockRecommendations;
    }
  }

  public async generateStreamingResponse(
    userPrompt: string,
    onChunk: (chunk: string, completeMessage: Partial<ChatMessage>) => void
  ): Promise<void> {
    const activeProject = useUIStore.getState().activeProject;
    const activeDataset = useUIStore.getState().activeDataset;

    try {
      const response = await api.post('/api/copilot', {
        prompt: userPrompt,
        projectId: activeProject?.id,
        datasetId: activeDataset?.id
      });

      const fullResponse = {
        content: response.content || "Completed custom intelligence diagnostic summary.",
        sql: response.sql,
        python: response.python,
        chart: response.chart,
        suggestions: response.suggestions || ['Generate SQL queries', 'Decompose seasonal trends']
      };

      // Stream the word-by-word response on the client to preserve the native streaming typing effect smoothly!
      const words = fullResponse.content.split(' ');
      let currentContent = '';
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentContent += (i === 0 ? '' : ' ') + words[i];
        onChunk(words[i] + ' ', {
          content: currentContent,
          sql: i === words.length - 1 ? fullResponse.sql : undefined,
          python: i === words.length - 1 ? fullResponse.python : undefined,
          chart: i === words.length - 1 ? fullResponse.chart : undefined,
          suggestions: i === words.length - 1 ? fullResponse.suggestions : undefined,
        });
      }
    } catch (err) {
      console.error("Copilot real API call failed:", err);
      onChunk("Sorry, I encountered an issue reaching the Gemini analytics engine. Please ensure your cloud environment is properly initialized.", {
        content: "Sorry, I encountered an issue reaching the Gemini analytics engine. Please check that GEMINI_API_KEY is configured in your project settings."
      });
    }
  }

  public exportReport(format: 'pdf' | 'pptx' | 'md' | 'html', conversation: ChatMessage[]): string {
    const title = 'AI Copilot Business Analytics Report';
    const date = new Date().toLocaleDateString();
    
    let content = '';

    if (format === 'md') {
      content = `# ${title}\n*Generated on: ${date}*\n\n---\n\n`;
      conversation.forEach((msg) => {
        content += `### **${msg.role.toUpperCase()}** (${msg.timestamp})\n\n${msg.content}\n\n`;
        if (msg.sql) {
          content += `\`\`\`sql\n${msg.sql}\n\`\`\`\n\n`;
        }
        if (msg.python) {
          content += `\`\`\`python\n${msg.python}\n\`\`\`\n\n`;
        }
      });
    } else if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; background: #09090b; color: #f4f4f5; }
    h1 { color: #a855f7; border-bottom: 1px solid #27272a; padding-bottom: 10px; }
    .msg { margin: 20px 0; padding: 20px; background: #18181b; border-radius: 12px; border: 1px solid #27272a; }
    .role { font-weight: bold; font-family: monospace; text-transform: uppercase; margin-bottom: 8px; color: #d4d4d8; }
    pre { background: #09090b; padding: 15px; border-radius: 8px; border: 1px solid #27272a; overflow-x: auto; color: #a855f7; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Date: ${date}</p>
  <div>`;
      conversation.forEach((msg) => {
        content += `
    <div class="msg">
      <div class="role">${msg.role}</div>
      <div>${msg.content.replace(/\n/g, '<br/>')}</div>`;
        if (msg.sql) {
          content += `<pre><code>${msg.sql}</code></pre>`;
        }
        if (msg.python) {
          content += `<pre><code>${msg.python}</code></pre>`;
        }
        content += `</div>`;
      });
      content += `
  </div>
</body>
</html>`;
    } else {
      content = `--- ${format.toUpperCase()} EXPORTED SESSION ---\nTitle: ${title}\nGenerated On: ${date}\nTotal Messages: ${conversation.length}\n`;
      conversation.forEach((msg) => {
        content += `[${msg.role}] ${msg.content}\n`;
      });
    }

    return content;
  }
}

export default new CopilotService();
