import { requestFile, getLogin, login, register, getPeople, deletePatients, requestAddPatient, requestGetNumPatients, logout } from './routes'

export const routeMatch = (req, res) => {
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

    requestFile(req, res)
}