var fs    = require('fs');
var plist = require('plist');

var FILEPATH = 'platforms/ios/KidsLoop/KidsLoop-Info.plist';

module.exports = function () {
    var xml = fs.readFileSync(FILEPATH, 'utf8');
    var obj = plist.parse(xml);

    obj.LSSupportsOpeningDocumentsInPlace = true;
    obj.UIFileSharingEnabled = true;

    obj.NSCameraUsageDescription = "KidsLoop Live wants to have camera permission for classroom video conference.";
    obj.NSMicrophoneUsageDescription = "KidsLoop Live wants to have microphone permission for classroom video conference.";
    obj.NSPhotoLibraryUsageDescription = "KidsLoop Live wants to access photo library to select pictures for homework.";
    obj.NSPhotoLibraryAddUsageDescription = "KidsLoop Live wants to access photo library to save pictures for homework.";
    obj.NSDocumentsFolderUsageDescription = "KidsLoop Live wants to access documents folder to select files for homework.";
    obj.NSDesktopFolderUsageDescription = "KidsLoop Live wants to access desktop folder to select files for homework.";
    obj.NSDownloadsFolderUsageDescription = "KidsLoop Live wants to access downloads folder to select files for homework.";

    xml = plist.build(obj);
    fs.writeFileSync(FILEPATH, xml, { encoding: 'utf8' });
};