function Season(props) {
  return (
    <button
      type="button"
      onClick={() => props.click(props.id)}
      className={`series-season font-extrabold font-g px-3 py-1 mx-2 rounded-md${props.selected ? " is-selected" : ""}`}
      aria-pressed={props.selected}
    >
      Season {props.number}
    </button>
  );
}

export default Season;
