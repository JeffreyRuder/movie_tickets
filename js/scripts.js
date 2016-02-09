function Movie(name, screenType, releaseDate) {
  this.name = name;
  this.screenType = screenType;
  this.releaseDate = releaseDate || Date.now();
};

function Ticket(movie, screeningTime, age) {
  this.movie = movie;
  this.screeningTime = screeningTime;
  this.age = age;
}

Ticket.prototype.price = function () {
  var releaseDateDiscount = 0;
  var ageDiscount = 0;
  var timeDiscount = 0;
  var screenDouble = 1;

  if (Date.now() - this.movie.releaseDate > new Date("1970-02-01T00:00:00")) {
    releaseDateDiscount = 1;
  }

  if (this.age >= 65) {
    ageDiscount = 1;
  }

  if (this.screeningTime.getHours() < 16 && this.screeningTime.getHours() > 3) {
    timeDiscount = 1;
  }

  if (this.movie.screenType !== "regular") {
    screenDouble = 2;
  }

  return 10 * screenDouble - ageDiscount - timeDiscount - releaseDateDiscount;
};

$(function() {

  $("body").append("<h2>" + "test" + "</h2>");
  console.log("hello");
  $.getJSON("movies.json", function( data ) {
    console.log(data);
    var movies = [];
    $.each( data, function(key, val) {
      movies.push( "<li id='" + key + "'>" + val + "</li>" );
    });

    $( "<ul/>", {
      "class": "movie-list",
      html: movies.join("")
    }).appendTo("body");
  });
});
