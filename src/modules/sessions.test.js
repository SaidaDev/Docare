import { closeSession, getDocId, isSessionValid, loadSession, openSession } from "./sessions";
import mock from "mock-fs"

 
describe("isSessionValid", () => {
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
    it("should return true", () => {
        expect(isSessionValid("38503")).toBe(true)
        expect(isSessionValid("12")).toBe(false)
    })
})

describe("closeSession", () => {
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
    it("should close session", () => {
        closeSession("38503")
        expect(isSessionValid("38503")).toBe(false)
    })
})
describe("openSession", () => {
    beforeAll(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    })
    afterAll(() => {
        Math.random.mockRestore();
    })
    it("should open session", () => {
        openSession("0")
        expect(isSessionValid("12345")).toBe(true)
        expect(getDocId("12345")).toBe("0")
    })
})


