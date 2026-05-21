import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Client.css";
import { getRestaurants } from "../../data/restaurants";

// Página do cliente, mostra restaurantes e filtro de busca.
export default function Client() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      setRestaurants(data);
    }

    loadRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    const lower = query.toLowerCase();
    // Filtra restaurantes pelo nome, tipo ou descrição.
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(lower) ||
      restaurant.type.toLowerCase().includes(lower) ||
      restaurant.description.toLowerCase().includes(lower)
    );
  }, [query, restaurants]);

  return (
    <main className="ClientPage">
      <section className="ClientHeader">
        <h1>Área do Cliente</h1>
        <p>Escolha um restaurante e veja a descrição e o cardápio completo.</p>
      </section>

      <section className="ClientList">
        <p className="SearchInfo">
          {query ? `Resultados para "${query}"` : "Todos os restaurantes disponíveis."}
        </p>

        {filteredRestaurants.length === 0 ? (
          <div className="EmptyState">
            <p>Nenhum restaurante encontrado. Tente outra busca.</p>
          </div>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <article key={restaurant.id} className="ClientCard">
              <div className="ClientCardHeader">
                <div>
                  <h2>{restaurant.name}</h2>
                  <p>{restaurant.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRestaurant(
                      selectedRestaurant?.id === restaurant.id ? null : restaurant
                    )
                  }
                >
                  {selectedRestaurant?.id === restaurant.id ? "Ocultar detalhes" : "Ver detalhes"}
                </button>
              </div>

              {selectedRestaurant?.id === restaurant.id && (
                <div className="ClientDetails">
                  <p className="Description">{restaurant.description}</p>
                  <div className="ClientMeta">
                    <span>Avaliação: {restaurant.rating}</span>
                    <span>{restaurant.type}</span>
                  </div>
                  <div className="ClientMenu">
                    <h3>Cardápio</h3>
                    <ul>
                      {restaurant.menu.map((item) => (
                        <li key={item.dish}>
                          <span>{item.dish}</span>
                          <span>{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
