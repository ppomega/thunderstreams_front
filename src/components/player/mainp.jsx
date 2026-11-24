import Player from "./player.jsx";
import Footer from "./footer.jsx";
import SideView from "./sideview.jsx";
import { useLocation } from "react-router";
import { useState } from "react";

function MainP() {
  const c = useLocation();
  const episodes = c.state.info2 || [];
  const [index, setIndex] = useState(c.state.k ?? 0);
  const info1 = episodes[index] || c.state.info1;
  const nextEpisode = episodes[index + 1] || null;

  return (
    <div className="player-page w-full">
      <div className="player-row w-full flex">
        <Player
          path={info1.path}
          info1={info1}
          episodeNumber={index + 1}
          nextEpisode={nextEpisode}
          onNext={nextEpisode ? () => setIndex(index + 1) : undefined}
        />
        <SideView
          selected={index}
          data={episodes}
          thumb={c.state.info3}
          onSelect={setIndex}
        />
      </div>
      <Footer assets={c.state.assets}></Footer>
    </div>
  );
}

export default MainP;
