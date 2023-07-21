import { FC, useMemo, useEffect, useState } from "react";
import Avatar from "boring-avatars";
import { styled } from "@stitches/react";

import { DraggableLarge } from "../primitives/DraggableLarge";

import {
  IDraggableElement,
  IMovieList,
  IContent,
} from "../interfaces/interface";
import { MovieList } from "./MovieList";

export const DraggableElement: FC<IDraggableElement> = ({ identifier }) => {
  const itemIdentifier = useMemo(() => identifier, [identifier]);

  // set state i guess
  const [data, setData] = useState<IContent>();
  const [fetchedDataState, setFetchedDataState] = useState(false);
  const [managerVisibleState, setManagerVisibleState] = useState(false);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async (identifier: string) => {
      try {
        const response = await fetch(
          `http://0.0.0.0/api/recommendations/${identifier}`
        ); // replace 'URL_HERE' with your API endpoint
        const newData = await response.json();

        const MovieLists: IMovieList[] = newData.map(
          (item: any, index: number) => ({
            id: item.id,
            recommendationModel: item.recommendation_model,
            movies: item.movies,
            active: true,
            order: index,
          })
        );

        // Our data is a bit wonky as we are recieving the user n times theres a recommendation made out
        // for that user. This section will be improved in the future - @snorrealv

        // grabs info from first element
        const userDescriptionLong: string = newData[0].user_description_long;
        const userDescriptionShort: string = newData[0].user_description_short;

        const content: IContent = {
          id: identifier,
          userDescriptionLong: userDescriptionLong,
          userDescriptionShort: userDescriptionShort,
          movieLists: [...MovieLists],
        };

        setData(content);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };
    // We only want to fetch once on component mount, and since we are changing data, we need to enfore that.
    if (!fetchedDataState) {
      fetchData(itemIdentifier);
      setFetchedDataState(true);
    }
  }, [data, managerVisibleState]);

  return (
    <DraggableLarge id={itemIdentifier}
    >
      <MovieListManager>
        <MovieListManagerButton
            onClick={() => {
              if (!managerVisibleState) {
                setManagerVisibleState(true)
              }
              if (managerVisibleState) {
                setManagerVisibleState(false)
              }
            }}
        >Filter and Order</MovieListManagerButton>
        {managerVisibleState && (
        <MovieListContent>
          {/* {
            As i have no patience to attempt to share state between components as of date, 
            i ask your apology, dear code reader, for the heanus crime im about to commit
            below. I hope the react guru's might find a place in their heart to forgive me.
            - a sinner, @snorrealv
          } */}

          {data?.movieLists
            .sort((a, b) => a.order - b.order)
            .map((movieList, movieIndex) => (
              <MovieListManagerItems key={`${movieIndex}-span`}>
                <label key={movieIndex}>
                  <input
                    type="checkbox"
                    checked={movieList.active}
                    onChange={(e) => {
                      const updatedMovieLists = [...data.movieLists];
                      updatedMovieLists[movieIndex] = {
                        ...updatedMovieLists[movieIndex],
                        active: e.target.checked,
                      };
                      setData(() => ({
                        ...data,
                        movieLists: updatedMovieLists,
                      }));
                    }}
                  />

                  {movieList.recommendationModel}
                </label>
                <span>
                {/* up */}
                {data.movieLists[movieIndex].order > 0 && (
                  <ButtonUp
                    onClick={() => {
                      const updatedMovieLists = [...data.movieLists];
                      // update self
                      updatedMovieLists[movieIndex] = {
                        ...updatedMovieLists[movieIndex],
                        order: updatedMovieLists[movieIndex].order - 1,
                      };

                      // update younger sibling
                      if (updatedMovieLists[movieIndex - 1]) {
                        updatedMovieLists[movieIndex - 1] = {
                          ...updatedMovieLists[movieIndex - 1],
                          order: updatedMovieLists[movieIndex - 1].order + 1,
                        };
                      }

                      setData(() => ({
                        ...data,
                        movieLists: updatedMovieLists,
                      }));
                    }}
                  >
                    &#8679;
                  </ButtonUp>
                )}
                {/* down */}
                {data.movieLists[movieIndex].order <
                  data.movieLists.length - 1 && (
                  <ButtonDown
                    onClick={() => {
                      const updatedMovieLists = [...data.movieLists];
                      // update self
                      updatedMovieLists[movieIndex] = {
                        ...updatedMovieLists[movieIndex],
                        order: updatedMovieLists[movieIndex].order + 1,
                      };

                      // update older sibling
                      if (updatedMovieLists[movieIndex + 1]) {
                        updatedMovieLists[movieIndex + 1] = {
                          ...updatedMovieLists[movieIndex + 1],
                          order: updatedMovieLists[movieIndex + 1].order - 1,
                        };
                      }

                      setData(() => ({
                        ...data,
                        movieLists: updatedMovieLists,
                      }));
                    }}
                  >
                    &#8681;
                  </ButtonDown>
                  
                )}
                </span>
              </MovieListManagerItems>
            ))}
        </MovieListContent>
        )}
      </MovieListManager>
      <ElementWrapper 
        onClick={() => {
          // Code to execute when the button is clicked

            setManagerVisibleState(false)
          }}
      >
        <PersonWrapper>
          <PersonPicture>
            <Avatar
              size={100}
              name={data?.id}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          </PersonPicture>
          <PersonDescription>
            <h3>User: {data?.id}</h3>
            <PersonDescriptionHolder>
              <p>
                {data?.userDescriptionLong}
              </p>
            </PersonDescriptionHolder>
          </PersonDescription>
        </PersonWrapper>

        {data?.movieLists
          .sort((a, b) => a.order - b.order)
          .filter((movieList) => movieList.active) // Filter the movieLists based on active property
          .map((movieList, movieListIndex) => (
            <MovieList
              key={`movielist-element-${movieListIndex}-${movieList.id}`}
              id={movieList.id}
              recommendationModel={movieList.recommendationModel}
              movies={movieList.movies}
              order={movieList.order}
              active={movieList.active}
            />
          ))}
      </ElementWrapper>
    </DraggableLarge>
  );
};

