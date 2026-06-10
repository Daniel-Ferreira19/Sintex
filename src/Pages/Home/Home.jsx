import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Home.css";
import { getRestaurants } from "../../data/imagens/restaurants";

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [detailTab, setDetailTab] = useState("view");
  const [feedbackForm, setFeedbackForm] = useState({ name: "", stars: 5, text: "" });

  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      const saved = localStorage.getItem("restaurantsClientData");
      const savedData = saved ? JSON.parse(saved) : [];

      const merged = data.map((restaurant) => {
        const savedItem = savedData.find((item) => item.id === restaurant.id);
        return {
          ...restaurant,
          feedback: savedItem?.feedback || restaurant.feedback || [],
          rating: calculateAverageRating(savedItem?.feedback || restaurant.feedback || []),
        };
      });

      setRestaurants(merged);
    }
    loadRestaurants();
  }, []);

  const calculateAverageRating = (feedbackList) => {
    if (!Array.isArray(feedbackList) || feedbackList.length === 0) return null;
    const sum = feedbackList.reduce((acc, feedback) => acc + Number(feedback.stars || 0), 0);
    return (sum / feedbackList.length).toFixed(1);
  };

  const filteredRestaurants = useMemo(() => {
    const lower = query.toLowerCase();
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(lower) ||
      restaurant.type.toLowerCase().includes(lower) ||
      restaurant.description.toLowerCase().includes(lower)
    );
  }, [query, restaurants]);

  const handleFeedbackInputChange = (field, value) => {
    setFeedbackForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmitFeedback = (event, restaurantId) => {
    event.preventDefault();
    if (!feedbackForm.name.trim() || !feedbackForm.text.trim()) return;

    const nextRestaurants = restaurants.map((restaurant) => {
      if (restaurant.id !== restaurantId) return restaurant;

      const nextFeedback = {
        id: `feedback-${Date.now()}`,
        user: feedbackForm.name.trim(),
        comment: feedbackForm.text.trim(),
        stars: Number(feedbackForm.stars),
      };

      const nextFeedbackList = [...(restaurant.feedback || []), nextFeedback];

      return {
        ...restaurant,
        feedback: nextFeedbackList,
        rating: calculateAverageRating(nextFeedbackList),
      };
    });

    setRestaurants(nextRestaurants);
    setFeedbackForm({ name: "", stars: 5, text: "" });
    setDetailTab("view");
    localStorage.setItem(
      "restaurantsClientData",
      JSON.stringify(nextRestaurants.map(({ id, feedback }) => ({ id, feedback })))
    );
  };
  
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
              
              {/* O Header agora carrega a imagem de fundo */}
              <div className="ClientCardHeader"style={{ backgroundImage: `url(${restaurant.ImageData})` }}>
                {/* Película escura para dar contraste no texto */}
                <div className="HeaderOverlay"></div>
                
                {/* Conteúdo sobreposto à imagem */}
                <div className="HeaderContent">
                  <div className="HeaderInfo">
                    <h2>{restaurant.name}</h2>
                    <p>{restaurant.categoria || restaurant.type}</p>
                  </div>
                  <button
                    className="ActionBtn" type="button" onClick={() => {
                      if (selectedRestaurant?.id === restaurant.id) {
                        setSelectedRestaurant(null);
                      } else {
                        setSelectedRestaurant(restaurant);
                        setDetailTab("view");
                        setFeedbackForm({ name: "", stars: 5, text: "" });
                      }
                    }}>
                    {selectedRestaurant?.id === restaurant.id ? "Ocultar detalhes" : "Ver detalhes"}
                  </button>
                </div>
              </div>

              {/* Detalhes do Cardápio (Abre em baixo da imagem) */}
              {selectedRestaurant?.id === restaurant.id && (
                <div className="ClientDetails">
                  <p className="Description">{restaurant.description}</p>
                  <div className="ClientMeta">
                    <span>Avaliação: {restaurant.rating || "N/A"}</span>
                    <span>{restaurant.type}</span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.endereco)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ActionBtn MapLink"
                        >
                           📍Ver no mapa
                        </a>
                  </div>

                  <div className="DetailTabs">
                    <button
                      type="button"
                      className={`TabBtn ${detailTab === "view" ? "active" : ""}`}
                      onClick={() => setDetailTab("view")}
                    >
                      Cardápio e feedback
                    </button>
                    <button
                      type="button"
                      className={`TabBtn ${detailTab === "add" ? "active" : ""}`}
                      onClick={() => setDetailTab("add")}
                    >
                      Adicionar feedback
                    </button>
                  </div>

                  {detailTab === "view" ? (
                    <>
                      <div className="ClientMenu">
                        <h3>Cardápio</h3>
                        <ul>
                          {restaurant.menu?.map((item) => (
                            <li key={item.dish}>
                              <span>{item.dish}</span>
                              <span>{item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="FeedbackList">
                        <h3>Feedback dos clientes</h3>
                        {restaurant.feedback?.length > 0 ? (
                          restaurant.feedback.map((feedback) => (
                            <div key={feedback.id} className="FeedbackItem">
                              <div className="FeedbackHeader">
                                <strong>{feedback.user}</strong>
                                <span>{feedback.stars} estrelas</span>
                              </div>
                              <p>{feedback.comment}</p>
                            </div>
                          ))
                        ) : (
                          <p className="NoComments">Nenhum feedback disponível.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <form className="FeedbackForm" onSubmit={(event) => handleSubmitFeedback(event, restaurant.id)}>
                      <h3>Deixe seu feedback</h3>
                      <div className="FormGroup">
                        <label htmlFor={`feedback-name-${restaurant.id}`}>Nome</label>
                        <input
                          id={`feedback-name-${restaurant.id}`}
                          type="text"
                          value={feedbackForm.name}
                          onChange={(event) => handleFeedbackInputChange("name", event.target.value)}
                          placeholder="Seu nome"
                        />
                      </div>
                      <div className="FormGroup">
                        <label htmlFor={`feedback-stars-${restaurant.id}`}>Avaliação</label>
                        <select
                          id={`feedback-stars-${restaurant.id}`}
                          value={feedbackForm.stars}
                          onChange={(event) => handleFeedbackInputChange("stars", event.target.value)}
                        >
                          {[5, 4, 3, 2, 1].map((value) => (
                            <option key={value} value={value}>
                              {value} estrela{value > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="FormGroup">
                        <label htmlFor={`feedback-text-${restaurant.id}`}>Comentário</label>
                        <textarea
                          id={`feedback-text-${restaurant.id}`}
                          rows={4}
                          value={feedbackForm.text}
                          onChange={(event) => handleFeedbackInputChange("text", event.target.value)}
                          placeholder="Escreva seu feedback"
                        />
                      </div>
                      <button type="submit" className="SubmitFeedbackBtn">
                        Enviar feedback
                      </button>
                    </form>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
