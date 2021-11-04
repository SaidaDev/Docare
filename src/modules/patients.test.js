import { createLoadPatients, getNumPatients, createAddPatient, getPatients, deletePatient } from "./patients"
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
describe("getPatients", () => {
    it("should return patients", () => {
        let numCall = 0
        const fs = {
            readFileSync: (fileName) => {
                ++numCall
                expect(fileName).toBe("patients.json")
                return patientsJson
            }
        }
        const loadPatients = createLoadPatients(fs)
        loadPatients()
        expect(getPatients("0", "", "", "", 1, 10)).toEqual([{
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
        }])
        expect(numCall).toBe(1)
    })

    it("should return patients with search", () => {
        let numCall = 0
        const fs = {
            readFileSync: (fileName) => {
                ++numCall
                expect(fileName).toBe("patients.json")
                return patientsJson
            }
        }
        const loadPatients = createLoadPatients(fs)
        loadPatients()
        expect(getPatients("1", "ilkin", "", "", 0, 10)).toEqual([{
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
        }])

        expect(numCall).toBe(1)
    })

    it("should return patients with sort", () => {
        let numCall = 0
        const fs = {
            readFileSync: (fileName) => {
                ++numCall
                expect(fileName).toBe("patients.json")
                return patientsJson
            }
        }
        const loadPatients = createLoadPatients(fs)
        loadPatients()
        expect(getPatients("1", "", "age", "d", 0, 10)).toEqual([
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
            }])

        expect(numCall).toBe(1)
    })

})
describe("getNumPatients", () => {
    it("should return patients for each doc", () => {
        const fs = {
            readFileSync: () => {
                return patientsJson
            }
        }
        const loadPatients = createLoadPatients(fs)
        loadPatients()
        expect(getNumPatients("0")).toBe(3)
    })
})

describe("createAddPatients", () => {
    it("should add patients", () => {
        let numSaveCalls = 0
        const fs = {
            readFileSync: () => {
                return patientsJson
            }
        }
        const loadPatients = createLoadPatients(fs)
        loadPatients()
        const addPatients = createAddPatient(() => "321", () => {
            ++numSaveCalls
        })
        expect(getNumPatients("1")).toBe(3)
        addPatients("1", {
            "name": "Feride imanova",
            "age": 42,
            "gender": "Female",
            "disease": "bronchitis",
            "treatment": 37,
            "address": "Gence",
            "phone": "+276 460 54 50",
        })
        expect(numSaveCalls).toBe(1)
        expect(getNumPatients("1")).toBe(4)
    })
})

describe("deletePatients", () => {
    it("should delete patients", () => {
        const fs = {
            readFileSync: () => {
                return patientsJson
            }
        }
        const loadPatients = createLoadPatients(fs)
        loadPatients()
        expect(getNumPatients("1")).toBe(3)
        deletePatient("1", ["1", "2", "55"])
        expect(getNumPatients("1")).toBe(1)
    })
})