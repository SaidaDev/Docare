import { getLogin, requestFile } from "./routes";
import mock from "mock-fs"
import { loadDoctors } from "./doctors";
import { closeSession, isSessionValid, loadSession } from "./sessions";

describe("requestFile", () => {
    beforeAll(() => {
        mock({
            "Docare.html": "<p>text</p>",
            "styles": { "style.css": "*{color:red}" }
        })

    })
    afterAll(() => {
        mock.restore()
    })
    it("should return index.html", async () => {
        const req = { url: "/" }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        await requestFile(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/html")
        expect(res.end).toHaveBeenCalledWith("<p>text</p>")
    })
    it("should return style.css", async () => {
        const req = { url: "/styles/style.css?theme=dark" }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        await requestFile(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/css")
        expect(res.end).toHaveBeenCalledWith("*{color:red}")
    })

})

describe("getLogin", () => {
    beforeAll(() => {
        mock({
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            }]`,
            "sessions.json": `{
                "38503": {"id": "0"},
                "3850311": {"id": "1111"}
                }`
        })
        loadDoctors()
        loadSession()
    })

    afterAll(() => {
        mock.restore()
    })
    it("should return logged In Doctor", async () => {

        const req = { headers: { cookie: "session=38503" } }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getLogin(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")
        expect(res.end).toHaveBeenCalledWith('{"id":"0","name":"Dr.Asadova","image":"images/GYVC2191.JPG"}')
    })
    it("should return empty json", async () => {
        const req = { headers: {} }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getLogin(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")
        expect(res.end).toHaveBeenCalledWith('{}')
    })
    it("should close non-existent Doctor", async () => {
        const req = { headers: { cookie: "session=3850311" } }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getLogin(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")
        expect(res.end).toHaveBeenCalledWith('{}')
        expect(isSessionValid("3850311")).toBe(false)
    })
})



describe("Login Doctor", () => {
    beforeAll(() => {
        mock({
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            },
            {
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Aliyeva",
                "id": "1",
                "email": "ru",
                "password": "123"
            },
            {
                "id": "50999",
                "name": "qqq",
                "email": "qqq",
                "image": "images/GYVC2191.JPG",
                "password": "qqq"
            }
        
        ]`,
            "sessions.json": `{
                "38503": {"id": "0"}
                }`
        })
        loadDoctors()
        loadSession()
    })

    afterAll(() => {
        mock.restore()
    })

    it("should return", async () => {
        const req = { headers: {} }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getLogin(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")
        expect(res.end).toHaveBeenCalledWith('{}')
    })
})
