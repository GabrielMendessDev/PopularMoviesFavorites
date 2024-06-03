document.addEventListener('DOMContentLoaded', () => {
    let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []);

    async function fetchMovies() {
        const username = 'GabrielMendessDev';

        // URL da API do GitHub para obter filmes do usuário
        const url = `https://api.github.com/users/${username}/repos`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar filmes');

            const movies = await response.json();
            displayMovies(movies);
        } catch (error) {
            console.error(error);
            document.getElementById('container').innerText = 'Erro ao carregar filmes';
        }
    }

    function displayMovies(movies) {
        const container = document.getElementById('container');
        container.innerHTML = '';

        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.id = 'movie';
            movieDiv.dataset.name = movie.name;
            movieDiv.innerHTML = `
                <div id="img-movie">
                    <img id="movie-photo" src="img/typescript-logo.png" alt="Movie Poster">
                    <div id="informations-movie">
                        <p><strong>${movie.name}</strong></p>
                        <div class="preferences">
                            <img id="star" src="img/star.svg" alt="Star Icon"> <p>7.7</p>
                            <button class="favorite-btn">
                                <img src="${favorites.has(movie.name) ? 'img/heart-click.svg' : 'img/heart-unclick.svg'}" alt="Heart Icon">
                            </button>
                            <div>Favoritar</div>
                        </div>
                    </div>
                    <p id="description">${movie.description}</p>
                </div>
            `;
            container.appendChild(movieDiv);
        });

        // Adiciona o evento de clique para os botões de favoritos
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', () => {
                const img = button.querySelector('img');
                const movieName = button.closest('#movie').dataset.name;

                if (img.src.includes('heart-unclick.svg')) {
                    img.src = 'img/heart-click.svg';
                    favorites.add(movieName);
                } else {
                    img.src = 'img/heart-unclick.svg';
                    favorites.delete(movieName);
                }
                localStorage.setItem('favorites', JSON.stringify([...favorites]));
            });
        });

        filterMovies();
    }

    function filterMovies() {
        const showFavorites = document.getElementById('showFavorites').checked;
        document.querySelectorAll('#movie').forEach(movieDiv => {
            const movieName = movieDiv.dataset.name;
            if (showFavorites && !favorites.has(movieName)) {
                movieDiv.style.display = 'none';
            } else {
                movieDiv.style.display = 'block';
            }
        });
    }

    // Chama a função para buscar e exibir os filmes ao carregar a página
    fetchMovies();

    // Adiciona o evento de clique para a checkbox de favoritos
    document.getElementById('showFavorites').addEventListener('change', filterMovies);
});
