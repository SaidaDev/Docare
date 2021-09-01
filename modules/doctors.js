const fs = require('fs')
const util = require("./utilites")

let doctors = []

const saveDoctors = () => {
    fs.writeFileSync('doctors.json', JSON.stringify(doctors, null, 2))
}

const loadDoctors = () => {
    doctors = JSON.parse(fs.readFileSync('doctors.json'))
}
loadDoctors()


const getDocById = (docId) => {
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id === docId) {
            return doctors[i]

        }
    }
    return null
}

const findDoc = (email, pass) => {
    for (let i = 0; i < doctors.length; i++) {

        if (doctors[i].email === email && doctors[i].password === pass) {

            return {
                id: doctors[i].id,
                name: doctors[i].name,
                image: doctors[i].image
            }
        }
    }
    return null
}
const doesEmailExists = (email) => {
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].email === email) {
            return true
        }

    }
    return false
}

const addDoctor = (email, password, name) => {
    if (doesEmailExists(email)) {
        return null
    }

    const newdoc = {
        id: util.getRandomString(),
        name: name,
        email: email,
        image: 'images/GYVC2191.JPG',
        password: password
    }
    doctors.push(newdoc)
    saveDoctors()
    return {
        id: newdoc.id,
        name: newdoc.name,
        image: newdoc.image
    }
}
exports.findDoc = findDoc
exports.addDoctor = addDoctor
exports.getDocById = getDocById