import type { AuthUser, AuthUserType } from "@/lib/auth";
import type { app } from "@/main";

type SignUpPayload = {
  email: string;
  password: string;
  name: string;
}

type SignInPayload = {
  email: string;
  password: string;
}

type SignUpJsonRes = {
  token: string,
  user: AuthUser
}

type SignInJsonRes = SignUpJsonRes & { redirect: boolean }

type HonoApp = typeof app

export async function signUpHelper(
  user: SignUpPayload,
  appInstance: HonoApp
) {
  const signUpRes = await appInstance.request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return await signUpRes.json() as { token: string, user: AuthUserType };
}

export async function signInHelper(user: SignInPayload, appInstance: HonoApp
): Promise<{ id: string, cookie: string }> {

  const res = await appInstance.request("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
  });

  const json = await res.json() as SignInJsonRes
  const cookie = res.headers.get("set-cookie");
  if (!cookie) throw new Error("Signin in failed")

  return { id: json.user.id, cookie }
}

/** Test helper for sign-up, then sign-in a user. Return cookie */
export async function signUpSignInHelper(user: SignUpPayload, appInstance: HonoApp): Promise<{ id: string, cookie: string }> {
  await signUpHelper(user, appInstance)
  const { id, cookie } = await signInHelper({ email: user.email, password: user.password }, appInstance)
  return { id, cookie }
}
