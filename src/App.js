import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Component } from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Headline from './components/Headline'; // Headline.js
import TestEintrag from './components/TestEintrag';
import 'flatpickr/dist/themes/light.css';
import Ffp1 from './images/ffp1.svg';
import Ffp2 from './images/ffp2.svg';
import Desinfektionsmittel from './images/desinfektionsmittel.svg';
import Handschuhe from './images/handschuh.svg';
import FlatPickr from 'react-flatpickr';
import BarChart from './components/BarChart';
import Contact from './components/Contact';
import { Card } from "react-bootstrap";


class App extends Component {

  constructor() {
    super();
    this.state = {
      cntArticle: 1,
      article: "ffp1",
      date: new Date(),
      items: [],
      chartBar: [],
      cntFfp1Chart: 0,
      cntFfp2Chart: 0,
      cntDesinfektionsmittelChart: 0,
      cntHandschuhChart: 0,
      daysBackForChart: 7,
      contactItems: [],
      firstName: "",
      sirName: "",
      testItems: [],
      testType: "",
      testResult: "",
    };

    this.handleAddArticle = this.handleAddArticle.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleImportData = this.handleImportData.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.perpareChart = this.perpareChart.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.handleAddTest = this.handleAddTest.bind(this);
    this.deleteTest = this.deleteTest.bind(this);
  }

  handleAddArticle() {
    const { article, cntArticle, date, items } = this.state;
    const item = {
      cntArticle: cntArticle,
      article: article,
      date: date
    };

    const newItems = [...items, item];
    this.setState({ items: newItems, cntArticle: 1, article: "ffp1" });
  }

  deleteContact(event) {
    const { contactItems } = this.state;
    const target = event.target;
    const value = target.value;

    const newContactItems = contactItems;
    if (value > -1) {
      newContactItems.splice(value, 1);
    }

    this.setState({ contactItems: newContactItems, firstName: "", sirName: "" });
  }


  deleteTest(event) {
    const { testItems } = this.state;
    const target = event.target;
    const value = target.value;

    const newTestItems = testItems;
    if (value > -1) {
      newTestItems.splice(value, 1);
    }

    this.setState({ testItems: newTestItems, testType: "", testResult: "" });
  }

  handleAddContact() {
    const { firstName, sirName, date, contactItems } = this.state;
    const contactItem = {
      firstName: firstName,
      sirName: sirName,
      date: date
    };

    const newItems = [...contactItems, contactItem];
    this.setState({ contactItems: newItems, firstName: "", sirName: "" });
  }

  handleAddTest() {
    const { testType, testResult, date, testItems } = this.state;
    const testItem = {
      testType: testType,
      testResult: testResult,
      date: date
    };

    const newItems = [...testItems, testItem];
    this.setState({ testItems: newItems, testType: "", testResult: "" });
  }


  handleInput(event) {
    const target = event.target;
    const name = target.name;
    let value = target.value;

    if (!isNaN(value)) {
      value = parseInt(value);
    }

    this.setState({ [name]: value });
  }


  handleImportData(evt) {
    //  let status = [];
    const fileObj = evt.target.files[0];
    // Dokumentation https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    const reader = new FileReader();

    let fileloaded = e => {
      const fileContents = e.target.result;
      console.log(`File name: "${fileObj.name}". ` +
        `Length: ${fileContents.length} bytes.`);
      const daten = JSON.parse(fileContents);
      this.setState(daten.data);
      console.log(daten);
    }

    fileloaded = fileloaded.bind(this);
    reader.onload = fileloaded;
    reader.readAsText(fileObj);
  }


  perpareChart() {
    const { daysBackForChart, items } = this.state;

    let cntHandschuh = 0;
    let cntDesi = 0;
    let cntFfp1 = 0;
    let cntFfp2 = 0;

    items.forEach(element => {
      const actdate = Date.parse(new Date()) - (daysBackForChart * 1000 * 60 * 60 * 24);
      const parseddate = Date.parse(element.date);
      if (element.article !== null && parseddate >= actdate) {
        if (element.article === "ffp1") {
          cntFfp1 += parseInt(element.cntArticle);
        } else if (element.article === "ffp2") {
          cntFfp2 = parseInt(element.cntArticle);
        } else if (element.article === "desinfektionsmittel") {
          cntDesi = parseInt(element.cntArticle);
        } else if (element.article === "handschuh") {
          cntHandschuh = parseInt(element.cntArticle);
        } else {
          //there is something wring
        }
      }
    });

    this.setState({ cntDesinfektionsmittelChart: cntDesi, cntHandschuhChart: cntHandschuh, cntFfp1Chart: cntFfp1, cntFfp2Chart: cntFfp2 });
  }


