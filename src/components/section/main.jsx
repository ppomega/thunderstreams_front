import { useEffect, useState } from "react";
import Footer from "./footer.jsx";
import Header from "./header.jsx";
import axios from "axios";
import { useLocation } from "react-router";
function Main(props) {
  const c = useLocation();
  const [info2, setI2] = useState([]);

  const imageUrl = `${import.meta.env.VITE_APP_API_URL}/file?name=${
    c.state.info1.thumbnail2
  }`;
  useEffect(() => {
    async function Fetch(name) {
      name = name.replaceAll(" ", "_");
      name = name.replaceAll("-", "_");
      name = name.replaceAll(":", "_");
      let config = {
        method: "GET",
        url: `${import.meta.env.VITE_APP_API_URL}/animeInfo?name=${name}`,
      };
      const list = await axios.request(config);
      console.log(list);
      setI2(list.data);
    }

    Fetch(c.state.info1.name);

    console.log(info2);
  }, []);

  return (
    <div
      className="min-w-full min-h-screen bg-cover"
      style={{
        backgroundImage: `url(
        ${imageUrl}
          )`,
      }}
    >
      <Header
        name={c.state.info1.name}
        genre={c.state.info1.genre}
        rating={c.state.info1.rating}
        info={c.state.info1.description}
      />
      <Footer
        assets={c.state.assets}
        data={info2}
        id={0}
        data1={c.state.info1.thumbnail2}
      />
    </div>
  );
}

export default Main;
