import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { getRestaurants } from "../../data/imagens/restaurants";

// 1. Lógica pura movida para fora do componente para melhorar a performance
const getCommentSentiment = (text) => {
  const positive = ["otimo", "bom", "gostei", "amei", "excelente", "adorei", "perfeito", "delicioso", "maravilhoso", "incrivel"];
  const negative = ["ruim", "horrivel", "pessimo", "detestei", "pior", "chato", "lento", "caro", "desagradavel", "problema"];

  const lower = String(text).toLowerCase();
  const posCount = positive.filter((w) => lower.includes(w)).length;
  const negCount = negative.filter((w) => lower.includes(w)).length;

  if (posCount > negCount) return "positive";
  if (negCount > posCount) return "negative";
  return "neutral";
};

export default function Admin() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  // 2. Carga de dados enxuta
  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      const savedData = JSON.parse(localStorage.getItem("restaurantsAdminData") || "[]");

      const merged = data.map((restaurant) => {
        const adminItem = savedData.find((item) => item.id === restaurant.id);
        return {
          ...restaurant,
          link: adminItem?.link || restaurant.link || "",
          menu: adminItem?.menu || restaurant.menu || [],
          likedBy: adminItem?.likedBy || restaurant.likedBy || [],
          comments: adminItem?.comments || restaurant.feedback?.map((item, index) => ({
            id: item.id ?? `feedback-${restaurant.id}-${index}`,
            user: item.user || `Cliente ${index + 1}`,
            text: item.comment || "",
            timestamp: item.stars ? `${item.stars} estrelas` : "",
          })) || [],
        };
      });

      setRestaurants(merged);
      if (merged.length > 0) setSelectedId(String(merged[0].id));
    }
    loadRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  const handleSaveRestaurant = (updatedRestaurant) => {
    const nextRestaurants = restaurants.map((r) =>
      r.id === updatedRestaurant.id ? updatedRestaurant : r
    );

    setRestaurants(nextRestaurants);
    localStorage.setItem(
      "restaurantsAdminData",
      JSON.stringify(nextRestaurants.map(({ id, link, menu, likedBy, comments }) => ({
        id, link, menu, likedBy, comments
      })))
    );
  };

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => String(r.id) === selectedId),
    [selectedId, restaurants]
  );

  return (
    <main className="AdminPage">
      <section className="AdminHeader">
        <h1>Área do Administrador</h1>
        <p>Escolha um restaurante, atualize o link e o cardápio, e confira feedbacks positivos e negativos.</p>
        <button onClick={handleLogout} className="LogoutButton">Sair do Sistema</button>
      </section>

      <article className="AdminCard">
        <div className="RestaurantSelect">
          <label htmlFor="restaurant-select">Restaurante do administrador</label>
          <select
            id="restaurant-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {selectedRestaurant && (
          // Usando a "key" com o ID força o React a resetar os states do componente filho ao trocar de restaurante
          <RestaurantEditor 
            key={selectedRestaurant.id} 
            restaurant={selectedRestaurant} 
            onSave={handleSaveRestaurant} 
          />
        )}
      </article>
    </main>
  );
}

