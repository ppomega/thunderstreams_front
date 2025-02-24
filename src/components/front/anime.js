import Carousel from "./carousel";

function Anime(props) {
  return (
    <>
      <Carousel assets={props.assets} name={"Top Picks of 2025"} />
      <Carousel assets={props.assets} name={"Winter Arcs"} />
      <Carousel assets={props.assets} name={"Best of 2024"} />
      <Carousel assets={props.assets} name={"Adventure"} />
      <Carousel assets={props.assets} name={"Sci-Fi"} />
      <Carousel assets={props.assets} name={"Top Picks of 2024"} />
    </>
  );
}
export default Anime;