  render() {
    const { formTitel, date, items, cntArticle, article, daysBackForChart, firstName, sirName, contactItems, testType, testResult, testItems } = this.state;
    const titel = "D6 Modul DDB 2021";
    const beschreibung = "App zur Erfassung und Visualisierung der eigenen Covid Testergebnisse.";
    //const converterItem = (item, index) => <div key={"list-item-" + (index + 1)} >{item}</div>;
    return (
      <div className="container">
        <Link to="/">Hauptseite</Link>
        <Link to="/test">Test</Link>
        <Link to="/contact">Kontakt</Link>
        <Link to="/article">Material verbraucht</Link>
        <Link to="/info">Infoseite</Link>
        <Link to="/settings">Einstellungen</Link>
        <Switch>
          <Route exact path="/">
            Hauptseite
              <Headline titel="Hauptseite" beschreibung="Einstiegsseite" />
            {items && items.map((item, index) =>
              <TestEintrag key={"list-item-" + (index + 1)} value={item} />)}
          </Route>
          <Route exact path="/test">
         
            <header>
            <Headline titel="Test" beschreibung="Test" />
            </header>
            <main>
            <div className="row">
              <div class="col-md-6">
                <div className="row">
                  <div class="col-md-6">
                    <input type="radio" value="antigen" name="testType" onChange={this.handleInput} checked={"antigen" === testType} />
                    <label htmlFor="txtDatum">Antigen</label>
                  </div>
                  <div class="col-md-6">
                    <input type="radio" value="pcs" name="testType" onChange={this.handleInput} checked={"pcs" === testType} />
                    <label htmlFor="txtDatum">PCR</label>
                  </div>
                </div>
                <div className="row">
                  <label htmlFor="txtDatum">Datum der der Begegnung</label>
                </div>
                <div className="row">
                  <FlatPickr value={date}
                    onChange={date => this.setState({ date: date[0] })} />
                </div>
                <div className="row">
                  <div class="col-md-6">
                    <input type="radio" value="true" name="testResult" onChange={this.handleInput} checked={"true" === testResult} />
                    <label htmlFor="txtDatum">Positiv</label>
                  </div>
                  <div class="col-md-6">
                    <input type="radio" value="false" name="testResult" onChange={this.handleInput} checked={"false" === testResult} />
                    <label htmlFor="txtDatum">Negativ</label>
                  </div>
                </div>
                <div className="row">
                  <button onClick={e => { this.handleAddTest(e) }} className="btn btn-primary">Speichern</button>
                </div>
              </div>

              <div class="col-md-6">
                <div className="row">
                  {testItems && testItems.map((testItem, index) =>
                    <Card id={"list-item-contact" + (index + 1)}>
                      <Card.Header>{testItem.testResult}{"  "}{testItem.testType}</Card.Header>
                      <Card.Body>{testItem.date.toDateString()}</Card.Body>
                      <button value={index}
                        onClick={e => { this.deleteTest(e) }} className="btn btn-light">Löschen</button>
                    </Card>
                  )}
                </div>
              </div>
              </div>
            </main>
          </Route>
          <Route exact path="/contact">
            <header>
              <Headline titel="Kontakt" beschreibung="Kontakt" />
            </header>
            <main>
              <div className="row">
                <div class="col-md-6">
                  <div className="row">
                    <div class="col-md-6">
                      <label htmlFor="firstName">Vorname</label>
                      <input id="firstName"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={this.handleInput}
                      />
                    </div>
                    <div class="col-md-6">
                      <label htmlFor="sirName">Nachname</label>
                      <input id="sirName"
                        type="text"
                        name="sirName"
                        value={sirName}
                        onChange={this.handleInput}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <label htmlFor="txtDatum">Datum der der Begegnung</label>
                  </div>
                  <div className="row">
                    <FlatPickr value={date}
                      onChange={date => this.setState({ date: date[0] })} />
                  </div>
                  <div className="row">
                    <button onClick={e => { this.handleAddContact(e) }} className="btn btn-primary">Speichern</button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div className="row">
                    {contactItems && contactItems.map((contactItem, index) =>
                      <Card id={"list-item-contact" + (index + 1)}>
                        <Card.Header>{contactItem.sirName}{"  "}{contactItem.firstName}</Card.Header>
                        <Card.Body>{contactItem.date.toDateString()}</Card.Body>
                        <button value={index}
                          onClick={e => { this.deleteContact(e) }} className="btn btn-light">Löschen</button>
                        <button value={index}
                          onClick={e => { this.deleteContact(e) }} className="btn btn-light">Update</button>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </Route>
          <Route exact path="/article">
            <header>
              <Headline titel="Material" beschreibung="Material" />
            </header>
            <main>
              <div className="row">
                <div class="col-md-6">
                  <div className="row">
                    <div className="radio-input">
                      <label>
                        <input type="radio" value="ffp1" name="article" onChange={this.handleInput} checked={"ffp1" === article} />
                        <img id="r" name="article" value="ffp1" src={Ffp1} alt="ffp1" />
                      </label>
                      <label>
                        <input type="radio" value="ffp2" name="article" onChange={this.handleInput} checked={"ffp2" === article} />
                        <img id="p" name="article" value="ffp2" src={Ffp2} alt="ffp2" />
                      </label>
                      <label>
                        <input type="radio" value="desinfektionsmittel" name="article" onChange={this.handleInput} checked={"desinfektionsmittel" === article} />
                        <img id="s" name="article" value="desinfektionsmittel" src={Desinfektionsmittel} alt="Desinfektionsmittel" />
                      </label>
                      <label>
                        <input type="radio" value="handschuh" name="article" onChange={this.handleInput} checked={"handschuh" === article} />
                        <img id="h" name="article" value="handschuh" src={Handschuhe} alt="Handschuhe" />
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div class="col-md-6">
                      <div className="row">
                        <label htmlFor="txtDatum">Datum der Verwendung</label>
                      </div>
                      <div className="row">
                        <FlatPickr value={date}
                          onChange={date => this.setState({ date: date[0] })} />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div className="row">
                        <label htmlFor="cntArticle">Anzahl/Stk</label>
                      </div>
                      <div className="row">
                        <input id="cntArticle"
                          type="number"
                          min="1"
                          name="cntArticle"
                          value={cntArticle}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <button onClick={e => { this.handleAddArticle(e); this.perpareChart() }} className="btn btn-primary">Speichern</button>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="chartCol">
                    <div className="row">
                      <ul class="chartfilter">
                        <li>
                          <input type="radio" name="daysBackForChart" value="7" onChange={e => { this.handleInput(e); this.perpareChart() }} checked={7 === daysBackForChart} />
                          <label >Woche</label>
                        </li>
                        <li>
                          <input type="radio" name="daysBackForChart" value="31" onChange={e => { this.handleInput(e); this.perpareChart() }} checked={31 === daysBackForChart} />
                          <label >Monat</label>
                        </li>
                        <li>
                          <input type="radio" name="daysBackForChart" value="365" onChange={e => { this.handleInput(e); this.perpareChart() }} checked={365 === daysBackForChart} />
                          <label >1 Jahr</label>
                        </li>
                      </ul>
                    </div>
                    <div className="row">
                      <BarChart items={items} daysBackForChart={daysBackForChart} />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </Route>
          <Route exact path="/info">
            Infoseite
              <Headline titel="Infoseite" beschreibung="Infoseite" />
          </Route>
          <Route exact path="/settings">
            Einstellungen
              <div>
              <h2>
                Export
                </h2>
              <a className="btn btn-secondary"
                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ appVersion: 1, data: this.state }))}`}
                download="settings.json">Herunterladen</a>
              <h2>
                Import
                </h2>
              <input type="file" className="hidden"
                multiple={false}
                accept=".json,application/json"
                onChange={evt => this.handleImportData(evt)}
              />
            </div>
          </Route>
          <Route path="*">
            Seite nicht gefunden...
          </Route>
        </Switch>

      </div >
    );
  }
}

export default withRouter(App);
