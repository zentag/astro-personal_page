import { component$, useSignal } from "@builder.io/qwik";

export const Likes = component$(() => {
  const counter = useSignal(0);

  return (
    <button class="btn" onClick$={() => counter.value++}>
      {counter.value}
    </button>
  );
});
