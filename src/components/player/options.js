function Options(props) {
  return (
    <div className="select-none absolute px-20 bottom-16 right-8 bg-opacity-75 font-g  bg-bubble2 rounded-xl text-lg text-white h-36 w-48">
      {props.options.map((i) => {
        return (
          <div
            key={i.qualityIndex}
            className="py-2"
            onClick={(e) => {
              e.stopPropagation();
              props.select.current.setQualityFor("video", i.qualityIndex, true);
            }}
          >
            {i.height}
          </div>
        );
      })}
    </div>
  );
}
export default Options;
