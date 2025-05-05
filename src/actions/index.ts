import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import {
  deleteFailedRegUser,
  getAuthenticationOptions,
  getRegistrationOptions,
  verifyClientRegistrationResponse,
  verifyLoginResponse,
} from "./webauthn";

import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";

export const server = {
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
