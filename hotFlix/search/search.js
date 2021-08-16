const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
	document.body.classList.toggle('humburger-toggle');
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

const apiKey = 'api_key=a4625584b3910289d91dd9e6bb3afd39';
const baseUrl = 'https://api.themoviedb.org/3/search/movie';
const imgUrl = 'https://image.tmdb.org/t/p/w500';
const pagination = document.querySelector('.pagination');
const ref = document.location.href;
let movieName = decodeURIComponent(ref.slice(ref.indexOf('=') + 1));
let count = 1; // to get how many movie we adding

if (movieName.includes('#')) {
	const a = movieName.indexOf('#');
	movieName = movieName.slice(0, a);
}

async function getMovie(query, page = 1) {
	try {
		const movie = `${baseUrl}?${apiKey}&query=${query}&language=en-US&include_adult=false&page=${page}`; //and with page &page=
		const res = await fetch(movie);
		const data = await res.json();
		if (data.results.length) {
			showMovies(data.results, data.total_pages);
		} else {
			const containerDivImg = document.createElement('div');
			const noResultText = document.createElement('span');
			const noResultImg = document.createElement('img');
			noResultText.innerText = 'NO Results';
			noResultImg.src = '../images/no-results.png';
			containerDivImg.append(noResultText);
			containerDivImg.append(noResultImg);
			containerDivImg.classList.add('no-resuluts');
			const containerNewItems = document.querySelector('.container-new-items');
			containerNewItems.append(containerDivImg);
			const movieNameStrong = document.querySelector('.container-new-items strong');
			movieNameStrong.innerText = movieName;
			const searchValue = document.querySelector('#search');
			searchValue.value = movieName;
			const pagination = document.querySelector('.pagination');
			pagination.style.display = 'none';
			const showItems = document.querySelector('.show-items');
			showItems.style.display = 'none';
		}
	} catch (error) {
		console.error(error);
	}
}

const showItems = document.querySelector('.show-items');
let totalPages = 1;

function showMovies(data, numberOfPages) {
	totalPages = numberOfPages;
	const movieNameStrong = document.querySelector('h1 strong');
	movieNameStrong.innerText = movieName;
	movieNameStrong.style.fontWeight = '800';
	const searchValue = document.querySelector('#search');
	searchValue.value = movieName;
	data.forEach(movieInfo => {
		let { title, vote_average, poster_path, genre_ids, id } = movieInfo;
		if (Number.isInteger(vote_average)) {
			vote_average += '.0'
		} else {
			vote_average.toString();
		}
		const voteAverage = document.createElement('span');
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
		const genersContainer = document.createElement('SMALL');

		const playSection = document.createElement('section');
		const playImg = document.createElement('IMG');
		playImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAABmJLR0QA/wD/AP+gvaeTAAAERUlEQVRYhe3Zz08cVQAH8DePmXV+7Owv03igVKAL1EaS9q4WFl2obYzCrY2XUquU2lgJYoyHtomtTWvaiHDR6kl7AUxUQqHiYv8BSdDidglUKNE07o9ZmB/uDG88LDG7szOzM7OzWpN+b7x5Pz7ZmXk/Buz3w8+Ahy/wvwbo5xHLTnDHLaE/6GndRzQ01dTWQX8QI0kAgCqJiMtsra/JK4ncwk+Iy/xLLOhlyfYo1d5JhPcADDOrqqry3UVxbkaKTSN+09YomPU3EXpZpucofegVjKJtjaEKvDA5wY9/ZR1nlUVFuthjJ6E/aAtUGJRJbVwfEedm3GFhFO0/NUg+97xjUGHE2Ex29IoqiebVyryJMBAKXRx2ywQAoNqjoYvDZX91MxYMhEIffkLsbnbLlA8RbgldGjGXGbIwig6eu4LX1rlrygevrQuevYyRlG2Wr2+AaGyqhikfItziPz1kdFWfRUW6qPZo1UjbIZ/toNr0R9FhQS/LHjtZZdJ22N5+yHh1DKVFTM/RSuYnW4GBENN9RKdc+7eXpV982Xq/8lJ868EflcjoQ92lP5iWRbZFMZqx2CNKJZMDJ/7sf1WcnXLMwhiGPPBCGRYV6bTeI9rMAoRUSeKuXeCuXVAlyZmsdNAiFvQHifAeZ12Ls1PJM8eVe8sO2hLNe6HPb8jytO4vs1cxjXL/t+Tg605uKIZ5WvcbsoiGsGNTPts39OoHdm8oXr/bkFXj0lIj/nAzOXBCWbtng7VzlyELBlybrpTVleRbx4Wb31isr5kpi1h2t53mUXN/ZUcuC9+OW6msmZX+DycfVRRc7BrzPMa+dprueslKZVXgDVkok3bLhO9qCLx7Hq+rt1gfcUVDF7G21tdcMVGRLl/fQP7kaDHK/VVDlrySqBCEkaTvjbepjoN2GyorS4as3MI8UFXHEz2+88nA0Hm8vtF2SxXlfp4vLCh6ExGXlu8uOjNRHQcfv/qZExMAcvwOynKFJdrDvhibJlr2WuwOen0AQszjcXbjCgfVlGiPr5Dx7vh8zPqWS15OQNZXs+MJxyaV5x/09qh80QShnU4RvylMTljvlGhsqsQEAOAnxzUmHRYAYHPsS5RKVjKS9aBMSpi4UVquw1IFfuOL0eqTAAAg++nHup9x9NdEcW6m9DF0PdLt76Xbs7qXDJfq7OhH8lK8aiQgJxa54UtGVw1ZqiSmzw4qLi1Hmijrq+lz75jsYM02NohLpwb75Pgv7prkxK+poVPmn1XL7LfQBpd6/4wYs/QJz0rE2anUe29q9gulsfyRsi3K9vbDQMgxCKWS2evDRs+4QxYAADJepvsIfbjb+hqQj8rz/Hdj/Nc3SqdNF1jbDRiGOhClIp1E81MAM30GVCTH74ixafHHW9ZBDln/BPr8nqf34Y1NeP7fBRQNAFBFAXFpZX1NWU7kFubRBle2H5dZVc1DevJ5xLKTvwH31YtfPwn8PgAAAABJRU5ErkJggg==";

		playImg.id = `img-poster-id${count}`;
		movieTitle.htmlFor = `img-poster-id${count}`;
		count++;
		playImg.title = title;
		movieTitle.title = title;
		movieTitle.id = id;
		playImg.name = id;
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

		showItems.append(containerDivImg);
	});
}

