import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { db, eq, Challenges, Users, Passkeys } from "astro:db";
const rpName = "Zen Gunawardhana";
let rpID = "localhost";
let origin = "http://localhost:4321";
if (import.meta.env.PROD) {
  origin = "https://zentag.online";
  rpID = "zentag";
}
// TODO: save creds to db, check for null username, check for used username, return errors if there is an error, delete user if registration fails
export const verifyLoginResponse = async ({
  res,
  userID,
}: {
  res: AuthenticationResponseJSON;
  userID: string;
}) => {
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
  let options;
  let userID;
  try {
    userID = (
      await db
        .select({ userID: Users.userID })
        .from(Users)
        .where(eq(Users.userName, userName))
    )[0]["userID"];

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
