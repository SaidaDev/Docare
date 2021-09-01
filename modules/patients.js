const fs = require('fs')
const util = require("./utilites")

let patients = []

const savepatiens = () => {
    fs.writeFileSync('patients.json', JSON.stringify(patients, null, 2))
}

const loadpatiens = () => {
    patients = JSON.parse(fs.readFileSync('patients.json'))
}
loadpatiens()
const getNumPatiens = (docId) => {
    return patients
        .filter((patient) => docId === patient.doctorId).length
}

const getPatients = (docId, search, sortBy, sortByOrder, from, to) => {

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
const addPatient = (docId, p) => {
    const newPatient = {
        id: util.getRandomString(),
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
    savepatiens()

}

const deletePatient = (docId, patientIds) => {

    patients = patients.filter((patient) => {
        for (let i = 0; i < patientIds.length; i++) {
            if (patient.id === patientIds[i] && patient.doctorId === docId) {
                return false
            }
        }
        return true
    })


}
exports.deletePatient = deletePatient
exports.addPatient = addPatient
exports.getPatients = getPatients
exports.getNumPatiens = getNumPatiens