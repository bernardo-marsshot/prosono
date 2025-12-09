import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RegisterForm from './components/auth/RegisterForm';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { AuthProvider } from './hooks/useAuth';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import License from './pages/License';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import SleepAssessment from './pages/SleepAssessment';
import SleepAttitudeSurvey from './pages/SleepAttitudeSurvey';
import SleepinessFrequencySurvey from './pages/SleepinessFrequencySurvey';
import SleepTracking from './pages/SleepTracking';
import Terms from './pages/Terms';
import './styles/globals.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/licences" element={<License />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assessments"
                element={
                  <ProtectedRoute>
                    <SleepAssessment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleep-tracking"
                element={
                  <ProtectedRoute>
                    <SleepTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleep-attitude-survey"
                element={
                  <ProtectedRoute>
                    <SleepAttitudeSurvey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleepiness-frequency-survey"
                element={
                  <ProtectedRoute>
                    <SleepinessFrequencySurvey />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
