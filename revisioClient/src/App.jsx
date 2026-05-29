import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"
import DeviceList from "@/pages/DeviceList"
import DeviceDetail from "@/pages/DeviceDetail"
import Scan from "@/pages/Scan"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="devices" element={<DeviceList />} />
          <Route path="devices/:id" element={<DeviceDetail />} />
          <Route path="scan" element={<Scan />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
