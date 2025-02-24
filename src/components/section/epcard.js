import { useNavigate } from "react-router";
function EpCard(props) {
  const imageUrl = `${process.env.REACT_APP_API_URL}/file?name=${props.data1}`;
  const navigate = useNavigate();
  console.log(props);
  return (
    <>
      <div
        onClick={async () => {
          navigate("/play", {
            state: {
              assets: props.assets,
              k: props.k,
              info1: props.slide,
              info2: props.data2,
              info3: props.data1,
            },
          });
        }}
        className="h-32 w-54   rounded-lg  mx-12 "
      >
        <div
          style={{
            backgroundImage: `url(
        ${imageUrl}
          )`,
          }}
          className="absolute border-2 border-pink-400 top-0 bg-cover left-0 mx-12 w-52 backdrop-blur-sm h-32  rounded-lg "
        ></div>
        <div className="bg-black  absolute top-0 left-0 mx-12 w-52 h-32 rounded-lg bg-opacity-50"></div>
        <svg
          fill="#ffffff"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 absolute top-12 left-24 mx-8"
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
      <h1 className="text-white bg-cover font-g font-extrabold w-52 mx-12 py-1 rounded-lg ">
        {props.slide.title}
      </h1>
    </>
  );
}
export default EpCard;
