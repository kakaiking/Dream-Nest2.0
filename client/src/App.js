import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
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

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
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



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
