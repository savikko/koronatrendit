(function(){Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});

// Static pages

Router.route('/about', {name: 'about'});

Router.route('/', {name: 'trends'});

Router.route('/add/new', {name: 'newQuestion'});

})();
