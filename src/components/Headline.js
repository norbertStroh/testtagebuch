import { Component } from "react";

/**
 * Darstellung einer Überschrift 
 * für die Applikation
 */
class Headline extends Component {

    render() {
        const { titel, beschreibung } = this.props;
        return <div>
            <h1>{titel}</h1>
            <p>{beschreibung}</p>
        </div>;
    }
}

export default Headline;