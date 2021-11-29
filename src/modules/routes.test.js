import { deletePatients, getLogin, getPeople, login, logout, register, requestAddPatient, requestFile, requestGetNumPatients } from "./routes";
import fs from "fs"
import mock from "mock-fs"
import { loadDoctors } from "./doctors";
import { isSessionValid, loadSession } from "./sessions";
import { Readable } from "stream"
import { getPatients, loadPatients } from "./patients";
const patientsJson = `[{
    "image": "images/GYVC2191.JPG",
    "id": "1",
    "name": "Feride imanova",
    "age": 42,
    "gender": "Female",
    "disease": "bronchitis",
    "treatment": 37,
    "address": "Gence",
    "phone": "+276 460 54 50",
    "doctorId": "1"
},
{
    "image": "images/GYVC2191.JPG",
    "id": "2",
    "name": "Ilkin Mamedov",
    "age": 49,
    "gender": "Male",
    "disease": "Flu",
    "treatment": 85,
    "address": "Hannover",
    "phone": "+176 450 54 50",
    "doctorId": "1"
},
{
    "image": "images/GYVC2191.JPG",
    "id": "3",
    "name": "Ilyas Aliyev",
    "age": 32,
    "gender": "Male",
    "disease": "bronchitis",
    "treatment": 65,
    "address": "Hannover",
    "phone": "+176 450 54 50",
    "doctorId": "1"
},
{
    "image": "images/GYVC2191.JPG",
    "id": "56",
    "name": "Ilkin Mamedov",
    "age": 42,
    "gender": "Male",
    "disease": "bronchitis",
    "treatment": 35,
    "address": "Hannover",
    "phone": "+176 450 54 50",
    "doctorId": "0"
},
{
    "image": "images/GYVC2191.JPG",
    "id": "5656",
    "name": "Alex Feinstein",
    "age": 26,
    "gender": "Male",
    "disease": "Flu",
    "treatment": 75,
    "address": "Sweden",
    "phone": "+176 154 45 25",
    "doctorId": "0"
},
{
    "image": "images/GYVC2191.JPG",
    "id": "565",
    "name": "Aygun Agakishibekova",
    "age": 32,
    "gender": "Female",
    "disease": "heart attack",
    "treatment": 35,
    "address": "Baku",
    "phone": "+994 555 22 11",
    "doctorId": "0"
}]`
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
                "38503":{"id":"0"},
                "3850311":{"id":"1111"}
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
        expect(fs.readFileSync("sessions.json", "utf8")).toBe('{"38503":{"id":"0"}}')
    })
})

describe("Login Doctor", () => {
    let random
    beforeAll(() => {
        mock({
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            }]`,
            "sessions.json": `{}`
        })
        loadDoctors()
        loadSession()
        random = jest.spyOn(global.Math, 'random')
        random.mockReturnValue(0.123456789);
    });

    afterAll(() => {
        mock.restore()
        random.mockRestore();
    })

    it("should return login Doc", async () => {
        const req = Readable.from(['{"email": "wand","password":"1234"}'])
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        await login(req, res)

        expect(res.setHeader).toHaveBeenCalledTimes(2)
        expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', `Session=12345`)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith('{"id":"0","name":"Dr.Asadova","image":"images/GYVC2191.JPG"}')
    })
    it("should return non-existent Doctor", async () => {
        const req = Readable.from(['{"email":"","password":""}'])
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        await login(req, res)

        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith('{"error":"Email or Password not correct"}')
    })
})

describe("Register Doctor", () => {
    let random
    beforeAll(() => {
        mock({
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            }]`,
            "sessions.json": `{}`
        })
        loadDoctors()
        loadSession()
        random = jest.spyOn(global.Math, 'random')
        random.mockReturnValue(0.123456789);
    });

    afterAll(() => {
        mock.restore()
        random.mockRestore();
    })

    it("should register doc", async () => {
        const req = Readable.from(['{"email":"wand2","password":"12345","name":"Dr.Asadova"}'])
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        await register(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(2)
        expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', `Session=12345`)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith('{"id":"12345","name":"Dr.Asadova","image":"images/GYVC2191.JPG"}')
    })
    it("should return error when email exists", async () => {
        const req = Readable.from(['{"email":"wand","password":"12304454","name":"Asadova"}'])
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        await register(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith('{"error":"Email already register"}')
    })
})

