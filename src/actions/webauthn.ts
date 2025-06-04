import type { APIContext } from "astro";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { ActionError } from "astro:actions";
import { db, eq, Challenges, Users, Passkeys, Sessions } from "astro:db";
const rpName = "Zen Gunawardhana";
let rpID = "localhost";
let origin = "http://localhost:4321";
if (import.meta.env.PROD) {
  origin = "https://zengineer.ing";
  rpID = "zengineer.ing";
}

export const deleteFailedRegUser = async ({ userID }: { userID: string }) => {
  const userHasPasskeys =
    (await db.select().from(Passkeys).where(eq(Passkeys.userID, userID)))
      .length > 0;
  try {
    // for security: shouldn't delete already registered user
    if (!userHasPasskeys) {
      await db.delete(Challenges).where(eq(Challenges.userID, userID));
      await db.delete(Users).where(eq(Users.userID, userID));
    }
  } catch (e) {
    console.log(e);
  }
};

export const verifyLoginResponse = async (
  {
    res,
    userID,
  }: {
    res: AuthenticationResponseJSON;
    userID: string;
  },
  context: APIContext,
) => {
  let verification;
  try {
    const passkey = (
      await db.select().from(Passkeys).where(eq(Passkeys.id, res.id))
    )[0];
    if (!passkey) {
      throw new Error(`Could not find passkey ${res.id}`);
    }
    const challenge = (
      await db.select().from(Challenges).where(eq(Challenges.userID, userID))
    )[0]["challenge"];
    const { publicKey, id, counter } = passkey;
    verification = await verifyAuthenticationResponse({
      response: res,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id,
        //@ts-ignore dw its fine
        publicKey,
        counter,
        transports: passkey.transports.split("|||") as AuthenticatorTransport[],
      },
    });
    if (verification.verified) {
      await db
        .update(Passkeys)
        .set({ counter: verification.authenticationInfo.newCounter });
      const bytes = new Uint8Array(20);
      crypto.getRandomValues(bytes);
      const token = encodeBase32LowerCaseNoPadding(bytes);
      const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
      );
      const session = {
        id: sessionId,
        userID,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      };
      await db.insert(Sessions).values(session);
      context.cookies.set("session", token, {
        httpOnly: false,
        sameSite: "lax",
        secure: import.meta.env.PROD,
        expires: new Date(session.expiresAt),
        path: "/",
      });
    }
  } catch (error) {
    console.error(error);
  }
  return verification;
};
export const getAuthenticationOptions = async ({
  userName,
}: {
  userName: string;
}) => {
  if (userName === "")
    throw new ActionError({ code: "BAD_REQUEST", message: "Null username" });

  const userIDArr = await db
    .select({ userID: Users.userID })
    .from(Users)
    .where(eq(Users.userName, userName));
  if (userIDArr.length == 0)
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Username isn't registered",
    });
  let options;
  let userID;
  try {
    userID = userIDArr[0]["userID"];
    const userPasskeys = await db
      .select()
      .from(Passkeys)
      .where(eq(Passkeys.userID, userID));
    options = await generateAuthenticationOptions({
      rpID,
      // Require users to use a previously-registered authenticator
      allowCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports.split("|||") as AuthenticatorTransport[],
      })),
    });
  } catch (err) {
    console.log(err);
  }
  if (userID) {
    await db.delete(Challenges).where(eq(Challenges.userID, userID));
    await db
      .insert(Challenges)
      .values({ userID, challenge: options?.challenge });
  }
  return { options, userID };
};

export const getRegistrationOptions = async ({
  userName,
}: {
  userName: string;
}) => {
  const userInDB =
    (
      await db
        .select({ userName: Users.userName })
        .from(Users)
        .where(eq(Users.userName, userName))
    ).length > 0;
  if (userInDB)
    throw new ActionError({
      code: "CONFLICT",
      message:
        "Username has already been registered. If it's you, log in on your other device and add a new passkey.",
    });
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName,
    attestationType: "none",
  });
  const userID = options.user.id;
  const { challenge } = options;
  try {
    await db.insert(Users).values({ userID, userName });
    await db.insert(Challenges).values({ challenge, userID });
  } catch (err) {
    console.log(err);
  }
  return options;
};

export const verifyClientRegistrationResponse = async ({
  response,
  userID,
}: {
  response: RegistrationResponseJSON;
  userID: string;
}) => {
  const challenge = (
    await db
      .select({ challenge: Challenges.challenge })
      .from(Challenges)
      .where(eq(Challenges.userID, userID))
  ).map((obj) => obj.challenge)[0];
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (err) {
    console.log(err);
  }
  if (!verification?.verified || !verification?.registrationInfo) return false;
  const { credential, credentialDeviceType, credentialBackedUp } =
    verification.registrationInfo;
  try {
    const publicKey = credential.publicKey;
    //@ts-ignore trust me bro the db will work
    await db.insert(Passkeys).values({
      userID,
      id: credential.id,
      publicKey,
      counter: credential.counter,
      transports: credential.transports?.join("|||") || "",
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp == true,
    });
  } catch (err) {
    console.log(err);
  }
  return verification?.verified;
};
