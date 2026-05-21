import { Outlet } from "react-router-dom";
import Banner from "../../Componentes/Banner/Banner";
export default function LayoutMenu() {
    return (
        <>
       <Banner />
 
       <Outlet />
       </>
    )
}