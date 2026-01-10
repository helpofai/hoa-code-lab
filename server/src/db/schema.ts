import { int, mysqlTable, serial, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 191 }).notNull().unique(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  githubToken: text('github_token'),
  githubRepoVisibility: varchar('github_repo_visibility', { length: 20 }).default('private'),
  githubAutoSync: int('github_auto_sync').default(1), // 1 for true, 0 for false
  githubDefaultBranch: varchar('github_default_branch', { length: 100 }).default('main'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = mysqlTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  userId: int('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).default('frontend'),
  githubRepo: varchar('github_repo', { length: 255 }), // user/repo-name
  githubBranch: varchar('github_branch', { length: 100 }).default('main'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});