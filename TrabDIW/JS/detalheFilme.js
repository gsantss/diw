const apiKey = "61f5c23ac107c76ebf930a870d63113c";
const JSON_SERVER_URL = "http://localhost:3001/minhasSeries";

const carregarDetalhes = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const type = urlParams.get("type");

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR`
        );
        const data = await response.json();

        document.getElementById("poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        document.getElementById("titulo").innerText = data.name || data.title;
        document.getElementById("sinopse").innerText = data.overview || "Descrição indisponível.";
        document.getElementById("info").innerHTML = `
            <p><strong>Gêneros:</strong> ${data.genres?.map((g) => g.name).join(", ") || "Não informado"}</p>
            <p><strong>Data de Lançamento:</strong> ${
                data.first_air_date || data.release_date || "Não informado"
            }</p>
            <p><strong>Avaliação:</strong> ${data.vote_average || "N/A"} (${
            data.vote_count || 0
        } votos)</p>
        `;
    } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
        alert("Erro ao carregar os detalhes. Por favor, tente novamente.");
    }
};

const salvarSerie = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const type = urlParams.get("type");

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR`
        );
        const data = await response.json();
        const seriesResponse = await fetch(JSON_SERVER_URL);
        const minhasSeries = await seriesResponse.json();

        const serieExistente = minhasSeries.find((serie) => serie.id === data.id);
        if (serieExistente) {
            alert("Esta série já está salva em suas séries.");
            return;
        }
        const novaSerie = {
            id: data.id,
            name: data.name || data.title,
            poster_path: data.poster_path,
            overview: data.overview,
            first_air_date: data.first_air_date || data.release_date,
        };

        await fetch(JSON_SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novaSerie),
        });

        alert("Série adicionada às Minhas Séries!");
    } catch (error) {
        console.error("Erro ao salvar a série:", error);
        alert("Erro ao salvar a série. Por favor, tente novamente.");
    }
};

document.getElementById("btnSalvar").addEventListener("click", salvarSerie);
document.addEventListener("DOMContentLoaded", carregarDetalhes);
