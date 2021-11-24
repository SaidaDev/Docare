import { routeMatch } from "./route-match";
import { requestFile, getLogin, login, register, getPeople, deletePatients, requestAddPatient, requestGetNumPatients, logout } from './routes'

jest.mock('./routes')

describe("route Match", () => {
    it("should request file", () => {
        const req = { url: "/" }
        const res = {}
        routeMatch(req, res)
        expect(requestFile).toHaveBeenCalledTimes(1)

    })
    it("should getLogin", () => {
        const req = { url: "/getlogin" }
        const res = {}
        routeMatch(req, res)
        expect(getLogin).toHaveBeenCalledTimes(1)

    })
    it("should login ", () => {
        const req = { url: "/login" }
        const res = {}
        routeMatch(req, res)
        expect(login).toHaveBeenCalledTimes(1)

    })
    it("should register", () => {
        const req = { url: "/register" }
        const res = {}
        routeMatch(req, res)
        expect(register).toHaveBeenCalledTimes(1)

    })
    it("should logout", () => {
        const req = { url: "/logout" }
        const res = {}
        routeMatch(req, res)
        expect(logout).toHaveBeenCalledTimes(1)

    })
    it("should num", () => {
        const req = { url: "/num" }
        const res = {}
        routeMatch(req, res)
        expect(requestGetNumPatients).toHaveBeenCalledTimes(1)

    })
    it("should getpeople", () => {
        const req = { url: "/getpeople" }
        const res = {}
        routeMatch(req, res)
        expect(getPeople).toHaveBeenCalledTimes(1)

    })
    it("should addpatient", () => {
        const req = { url: "/addpatient" }
        const res = {}
        routeMatch(req, res)
        expect(requestAddPatient).toHaveBeenCalledTimes(1)

    })
    it("should delete", () => {
        const req = { url: "/delete" }
        const res = {}
        routeMatch(req, res)
        expect(deletePatients).toHaveBeenCalledTimes(1)

    })
})