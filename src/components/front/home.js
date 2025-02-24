import Slider from "./slider";
import Carousel from "./carousel";

function Home(props) {
  return (
    <>
      {props.assets.length !== 0 ? <Slider data={props.assets} /> : <></>}
      {props.assets.length !== 0 ? (
        <>
          <Carousel assets={props.assets} name={"Latest In 2025"} id={0} />
          <Carousel assets={props.assets} name={"Action"} id={1} />
          <Carousel assets={props.assets} name={"Fantasy"} id={2} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
export default Home;
