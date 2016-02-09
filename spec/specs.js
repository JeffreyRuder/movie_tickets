describe('Movie', function() {
  it('initializes with name, release-date, screen-type, showtimes', function() {
    var currentDate = Date.now();
    var testMovie = new Movie("Braveheart", "regular", ["20 00"], currentDate);
    expect(testMovie.name).to.equal("Braveheart");
    expect(testMovie.releaseDate).to.equal(currentDate);
    expect(testMovie.screenType).to.equal("regular");
    expect(testMovie.showtimes[0]).to.equal("20 00");
  })

  it('initializes with current date if one is not given', function() {
    var testMovie = new Movie("Braveheart", "regular");
    expect(testMovie.releaseDate).to.be.a('number');
  });
});

describe('Ticket', function() {
  it('initializes with movie, screening-time, age', function() {
    var testMovie = new Movie("Braveheart", "regular");
    var testDate = new Date("2016-02-12T23:00:00")
    var testTicket = new Ticket(testMovie, testDate, 30);
    expect(testTicket.movie.name).to.equal("Braveheart");
    expect(testTicket.movie.releaseDate).to.be.a('number');
    expect(testTicket.movie.screenType).to.equal("regular");
    expect(testTicket.screeningTime.toTimeString()).to.equal("15:00:00 GMT-0800 (PST)");
    expect(testTicket.age).to.equal(30);
  })

  it('can get ticket price', function() {
    var testMovieOld = new Movie("Braveheart", "regular", ["19 00"], new Date("2015-12-25T12:00:00"));
    var testMovieNew = new Movie("The Revenant", "regular", ["19 00"]);
    var testMovieImax = new Movie("Star Wars", "imax", ["19 00"]);
    var testDateBeforeFour = new Date("2016-02-12T23:00:00");
    var testDateAfterFour = new Date("2016-02-13T03:00:00");
    var testTicketAge = new Ticket(testMovieNew, testDateAfterFour, 70);
    var testTicketReleaseDate = new Ticket(testMovieOld, testDateAfterFour, 30);
    var testTicketScreeningTime = new Ticket(testMovieNew, testDateBeforeFour, 30);
    var testTicketImax = new Ticket(testMovieImax, testDateAfterFour, 30);
    var testTicketAll = new Ticket(testMovieImax, testDateBeforeFour, 70);
    expect(testTicketAge.price()).to.equal(9);
    expect(testTicketReleaseDate.price()).to.equal(9);
    expect(testTicketScreeningTime.price()).to.equal(9);
    expect(testTicketImax.price()).to.equal(20);
    expect(testTicketAll.price()).to.equal(18);
  });
});
