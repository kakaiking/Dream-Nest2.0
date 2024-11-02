import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import {jwtDecode} from "jwt-decode";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage"; // for admin-specific content
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";
import TripList from "./pages/TripList";
import WishList from "./pages/WishList";
import PropertyList from "./pages/PropertyList";
import ReservationList from "./pages/ReservationList";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import MyProfile from "./pages/MyProfile";
import FaqPage from "./pages/FaqPage";
import CreateUpdate from "./components/CreateUpdate";
import UpdateDetails from "./components/UpdateDetails";
import FileReturnsPage from "./pages/FileReturnsPage";
import ReturnLogs from "./pages/ReturnLogs";
import UserDetails from './pages/UserDetails';
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotificationsPage from "./pages/NotificationsPage";
import WithdrawPage from "./pages/WithdrawPage";
import MyWithdrawals from "./pages/MyWithdrawals";
import MyProjectWithdrawals from "./pages/MyProjectWithdrawals";
import TopUpPage from "./pages/TopUpPage";
import MyTopUps from "./pages/MyTopUps";
import MyProjectTopUps from "./pages/MyProjectTopUps";
import MyDashboard from "./pages/MyDashboard";


function App() {
  // Simulate getting the JWT token from local storage or a Redux store
  const token = useSelector((state) => state.token);
  const user = token ? jwtDecode(token) : null;
  const isAdmin = user && user.isAdmin;
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Admin Route - Only accessible by the admin */}
          <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/update/:updateId" element={<UpdateDetails />} />
          <Route path="/create-update/:listingId" element={<CreateUpdate />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/:userId/trips" element={<TripList />} />
          <Route path="/:userId/wishList" element={<WishList />} />
          <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
          <Route path="/:userId/details" element={<MyProfile />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/:userId/fileReturns" element={<FileReturnsPage />} />
          <Route path="/:userId/return-logs" element={<ReturnLogs />} />
          <Route path="/:userId/notifications" element={<NotificationsPage />} />
          <Route path="/:userId/withdraw" element={<WithdrawPage />} />
          <Route path="/:userId/my-withdrawals" element={<MyWithdrawals />} />
          <Route path="/:userId/my-project-withdrawals" element={<MyProjectWithdrawals />} />
          <Route path="/:userId/topup" element={<TopUpPage />} />
          <Route path="/:userId/my-topups" element={<MyTopUps />} />
          <Route path="/:userId/my-project-topups" element={<MyProjectTopUps />} />
          <Route path="/:userId/dashboard" element={<MyDashboard />} />



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
