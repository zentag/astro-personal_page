import { component$, useSignal } from "@builder.io/qwik";
import { db, eq, Ratings, and } from "astro:db";
export const Likes = component$(
  ({
    likes,
    dislikes,
    id,
  }: {
    likes: number;
    dislikes: number;
    id: string;
  }) => {
    const likedState = useSignal("neutral");
    return (
      <button class="btn" onClick$={async () => {}}>
        {likes}
      </button>
    );
  },
);
