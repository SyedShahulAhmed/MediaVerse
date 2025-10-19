import Navbar from "./Navbar.jsx";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
}
