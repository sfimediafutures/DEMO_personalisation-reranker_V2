import { FC, useEffect, useState } from "react";
import { styled } from "@stitches/react";
import * as _ from "radash";
import { IMovieList } from "../interfaces/interface";


const FetchImageClausul: FC<any> = ({ cached_img_url, tmdbid, movieIndex }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (tmdbId: number) => {
      try {
        const response = await fetch(`http://0.0.0.0/api/movies/image/${tmdbId}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    const fetchImage = async () => {
      if (cached_img_url === "not_cached") {
        const item = await fetchData(tmdbid);
        if (item && item.poster_path) {
          setImageUrl(`https://image.tmdb.org/t/p/w200/${item.poster_path}`);
        }
      } else {
        setImageUrl(`https://image.tmdb.org/t/p/w200/${cached_img_url}`);
      }
    };

    fetchImage();
  }, [cached_img_url, tmdbid]);

  return imageUrl ? (
    <MovieElement src={imageUrl} key={movieIndex} />
  ) : null;
};



export const MovieList: FC<IMovieList> = ({ movies, recommendationModel }) => {
  return (
    <>
      <Title>{recommendationModel}</Title>
      <StyledMovieList>
        {movies
          .sort((a, b) => a.rank - b.rank)
          .map((movie, movieIndex) => (
              <FetchImageClausul
                cached_img_url={movie.cached_img_url}
                movieIndex={movieIndex}
                tmdbid={movie.tmdbId}
              />
          ))}
      </StyledMovieList>
    </>
  );
};

// async function getImageFromSource(tmdbId){
//   const f = await fetch(`${url}/api/movies/image/${tmdbId}`)
//   const j = await f.json()
//   return j;
// }

// if (element.cached_img_url == "not_cached") {
//   const item_detail = await getImageFromSource(element.tmdbId)
//       item.src = `https://image.tmdb.org/t/p/w200/${item_detail.poster_path}`
//   } else {
//       item.src = `https://image.tmdb.org/t/p/w200${element.cached_img_url}`
//   }
//   item.dataset.id = element.tmdbId

const Title = styled("div", {
  textAlign: "left",
  fontSize: "1rem",
});

const StyledMovieList = styled("div", {
  width: "100%",
  height: "",
  display: "flex",
  overflowX: "scroll",
  overflowY: "hidden",
  flexDirection: "row",
});
const MovieElement = styled("img", {
  maxHeight: 200,
  maxWidth: 100,
  borderRadius: 4,
  flex: "0 0 19.7%",
  textAlign: "center",
  margin: "0 2px",
  transition: "transform 300ms ease 100ms",

  "&:hover": {
    transform: "scale(1.1) !important",
  },
});
