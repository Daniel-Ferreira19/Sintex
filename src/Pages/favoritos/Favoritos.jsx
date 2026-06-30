import { useContext } from "react";
import { FavoritarContext } from "../../Context/FavoritarContext";

export default function Favorita() {
    const { favoritos } = useContext(FavoritarContext);

    console.log("Favoritos:", favoritos);

    if (favoritos.length === 0) {
        return <h2>Nenhum restaurante favoritado.</h2>;
    }

    return (
        <>
            {favoritos.map(restaurante => (
                <div key={restaurante.id}>
                    <h2>{restaurante.name}</h2>
                    <p>{restaurante.description}</p>
                    <img
                        src={restaurante.image}
                        alt={restaurante.name}
                    />
                </div>
            ))}
        </>
    );
}