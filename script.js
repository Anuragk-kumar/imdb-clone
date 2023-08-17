

let currentMovieStack = [];

const homeButton = document.querySelector("#home-button");
const searchBox = document.querySelector("#search-box");
const goToFavouriteButton = document.querySelector("#goto-favourites-button");
const movieCardContainer = document.querySelector("#movie-card-container")

// simple function to show an alert when we need 
function showAlert(message){
	alert(message);
}


// create move cards using elements of currentMovieStack array 
function renderList(actionForButton){
	movieCardContainer.innerHTML = '';

	for(let i = 0; i<currentMovieStack.length; i++){

		// creating div element for movie card and setting class and id to it
		let movieCard = document.createElement('div');
		movieCard.classList.add("movie-card");

		// templet for interHtml of movie card which sets image, title and rating of particular movie
		movieCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + currentMovieStack[i].poster_path}" alt="${currentMovieStack[i].title}" class="movie-poster">
		<div class="movie-title-container">
			<span>${currentMovieStack[i].title}</span>
			<div class="rating-container">
				<img src="./res/rating-icon.png" alt="">
				<span>${currentMovieStack[i].vote_average}</span>
			</div>
		</div>

		<button id="${currentMovieStack[i].id}" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>

		<button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button" data-id="${currentMovieStack[i].id}" >
			<img src="./img/favourites-icon.png">
			<span>${actionForButton}</span>
		</button>
		`;
		movieCardContainer.append(movieCard); //appending card to the movie container view
		
	}
}


// if any thing wrong by using this function we print message to the main screen
function printError(message){
	const errorDiv = document.createElement("div");
	errorDiv.innerHTML = message;
	errorDiv.style.height = "100%";
	errorDiv.style.fontSize = "5rem";
	errorDiv.style.margin = "auto";
	movieCardContainer.innerHTML = "";
	movieCardContainer.append(errorDiv);
}

// gets tranding movies from the server and renders as movie cards
function getTrandingMovies(){
	const tmdb = fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=cb213741fa9662c69add38c5a59c0110")
	.then((response) => response.json())
	.then((data) => {
		currentMovieStack = data.results;
		renderList("favourite");
	})
	.catch((err) => printError(err));
}
getTrandingMovies();

// when we clicked on home button this fetches trending movies and renders on web-page
homeButton.addEventListener('click', getTrandingMovies);




// search box event listner check for any key press and search the movie according and show on web-page
searchBox.addEventListener('keyup' , ()=>{
	let searchString = searchBox.value;
	
	if(searchString.length > 0){
		let searchStringURI = encodeURI(searchString);
		const searchResult = fetch(`https://api.themoviedb.org/3/search/movie?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
			.then((response) => response.json())
			.then((data) =>{
				currentMovieStack = data.results;
				renderList("favourite");
			})
			.catch((err) => printError(err));
	}
})


// function to add movie into favourite section
/**
 * The function `favourite` adds a movie to the user's list of favorite movies in local storage and
 * displays an alert message.
 * @param element - The `element` parameter is the HTML element that triggered the function. It is
 * expected to have a `dataset` property, which contains custom data attributes. The `id` property of
 * the `dataset` is used to identify the movie in the `currentMovieStack` array.
 * @returns nothing (undefined).
 */
function favourite(element){
	let id = element.dataset.id;
	for(let i = 0; i< currentMovieStack.length; i++){
		if(currentMovieStack[i].id == id){
			let favouriteMoviesAkash = JSON.parse(localStorage.getItem("favouriteMoviesAkash"));
			
			if(favouriteMoviesAkash == null){
				favouriteMoviesAkash = [];
			}

			favouriteMoviesAkash.unshift(currentMovieStack[i]);
			localStorage.setItem("favouriteMoviesAkash", JSON.stringify(favouriteMoviesAkash));

			showAlert(currentMovieStack[i].title + " added to favourite")
			return;
		}
	}
}

// when Favourites movie button click it shows the favourite moves 
/* This code snippet adds an event listener to the `goToFavouriteButton` element. When the button is
clicked, the function inside the event listener is executed. */
goToFavouriteButton.addEventListener('click', ()=>{
	let favouriteMoviesAkash = JSON.parse(localStorage.getItem("favouriteMoviesAkash"));
	if(favouriteMoviesAkash == null || favouriteMoviesAkash.length < 1){
		showAlert("you have not added any movie to favourite");
		return;
	}

	currentMovieStack = favouriteMoviesAkash;
	renderList("remove");
})


// remove movies from favourite section
/**
 * The function removes an element from the "favouriteMoviesAkash" array stored in localStorage and
 * updates the currentMovieStack.
 * @param element - The `element` parameter is the HTML element that triggered the removal action.
 */

function remove(element){
	let id = element.dataset.id;
	let favouriteMoviesAkash = JSON.parse(localStorage.getItem("favouriteMoviesAkash"));
	let newFavouriteMovies = [];
	for(let i = 0; i<favouriteMoviesAkash.length; i++){
		if(favouriteMoviesAkash[i].id == id){
			continue;
		}
		newFavouriteMovies.push(favouriteMoviesAkash[i]);
	}
	
	localStorage.setItem("favouriteMoviesAkash", JSON.stringify(newFavouriteMovies));
	currentMovieStack = newFavouriteMovies;
	renderList("remove");
}



// renders movie details on web-page
/**
 * The function `renderMovieInDetail` takes a movie object as a parameter and renders the movie details
 * on the webpage.
 * @param movie - The `movie` parameter is an object that represents a movie. It contains the following
 * properties:
 */
function renderMovieInDetail(movie){
	console.log(movie);
	movieCardContainer.innerHTML = '';
	
	let movieDetailCard = document.createElement('div');
	movieDetailCard.classList.add('detail-movie-card');

	movieDetailCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background">
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
		<div class="detail-movie-title">
			<span>${movie.title}</span>
			<div class="detail-movie-rating">
				<img src="./img/rating-icon.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="detail-movie-plot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>
		</div>
	`;

	movieCardContainer.append(movieDetailCard);
}


// fetch the defails of of move and send it to renderMovieDetails to display
/**
 * The function fetches movie details from an API and then renders the details on the webpage.
 * @param element - The `element` parameter is the HTML element that triggered the function. It is used
 * to extract the `id` attribute from the element and pass it as a parameter in the API request URL.
 */
function getMovieInDetail(element){

	fetch(`https://api.themoviedb.org/3/movie/${element.getAttribute('id')}?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US`)
		.then((response) => response.json())
		.then((data) => renderMovieInDetail(data))
		.catch((err) => printError(err));

}