/**
 * Routes
 * @author Kenneth Phang
 */
var isAuthenticated = require("./authentication");
const API = "/api/"
const API_USERS_URI = `${API}users`;

module.exports = function(app, ) {
    
    
    // Users API
    app.get(API_USERS_URI, isAuthenticated, UserController.list);
    app.post(API_USERS_URI, isAuthenticated, UserController.create);
    app.get(API_USERS_URI + '/:id', isAuthenticated, UserController.get);
    app.get(API_USERS_URI + '/:id/posts', isAuthenticated, PostController.listByUser);
    app.post(API_USERS_URI + '/:id', isAuthenticated, UserController.update);
    app.delete(API_USERS_URI + '/:id', isAuthenticated, UserController.remove);
    app.get("/api/user/view-profile", isAuthenticated, UserController.profile);
    

}