const API_BASE = 'https://fakestoreapi.com';

export async function fetchJson(path) {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar dados da API');
    }
    return response.json();
}

export { API_BASE };