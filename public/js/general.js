/**
 * Avoid back to welcome
 */
const uri = window.location.toString();

if (uri.indexOf(uriWelcome + "#")) {
    const cleanURI = uri.substring(0, uri.indexOf("#"));
    if (history.replaceState) {
        history.replaceState(null, null, cleanURI);
    } else {
        window.location.hash = '';
    }
}