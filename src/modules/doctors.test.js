

import { getDocById, findDoc, addDoctor, loadDoctors } from "./doctors"
import mock from "mock-fs"

describe("getDocById", () => {
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
                }]`
        })
        loadDoctors()
    })

    afterAll(() => {
        mock.restore()
    })

    it("should return docId", () => {

        expect(getDocById("0")).toEqual({
            "image": "images/GYVC2191.JPG",
            "name": "Dr.Asadova",
            "id": "0",
            "email": "wand",
            "password": "1234"
        })
        expect(getDocById("22")).toBe(null)

    })

})

describe("findDoc", () => {
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
                }]`
        })
        loadDoctors()
    })

    afterAll(() => {
        mock.restore()
    })

    it("should find doctor", () => {

        expect(findDoc("wand", "1234")).toEqual({
            "image": "images/GYVC2191.JPG",
            "name": "Dr.Asadova",
            "id": "0",
        })
        expect(findDoc("wandd", "2222")).toBe(null)

    })

})
describe("addDoctor", () => {
    let random
    beforeAll(() => {
        mock({
            "doctors.json": `[{
                    "image": "images/GYVC2191.JPG",
                    "name": "Dr.Asadova",
                    "id": "0",
                    "email": "wand",
                    "password": "1234"
                }]`
        })
        random = jest.spyOn(global.Math, 'random')
        random.mockReturnValue(0.123456789);
    });

    afterAll(() => {
        mock.restore()
        random.mockRestore();
    })
    it("should add doctor", () => {
        expect(addDoctor("wanddd", "134", "Dr.Asadova")).toEqual({
            "image": "images/GYVC2191.JPG",
            "name": "Dr.Asadova",
            "id": "12345",
        })
        expect(addDoctor("wanddd", "001", "ira")).toBe(null)
    })
})
