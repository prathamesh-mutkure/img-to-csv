import { useRef, useState } from "react";
import "./App.css";
import { csvSample, csvTable } from "./file";
import { Parser } from "@json2csv/plainjs";

function App() {
  const [img, setImg] = useState();
  const imgRef = useRef();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_ENDPOINTS = {
    validate: "https://validator.extracttable.com/",
    req: "https://trigger.extracttable.com/",
    res: "https://getresult.extracttable.com/	",
  };

  const onImgClick = () => {
    if (isLoading) return;

    imgRef?.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file == null) return;

    setImg(file);
    setResult(null);
  };

  const onProcessHandler = async () => {
    if (isLoading || !img) return;

    console.log("Process");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("input", img);

    fetch(`${API_ENDPOINTS.req}`, {
      method: "POST",
      body: formData,
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setResult(data["Tables"][0]["TableJson"]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  // const onProcessHandler = async () => {
  //   if (isLoading || !img) return;

  //   setIsLoading(true);

  //   const formData = new FormData();
  //   formData.append("input", img);

  //   fetch(`https://tempapi.proj.me/api/ZaggQUF07`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setResult(csvSample);

  //       try {
  //         // const opts = {};
  //         // const parser = new Parser(opts);
  //         // const csv = parser.parse(csvTable);
  //         // console.log(csvTable);
  //         // console.log(csv);
  //       } catch (err) {
  //         console.error(err);
  //       }

  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setIsLoading(false);
  //     });
  // };

  return (
    <div className="App">
      <div className="App-header">
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          name="img"
          id="img"
          style={{
            visibility: "hidden",
          }}
          onChange={handleImageChange}
        />

        <div>
          {img ? (
            <img
              src={URL.createObjectURL(img)}
              className="App-logo"
              alt="logo"
            />
          ) : (
            <p>Select Image</p>
          )}
        </div>

        <div>
          <button
            onClick={onImgClick}
            style={{
              color: "white",
              background: "#3f51b5",
              padding: "0.75rem",
              fontWeight: "bold",
              border: "none",
              margin: "1rem",
              opacity: !isLoading ? 1 : 0.9,
              cursor: !isLoading ? "pointer" : "not-allowed",
            }}
          >
            SELECT IMAGE
          </button>

          <button
            onClick={img && !isLoading ? onProcessHandler : null}
            disabled={(img && !isLoading) == null}
            style={{
              color: "white",
              background: "#3f51b5",
              padding: "0.75rem",
              fontWeight: "bold",
              border: "none",
              margin: "1rem",
              opacity: img && !isLoading ? 1 : 0.9,
              cursor: img && !isLoading ? "pointer" : "not-allowed",
            }}
          >
            PROCESS
          </button>
        </div>

        <div>
          {/* {csvFile && (
            <a
              href="/"
              style={{
                color: "white",
                background: "#3f51b5",
                padding: "0.75rem",
                fontWeight: "bold",
                border: "none",
                margin: "1rem",
                opacity: img && !isLoading ? 1 : 0.9,
                cursor: img && !isLoading ? "pointer" : "not-allowed",
              }}
            >
              DOWNLOAD
            </a>
          )} */}

          {result && (
            <table>
              <thead>
                {Object.values(Object.values(result)[0]).map((val) => (
                  <th>{val}</th>
                ))}
              </thead>
              <tbody>
                {Object.values(result)
                  .slice(1)
                  .map((row) => {
                    return (
                      <tr>
                        {Object.values(row).map((data) => (
                          <td>{data}</td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
