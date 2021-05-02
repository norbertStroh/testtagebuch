import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Component } from 'react';
import { Link, NavLink, Route, Switch, withRouter } from 'react-router-dom';
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
  //load data from local storage
  componentDidMount() {
    const { testItems, contactItems, items } = this.state;
    if (testItems.length === 0) {
      const newTestItems = localStorage.getItem('testItems') !== null ? JSON.parse(localStorage.getItem('testItems')) : [];
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
    this.setState({ items: newItems, cntArticle: 1, article: "ffp1" });
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
    this.setState({ contactItems: newItems, firstName: "", sirName: "" });
  }
  //add test result to the array 
  //https://www.sozialministerium.at/Informationen-zum-Coronavirus/Coronavirus---Haeufig-gestellte-Fragen/FAQ-Testarten-Testnachweise.html#:~:text=Bei%20Testabnahme%20mittels%20molekularbiologischen%20Test,eine%20G%C3%BCltigkeit%20von%2048%20Stunden.
  // PCR results are 72hours valid
  // antigen results are 48 hours valid 
  //
  //definition of colors
  //green:  nagativ test result and more then 24hours valid
  //yellow: nagativ test result and less then 24hours valid
  //red:    positiv test result and less more then 14 days ago

  handleAddTest() {
    const { testType, testResult, date, testItems } = this.state;
    const testItem = {
      testType: testType,
      testResult: testResult,
      date: date,
      dateRed: null,
      dateGreen: null,
      dateYellow: null,
    };
    const parsedTestDate = moment(date, "hh:mm DD-MM-YYYY");;
    //green
    if (testResult === "true") {
      testItem.dateRed = moment(parsedTestDate).add(14, 'days');
    } else if (testResult === "false" && testType === "antigen") {
      testItem.dateGreen = moment(parsedTestDate).add(1, 'days');
      testItem.dateYellow = moment(parsedTestDate).add(2, 'days');
    } else if (testResult === "false" && testType === "pcr") {
      testItem.dateGreen = moment(parsedTestDate).add(2, 'days');
      testItem.dateYellow = moment(parsedTestDate).add(3, 'days');
    }

    const newItems = [...testItems, testItem];
    localStorage.setItem('testItems', JSON.stringify(newItems));
    this.setState({ testItems: newItems, testType: "", testResult: "" });
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

      const itemsimp = daten.data.items;
      const contactItemsimp = daten.data.contactItems;
      const testItemsimp = daten.data.testItems;

      localStorage.setItem('items', JSON.stringify(itemsimp));
      localStorage.setItem('contactItems', JSON.stringify(contactItemsimp));
      localStorage.setItem('testItems', JSON.stringify(testItemsimp));
      this.setState({ items: itemsimp });
      this.setState({ contactItems: contactItemsimp });
      this.setState({ testItems: testItemsimp });
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
    const actdate = moment(date, "hh:mm DD.MM.YYYY");
    return (
      <div className="container">
        <Header />
        <div className="navbar">
          <NavLink to="/" activeStyle={{ fontWeight: "bold", color: '#ED2939' }}>Home</NavLink>
          <NavLink to="/test" activeStyle={{ fontWeight: "bold", color: '#ED2939' }} >Test</NavLink>
          <NavLink to="/contact" activeStyle={{ fontWeight: "bold", color: '#ED2939' }} >Kontakt</NavLink>
          <NavLink to="/article" activeStyle={{ fontWeight: "bold", color: '#ED2939' }} >Material verbraucht</NavLink>
          <NavLink to="/info" activeStyle={{ fontWeight: "bold", color: '#ED2939' }} >Infoseite</NavLink>
          <NavLink to="/settings" activeStyle={{ fontWeight: "bold", color: '#ED2939' }} >Export/Import</NavLink>
        </div>
        <Switch>
          <Route exact path="/">
            <Headline titel="Hauptseite" beschreibung="Wählen sie die gewünschte Option aus" />
            <div className="home">
              <NavLink to="/test">
                <Card>
                  <Card.Header>Testungen</Card.Header>
                </Card>
              </NavLink>
              <NavLink to="/contact">
                <Card>
                  <Card.Header>Kontakt Tracking</Card.Header>
                </Card>
              </NavLink>
              <NavLink to="/article">
                <Card>
                  <Card.Header>Verbrauchs Material-traking</Card.Header>
                </Card>
              </NavLink>
              <NavLink to="/info">
                <Card>
                  <Card.Header>Allgemeine Covid Informationen</Card.Header>
                </Card>
              </NavLink>
              <NavLink to="/settings">
                <Card>
                  <Card.Header>Import/Export</Card.Header>
                </Card>
              </NavLink>
            </div>
          </Route>
          <Route exact path="/test">
            <header>
              <Headline titel="Test Tracking" beschreibung="Bitte Wählen sie das Datum aus und geben Sie den typ des Covid-test sowie das Resultat bekannt." />
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
                          time_24hr: true,
                        }} onChange={date => this.setState({ date: date[0] })} />
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
                      <Card id={"list-item-contact" + (index + 1)} className={"customCard" + (testItem.dateRed !== null ? (moment(actdate).isBefore(testItem.dateRed) ? "red" : "red1") : testItem.dateGreen !== null ? (moment(actdate).isBefore(testItem.dateGreen) ? "green" : testItem.dateYellow !== null ? (moment(actdate).isBefore(testItem.dateYellow) ? "yellow" : "yellow1") : "sadas") : "nothing set")}>
                        <Card.Header>{testItem.testResult === "false" ? "Negativer" : "Positiver"}{"  "}{testItem.testType.toUpperCase()}{" Test"}</Card.Header>
                        <Card.Body>{"Gültis bis: " + (testItem.dateRed !== null ? moment(testItem.dateRed).format("hh:mm DD.MM.YYYY") : moment(testItem.dateYellow).format("hh:mm DD.MM.YYYY"))}</Card.Body>
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
              <Headline titel="Kontakt Tracking" beschreibung="Bitte Wählen sie das Datum aus und geben die den Vollständingen Namen ein." />
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
                          <Card.Body>{"Datum: " + moment(contactItem.date).format("DD.MM.YYYY")}</Card.Body>
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
                            onChange={date => this.setState({ date: date[0] })} />
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
            <header>
              <Headline titel="Infoseite" beschreibung="Infoseite" />
            </header>
            <main>
              <div className="row">
                <div class="col-md-3">
                  <div className="row">
                    <img id="r" name="article" src={Ffp1} alt="ffp1" class="info" />
                  </div>
                </div>
                <div class="col-md-9">
                  <div className="row">
                    <p>
                      Entsprechend der DGUV Regel 112-190 dürfen FFP1-Masken bei Schadstoffkonzentrationen bis zum 4-fachen des Arbeitsplatzgrenzwertes (AGW) eingesetzt werden.
                      Sie schützen gegen ungiftige Partikel auf Wasser- und Ölbasis, nicht jedoch gegen krebserzeugende und radioaktive Stoffe, luftgetragene biologische Arbeitsstoffe der Risikogruppen 2 und 3 + Enzyme.
                      Die Gesamtleckage (Undichtigkeit) beträgt maximal 22%, mindestens 80% der Schadstoffe werden aus der Luft gefiltert.
                      Typische Anwendungen für eine FFP1-Maske finden sich beispielsweise in der Lebensmittelindustrie.
                  </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div class="col-md-3">
                  <div className="row">
                    <img id="r" name="Ffp2" src={Ffp2} alt="ffp2" class="info" />
                  </div>
                </div>
                <div class="col-md-9">
                  <div className="row">
                    <p>
                    Entsprechend der DGUV Regel 112-190 dürfen FFP2-Masken bei Schadstoffkonzentrationen bis zum 10-fachen des Arbeitsplatzgrenzwertes (AGW) eingesetzt werden. 
                    Sie schützen gegen gesundheitsschädliche Partikel auf Wasser- und Ölbasis, nicht jedoch gegen krebserzeugende Stoffe, radioaktive Partikel, luftgetragene biologische Arbeitsstoffe der Risikogruppe 3 und Enzyme.
                    Die Gesamtleckage (Undichtigkeit) beträgt maximal 8%, mindestens 94% der Schadstoffe werden aus der Luft gefiltert.
                    Typische Anwendungen für eine FFP2-Maske sind beispielsweise der Umgang mit Weichholz, Glasfasern, Metall, Kunststoffen (nicht PVC) und Ölnebel.
                    Das Robert Koch-Institut (RKI) empfiehlt zur Behandlung und Pflege von Patientinnen und Patienten mit einer Infektion durch das Coronavirus SARS-CoV-2 FFP2-Masken sowie FFP3-Masken.
                  </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div class="col-md-3">
                  <div className="row">
                    <img id="r" name="Handschuhe" src={Handschuhe} alt="Handschuhe" class="info" />
                  </div>
                </div>
                <div class="col-md-9">
                  <div className="row">
                    <p>
                    Handschuhe schützen allgemein vor Verschmutzungen, Verletzungen, aggressiven Stoffen (zum Beispiel Reinigungsmittel) und auch dem Verbreiten von Krankheitserregern. Verschiedene 
                    Materialien und Ausführungen von Handschuhen – beispielsweise Latex, Nitril, Vinyl, steril oder nicht steril – sollen diesen unterschiedlichen Ansprüchen gerecht werden. Die BGW, Berufsgenossenschaft
                     für Gesundheitsdienst und Wohlfahrtspflege, stellt in einer Bildergalerie verschiedene Handschuhtypen vor und geht auch auf Vor- und Nachteile ein. Latexhandschuhe (Naturkautschuk) zeichnen sich beispielsweise
                      durch eine relativ hohe mechanische Strapazierbarkeit und Chemikalienbeständigkeit aus, weisen aber ein allergisierendes Potenzial auf und 
                    sind empfindlich gegen Fette und Öle (Stichwort: Handpflegeprodukte). Latexfreie Nitrilhandschuhe gelten hingegen als gut verträglich, sie sind jedoch weniger dehnbar und sollten deswegen bei der Handschuhgröße eine halbe Nummer größer gewählt werden.
                  </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div class="col-md-3">
                  <div className="row">
                    <img id="r" name="desinfektionsmittel" src={Desinfektionsmittel} alt="desinfektionsmittel" class="info" />
                  </div>
                </div>
                <div class="col-md-9">
                  <div className="row">
                    <p>
                    Wir sind ständig umgeben von „Mikroben“ – Mikroorganismen wie Bakterien, Viren oder Pilze sind überall in der Umwelt. Der überwiegende Teil ist für uns jedoch harmlos oder sogar nützlich! Nur ein
                     kleiner Prozentsatz ist für uns Menschen schädlich: Man nennt diese Mikroben daher auch oft Krankheitserreger. Mit Desinfektionsmitteln 
                    kann man die Zahl der Mikroben in der Umgebung oder auf Händen und Haut eindämmen. Dazu muss man sich überlegen, wann dies überhaupt notwendig ist, welche Desinfektionsmittel man verwenden sollte und wie man sie richtig einsetzt.
                  </p>
                  </div>
                </div>
              </div>


            </main>
          </Route>
          <Route exact path="/settings">
            <Headline titel="Import/Expoer" beschreibung="Dies dient dazu die Date auf ein anderes Gerät zu Übertragen" />
            <form>
              <div class="form-row">
                <div class="col">
                  <div className="row">
                    <label for="export">Export</label>
                  </div>
                  <div className="row">
                    <a id="export" className="btn btn-secondary"
                      href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ appVersion: 1, data: this.state }))}`}
                      download="settings.json">Herunterladen</a>
                  </div>
                </div>
                <div class="col">
                  <div className="row">
                    <label for="import">Import</label>
                  </div>
                  <div className="row">
                    <input id="import" type="file" className="hidden"
                      multiple={false}
                      accept=".json,application/json"
                      onChange={evt => this.handleImportData(evt)}
                    />
                  </div>
                </div>
              </div>
            </form>
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
