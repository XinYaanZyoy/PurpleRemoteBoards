// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


// public
// *****************************************
var pub_firstTime = true;
var pub_root = 'PubBoards/';
var pub_selectedBoard = 'welcome/';
var pub_boardPath = pub_root + pub_selectedBoard + 'points/';

//create new pub board
function createNewPubBoard() {
  //ask for board namme
  pub_new_BoardName = prompt("Enter name of Public Board: ", "type here!!");
  //store it and catch it with verbose
  firebase.firestore().collection(pub_root).doc(pub_new_BoardName).set({}).then(function () {
    console.log("created new pub board!");
    alert('Congratulations!! \n' + pub_new_BoardName + ": added to the list of Public Boards!");
  }).catch(function () {
    console.error("error creating new pub board!", error);
    alert('something went wrong while creating new Public Board '+pub_new_BoardName);
  });

  //clear client list of pub boards
  var pub_boards_list = document.getElementById('pubboards_list');
  while (pub_boards_list.hasChildNodes()) {
    pub_boards_list.removeChild(pub_boards_list.firstChild);
  }
  //visited first time after updating list
  if (!pub_firstTime) pub_firstTime = true;
}

//update client list of pub boards 
function listPubBoards() {
  //client pub boards list must be clear
  //only if visiting first time go ahead
  if (!document.getElementById('pubboards_list').hasChildNodes() || pub_firstTime) {
    //get all the pub boards from the pub root of fb db
    firebase.firestore().collection(pub_root).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log('reading '+doc.id, " => ", doc.data());

        //menu template in js
       //select button
        var tmp_raw = document.createElement("tr");    
        var tmp_coloumn1 = document.createElement("td");
        var tmp_data1 = document.createElement("button");
        tmp_data1.setAttribute("class", "dropbtn");
        tmp_data1.innerHTML = doc.id;
        tmp_data1.onclick = function () {
          selectPubBoardPath(doc.id);
        };
        tmp_coloumn1.appendChild(tmp_data1);
       
        //delete button
        var tmp_coloumn2 = document.createElement("td");
        var tmp_data2 = document.createElement("button");
        tmp_data2.setAttribute("class", "dropbtn");
        tmp_data2.innerHTML = "&#10060;";
        tmp_data2.onclick = function () {
          deletePubBoard(doc.id);
        };
        tmp_coloumn2.appendChild(tmp_data2);
      
        tmp_raw.appendChild(tmp_coloumn1);
        tmp_raw.appendChild(tmp_coloumn2);
      
        document.getElementById('pubboards_list').appendChild(tmp_raw);
      });
    });
    //hasn't visited after updating client pub board list
    if (pub_firstTime) pub_firstTime = false;
  }
  document.getElementById('pubboard').classList.toggle("show");
}

//setting path based on selected board
function selectPubBoardPath(name) {
  pub_selectedBoard = name+'/';
  pub_board_status = document.getElementById('pubboard_status');
  pub_board_status.innerText = pub_selectedBoard;
  pub_boardPath = pub_root + pub_selectedBoard + 'points/';
  alert('selected public board: ' + pub_selectedBoard);
}

//deleting board which was selected to
function deletePubBoard(name) {
  console.log('deleting ' + name + ' from Public Boards');
  alert('deleting ' + name + ' from Public Boards');
  
  firebase.firestore().collection(pub_root).doc(name.toString()).delete().then(function (doc) {
    console.log("deleted");
  }).catch(function (error) {
    console.error("Error while deleting document: ", error);
  });

  //clearing client pub board list
 var public_boards_list = document.getElementById('pubboards_list');
  while (public_boards_list.hasChildNodes()) {
    public_boards_list.removeChild(public_boards_list.firstChild);
  }
  //hasn't visited after updating client pub board list
  if (!pub_firstTime) pub_firstTime = true;  
}

// ***********************************************