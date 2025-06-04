import { defineMiddleware } from "astro:middleware";
import { actions } from "astro:actions";
export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("session")?.value;
  const isAuthed = token
    ? (await context.callAction(actions.verifySession, { token }))?.data?.user
    : false;
  const path = context.url.pathname;
  const privatePageArr = ["/profile"];
  if (!privatePageArr.includes(path)) {
    return next();
  } else if (isAuthed) {
    return next();
  } else {
    return context.redirect(`/auth/passkey?redirect=${context.url.href}`);
  }
});
