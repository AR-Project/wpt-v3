import { afterEach, describe, expect, test } from "bun:test"
import { authTableHelper } from "@/db/_testHelper/authDbHelper"
import { auth } from "./auth"

describe.skip("auth", () => {
  afterEach(async () => {
    await authTableHelper.clean()
  })


  test('sign up should persist in database', async () => {
    // TODO: Find information if user database can be modified
    await auth.api.signUpEmail({
      body: {
        email: "test@test.com",
        password: "test123456",
        name: "test"
      }
    })

    const rows = await authTableHelper.find("test@test.com")

    expect(rows.length).toBe(1)
    expect(rows[0]?.email).toBe("test@test.com")
  })
})