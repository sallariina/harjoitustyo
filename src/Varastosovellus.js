import { Component } from "react";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

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
    } else if (parseInt(uusikpl) > 40) {
      setLatausTeksti("Kpl-määrä oltava alle 40");
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
        setDisabloi(!disabloitu);
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
    setDisabloi(!disabloitu);
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
    let response = await fetch("http://localhost:3004/tuotteet" + haku);
    let data = await response.json();
    setTuotelista(data);
    console.log(data);
    console.log(data == []);
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
  const [disabloitu, setDisabloi] = useState(false);

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
      <br></br>
      <Button variant="info" onClick={() => fetchData()}>
        Hae
      </Button>
      <br></br>

      <form>
        <label id="Uusituoteotsikko" style={{ fontWeight: "bold" }}>
          Lisää uusi tuote:
        </label>
        <br></br>
        Tuotteen id:
        <input
          disabled={disabloitu}
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
      <br></br>
      <Button data-testid="tallenna" variant="info" onClick={() => uusituote()}>
        Tallenna
      </Button>
      <br></br>
      <br></br>
      <p style={{ color: "red", fontWeight: "bold" }}>{latausTeksti}</p>
      <Table striped bordered hover size="sm" responsive borderColor="primary">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nimi</th>
            <th>Hylly</th>
            <th>Kpl</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tableBody">
          {tuotelista.map((tuote) => {
            return (
              <tr key={tuote.id}>
                {" "}
                <td /* className="table-info" */ width="50">{tuote.id}</td>
                <td width="100">{tuote.nimi}</td>
                <td width="100">{tuote.hylly}</td>
                <td width="100">{tuote.kpl}</td>
                <td width="100">
                  <Button
                    size="sm"
                    variant="outline-info"
                    onClick={() => poistatuote(tuote.id)}
                    id={tuote.id}
                  >
                    Poista tuote
                  </Button>
                </td>
                <td width="100">
                  <Button
                    size="sm"
                    variant="outline-info"
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
                  </Button>
                </td>
              </tr>
            );
          })}{" "}
        </tbody>{" "}
      </Table>
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
