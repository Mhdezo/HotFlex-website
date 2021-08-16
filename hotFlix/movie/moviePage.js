const apiKey = 'api_key=a4625584b3910289d91dd9e6bb3afd39';
const baseUrl = 'https://api.themoviedb.org/3/movie/';
const imgUrl = 'https://image.tmdb.org/t/p/w500';
const topSection = document.querySelector('.top-section');
const main = document.querySelector('.main');
const firstSection = document.querySelector('.first-section');
const postersImages = document.querySelector('.posters-images');
const blurBg = document.querySelector('.blur-bg');
const buttons = document.querySelector('.buttons');
const movieId = document.location.href.slice(document.location.href.indexOf('=') + 1); // get movie id

callAllFunctions(movieId);

function callAllFunctions(movieId) {
	getMovieDetails(movieId);
	getAge(movieId);
	getDirectorAndStars(movieId);
	getMoreToWatch(movieId);
	getTrailer(movieId);
}

async function getAge(movieId) {
	try {
		const movie = `${baseUrl + movieId}?${apiKey}&append_to_response=release_dates`;
		const res = await fetch(movie);
		const data = await res.json();
		const results = data.release_dates.results;
		certification = '';
		if (results.length) {
			results.forEach(element => {
				if (element.iso_3166_1 === "US") {
					element.release_dates.forEach(el => {
						if (el.certification) {
							certification = el.certification;
						} else {
							certification = 'NA';
						}
					});
				}
			});
		} else {
			certification = 'NA';
		}
		const age = document.querySelector('.age-year-time span:nth-of-type(1)');
		age.innerText = `${certification}`;
	} catch (error) {
		console.error(error);
	}
}

async function getTrailer(movieId) {
	try {
		const movie = `${baseUrl + movieId}/videos?${apiKey}&language=en-US`;
		const res = await fetch(movie);
		const data = await res.json();
		const baseUrlVideo = "https://www.youtube.com/embed/";
		let keyVideo = '';
		if (data.results.length) {
			for (let i = 0; i < data.results.length; i++) {
				if (data.results[i].key) {
					keyVideo = data.results[i].key;
					break;
				}
			}
		} else {
			keyVideo = '_Pq1rqz4lUw'; // if not found
		}
		const trailerLink = document.querySelector('.trailer-link');
		trailerLink.src = `${baseUrlVideo + keyVideo}`;
	} catch (error) {
		console.error(error);
	}
}

async function getMovieDetails(movieId) {
	try {
		const movie = `${baseUrl + movieId}?${apiKey}`;
		const res = await fetch(movie);
		const data = await res.json();
		const mins = data.runtime % 60;
		const hrs = parseInt(data.runtime / 60);
		//geners
		data.genres.forEach(element => {
			const button = document.createElement('button');
			button.innerText = element.name;
			button.classList.add('buttonsTypes')
			buttons.append(button);
		});
		//top section
		const posterImage = document.querySelector('.poster-image');
		if (data.backdrop_path) {
			posterImage.src = `${imgUrl + data.backdrop_path}`;
			blurBg.style.backgroundImage = `url(${imgUrl + data.backdrop_path})`;
		} else {
			posterImage.src = '../images/no-image.jpeg';
			blurBg.style.backgroundImage = `url(../images/no-image.jpeg)`;
			posterImage.classList.add('no-img');
		}
		posterImage.classList.add('cover-image');
		blurBg.classList.add('bg-img');
		//details
		const movieTitle = document.querySelector('h1');
		if (data.title) {
			movieTitle.innerText = `${data.title}`;
		} else {
			movieTitle.innerText = 'NO TITLE';
		}
		const ageYearTime = document.querySelector('.age-year-time');
		ageYearTime.querySelector('span:nth-of-type(2)').innerText = `${parseInt(data.release_date ? data.release_date : '0').toString()}`;
		ageYearTime.querySelector('span:nth-of-type(3)').innerText = `${hrs ? hrs : 0} HRS ${mins ? mins : 0} MINS`;
		const overview = document.querySelector('.overview');
		overview.innerText = data.overview;
	} catch (error) {
		console.error(error);
	}
}

