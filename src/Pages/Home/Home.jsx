import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Home.css";
import { getRestaurants } from "../../data/imagens/restaurants";

// 1. Função movida para fora (não depende de state, melhora a performance)
const calculateAverageRating = (feedbackList) => {
  if (!Array.isArray(feedbackList) || feedbackList.length === 0) return null;
  const sum = feedbackList.reduce((acc, feedback) => acc + Number(feedback.stars || 0), 0);
  return (sum / feedbackList.length).toFixed(1);
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // 2. Fetch simplificado com fallback de localStorage inline
  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      const savedData = JSON.parse(localStorage.getItem("restaurantsClientData") || "[]");

      const merged = data.map((restaurant) => {
        const savedItem = savedData.find((item) => item.id === restaurant.id);
        const feedback = savedItem?.feedback || restaurant.feedback || [];
        return { 
          ...restaurant, 
          feedback, 
          rating: calculateAverageRating(feedback) 
        };
      });
      setRestaurants(merged);
    }
    loadRestaurants();
  }, []);

  // 3. Filtro enxuto utilizando o método .some()
  const filteredRestaurants = useMemo(() => {
    if (!query) return restaurants;
    return restaurants.filter(({ name, type, description }) =>
      [name, type, description].some((field) => field.toLowerCase().includes(query))
    );
  }, [query, restaurants]);

  // 4. Lógica de feedback focada apenas na atualização da lista
  const handleAddFeedback = (restaurantId, newFeedback) => {
    const nextRestaurants = restaurants.map((restaurant) => {
      if (restaurant.id !== restaurantId) return restaurant;
      
      const nextFeedbackList = [...(restaurant.feedback || []), newFeedback];
      return { 
        ...restaurant, 
        feedback: nextFeedbackList, 
        rating: calculateAverageRating(nextFeedbackList) 
      };
    });

    setRestaurants(nextRestaurants);
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
          <div className="EmptyState"><p>Nenhum restaurante encontrado. Tente outra busca.</p></div>
        ) : (
          filteredRestaurants.map((restaurant) => (
<<<<<<< HEAD
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
=======
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              isOpen={selectedId === restaurant.id}
              onToggle={() => setSelectedId((prev) => (prev === restaurant.id ? null : restaurant.id))}
              onSubmitFeedback={handleAddFeedback}
            />
>>>>>>> a44358c7eeaf7315317aa209db3e1a470daaf5da
          ))
        )}
      </section>
    </main>
  );
}

// ----------------------------------------------------------------------
// 5. NOVO COMPONENTE: Gerencia o visual de cada restaurante e seu formulário
// ----------------------------------------------------------------------

function RestaurantCard({ restaurant, isOpen, onToggle, onSubmitFeedback }) {
  const [detailTab, setDetailTab] = useState("view");
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    onSubmitFeedback(restaurant.id, {
      id: `feedback-${Date.now()}`,
      user: form.name.trim(),
      comment: form.text.trim(),
      stars: Number(form.stars),
    });

    setForm({ name: "", stars: 5, text: "" });
    setDetailTab("view");
  };

  return (
    <article className="ClientCard">
      <div 
        className="ClientCardHeader" 
        style={{ backgroundImage: `url(${restaurant.ImageData || 'caminho/para/imagem-padrao.jpg'})` }}
      >
        <div className="HeaderOverlay"></div>
        <div className="HeaderContent">
          <div className="HeaderInfo">
            <h2>{restaurant.name}</h2>
            <p>{restaurant.categoria || restaurant.type}</p>
          </div>
          <button className="ActionBtn" type="button" onClick={onToggle}>
            {isOpen ? "Ocultar detalhes" : "Ver detalhes"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="ClientDetails">
          <p className="Description">{restaurant.description}</p>
          <div className="ClientMeta">
            <span>Avaliação: {restaurant.rating || "N/A"}</span>
            <span>{restaurant.type}</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(restaurant.endereco)}`}
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
                  {restaurant.menu?.map((item, index) => (
                    <li key={item.id || index}>
                      <span>{item.dish}</span>
                      <span>{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="FeedbackList">
                <h3>Feedback dos clientes</h3>
                {restaurant.feedback?.length > 0 ? (
                  restaurant.feedback.map((fb) => (
                    <div key={fb.id} className="FeedbackItem">
                      <div className="FeedbackHeader">
                        <strong>{fb.user}</strong>
                        <span>{fb.stars} estrelas</span>
                      </div>
                      <p>{fb.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="NoComments">Nenhum feedback disponível.</p>
                )}
              </div>
            </>
          ) : (
            <form className="FeedbackForm" onSubmit={handleSubmit}>
              <h3>Deixe seu feedback</h3>
              
              <div className="FormGroup">
                <label htmlFor={`name-${restaurant.id}`}>Nome</label>
                <input 
                  id={`name-${restaurant.id}`}
                  type="text" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="Seu nome" 
                />
              </div>

              <div className="FormGroup">
                <label htmlFor={`stars-${restaurant.id}`}>Avaliação</label>
                <select 
                  id={`stars-${restaurant.id}`}
                  value={form.stars} 
                  onChange={(e) => setForm({ ...form, stars: e.target.value })}
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>{v} estrela{v > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <div className="FormGroup">
                <label htmlFor={`text-${restaurant.id}`}>Comentário</label>
                <textarea 
                  id={`text-${restaurant.id}`}
                  rows={4} 
                  value={form.text} 
                  onChange={(e) => setForm({ ...form, text: e.target.value })} 
                  placeholder="Escreva seu feedback" 
                />
              </div>

              <button type="submit" className="SubmitFeedbackBtn">Enviar feedback</button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}