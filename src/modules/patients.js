import fs from 'fs'
import { getRandomString } from "./utilities"
let patients = []

const savePatients = () => {
    fs.writeFileSync('patients.json', JSON.stringify(patients, null, 2))
}
const loadPatients = () => {
    patients = JSON.parse(fs.readFileSync('patients.json'))
}
loadPatients()
export const getNumPatients = (docId) => {
    return patients
        .filter((patient) => docId === patient.doctorId).length
}
export const getPatients = (docId, search, sortBy, sortByOrder, from, to) => {

    let mass = patients
        .filter((patient) => docId === patient.doctorId)
        .filter((patient) => patient.name.toLowerCase().includes(search))
    if (sortBy === "name") {
        if (sortByOrder === 'a') {
            mass.sort((a, b) => a.name.localeCompare(b.name))
        } else {
            mass.sort((a, b) => b.name.localeCompare(a.name))
        }
    }
    if (sortBy === "age") {
        if (sortByOrder === 'a') {
            mass.sort((a, b) => a.age - b.age)
        } else {
            mass.sort((a, b) => b.age - a.age)
        }
    }
    if (sortBy === "treatment") {
        if (sortByOrder === 'a') {
            mass.sort((a, b) => a.treatment - b.treatment)
        } else {
            mass.sort((a, b) => b.treatment - a.treatment)
        }
    }
    return mass.slice(from, to)


}
export const addPatient = (docId, p) => {
    const newPatient = {
        id: getRandomString(),
        doctorId: docId,
        image: "images/GYVC2191.JPG",
        name: p.name,
        age: p.age,
        gender: p.gender,
        disease: p.disease,
        treatment: p.treatment,
        address: p.address,
        phone: p.phone,
    }
    patients.unshift(newPatient)
    savePatients()

}
export const deletePatient = (docId, patientIds) => {

    patients = patients.filter((patient) => {
        for (let i = 0; i < patientIds.length; i++) {
            if (patient.id === patientIds[i] && patient.doctorId === docId) {
                return false
            }
        }
        return true
    })


}
