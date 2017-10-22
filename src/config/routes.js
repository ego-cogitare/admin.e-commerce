import React from 'react';

const routes = {
  // Default routes list
  default: [
    // Global (Admin) components
    {
      path: 'brands(/:id)',
      component: require('../components/pages/brands/Brands.jsx').default
    },
    {
      path: 'file-manager',
      component: require('../components/pages/fileManager/FileManager.jsx').default
    },
    {
      path: 'users',
      component: require('../components/pages/users/Users.jsx').default
    },

    // Coordinator components
    {
    },
    // ...

    // Tutor components
    {
    },
    // ...
  ],
  // Custom route component handler depending of the user type
  custom: {
    ROLE_ADMIN: {
      available: '*'
    },
    ROLE_COORDINATOR: {
    },
    ROLE_TUTOR: {
    },
    ROLE_USER: {
    },
  },


  resolve: function (route) {
    // Get logged user data
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    loggedUser.role = 'ROLE_ADMIN';

    // Check if route available for the user
    if (this.custom[loggedUser.role].available !== '*' && this.custom[loggedUser.role].available.indexOf(route) === -1) {
      return () => <div>Not available.</div>;
    }

    // Get custom component for the current user rolename and route path
    const customRoute = (this.custom[loggedUser.role].override || []).filter((r) => r.path === route);

    // If custom route found
    if (customRoute.length > 0) {
      return customRoute[0].component;
    }
    return this.default.filter((r) => r.path === route)[0].component;
  }
};

// Creating routes list
module.exports = routes.default.map((route) => {
  return {
    path: route.path,
    resolve: (nextState, cb) => {
      require.ensure([], (require) => {
        cb(null, routes.resolve(route.path));
      });
    }
  };
});
