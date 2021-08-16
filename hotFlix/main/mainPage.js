const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
	document.body.classList.toggle('toot');
});

const hamburger2 = document.querySelector('.hamburger2');
hamburger2.addEventListener('click', () => {
	document.body.classList.toggle('toot2');
});

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', () => {
	body = document.querySelector('body');
	if (body.clientWidth <= 764) { //search input
		document.querySelector('#search').value = '';
		body.classList.toggle('search-input');
	}
});

searchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	const searchInput = document.querySelector('#search');
	if (searchInput.value) {
		document.location.href = "../search/search.html?search=" + encodeURIComponent(searchInput.value);
	}
});

const newItemsSection = document.querySelector('.new-items-section');
const showItems = document.querySelector('.show-items');
const apiKey = 'api_key=a4625584b3910289d91dd9e6bb3afd39';
const baseUrl = 'https://api.themoviedb.org/3/';
const imgUrl = 'https://image.tmdb.org/t/p/w500';

getNewRealease();
getPopular();
let count = 1; // count for new items of the season
let count2 = 21; // count2 for new items section

async function getNewRealease() {
	try {
		const moviesInfo = `${baseUrl}movie/upcoming?include_adult=false&include_video=false&${apiKey}`; //and with page &page=
		const res = await fetch(moviesInfo);
		const data = await res.json();
		if (data.results.length) {
			showMovies(data.results, 1);
		}
	} catch (error) {
		console.error(error);
	}
}

async function getPopular(page = 1) {
	try {
		const moviesInfo = `${baseUrl}discover/movie?sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&${apiKey}`; //and with page &page=
		const res = await fetch(moviesInfo);
		const data = await res.json();
		if (data.results.length) {
			showMovies(data.results, 2);
		}
	} catch (error) {
		console.error(error);
	}
}

function showMovies(data, sectionNumber) {
	data.forEach(movieInfo => {
		let { title, vote_average, poster_path, genre_ids, id } = movieInfo;
		if (Number.isInteger(vote_average)) {
			vote_average += '.0'
		} else {
			vote_average.toString();
		}
		const voteAverage = document.createElement('sapn');
		const movieTitle = document.createElement('label');
		movieTitle.innerText = `${title ? title : 'No Title'}`;
		voteAverage.innerText = `${vote_average !== '0.0' ? vote_average : 'NR'}`;
		const movieImage = document.createElement('img');
		if (poster_path) {
			movieImage.src = `${imgUrl}${poster_path}`;
		} else {
			movieImage.src = '../images/no-image.jpeg';
			movieImage.classList.add('no-img');
		}
		const containerDivImg = document.createElement('div');
		const genersContainer = document.createElement('small');
		const playSection = document.createElement('section');
		const playImg = document.createElement('IMG');
		playImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAABmJLR0QA/wD/AP+gvaeTAAAERUlEQVRYhe3Zz08cVQAH8DePmXV+7Owv03igVKAL1EaS9q4WFl2obYzCrY2XUquU2lgJYoyHtomtTWvaiHDR6kl7AUxUQqHiYv8BSdDidglUKNE07o9ZmB/uDG88LDG7szOzM7OzWpN+b7x5Pz7ZmXk/Buz3w8+Ahy/wvwbo5xHLTnDHLaE/6GndRzQ01dTWQX8QI0kAgCqJiMtsra/JK4ncwk+Iy/xLLOhlyfYo1d5JhPcADDOrqqry3UVxbkaKTSN+09YomPU3EXpZpucofegVjKJtjaEKvDA5wY9/ZR1nlUVFuthjJ6E/aAtUGJRJbVwfEedm3GFhFO0/NUg+97xjUGHE2Ex29IoqiebVyryJMBAKXRx2ywQAoNqjoYvDZX91MxYMhEIffkLsbnbLlA8RbgldGjGXGbIwig6eu4LX1rlrygevrQuevYyRlG2Wr2+AaGyqhikfItziPz1kdFWfRUW6qPZo1UjbIZ/toNr0R9FhQS/LHjtZZdJ22N5+yHh1DKVFTM/RSuYnW4GBENN9RKdc+7eXpV982Xq/8lJ868EflcjoQ92lP5iWRbZFMZqx2CNKJZMDJ/7sf1WcnXLMwhiGPPBCGRYV6bTeI9rMAoRUSeKuXeCuXVAlyZmsdNAiFvQHifAeZ12Ls1PJM8eVe8sO2hLNe6HPb8jytO4vs1cxjXL/t+Tg605uKIZ5WvcbsoiGsGNTPts39OoHdm8oXr/bkFXj0lIj/nAzOXBCWbtng7VzlyELBlybrpTVleRbx4Wb31isr5kpi1h2t53mUXN/ZUcuC9+OW6msmZX+DycfVRRc7BrzPMa+dprueslKZVXgDVkok3bLhO9qCLx7Hq+rt1gfcUVDF7G21tdcMVGRLl/fQP7kaDHK/VVDlrySqBCEkaTvjbepjoN2GyorS4as3MI8UFXHEz2+88nA0Hm8vtF2SxXlfp4vLCh6ExGXlu8uOjNRHQcfv/qZExMAcvwOynKFJdrDvhibJlr2WuwOen0AQszjcXbjCgfVlGiPr5Dx7vh8zPqWS15OQNZXs+MJxyaV5x/09qh80QShnU4RvylMTljvlGhsqsQEAOAnxzUmHRYAYHPsS5RKVjKS9aBMSpi4UVquw1IFfuOL0eqTAAAg++nHup9x9NdEcW6m9DF0PdLt76Xbs7qXDJfq7OhH8lK8aiQgJxa54UtGVw1ZqiSmzw4qLi1Hmijrq+lz75jsYM02NohLpwb75Pgv7prkxK+poVPmn1XL7LfQBpd6/4wYs/QJz0rE2anUe29q9gulsfyRsi3K9vbDQMgxCKWS2evDRs+4QxYAADJepvsIfbjb+hqQj8rz/Hdj/Nc3SqdNF1jbDRiGOhClIp1E81MAM30GVCTH74ixafHHW9ZBDln/BPr8nqf34Y1NeP7fBRQNAFBFAXFpZX1NWU7kFubRBle2H5dZVc1DevJ5xLKTvwH31YtfPwn8PgAAAABJRU5ErkJggg==";

		if (sectionNumber == 1) {
			playImg.id = `img-poster-id${count}`;
			movieTitle.htmlFor = `img-poster-id${count}`;
			count++;
			playImg.title = title;
			movieTitle.title = title;
			movieTitle.id = id;
			playImg.name = id;
		} else if (sectionNumber == 2) {
			playImg.id = `img-poster-id${count2}`;
			movieTitle.htmlFor = `img-poster-id${count2}`;
			count2++;
			playImg.title = title;
			movieTitle.title = title;
			movieTitle.id = id;
			playImg.name = id;
		}
		playImg.addEventListener('click', (evt) => {
			document.location.href = "../movie/moviePage.html?q=" + evt.target.getAttribute("name");
		});
		movieTitle.addEventListener('click', (evt) => {
			document.location.href = "../movie/moviePage.html?q=" + evt.target.getAttribute("id");
		});
		containerDivImg.addEventListener('mouseover', (evt) => {
			playSection.style.display = 'block';
			playImg.style.display = 'block';
		});
		containerDivImg.addEventListener("mouseout", (evt) => {
			playSection.style.display = 'none';
			playImg.style.display = 'none';
		});
		if (vote_average >= 7) {
			voteAverage.style.borderColor = 'green';
		} else if (vote_average < 7 && vote_average >= 5) {
			voteAverage.style.borderColor = 'yellow'
		} else {
			voteAverage.style.borderColor = 'red'
		}

		getGenre(genre_ids, genersContainer);
		containerDivImg.append(movieImage);
		containerDivImg.append(voteAverage);
		containerDivImg.append(movieTitle);
		containerDivImg.append(genersContainer);
		containerDivImg.append(playSection);
		containerDivImg.append(playImg);
		containerDivImg.classList.add('poster');

		if (sectionNumber === 1) {
			newItemsSection.append(containerDivImg);
		} else {
			showItems.append(containerDivImg)
		}
	});
}

