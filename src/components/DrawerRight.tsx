import { component$, useSignal } from "@builder.io/qwik";
import { MenuIcon } from "lucide-qwik";
export default component$(() => {
  const isOpen = useSignal(true);
  return (
    <>
      <div class="drawer drawer-end">
        <input
          id="my-drawer-4"
          type="checkbox"
          class="drawer-toggle"
          value={isOpen.value}
        />
        <div class="drawer-content">
          <label
            for="my-drawer-4"
            class="drawer-button btn btn-ghost btn-square"
          >
            <MenuIcon />
          </label>
        </div>
        <div class="drawer-side">
          <label
            for="my-drawer-4"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
});
