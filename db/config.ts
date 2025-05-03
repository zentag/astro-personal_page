import { defineDb, defineTable, column } from "astro:db";

const Posts = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    file_name: column.text(),
    likes: column.number(),
    dislikes: column.number(),
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
    userName: column.text(),
  },
});
const Challenges = defineTable({
  columns: {
    userID: column.text({ references: () => Users.columns.userID }),
    challenge: column.text({ primaryKey: true }),
  },
});
// https://astro.build/db/config
export default defineDb({
  tables: { Posts, Comments, Users, Challenges },
});
