import { createLoadDoctors, getDocById, findDoc, createAddDoctor } from "./doctors"
describe("getDocById", () => {
    it("should return docId", () => {
        let numCall = 0
        const fs = {
            readFileSync: (fileName) => {
                ++numCall
                expect(fileName).toBe("doctors.json")
                return `[{
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
                }]`
            }
        }
        const loadDoctors = createLoadDoctors(fs)
        loadDoctors()
        expect(getDocById("0")).toEqual({
            "image": "images/GYVC2191.JPG",
            "name": "Dr.Asadova",
            "id": "0",
            "email": "wand",
            "password": "1234"
        })
        expect(getDocById("22")).toBe(null)
        expect(numCall).toBe(1)
    })

})

describe("findDoc", () => {
    it("should find doctor", () => {
        let numCall = 0
        const fs = {
            readFileSync: (fileName) => {
                ++numCall
                expect(fileName).toBe("doctors.json")
                return `[{
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
                }]`
            }
        }
        const loadDoctors = createLoadDoctors(fs)
        loadDoctors()
        expect(findDoc("wand", "1234")).toEqual({
            "image": "images/GYVC2191.JPG",
            "name": "Dr.Asadova",
            "id": "0",
        })
        expect(findDoc("wandd", "2222")).toBe(null)
        expect(numCall).toBe(1)
    })

})
describe("addDoctor", () => {
    it("should add doctor", () => {
        let numReadCall = 0
        const fs = {
            readFileSync: (fileName) => {
                ++numReadCall
                expect(fileName).toBe("doctors.json")
                return `[{
                    "image": "images/GYVC2191.JPG",
                    "name": "Dr.Asadova",
                    "id": "0",
                    "email": "wand",
                    "password": "1234"
                }]`
            }
        }
        const loadDoctors = createLoadDoctors(fs)
        loadDoctors()
        const getRandomString = () => "12"

        let numWriteCall = 0
        const saveDoctors = () => {
            ++numWriteCall
        }
        const addDoctor = createAddDoctor(getRandomString, saveDoctors)

        expect(addDoctor("wanddd", "134", "Dr.Asadova")).toEqual({
            "image": "images/GYVC2191.JPG",
            "name": "Dr.Asadova",
            "id": "12",
        })
        expect(addDoctor("wanddd", "001", "ira")).toBe(null)
        expect(numWriteCall).toBe(1)
        expect(numReadCall).toBe(1)
    })

})