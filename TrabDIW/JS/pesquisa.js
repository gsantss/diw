const apiKey = "61f5c23ac107c76ebf930a870d63113c";

const realizarPesquisa = async () => {
    const query = document.getElementById("pesquisa").value.trim();
    if (!query) {
        alert("Por favor, insira um termo de pesquisa.");
        return;
    }

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) {
            alert("Nenhum resultado encontrado.");
            return;
        }

        const resultados = document.getElementById("exploradorResultados");
        resultados.innerHTML = data.results.map(item => `
            <div class="col-md-3 mb-4">
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path || item.backdrop_path}" class="card-img-top" alt="${item.title || item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title || item.name}</h5>
                        <p class="card-text">${item.overview ? item.overview.substring(0, 100) + "..." : "Descrição não disponível."}</p>
                        <a href="detalheFilme.html?id=${item.id}&type=${item.media_type}" class="btn btn-warning">Detalhes</a>
                    </div>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Erro ao realizar a pesquisa:", error);
        alert("Erro ao realizar a pesquisa. Por favor, tente novamente.");
    }
};

document.getElementById("btnPesquisar").addEventListener("click", realizarPesquisa);
