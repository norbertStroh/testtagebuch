import { Component } from "react";
import { Card } from "react-bootstrap";

class Contact extends Component {
    render() {
        const { value,id } = this.props;
        debugger;
        return <Card id={id}>
            <Card.Header>{value.sirName}{"  "}{value.firstName}</Card.Header>
            <Card.Body>{value.date.toDateString()}</Card.Body>
            
        </Card>;
    }

}

export default Contact;