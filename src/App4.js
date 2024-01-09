import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "eac2cb72";

export default function App4() {
  const [query, setQuery] = useState("Rocky");

  const [movies, setMovies] = useState([]);

  const [watched, setWatched] = useState([]);

  const [isLoading, setIsLoading] = useState();

  const [selectedId, setSelectedId] = useState(null);

  const [userRating, setUserRating] = useState("");

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleSelectMovie(id) {
    setSelectedId(id);

    if (selectedId === id) {
      setSelectedId(null);
    }
  }

  function handleClose() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    localStorage.setItem("watched", JSON.stringify([...watched, movie]));
    setSelectedId(null);
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          //   console.log(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
          }
        } finally {
          setIsLoading(false);
        }
        if (query.length < 3) {
          setMovies([]);
          return;
        }
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <div>
      <Search query={query} setQuery={setQuery} />
      <Main>
        <Box>
          {query ? (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          ) : (
            ""
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onAddMovie={handleAddWatched}
              watched={watched}
              userRating={userRating}
              setUserRating={setUserRating}
              watchedUserRating={watchedUserRating}
              onClick={handleClose}
            />
          ) : (
            <WatchedList
              userRating={userRating}
              setUserRating={setUserRating}
              watchedUserRating={watchedUserRating}
              watched={watched}
              onSelectMovie={handleSelectMovie}
            />
          )}
        </Box>
      </Main>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Search({ query, setQuery }) {

  const inputEl = useRef(null);

  useEffect(function () {
    function callback(e){

        if(document.activeElement === inputEl.current) return

        if(e.code === "Enter"){

        inputEl.current.focus();
        setQuery("")
        }
    }
        document.addEventListener('keydown', callback);
        return ()=> document.addEventListener("keydown", callback)
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onAddMovie,
  watched,
  setUserRating,
  userRating,
  watchedUserRating,
  onClick,
}) {
  const [movie, setMovie] = useState({});

  const { Title: title, Year: year, Poster: poster, imdbRating } = movie;

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

const countRef = useRef(0);

useEffect(function(){
if (userRating) countRef.current = countRef.current + 1
}, [userRating])



  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating,
      userRating,
      countRatingDecisions: countRef.current
    };
    onAddMovie(newWatchedMovie);
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        console.log(data);
        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      <button onClick={onClick}> &larr; Return </button>
      <h1>Selected Movie: {movie.Title}</h1>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      {!isWatched ? (
        <div>
          <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
          <button onClick={handleAdd}>Add Rating</button>
        </div>
      ) : (
        <div>
          <button>You Rated this Movie {watchedUserRating} ⭐️</button>
        </div>
      )}
    </div>
  );
}

function WatchedList({
  watched,
  onSelectMovie,
  userRating,
  setUserRating,
  watchedUserRating,
}) {
  return (
    <div>
      <WatchedSummary
        watched={watched}
        onSelectMovie={onSelectMovie}
        userRating={userRating}
        setUserRating={setUserRating}
        watchedUserRating={watchedUserRating}
      />
    </div>
  );
}

function WatchedSummary({ watched, onSelectMovie }) {
  const [sortBy, setSortBy] = useState("input");

  const avgImdbRating = average(
    watched.map((movie) => parseFloat(movie.imdbRating))
  );
  const avgUserRating = average(
    watched.map((movie) => parseFloat(movie.userRating))
  );

  let sortedMovies;

  if (sortBy === "input") sortedMovies = watched;

  if (sortBy === "year") {
    sortedMovies = [...watched].sort((a, b) => b.year.localeCompare(a.year));
  }

  if (sortBy === "imdbRating") {
    sortedMovies = [...watched].sort(
      (a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating)
    );
  }

  if (sortBy === "userRating") {
    sortedMovies = [...watched].sort(
      (a, b) => parseFloat(b.userRating) - parseFloat(a.userRating)
    );
  }

  return (
    <div className="movie-summary">
      <div className="dropdown">
        <select
          className="dropbtn"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="input">Input</option>
          <option value="year">Year</option>
          <option value="imdbRating">IMDB Rating</option>
          <option value="userRating">User Rating</option>
        </select>
      </div>

      <h1>Movie Summary</h1>
      <div className="summary-info">
        <p>Movies: 🍿 {watched.length}</p>
        <p>Average IMDB: ⭐️ {avgImdbRating.toFixed(1)}</p>
        <p>Average User Rating: 🌟 {avgUserRating.toFixed(1)}</p>
      </div>
      <ul className="list list-movies">
        {sortedMovies.map((movie) => (
          <WatchedMovieList
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </ul>
    </div>
  );
}

function WatchedMovieList({ movie, onSelectMovie }) {
  console.log({ movie });

  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <h3>{movie.title}</h3>
      <div className="movie-details">
        <span>🗓 {movie.year}</span>
        <span>⭐️ {movie.imdbRating}</span>
        <span>🌟 {movie.userRating}</span>
      </div>
      <img src={movie.poster} alt={`${movie.title} poster`} />
    </li>
  );
}
