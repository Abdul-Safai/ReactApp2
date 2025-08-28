// App: routes for Home (create/list) and Detail (read-only)
import { Routes, Route } from "react-router-dom";
import ReservationsHome from "./pages/ReservationsHome.jsx";
import ReservationDetail from "./pages/ReservationDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ReservationsHome />} />
      <Route path="/reservation/:id" element={<ReservationDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound(){
  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginTop:0}}>404 — Not Found</h2>
        <p>Try the <a href="/">home page</a>.</p>
      </div>
    </div>
  );
}
