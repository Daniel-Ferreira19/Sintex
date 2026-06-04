import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { getRestaurants } from "../../data/imagens/restaurants";

export default function Admin() {
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [editLink, setEditLink] = useState("");
  const [editMenu, setEditMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRestaurants() {
      const data = await getRestaurants();
      const saved = localStorage.getItem("restaurantsAdminData");
      const savedData = saved ? JSON.parse(saved) : [];

      const merged = data.map((restaurant) => {
        const adminItem = savedData.find((item) => item.id === restaurant.id);
        return {
          ...restaurant,
          link: adminItem?.link || restaurant.link || "",
          menu: adminItem?.menu || restaurant.menu,
          likedBy: adminItem?.likedBy || restaurant.likedBy || [],
          comments:
            adminItem?.comments ||
            restaurant.feedback?.map((item, index) => ({
              id: item.id ?? `feedback-${restaurant.id}-${index}`,
              user: item.user || `Cliente ${index + 1}`,
              text: item.comment || "",
              timestamp: item.stars ? `${item.stars} estrelas` : "",
            })) ||
            [],
        };
      });

      setRestaurants(merged);
      if (!restaurantId && merged.length > 0) {
        setRestaurantId(merged[0].id);
      }
    }

    loadRestaurants();
  }, []);

  useEffect(() => {
    const selected = restaurants.find((restaurant) => restaurant.id === Number(restaurantId));
    if (selected) {
      setEditLink(selected.link || "");
      setEditMenu(selected.menu.map((item) => ({ ...item })));
    }
  }, [restaurantId, restaurants]);

  // 👇 FUNÇÃO DE LOGOUT: Limpa o acesso e joga pro login
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === Number(restaurantId)) || restaurants[0],
    [restaurantId, restaurants]
  );

  const comments = selectedRestaurant?.comments || [];

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

    const lower = String(text).toLowerCase();
    const posCount = positive.filter((w) => lower.includes(w)).length;
    const negCount = negative.filter((w) => lower.includes(w)).length;

    if (posCount > negCount) return "positive";
    if (negCount > posCount) return "negative";
    return "neutral";
  };

  const filteredComments = useMemo(() => {
    if (!comments) return [];
    if (filterType === "all") return comments;
    return comments.filter((comment) => getCommentSentiment(comment.text) === filterType);
  }, [comments, filterType]);

  const saveAdminChanges = () => {
    if (!selectedRestaurant) return;

    const nextRestaurants = restaurants.map((restaurant) =>
      restaurant.id === selectedRestaurant.id
        ? { ...restaurant, link: editLink, menu: editMenu }
        : restaurant
    );

    setRestaurants(nextRestaurants);
    localStorage.setItem(
      "restaurantsAdminData",
      JSON.stringify(
        nextRestaurants.map(({ id, link, menu, likedBy, comments }) => ({
          id,
          link,
          menu,
          likedBy,
          comments,
        }))
      )
    );
  };

  const handleMenuItemChange = (index, field, value) => {
    setEditMenu((currentMenu) =>
      currentMenu.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddMenuItem = () => {
    setEditMenu((currentMenu) => [...currentMenu, { dish: "", price: "", description: "" }]);
  };

  const handleRemoveMenuItem = (index) => {
    setEditMenu((currentMenu) => currentMenu.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <main className="AdminPage">
      <section className="AdminHeader">
        <h1>Área do Administrador</h1>
        <p>Escolha um restaurante, atualize o link e o cardápio, e confira feedbacks positivos e negativos.</p>
        <button onClick={handleLogout} className="LogoutButton">
          Sair do Sistema
        </button>
      </section>

      <article className="AdminCard">
        <div className="RestaurantSelect">
          <label htmlFor="restaurant-select">Restaurante do administrador</label>
          <select
            id="restaurant-select"
            value={restaurantId.toString()}
            onChange={(event) => setRestaurantId(event.target.value)}
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id.toString()}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRestaurant && (
          <>
            <h2>Dados do restaurante: {selectedRestaurant.name}</h2>
            <div className="RestaurantMeta">
              <span className="Rating">Avaliação: {selectedRestaurant.rating || "N/A"}</span>
              <span>{selectedRestaurant.type}</span>
            </div>
            <p className="Description">{selectedRestaurant.description}</p>

            <div className="RestaurantLinkSection">
              <label htmlFor="restaurant-link">Link do restaurante</label>
              <input
                id="restaurant-link"
                className="TextInput"
                type="url"
                placeholder="https://www.exemplo.com"
                value={editLink}
                onChange={(event) => setEditLink(event.target.value)}
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
                  {selectedRestaurant.positives.length > 0 ? (
                    selectedRestaurant.positives.map((item) => <li key={item}>+ {item}</li>)
                  ) : (
                    <li>Sem pontos positivos cadastrados.</li>
                  )}
                </ul>
              </div>
              <div className="PointsColumn negative">
                <h3>Pontos negativos</h3>
                <ul>
                  {selectedRestaurant.negatives.length > 0 ? (
                    selectedRestaurant.negatives.map((item) => <li key={item}>- {item}</li>)
                  ) : (
                    <li>Sem pontos negativos cadastrados.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="MenuSection">
              <div className="MenuSectionHeader">
                <h3>Editar cardápio</h3>
                <button type="button" className="AddMenuBtn" onClick={handleAddMenuItem}>
                  Adicionar item
                </button>
              </div>
              {editMenu.length === 0 ? (
                <p className="NoComments">Ainda não há itens no cardápio.</p>
              ) : (
                editMenu.map((item, index) => (
                  <div key={`${item.dish}-${index}`} className="MenuItem">
                    <div className="MenuItemRow">
                      <div>
                        <label>Prato</label>
                        <input
                          className="TextInput"
                          type="text"
                          value={item.dish}
                          onChange={(event) => handleMenuItemChange(index, "dish", event.target.value)}
                          placeholder="Ex: Pizza Calabresa"
                        />
                      </div>
                      <div>
                        <label>Preço</label>
                        <input
                          className="TextInput"
                          type="text"
                          value={item.price}
                          onChange={(event) => handleMenuItemChange(index, "price", event.target.value)}
                          placeholder="Ex: R$ 39,90"
                        />
                      </div>
                    </div>
                    <div>
                      <label>Descrição do prato</label>
                      <textarea
                        className="TextArea"
                        rows={2}
                        value={item.description || ""}
                        onChange={(event) => handleMenuItemChange(index, "description", event.target.value)}
                        placeholder="Descrição opcional do prato"
                      />
                    </div>
                    <div className="MenuItemActions">
                      <button
                        type="button"
                        className="MenuActionBtn danger"
                        onClick={() => handleRemoveMenuItem(index)}
                      >
                        Remover item
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button type="button" className="SaveButton" onClick={saveAdminChanges}>
                Salvar alterações do restaurante
              </button>
            </div>

            <div className="FeedbackSection">
              <h3>Feedback dos clientes</h3>
              <div className="FeedbackFilter">
                <button
                  className={`FilterBtn ${filterType === "all" ? "active" : ""}`}
                  onClick={() => setFilterType("all")}
                >
                  Todos ({comments.length})
                </button>
                <button
                  className={`FilterBtn positive ${filterType === "positive" ? "active" : ""}`}
                  onClick={() => setFilterType("positive")}
                >
                  ✅ Positivos ({comments.filter((c) => getCommentSentiment(c.text) === "positive").length})
                </button>
                <button
                  className={`FilterBtn negative ${filterType === "negative" ? "active" : ""}`}
                  onClick={() => setFilterType("negative")}
                >
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