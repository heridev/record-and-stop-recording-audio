$(function () {
  $( "#record-media" ).click(function() {
    alert( "Start record media triggered" );
    recordMedia();
  });

  $( "#stop-media" ).click(function() {
    alert( "Stop media triggered" );
    stopRecordMedia();
  });

});

