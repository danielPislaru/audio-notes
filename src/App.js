import React, { useState, useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const mic = new SpeechRecognition();
mic.continous = true;
mic.interimResults = true;
/* mic.lang = "ro-RO"; */
/* mic.lang = "en-US"; */

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [language, setLanguage] = useState("ro-RO");

  useEffect(() => {
    mic.lang = language;
  }, [language]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    loadNotesFromLocalStorage();
  }, []);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        /* console.log("continue");
        mic.start(); */

        setIsListening(false);
      };
    } else {
      mic.stop();
      mic.onend = () => {
        setIsListening(false);
        console.log("STOPped mic on click");
      };
    }
    mic.onstart = () => {
      console.log("mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((res) => res[0])
        .map((res) => res.transcript)
        .join("");

      setNote(transcript);

      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };
  const handleSaveNote = () => {
    let newSavedList = [...savedNotes, note];
    setSavedNotes(newSavedList);
    setIsListening(false);
    setNote("");

    saveNotesToLocalStorage(newSavedList);
  };
  const handleDeleteNote = (note) => {
    let newSavedList = savedNotes.filter((prevItem) => prevItem !== note);

    setSavedNotes(newSavedList);
    saveNotesToLocalStorage(newSavedList);
  };

  const saveNotesToLocalStorage = (notes) => {
    localStorage.setItem("audio-notes", JSON.stringify(notes));
  };
  const loadNotesFromLocalStorage = () => {
    try {
      let loadedNotes = localStorage.getItem("audio-notes");

      let notes = JSON.parse(loadedNotes);

      if (notes) {
        setSavedNotes(notes);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <label htmlFor="language">Choose language: </label>

      <select
        name="language"
        id="language"
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="ro-RO">RO</option>
        <option value="en-US">EN</option>
      </select>
      <div className="main">
        <div className="box">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
              justifyContent: "space-between",
            }}
          >
            <h2>
              {isListening && (
                <span>
                  <i>listening...</i>
                </span>
              )}
            </h2>

            <button
              className="btn-listen"
              onClick={() => {
                setIsListening((prevState) => !prevState);
              }}
            >
              {!isListening ? "🎤 Start" : "🛑 Stop"}
            </button>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <h6>{note}</h6>{" "}
            {note && (
              <div style={{ marginLeft: "10px" }}>
                <button
                  className="btn-save"
                  onClick={handleSaveNote}
                  disabled={!note}
                >
                  👍
                </button>
                <button
                  className="btn-delete"
                  onClick={() => setNote("")}
                  disabled={!note}
                >
                  👎
                </button>
              </div>
            )}
          </div>
        </div>
        <hr style={{ margin: "10px 0 " }} />
        <div className="box">
          <h2>Notes</h2>
          <ul className="list-notes">
            {savedNotes?.map((note, idx) => {
              return (
                <li
                  key={idx}
                  className="note"
                  onClick={() => handleDeleteNote(note)}
                >
                  {note}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default App;
