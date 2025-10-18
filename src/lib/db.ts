import { i, init, InstaQLEntity } from "@instantdb/react-native";

const APP_ID = "dd11b86f-c734-4b39-8e1e-ff4b70dbf5b1";

const schema = i.schema({
  entities: {
    users: i.entity({
      email: i.string(),
      name: i.string().optional(),
      createdAt: i.number(),
    }),
  },
});

type User = InstaQLEntity<typeof schema, "users">;

const db = init({ appId: APP_ID, schema });

export { db, schema };
export type { User };
