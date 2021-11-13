import { closeSession, createOpenSession, getDocId, isSessionValid, loadSession } from "./sessions";
import mock from "mock-fs"
describe("session test", () => {
    beforeAll(() => {
        mock({
            "sessions.json": `{
        "38503": {"id": "0"}
        }`
        })
        loadSession()
    })
    afterAll(() => {
        mock.restore()
    })
    describe("isSessionValid", () => {
        it("should return true", () => {
            expect(isSessionValid("38503")).toBe(true)
            expect(isSessionValid("12")).toBe(false)
        })
    })

    describe("closeSession", () => {
        it("should close session", () => {
            closeSession("38503")
            expect(isSessionValid("38503")).toBe(false)
        })
    })
    describe("openSession", () => {
        it("should open session", () => {
            const randomStr = () => "5570"
            const openSession = createOpenSession(randomStr)
            openSession("0")
            expect(isSessionValid("5570")).toBe(true)
            expect(getDocId("5570")).toBe("0")
        })
    })

})
