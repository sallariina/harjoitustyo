import { Component } from "react";
import React, { useState, useEffect } from "react";

//disabloi id homma

let haku = "";
let nimihaku = "";
let hyllyhaku = "";
let poistettava = "";
let muokattava = "";

function Varastosovellus(props) {
  async function uusituote() {
    let response = await fetch(
      "http://localhost:3004/tuotteet?id=" + muokattava
    );
    let data = await response.json();

    if (
      uusituoteid == "" ||
      uusinimi == "" ||
      uusikpl == "" ||
      uusihylly == ""
    ) {
      setLatausTeksti("Täytä kaikki tiedot");
      fetchData();
    } else if (parseInt(uusikpl) > 20) {
      setLatausTeksti("Kpl-määrä oltava alle 20");
      fetchData();
    } else if (data == "") {
      await fetch("http://localhost:3004/tuotteet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uusituoteid,
          nimi: uusinimi,
          hylly: uusihylly,
          kpl: uusikpl,
        }),
      }).then((response) => {
        console.log(response);
        setLatausTeksti("");
        fetchData();
        tyhjenna();
      });
    } else {
      await fetch("http://localhost:3004/tuotteet/" + muokattava, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uusituoteid,
          nimi: uusinimi,
          hylly: uusihylly,
          kpl: uusikpl,
        }),
      }).then((response) => {
        console.log(response);
        setLatausTeksti("");
        fetchData();
        tyhjenna();
      });
    }
  }

  function tyhjenna() {
    setUusituoteid("");
    setUusinimi("");
    setUusihylly("");
    setUusikpl("");
  }

  async function muokkaatuotetta(id, nimi, hylly, kpl) {
    muokattava = id;
    setUusituoteid(id);
    setUusinimi(nimi);
    setUusihylly(hylly);
    setUusikpl(kpl);
  }

  async function poistatuote(id) {
    poistettava = id;
    await fetch("http://localhost:3004/tuotteet/" + poistettava, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchData();
  }

  async function fetchData() {
    haku = "";
    if (nimi != "") {
      nimihaku = "?nimi=" + nimi;
      haku = nimihaku;
    }
    if (hylly != "" && nimi != "") {
      hyllyhaku = "&hylly=" + hylly;
      haku = nimihaku + hyllyhaku;
    }
    if (hylly != "" && nimi == "") {
      hyllyhaku = "?hylly=" + hylly;
      haku = hyllyhaku;
    }
    /* setLatausTeksti("Loading..."); */
    /* setTuotelista([]); */
    let response = await fetch("http://localhost:3004/tuotteet" + haku);
    let data = await response.json();
    setTuotelista(data);
    console.log(data);
    console.log(data == []);
    /* setLatausTeksti(""); */
    if (data == "") {
      setLatausTeksti("Ei hakutuloksia");
    }
  }

  const [latausTeksti, setLatausTeksti] = useState("");
  const [tuotelista, setTuotelista] = useState([]);
  const [nimi, setNimi] = useState("");
  const [hylly, setHylly] = useState("");

  const [uusituoteid, setUusituoteid] = useState("");
  const [uusinimi, setUusinimi] = useState("");
  const [uusihylly, setUusihylly] = useState("");
  const [uusikpl, setUusikpl] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <form>
        <label id="Hakuotsikko" style={{ fontWeight: "bold" }}>
          Haku:
        </label>
        <br></br>
        Tuotteen nimi:
        <input
          type="text"
          name="nimi"
          onChange={(event) => setNimi(event.target.value)}
        />
        Hylly:
        <input
          type="text"
          name="hylly"
          onChange={(event) => setHylly(event.target.value)}
        />
      </form>
      <button onClick={() => fetchData()}>Hae</button>
      <br></br>

      <form>
        <label id="Uusituoteotsikko" style={{ fontWeight: "bold" }}>
          Lisää uusi tuote:
        </label>
        <br></br>
        Tuotteen id:
        <input
          type="text"
          name="uusituoteid"
          value={uusituoteid}
          onChange={(event) => setUusituoteid(event.target.value)}
        />
        Tuotteen nimi:
        <input
          type="text"
          name="uusinimi"
          value={uusinimi}
          onChange={(event) => setUusinimi(event.target.value)}
        />
        <br></br>
        Hylly:
        <input
          type="text"
          name="uusihylly"
          value={uusihylly}
          onChange={(event) => setUusihylly(event.target.value)}
          required
        />
        Määrä:
        <input
          type="text"
          name="uusikpl"
          value={uusikpl}
          onChange={(event) => setUusikpl(event.target.value)}
        />
      </form>
      <button onClick={() => uusituote()}>Tallenna</button>
      <br></br>
      {latausTeksti}
      <table>
        <thead>
          <tr>
            <th>Id:</th>
            <th>Nimi:</th>
            <th>Hylly:</th>
            <th>Kpl:</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        {tuotelista.map((tuote) => {
          return (
            <tbody id="tableBody" key={tuote.id}>
              <td>{tuote.id}</td>
              <td>{tuote.nimi}</td>
              <td>{tuote.hylly}</td>
              <td>{tuote.kpl}</td>
              <td>
                <button onClick={() => poistatuote(tuote.id)} id={tuote.id}>
                  Poista tuote
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    muokkaatuotetta(
                      tuote.id,
                      tuote.nimi,
                      tuote.hylly,
                      tuote.kpl
                    )
                  }
                  id={tuote.id}
                >
                  Muokkaa tuotetta
                </button>
              </td>
            </tbody>
          );
        })}
      </table>

      <br />
      <p></p>
    </div>
  );
}

function Varasto() {
  return (
    <div className="App">
      <h1>Varastoinfo</h1>
      <Varastosovellus />
    </div>
  );
}

export default Varasto;
