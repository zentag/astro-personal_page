import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { type LSType, updateRating } from "./db";

import {
  deleteFailedRegUser,
  getAuthenticationOptions,
  getRegistrationOptions,
  verifyClientRegistrationResponse,
  verifyLoginResponse,
} from "./webauthn";
import { verifySessionToken } from "./auth";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";

export const server = {
  verifySession: defineAction({
    handler: verifySessionToken,
    input: z.object({
      token: z.string(),
    }),
  }),
  chRating: defineAction({
    handler: updateRating,
    input: z.object({
      postID: z.string(),
      userID: z.string(),
      prevLikedState: z.custom<LSType>(),
      likedState: z.custom<LSType>(),
    }),
  }),
  getRegOpts: defineAction({
    handler: getRegistrationOptions,
  }),
  delUsr: defineAction({
    handler: deleteFailedRegUser,
    input: z.object({
      userID: z.string(),
    }),
  }),
  verifyRegRes: defineAction({
    handler: verifyClientRegistrationResponse,
    input: z.object({
      userID: z.string(),
      response: z.custom<RegistrationResponseJSON>(),
    }),
  }),
  getAuthOpts: defineAction({
    handler: getAuthenticationOptions,
    input: z.object({
      userName: z.string(),
    }),
  }),
  verifyAuthRes: defineAction({
    handler: verifyLoginResponse,
    input: z.object({
      res: z.custom<AuthenticationResponseJSON>(),
      userID: z.string(),
    }),
  }),
};