// ----------------------------------------------------------------------
// COMPONENTE: Editor de Restaurante (Link e Menu)
// ----------------------------------------------------------------------
function RestaurantEditor({ restaurant, onSave }) {
  const [editLink, setEditLink] = useState(restaurant.link || "");
  const [editMenu, setEditMenu] = useState(restaurant.menu || []);

  const handleMenuItemChange = (index, field, value) => {
    setEditMenu((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const saveChanges = () => {
    onSave({ ...restaurant, link: editLink, menu: editMenu });
  };

  return (
    <>
      <h2>Dados do restaurante: {restaurant.name}</h2>
      <div className="RestaurantMeta">
        <span className="Rating">Avaliação: {restaurant.rating || "N/A"}</span>
        <span>{restaurant.type}</span>
      </div>
      <p className="Description">{restaurant.description}</p>

      <div className="RestaurantLinkSection">
        <label htmlFor="restaurant-link">Link do restaurante</label>
        <input
          id="restaurant-link"
          className="TextInput"
          type="url"
          placeholder="https://www.exemplo.com"
          value={editLink}
          onChange={(e) => setEditLink(e.target.value)}
        />
        {editLink && (
          <a href={editLink} target="_blank" rel="noreferrer" className="LinkButton">
            Abrir link do restaurante
          </a>
        )}
      </div>

      <div className="PointsGrid">
        <div className="PointsColumn positive">
          <h3>Pontos positivos</h3>
          <ul>
            {restaurant.positives?.length > 0 
              ? restaurant.positives.map((item) => <li key={item}>+ {item}</li>)
              : <li>Sem pontos positivos cadastrados.</li>}
          </ul>
        </div>
        <div className="PointsColumn negative">
          <h3>Pontos negativos</h3>
          <ul>
            {restaurant.negatives?.length > 0 
              ? restaurant.negatives.map((item) => <li key={item}>- {item}</li>)
              : <li>Sem pontos negativos cadastrados.</li>}
          </ul>
        </div>
      </div>

      <div className="MenuSection">
        <div className="MenuSectionHeader">
          <h3>Editar cardápio</h3>
          <button type="button" className="AddMenuBtn" onClick={() => setEditMenu([...editMenu, { dish: "", price: "", description: "" }])}>
            Adicionar item
          </button>
        </div>
        
        {editMenu.length === 0 ? (
          <p className="NoComments">Ainda não há itens no cardápio.</p>
        ) : (
          editMenu.map((item, index) => (
            <div key={index} className="MenuItem">
              <div className="MenuItemRow">
                <div>
                  <label>Prato</label>
                  <input className="TextInput" value={item.dish} onChange={(e) => handleMenuItemChange(index, "dish", e.target.value)} placeholder="Ex: Pizza Calabresa" />
                </div>
                <div>
                  <label>Preço</label>
                  <input className="TextInput" value={item.price} onChange={(e) => handleMenuItemChange(index, "price", e.target.value)} placeholder="Ex: R$ 39,90" />
                </div>
              </div>
              <div>
                <label>Descrição do prato</label>
                <textarea className="TextArea" rows={2} value={item.description || ""} onChange={(e) => handleMenuItemChange(index, "description", e.target.value)} placeholder="Descrição opcional do prato" />
              </div>
              <div className="MenuItemActions">
                <button type="button" className="MenuActionBtn danger" onClick={() => setEditMenu((prev) => prev.filter((_, i) => i !== index))}>
                  Remover item
                </button>
              </div>
            </div>
          ))
        )}
        <button type="button" className="SaveButton" onClick={saveChanges}>
          Salvar alterações do restaurante
        </button>
      </div>

      <FeedbackViewer comments={restaurant.comments || []} />

      <div className="LikesSection">
        <h3>Curtidas: {restaurant.likedBy?.length || 0}</h3>
        {restaurant.likedBy?.length > 0 ? (
          <p className="LikesList">{restaurant.likedBy.join(", ")}</p>
        ) : (
          <p className="NoLikes">Nenhuma curtida ainda.</p>
        )}
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// COMPONENTE: Visualizador de Feedbacks (Lógica de Sentimentos Isolada)
// ----------------------------------------------------------------------
function FeedbackViewer({ comments }) {
  const [filterType, setFilterType] = useState("all");

  const filteredComments = useMemo(() => {
    if (filterType === "all") return comments;
    return comments.filter((comment) => getCommentSentiment(comment.text) === filterType);
  }, [comments, filterType]);

  return (
    <div className="FeedbackSection">
      <h3>Feedback dos clientes</h3>
      <div className="FeedbackFilter">
        <button className={`FilterBtn ${filterType === "all" ? "active" : ""}`} onClick={() => setFilterType("all")}>
          Todos ({comments.length})
        </button>
        <button className={`FilterBtn positive ${filterType === "positive" ? "active" : ""}`} onClick={() => setFilterType("positive")}>
          ✅ Positivos ({comments.filter((c) => getCommentSentiment(c.text) === "positive").length})
        </button>
        <button className={`FilterBtn negative ${filterType === "negative" ? "active" : ""}`} onClick={() => setFilterType("negative")}>
          ❌ Negativos ({comments.filter((c) => getCommentSentiment(c.text) === "negative").length})
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
  );
}