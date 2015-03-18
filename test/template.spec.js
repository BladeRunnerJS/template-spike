'use strict';

var expect = require('expect.js');
var Templates = require('../src/Templates');

describe('templates', function() {
	var templates;

	beforeEach(function() {
		templates = new Templates();
	});

	it('provides document fragments', function() {
		templates.add('id', '<span></span>');
		expect(templates.get('id').outerHTML).to.be(undefined);
		expect(templates.get('id') instanceof DocumentFragment).to.be(true);
	});

	it('provides a new document fragment each time it is invoked', function() {
		templates.add('id', '<span></span>');
		expect(templates.get('id')).not.to.equal(templates.get('id'));
	});

	it('provides document fragments that have the same content when added to the document', function() {
		templates.add('id', '<span></span>');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<span></span>');
	});

	it('supports templates that have more than one child node', function() {
		templates.add('id', '<span></span><div></div>');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<span></span><div></div>');
	});

	it('supports templates that have mixed text and element content', function() {
		templates.add('id', '<span></span> + <div></div>');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<span></span> + <div></div>');
	});

	it('supports templates that have leading and trailing whitespace', function() {
		templates.add('id', ' <span></span> + <div></div>  ');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal(' <span></span> + <div></div>  ');
	});

	it('supports templates containing exotic elements', function() {
		templates.add('id', '<ul><li>item #1</li><li>item #2</li></ul>');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<ul><li>item #1</li><li>item #2</li></ul>');
	});

	it('supports templates containing HTML5 elements', function() {
		templates.add('id', '<section></section>');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<section></section>');
	});

	it('supports templates that contain nested elements that can only be used in certain contexts', function() {
		templates.add('id', '<td></td>');
		document.querySelector('#content').innerHTML = '<table><tbody><tr></tr></tbody></table>';
		document.querySelector('#content tr').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<table><tbody><tr><td></td></tr></tbody></table>');
	});

	it('allows context dependent templates to be used anywhere', function() {
		templates.add('id', '<td></td>');
		document.querySelector('#content').appendChild(templates.get('id'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<td></td>');
	});

	it('allows multiple templates to be used at the same time', function() {
		templates.add('id1', '<span></span>');
		templates.add('id2', '<div></div>');
		document.querySelector('#content').appendChild(templates.get('id1'));
		document.querySelector('#content').appendChild(templates.get('id2'));
		expect(innerHTML(document.querySelector('#content'))).to.equal('<span></span><div></div>');
	});
});

function innerHTML(elem) {
	return elem.innerHTML.toLowerCase().replace(/\r\n/g, '');
}
