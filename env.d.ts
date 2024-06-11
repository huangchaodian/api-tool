/// <reference types="vite/client" />

interface MyTree {
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
