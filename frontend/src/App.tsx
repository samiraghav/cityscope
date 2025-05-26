import {Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import Navbar from './pages/NavBar';
import UserProfile from './pages/UserProfile';
import NotFound from "./pages/NotFound";
import UserProfilePage from "./pages/UserProfilePage";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/signin', '/signup'];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </AppLayout>
  );
}

export default App;
