import { useState, useEffect } from 'react';
import { Conversation, ChatMessage } from '../types/copilot';
import copilotService from '../services/copilot.service';
import { useUIStore } from '../store';

const LOCAL_STORAGE_KEY = 'enterprise_copilot_conversations_v1';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [contextFiles, setContextFiles] = useState<string[]>(['transaction_ledger.csv', 'model_features.json']);

  // Load existing chats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setConversations(parsed);
          setActiveId(parsed[0].id);
          useUIStore.setState({ copilotStatus: 'Completed' });
        }
      } catch (err) {
        console.error('Error loading chats:', err);
      }
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: Conversation[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const createConversation = (title: string = 'New Conversation') => {
    const newChat: Conversation = {
      id: `conv-${Date.now()}`,
      title,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Hello! I am your Enterprise AI Copilot. I have mapped your active ledger structures, trained AutoML parameters, and time-series indexes.\n\nAsk me a business metric question, query a SQL string, or generate automated predictive cleaning scripts.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'Compare margins across segments',
            'Write SQL query for enterprise segments',
            'Show me a breakdown of transaction amounts'
          ]
        }
      ],
      contextFiles: [...contextFiles]
    };

    const nextList = [newChat, ...conversations];
    setConversations(nextList);
    setActiveId(newChat.id);
    saveToStorage(nextList);
    return newChat;
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
  };

  const deleteConversation = (id: string) => {
    const nextList = conversations.filter((c) => c.id !== id);
    setConversations(nextList);
    saveToStorage(nextList);

    if (activeId === id) {
      if (nextList.length > 0) {
        setActiveId(nextList[0].id);
      } else {
        setActiveId(null);
      }
    }
  };

  const addContextFile = (fileName: string) => {
    setContextFiles((prev) => {
      const next = [...prev, fileName];
      // Sync to active conversation if loaded
      if (activeId) {
        const updated = conversations.map((c) => {
          if (c.id === activeId) {
            return { ...c, contextFiles: [...(c.contextFiles || []), fileName] };
          }
          return c;
        });
        setConversations(updated);
        saveToStorage(updated);
      }
      return next;
    });
  };

  const removeContextFile = (fileName: string) => {
    setContextFiles((prev) => {
      const next = prev.filter((f) => f !== fileName);
      if (activeId) {
        const updated = conversations.map((c) => {
          if (c.id === activeId) {
            return { ...c, contextFiles: (c.contextFiles || []).filter((f) => f !== fileName) };
          }
          return c;
        });
        setConversations(updated);
        saveToStorage(updated);
      }
      return next;
    });
  };

  const sendMessage = async (content: string) => {
    let currentActiveId = activeId;
    let nextList = [...conversations];

    // If no active conversation, create one on-the-fly
    if (!currentActiveId || nextList.length === 0) {
      const newChat = createConversation(content.slice(0, 30) + '...');
      currentActiveId = newChat.id;
      nextList = [newChat];
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content,
      timestamp
    };

    const streamingMessageId = `msg-stream-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: streamingMessageId,
      role: 'assistant',
      content: '',
      timestamp,
      isStreaming: true
    };

    // Append user message and placeholder assistant message
    const updatedConversations = nextList.map((c) => {
      if (c.id === currentActiveId) {
        // Auto update title if generic
        const title = c.title === 'New Conversation' ? content.slice(0, 30) + '...' : c.title;
        return {
          ...c,
          title,
          updatedAt: timestamp,
          messages: [...c.messages, userMessage, assistantMessage]
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    saveToStorage(updatedConversations);
    setIsStreaming(true);

    try {
      await copilotService.generateStreamingResponse(content, (_chunk, full) => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === currentActiveId) {
              return {
                ...c,
                messages: c.messages.map((m) => {
                  if (m.id === streamingMessageId) {
                    return {
                      ...m,
                      content: full.content || '',
                      sql: full.sql,
                      python: full.python,
                      chart: full.chart,
                      suggestions: full.suggestions,
                    };
                  }
                  return m;
                })
              };
            }
            return c;
          })
        );
      });
    } catch (err) {
      console.error('Error generating streaming response:', err);
    } finally {
      setIsStreaming(false);
      setConversations((prev) => {
        const completed = prev.map((c) => {
          if (c.id === currentActiveId) {
            return {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id === streamingMessageId) {
                  return { ...m, isStreaming: false };
                }
                return m;
              })
            };
          }
          return c;
        });
        saveToStorage(completed);
        useUIStore.setState({ copilotStatus: 'Completed' });
        return completed;
      });
    }
  };

  const handleLikeMessage = (msgId: string, liked: boolean) => {
    if (!activeId) return;
    const updated = conversations.map((c) => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id === msgId) {
              return { ...m, liked, disliked: false };
            }
            return m;
          })
        };
      }
      return c;
    });
    setConversations(updated);
    saveToStorage(updated);
  };

  const handleDislikeMessage = (msgId: string, disliked: boolean) => {
    if (!activeId) return;
    const updated = conversations.map((c) => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id === msgId) {
              return { ...m, disliked, liked: false };
            }
            return m;
          })
        };
      }
      return c;
    });
    setConversations(updated);
    saveToStorage(updated);
  };

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  return {
    conversations,
    activeConversation,
    isStreaming,
    contextFiles,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    addContextFile,
    removeContextFile,
    handleLikeMessage,
    handleDislikeMessage,
  };
};
