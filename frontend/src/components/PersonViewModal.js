import React, { Component } from "react";
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, NavItem,
} from "reactstrap";
import axios from "axios";
import AddPersonViewModal from './AddModal';

export default class PersonViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      activeItem: this.props.activeItem,
      newItem: {},
      personDetail: [],
      relationship: ""
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    
    axios
      .get(`/api/persondetail/${this.state.activeItem.id}/`)
      .then((res) => this.setState({ personDetail: res.data }))
      .catch((err) => console.log(err));
  };

  // refreshList2 = () => {
  //   axios
  //     .get(`/api/persondetail/${this.state.newActiveItem.id}/`)
  //     .then((res) => this.setState({ personDetail: res.data }))
  //     .catch((err) => console.log(err));
  // };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  handleSubmit = (item, newItem) => {
    this.toggle();
   
    if (this.state.relationship == "parents") {
      
      axios.post(`/api/person/`, newItem, )
      .then((res) => { 

        console.log("PARENT RES DATA:");
        console.log(res.data);
        this.setState({ newItem: res.data });
      }).catch(err => { console.log(err) });
// need to fix
      axios.patch(`/api/person/${item.id}/`, { parents: [this.state.newItem.id] })
      .then((res) => {console.log(res.data); this.refreshList(); })
      .catch(err => { console.log(err) });;
        // console.log(res2);
      return;
    }

    if (newItem.id) { // need to fix edit button
      // axios
      //   .put(`/api/person/${item.id}/`, item, )
      //   .then((res) => this.refreshList());
      return;
    } else {
      axios
      .post(`/api/person/`, newItem, )
      .then((res) => {console.log(res.data); this.refreshList(); })
      .catch(err => { console.log(err) });
    }

  };

  
  handleAddParents = (item) => {
    this.toggle();
    let personAID = item.id;
    console.log(item.id);
    const newItem = {
     firstName: "",
     lastName: "",
     gender: "",
     bio: "",
     birthPlace: "",
     parents: [],
     children: [personAID],
     spouses: [],
     siblings: [],
   };

   this.setState({ relationship: "parents", activeItem: item, newItem: newItem, modal: !this.state.modal });

  };

 handleAddChildren = (item) => {
  this.toggle();
  let personAID = item.id;
  console.log(item.id);
  const newItem = {
   firstName: "",
   lastName: "",
   gender: "",
   bio: "",
   birthPlace: "",
   parents: [personAID],
   children: [],
   spouses: [],
   siblings: [],
 };
 this.setState({ activeItem: item, newItem: newItem, modal: !this.state.modal });

};
 
 handleAddSiblings= (item) => {
  this.toggle();
  let personAID = item.id;

  const newItem = {
   firstName: "",
   lastName: "",
   gender: "",
   bio: "",
   birthPlace: "",
   parents: [],
   children: [],
   spouses: [],
   siblings: [personAID],
 };

 this.setState({ activeItem: item, newItem: newItem, modal: !this.state.modal });
};

handleAddSpouses= (item) => {
  this.toggle();
  let personAID = item.id;
  console.log(item.id);
  const newItem = {
   firstName: "",
   lastName: "",
   gender: "",
   bio: "",
   birthPlace: "",
   parents: [],
   children: [],
   spouses: [personAID],
   siblings: [],
 };
 this.setState({ activeItem: item, newItem: newItem, modal: !this.state.modal });
};


  handleDelete = (item) => {
    
    axios
      .delete(`/api/person/${item.id}/`)
      .then((res) => this.refreshList());
  };

  // returns array of parent/spouse/child IDs
//    familyMemberReformat(inputObject) {
// 	let result = inputObject.map(({ id }) => id);
//     return result;
// }