const MovieListManagerItems = styled("div", {
  display: "flex",
  justifyContent: "space-between",
})
const ButtonDown = styled("button", {
  height: 30,
  padding: ".1rem .4rem .1rem .4rem",
  margin: ".1rem"
});
const ButtonUp = styled("button", {

  height: 30,
  padding: ".1rem .4rem .1rem .4rem",
  margin: ".1rem"
});
const MovieListManager = styled("div", {
  gridColumn: "2/2",
  gridRow: "1/1",
});
const MovieListContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  margin: ".5rem 0 0 0",
  width: "auto",
  minWidth: "15rem",
  borderRadius: 6,
  color: "#FFF",
  background: "rgba( 255, 255, 255, 0.25 )",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",
});

const MovieListManagerButton = styled("button", {
  height: "auto",
  margin: "0 0 0 1rem",
  borderRadius: 6,
  color: "#FFF",
  background: "rgba( 255, 255, 255, 0.1 )",
  boxShadow: "0 8px 32px 0 rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",
});
const PersonWrapper = styled("div", {
  display: "grid",
  overflow: "hidden",
  gridTemplateColumns: "30% auto",
  paddingLeft: 10,
});

const PersonPicture = styled("div", {
  gridColumn: "1/1",

  "& svg": {
    borderRadius: 50,
    color: "#FFF",
    background: "rgba( 255, 255, 255, 0.25 )",

    backdropFilter: "blur(5px)",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
  },
});

const PersonDescription = styled("div", {
  height: "10rem",
  overflow: "hidden",
  gridColumn: "2/2",

  "& h3": {
    margin: "0",
  },
});
const PersonDescriptionHolder = styled("div", {
  height: "100%",
  overflow: "scroll",

  "& p": {
    height: "fit-content",
    margin: "0",
    textOverflow: "ellipsis",
  },
});

const ElementWrapper = styled("div", {
  // background: "#f6f6f6",
  gridColumn: "1/ span 2",
  gridRow: "2/2",
  minHeight: 120,
  height: "auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  marginTop: 12,

  borderRadius: 6,
});