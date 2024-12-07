const apiKey = "61f5c23ac107c76ebf930a870d63113c";

const carregarSeriesPopulares = async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();

        const carrossel = document.getElementById("seriesCarrossel");

        carrossel.innerHTML = data.results.map((serie, index) => `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
                <div class="row align-items-center">
                    <!-- Imagem à esquerda -->
                    <div class="col-md-4 text-center">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" 
                             alt="${serie.name}" 
                             class="img-fluid rounded">
                    </div>
                    <!-- Descrição à direita -->
                    <div class="col-md-8">
                        <h3 class="text-yellow">${serie.name || serie.title}</h3>
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
    const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();

    const novasSeries = document.getElementById('novasSeries');
    novasSeries.innerHTML = data.results.map(serie => `
        <div class="col-md-3">
            <div class="card">
                <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                <div class="card-body">
                    <h5 class="card-title">${serie.name}</h5>
                    <a href="detalheFilme.html?id=${serie.id}&type=tv" class="btn btn-warning">Ver mais</a>
                </div>
            </div>
        </div>
    `).join('');
};

const carregarMinhasSeries = () => {
    const minhasSeries = JSON.parse(localStorage.getItem("minhasSeries")) || [];
    const container = document.getElementById("minhasSeries");

    container.innerHTML = minhasSeries.map(serie => `
        <div class="col-md-3 text-center">
            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" 
                 alt="${serie.name}" 
                 class="img-fluid rounded">
            <h5 class="text-yellow">${serie.name}</h5>
            <button class="btn btn-warning mt-2" onclick="verDetalhes(${serie.id}, 'tv')">Ver Detalhes</button>
        </div>
    `).join("");
};

const initHome = () => {
    carregarSeriesPopulares();
    carregarNovasSeries();
    carregarMinhasSeries();
};

document.addEventListener('DOMContentLoaded', initHome);

const verDetalhes = (id, type) => {
    window.location.href = `detalheFilme.html?id=${id}&type=${type}`;
};
