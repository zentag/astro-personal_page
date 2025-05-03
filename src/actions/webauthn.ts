import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { db, eq, Challenges, Users } from "astro:db";
const rpName = "Zen Gunawardhana";
let rpID = "localhost";
let origin = "http://localhost:4321";
if (import.meta.env.PROD) {
  origin = "https://zentag.online";
  rpID = "zentag";
}
// TODO: check for null username, check for used username, return errors if there is an error

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
  console.log("wth");
  const challenge = (
    await db
      .select({ challenge: Challenges.challenge })
      .from(Challenges)
      .where(eq(Challenges.userID, userID))
  ).map((obj) => obj.challenge)[0];
  console.log(challenge);
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
  return verification?.verified;
};
