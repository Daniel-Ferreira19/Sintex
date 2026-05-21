import { useEffect, useState } from "react";
import "./Home.css";
import { getRestaurants } from "../../data/restaurants";

// Página principal que mostra restaurantes e cardápio.
export default function Home() {
  // Armazena os restaurantes carregados do mock / futuro backend.
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function loadRestaurants() {
      // Pega os restaurantes do arquivo de dados.
      const data = await getRestaurants();
      setRestaurants(data);
    }

    loadRestaurants();
  }, []);

  return (
    <main className="Home">
      <section className="HomeHeader">
        <h1>Restaurantes avaliados</h1>
        <p>
          Escolha seu restaurante com base nas avaliações, pontos positivos, pontos negativos e cardápio.
        </p>
      </section>

      <section className="RestaurantGrid">
        {restaurants.map((restaurant) => (
          <article key={restaurant.id} className="RestaurantCard">
            <h2>{restaurant.name}</h2>
            <div className="RestaurantMeta">
              <span className="Rating">Avaliação: {restaurant.rating}</span>
              <span>{restaurant.type}</span>
            </div>

            <div className="RestaurantNotice">
              <p>Pontos positivos e negativos são visíveis apenas para o administrador.</p>
            </div>

            <div>
              <h3>Cardápio</h3>
              <ul className="MenuList">
                {restaurant.menu.map((item) => (
                  <li key={item.dish} className="MenuItem">
                    <span>{item.dish}</span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}