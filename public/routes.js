
app.config(function($routeProvider) {
  var routeResolvers = {
    loggedIn: function(auth) {
      return auth.requireLogin();
    },
    waitForAuth: function(auth) {
      return auth.waitForAuth();
    },
    requireAdmin: function(auth) {
      return auth.requireAdmin();
    },
    userSessions: function(sessions, currentIdentity, auth) {
      return auth.requireLogin().then(function() {
        return sessions.getSessionsByUser(currentIdentity.currentUser.id);
      });
    },
    allSessions: function(sessions, auth) {
      return auth.requireLogin().then(function() {
        return sessions.getAllSessions();
      });
    },
    allUsers: function(users, auth) {
      return auth.requireLogin().then(function() {
        return users.getAllUsers();
      });
    }
    
  }
  
  $routeProvider
    .when('/admin/login', {
      template: '<admin-login></admin-login>',
      resolve: {
        currentAuth: routeResolvers.waitForAuth
      }
    })
    .when('/admin/results', {
      template: '<results all-sessions = "$resolve.allSessions"></results>',
      resolve: {
        admin: routeResolvers.requireAdmin,
        allSessions: routeResolvers.allSessions
      }
    })
    .when('/admin/users/:id', {
      template: '<user-details  all-users = "$resolve.allUsers"></user-details>',
      resolve: {
        admin: routeResolvers.requireAdmin,
        allUsers: routeResolvers.allUsers
      }
    })
    .when('/users', {
      template: '<user-list all-users = "$resolve.allUsers" ><user-list/>',
      resolve: {
        admin: routeResolvers.requireAdmin,
        allUsers: routeResolvers.allUsers
      }
    })
    .when('/admin/createusers', {
      controller: 'createUsersCtrl',
      templateUrl: 'admin/createUsers.html',
      controllerAs: 'vm',
      resolve:  {
        admin: routeResolvers.requireAdmin
      }
    })
    .when('/home', {
       template: '<home user-sessions = "$resolve.userSessions"></home>',
      resolve: {
        login:routeResolvers.loggedIn,
        userSessions: routeResolvers.userSessions
      }
    })
    .when('/profile', {
      controller: 'profileCtrl',
      templateUrl: 'profile/profile.html',
      controllerAs: 'vm',
      resolve: {
        userProfile: routeResolvers.loggedIn,
      }
    })
    .when('/createsession', {
      controller: 'createNewSessionCtrl',
      templateUrl: 'home/createNewSession.html',
      controllerAs: 'vm',
      resolve: {
        userSessions: routeResolvers.userSessions,
      }
    })
    .when('/login', {
      controller: 'loginCtrl',
      templateUrl: 'security/login.html',
      controllerAs: 'vm',
      resolve: {
        currentAuth: routeResolvers.waitForAuth
      }
    })
    .when('/logout', {
      controller: 'logoutCtrl',
      controllerAs: 'vm',
      template: '<logout></logout>'
    })
    .otherwise('/home')
})