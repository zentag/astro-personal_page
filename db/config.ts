import { defineDb, defineTable, column } from "astro:db";

const Posts = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    likes: column.number(),
    dislikes: column.number(),
    url: column.text({ default: "" }),
  },
});

const Comments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    postID: column.text({ references: () => Posts.columns.id }),
    content: column.text(),
    author: column.text({ references: () => Users.columns.userID }),
  },
});
const Users = defineTable({
  columns: {
    userID: column.text({ primaryKey: true }),
    userName: column.text({ unique: true }),
  },
});
const Challenges = defineTable({
  columns: {
    userID: column.text({ references: () => Users.columns.userID }),
    challenge: column.text({ primaryKey: true }),
  },
});
const Passkeys = defineTable({
  columns: {
    userID: column.text({ references: () => Users.columns.userID }),
    id: column.text({ primaryKey: true }),
    publicKey: column.text(),
    counter: column.number(),
    backedUp: column.boolean(),
    transports: column.text(),
    deviceType: column.text(),
  },
});
// https://astro.build/db/config
export default defineDb({
  tables: { Posts, Comments, Users, Challenges, Passkeys },
});