async function getDirectorAndStars(movieId) {
	try {
		const movie = `${baseUrl + movieId}/credits?${apiKey}&language=en-US`;
		const res = await fetch(movie);
		const data = await res.json();
		const starsArray = [];
		const dirctorArray = [];
		if (data.cast.length) {
			data.cast.forEach(cast => {
				if (cast.order === 0 || cast.order === 1) {
					starsArray.push(cast.name);
				}
			});
		} else {
			starsArray.push('NO STARS FOUND');
		}
		if (data.crew.length) {
			data.crew.forEach(crew => {
				if (crew.job === 'Director') {
					dirctorArray.push(crew.original_name);
				}
			});
		} else {
			dirctorArray.push('NO DIRICTOR FOUND');
		}
		const stars = document.querySelector('.stars');
		stars.innerText = starsArray.join(', ');
		const director = document.querySelector('.director');
		director.innerText = dirctorArray.join(', ');
	} catch (error) {
		console.error(error);
	}
}

async function getMoreToWatch(movieId) {
	try {
		const movie = `${baseUrl + movieId}/similar?${apiKey}&language=en-US&page=1`;
		const res = await fetch(movie);
		const data = await res.json();
		if (data.results.length) {
			data.results.forEach(element => {
				const containerDivImg = document.createElement('div');
				containerDivImg.classList.add('container-div-img');

				const movieImg = document.createElement('img');
				if (element.poster_path) {
					movieImg.src = `${imgUrl + element.poster_path}`;
				} else {
					movieImg.src = '../images/no-image.jpeg';
				}
				movieImg.classList.add('poster-images');
				const playSection = document.createElement('section');
				const playImg = document.createElement('IMG');
				playImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAABmJLR0QA/wD/AP+gvaeTAAAESUlEQVRYhe2ZbWhbVRjHn3NOklubNplt0rBPCp1tfQl9dXUV7T4I4lBEbbroujdaHNgVhOr8JkPxwygTIUUR1G3tqu0aZeIYDgfrnNuo9HW12lULTgVJGpu0SWpym3uPHxoxN8m9vffkZlbw/+3cc87z/Dg55znPeYIopbD5hP9tgOz6H0uLDMwzacAvXrsszkzRhXka8MNqFADAXIRK7ai8Ajtr8MM7Uan9NmHRUFDwnhbO9ItTY6B8XBDCddtJSxtxtSHrFk1ekPqTSEPBhOdY4qN3IRLW5AOKLYb2TsPhI+rh1GIJQ31rR1+lAb82oFRPdofxjeOkZY9OWJEw331I+OwTZqBUEVebqec9MBflhEUXfbx7l3hjQhemdeHqetPgeWQrY8Sii774U4/ShXkdmZJeyyu4c1cUyOTjViTM734iH0wAQBfmefcuiEY0Y/FHXhJnJvPBtC5xepx/uUOuNzuWMNQnDJ/OG9LfXs4OCd6BrF1Z9hYNBeM7qnKJBeqF7A7u+lxmPMuyWgnPsdvDBAB00Zfo7cn8nr5aNBSM1d0N4RWVdnF1PV0K0F9vMZMhi5Wb+DltwdJXS/AOqGdCjq3chdGCb2aJ+wAzFl1ZFj79OO1jBtaZPvUW0Z0lQAgUmk2eEybPCSg0s5EJw/1KWDTgF6fG2EwT94GCi2P4XifDXHF8lC4FZLHEqyMb5CqKQvdUcV9eJ+79mmdSKl4dkcf6bpqZKalCs8lz0tR7SusPKs7ekMXS66ohu/dxF0ZR5X3qp9CfbspjLfp0wQIAXHV/wcUxw74X1WJJI6X0JMrfnSwquMN4/H1DR5eqwdKotElfPlKsjZJGbYr9udZ9KPGBR9XgYktqS/LyQXaHXkji3Czf0Upvfq9yfFpKKFktVF6hC5Mw1Bd/vFE9EwCgbZWpTclqYWdNrkSrUf61TmHwlNZ5+IFqeaymZkCIOdDTH+f49lbxhxnNMzHGTc2SD6kNZCvDddvZmITBk7HHGliYAHB9IyqxyWIBAHHtVW+OBpdAEGA1yncd5LsOJssQ2pXpNCMNXA7Fau/SkAY6a2nwD/rbL2xAsJ4GTt5CFqvEbPog6xZDe6d6o+LMZC5MAEDaD6cxQfbna3gltqOK+n7PxZlKaXhiQLHFeDRL2p8PGd96J2sZJ/udSFr2kFYNe59N5NnnyTPurF3yNYhoJP70TnF6PE9MuPZB7uwluWxRsTQS8MeffCQvpZFtldy5KwolTKXEBtnKuPPXcMND+jLhmgbui6+Vy6ob5FuopJTzfkVcbXoxEfd+7vMR5eIWaChSegfWXu/OJatGjq3GN9+W2+OMWABAl0OJ3p7Eh73q74CkD4uVdHQZOl/JDJs6YCXhVpYF74Aw3C9OfAuiqDQUY1zfSFx7yXMvqAdixPqHbykg+btgvSpeVIxsZai8AjtrcVMzKillM86OlVf9J14+m0abFOsvAL21WunFciUAAAAASUVORK5CYII=";
				playImg.title = element.title;
				playImg.name = element.id;
				playImg.addEventListener('click', (evt) => {
					document.location.href = "../movie/moviePage.html?q=" + evt.target.getAttribute("name");
				});
				containerDivImg.addEventListener('mouseover', (evt) => {
					playSection.style.display = 'block';
					playImg.style.display = 'block';
				});
				containerDivImg.addEventListener("mouseout", (evt) => {
					playSection.style.display = 'none';
					playImg.style.display = 'none';
				});
				containerDivImg.append(movieImg);
				containerDivImg.append(playSection);
				containerDivImg.append(playImg);
				postersImages.append(containerDivImg);
			});
		}
	} catch (error) {
		console.error(error);
	}
}