describe("logout", () => {
    beforeAll(() => {
        mock({
            "sessions.json": `{
                "38503":{"id":"0"},
                "3850311":{"id":"1111"}
                }`
        })
        loadSession()
    })
    afterAll(() => {
        mock.restore()
    })

    it("should logout", async () => {
        const req = { headers: { cookie: "session=3850311" } }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        logout(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(0)

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith()

        expect(isSessionValid("3850311")).toBe(false)
        expect(fs.readFileSync("sessions.json", "utf8")).toBe('{"38503":{"id":"0"}}')
    })
})

describe("Request num Patients", () => {
    beforeAll(() => {
        mock({
            "patients.json": patientsJson,
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            }]`,
            "sessions.json": `{"38503":{"id":"0"}}`
        })
        loadDoctors()
        loadPatients()
        loadSession()
    });

    afterAll(() => {
        mock.restore()
    })

    it("should return num patient", async () => {
        const req = { headers: { cookie: "session=38503" } }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        requestGetNumPatients(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith('{"numPatient":3}')
    })
    it("should return zero when doc not logged in", async () => {
        const req = { headers: { cookie: "session=385030" } }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        requestGetNumPatients(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith('{"numPatient":0}')
    })
})

describe("get People", () => {
    beforeAll(() => {
        mock({
            "patients.json": patientsJson,
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            },  {
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Aliyeva",
                "id": "1",
                "email": "ru",
                "password": "123"
            }]`,
            "sessions.json": `{"38503":{"id":"0"},"385034":{"id":"1"}}`
        })
        loadDoctors()
        loadPatients()
        loadSession()
    });

    afterAll(() => {
        mock.restore()
    })

    it("should return patients", () => {
        const req = {
            headers: { cookie: "session=38503" },
            url: "/getpeople?from=1&to=10&search=&sort=&order="
        }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getPeople(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith(JSON.stringify([{
            "image": "images/GYVC2191.JPG",
            "id": "5656",
            "name": "Alex Feinstein",
            "age": 26,
            "gender": "Male",
            "disease": "Flu",
            "treatment": 75,
            "address": "Sweden",
            "phone": "+176 154 45 25",
            "doctorId": "0"
        },
        {
            "image": "images/GYVC2191.JPG",
            "id": "565",
            "name": "Aygun Agakishibekova",
            "age": 32,
            "gender": "Female",
            "disease": "heart attack",
            "treatment": 35,
            "address": "Baku",
            "phone": "+994 555 22 11",
            "doctorId": "0"
        }]))
    })

    it("should return patients with search", () => {
        const req = {
            headers: { cookie: "session=385034" },
            url: "/getpeople?from=0&to=10&search=ilkin&sort=&order="
        }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getPeople(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith(JSON.stringify([{
            "image": "images/GYVC2191.JPG",
            "id": "2",
            "name": "Ilkin Mamedov",
            "age": 49,
            "gender": "Male",
            "disease": "Flu",
            "treatment": 85,
            "address": "Hannover",
            "phone": "+176 450 54 50",
            "doctorId": "1"
        }]))

    })

    it("should return patients with age", () => {
        const req = {
            headers: { cookie: "session=385034" },
            url: "/getpeople?from=0&to=10&search=&sort=age&order=d"
        }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getPeople(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith(JSON.stringify([
            {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "1"
            }, {
                "image": "images/GYVC2191.JPG",
                "id": "1",
                "name": "Feride imanova",
                "age": 42,
                "gender": "Female",
                "disease": "bronchitis",
                "treatment": 37,
                "address": "Gence",
                "phone": "+276 460 54 50",
                "doctorId": "1"
            },
            {
                "image": "images/GYVC2191.JPG",
                "id": "3",
                "name": "Ilyas Aliyev",
                "age": 32,
                "gender": "Male",
                "disease": "bronchitis",
                "treatment": 65,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "1"
            }]))

    })

    it("should return empty list", () => {
        const req = {
            headers: { cookie: "session=" },
            url: "/getpeople?from=0&to=10&search=&sort=&order="
        }
        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }
        getPeople(req, res)
        expect(res.setHeader).toHaveBeenCalledTimes(1)
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', "text/json")

        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith("[]")
    })
})


describe("add Patient", () => {
    beforeEach(() => {
        mock({
            "patients.json": `[{
                "image": "images/GYVC2191.JPG",
                "id": "1",
                "name": "Feride imanova",
                "age": 42,
                "gender": "Female",
                "disease": "bronchitis",
                "treatment": 37,
                "address": "Gence",
                "phone": "+276 460 54 50",
                "doctorId": "1"
            },
            {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "0"
            }]`,
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            },  {
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Aliyeva",
                "id": "1",
                "email": "ru",
                "password": "123"
            }]`,
            "sessions.json": `{"38503":{"id":"0"},"385034":{"id":"1"}}`
        })
        loadDoctors()
        loadPatients()
        loadSession()
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
        mock.restore()
        Math.random.mockRestore();
    })

    it("should add patient", async () => {
        const req = Readable.from(`
        {
            "name": "Aygun Agakishibekova",
            "age": 32,
            "gender": "Female",
            "disease": "heart attack",
            "treatment": 35,
            "address": "Baku",
            "phone": "+994 555 22 11"
        }`)

        req.headers = { cookie: "session=38503" }

        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }

        await requestAddPatient(req, res)

        expect(res.setHeader).toHaveBeenCalledTimes(0)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith()
        expect(getPatients("0", "", "", "", "0", "10")).toEqual([
            {
                "image": "images/GYVC2191.JPG",
                "id": "12345",
                "name": "Aygun Agakishibekova",
                "age": 32,
                "gender": "Female",
                "disease": "heart attack",
                "treatment": 35,
                "address": "Baku",
                "phone": "+994 555 22 11",
                "doctorId": "0"
            }, {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "0"
            }
        ])
    })

    it("should return unauthorized status", async () => {
        const req = Readable.from(`
        {
            "name": "Aygun Agakishibekova",
            "age": 32,
            "gender": "Female",
            "disease": "heart attack",
            "treatment": 35,
            "address": "Baku",
            "phone": "+994 555 22 11"
        }`)

        req.headers = { cookie: "session=385030" }

        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }

        await requestAddPatient(req, res)

        expect(res.setHeader).toHaveBeenCalledTimes(0)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith()
        expect(getPatients("0", "", "", "", "0", "10")).toEqual([
            {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "0"
            }
        ])
        expect(res.statusCode).toBe(401)
    })
})

describe("delete Patient", () => {
    beforeEach(() => {
        mock({
            "patients.json": `[{
                "image": "images/GYVC2191.JPG",
                "id": "1",
                "name": "Feride imanova",
                "age": 42,
                "gender": "Female",
                "disease": "bronchitis",
                "treatment": 37,
                "address": "Gence",
                "phone": "+276 460 54 50",
                "doctorId": "1"
            },
            {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "1"
            }]`,
            "doctors.json": `[{
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Asadova",
                "id": "0",
                "email": "wand",
                "password": "1234"
            },  {
                "image": "images/GYVC2191.JPG",
                "name": "Dr.Aliyeva",
                "id": "1",
                "email": "ru",
                "password": "123"
            }]`,
            "sessions.json": `{"38503":{"id":"0"},"385034":{"id":"1"}}`
        })
        loadDoctors()
        loadPatients()
        loadSession()
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
        mock.restore()
        Math.random.mockRestore();
    })

    it("should delete patient", async () => {
        const req = Readable.from(`["1"]`)

        req.headers = { cookie: "session=385034" }

        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }

        await deletePatients(req, res)

        expect(res.setHeader).toHaveBeenCalledTimes(0)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith()
        expect(getPatients("1", "", "", "", "0", "10")).toEqual([
            {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "1"
            }
        ])
    })

    it("should return unauthorized status", async () => {
        const req = Readable.from(`["1"]`)

        req.headers = { cookie: "session=38503044" }

        const res = {
            setHeader: jest.fn(),
            end: jest.fn()
        }

        await deletePatients(req, res)

        expect(res.setHeader).toHaveBeenCalledTimes(0)
        expect(res.end).toHaveBeenCalledTimes(1)
        expect(res.end).toHaveBeenCalledWith()
        expect(getPatients("1", "", "", "", "0", "10")).toEqual([
            {
                "image": "images/GYVC2191.JPG",
                "id": "1",
                "name": "Feride imanova",
                "age": 42,
                "gender": "Female",
                "disease": "bronchitis",
                "treatment": 37,
                "address": "Gence",
                "phone": "+276 460 54 50",
                "doctorId": "1"
            },
            {
                "image": "images/GYVC2191.JPG",
                "id": "2",
                "name": "Ilkin Mamedov",
                "age": 49,
                "gender": "Male",
                "disease": "Flu",
                "treatment": 85,
                "address": "Hannover",
                "phone": "+176 450 54 50",
                "doctorId": "1"
            }
        ])
        expect(res.statusCode).toBe(401)
    })
})