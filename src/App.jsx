import { useState } from "react";
import { BarLoader } from "react-spinners";
function App() {
  function setDarkMode() {
    document.documentElement.classList = "dark";
  }
  function setLightMode() {
    document.documentElement.classList = "light";
  }
  const [title, setTitle] = useState("");
  const [wait, setWait] = useState(true);
  const [data, setDatas] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(false);
  function check() {
    if (title === "") {
      setError(true);
      setWait(true);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 600);
    } else {
      setError(false);
      setLoading(true);
      fetch(`https://openlibrary.org/search.json?q=${title}`)
        .then((res) => res.json())
        .then((resp) => {
          setDatas(resp.docs);
          setTimeout(() => {
            setLoading(false);
            setWait(false);
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          setError(false);
          setLoading(false);
        });
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5 p-10 sm:p-20 min-h-screen h-auto dark:bg-blue-800 bg-white duration-300">

          <div className="flex gap-5 justify-between">
            <button
              onClick={setLightMode}
              className="px-2 rounded-sm text-blue-300 border border-blue-200 hover:border-blue-300">
              Light Mode
            </button>
            <button
              onClick={setDarkMode}
              className="px-2 rounded-sm text-blue-300 border border-blue-200 hover:border-blue-300">
              Night Mode
            </button>
          </div>

        <h1 className="text-5xl text-blue-400">Open Library Search API</h1>
        <input
          type="text"
          autoComplete="true"
          className="p-1 px-5 w-full max-w-[400px] outline-none rounded-sm text-white bg-blue-400 placeholder:text-white focus:drop-shadow-lg shadow-black/40"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search book title here"
        />
        <button
          className="border-[1px] w-full max-w-[400px] bg-blue-300 text-white rounded hover:bg-blue-400 duration-200 active:scale-95"
          onClick={() => check()}>
          Search
        </button>
        {loading ? (
          <BarLoader color="blue" />
        ) : error ? (
          <span className="border-2 border-red-800 px-4 py-3 rounded-md bg-red-300 text-red-800">
            This field can not be empty
          </span>
        ) : (
          ""
        )}
        <div className="rounded-lg">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {error
              ? ""
              : wait
              ? ""
              : data.map((title, index) => (
                  <div className="border-[1px] w-full bg-blue-600 rounded p-2">
                    <p className="text-blue-300" key={index + 1}>
                      Author: {title.author_name}
                    </p>
                    <p className="text-white" key={index}>
                      Title: {title.title}
                    </p>
                    <span className="text-green-300">
                      Want to read count:{" "}
                      {title.want_to_read_count === undefined || null || ""
                        ? 0
                        : title.want_to_read_count}
                    </span>
                  </div>
                ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
