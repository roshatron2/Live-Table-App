var pusher = new Pusher("dcd64014e1046476f2ed", {
  cluster: "ap2",
});
var channel = pusher.subscribe("my-channel");

$(document).ready(() => {
  $.getJSON("/tables")
    .then(renderTables)
    .catch((err) => {
      console.log(err.message);
    });
  channel.bind("my-event", function (data) {
    // console.log("An event was triggered with message: " + data.message);
    updateTables();
  });
  // setInterval(updateTables, 10000);
});

function refreshTables(tables) {
  var currentTime = new Date().getTime();

  $(".table").each(function (i) {
    $(this).data({
      waiting: tables[i].waiting,
      ordered: tables[i].ordered,
      eating: tables[i].eating,
      empty: tables[i].empty,
      seconds: Math.floor((currentTime - tables[i].start_time) / 1000),
    });
  });

  $(".table").each(function (i) {
    if ($(this).data("waiting") == true) {
      $(this).css("background", "#e74c3c");
    }

    if ($(this).data("ordered") == true) {
      $(this).css("background", "#e67e22");
    }

    if ($(this).data("eating") == true) {
      $(this).css("background", "#27ae60");
    }

    if ($(this).data("empty")) {
      $(this).css("background", "#34495e");
    }
  });

  $(".table").each(function (i) {
    if (
      $(this).data("waiting") ||
      $(this).data("ordered") ||
      $(this).data("eating")
    ) {
      changeTime($(this));
    } else {
      $(this).find(".timer").html("Empty");
    }
  });
}

function updateTables() {
  $.getJSON("/tables")
    .then(refreshTables)
    .catch((err) => {
      console.log(err.message);
    });
}
function renderTables(tables) {
  var currentTime = new Date().getTime();
  tables.forEach((table) => {
    $("section").append(`<div class="card">
        <div class="table">
          <span class="timer">Empty</span>
        </div>
        <div class="name">${table.name}</div>
      </div>`);
  });

  $(".table").each(function (i) {
    $(this).data({
      waiting: tables[i].waiting,
      ordered: tables[i].ordered,
      eating: tables[i].eating,
      seconds: Math.floor((currentTime - tables[i].start_time) / 1000),
    });
  });

  $(".table").each(function (i) {
    if ($(this).data("waiting") == true) {
      $(this).css("background", "#e74c3c");
    }

    if ($(this).data("ordered") == true) {
      $(this).css("background", "#e67e22");
    }

    if ($(this).data("eating") == true) {
      $(this).css("background", "#27ae60");
    }
  });

  $(".table").each(function (i) {
    if (
      $(this).data("waiting") ||
      $(this).data("ordered") ||
      $(this).data("eating")
    ) {
      changeTime($(this));
    }
  });
}

function changeTime(table) {
  seconds = table.data("seconds");
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;

  if (m == 1) {
    table.find(".timer").html(m + " minute");
  } else {
    table.find(".timer").html(m + " minutes");
  }

  seconds += 1;
  table.data("seconds", seconds);
}
