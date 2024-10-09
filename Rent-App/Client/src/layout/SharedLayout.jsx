import { Outlet, useNavigation } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function SharedLayout() {
  const navigation = useNavigation;

  if (navigation.state === "loading") {
    return (
      <main>
        <div>Chargement...</div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}

export default SharedLayout;
