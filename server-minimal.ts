import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json())

// Importar APENAS as rotas Supabase
import { registerSupabaseRoutes } from './server/routes-supabase'

console.log('🚀 Servidor minimalista - APENAS rotas Supabase')
registerSupabaseRoutes(app)

const port = 5000
app.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`)
})
