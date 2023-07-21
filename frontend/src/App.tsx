import "@fontsource/roboto";
import { useCallback, useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { styled } from "@stitches/react";
import * as _ from "radash";

import { IElement } from "./interfaces/interface";
import { Column } from "./components/Colums";

import { SelectionArea } from "./components/SelectionArea";

// const COLUMNS = ["Backlog"];
export const DEFAULT_COLUMN = "mainSection";

const DEFAULT_DATA_STATE: IElement[] = [
  {
    id: _.uid(6),
    content: "Hello world 1",
    column: DEFAULT_COLUMN,
  },
  {
    id: _.uid(6),
    content: "Hello world 2",
    column: DEFAULT_COLUMN,
  },
];
// const DEFAULT_DATA_STATE_TWO: IElement[] = []

const STARTING_ITEMS = ["Main Section"];

export const App = () => {
  const [COLUMNS, setColumns] = useState(["column-1", "column-2"]);
  const [data, setData] = useState<IElement[]>(DEFAULT_DATA_STATE);
  const [fetchedDataState, setFetchedDataState] = useState(false);
  const handleOnDragStart = (id: any) => {
    console.log(id);
  };
  const handleOnDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      const elementId = active.id;
      const deepCopy = [...data];

      const updateState = deepCopy.map((elm): IElement => {
        if (elm.id === elementId) {
          const column = over?.id ? String(over.id) : elm.column;
          return { ...elm, column };
        }
        return elm;
      });

      setData(updateState);
    },
    [data, setData]
  );
  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://0.0.0.0/api/users"); // replace 'URL_HERE' with your API endpoint
        const newData = await response.json();

        // Set the state with the new data
        const newDataEnriched = newData.map((item: IElement) => ({
          ...item,
          content: item.id,
          column: DEFAULT_COLUMN,
        }));
        setData(newDataEnriched);
        console.log("fetched data");
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    // We only want to fetch once on component mount, and since we are changing data, we need to enfore that.
    if (!fetchedDataState) {
      fetchData();
      setFetchedDataState(true);
    }
  }, [COLUMNS]);

  return (
    <AppHolder>
      <DndContext
        onDragEnd={handleOnDragEnd}
        onDragStart={handleOnDragStart}
        autoScroll={false}
      >
        <HeadWrapper>
          {/* <Users></Users> */}
          {STARTING_ITEMS.map((column, columnIndex) => (
            <SelectionArea
              key={`column-${columnIndex}`}
              heading={column}
              elements={_.select(
                data,
                (elm) => elm,
                (f) => f.column === _.camel(column)
              )}
            />
          ))}
        </HeadWrapper>
        <DashBoard>
          <ColumnManagement>
            <h3>Amount of columns:</h3>

            <ColumnButtons>
              <ColumnAmount>{COLUMNS.length}</ColumnAmount>
              <ButtonUp
                onClick={() => {
                  if (COLUMNS.length === 5) {
                  } else {
                    const updatedColumns = [
                      ...COLUMNS,
                      `column-${COLUMNS.length + 1}`,
                    ];
                    setColumns(updatedColumns);
                  }
                }}
              >
                &#8679;
              </ButtonUp>

              <ButtonDown
                onClick={() => {
                  const updatedColumns = COLUMNS.slice(0, COLUMNS.length - 1);
                  setColumns(updatedColumns);
                }}
              >
                &#8681;
              </ButtonDown>
            </ColumnButtons>
          </ColumnManagement>
        </DashBoard>
        <MainWrapper>
          {COLUMNS.map((column, columnIndex) => (
            <Column
              key={`column-${columnIndex}`}
              heading={column}
              elements={_.select(
                data,
                (elm) => elm,
                (f) => f.column === _.camel(column)
              )}
            />
          ))}
        </MainWrapper>
      </DndContext>
    </AppHolder>
  );
};

const ColumnManagement = styled("div", {
  padding: "0 1rem 0 1rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",

});
const ColumnButtons = styled("span", {

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const ColumnAmount = styled("span", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: 30,
  height: 30,
  borderRadius: 6,
  color: "#FFF",
  background: "rgba( 255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px 0 rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",

  margin: "0 .4rem 0 0",
});



const AppHolder = styled("div", {
  height: "100vw",
  maxWidth: "100vw",
  minWidth: "100vw",
  display: "grid",
  gridGap: ".5rem",
  gridTemplateColumns: "70% auto",
  gridTemplateRows: "30vh 70vh",
});

const DashBoard = styled("div", {
  gridColumn: "2/2",

  border: "solid .5px",
  borderRadius: 10,
});

const MainWrapper = styled("div", {
  gridColumn: "1/ span 2",

  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gridGap: "10px",
  maxWidth: "100vw",
  justifyContent: "space-evenly",
  paddingBottom: 40,
  fontFamily: "Roboto",
});

const HeadWrapper = styled("div", {
  height: "30vh",
  gridColumn: "1/1",
  display: "flex",
  justifyContent: "space-evenly",
  fontFamily: "Roboto",
});


const ButtonDown = styled("button", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: 30,
  height: 30,
  borderRadius: 6,
  color: "#FFF",
  background: "rgba( 255, 255, 255, 0.25)",
  boxShadow: "0 8px 32px 0 rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",
  padding: ".1rem .4rem .1rem .4rem",
  margin: ".1rem",
});
const ButtonUp = styled("button", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: 30,
  height: 30,
  borderRadius: 6,
  color: "#FFF",
  background: "rgba( 255, 255, 255, 0.25)",
  boxShadow: "0 8px 32px 0 rgba( 255, 255, 255, 0.18 )",
  backdropFilter: "blur(5px)",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",
  padding: ".1rem .4rem .1rem .4rem",
  margin: ".1rem",
});
