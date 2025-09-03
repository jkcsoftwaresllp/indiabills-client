import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import { Button } from "@mui/material";
import React from "react";

const SetupTemplate = ({ heading, main, finish, big, navigation, setPage }) => {
  const parts = heading.split(/(\[.*?\])/);

  return (
    <MultiPageAnimate>
      <div
        className={`flex flex-col items-center gap-8 justify-center p-8 bg-setup mx-auto ${
          big ? `min-w-[60rem]` : `max-w-[40rem]`
        }`}
      >
        <h1 className={"text-2xl font-semibold"}>
          {parts.map((part, index) => {
            if (part.startsWith("[") && part.endsWith("]")) {
              return (
                <span key={index} className="text-red-500">
                  {part.slice(1, -1)}
                </span>
              );
            } else {
              return <span key={index}>{part}</span>;
            }
          })}
        </h1>

        <main className={big ? `w-full` : ``}>{main}</main>

        <div className={"flex justify-end gap-4 w-full"}>
          {navigation === "one-page" && (
            <Button
              sx={{ color: "#be123c" }}
              size={"small"}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Register
            </Button>
          )}
          {navigation === "final" && (
            <Button
              sx={{ color: "#be123c" }}
              size={"small"}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
          )}
          {navigation === "both" && (
            <Button
              sx={{ color: "#be123c" }}
              size={"small"}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
          )}
          {navigation === "both" && (
            <Button
              sx={{ color: "#be123c" }}
              size={"small"}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
          {navigation === "next" && (
            <Button
              sx={{ color: "#be123c" }}
              size={"small"}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Begin
            </Button>
          )}
          {navigation === "final" && (
            <Button
              sx={{ color: "#be123c" }}
              size={"small"}
              onClick={() => finish()}
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </MultiPageAnimate>
  );
};

export default SetupTemplate;
