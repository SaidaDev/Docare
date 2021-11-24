import http from 'http'
import { routeMatch } from './modules/route-match'
const server = http.createServer(routeMatch)
server.listen(3000)