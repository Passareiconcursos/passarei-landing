import express from 'express'
import cookieParser from 'cookie-parser'
import { registerPrismaRoutes } from './server/routes-prisma'

const app = express()
app.use(express.json())
app.use(cookieParser())  // ← CRÍTICO!

registerPrismaRoutes(app)

const PORT = 5001

app.listen(PORT, () => {
  console.log(`🧪 Servidor de teste rodando na porta ${PORT}`)
  console.log(`✅ Teste: GET http://localhost:${PORT}/api/leads-v2`)
  console.log(`✅ Teste: POST http://localhost:${PORT}/api/leads-v2`)
})
