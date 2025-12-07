import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CreateTicket from "./components/CreateTicket";
import Pending from "./components/Pending";
import Solved from "./components/Solved";
import MACIssue from "./components/MACIssue";
import BWIssue from "./components/BWIssue";
import AllTicket from "./components/AllTicket";
import IndividualReport from "./components/IndividualReport";
import AddNewUser from "./components/AddNewUser";
import PrivateRoute from "./components/PrivateRoute";
import DashboardOverView from "./components/DashboardOverView";
import Login from "./components/login";
import CreateUser from "./components/CreateUser";
import TicketDetaisById from "./components/TicketDetaisById";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboardview" element={<DashboardOverView />} />
          <Route path="create" element={<CreateTicket />} />
          <Route path="pending" element={<Pending />} />
          <Route path="solve" element={<Solved />} />
          <Route path="macissue" element={<MACIssue />} />
          <Route path="bwissue" element={<BWIssue />} />
          <Route path="allticket" element={<AllTicket />} />
          <Route path="individualreport" element={<IndividualReport />} />
          <Route path="addnewuser" element={<AddNewUser />} />
          <Route path="ticketdetailsbyid/:id" element={<TicketDetaisById />} />

          <Route index element={<Navigate to="create" replace />} />
        </Route>
        <Route path="createuser" element={<CreateUser />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
