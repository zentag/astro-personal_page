import { db, eq, and, Ratings } from "astro:db";
export type LSType = "neutral" | "dislike" | "like";
export const updateRating = async ({
  userID,
  postID,
  likedState,
  prevLikedState,
}: {
  userID: string;
  postID: string;
  likedState: LSType;
  prevLikedState: LSType;
}) => {
  if (likedState == "neutral") {
    const record = await db
      .select()
      .from(Ratings)
      .where(and(eq(Ratings.postID, postID), eq(Ratings.userID, userID)));
    const recordExists = record.length === 0;
    if (recordExists) {
    }
  }
};
