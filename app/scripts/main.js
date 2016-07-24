/* eslint strict: false */
var eventBag = [];
var guest = [];
function IssueTracker() {
  this.issues = [];
}

IssueTracker.prototype = {
  add: function(issue) {
    this.issues.push(issue);
  },
  display: function() {
    var msg = '';
    if (this.issues.length > 0) {
      msg = "Please correct the following:<br>" + this.issues.join("<br>");
    }
    return msg;
  },
  removeAll: function() {
    while (this.issues.length > 0) {
      this.issues.pop();
    }
  },
  get: function(index) {
    return this.issues[index];
  }
};

function Event(name, type, host, startDate, endDate, guests, line1, line2, city, state, postalcode, country, msg) {
  this.name = name;
  this.type = type;
  this.host = host;
  this.startDate = startDate;
  this.endDate = endDate;
  this.guests = guests;
  this.line1 = line1;
  this.line2 = line2;
  this.city = city;
  this.state = state;
  this.postalcode = postalcode;
  this.country = country;
  this.msg = msg;
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}


$(document).ready(function() {
  $('#contact_form').bootstrapValidator({
      // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        name: {
          validators: {
            stringLength: {
              min: 3,
              message: 'Name field must be at least 3 characters'
            },
            notEmpty: {
              message: 'Please Enter Your Name'
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: 'Enter Your Email'
            },
            emailAddress: {
              message: 'Invalid Email Address'
            }
          }
        },
        password1: {
          validators: {
            notEmpty: {
              message: 'Enter Your Password'
            },
            stringLength: {
              min: 6,
              message: 'Password must be at least 6 characters'
            }
          }
        },
        password2: {
          validators: {
            notEmpty: {
              message: 'Enter Your Password'
            },
            identical: {
              field: 'password1',
              message: 'The password and its confirm are not the same'
            },
            stringLength: {
              min: 6,
              message: 'Password must be at least 6 characters'
            }
          }
        }
      }
    })
    .on('success.form.bv', function(e) {
      $('#success_message').slideDown({
          opacity: 'show'
        }, 'slow') // Do something ...

      var name = $('#name').val();
      $('#contact_form').data('bootstrapValidator').resetForm();
      // Prevent form submission
      e.preventDefault();

      // Get the form instance
      var $form = $(e.target);

      // Get the BootstrapValidator instance
      var bv = $form.data('bootstrapValidator');
      localStorage.setItem('name', name);
    });


  $('#errorMsg').hide();
});

$('.next').click(function() {
  var issues = new IssueTracker();
  var msgIssue = '';
  var currentId = $(this).parents('.tab-pane').attr('id');
  var nextId = $(this).parents('.tab-pane').next().attr('id');
  switch (currentId) {
    case 'step1':
      var eventNameVal = $('#eventName').val();
      var eventTypeVal = $('#eventType').val();
      if (eventNameVal === '') {
        msgIssue = 'You must enter event Name';
        issues.add(msgIssue);
      }
      if (eventTypeVal === '') {
        msgIssue = 'You must enter event type';
        issues.add(msgIssue);
      }
      break;
    case 'step2':
        var eventHostVal = $('#eventHost').val();
        if (eventHostVal === '')
        {
          msgIssue = 'You must enter event host';
          issues.add(msgIssue);
        }
      break;
    case 'step3':
    var line1 = $('#line1').val();
    var city = $('#city').val();
    var country = $('#country').val();
    if (line1 === '')
    {
      msgIssue = 'Lin1 is required filed';
      issues.add(msgIssue);
    }
    if (city === '')
    {
      msgIssue = 'City is required field';
      issues.add(msgIssue);
    }
    if (country === '')
    {
      msgIssue = 'country is required field';
      issues.add(msgIssue);
    }
      break;
    case 'step4':
      break;
  }
  var issuesMessage = issues.display();
  if (issuesMessage.length != 0) {
    $('.errorMsg').show();
    $('.errorMsg').html(issuesMessage);
    return false;
  }
  $('[href*=\\#' + nextId + ']').tab('show');
  $('.errorMsg').empty();
});

