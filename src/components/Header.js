import { Component } from "react";
import { Navbar } from "react-bootstrap";
import Logo from '../images/BKA_Logo_srgb.svg';
/**
 * Darstellung einer Überschrift 
 * für die Applikation
 */
class Header extends Component {

    render() {
        return (
            <Navbar bg="light">
                <Navbar.Brand href="./">
                    <img
                        src={Logo}
                        className="d-inline-block align-bottom"
                        alt="React Bootstrap logo"
                    />
            Persönliches Covid Tagebuch
            </Navbar.Brand>
            </Navbar>
        );
    }
}

export default Header;