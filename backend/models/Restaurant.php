<?php
/**
 * ARQUIVO: models/Restaurant.php
 * PROPÓSITO: Gerenciar restaurantes
 * 
 * EXPLICAÇÃO:
 * Métodos para:
 * - Listar restaurantes (com filtros)
 * - Obter detalhes de um restaurante
 * - Criar novo restaurante
 * - Editar restaurante
 * - Deletar restaurante
 * - Calcular média de avaliações
 */

require_once __DIR__ . '/../config/db.php';

class Restaurant {
    private $pdo;
    
    public function __construct() {
        $this->pdo = getDB();
    }
    
    /**
     * MÉTODO: listar()
     * Lista restaurantes com filtros opcionais
     * 
     * @param array $filtros - ['cidade' => '', 'categoria' => '', 'busca' => '']
     * @param int $limite - Quantidade de resultados por página
     * @param int $pagina - Número da página
     * @return array - Lista de restaurantes
     */
    public function listar($filtros = [], $limite = 10, $pagina = 1) {
        try {
            $offset = ($pagina - 1) * $limite;
            
            $sql = "SELECT * FROM restaurants WHERE 1=1";
            $parametros = [];
            
            // FILTRO: Por cidade
            if (!empty($filtros['cidade'])) {
                $sql .= " AND city LIKE ?";
                $parametros[] = "%{$filtros['cidade']}%";
            }
            
            // FILTRO: Por categoria
            if (!empty($filtros['categoria'])) {
                $sql .= " AND category LIKE ?";
                $parametros[] = "%{$filtros['categoria']}%";
            }
            
            // FILTRO: Busca por nome ou endereço
            if (!empty($filtros['busca'])) {
                $sql .= " AND (name LIKE ? OR address LIKE ?)";
                $parametros[] = "%{$filtros['busca']}%";
                $parametros[] = "%{$filtros['busca']}%";
            }
            
            // Ordenar por avaliação
            $sql .= " ORDER BY rating DESC LIMIT ? OFFSET ?";
            $parametros[] = $limite;
            $parametros[] = $offset;
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($parametros);
            
            return $stmt->fetchAll();
            
        } catch (PDOException $e) {
            return [];
        }
    }
    
    /**
     * MÉTODO: obter()
     * Obtém detalhes completos de um restaurante
     * 
     * @param int $id - ID do restaurante
     * @return array - Dados do restaurante com cardápio e horários
     */
    public function obter($id) {
        try {
            // Obter dados principais
            $stmt = $this->pdo->prepare("SELECT * FROM restaurants WHERE id = ?");
            $stmt->execute([$id]);
            $restaurante = $stmt->fetch();
            
            if (!$restaurante) return null;
            
            // Obter cardápio
            $stmt = $this->pdo->prepare(
                "SELECT mc.id, mc.name, mc.description, 
                        GROUP_CONCAT(
                            JSON_OBJECT('id', mi.id, 'name', mi.name, 'description', mi.description, 'price', mi.price, 'image_url', mi.image_url)
                        ) as items
                 FROM menu_categories mc
                 LEFT JOIN menu_items mi ON mi.menu_category_id = mc.id
                 WHERE mc.restaurant_id = ?
                 GROUP BY mc.id
                 ORDER BY mc.order"
            );
            $stmt->execute([$id]);
            $restaurante['cardapio'] = $stmt->fetchAll();
            
            // Obter horários
            $stmt = $this->pdo->prepare(
                "SELECT day_of_week, opening_time, closing_time, is_closed 
                 FROM business_hours 
                 WHERE restaurant_id = ? 
                 ORDER BY day_of_week"
            );
            $stmt->execute([$id]);
            $restaurante['horarios'] = $stmt->fetchAll();
            
            // Obter uploads de cardápio
            $stmt = $this->pdo->prepare(
                "SELECT id, file_type, file_url, file_name, uploaded_at 
                 FROM menu_uploads 
                 WHERE restaurant_id = ?"
            );
            $stmt->execute([$id]);
            $restaurante['uploads'] = $stmt->fetchAll();
            
            return $restaurante;
            
        } catch (PDOException $e) {
            return null;
        }
    }
    
