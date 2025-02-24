import Footer from "./footer";
import Header from "./header";
import { useLocation } from "react-router";
function Main(props) {
  const c = useLocation();
  console.log(c);

  const imageUrl = `${process.env.REACT_APP_API_URL}/file?name=${c.state.info1.thumbnail2}`;
  return c.state.info1.thumbnail2 ? (
    <div
      className="min-w-full min-h-screen bg-cover"
      style={{
        backgroundImage: `url(
        ${imageUrl}
          )`,
      }}
    >
      <div className="min-w-full min-h-full absolute top-0 left-0 bg-bubble2  bg-opacity-45"></div>
      <Header
        name={c.state.info1.name}
        genre={c.state.info1.genre}
        rating={c.state.info1.rating}
        info={c.state.info1.description}
      />
      <Footer
        assets={c.state.assets}
        data={c.state.info2}
        id={0}
        data1={c.state.info1.thumbnail2}
      />
    </div>
  ) : (
    <></>
  );
}

export default Main;
