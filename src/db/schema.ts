import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').default('NONE').notNull(), // 'OWNER' | 'ADMIN' | 'USER' | 'NONE'
  status: text('status').default('PENDING').notNull(), // 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  approved: boolean('approved').default(false).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  provider: text('provider'),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  division: text('division').notNull(),
  memberCount: integer('member_count').default(1).notNull(),
  status: text('status').default('active').notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  workspaceId: integer('workspace_id').references(() => workspaces.id).notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const datasets = pgTable('datasets', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  size: text('size').notNull(),
  bytes: integer('bytes').default(0).notNull(),
  rows: integer('rows').default(0).notNull(),
  cols: integer('cols').default(0).notNull(),
  fileType: text('file_type').default('csv').notNull(),
  columnsData: jsonb('columns_data').notNull(), // Full JSON array of Column metrics/stats
  qualityMetrics: jsonb('quality_metrics').notNull(), // Full JSON array of Data quality metrics
  previewRows: jsonb('preview_rows').notNull(), // Sample row records
  duplicateCount: integer('duplicate_count').default(0).notNull(),
  duplicatePercentage: real('duplicate_percentage').default(0).notNull(),
  memoryUsage: text('memory_usage').notNull(),
  cleaningStatus: text('cleaning_status').default('Not Started').notNull(),
  isFeatureEngineeringCompleted: boolean('is_feature_engineering_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const trainedModels = pgTable('trained_models', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  algorithm: text('algorithm').notNull(),
  accuracy: real('accuracy').notNull(),
  targetColumn: text('target_column').notNull(),
  testSplit: integer('test_split').default(20).notNull(),
  learningRate: real('learning_rate').default(0.03).notNull(),
  metrics: jsonb('metrics').notNull(), // Complete JSON dictionary of metrics (AUC, Precision, Recall, etc)
  logs: jsonb('logs').notNull(), // Array of log lines
  predictionStatus: text('prediction_status').default('Not Started').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dashboards = pgTable('dashboards', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  widgets: jsonb('widgets').notNull(), // JSON array of widgets
  createdAt: timestamp('created_at').defaultNow(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  size: text('size').notNull(),
  content: text('content').notNull(), // Markdown or full HTML content
  createdAt: timestamp('created_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  user: one(users, { fields: [workspaces.userId], references: [users.id] }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [projects.workspaceId], references: [workspaces.id] }),
  datasets: many(datasets),
  trainedModels: many(trainedModels),
  dashboards: many(dashboards),
  reports: many(reports),
  chatMessages: many(chatMessages),
  predictions: many(predictions),
}));

export const datasetsRelations = relations(datasets, ({ one }) => ({
  project: one(projects, { fields: [datasets.projectId], references: [projects.id] }),
}));

export const trainedModelsRelations = relations(trainedModels, ({ one, many }) => ({
  project: one(projects, { fields: [trainedModels.projectId], references: [projects.id] }),
  predictions: many(predictions),
}));

export const dashboardsRelations = relations(dashboards, ({ one }) => ({
  project: one(projects, { fields: [dashboards.projectId], references: [projects.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  project: one(projects, { fields: [reports.projectId], references: [projects.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  project: one(projects, { fields: [chatMessages.projectId], references: [projects.id] }),
}));

export const predictions = pgTable('predictions', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  modelId: integer('model_id').references(() => trainedModels.id).notNull(),
  inputData: jsonb('input_data').notNull(),
  prediction: text('prediction').notNull(),
  confidence: real('confidence'),
  probabilities: jsonb('probabilities'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const predictionsRelations = relations(predictions, ({ one }) => ({
  project: one(projects, { fields: [predictions.projectId], references: [projects.id] }),
  model: one(trainedModels, { fields: [predictions.modelId], references: [trainedModels.id] }),
}));
