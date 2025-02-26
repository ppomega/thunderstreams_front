function Options(props) {
  return (
    <div className="absolute px-20 bottom-16 right-8 font-g  bg-bubble2/75 rounded-xl text-lg text-white h-36 w-48">
      {props.options.map((i, k) => {
        return (
          <div
            key={i.id}
            className="py-2"
            onClick={(e) => {
              e.stopPropagation();
              console.log(i.id);
              props.select.current.setRepresentationForTypeById(
                "video",
                i.id,
                true
              );
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