// familyMemberReformatTest(inputObject) {
// 	// let result = inputObject.map(({ id }) => id);
//   return ( )
// }

  printRelatives = (personDetail) => {

    const nullMessage = ["No one here yet."];
    let parents = null;
    if (personDetail.parents && personDetail.parents.length > 0) {
      parents = personDetail.parents.map( (p) => { 
        return (<div><li> {p.firstName} {p.lastName}</li>      
        {/* <button className="btn btn-secondary mr-2" onClick={() => this.editItem(p)}>
        Edit 
      </button> */}
      <button className="btn btn-danger" onClick={() => this.handleDelete(p)}>
        Delete
      </button>
      </div>
      )})
    } else {
        parents = nullMessage.map( (nullMessage) => { 
            return (<div><p>{nullMessage}</p>         
        <button className="btn btn-secondary mr-2" onClick={() => this.handleAddParents(this.props.activeItem)}>
            Add 
        </button>
        </div>
        )})
     }
    let spouses = null;
    if (personDetail.spouses && personDetail.spouses.length > 0) {
      spouses = personDetail.spouses.map( (p) => { 
        return (<div><li> {p.firstName} {p.lastName}</li>
            {/* <button className="btn btn-secondary mr-2" onClick={() => this.editItem(this.props.activeItem)}>
            Edit 
          </button> */}
          <button className="btn btn-danger" onClick={() => this.handleDelete(this.props.activeItem)}>
            Delete
          </button>
          </div>
          )})
    } else {
        spouses = nullMessage.map((nullMessage) => { 
            return (<div><p>{nullMessage}</p>         
          <button className="btn btn-secondary mr-2" onClick={() => this.handleAddSpouses(this.props.activeItem)}>
            Add 
          </button>
        </div>
         )})
    }

    let children = null;
    if (personDetail.children && personDetail.children.length > 0) {
      children = personDetail.children.map( (p) => { 
        return (<div><li> {p.firstName} {p.lastName}</li>
            {/* <button className="btn btn-secondary mr-2" onClick={() => this.editItem(this.props.activeItem)}>
            Edit 
          </button> */}
          <button className="btn btn-danger" onClick={() => this.handleDelete(this.props.activeItem)}>
            Delete
          </button>
          </div>
        )
      })
    } else {
        children = nullMessage.map((nullMessage) => { 
        return (<div><p>{nullMessage}</p>         
            <button className="btn btn-secondary mr-2" onClick={() => this.handleAddChildren(this.props.activeItem)}>
                Add 
            </button>
            </div>
            )})
     }
    
    let siblings = null;
    if (personDetail.siblings && personDetail.siblings.length > 0) {
      siblings = personDetail.siblings.map( (p) => { 
        return (<div><li> {p.firstName} {p.lastName}</li>
            {/* <button className="btn btn-secondary mr-2" onClick={() => this.editItem(this.props.activeItem)}>
              Edit 
            </button> */}
            <button className="btn btn-danger" onClick={this.createItem}>
              Delete
            </button>
            <button className="btn btn-secondary mr-2" onClick={() => this.handleAddSiblings(this.props.activeItem)}>
                Add 
            </button>
            </div>
         )
      })
    } else {
        siblings = nullMessage.map( (nullMessage) => { 
        return (<div><p>{nullMessage}</p>         
            <button className="btn btn-secondary mr-2" onClick={() => this.handleAddSiblings(this.props.activeItem)}>
                Add 
            </button>
            </div>
            )})
     }
    return (
      <div>
      <Label for="parents">Parents:</Label>
        {parents}
       <hr/>

       <Label for="children">Children:</Label>
       {children}
       <hr/>
       <Label for="spouses">Spouses:</Label>
       {spouses}
       <hr/>
       <Label for="siblings">Siblings:</Label> 
       {siblings}
       </div>
    )
  }

  // takes array of parent/spouse/child IDs and iterates through tree
    // findPerson(inputObject, personArray) {
    //     let persons = [];
    //     const keys = Object.keys(inputObject);
    //     for (let i = 0; i < keys; i+=1) {
    //             if(personArray[0] || personArray[1] == inputObject[i].id) {
    //                 persons.push(inputObject[i].firstName);
    //             } 
    //         }
    //     return persons.map((person) => <li>{person}</li>)
    //     }

  render() {
    const { toggle } = this.props;

    return ( <div>
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>{this.props.activeItem.firstName} {this.props.activeItem.lastName}</ModalHeader>
        <ModalBody>
              <Label for="bio">Bio:</Label>
              {this.props.activeItem.bio} {' '}
              <span>
                <button className="btn btn-secondary mr-2" onClick={() => this.editItem(this.props.activeItem)}>
                Edit 
                </button>
                <button className="btn btn-danger" onClick={() => this.handleDelete(this.props.activeItem)}>
                Delete
                </button>
              </span>
              <hr/>
              {this.printRelatives(this.state.personDetail)}

            
            
        </ModalBody>
        <ModalFooter>
        {this.state.modal ? (
          <AddPersonViewModal
            activeItem={this.state.activeItem}
            newItem={this.state.newItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
          <Button color="success">

            Exit
          </Button>
        </ModalFooter>
      </Modal> </div>
    );
  }
}