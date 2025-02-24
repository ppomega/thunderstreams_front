import { useState } from "react";

function SideView(props) {
  const imageUrl = `${process.env.REACT_APP_API_URL}/file?name=${props.thumb}`;
  const [selected, Select] = useState(props.k);
  console.log(props);
  return (
    <div className="w-1/3 bg-transparent  font-g text-white  flex-row overflow-y-hidden">
      {props.data.map((i, k) => (
        <>
          <div
            className="w-full rounded-xl relative top-0 left-0 flex py-1"
            onClick={() => {
              props.setPath(i.path);
              Select(k);
            }}
          >
            {selected == k ? (
              <div className="w-full absolute top-0 left-0 h-full rounded-lg bg-opacity-15 bg-white" />
            ) : (
              <></>
            )}
            <div
              style={{
                backgroundImage: `url(
        ${imageUrl}
          )`,
              }}
              className="w-1/4 rounded-lg bg-cover mx-2"
            >
              <svg
                fill="#ffffff"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8  mx-10 my-5"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>play</title>{" "}
                  <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"></path>{" "}
                </g>
              </svg>
            </div>
            <div className="w-3/4 rounded-lg h-18 px-6 text-white bg-pink-600 bg-opacity-10">
              {i.title}
              <h1 className="text-sm font-g text-gray-400">{i.description}</h1>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

export default SideView;
