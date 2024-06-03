// Executa o código após o conteúdo do DOM ser carregado
document.addEventListener("DOMContentLoaded", () => {
  // Chave da API do TMDb
  const apiKey = "279426629a4c3ff2fc96e6aa30e27bb2";

  // Inicializa um conjunto de filmes favoritos a partir do localStorage ou um conjunto vazio
  let favorites = new Set(JSON.parse(localStorage.getItem("favorites")) || []);

  // Função para buscar filmes populares da API do TMDb
  async function fetchMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`;

    try {
      // Faz uma solicitação para buscar filmes populares
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar filmes");

      // Converte a resposta em JSON
      const data = await response.json();
      // Exibe os filmes recebidos
      displayMovies(data.results);
    } catch (error) {
      // Exibe uma mensagem de erro se a solicitação falhar
      console.error(error);
      document.getElementById("container").innerText =
        "Erro ao carregar filmes";
    }
  }

  // Função para buscar filmes com base na busca do usuário
  async function searchMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=pt-BR&page=1`;

    try {
      // Faz uma solicitação para buscar filmes com base na consulta
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar filmes");

      // Converte a resposta em JSON
      const data = await response.json();
      // Exibe os filmes recebidos
      displayMovies(data.results);
    } catch (error) {
      // Exibe uma mensagem de erro se a solicitação falhar
      console.error(error);
      document.getElementById("container").innerText =
        "Erro ao carregar filmes";
    }
  }

  // Função para exibir os filmes
  function displayMovies(movies) {
    // Obtém o contêiner onde os filmes serão exibidos
    const container = document.getElementById("container");
    container.innerHTML = "";

    // Itera sobre cada filme recebido
    movies.forEach((movie) => {
      // Cria um elemento div para cada filme
      const movieDiv = document.createElement("div");
      movieDiv.id = "movie";
      movieDiv.dataset.name = movie.title; // Armazena o nome do filme como um atributo de dados
      movieDiv.innerHTML = `
                <div id="img-movie">
                    <img id="movie-photo" src="https://image.tmdb.org/t/p/w500${
                      movie.poster_path
                    }" alt="${movie.title} Poster">
                    <div id="informations-movie">
                        <p><strong>${movie.title}</strong></p>
                        <div class="preferences">
                            <img id="star" src="img/star.svg" alt="Star Icon"> <p>${
                              movie.vote_average
                            }</p>
                            <button class="favorite-btn">
                                <img src="${
                                  favorites.has(movie.title)
                                    ? "img/heart-click.svg"
                                    : "img/heart-unclick.svg"
                                }" alt="Heart Icon">
                            </button>
                            <div>Favoritar</div>
                        </div>
                    </div>
                    <p id="description">${movie.overview}</p>
                </div>
            `;
      // Adiciona o div do filme ao contêiner
      container.appendChild(movieDiv);
    });

    // Adiciona o evento de clique para os botões de favoritos
    document.querySelectorAll(".favorite-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const img = button.querySelector("img");
        const movieName = button.closest("#movie").dataset.name; // Obtém o nome do filme

        // Alterna o estado do botão de favorito e atualiza o conjunto de favoritos
        if (img.src.includes("heart-unclick.svg")) {
          img.src = "img/heart-click.svg";
          favorites.add(movieName);
        } else {
          img.src = "img/heart-unclick.svg";
          favorites.delete(movieName);
        }
        // Atualiza o localStorage com a lista de favoritos
        localStorage.setItem("favorites", JSON.stringify([...favorites]));
      });
    });
    // Aplica o filtro de filmes favoritos, se necessário
    filterMovies();
  }

  // Função para filtrar os filmes favoritos
  function filterMovies() {
    const showFavorites = document.getElementById("showFavorites").checked;
    document.querySelectorAll("#movie").forEach((movieDiv) => {
      const movieName = movieDiv.dataset.name;
      // Exibe ou oculta os filmes com base na seleção de favoritos
      if (showFavorites && !favorites.has(movieName)) {
        movieDiv.style.display = "none";
      } else {
        movieDiv.style.display = "block";
      }
    });
  }

  // Chama a função para buscar e exibir os filmes ao carregar a página
  fetchMovies();

  // Adiciona o evento de clique para a checkbox de favoritos
  document
    .getElementById("showFavorites")
    .addEventListener("change", filterMovies);

  // Adiciona o evento de clique para o botão de busca
  document.getElementById("search").addEventListener("click", () => {
    const query = document.getElementById("txtBusca").value;
    if (query) {
      searchMovies(query);
    }
  });
});
