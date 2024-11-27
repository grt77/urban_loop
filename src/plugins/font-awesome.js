import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import specific icons
import { faSearch, faLocation } from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(faSearch, faLocation);

export default FontAwesomeIcon;
