var programName = "RenderFinished";
var versionName = "0.01";
var appName = "esemwy_RenderFinished";

var info = DzFileInfo(getScriptFileName());
var sFileName = getSetting("audioFile", info.path()+"/renderfinished.wav");
var g_execGrowl = "/usr/local/bin/growlnotify"
function notifySound()
{
    var sAudioFileName = getSetting("audioFile", sFileName);
    var oSound;
    var nPlatform = App.platform();
    if ( nPlatform == App.Windows )
        oSound = new DzWinAudioClip;
    else if( nPlatform == App.MacOSX )
        oSound = new DzMacAudioClip;
    oSound.openFile(sAudioFileName);
    oSound.play();;
}

function notifyGrowl()
{
    var process = new DzProcess();
    process.communication = process.Stdin | process.Stdout | process.Stderr;
    connect( process, "launchFinished()",   function() {}  );
    connect( process, "processExited()",    function() {}  );
    connect( process, "readyReadStderr()",  function() {}  );
    connect( process, "readyReadStdout()",  function() {}  );
    connect( process, "wroteToStdin()",     function() {}  ); 
    var aArgs = new Array;
    aArgs.push( g_execGrowl );
    aArgs.push( "--name=DAZStudio" );
    aArgs.push( "--message=DAZ Studio has finished rendering" );
    aArgs.push( "Render finished" );
    process.arguments = aArgs;
    //this process expects the name of the client in stdin
    var clientName = "Daz Studio\n";
    if( !process.launch( clientName ) )
        MessageBox.critical( "Could not start the process.", "Fatal Error", "&OK" );
}

function getSetting( key, defVal )
{
    var m_oMgr = App.getAppSettingsMgr();
    m_oMgr.pushPath( appName );
    var val = m_oMgr.getStringValue( key, defVal );
    m_oMgr.popPath();
    return ( val );
}

if ( DzAppSettings(appName).getBoolValue("doAudio") && DzFileInfo( sFileName   ).exists()) notifySound();
if ( DzAppSettings(appName).getBoolValue("doGrowl") && DzFileInfo( g_execGrowl ).exists()) notifyGrowl();