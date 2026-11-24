import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NavCard from "./navcard.jsx";
function PopUp(props) {
  const [results, setResult] = useState([]);
  useEffect(() => {
    setResult(props.results);
  }, [props.results]);
  return (
    <motion.div
      className="search-overlay min-w-full h-full z-30 fixed top-0"
      style={{
        backdropFilter: "blur(5px)",
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
        className="w-3/4 search-panel rounded-xl sticky z-40 top-24 left-52 flex justify-around flex-wrap overflow-y-auto"
      >
        {results != null ? (
          results.map((i) => {
            return <NavCard key={i._id} slide={i} g={props.g} assets={props.assets} />;
          })
        ) : (
          <></>
        )}
      </motion.div>
    </motion.div>
  );
}
export default PopUp;