    /**
     * MÉTODO: criar()
     * Cria um novo restaurante
     * 
     * @param int $user_id - ID do proprietário
     * @param array $dados - Dados do restaurante
     * @return array - Resposta com ID do novo restaurante
     */
    public function criar($user_id, $dados) {
        try {
            $sql = "INSERT INTO restaurants (
                        user_id, name, description, category, phone, whatsapp, 
                        instagram, website, address, city, state, zip_code, 
                        latitude, longitude, google_maps_url, logo_url, cover_image_url
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->pdo->prepare($sql);
            
            $stmt->execute([
                $user_id,
                $dados['name'] ?? null,
                $dados['description'] ?? null,
                $dados['category'] ?? null,
                $dados['phone'] ?? null,
                $dados['whatsapp'] ?? null,
                $dados['instagram'] ?? null,
                $dados['website'] ?? null,
                $dados['address'] ?? null,
                $dados['city'] ?? null,
                $dados['state'] ?? null,
                $dados['zip_code'] ?? null,
                $dados['latitude'] ?? null,
                $dados['longitude'] ?? null,
                $dados['google_maps_url'] ?? null,
                $dados['logo_url'] ?? null,
                $dados['cover_image_url'] ?? null
            ]);
            
            return [
                'sucesso' => true,
                'mensagem' => 'Restaurante criado',
                'id' => $this->pdo->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: atualizar()
     * Atualiza dados do restaurante
     * 
     * @param int $id - ID do restaurante
     * @param int $user_id - ID do proprietário (verificação)
     * @param array $dados - Dados a atualizar
     * @return array - Resposta de sucesso ou erro
     */
    public function atualizar($id, $user_id, $dados) {
        try {
            // Verificar se pertence ao usuário
            $stmt = $this->pdo->prepare("SELECT user_id FROM restaurants WHERE id = ?");
            $stmt->execute([$id]);
            $restaurante = $stmt->fetch();
            
            if (!$restaurante || $restaurante['user_id'] != $user_id) {
                return ['sucesso' => false, 'mensagem' => 'Acesso negado'];
            }
            
            $permitidos = [
                'name', 'description', 'category', 'phone', 'whatsapp',
                'instagram', 'website', 'address', 'city', 'state',
                'zip_code', 'latitude', 'longitude', 'google_maps_url',
                'logo_url', 'cover_image_url'
            ];
            
            $atualizacoes = [];
            $valores = [];
            
            foreach ($permitidos as $campo) {
                if (isset($dados[$campo])) {
                    $atualizacoes[] = "$campo = ?";
                    $valores[] = $dados[$campo];
                }
            }
            
            if (empty($atualizacoes)) {
                return ['sucesso' => false, 'mensagem' => 'Nenhum campo para atualizar'];
            }
            
            $valores[] = $id;
            $sql = "UPDATE restaurants SET " . implode(', ', $atualizacoes) . " WHERE id = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($valores);
            
            return ['sucesso' => true, 'mensagem' => 'Restaurante atualizado'];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: deletar()
     * Deleta um restaurante
     * 
     * @param int $id - ID do restaurante
     * @param int $user_id - ID do proprietário (verificação)
     * @return array - Resposta de sucesso ou erro
     */
    public function deletar($id, $user_id) {
        try {
            // Verificar propriedade
            $stmt = $this->pdo->prepare("SELECT user_id FROM restaurants WHERE id = ?");
            $stmt->execute([$id]);
            $restaurante = $stmt->fetch();
            
            if (!$restaurante || $restaurante['user_id'] != $user_id) {
                return ['sucesso' => false, 'mensagem' => 'Acesso negado'];
            }
            
            // Deletar (as imagens devem ser deletadas manualmente)
            $stmt = $this->pdo->prepare("DELETE FROM restaurants WHERE id = ?");
            $stmt->execute([$id]);
            
            return ['sucesso' => true, 'mensagem' => 'Restaurante deletado'];
            
        } catch (PDOException $e) {
            return ['sucesso' => false, 'mensagem' => $e->getMessage()];
        }
    }
    
    /**
     * MÉTODO: atualizarAvaliacao()
     * Calcula e atualiza a média de avaliações
     * 
     * @param int $restaurant_id - ID do restaurante
     * @return void
     */
    public function atualizarAvaliacao($restaurant_id) {
        try {
            // Calcular média e contar avaliações
            $stmt = $this->pdo->prepare(
                "SELECT AVG(rating) as media, COUNT(*) as total 
                 FROM ratings 
                 WHERE restaurant_id = ?"
            );
            $stmt->execute([$restaurant_id]);
            $resultado = $stmt->fetch();
            
            // Atualizar restaurante
            $stmt = $this->pdo->prepare(
                "UPDATE restaurants 
                 SET rating = ?, total_ratings = ? 
                 WHERE id = ?"
            );
            $stmt->execute([
                round($resultado['media'], 2) ?? 0,
                $resultado['total'] ?? 0,
                $restaurant_id
            ]);
            
        } catch (PDOException $e) {
            // Silenciosamente falha
        }
    }
}
?>
