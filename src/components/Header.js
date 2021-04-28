import { Component } from "react";
import Logo from '../images/BKA_Logo_srgb.svg';
/**
 * Darstellung einer Überschrift 
 * für die Applikation
 */
class Header extends Component {

    render() {
        return (
            <div>
                <img src={Logo} alt="Logo" href="#" />
                <h1>Persönliches Covid Tagebuch</h1>
            </div>);
    }
}

export default Header;