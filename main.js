var rootDir = "file:///mnt/sdcard";
var appHomeDir = "Android/data/com.ventusmoso.pg2_jqm";
var demoMediaFile = appHomeDir + "/phonegap-demo.mp3";
var my_media;
var my_media_status;
var myMediaRec;
var mediaTimer = null;
var recordTimer = null;

function updatePlayMediaStatus(a) {
    $("#mediaPlayStatus").html(a)
}

function hola(msg) {
  alert(msg);
}

function updateRecordMediaStatus(a) {
    $("#mediaRecordStatus").html(a)
}

function listDirForMedia() {
    function b(c) {
        $("#playMediaProperties").html("Media file not found. <br/><br/>Please record a new sound file.");
        updatePlayMediaStatus("ERROR: Sound file not found. Code: " + c.code)
    }

    function a(c) {
        $("#playMediaProperties").html(c.name + ' is ready. <br/><br/>Press "Play" to start.')
    }
    $("#playMediaProperties").empty();
    updatePlayMediaStatus("");
    window.resolveLocalFileSystemURI(rootDir + "/" + demoMediaFile, a, b);
    if (my_media) {
        my_media.stop();
        my_media.release();
        my_media = null
    }
    $("#mediaFreq").val(0).slider("refresh")
}

function mediaOnSuccess() {
    $("#playMediaProperties").html("Finished playing")
}

function mediaOnError(a) {
    $("#playMediaProperties").html("ERROR: Cannot play audio. Code: " + a.code + " Message: " + a.message + "<br/>");
    clearInterval(mediaTimer);
    mediaTimer = null;
    my_media.release();
    my_media = null
}

function setAudioPosition(a) {
    var b = parseFloat(a);
    var c = parseFloat(my_media.getDuration());
    var d = Math.ceil((b / c) * 100);
    $("#mediaFreq").val(d).slider("refresh");
    if (b <= -0.001) {
        $("#playMediaProperties").html("Finished playing.");
        clearInterval(mediaTimer);
        mediaTimer = null
    }
}

function stopMedia() {
    if (my_media) {
        my_media.stop();
        my_media.release();
        my_media = null
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
    $("#playMediaProperties").html("Finished playing.");
    $("#mediaFreq").val(0).slider("refresh")
}

function playMedia() {
    $("#playMediaProperties").html("Playing...");
    if (!my_media) {
        my_media = new Media(demoMediaFile, null, mediaOnError)
    }
    my_media.play();
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            my_media.getCurrentPosition(function(a) {
                if (a > -1) {
                    setAudioPosition((a) + " sec")
                }
            }, function(a) {
                setAudioPosition("Error: " + a.message)
            })
        }, 1000)
    }
}

function pauseMedia() {
    if (my_media) {
        my_media.pause();
        $("#playMediaProperties").html("Pausing the audio....")
    } else {
        $("#playMediaProperties").html("No song is playing")
    }
    clearInterval(mediaTimer);
    mediaTimer = null
}

function prepareRecordMedia() {
    $("#recordMediaProperties").html('Ready.  Press "Record" to start');
    updateRecordMediaStatus("");
    if (myMediaRec) {
        myMediaRec.release();
        myMediaRec = null
    }
    if (my_media) {
        my_media.release();
        my_media = null
    }
}

function recordMedia() {
    if (!myMediaRec) {
        if (my_media) {
            my_media.release();
            my_media = null
        }
        $("#recordMediaProperties").empty();
        myMediaRec = new Media(demoMediaFile, null, function(b) {
            updateRecordMediaStatus("Recording Failed");
            $("#recordMediaProperties").html("Recording fail. Code: " + b.code)
        });
        myMediaRec.startRecord();
        updateRecordMediaStatus("Recording...");
        $("#recordMediaProperties").html("On Air... ");
        if (recordTimer == null) {
            var a = 0;
            recordTimer = setInterval(function() {
                a = a + 1;
                $("#recordMediaProperties").html("On Air... " + a + " sec")
            }, 1000)
        }
    }
}

function stopRecordMedia() {
    $("#recordMediaProperties").empty();
    if (myMediaRec) {
        myMediaRec.stopRecord();
        myMediaRec.release();
        myMediaRec = null;
        $("#recordMediaProperties").html('Off Air.  </br></br>Please go to "Play Media" for playback.');
        updateRecordMediaStatus("Recording finished")
    } else {
        $("#recordMediaProperties").html("Recording Failed.");
        updateRecordMediaStatus("ERROR: Not recording")
    }
    clearInterval(recordTimer);
    recordTimer = null
}
$("#mediaMainPage").bind("pagebeforeshow", function() {
    $("#mediaRecord").bind("pageshow", function(a) {
        a.preventDefault();
        prepareRecordMedia();
        return false
    });
    $("#mediaPlay").bind("pageshow", function(a) {
        a.preventDefault();
        listDirForMedia();
        return false
    });
    $("#recordMediaButton").on("vclick", function(a) {
        a.preventDefault();
        recordMedia();
        return false
    });
    $("#stopRecordMediaButton").on("vclick", function(a) {
        a.preventDefault();
        stopRecordMedia();
        return false
    });
    $("#playMediaButton").on("vclick", function(a) {
        a.preventDefault();
        playMedia();
        return false
    });
    $("#pauseMediaButton").on("vclick", function(a) {
        a.preventDefault();
        pauseMedia();
        return false
    });
    $("#stopMediaButton").on("vclick", function(a) {
        a.preventDefault();
        stopMedia();
        return false
    })
});
