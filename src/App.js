import { useRef, useState } from "react";
import "./App.css";
function App() {
  const [img, setImg] = useState();
  const imgRef = useRef();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const API_ENDPOINTS = {
    validate: `${BACKEND_URL}/check-usage`,
    processImage: `${BACKEND_URL}/process-image`,
    download: `${BACKEND_URL}/download`,
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

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", img);

    fetch(`${API_ENDPOINTS.processImage}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log(res.body);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setResult(data.file);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setIsLoading(false);
      });
  };

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
          {result && (
            <a
              href={`${API_ENDPOINTS.download}/${result}`}
              target="_blank"
              rel="noreferrer"
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
              DOWNLOAD
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
