import { create } from 'zustand';
import { Dataset, TrainedModel, SystemNotification, Workspace, Message } from '../types';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface UIState {
  currentView: string;
  isSidebarCollapsed: boolean;
  activeWorkspace: Workspace | null;
  isWorkspaceDropdownOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  showNotifications: boolean;
  isCopilotOpen: boolean;
  isLoggedIn: boolean;
  userEmail: string;
  userRole: string;
  apiKeyMasked: string;
  showApiKey: boolean;
  outlierThreshold: number;
  learningRate: number;
  targetColumn: string;
  testSplit: number;
  isTraining: boolean;
  trainingProgress: number;
  trainingLogs: string[];
  chatMessages: Message[];
  chatInput: string;
  isAiLoading: boolean;
  activeDataset: Dataset | null;
  trainedModel: TrainedModel | null;
  notifications: SystemNotification[];
  workspaces: Workspace[];

  // Project state manager fields
  activeProject: Project | null;
  projects: Project[];
  datasetsTab: string;
  modelsTab: string;
  isProfilingVisited: boolean;
  isQualityVisited: boolean;
  isEdaVisited: boolean;
  isEvaluationVisited: boolean;
  cleaningStatus: 'Not Started' | 'In Progress' | 'Completed';
  isFeatureEngineeringCompleted: boolean;
  predictionStatus: 'Not Started' | 'In Progress' | 'Completed';
  dashboardStatus: 'Not Started' | 'In Progress' | 'Completed';
  copilotStatus: 'Not Started' | 'In Progress' | 'Completed';
  reportStatus: 'Not Started' | 'In Progress' | 'Completed';

  // Actions
  setView: (view: string) => void;
  toggleSidebar: () => void;
  setWorkspace: (workspace: Workspace | null) => void;
  setWorkspaceDropdownOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setShowNotifications: (show: boolean) => void;
  setCopilotOpen: (open: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setUserEmail: (email: string) => void;
  setOutlierThreshold: (threshold: number) => void;
  setLearningRate: (rate: number) => void;
  setTargetColumn: (column: string) => void;
  setTestSplit: (split: number) => void;
  setTraining: (isTraining: boolean) => void;
  setTrainingProgress: (progress: number) => void;
  addTrainingLog: (log: string) => void;
  setTrainingLogs: (logs: string[]) => void;
  setChatMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setChatInput: (input: string) => void;
  setAiLoading: (loading: boolean) => void;
  setActiveDataset: (dataset: Dataset | null) => void;
  setTrainedModel: (model: TrainedModel | null) => void;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsAsRead: () => void;

  // Project state manager actions
  setActiveProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  setDatasetsTab: (tab: string) => void;
  setModelsTab: (tab: string) => void;
  setProfilingVisited: (visited: boolean) => void;
  setQualityVisited: (visited: boolean) => void;
  setEdaVisited: (visited: boolean) => void;
  setEvaluationVisited: (visited: boolean) => void;
  setCleaningStatus: (status: 'Not Started' | 'In Progress' | 'Completed') => void;
  setFeatureEngineeringCompleted: (completed: boolean) => void;
  setPredictionStatus: (status: 'Not Started' | 'In Progress' | 'Completed') => void;
  setDashboardStatus: (status: 'Not Started' | 'In Progress' | 'Completed') => void;
  setCopilotStatus: (status: 'Not Started' | 'In Progress' | 'Completed') => void;
  setReportStatus: (status: 'Not Started' | 'In Progress' | 'Completed') => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentView: 'landing',
  isSidebarCollapsed: false,
  activeWorkspace: null,
  isWorkspaceDropdownOpen: false,
  isSearchOpen: false,
  searchQuery: '',
  showNotifications: false,
  isCopilotOpen: false,
  isLoggedIn: false,
  userEmail: 'devanshgautam0001@gmail.com',
  userRole: 'USER',
  apiKeyMasked: '••••••••••••••••••••••••••••••••',
  showApiKey: false,
  outlierThreshold: 2.5,
  learningRate: 0.03,
  targetColumn: 'churn_flag',
  testSplit: 20,
  isTraining: false,
  trainingProgress: 0,
  trainingLogs: [],
  chatMessages: [
    {
      id: 'initial',
      role: 'assistant',
      content: 'Welcome to InsightAI Enterprise Copilot. I am securely grounded in your loaded workspace. Ask me any strategic analysis or modeling question.',
      timestamp: 'Just now'
    }
  ],
  chatInput: '',
  isAiLoading: false,
  activeDataset: null,
  trainedModel: null,
  notifications: [],
  workspaces: [],

  // Project state manager defaults
  activeProject: null,
  projects: [],
  datasetsTab: 'upload',
  modelsTab: 'dashboard',
  isProfilingVisited: false,
  isQualityVisited: false,
  isEdaVisited: false,
  isEvaluationVisited: false,
  cleaningStatus: 'Not Started',
  isFeatureEngineeringCompleted: false,
  predictionStatus: 'Not Started',
  dashboardStatus: 'Not Started',
  copilotStatus: 'Not Started',
  reportStatus: 'Not Started',

  setView: (currentView) => set({ currentView }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  setWorkspaceDropdownOpen: (isWorkspaceDropdownOpen) => set({ isWorkspaceDropdownOpen }),
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setShowNotifications: (showNotifications) => set({ showNotifications }),
  setCopilotOpen: (isCopilotOpen) => set({ isCopilotOpen }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setUserEmail: (userEmail) => set({ userEmail }),
  setOutlierThreshold: (outlierThreshold) => set({ outlierThreshold }),
  setLearningRate: (learningRate) => set({ learningRate }),
  setTargetColumn: (targetColumn) => set({ targetColumn }),
  setTestSplit: (testSplit) => set({ testSplit }),
  setTraining: (isTraining) => set({ isTraining }),
  setTrainingProgress: (trainingProgress) => set({ trainingProgress }),
  addTrainingLog: (log) => set((state) => ({ trainingLogs: [...state.trainingLogs, log] })),
  setTrainingLogs: (trainingLogs) => set({ trainingLogs }),
  setChatMessages: (arg) => set((state) => ({
    chatMessages: typeof arg === 'function' ? arg(state.chatMessages) : arg
  })),
  setChatInput: (chatInput) => set({ chatInput }),
  setAiLoading: (isAiLoading) => set({ isAiLoading }),
  setActiveDataset: (activeDataset) => set({ activeDataset }),
  setTrainedModel: (trainedModel) => set({ trainedModel }),
  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: Math.random().toString(),
        timestamp: 'Just now',
        read: false
      },
      ...state.notifications
    ]
  })),
  markNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  // Project state manager actions
  setActiveProject: (activeProject) => set({ activeProject }),
  setProjects: (projects) => set({ projects }),
  setDatasetsTab: (datasetsTab) => set({ datasetsTab }),
  setModelsTab: (modelsTab) => set({ modelsTab }),
  setProfilingVisited: (isProfilingVisited) => set({ isProfilingVisited }),
  setQualityVisited: (isQualityVisited) => set({ isQualityVisited }),
  setEdaVisited: (isEdaVisited) => set({ isEdaVisited }),
  setEvaluationVisited: (isEvaluationVisited) => set({ isEvaluationVisited }),
  setCleaningStatus: (cleaningStatus) => set({ cleaningStatus }),
  setFeatureEngineeringCompleted: (isFeatureEngineeringCompleted) => set({ isFeatureEngineeringCompleted }),
  setPredictionStatus: (predictionStatus) => set({ predictionStatus }),
  setDashboardStatus: (dashboardStatus) => set({ dashboardStatus }),
  setCopilotStatus: (copilotStatus) => set({ copilotStatus }),
  setReportStatus: (reportStatus) => set({ reportStatus })
}));
