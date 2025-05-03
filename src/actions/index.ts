import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import {
  getRegistrationOptions,
  verifyClientRegistrationResponse,
} from "./webauthn";

import type { RegistrationResponseJSON } from "@simplewebauthn/server";

export const server = {
  getRegOpts: defineAction({
    handler: getRegistrationOptions,
  }),
  verifyRegRes: defineAction({
    handler: verifyClientRegistrationResponse,
    input: z.object({
      userID: z.string(),
      response: z.custom<RegistrationResponseJSON>(),
    }),
  }),
};
