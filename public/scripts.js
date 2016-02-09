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

var populateForm = function (movies) {
  movies.forEach(function(movie) {
    var month = (movie.releaseDate.getMonth()+1).toString();
    var day = movie.releaseDate.getDate().toString();
    var year = movie.releaseDate.getFullYear().toString();
    $(".movies").append($("<div />", {"class":"movie"})
                .append($("<h2>" + movie.name + "</h2>"))
                .append($("<h5>" + movie.screenType + "</h5>"))
                .append($("<h5>" + month + "-" + day + "-" + year + "</h5>")));
    $("#movie-name").append("<option value='" + movie.name + "'>" + movie.name + "</option>");
  });
};

var populatePrice = function (ticket) {
  $(".ticket").empty();
  $(".ticket").append("<h2>" + ticket.movie.name + "</h2>");
  $(".ticket").append("<h3>Showtime: " + ticket.screeningTime + "</h3>");
  $(".ticket").append("<h3>Price: $" + ticket.price() + ".00</h3>");
  $(".ticket").append("<button class='btn btn-success'>Confirm Purchase</button>");
}

$(function() {
  var movies = [];
  $.getJSON("movies.json", function( data ) {
    for(var i = 0; i < data.length; i++) {
      var date = new Date(data[i].releaseDate);
      var movie = new Movie(data[i].name, data[i].screenType, date);
      console.log(movie.name);
      movies.push(movie);
    }
    populateForm(movies);
  }).fail(function (jqxhr, status, error) {
    console.log('error', status, error) }
  );

  $("form.ticket-form").submit(function(event) {
    event.preventDefault();

    var inputMovieName = $("select#movie-name").val();
    var inputShowTime = $("select#movie-time").val();
    var inputAge = $("input#age").val();
    var userMovie;
    for (i = 0; i < movies.length; i++) {
      if (movies[i].name === inputMovieName) {
        userMovie = movies[i];
      }
    }

    var now = new Date(Date.now());
    console.log(now);
    var userShowtimeHour = new Date (now.setHours(inputShowTime, 0 , 0, 0));
    var userTicket = new Ticket(userMovie, userShowtimeHour, inputAge);
    populatePrice(userTicket);
  });
});
