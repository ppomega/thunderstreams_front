import { useNavigate } from "react-router";
import axios from "axios";

function NavCard(props) {
  const navigate = useNavigate();
  async function Fetch(name) {
    name = name.replaceAll(" ", "_");
    name = name.replaceAll("-", "_");

    let config = {
      method: "GET",
      url: `${import.meta.env.VITE_APP_API_URL}/animeInfo?name=${name}`,
    };
    const list = await axios.request(config);
    return list.data;
  }
  const imageUrl = `${import.meta.env.VITE_APP_API_URL}/file?name=${
    props.slide.thumbnail1
  }`;
  return (
    <div>
      <div
        onClick={async (e) => {
          e.stopPropagation();
          const c = await Fetch(props.slide.name);
          props.g(false);
          navigate("/series", {
            state: { info1: props.slide, info2: c, assets: props.assets },
          });
        }}
        style={{
          backgroundImage: `url(
  ${imageUrl}
    )`,
        }}
        className="w-52 h-36 my-6 bg-cover rounded-lg  hover:border-4 border-pink-500"
      ></div>
      <h1 className=" text-white  text-lg font-semibold">{props.slide.name}</h1>
    </div>
  );
}
export default NavCard;
