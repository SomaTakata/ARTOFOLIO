import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()

export const signIn = async (callbackURL: string) => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL,
  })
}

export const signOut = async () => {
  const data = await authClient.signOut()
}
