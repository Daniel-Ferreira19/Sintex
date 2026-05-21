// Arquivo de dados temporário para restaurantes.
// No futuro, trocaremos por uma API / banco de dados real.
const restaurants = [
  {
    id: "almoco-da-vila",
    name: "Almoço da Vila",
    rating: "4.8",
    type: "Brasileira · Delivery",
    description:
      "Restaurante tradicional com pratos caseiros e entrega rápida. Ideal para quem busca sabor e porções generosas.",
    positives: ["Entrega rápida", "Porções bem servidas", "Atendimento cordial"],
    negatives: ["Poucas opções vegetarianas", "Temperatura do prato varia"],
    feedback: [
      { user: "Fernanda", comment: "O tempero estava ótimo e a entrega chegou rápido.", stars: 5 },
      { user: "Pedro", comment: "Gosto muito do filé à parmegiana, mas o arroz poderia estar mais quente.", stars: 4 },
    ],
    menu: [
      { dish: "Filé à parmegiana", price: "R$ 42,90" },
      { dish: "Parmegiana de frango", price: "R$ 38,50" },
      { dish: "Lasanha de carne", price: "R$ 35,00" },
    ],
  },
  {
    id: "sabor-sushi-bar",
    name: "Sabor Sushi Bar",
    rating: "4.6",
    type: "Japonesa · Restaurante",
    description:
      "Sushi bar com peixes frescos, ambiente acolhedor e pratos elaborados. Bom para refeições leves e eventos em grupo.",
    positives: ["Peixe fresco", "Ambiente calmo", "Apresentação bonita"],
    negatives: ["Tempo de espera maior nos fins de semana", "Preços um pouco altos"],
    feedback: [
      { user: "Mariana", comment: "O combinado estava delicioso, mas demorei um pouco para ser atendida.", stars: 4 },
      { user: "Lucas", comment: "Excelente qualidade de peixe, recomendo o temaki salmão.", stars: 5 },
    ],
    menu: [
      { dish: "Temaki Salmão", price: "R$ 28,90" },
      { dish: "Combinado Especial", price: "R$ 89,90" },
      { dish: "Uramaki Hot", price: "R$ 34,00" },
    ],
  },
  {
    id: "bistro-da-praia",
    name: "Bistrô da Praia",
    rating: "4.5",
    type: "Peixes · Cozinha Caseira",
    description:
      "Especializado em frutos do mar frescos e pratos inspirados na culinária local. Ambiente descontraído e serviço atencioso.",
    positives: ["Peixes frescos", "Localização agradável", "Bom custo-benefício"],
    negatives: ["Músicas altas em horários de pico", "Estacionamento limitado"],
    feedback: [
      { user: "João", comment: "Adorei o atendimento e o prato principal estava muito saboroso.", stars: 5 },
      { user: "Bianca", comment: "Ambiente muito bonito, mas o tempo de espera poderia melhorar.", stars: 4 },
    ],
    menu: [
      { dish: "Moqueca de peixe", price: "R$ 59,90" },
      { dish: "Risoto de camarão", price: "R$ 48,50" },
      { dish: "Salada tropical", price: "R$ 24,00" },
    ],
  },
];

export async function getRestaurants() {
  // Retorna dados de restaurante.
  // Aqui pode ser trocado por uma chamada fetch para backend.
  return restaurants;
}

export default restaurants;
