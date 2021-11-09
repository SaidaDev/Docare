import { createCloseSession, createLoadSession, createOpenSession, getDocId, isSessionValid } from "./sessions";

const loadSession = createLoadSession({
    readFileSync: () =>
        `{
        "38503": {"id": "0"}
        }`
})

describe("isSessionValid", () => {
    it("should return true", () => {
        loadSession()
        expect(isSessionValid("38503")).toBe(true)
        expect(isSessionValid("12")).toBe(false)
    })
})

describe("closeSession", () => {
    it("should close session", () => {
        const fsMine = { writeFileSync: () => { } }
        const closeSession = createCloseSession(fsMine)
        loadSession()
        closeSession("38503")
        expect(isSessionValid("38503")).toBe(false)
    })
})
describe("openSession", () => {
    it("should open session", () => {
        const save = () => { }
        const randomStr = () => "5570"
        const openSession = createOpenSession(save, randomStr)
        loadSession()
        openSession("0")
        expect(isSessionValid("5570")).toBe(true)
        expect(getDocId("5570")).toBe("0")
    })
})