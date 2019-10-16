import jquery from "jquery";

import 'jquery-migrate';
import 'jquery-touch-events';

jquery.migrateTrace = false;
export default (window.$ = window.jQuery = jquery);