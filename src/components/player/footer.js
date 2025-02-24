import Carousel from "../front/carousel";

function Footer(props) {
  console.log(props);
  return (
    <div>
      <h1 className="text-white font-g mx-8 text-3xl ">More Like this</h1>
      <Carousel assets={props.assets} name={""} />
    </div>
  );
}

export default Footer;
