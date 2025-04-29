import { defineDb, defineTable, column } from "astro:db";

const Posts = defineTable({
  columns: {
    file_name: column.text({ primaryKey: true }),
    likes: column.number(),
    dislikes: column.number(),
  },
});

const Comments = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    postName: column.text({ references: () => Posts.columns.file_name }),
    content: column.text(),
    author: column.text(),
  },
});
// https://astro.build/db/config
export default defineDb({
  tables: { Posts, Comments },
});
