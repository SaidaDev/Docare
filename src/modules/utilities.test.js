import { createGetRandomString } from "./utilities";

describe("getRandomString", () => {
    it("should return randomString", () => {
        const getRandomString = createGetRandomString(() => 0.123456789)
        expect(getRandomString()).toBe("12345")
    })
})