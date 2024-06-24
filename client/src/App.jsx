import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./userContext";
import ProfilePage from "./pages/ProfilePage";
import AccommodationsPage from "./pages/AccommodationsPage";
import AccommodationsForm from "./components/AccommodationsForm";
import AccommodationPage from "./pages/AccommodationPage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/" element={<ProfilePage/>} />
          <Route path="/account/accommodations" element={<AccommodationsPage/>} />
          <Route path="/account/accommodations/new" element={<AccommodationsForm/>} />
          <Route path="/account/accommodations/:id" element={<AccommodationsForm/>} />
          <Route path="/accommodation/:id" element={<AccommodationPage/>} />
          <Route path="/account/bookings" element={<BookingsPage/>}/>
          <Route path="/account/bookings/:id" element={<BookingPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
