const apiKey = "61f5c23ac107c76ebf930a870d63113c";

const carregarDetalhes = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');

    try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();

        document.getElementById('poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        document.getElementById('titulo').innerText = data.name || data.title;
        document.getElementById('sinopse').innerText = data.overview || "Descrição indisponível.";
        document.getElementById('info').innerHTML = `
            <p><strong>Gêneros:</strong> ${data.genres?.map(g => g.name).join(', ') || 'Não informado'}</p>
            <p><strong>Data de Lançamento:</strong> ${data.first_air_date || data.release_date || 'Não informado'}</p>
            <p><strong>Avaliação:</strong> ${data.vote_average || 'N/A'} (${data.vote_count || 0} votos)</p>
        `;
    } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
        alert("Erro ao carregar os detalhes. Por favor, tente novamente.");
    }
};

const salvarSerie = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');

    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            const minhasSeries = JSON.parse(localStorage.getItem('minhasSeries')) || [];
            const itemExistente = minhasSeries.find(item => item.id === data.id);

            if (itemExistente) {
                alert("Este item já está salvo em suas séries.");
                return;
            }

            minhasSeries.push({
                id: data.id,
                name: data.name || data.title,
                poster_path: data.poster_path
            });
            localStorage.setItem('minhasSeries', JSON.stringify(minhasSeries));
            alert('Adicionado às Minhas Séries!');
        });
};

document.getElementById('btnSalvar').addEventListener('click', salvarSerie);
document.addEventListener('DOMContentLoaded', carregarDetalhes);
