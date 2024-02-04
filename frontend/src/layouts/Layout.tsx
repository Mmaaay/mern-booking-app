import { Outlet } from "react-router-dom";
import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"

const Layout = () =>{
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="container mx-auto py-10 flex-1"><Outlet /></div>
            <Footer />
        </div>
    )
}

export default Layout