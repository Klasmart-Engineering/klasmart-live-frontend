const findVersionRegex = /<widget [\S\s]*?version="([^"]+)"[\S\s]*?>/gmi;
const replaceVersionRegex = /(<widget [\S\s]*?version=")[^"]+("[\S\s]*?>)/gmi;

module.exports.readVersion = function (contents) {
    const allMatches = [ ...contents.matchAll(findVersionRegex) ];
    return allMatches[0][1];
};

module.exports.writeVersion = function (contents, version) {
    return contents.replace(replaceVersionRegex, `$1${version}$2`);
};
