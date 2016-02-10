var beginFormChangeListener = function (movies) {
  $("#movie-name").change(function() {
    $("#movie-time").empty();
    var movieValue = $(this).val();
    var thisMovie;
    for (var i = 0; i < movies.length; i++) {
      if (movieValue === movies[i].name) {
        thisMovie = movies[i];
      }
    }

    for (var time in thisMovie.showtimes) {
      $("#movie-time").append("<option value='" + thisMovie.showtimes[time] + "'>" + thisMovie.showtimes[time] + "</option>");
    }
  })
}

var populateForm = function (movies) {
  movies.forEach(function(movie) {
    var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    var dateString = movie.releaseDate.toLocaleDateString("en-US", options);
    var screenType = (movie.screenType === "imax")?"AN IMAX 3D EXPERIENCE":"";
    var showtimesString = ""
    for(var i = 0; i < movie.showtimes.length; i++) {
      var splitShowtime = movie.showtimes[i].split(" ");
      showtimesString += ("<li>" + splitShowtime[0] + ":" + splitShowtime[1] + "</li>");
    }
    $(".movies").append($("<div />", {"class":"movie"})
                .append($("<h2>" + movie.name + "</h2>"))
                .append($("<h5 class='special-screen'>" + screenType + "</h5>"))
                .append($("<h5><strong>Released:</strong> " + dateString + "</h5>"))
                .append($("<ul class='list-inline'>" + showtimesString + "</ul>")));
    $("#movie-name").append("<option value='" + movie.name + "'>" + movie.name + "</option>");
  });

  for(var index in movies[0].showtimes) {
    $("#movie-time").append("<option value='" + movies[0].showtimes[index] + "'>" + movies[0].showtimes[index] + "</option>");
  }
};

var beginFormSubmitListener = function(movies) {
  $("form.ticket-form").submit(function(event) {
    event.preventDefault();

    var inputMovieName = $("select#movie-name").val();
    var inputShowTime = $("select#movie-time").val().split(" ");
    var inputShowTimeHour = inputShowTime[0];
    var inputShowTimeMinutes = inputShowTime[1];
    var inputAge = $("input#age").val();
    var userMovie;
    for (i = 0; i < movies.length; i++) {
      if (movies[i].name === inputMovieName) {
        userMovie = movies[i];
      }
    }

    var now = new Date(Date.now());
    var userShowtimeHour = new Date (now.setHours(inputShowTimeHour, inputShowTimeMinutes, 0, 0));
    var userTicket = new Ticket(userMovie, userShowtimeHour, inputAge);
    populatePrice(userTicket);
  });
}

var populatePrice = function (ticket) {
  var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
  $(".ticket").empty();
  $(".ticket").show();
  $(".ticket").append("<h2>" + ticket.movie.name + "</h2>");
  $(".ticket").append("<h5>" + ticket.screeningTime.toLocaleDateString("en-US", options) + "</h5>");
  $(".ticket").append("<h3>Price: $" + ticket.price() + ".00</h3>");
  $(".ticket").append("<button id='confirm' class='btn btn-success lightbox'>Confirm Purchase</button>");
  $('.lightbox').on("click", function() {
    $('.backdrop, .box').animate({'opacity':'.50'}, 300, 'linear');
    $('.box').animate({'opacity':'1.00'}, 300, 'linear');
    $('.backdrop, .box').css('display', 'block');
    $(".box").append("<div class='alert alert-success' role='alert'><p>Your purchase has been confirmed!</p></div>")
    $(".box").append("<div><h2>" + ticket.movie.name + "</h2></div>");
    $(".box").append("<div><h5>" + ticket.screeningTime + "</h5></div>");
    $(".box").append("<div><h3>Price: $" + ticket.price() + ".00</h3></div>");
    $(".box").append("<div><img id='barcode'></img></div>");
    $("#barcode").JsBarcode((Math.floor(100000000000 + Math.random() * 900000000000)).toString());
  });

  $('.close').on("click", function() {
    close_box();
  });

  $('.backdrop').on("click", function() {
    close_box();
  });
}

function close_box() {
	$('.backdrop, .box').animate({'opacity':'0'}, 300, 'linear', function(){
		$('.backdrop, .box').css('display', 'none');
    $(".box div").slice(1).remove();
	});
}

$(function() {
  var movies = [];
  $.getJSON("movies.json", function( data ) {
    for(var i = 0; i < data.length; i++) {
      var date = new Date(data[i].releaseDate);
      var showtimes = [];
      for(var j = 0; j < data[i].showtimes.showtime.length; j++) {
        showtimes.push(data[i].showtimes.showtime[j].time);
      }
      var movie = new Movie(data[i].name, data[i].screenType, showtimes, date);
      movies.push(movie);
    }
    populateForm(movies);
    beginFormChangeListener(movies);

  }).fail(function (jqxhr, status, error) {
    console.log('error', status, error) }
  );

  beginFormSubmitListener(movies);
});
