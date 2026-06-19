import type { SupabaseClient } from "@supabase/supabase-js";

import { emailPasswordCredentialsSchema, type EmailPasswordCredentials } from "./schema";

type SupabaseAuthClient = Pick<SupabaseClient, "auth">;

export async function signInWithEmailPassword(client: SupabaseAuthClient, credentials: EmailPasswordCredentials) {
  const parsedCredentials = emailPasswordCredentialsSchema.parse(credentials);

  return client.auth.signInWithPassword({
    email: parsedCredentials.email,
    password: parsedCredentials.password
  });
}

export async function signUpWithEmailPassword(client: SupabaseAuthClient, credentials: EmailPasswordCredentials) {
  const parsedCredentials = emailPasswordCredentialsSchema.parse(credentials);

  return client.auth.signUp({
    email: parsedCredentials.email,
    password: parsedCredentials.password
  });
}

export async function signOut(client: SupabaseAuthClient) {
  return client.auth.signOut();
}
