function Season(props) {
  return (
    <>
      <div
        onClick={() => {
          props.click(props.id);
        }}
        className="text-white font-extrabold font-g px-2 mx-16 rounded-md bg-opacity-40 bg-pink-500  hover:border-b-gray-500  hover:border-b-2"
      >
        Season {props.number}
      </div>
    </>
  );
}

export default Season;
