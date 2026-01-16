import type { User } from "../types/auth"

export async function login(email: string, password: string): Promise<User> {
  // mocked: backend will replace this later
  if (email.toLowerCase() === "boss@garage.com") {
    return {
      id: 1,
      email,
      name: "Boss",
      role: "BOSS",
      token: "fake-jwt-token",
    }
  }

  return {
    id: 2,
    email,
    name: "Mechanic",
    role: "MECHANIC",
    token: "fake-jwt-token",
  }
}
