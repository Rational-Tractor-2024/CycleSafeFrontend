import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';


function Route (){
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');

    console.log(source);
    console.log(target);


    return (
        <Card style={{ width: '18rem', position: 'absolute', top: 72, left: 16 }}>
          
          <Card.Body>
            <Card.Title>Create a Route</Card.Title>
            
            <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">A</InputGroup.Text>
            <Form.Control
                placeholder="From..."
                value={source}
                onChange={(e)=>{setSource(e.target.value)}}
                
                /* aria-label="Username"
                aria-describedby="basic-addon1" */
            />
            </InputGroup>

            <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">B</InputGroup.Text>
            <Form.Control
                placeholder="To..."
                value={target}
                onChange={(e)=>{setTarget(e.target.value)}}
                /* aria-label="Username"
                aria-describedby="basic-addon1" */
            />
            </InputGroup>

            
            <Button variant="primary">Go </Button>
          </Card.Body>
        </Card>
      );

}

export default Route