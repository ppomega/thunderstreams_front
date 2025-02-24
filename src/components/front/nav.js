import { useNavigate } from "react-router";

function Nav(props) {
  const navigate = useNavigate();
  function SubStr(str_1, str_2) {
    var f = 0;
    var a = 0;
    var y = false;
    var h = true;
    var str1 = str_1?.toLowerCase().trim().split(" ").join("");
    var str2 = str_2?.toLowerCase().trim().split(" ").join("");
    for (var i = 0; i <= str1?.length - 1; i++) {
      for (var j = a; j <= str2?.length - 1; j++) {
        if (h) {
          if (str1[i] == str2[j]) {
            a = j + 1;
            f += 1;
            y = true;
            h = false;
            break;
          }
        } else if (y) {
          if (str1[i] == str2[j]) {
            f += 1;
            a = j + 1;
            break;
          } else {
            y = false;
            break;
          }
        }
      }

      if (!y) {
        break;
      }
    }
    if (f == str1?.length) {
      return true;
    } else {
      return false;
    }
  }

  async function Collt(st1, datas) {
    var result = [null];
    var t = 0;
    while (t < datas.length) {
      if (SubStr(st1, datas[t].name)) {
        result.push(datas[t]);
      }
      t++;
    }

    return result;
  }

  async function query(q) {
    const r = await Collt(q, props.assets);
    r.shift();
    props.setResults(r);
  }
  return (
    <div className="bg-bubble2 bg-opacity-50 w-full  text-white  backdrop-blur-lg sticky top-0 flex justify-evenly h-12 font-g z-50">
      <div
        className="py-1"
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </div>
      <div
        className="py-1"
        onClick={() => {
          navigate("/anime");
        }}
      >
        Animes
      </div>

      <input
        id="l"
        onChange={async (e) => {
          await query(e.target.value);
        }}
        onFocus={() => {
          props.g(true);
        }}
        className="h-7 bg-bubb bg-opacity-65 px-5 my-1 text-md text-white w-96  rounded-md"
        placeholder="Search"
      ></input>

      <div className="font-o text-3xl py-3"> Thunder Streams</div>
      <div
        onClick={() => {
          navigate("/aboutus");
        }}
        className="py-1"
      >
        About Us
      </div>
    </div>
  );
}
export default Nav;
