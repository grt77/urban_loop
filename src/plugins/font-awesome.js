import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import specific icons
import { faSearch, faLocation, faChevronCircleLeft, faCircleUser, faCircleNotch, faRotateRight } from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(faSearch, faLocation, faChevronCircleLeft, faCircleUser, faCircleNotch, faRotateRight);

export default FontAwesomeIcon;
