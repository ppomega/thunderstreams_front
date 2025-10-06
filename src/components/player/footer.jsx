import Carousel from "../front/carousel.jsx";
function Footer(props) {
  return (
    <div className="py-36">
      <h1 className="text-white font-g mx-8 text-3xl  ">More Like this</h1>
      <Carousel assets={props.assets} name={""} />
    </div>
  );
}

export default Footer;
