document.addEventListener("DOMContentLoaded", function(){
  var submit = document.getElementById('make-maze');
  submit.addEventListener("click", handleEvent);
  var canvas = document.getElementById("maze");
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.height, canvas.width);
});

function handleEvent(event){
  event.preventDefault();

  var widthBox = document.getElementById('width');
  var heightBox = document.getElementById('height');
  var width = parseInt(widthBox.value);
  var height = parseInt(heightBox.value);
  if(width < 10 || height < 10 || width >40 || height >40 || !height || !width){
    alert("Please keep height and width between 10 and 40.");
    widthBox.value = "";
    heightBox.value = "";
  } else{
    genMaze(width, height);
    widthBox.value = "";
    heightBox.value = "";
  }
}
