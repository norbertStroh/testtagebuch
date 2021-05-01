import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Component } from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Headline from './components/Headline'; // Headline.js
import Header from './components/Header';
import 'flatpickr/dist/themes/light.css';
import Ffp1 from './images/ffp1.svg';
import Ffp2 from './images/ffp2.svg';
import Desinfektionsmittel from './images/desinfektionsmittel.svg';
import Handschuhe from './images/handschuh.svg';
import FlatPickr from 'react-flatpickr';
import BarChart from './components/BarChart';
import { Card } from "react-bootstrap";
import Moment from 'react-moment';
import moment from 'moment-timezone';


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
  //https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Haeufig-gestellte-Fragen/FAQ-Testarten-Testnachweise.html#:~:text=Bei%20Testabnahme%20mittels%20molekularbiologischen%20Test,eine%20G%C3%BCltigkeit%20von%2048%20Stunden.
  // PCR results are 72hours valid
  // antigen results are 48 hours valid 
  //
  //definition of colors
  //green:  nagativ test result and more then 24hours valid
  //yellow: nagativ test result and less then 24hours valid
  //red:    positiv test result and less more then 14 days ago

  //load data from local storage
  componentDidMount() {
    const { testItems, contactItems, items } = this.state;


    if (testItems.length === 0) {
      const newTestItems = localStorage.getItem('testItems') !== null ? JSON.parse(localStorage.getItem('testItems')) : [];

      newTestItems.map((testItem, index) => {

        let color = "orange";
        const parsedTestDate = Date.parse(testItem.date);
        const parsedTestDateNow = Date.parse(new Date());
        const testType = testItem.testType;
        const result = testItem.testResult;
        //green
        if (result === "true" && (parsedTestDate + 14 * 1000 * 60 * 60 * 24) > (parsedTestDateNow)) {
          color = "red";
        } else if (result === "false" && testType === "antigen" && (parsedTestDate + 2 * 1000 * 60 * 60 * 24) < parsedTestDateNow) {
          color = "red";
        } else if (result === "false" && testType === "pcr" && (parsedTestDate + 3 * 1000 * 60 * 60 * 24) < parsedTestDateNow) {
          color = "red";
        } else if (result === "false" && testType === "antigen" && (parsedTestDate + 1 * 1000 * 60 * 60 * 24) > parsedTestDateNow) {
          color = "green";
        } else if (result === "false" && testType === "pcr" && (parsedTestDate + 2 * 1000 * 60 * 60 * 24) > parsedTestDateNow) {
          color = "green";
        } else {
          color = "yellow";
        }
        testItem.color = color;
      });

      this.setState({ testItems: newTestItems });
    }
    if (items.length === 0) {
      const newItems = localStorage.getItem('items') !== null ? JSON.parse(localStorage.getItem('items')) : [];
      this.setState({ items: newItems });

    }
    if (contactItems.length === 0) {
      const newContactItems = localStorage.getItem('contactItems') !== null ? JSON.parse(localStorage.getItem('contactItems')) : [];
      this.setState({ contactItems: newContactItems });
    }
  }

  //add used article to the array 
  handleAddArticle() {
    const { article, cntArticle, date, items } = this.state;
    const item = {
      cntArticle: cntArticle,
      article: article,
      date: date
    };

    const newItems = [...items, item];
    localStorage.setItem('items', JSON.stringify(newItems));
    this.setState({ items: newItems, cntArticle: 1, article: "ffp1", date: new Date() });
  }
  //add contact to the array 
  handleAddContact() {
    const { firstName, sirName, date, contactItems } = this.state;
    const contactItem = {
      firstName: firstName,
      sirName: sirName,
      date: date
    };

    const newItems = [...contactItems, contactItem];
    localStorage.setItem('contactItems', JSON.stringify(newItems));
    this.setState({ contactItems: newItems, firstName: "", sirName: "", date: new Date() });
  }
  //add test result to the array 
  handleAddTest() {
    const { testType, testResult, date, testItems } = this.state;
    const testItem = {
      testType: testType,
      testResult: testResult,
      date: date,
      color: "",
      dateRed:"",
      dateGreen:"",
      dateYellow:"",
    };
    let color = "orange";
    const parsedTestDate =   moment(date, "hh:mm DD-MM-YYYY");;
   let redTestDate  =parsedTestDate ;
   let yellowTestDate =parsedTestDate;
   let greenTestDate =parsedTestDate;
   
    //green
    if (testResult === "true" ) {
      redTestDate = moment(parsedTestDate).add(14, 'days');
      color = "red";
    }  else if (testResult === "false" && testType === "antigen") {
      greenTestDate = moment(parsedTestDate).add(1, 'days');
      yellowTestDate =moment(parsedTestDate);
      color = "green";
    } else if (testResult === "false" && testType === "pcr") {
      greenTestDate = moment(parsedTestDate).add(2, 'days');
      yellowTestDate =moment(parsedTestDate);
      color = "green";
    } 
    testItem.color = color;

    const newItems = [...testItems, testItem];
    localStorage.setItem('testItems', JSON.stringify(newItems));
    this.setState({ testItems: newItems, testType: "", testResult: "", redTestDate: redTestDate,greenTestDate:greenTestDate, yellowTestDate:yellowTestDate});
  }

  //delete contact from array 
  deleteContact(event) {
    const { contactItems } = this.state;
    const target = event.target;
    const value = target.value;

    const newContactItems = contactItems;
    if (value > -1) {
      newContactItems.splice(value, 1);
    }

    localStorage.setItem('contactItems', JSON.stringify(newContactItems));
    this.setState({ contactItems: newContactItems, firstName: "", sirName: "" });
  }

  //delete test from array 
  deleteTest(event) {
    const { testItems } = this.state;
    const target = event.target;
    const value = target.value;

    const newTestItems = testItems;
    if (value > -1) {
      newTestItems.splice(value, 1);
    }

    localStorage.setItem('testItems', JSON.stringify(newTestItems));
    this.setState({ testItems: newTestItems, testType: "", testResult: "" });

  }

  //this method is used for setting values to the actuel stat 
  //important: the name attribute must be the value name in the state
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


  //this method is used for preparing the data to print the chart
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
        //not nice but works
        if (element.article === "ffp1") {
          cntFfp1 += parseInt(element.cntArticle);
        } else if (element.article === "ffp2") {
          cntFfp2 = parseInt(element.cntArticle);
        } else if (element.article === "desinfektionsmittel") {
          cntDesi = parseInt(element.cntArticle);
        } else if (element.article === "handschuh") {
          cntHandschuh = parseInt(element.cntArticle);
        } else {
          console.log("some strange article found place into our state");
          //there is something wrong
        }
      }
    });
    this.setState({ cntDesinfektionsmittelChart: cntDesi, cntHandschuhChart: cntHandschuh, cntFfp1Chart: cntFfp1, cntFfp2Chart: cntFfp2 });
  }



  render() {
    const { date, items, cntArticle, article, daysBackForChart, firstName, sirName, contactItems, testType, testResult, testItems } = this.state;

    return (
      <div className="container">
        <Header />
        <Link to="/">Hauptseite</Link>
        <Link to="/test">Test</Link>
        <Link to="/contact">Kontakt</Link>
        <Link to="/article">Material verbraucht</Link>
        <Link to="/info">Infoseite</Link>
        <Link to="/settings">Export/Import</Link>
        <Switch>
          <Route exact path="/">
            Hauptseite
              <Headline titel="Hauptseite" beschreibung="Einstiegsseite" />
          </Route>
          <Route exact path="/test">
            <header>
              <Headline titel="Test" beschreibung="Test" />
            </header>
            <main>
              <div className="row">
                <div class="col-md-6">
                  <form>
                    <div class="form-group">
                      <div class="form-row">
                        <div class="col">
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" value="antigen" name="testType" id="antigen" onChange={this.handleInput} checked={"antigen" === testType} />
                            <label class="form-check-label" for="antigen">Antigen</label>
                          </div>
                        </div>
                        <div class="col">
                          <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" value="pcr" name="testType" id="pcr" onChange={this.handleInput} checked={"pcr" === testType} />
                            <label class="form-check-label" for="pcr">PCR</label>
                          </div>
                        </div>
                      </div>
                        <div class="form-row">
                          <label for="txtDatum">Datum der Testung</label>
                        </div>
                        <div class="form-row">
                        <FlatPickr value={date} id="txtDatum" options={{
                          enableTime: true,
                          dateFormat: "H:i d.m.Y",
                          time_24hr: true,
                        }} onChange={date => this.setState({ date: moment(date[0], "hh:mm DD.MM.YYYY") })} />
                      </div>
                      <div class="form-row">
                        <div class="col">
                          <div class="form-check form-check-inline">
                            <input type="radio" value="true" name="testResult" id="positiv" onChange={this.handleInput} checked={"true" === testResult} />
                            <label for="positiv">Positiv</label>
                          </div>
                        </div>
                        <div class="col">
                          <div class="form-check form-check-inline">
                            <input type="radio" value="false" name="testResult" id="negativ" onChange={this.handleInput} checked={"false" === testResult} />
                            <label for="negativ">Negativ</label>
                          </div>
                        </div>
                      </div>
                      <div class="form-row">
                        <button onClick={e => { this.handleAddTest(e) }} className="btn btn-primary">Speichern</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="col-md-6">
                  <div className="row">
                    {testItems.map((testItem, index) =>
                      <Card id={"list-item-contact" + (index + 1)} className={"customCard" + testItem.color}>
                        <Card.Header>{testItem.testResult ==="false" ?"Negativer":"Positiver"}{"  "}{testItem.testType.toUpperCase()}{" Test"}</Card.Header>
                        <Card.Body>{"Gültis bis:"}<Moment locale="de" format="hh:mm DD.MM.YYYY">{testItem.date}</Moment></Card.Body>
                        <button value={index} onClick={e => { this.deleteTest(e) }} className="btn btn-light">Löschen</button>
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
              <form>
                <div class="form-row">
                  <div class="col">
                    <div class="form-row">
                      <div class="col">
                        <label for="firstName">Vorname</label>
                        <input id="firstName"
                          type="text"
                          name="firstName"
                          value={firstName}
                          onChange={this.handleInput}
                        />
                      </div>
                      <div class="col">
                        <label for="sirName">Nachname</label>
                        <input id="sirName"
                          type="text"
                          name="sirName"
                          value={sirName}
                          onChange={this.handleInput}
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <label for="txtDatum">Datum der der Begegnung</label>
                    </div>
                    <div class="form-row">
                      <FlatPickr id="txtDatum" value={date}
                        onChange={date => this.setState({ date: date[0] })} />
                    </div>
                    <div class="form-row">
                      <button onClick={e => { this.handleAddContact(e) }} className="btn btn-primary">Speichern</button>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-row">
                      {contactItems && contactItems.map((contactItem, index) =>
                        <Card id={"list-item-contact" + (index + 1)}>
                          <Card.Header>{contactItem.sirName}{"  "}{contactItem.firstName}</Card.Header>
                          <Card.Body><Moment locale="de" format="hh:mm DD.MM.YYYY">{contactItem.date}</Moment></Card.Body>
                          <button value={index}
                            onClick={e => { this.deleteContact(e) }} className="btn btn-light">Löschen</button>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </form>
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
                  <form>
                  <div class="form-row">
                    <div class="col">
                      <div className="row">
                        <label for="txtDatum">Datum der Verwendung</label>
                      </div>
                      <div className="row" id="txtDatum">
                        <FlatPickr value={date}
                          onChange={date => this.setState({ date: moment(date[0], "hh:mm DD.MM.YYYY") })} />
                      </div>
                    </div>
                    <div class="col">
                    <div className="row">
                        <label for="cntArticle">Anzahl/Stk</label>
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
                  </form>
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
