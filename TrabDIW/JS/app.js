const apiKey = "61f5c23ac107c76ebf930a870d63113c";

const salvarNoJSONServer = async (endpoint, dados) => {
    try {
        for (const item of dados) {
            const response = await fetch(`http://localhost:3001/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (!response.ok) {
                console.error(`Erro ao salvar ${item.name || item.title} no JSON Server.`);
            }
        }
        console.log(`Dados salvos no JSON Server em /${endpoint}`);
    } catch (error) {
        console.error(`Erro ao salvar dados no JSON Server (${endpoint}):`, error);
    }
};

const carregarSeriesPopulares = async () => {
    try {
        const jsonResponse = await fetch("http://localhost:3001/seriesPopulares");
        let seriesPopulares = await jsonResponse.json();

        if (seriesPopulares.length === 0) {
            console.log("Carregando séries populares do TMDb...");
            const tmdbResponse = await fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=pt-BR`);
            const tmdbData = await tmdbResponse.json();

            seriesPopulares = tmdbData.results.map(serie => ({
                id: serie.id,
                name: serie.name || serie.title,
                poster_path: serie.poster_path,
                overview: serie.overview,
                first_air_date: serie.first_air_date,
            }));

            await salvarNoJSONServer("seriesPopulares", seriesPopulares);
        }

        const carrossel = document.getElementById("seriesCarrossel");
        carrossel.innerHTML = seriesPopulares.map((serie, index) => `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="row align-items-center">
                    <div class="col-md-4 text-center">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" 
                             alt="${serie.name}" 
                             class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <h3 class="text-yellow">${serie.name}</h3>
                        <p><strong>Data de Lançamento:</strong> ${serie.first_air_date || "N/A"}</p>
                        <p>${(serie.overview || "Descrição não disponível").substring(0, 150)}...</p>
                        <button class="btn btn-warning" onclick="verDetalhes(${serie.id}, 'tv')">Ver Detalhes</button>
                    </div>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar as séries populares:", error);
    }
};

const carregarNovasSeries = async () => {
    try {
        // Faz a chamada para a API TMDB
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=pt-BR`
        );
        const data = await response.json();

        // Verifica se há resultados
        if (data.results && data.results.length > 0) {
            const novasSeries = document.getElementById("novasSeries");
            // Renderiza os cards de cada série
            novasSeries.innerHTML = data.results
                .slice(0, 8) // Limita a 8 séries para evitar excesso
                .map((serie) => `
                    <div class="col-md-3 mb-4">
                        <div class="card bg-dark text-yellow">
                            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">${(serie.overview || "Descrição não disponível").substring(0, 100)}...</p>
                                <a href="detalheFilme.html?id=${serie.id}&type=tv" class="btn btn-warning">Ver mais</a>
                            </div>
                        </div>
                    </div>
                `)
                .join("");
        } else {
            // Caso não haja séries disponíveis
            document.getElementById("novasSeries").innerHTML = "<p class='text-yellow'>Nenhuma nova série disponível no momento.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar novas séries:", error);
        document.getElementById("novasSeries").innerHTML = "<p class='text-yellow'>Erro ao carregar novas séries. Por favor, tente novamente.</p>";
    }
};


const carregarMinhasSeries = async () => {
    try {
        // Faz a requisição ao JSON Server para obter as séries salvas
        const response = await fetch("http://localhost:3001/minhasSeries");
        const minhasSeries = await response.json();

        const container = document.getElementById("minhasSeries");

        // Verifica se há séries salvas
        if (minhasSeries.length === 0) {
            container.innerHTML = "<p class='text-yellow'>Nenhuma série salva ainda.</p>";
            return;
        }

        // Renderiza as séries no layout de cards
        container.innerHTML = minhasSeries
            .map((serie) => `
                <div class="col-md-3 mb-4">
                    <div class="card bg-dark text-yellow">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                        <div class="card-body">
                            <h5 class="card-title">${serie.name}</h5>
                            <p class="card-text">${(serie.overview || "Descrição não disponível").substring(0, 100)}...</p>
                            <button class="btn btn-warning mt-2" onclick="verDetalhes(${serie.id}, 'tv')">Ver Detalhes</button>
                        </div>
                    </div>
                </div>
            `)
            .join("");
    } catch (error) {
        console.error("Erro ao carregar Minhas Séries:", error);
        document.getElementById("minhasSeries").innerHTML = "<p class='text-yellow'>Erro ao carregar Minhas Séries. Por favor, tente novamente.</p>";
    }
};


const verDetalhes = (id, type) => {
    window.location.href = `detalheFilme.html?id=${id}&type=${type}`;
};

const initHome = () => {
    carregarSeriesPopulares();
    carregarNovasSeries();
    carregarMinhasSeries();
};

document.addEventListener("DOMContentLoaded", initHome);
