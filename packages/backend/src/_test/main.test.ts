import { describe, expect, test } from "bun:test"

import { app } from "main"
import type { BodyResponse } from "type"

describe("sanity check", () => {
  test('should success', () => {
    expect(1).toBe(1)
  })
})

describe("sanity check app", () => {
  test("/api/v1", async () => {
    const request = await app.request("/api/v1")
    const body = await request.json() as BodyResponse
    expect(body.message).toBe('success')

  })
})