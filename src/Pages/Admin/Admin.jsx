import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👇 IMPORTANTE: Importar o useNavigate
import "./Admin.css";
import { getRestaurants } from "../../data/imagens/restaurants";

export default function Admin() {
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate(); // 👇 Inicializa o redirecionamento

  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      const saved = localStorage.getItem("restaurantsWithFeedback");
      if (saved) {
        const savedData = JSON.parse(saved);
        const merged = data.map(
          (restaurant) =>
            savedData.find((r) => r.id === restaurant.id) || {
              ...restaurant,
              comments: [],
              likedBy: [],
            }
        );
        setRestaurants(merged);
      } else {
        setRestaurants(
          data.map((restaurant) => ({
            ...restaurant,
            comments: [],
            likedBy: [],
          }))
        );
      }
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

  const getCommentSentiment = (text) => {
    const positive = [
      "otimo",
      "bom",
      "gostei",
      "amei",
      "excelente",
      "adorei",
      "perfeito",
      "delicioso",
      "maravilhoso",
      "incrivel",
    ];
    const negative = [
      "ruim",
      "horrivel",
      "pessimo",
      "detestei",
      "pior",
      "chato",
      "lento",
      "caro",
      "desagradavel",
      "problema",
    ];

    const lower = text.toLowerCase();
    const posCount = positive.filter((w) => lower.includes(w)).length;
    const negCount = negative.filter((w) => lower.includes(w)).length;

    if (posCount > negCount) return "positive";
    if (negCount > posCount) return "negative";
    return "neutral";
  };

  const filteredComments = useMemo(() => {
    if (!selectedRestaurant?.comments) return [];
    if (filterType === "all") return selectedRestaurant.comments;
    return selectedRestaurant.comments.filter(
      (comment) => getCommentSentiment(comment.text) === filterType
    );
  }, [selectedRestaurant, filterType]);

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
              <div className="FeedbackFilter">
                <button
                  className={`FilterBtn ${filterType === "all" ? "active" : ""}`}
                  onClick={() => setFilterType("all")}
                >
                  Todos ({selectedRestaurant?.comments?.length || 0})
                </button>
                <button
                  className={`FilterBtn positive ${filterType === "positive" ? "active" : ""}`}
                  onClick={() => setFilterType("positive")}
                >
                  ✅ Positivos ({selectedRestaurant?.comments?.filter((c) => getCommentSentiment(c.text) === "positive").length || 0})
                </button>
                <button
                  className={`FilterBtn negative ${filterType === "negative" ? "active" : ""}`}
                  onClick={() => setFilterType("negative")}
                >
                  ❌ Negativos ({selectedRestaurant?.comments?.filter((c) => getCommentSentiment(c.text) === "negative").length || 0})
                </button>
              </div>
              <div className="CommentsList">
                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <div key={comment.id} className={`CommentCard ${getCommentSentiment(comment.text)}`}>
                      <div className="CommentHeader">
                        <strong>{comment.user}</strong>
                        <span className="CommentTime">{comment.timestamp}</span>
                      </div>
                      <p className="CommentText">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="NoComments">Nenhum feedback disponível nesta categoria.</p>
                )}
              </div>
            </div>

            <div className="LikesSection">
              <h3>Curtidas: {selectedRestaurant?.likedBy?.length || 0}</h3>
              {selectedRestaurant?.likedBy?.length > 0 ? (
                <p className="LikesList">{selectedRestaurant.likedBy.join(", ")}</p>
              ) : (
                <p className="NoLikes">Nenhuma curtida ainda.</p>
              )}
            </div>
          </>
        )}
      </article>
    </main>
  );
}