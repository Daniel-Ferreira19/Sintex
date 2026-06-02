import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👇 IMPORTANTE: Importar o useNavigate
import "./Admin.css";
import { getRestaurants } from "../../data/imagens/restaurants";

export default function Admin() {
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // 👇 Inicializa o redirecionamento

  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      setRestaurants(data);
      if (!restaurantId && data.length > 0) {
        setRestaurantId(data[0].id);
      }
    }

    loadRestaurants();
  }, [restaurantId]);

  // 👇 FUNÇÃO DE LOGOUT: Limpa o acesso e joga pro login
  const handleLogout = () => {
    localStorage.removeItem("userRole"); 
    navigate("/login", { replace: true });
  };

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === restaurantId) || restaurants[0],
    [restaurantId, restaurants]
  );

  return (
    <main className="AdminPage">
      <section className="AdminHeader">
        <h1>Área do Administrador</h1>
        <p>Escolha o restaurante que representa o seu link e veja os feedbacks do seu público.</p>
        
        {/* 👇 BOTÃO DE LOGOUT ADICIONADO */}
        <button onClick={handleLogout} className="LogoutButton" style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Sair do Sistema
        </button>
      </section>

      <article className="AdminCard">
        <div className="RestaurantSelect">
          <label htmlFor="restaurant-select">Restaurante do administrador</label>
          <select
            id="restaurant-select"
            value={restaurantId}
            onChange={(event) => setRestaurantId(event.target.value)}
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRestaurant && (
          <>
            <h2>Dados do restaurante: {selectedRestaurant.name}</h2>
            <div className="RestaurantMeta">
              <span className="Rating">Avaliação: {selectedRestaurant.rating}</span>
              <span>{selectedRestaurant.type}</span>
            </div>
            <p className="Description">{selectedRestaurant.description}</p>

            <div className="PointsGrid">
              <div className="PointsColumn positive">
                <h3>Pontos positivos</h3>
                <ul>
                  {selectedRestaurant.positives.map((item) => (
                    <li key={item}>+ {item}</li>
                  ))}
                </ul>
              </div>
              <div className="PointsColumn negative">
                <h3>Pontos negativos</h3>
                <ul>
                  {selectedRestaurant.negatives.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="MenuSection">
              <h3>Cardápio do restaurante</h3>
              <ul>
                {selectedRestaurant.menu.map((item) => (
                  <li key={item.dish}>
                    <span>{item.dish}</span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="FeedbackSection">
              <h3>Feedback dos clientes</h3>
              <ul>
                {selectedRestaurant.feedback.map((item) => (
                  <li key={`${item.user}-${item.comment}`}>
                    <strong>{item.user}:</strong> {item.comment} <span>({item.stars} estrelas)</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </article>
    </main>
  );
}