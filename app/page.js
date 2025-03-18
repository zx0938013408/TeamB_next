import Header from "@/components/Header";
// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import SportsMenu from "@/components/SportsMenu";
// import Activities from "@/components/Activities";
// import Shop from "@/components/Shop";
// import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="mainContainer">
      <div className="content">
        {/* 這裡放頁面內容 */}
      {/*
      <Hero />
      <SportsMenu />
      <Activities />
      <Shop />
      <Contact />
       */}
      </div>
      <Footer />
    </div>
    </>
  );
}