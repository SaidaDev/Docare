import { getSessionId, setSessionId } from "./cookie"

describe("getSessionId", () => {
    it("should return sessionId", () => {
        const req = {
            headers: {
                cookie: "sessionId=123",
                "content-type": "text.html"
            }
        }
        expect(getSessionId(req)).toBe("123")
    })

    it("should return emptyString", () => {
        const req = {
            headers: {
                "content-type": "text.html"
            }
        }
        expect(getSessionId(req)).toBe("")
    })
})

describe("setSessionId", () => {
    it("should call SetHeader Function", () => {
        let numCalled = 0
        const res = {
            setHeader: (key, value) => {
                ++numCalled
                expect(key).toBe("Set-Cookie")
                expect(value).toBe("Session=123")
            }
        }
        setSessionId("123", res)
        expect(numCalled).toBe(1)
    })
})