async function getGenre(ids, genersContainer) {
	try {
		const types = [];
		const res = await fetch(`${baseUrl}genre/movie/list?${apiKey}&language=en-US`)
		const data = await res.json();
		data.genres.forEach(element => {
			if (ids.includes(element.id)) {
				types.push(element.name)
			}
		});
		genersContainer.innerText = types.join(', ');
	} catch (error) {
		console.error(error);
	}
}

const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

rightArrow.addEventListener('click', function (evt) {
	evt.preventDefault();
	const scrollStep = document.querySelector('.new-items-section').clientWidth;
	let scrollLeft = newItemsSection.scrollLeft,
		scrollWidth = newItemsSection.scrollWidth;

	if ((scrollLeft + scrollStep) >= scrollWidth) {
		newItemsSection.scrollTo(scrollWidth, 0);
	} else {
		newItemsSection.scrollTo((scrollLeft + scrollStep), 0);
	}
});

leftArrow.addEventListener('click', function (evt) {
	const scrollStep = document.querySelector('.new-items-section').clientWidth;
	evt.preventDefault();
	let scrollLeft = newItemsSection.scrollLeft;

	if ((scrollLeft - scrollStep) <= 0) {
		newItemsSection.scrollTo(0, 0);
	} else {
		newItemsSection.scrollTo((scrollLeft - scrollStep), 0);
	}
});

let page = 1;

document.addEventListener("DOMContentLoaded", () => {
	let options = {
		root: null,
		rootMargins: "0px",
		threshold: .99
	};
	const observer = new IntersectionObserver(handleIntersect, options);
	observer.observe(document.querySelector("footer"));
});

function handleIntersect(entries) {
	if (entries[0].isIntersecting) {
		page++;
		getPopular(page);
	}
}

const upArrow = document.querySelector('.up-arrow');
upArrow.addEventListener('click', () => {
	window.scrollTo(0, 0);
});

const homeUpArrow = document.querySelector('.home-up-arrow');
homeUpArrow.addEventListener('click', () => {
	window.scrollTo(0, 0);
});

const searchForm = document.querySelector('form');
searchForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const searchInput = document.querySelector('#search');
	if (searchInput.value) {
		document.location.href = "../search/search.html?search=" + encodeURIComponent(searchInput.value);
	}
});

// back to the main page
const logoNav = document.querySelector('.logo');
logoNav.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});

const homeInsideNavMenu = document.querySelector('.menu li');
homeInsideNavMenu.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});

const logoFooter = document.querySelector('.logo-footer');
logoFooter.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});