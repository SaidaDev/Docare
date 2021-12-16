import http from "http"
import { routeMatch } from "./modules/route-match"
import { loadDoctors } from "./modules/doctors"
import { loadPatients } from "./modules/patients"
import { loadSession } from "./modules/sessions"
loadSession()
loadPatients()
loadDoctors()
const server = http.createServer(routeMatch)
server.listen(3000)
