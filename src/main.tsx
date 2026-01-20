import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./auth/AuthContext"
import { BossDataProvider } from "./boss/BossDataContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BossDataProvider>
          <App />
        </BossDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
