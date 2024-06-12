/// <reference types="vite/client" />

interface MyTree {
  _seq?: number
  id?: string
  label: string
  children?: Tree[]
}
interface MyRequest {
  url: string
  method: string
  requestBody?: string
  responseBody?: string
}