$('.prev').click(function() {

  var prevId = $(this).parents('.tab-pane').prev().attr('id');
  $('[href*=\\#' + prevId + ']').tab('show');
  return false;

});
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {

  //update progress
  var step = $(e.target).data('step');
  var percent = (parseInt(step) / 4) * 100;

  $('.progress-bar').css({
    width: percent + '%'
  });
  $('.progress-bar').text("Step " + step + " of 4");

  //e.relatedTarget // previous tab

});

$('.first').click(function() {

  $('#myWizard a:first').tab('show');

});


$('#addToList').click(function() {
  var guestName = $('#guestName').val();
  $('#guestName').val('');
  if (guestName == "") {
    return false;
  }
  guest.push(guestName);
  $('#guestList').append('<li><i class="glyphicon glyphicon-remove"></i><span>' + guestName + '</span></li>');
});

$('#guestList').on('click', 'li', function(e) {
  remove(guest, $(this).text());
  $(this).remove();
});

$('#saveEvent').click(function() {
  $('#success_message').slideDown({
      opacity: 'show'
    }, 'slow'); // Do something ...

  var name = $('#eventName').val();
  $('#eventName').val('');
  var type = $('#eventType').val();
  $('#eventType').val('');
  var host = $('#eventHost').val();
  $('#eventHost').val('');
  var startDate = $('input[name="daterange"]').data('daterangepicker').startDate._d;
  var endDate = $('input[name="daterange"]').data('daterangepicker').endDate._d;
  var guests = [];
  var line1 = $('#line1').val();
  var line2 = $('#line2').val();
  var city = $('#city').val();
  var state = $('#state').val();
  var postalcode = $('#postalcode').val();
  var country = $('#country').val();
  var msg = $('#msg').val();
  while (guest.length > 0) {
    guests.push(guest.pop());
  }
  $('#guestList').empty();
  document.getElementById('eventForm').reset();
  var event = new Event(name, type, host, startDate, endDate, guests, line1, line2, city, state, postalcode, country, msg);
  var stored = localStorage.getItem('events');
  stored = JSON.parse(stored);
  if (stored === null)
  {
    eventBag.push(event);
    localStorage.setItem('events', JSON.stringify(eventBag));
  }
  else
  {
    eventBag = stored;
    eventBag.push(event);
    localStorage.setItem('events', JSON.stringify(eventBag));
  }
  var results = localStorage.getItem('events');
});

$('.display').click(function() {
  $('#eventNames').empty();
  var name;
  var start, end, type, host, guests, line1, line2, city, state, postalcode, country, msg;
  var results = localStorage.getItem('events');
  results = JSON.parse(results);
  if (results === null)
  {
    return false;
  }
  for (var i = 0; i < results.length; i++) {
    name = results[i].name;
    start = results[i].startDate.slice(0, 10);
    end = results[i].endDate.slice(0, 10);
    type = results[i].type;
    host = results[i].host;
    guests = results[i].guests;
    line1 = results[i].line1;
    line2 = results[i].line2;
    city = results[i].city;
    state = results[i].state;
    postalcode = results[i].postalcode;
    country = results[i].country;
    msg = results[i].msg;

    $('#eventNames').append('<div id="accOption">\
        <a href="#' + i + '" id="optionalInfo" class="collapsed eventDisName" data-toggle="collapse">\
          <span id="eventDisNameR">' + name + '</span>\
          <span id="eventDisNameL">' + start + ' to ' + end + '</span>\
        </a>\
      </div>\
      <div id="' + i + '" class="collapse eventDisContent">\
      <div class="row">\
        <h6>Event Name: ' + name + '</h6>\
      </div>\
      <div class="row">\
        <h6>Event Type: ' + type + '</h6>\
      </div>\
      <div class="row">\
        <h6>Event Host: ' + host + '</h6>\
      </div>\
      <div class="row">\
        <h6>Dates: ' + start + ' to ' + end + '</h6>\
      </div>\
      <div class="row">\
        <h6>Guests Names: ' + guests + '</h6>\
      </div>\
      <div class="row">\
        <h6>Address Details: ' + line1 + ' ' + line2 + ', ' + city + ' ' + state + ', ' + postalcode + ', ' + country + '</h6>\
      </div>\
      <div class="row">\
        <h6>Message: ' + msg + '</h6>\
      </div>\
      </div>');
  }
});

/*
$('#eventNames').on('click', 'button', function(e) {
  $('.modal-content').empty();
  $('.modal-content').append('<h3>'+$(this).attr('id')+'</h3>');
});
*/
