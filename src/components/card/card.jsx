import { motion } from "framer-motion";
function Card() {
  return (
    <motion.div className=" max-w-md  border-2  border-black  rounded-lg hover:border-gray-400">
      <motion.img
        className="h-full w-full rounded-md"
        src={require("./card.webp")}
      />

      <motion.div className="text-purple-200 font-extrabold text-lg px-2 h-1/3 w-full relative bottom-20 font-g">
        Demon Slayer
      </motion.div>
    </motion.div>
  );
}
export default Card;
