import { Component } from "react";
import { Card } from "react-bootstrap";

class TestEintrag extends Component {
    render() {
        const { value } = this.props;
        debugger;
        //return <div>{value}</div>;
        return <Card>
            <Card.Header>{value.article}</Card.Header>
            <Card.Body>{value.date.toDateString()}</Card.Body>
        </Card>;
    }
}

export default TestEintrag;