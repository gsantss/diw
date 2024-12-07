const API_URL = "http://localhost:3001/perfil";

const carregarPerfil = async () => {
    try {
        const response = await fetch(API_URL);
        const perfil = await response.json();

        if (perfil.length > 0) {
            const usuario = perfil[0];
            document.getElementById("perfilNome").innerText = usuario.nome || "Não informado";
            document.getElementById("perfilCurso").innerText = usuario.curso || "Não informado";
            document.getElementById("perfilBio").innerText = usuario.bio || "Não informado";

            document.querySelector(".bi-twitter").parentElement.href = usuario.twitter || "#";
            document.querySelector(".bi-instagram").parentElement.href = usuario.instagram || "#";
            document.querySelector(".bi-facebook").parentElement.href = usuario.facebook || "#";
        } else {
            document.getElementById("perfilNome").innerText = "Nenhum perfil encontrado.";
            document.getElementById("perfilCurso").innerText = "Por favor, crie um perfil.";
            document.getElementById("perfilBio").innerText = "Por favor, crie um perfil.";
        }
    } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
    }
};

const carregarPerfilParaEdicao = async () => {
    try {
        const response = await fetch(API_URL);
        const perfil = await response.json();

        if (perfil.length > 0) {
            const usuario = perfil[0];
            document.getElementById("nome").value = usuario.nome || "";
            document.getElementById("curso").value = usuario.curso || "";
            document.getElementById("email").value = usuario.email || "";
            document.getElementById("facebook").value = usuario.facebook || "";
            document.getElementById("twitter").value = usuario.twitter || "";
            document.getElementById("instagram").value = usuario.instagram || "";
            document.getElementById("bio").value = usuario.bio || "";
        }
    } catch (error) {
        console.error("Erro ao carregar o perfil para edição:", error);
    }
};

const salvarPerfil = async () => {
    try {
        const perfil = {
            nome: document.getElementById("nome").value,
            curso: document.getElementById("curso").value,
            email: document.getElementById("email").value,
            facebook: document.getElementById("facebook").value,
            twitter: document.getElementById("twitter").value,
            instagram: document.getElementById("instagram").value,
            bio: document.getElementById("bio").value,
        };

        const response = await fetch(API_URL);
        const dadosAtuais = await response.json();

        if (dadosAtuais.length > 0) {
            await fetch(`${API_URL}/${dadosAtuais[0].id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(perfil),
            });
            alert("Perfil atualizado com sucesso!");
        } else {
            alert("Erro: não é permitido criar um novo perfil!");
        }
    } catch (error) {
        console.error("Erro ao salvar o perfil:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("salvarPerfil")) {
        carregarPerfilParaEdicao();
        document.getElementById("salvarPerfil").addEventListener("click", salvarPerfil);
    } else {
        carregarPerfil();
    }
});