const content = document.querySelector('.posters-images');
const scrollStep = 208 + parseInt(window.getComputedStyle(content).getPropertyValue('column-gap'));
const leftArrow = document.querySelector('svg:nth-child(2)');
leftArrow.addEventListener('click', function (evt) {
	evt.preventDefault();
	let scrollLeft = content.scrollLeft,
		scrollWidth = content.scrollWidth;
	if ((scrollLeft + scrollStep) >= scrollWidth) {
		content.scrollTo(scrollWidth, 0);
	} else {
		content.scrollTo((scrollLeft + scrollStep), 0);
	}
});

const rightArrow = document.querySelector('svg:nth-child(1)');
rightArrow.addEventListener('click', function (evt) {
	evt.preventDefault();
	let scrollLeft = content.scrollLeft;
	if ((scrollLeft - scrollStep) <= 0) {
		content.scrollTo(0, 0);
	} else {
		content.scrollTo((scrollLeft - scrollStep), 0);
	}
});

const trailerButton = document.querySelector('#trailer-button');
const trailerSection = document.querySelector('.trailer-section');
const trailerLink = document.querySelector('.trailer-link');
trailerButton.addEventListener('click', (evt) => {
	trailerSection.style.display = 'block';
});

trailerSection.addEventListener('click', (evt) => {
	trailerSection.style.display = 'none';
	trailerLink.src = '';

});
// back to main page
const homeBtn = document.querySelector('.home-btn');
homeBtn.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});

homeBtn.addEventListener('mouseover', () => {
	const backToMainPage = document.querySelector('.home-section span');
	backToMainPage.style.display = 'inline';
});

homeBtn.addEventListener('mouseout', () => {
	const backToMainPage = document.querySelector('.home-section span');
	backToMainPage.style.display = 'none';
});