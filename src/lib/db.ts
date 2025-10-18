import { i, id, init, InstaQLEntity } from '@instantdb/react-native';

const APP_ID = 'dd11b86f-c734-4b39-8e1e-ff4b70dbf5b1';

const schema = i.schema({
  entities: {
    users: i.entity({
      email: i.string(),
      name: i.string().optional(),
      createdAt: i.number(),
    }),
    tasks: i.entity({
      name: i.string(),
      description: i.string().optional(),
      cadenceType: i.string(), // 'daily', 'weekly', 'monthly', 'yearly'
      cadenceInterval: i.number(), // 1 for every day, 2 for every 2 days, etc.
      nextDueDate: i.number(), // timestamp
      createdAt: i.number(),
      updatedAt: i.number(),
      userId: i.string(), // foreign key to users
    }),
  },
});

type User = InstaQLEntity<typeof schema, 'users'>;
type Task = InstaQLEntity<typeof schema, 'tasks'>;

const db = init({ appId: APP_ID, schema });

export { db, id, schema };
export type { Task, User };

