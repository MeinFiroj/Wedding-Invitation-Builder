import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router";
import { InvitationProvider } from "@/context/InvitationContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import TemplatesPage from "@/pages/TemplatesPage";
import EditorPage from "@/pages/EditorPage";
import InvitationPage from "@/pages/InvitationPage";
import MyInvitationsPage from "@/pages/MyInvitationsPage";
import Splash from "@/components/Splash";

function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash)
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <InvitationProvider>
      <Splash/>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="my-invitations" element={<MyInvitationsPage />} />
        </Route>
        <Route path="/invite/:id?" element={<InvitationPage />} />
      </Routes>
    </InvitationProvider>
  );
}
