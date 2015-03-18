'use strict';

require('./importNodePolyfill');
var templatePolyfill = require('./templatePolyfill');

function Templates() {
	if(!document.querySelector('#content')) {
		var contentElem = document.createElement('div');
		contentElem.id = 'content';
		document.body.appendChild(contentElem);
	}
	else {
		document.querySelector('#content').innerHTML = '';
	}

	var templateElem;
	while(templateElem = document.querySelector('template')) {
		templateElem.parentNode.removeChild(templateElem);
	}
}

Templates.prototype.add = function(templateId, templateHtml) {
	var templateElem = document.createElement('template');
	templateElem.id = templateId;
	templateElem.innerHTML = templateHtml;
	document.body.appendChild(templateElem);

	// Needed for IE8+
	templatePolyfill.apply(document);
};

Templates.prototype.get = function(templateId) {
	return document.importNode(document.getElementById(templateId).content, true);
};

module.exports = Templates;
