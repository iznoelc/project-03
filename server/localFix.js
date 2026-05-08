/**
 * localFix.js
 * 
 * Used to fix a known react issue, it occurs sporadically so this is a type of fallback failsafe. Works in tandem with a conditional and the .env additional information.
 * 
 * @author Esperanza Paulino
 */

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