async function getGenre(ids, genersContainer) {
	try {
		const types = [];
		const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}&language=en-US`)
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

const upArrow = document.querySelector('.up-arrow');
upArrow.addEventListener('click', () => {
	window.scrollTo(0, 0);
})

const form = document.querySelector('form');
form.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const searchInput = document.querySelector('#search');
	if (searchInput.value) {
		document.location.href = "../search/search.html?search=" + encodeURIComponent(searchInput.value);
	}
});

// selecting required element
const paginationUnOrderList = document.querySelector(".pagination ul");
let page = 1;
//calling function with passing parameters and adding inside element which is ul tag
paginationUnOrderList.innerHTML = createPagination(totalPages, page);
function createPagination(totalPages, page) {
	let liTag = '';
	let active;
	let beforePage;
	if (page === 1) {
		beforePage = 1
	} else {
		beforePage = page - 1;
	}
	let afterPage = page + 1;
	if (page > 1) { //show the Prev button if the page value is greater than 1
		liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
	}
	if (page > 2) { //if page value is greater than 2 then add 1 after the previous button
		liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
		if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
			liTag += `<li class="dots"><span>..</span></li>`;
		}
	}
	// how many pages or li show before the current li
	if (page == totalPages) {
		beforePage = beforePage - 2;
	} else if (page == totalPages - 1) {
		beforePage = beforePage - 1;
	}
	// how many pages or li show after the current li
	if (page === 1) {
		afterPage = afterPage + 2;
	} else if (page === 2) {
		afterPage = afterPage + 1;
	}

	for (let plength = beforePage; plength <= afterPage; plength++) {
		if (plength > totalPages) { //if plength is greater than totalPage length then continue
			continue;
		}
		if (plength === 0) { //if plength is 0 than add +1 in plength value
			plength = plength + 1;
		}
		if (page == plength) { //if page is equal to plength than assign active string in the active variable
			active = "active";
		} else { //else leave empty to the active variable
			active = "";
		}
		if (plength > 0)
			liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
	}
	if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
		if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
			liTag += `<li class="dots"><span>..</span></li>`;
		}
		liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
	}
	if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
		liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
	}
	paginationUnOrderList.innerHTML = liTag; //add li tag inside ul tag
	getMovie(movieName, page);
	document.querySelector('.show-items').innerText = '';
	return liTag; //reurn the li tag
}
// back to main page
const logoNav = document.querySelector('.logo');
logoNav.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});

const home = document.querySelector('.menu li');
home.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});

const logoFooter = document.querySelector('.logo-footer');
logoFooter.addEventListener('click', () => {
	document.location.href = "../main/mainPage.html";
});