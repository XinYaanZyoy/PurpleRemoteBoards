var boardWidth = 0;
var boardHeight = 0;

var pendown = false;

// var pen;
// 	// https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjXks3SkejgAhVDFogKHRXxCk0QjRx6BAgBEAU&url=https%3A%2F%2Fdlpng.com%2Ftag%2FPen%3FpageNo%3D4%26searcontent%3DPen&psig=AOvVaw3AotwECoraPySPEab3e0f1&ust=1551776873140347
// 	pen = loadImage('assets/PICZ/hand_with_pen.png')

function setup() {
	platform_cover = select('#platform_cover');
	boardWidth = platform_cover.width;
	boardHeight = platform_cover.height;
	board = createCanvas(boardWidth, boardHeight);
	board.style('z-index',3);
	board.style('margin',"05vh 2vw");

	retrivePoints();
}

function draw() {
	background(255,0);
	if (pendown) write();
}

function mousePressed() {
	if(isOnBoard()) pendown = true;
}

function isOnBoard(){
	var x0 = 0.02*windowWidth;
	var y0 = 0.05*windowHeight;
	if(mouseX <= boardWidth+x0 && mouseY <= boardHeight+y0 && mouseX >= x0 && mouseY >= y0) return true;
	else return false;
}

function mouseReleased() {
	pendown = false;
}

function sketchIt(doc) {
	stroke(255);
	beginShape();
	vertex(doc.px, doc.py);
	vertex(doc.x, doc.y);
	endShape();
}

function write() {
		var data = {
			x: mouseX,
			y: mouseY,
			px: pmouseX,
			py: pmouseY
		};
		savePoints(data);
}

function savePoints(data) {
	firebase.firestore().collection(pub_boardPath)
	.add(data)
	.then(function(docRef){
		console.log("Document " + docRef.id + " wrote!!");
	})
	.catch(function (error) {
		console.error('Error writing new Document', error);
		alert('Error writing new Document \n', error);
	});
}

function retrivePoints() {
	retrivedData = [];

	firebase.firestore().collection(pub_boardPath)
		.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function(change) {
			if (change.type === "added") {
				sketchIt(change.doc.data());
            }
		});
    });
}