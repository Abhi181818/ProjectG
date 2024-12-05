import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import Login from './pages/Login';
import Home from './pages/Home/Home';
import Signup from './pages/SignUp/SignUp';
import About from './pages/About/About';
import Footer from './components/Footer/Footer';
import PageTransition from './components/PageTransition/PageTransition'; 
import { Toaster, toast } from 'sonner'
import Profile from './pages/Profile/Profile';
import Bookings from './pages/Bookings/Bookings';
import Interests from './components/Interests/Interests';
import AllVenues from './components/Venues/AllVenues';
import BookingPage from './pages/BookingPage/BookingPage';

function App() {
  return (
    <UserProvider>
      <Toaster position="top-center" richColors closeButton/>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <MainContent />
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

const MainContent = () => {
  const location = useLocation();

  return (
    <main className="flex-grow">
      <PageTransition location={location}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path='/bookings' element={<Bookings />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/venues" element={<AllVenues />} />
          <Route path='/book/:activityName' element={<BookingPage/>}/>
        </Routes>
      </PageTransition>
    </main>
  );
};

export default App;
