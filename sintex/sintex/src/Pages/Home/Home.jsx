import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Home.css";
import { getRestaurants } from "../../data/imagens/restaurants";

const generateUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `Usuario_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const hasQuery = searchParams.has("q");
  const query = searchParams.get("q") || "";
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [feedbackOpenId, setFeedbackOpenId] = useState(null);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [commentCarouselIndex, setCommentCarouselIndex] = useState({});
  const userId = generateUserId();

  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      const saved = localStorage.getItem("restaurantsWithFeedback");
      if (saved) {
        setRestaurants(JSON.parse(saved));
      } else {
        setRestaurants(
          data.map((restaurant) => ({
            ...restaurant,
            comments: [],
            likedBy: [],
          }))
        );
      }
    }
    loadRestaurants();
  }, []);

  const handleLike = (restaurantId) => {
    setRestaurants((prevRestaurants) => {
      const updated = prevRestaurants.map((restaurant) =>
        restaurant.id === restaurantId &&
        !restaurant.likedBy.includes(userId)
          ? {
              ...restaurant,
              likedBy: [...(restaurant.likedBy || []), userId],
            }
          : restaurant
      );
      localStorage.setItem("restaurantsWithFeedback", JSON.stringify(updated));
      return updated;
    });
  };

  const handleFeedbackSubmit = (restaurantId) => {
    const text = feedbackDraft.trim();
    if (!text) return;

    setRestaurants((prevRestaurants) => {
      const updated = prevRestaurants.map((restaurant) =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              comments: [
                ...(restaurant.comments || []),
                {
                  id: Date.now(),
                  user: userId,
                  text,
                  timestamp: new Date().toLocaleString("pt-BR"),
                },
              ],
            }
          : restaurant
      );
      localStorage.setItem("restaurantsWithFeedback", JSON.stringify(updated));
      return updated;
    });
    setFeedbackDraft("");
    setCommentCarouselIndex((prev) => ({ ...prev, [restaurantId]: 0 }));
  };

  const handleCarouselNext = (restaurantId, totalComments) => {
    setCommentCarouselIndex((prev) => {
      const current = prev[restaurantId] || 0;
      return {
        ...prev,
        [restaurantId]: (current + 1) % totalComments,
      };
    });
  };

  const handleCarouselPrev = (restaurantId, totalComments) => {
    setCommentCarouselIndex((prev) => {
      const current = prev[restaurantId] || 0;
      return {
        ...prev,
        [restaurantId]: current === 0 ? totalComments - 1 : current - 1,
      };
    });
  };

  const filteredRestaurants = useMemo(() => {
    if (!hasQuery) {
      return restaurants;
    }

    if (!query.trim()) {
      return [];
    }

    const lower = query.toLowerCase();
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().startsWith(lower)
    );
  }, [hasQuery, query, restaurants]);

  return (
    <main className="ClientPage">
      <section className="ClientHeader">
        <h1>Área do Cliente</h1>
        <p>Escolha um restaurante e veja a descrição e o cardápio completo.</p>
      </section>

      <section className="ClientList">
        <p className="SearchInfo">
          {!hasQuery
            ? "Todos os restaurantes disponíveis."
            : filteredRestaurants.length > 0
            ? `Resultados para "${query}"`
            : "Nenhum restaurante encontrado. Tente outra busca."}
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
                  <div className="HeaderButtons">
                    <button
                      className="ActionBtn"
                      type="button"
                      onClick={() =>
                        setSelectedRestaurantId(
                          selectedRestaurantId === restaurant.id ? null : restaurant.id
                        )
                      }
                    >
                      {selectedRestaurantId === restaurant.id ? "Ocultar detalhes" : "Ver detalhes"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalhes do Cardápio (Abre em baixo da imagem) */}
              {selectedRestaurantId === restaurant.id && (
                <div className="ClientDetails">
                  <p className="Description">{restaurant.description}</p>
                  <div className="ClientMeta">
                    <span>Avaliação: {restaurant.rating || "N/A"}</span>
                    <span>{restaurant.type}</span>
                  </div>
                  <div className="ClientActions">
                    <button
                      className="SecondaryBtn"
                      type="button"
                      onClick={() =>
                        setFeedbackOpenId(
                          feedbackOpenId === restaurant.id ? null : restaurant.id
                        )
                      }
                    >
                      Dar Feedback
                    </button>
                    <button
                      className={`LikeButton ${restaurant.likedBy?.includes(userId) ? "liked" : ""}`}
                      type="button"
                      onClick={() => handleLike(restaurant.id)}
                      disabled={restaurant.likedBy?.includes(userId)}
                    >
                      {restaurant.likedBy?.includes(userId)
                        ? `❤️ Curtido`
                        : `👍 ${restaurant.likedBy?.length || 0}`}
                    </button>
                  </div>

                  {feedbackOpenId === restaurant.id && (
                    <div className="FeedbackForm">
                      <textarea
                        value={feedbackDraft}
                        onChange={(event) => setFeedbackDraft(event.target.value)}
                        placeholder="Escreva sua opinião sobre este restaurante..."
                      />
                      <button
                        type="button"
                        className="SubmitFeedbackBtn"
                        onClick={() => handleFeedbackSubmit(restaurant.id)}
                      >
                        Enviar feedback
                      </button>
                    </div>
                  )}

                  <div className="FeedbackSection">
                    <h3>Opiniões ({restaurant.comments?.length || 0})</h3>
                    {restaurant.comments?.length > 0 ? (
                      <div className="CommentsCarousel">
                        <button
                          className="CarouselBtn prev"
                          onClick={() =>
                            handleCarouselPrev(
                              restaurant.id,
                              restaurant.comments.length
                            )
                          }
                        >
                          ❮
                        </button>
                        <div className="CarouselContent">
                          {(() => {
                            const index = commentCarouselIndex[restaurant.id] || 0;
                            const comment = restaurant.comments[index];
                            return (
                              <div key={comment.id} className="FeedbackItem">
                                <strong>{comment.user}</strong>
                                <span className="FeedbackTime">
                                  {comment.timestamp}
                                </span>
                                <p>{comment.text}</p>
                              </div>
                            );
                          })()}
                        </div>
                        <button
                          className="CarouselBtn next"
                          onClick={() =>
                            handleCarouselNext(
                              restaurant.id,
                              restaurant.comments.length
                            )
                          }
                        >
                          ❯
                        </button>
                      </div>
                    ) : (
                      <p className="NoFeedback">
                        Seja o primeiro a deixar sua opinião.
                      </p>
                    )}
                  </div>

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
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}