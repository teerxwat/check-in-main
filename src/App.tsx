import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import IdleScreen from './screens/IdleScreen';
import LanguageSelection from './screens/LanguageSelection';
import CheckInChoice from './screens/CheckInChoice';
import BookingSearch from './screens/BookingSearch';
import PhoneInput from './screens/PhoneInput';
import BookingDetails from './screens/BookingDetails';
import IDScan from './screens/IDScan';
import Payment from './screens/Payment';
import KeyDispense from './screens/KeyDispense';
import HotelRules from './screens/HotelRules';
import CheckOutSearch from './screens/CheckOutSearch';
import CheckOutBill from './screens/CheckOutBill';
import CheckOutPayment from './screens/CheckOutPayment';
import CheckOutComplete from './screens/CheckOutComplete';
import CheckOutRating from './screens/CheckOutRating';
import CheckInMethod from './screens/CheckInMethod';
import RoomSelection from './screens/RoomSelection';
import CustomerInfo from './screens/CustomerInfo';
import IDSelection from './screens/IDSelection';
import NearbyFood from './screens/NearbyFood';
import TouristAttractions from './screens/TouristAttractions';
import ContactEmployee from './screens/ContactEmployee';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/idle" element={<IdleScreen />} />
          <Route path="/" element={<LanguageSelection />} />
          <Route path="/check-in-choice" element={<CheckInChoice />} />
          <Route path="/booking-search" element={<BookingSearch />} />
          <Route path="/phone-input" element={<PhoneInput />} />
          <Route path="/booking-details" element={<BookingDetails />} />
          <Route path="/id-select" element={<IDSelection />} />
          <Route path="/id-scan" element={<IDScan />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/hotel-rules" element={<HotelRules />} />
          <Route path="/key-dispense" element={<KeyDispense />} />

          {/* Walk-In Flow */}
          <Route path="/check-in-method" element={<CheckInMethod />} />
          <Route path="/room-selection" element={<RoomSelection />} />
          <Route path="/customer-info" element={<CustomerInfo />} />
          <Route path="/nearby-food" element={<NearbyFood />} />
          <Route path="/tourist-attractions" element={<TouristAttractions />} />
          <Route path="/contact-employee" element={<ContactEmployee />} />

          {/* Check Out Flow */}
          <Route path="/check-out-search" element={<CheckOutSearch />} />
          <Route path="/check-out-bill" element={<CheckOutBill />} />
          <Route path="/check-out-payment" element={<CheckOutPayment />} />
          <Route path="/check-out-rating" element={<CheckOutRating />} />
          <Route path="/check-out-complete" element={<CheckOutComplete />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
