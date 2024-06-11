/// <reference types="vite/client" />

interface Tree {
  id: string
  label: string
  children?: Tree[]
}
interface Request {
  url: string
  requestBody?: string
  responseBody?: string
}
