import http from 'http'
import { requestFile, getLogin, login, register, getPeople, deletePatients, requestAddPatient, requestAddPatient, requestGetNumPatients } from './modules/routes'

const server = http.createServer((req, res) => {
    if (req.url === '/getlogin') {
        getLogin(req, res)
        return
    }
    if (req.url === '/login') { //find doc
        login(req, res)
        return
    }
    if (req.url === '/register') {
        register(req, res)
        return
    }
    if (req.url === '/logout') {
        logout(req, res)
        return
    }
    if (req.url === '/num') {
        requestGetNumPatients(req, res)
        return
    }
    if (req.url.startsWith('/getpeople')) {
        getPeople(req, res)
        return
    }
    if (req.url === '/addpatient') {
        requestAddPatient(req, res)
        return
    }
    if (req.url === '/delete') {
        deletePatients(req, res)
        return
    }
    console.log(req.url)
    requestFile(req, res)
})
server.listen(3000)