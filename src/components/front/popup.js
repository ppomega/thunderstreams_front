import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NavCard from "./navcard";
function PopUp(props) {
  const [results, setResult] = useState([]);
  useEffect(() => {
    setResult(props.results);
  }, [props.results]);
  return (
    <motion.div
      className="min-w-full h-full bg-black z-30 bg-opacity-45 backdrop-blur-lg fixed top-0 "
      style={{
        backdropFilter: "blur(5px)",
        background: "rgba(0, 0, 0, 0.3)",
        padding: "20px",
        borderRadius: "10px",
      }}
      onClick={() => {
        props.g(false);
      }}
      animate={{ backdropFilter: "blur(25px)" }}
      exit={{ backdropFilter: "none", opacity: 10 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          props.g(true);
        }}
        className="w-3/4  text-white bg-opacity-30 bg-pink-700 rounded-lg sticky z-40 top-24 left-52 flex justify-around flex-wrap overflow-y-auto"
      >
        {results != null ? (
          results.map((i) => {
            return <NavCard slide={i} g={props.g} assets={props.assets} />;
          })
        ) : (
          <></>
        )}
      </motion.div>
    </motion.div>
  );
}
export default PopUp;
