import { createContext } from "react";

export default function FavoritarProvider({children}){
    const [favoritos, setFavoritos] = useState([]);
    return (
        <FavoritosContext.Provider value={{ favoritos, setFavoritos }}>
            {children}
        </FavoritosContext.Provider>
    )
}
