import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Home.css";

const calculateAverageRating = (feedbackList) => {
  if (!Array.isArray(feedbackList) || feedbackList.length === 0) return null;
  const sum = feedbackList.reduce((acc, feedback) => acc + Number(feedback.stars || 5), 0);
  return (sum / feedbackList.length).toFixed(1);
};

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await fetch("http://localhost/Sintex/backend/api/restaurants.php");
        
        if (response.ok) {
          const result = await response.json();
          
          // Lendo corretamente a resposta do PHP
          const backendRestaurants = result.dados?.restaurantes || result.restaurantes || [];

          const formattedRestaurants = backendRestaurants.map(r => ({
            id: r.id,
            name: r.nome || "Restaurante sem nome",
            address: r.endereco || "",
            type: r.categoria || "Categoria não definida",
            description: r.descricao || "Nenhuma descrição cadastrada.",
            link: r.link || "",
            image: r.foto_url || "", // Puxando a foto salva pelo Administrador
            
            menu: r.cardapio ? r.cardapio.map(item => ({
              id: item.id,
              dish: item.nome_item,
              price: item.preco,
              description: item.descricao
            })) : [],
            
            feedback: r.feedbacks ? r.feedbacks.map(f => {
              let extractedStars = 5;
              let cleanText = f.comentario;
              
              const match = f.comentario.match(/^\[(\d) Estrelas\] (.*)/);
              if (match) {
                extractedStars = Number(match[1]);
                cleanText = match[2];
              }

              return {
                id: f.id,
                user: f.nome_cliente,
                comment: cleanText,
                stars: extractedStars,
                timestamp: new Date(f.criado_em).toLocaleDateString('pt-BR')
              };
            }) : []
          }));

          formattedRestaurants.forEach(r => {
            r.rating = calculateAverageRating(r.feedback) || "N/A";
          });

          setRestaurants(formattedRestaurants);
        }
      } catch (error) {
        console.error("Erro ao carregar restaurantes do servidor.", error);
      }
    }
    loadRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (!query) return restaurants;
    return restaurants.filter((restaurant) => {
      const nome = restaurant.name || "";
      const categoria = restaurant.type || "";
      const descricao = restaurant.description || "";

      return [nome, categoria, descricao].some((field) => 
        field.toLowerCase().includes(query)
      );
    });
  }, [query, restaurants]);

  // Envia o Feedback NOVO para o Banco de Dados
  const handleAddFeedback = async (restaurantId, newFeedback) => {
    const payload = {
      restaurante_id: restaurantId,
      nome_cliente: newFeedback.user,
      comentario: `[${newFeedback.stars} Estrelas] ${newFeedback.comment}`
    };

    try {
      const response = await fetch("http://localhost/Sintex/backend/api/feedbacks.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // A CORREÇÃO: Procurar por "sucesso" em vez de "success"
      if (result.sucesso || result.success) {
        alert("Obrigado pela tua avaliação!");

        const nextRestaurants = restaurants.map((r) => {
          if (r.id !== restaurantId) return r;
          
          const novoComentarioFormatado = {
            id: result.dados?.id || result.id || `temp-${Date.now()}`,
            user: newFeedback.user,
            comment: newFeedback.comment,
            stars: newFeedback.stars,
            timestamp: new Date().toLocaleDateString('pt-BR')
          };

          const nextFeedbackList = [novoComentarioFormatado, ...(r.feedback || [])];
          return { 
            ...r, 
            feedback: nextFeedbackList, 
            rating: calculateAverageRating(nextFeedbackList) 
          };
        });

        setRestaurants(nextRestaurants);
      } else {
        // A CORREÇÃO: Mostrar a "mensagem" em vez de "message"
        alert("Falha: " + (result.mensagem || result.message || "Erro desconhecido."));
      }
    } catch (error) {
      alert("Erro de ligação ao enviar o feedback.");
    }
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
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              isOpen={selectedId === restaurant.id}
              onToggle={() => setSelectedId((prev) => (prev === restaurant.id ? null : restaurant.id))}
              onSubmitFeedback={handleAddFeedback}
            />
          ))
        )}
      </section>
    </main>
  );
}

function RestaurantCard({ restaurant, isOpen, onToggle, onSubmitFeedback }) {
  const [detailTab, setDetailTab] = useState("view");
  const [form, setForm] = useState({ name: "", stars: 5, text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    onSubmitFeedback(restaurant.id, {
      user: form.name.trim(),
      comment: form.text.trim(),
      stars: Number(form.stars),
    });

    setForm({ name: "", stars: 5, text: "" });
    setDetailTab("view");
  };

  // Se o dono não colocou foto, usa essa bem legal de gastronomia de fundo
  const bannerImage = restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";

  return (
    <article className="ClientCard">
      <div 
        className="ClientCardHeader" 
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="HeaderOverlay"></div>
        <div className="HeaderContent">
          <div className="HeaderInfo">
            <h2>{restaurant.name}</h2>
            <p>{restaurant.type}</p>
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
            <span>Avaliação: {restaurant.rating || "N/A"} ⭐</span>
            <span>{restaurant.type}</span>
            <a
              href={`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(restaurant.address || restaurant.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ActionBtn MapLink"
            >
              Ver no mapa
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
                  {(!restaurant.menu || restaurant.menu.length === 0) && (
                    <p style={{marginTop: '10px', fontStyle: 'italic', color: '#666'}}>Cardápio ainda não cadastrado pelo dono.</p>
                  )}
                </ul>
              </div>

              <div className="FeedbackList">
                <h3>Feedback dos clientes</h3>
                <div className="CommentsCarousel">
                  {restaurant.feedback?.length > 0 ? (
                    restaurant.feedback.map((fb) => (
                      <div key={fb.id} className="CommentCard">
                        <div className="CommentHeader">
                          <strong>{fb.user}</strong>
                          <span>{fb.stars} ⭐</span>
                        </div>
                        <p className="CommentText">{fb.comment}</p>
                        <small style={{display: 'block', marginTop: '10px', color: '#666'}}>{fb.timestamp}</small>
                      </div>
                    ))
                  ) : (
                    <p className="NoComments">Nenhum feedback disponível. Seja o primeiro!</p>
                  )}
                </div>
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