import React from "react";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl text-white">Too small screen size.</h1>
      <h2 className="text-lg">
        Please switch to a{" "}
        <span className="text-cyan-400 text-semibold">desktop</span> or a{" "}
        <span className="text-cyan-400 text-semibold">laptop</span> for a better
        user experience.
      </h2>
    </div>
  );
};

export default Error;
