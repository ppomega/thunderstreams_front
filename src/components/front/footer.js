import Carousel from "./carousel";

function Footer() {
  return (
    <div className="min-h-full">
      <div className="py-6">
        <h1 className="text-white font-a text-3xl mx-2 h">More Like this</h1>
        <Carousel id={1} />
      </div>
      <div className="py-6">
        <h1 className="text-white font-a text-3xl mx-2">More Like this</h1>
        <Carousel id={2} />
      </div>
      <div className="py-6">
        <h1 className="text-white font-a text-3xl mx-2">More Like this</h1>
        <Carousel id={3} />
      </div>
      <div className="py-6">
        <h1 className="text-white font-a text-3xl mx-2">More Like this</h1>
        <Carousel id={4} />
      </div>
      <div className="py-6">
        <h1 className="text-white font-a text-3xl mx-2">More Like this</h1>
        <Carousel id={5} />
      </div>
    </div>
  );
}
export default Footer;
