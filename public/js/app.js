var myAppToken = '3efb3bc3b06f6b7e';

muzzley.on('error', function(err) {
  console.log("Error: " + err);
});

muzzley.connectApp(myAppToken, function(err, activity) {
  if (err) return console.log("Connect error: " + err);

  // Usually you'll want to show this Activity's QR code image
  // or its id so that muzzley users can join.
  // They are in the `activity.qrCodeUrl` and `activity.activityId`
  // properties respectively.
  console.log(activity);
  document.getElementById('qrCodeContainer').src = activity.qrCodeUrl;

  activity.on('participantQuit', function(participant) {
    // A participant quit
  });

  var startup = function() {
    $('#qrCodeContainer').hide();
    $('#dark').show();
    showNight();
  };

  var showNight = function() {
    $('#dark').animate({ opacity: 1 });
    $('#message').text("goodnight").css('color', '#fff');
  };

  var showLight = function() {
    $('#dark').animate({ opacity: 0 });
    $('#message').text("rise and shine").css('color', '#000');
  };

  var resetCanvas = function() {
    $('#qrCodeContainer').show();
    $('#dark').hide();
    $('#message').text("i am a light switch.").css('color', '#000');
  };

  activity.on('participantJoin', function(participant) {
    startup();

    // A participant joined. Tell him to transform into a gamepad.
    participant.changeWidget(
      'switch',
      {'isOn': 0},
      function(err) {
        if (err) return console.log('changeWidget error: ' + err);
        console.log('Activity: changeWidget was successful');
      }
    );

    participant.on('action', function (action) {
      if (action.v === 1) { // on
        showLight();
      } else if (action.v === 0) { // off
        showNight();
      }

      console.log(action);
    });

    participant.on('quit', function (action) {
      resetCanvas();
   });

  });
});
