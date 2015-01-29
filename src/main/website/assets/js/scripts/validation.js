"use strict";!function(){angular.module("konikio",["ipCookie","ngRoute","restangular","ui.bootstrap","konikio.users","konikio.validation","konikio.utils"]).config(["$routeProvider",function(e){e.when("/",{templateUrl:"partials/validation.html",controller:"ValidationCtrl"}).when("/reset",{templateUrl:"partials/users/new-password.html",controller:"NewPasswordCtrl"})}]).config(["RestangularProvider",function(e){e.setBaseUrl("http://te1.onlinevalidation.konik.io")}]).config(["$httpProvider",function(e){e.interceptors.push(["$injector",function(e){return e.get("AuthInterceptor")}])}]).run(["AuthService",function(e){e.restoreSession()}])}(),angular.module("konikio.validation",["konikio.validation.controller","konikio.validation.validation-service"]),function(){angular.module("konikio.validation.controller",[]).controller("ValidationCtrl",["$scope","$modal","AuthService","ValidationService",function(e,r,o,i){var n,a=function(){e.isAuthenticated=o.isAuthenticated()},s=function(){angular.isObject(n)&&n.dismiss("close")};e.openLogin=function(){s(),n=r.open({templateUrl:"partials/users/login.html",controller:"LoginCtrl",scope:e}),n.result.then(function(){a()})},e.openRegister=function(){s(),n=r.open({templateUrl:"partials/users/register.html",controller:"RegisterCtrl",scope:e})},e.openReset=function(){s(),n=r.open({templateUrl:"partials/users/reset.html",controller:"ResetCtrl",scope:e})},e.logout=function(){o.logout(),a()},e.error={};var t=function(){e.error.message="",e.validationResponse=void 0};e.validate=function(r){t(),angular.isObject(r)?i.validate(r).then(function(r){e.validationResponse=r})["catch"](function(r){e.error.message=r}):e.error.message="Please provide file to validate."},e.findAlarmType=function(e){var r;switch(e){case"VALID":r="alert-success";break;case"INVALID":case"ERROR":r="alert-danger";break;default:r="alert-danger"}return r},a()}])}(),function(){angular.module("konikio.validation.validation-service",[]).factory("ValidationService",["$http","$q","RestangularData","ResponseParser",function(e,r,o,i){var n={};return n.validate=function(e){var n=r.defer(),a=new FormData;return a.append("file",e),o.one("validate").customPOST(a,null,null,{"Content-Type":void 0}).then(function(e){n.resolve(e)})["catch"](function(e){var r=i.getErrorMessageFromResponse(e,"Validation failed.");n.reject(r)}),n.promise},n}]).factory("RestangularData",["Restangular",function(e){return e.withConfig(function(e){e.setDefaultHttpFields({transformRequest:angular.identity})})}])}(),angular.module("konikio.users",["konikio.users.login","konikio.users.register","konikio.users.reset","konikio.users.new-password","konikio.users.auth-interceptor","konikio.users.auth-service","konikio.users.session"]),function(){angular.module("konikio.users.register",[]).controller("RegisterCtrl",["$scope","$modalInstance","AuthService",function(e,r,o){e.error={};var i=function(){e.error.message=""};e.registerUser={firstName:"",lastName:"",company:"",email:"",password:""},e.register=function(n){i(),o.register(n).then(function(){r.close()},function(r){e.error.message=r})},e.cancel=function(){r.dismiss("cancel")}}])}(),function(){angular.module("konikio.users.login",[]).controller("LoginCtrl",["$scope","$modalInstance","AuthService",function(e,r,o){e.error={};var i=function(){e.error.message=""};e.credentials={email:"",password:""},e.login=function(n){i(),o.login(n).then(function(){r.close()},function(r){e.error.message=r})},e.cancel=function(){r.dismiss("cancel")}}])}(),function(){angular.module("konikio.users.reset",[]).controller("ResetCtrl",["$scope","$modalInstance","AuthService",function(e,r,o){e.error={};var i=function(){e.error.message=""};e.credentials={email:""},e.reset=function(n){i(),o.reset(n.email).then(function(){r.close()},function(r){e.error.message=r})},e.cancel=function(){r.dismiss("cancel")}}])}(),function(){angular.module("konikio.users.new-password",[]).controller("NewPasswordCtrl",["$scope","$location","AuthService",function(e,r,o){e.error={};var i=function(){e.error.message=""};e.credentials={password:""},e.newPassword=function(n){i();var a=r.search(),s=a.email,t=a.token;angular.isDefined(s)&&""!==s&&angular.isDefined(t)&&""!==t?o.newPassword(s,t,n.password).then(function(){r.$$search={},r.path("/")},function(r){e.error.message=r}):e.error.message="Missing authentication parameters"}}])}(),function(){angular.module("konikio.users.auth-interceptor",[]).factory("AuthInterceptor",["$q","Session",function(e,r){var o={},i=function(e){return e.headers=e.headers||{},angular.isDefined(r.id)&&(e.headers.Authorization=r.id),e},n=function(r){return e.reject(r)};return o.request=i,o.responseError=n,o}])}(),function(){angular.module("konikio.users.auth-service",[]).factory("AuthService",["$q","Restangular","Session","ResponseParser",function(e,r,o,i){var n={};return n.register=function(o){var n=e.defer();return r.one("register").customPOST(o,null,null,{"Content-Type":"application/json"}).then(function(){n.resolve()})["catch"](function(e){var r=i.getErrorMessageFromResponse(e.data,"Error during registration!");n.reject(r)}),n.promise},n.login=function(n){var a=e.defer();return r.one("login").customPOST(n,null,null,{"Content-Type":"application/json"}).then(function(e){o.create(e.token,n.email),a.resolve()})["catch"](function(e){var r=i.getErrorMessageFromResponse(e.data,"Error during log in!");a.reject(r)}),a.promise},n.reset=function(o){var n=e.defer();return r.one("resetPassword").customPOST(o,null,null,{"Content-Type":"application/json"}).then(function(){n.resolve()})["catch"](function(e){var r=i.getErrorMessageFromResponse(e.data,"Error while resetting password!");n.reject(r)}),n.promise},n.newPassword=function(n,a,s){var t=e.defer(),l={user:{email:n,password:s},token:a};return r.one("changePassword").customPOST(l,null,null,{"Content-Type":"application/json"}).then(function(e){o.create(e.token,n),t.resolve()})["catch"](function(e){var r=i.getErrorMessageFromResponse(e.data,"Error while setting new password!");t.reject(r)}),t.promise},n.logout=function(){o.destroy()},n.restoreSession=function(){o.createFromStore()},n.isAuthenticated=function(){return!!o.userId},n}])}(),function(){angular.module("konikio.users.session",[]).service("Session",["ipCookie",function(e){var r="kionikAuth";return this.create=function(o,i){this.id=o,this.userId=i,e(r,{token:o,email:i},{expires:2,expirationUnit:"hours"})},this.createFromStore=function(){var o=e(r);angular.isObject(o)&&this.create(o.token,o.email)},this.destroy=function(){this.id=void 0,this.userId=void 0,this.expiresIn=void 0,e.remove(r)},this}])}(),angular.module("konikio.utils",["konikio.utils.file-model","konikio.utils.response-parser"]),function(){angular.module("konikio.utils.file-model",[]).directive("fileModel",["$parse",function(e){return{restrict:"A",link:function(r,o,i){var n=e("$parent."+i.fileModel),a=n.assign;o.bind("change",function(){r.$apply(function(){a(r,o[0].files[0])})})}}}])}(),function(){angular.module("konikio.utils.response-parser",[]).factory("ResponseParser",function(){var e={};return e.getErrorMessageFromResponse=function(e,r){var o="";return angular.isObject(e)&&angular.isDefined(e.error)?(o=e.error,angular.isDefined(e.message)&&(o+=" "+e.message)):angular.isArray(e)?angular.forEach(e,function(e){o+=o?", ":"",o+=angular.isDefined(e.field)?e.field+": "+e.defaultMessage:e.defaultMessage}):o=r,o},e})}(),function(e){try{e=angular.module("konikio")}catch(r){e=angular.module("konikio",[])}e.run(["$templateCache",function(e){e.put("partials/validation.html",'<div class="container"><div class="row well"><div class="col-lg-6 col-md-6"><h4>Test ZUGFeRD invoice for compliance</h4><p>This online service validates ZUGFeRD compliant PDF or XML invoices with the help of the Konik library.</p><p>If you would like to see a detailed validation report with a semantic validation <a href="http://www.google.com/recaptcha/mailhide/d?k=01q8vnbfNmxk0T5DM_GteAAg==&amp;c=zwuGbJbE2eqJvqdTIykGHA==" onclick="window.open(\'http://www.google.com/recaptcha/mailhide/d?k\\07501q8vnbfNmxk0T5DM_GteAAg\\75\\75\\46c\\75zwuGbJbE2eqJvqdTIykGHA\\75\\075\', \'\', \'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=300\'); return false;" title="Reveal the Email address">contact</a> us for more details.</p><p>Free Registration.</p><p>Version details</p><dl class="dl-horizontal"><dt>Konik</dt><dd>Version 1.0.0</dd><dt>Validation Service</dt><dd>Version 1.0.0</dd></dl></div><div class="col-lg-6 col-md-6"><form ng-if="isAuthenticated" name="validateForm" ng-submit="validate(fileToValidate)"><div class="form-group"><label for="upload-file">PDF or XML</label> <input type="file" name="file" id="upload-file" file-model="fileToValidate"><p id="upload_file_help_block" class="help-block">Create validation report</p></div><button id="validation-button" type="submit" class="btn btn-primary btn-large" ng-disabled="validateForm.$invalid">Submit</button> <button id="logout-button" ng-click="logout()" class="btn btn-default btn-large">Logout</button></form><button ng-if="!isAuthenticated" id="login-button" class="btn btn-primary" ng-click="openLogin()">Login</button> <button ng-if="!isAuthenticated" id="register-button" class="btn btn-primary" ng-click="openRegister()">Register</button></div></div><div class="row" ng-if="error.message"><div class="alert alert-danger">{{error.message}}</div></div><div id="server_result" class="row" ng-if="validationResponse"><div class="alert {{findAlarmType(validationResponse.status)}}"><p>{{validationResponse.statusMessage}}</p></div><div class="panel panel-default" ng-if="validationResponse.compareResult"><div class="panel-heading">Result of the round trip xml-&gt;model-&gt;xml cycle.</div><div class="panel-body">{{validationResponse.compareResult}}</div></div><div class="panel panel-default" ng-if="validationResponse.validationResult.length > 0"><div class="panel-heading">Model validation results</div><table class="table"><thead><tr><th>Path</th><th>Message</th><th>Invalid value</th></tr></thead><tbody><tr ng-repeat="validationResult in validationResponse.validationResult"><td>{{validationResult.Path}}</td><td>{{validationResult.Message}}</td><td>{{validationResult[\'Invalid value\']}}</td></tr></tbody></table></div></div></div>')}])}(),function(e){try{e=angular.module("konikio")}catch(r){e=angular.module("konikio",[])}e.run(["$templateCache",function(e){e.put("partials/users/login.html",'<div class="modal-header"><h2 class="modal-title">Login</h2></div><div class="modal-body"><form name="loginForm" class="form-horizontal" ng-submit="login(credentials)" role="form"><div class="row" ng-if="error.message"><div class="col-sm-12 col-md-12 error">{{error.message}}</div></div><div class="row"><div class="input-group col-sm-12 col-md-12"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span> <input id="login-username" type="email" class="form-control" tabindex="1" ng-model="credentials.email" name="email" placeholder="Email" required=""></div><span class="error input-error" ng-show="loginForm.email.$touched && (loginForm.email.$error.required || loginForm.email.$error.email)">Please provide valid email.</span></div><div class="row"><div class="input-group col-sm-12 col-md-12"><span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span> <input id="login-password" type="password" class="form-control" tabindex="2" ng-model="credentials.password" name="password" placeholder="Password" required="" ng-minlength="8" ng-maxlength="16"></div><span class="error input-error" ng-show="loginForm.password.$touched && (loginForm.password.$error.required || loginForm.password.$error.minLength || loginForm.password.$error.maxLength)">The password should be between 8 and 16 characters long.</span></div><div class="row"><div class="col-sm-12 col-md-12"><button type="submit" class="btn btn-primary btn-block btn-lg" tabindex="3" ng-disabled="loginForm.$invalid">Login</button></div></div></form></div><div class="modal-footer"><div class="form-group"><div class="col-md-12 control">Forgot password? <a ng-click="$parent.openReset()">Get new one</a></div></div></div>')}])}(),function(e){try{e=angular.module("konikio")}catch(r){e=angular.module("konikio",[])}e.run(["$templateCache",function(e){e.put("partials/users/new-password.html",'<div class="container"><div class="row well"><div class="col-lg-6 col-md-6 col-md-offset-3 col-lg-offset-3"><div id="loginbox" style="margin-top:50px;"><div class="panel panel-reset"><div class="panel-header"><h2>Enter your new password</h2></div><div class="panel-body"><div class="errorArea" ng-if="error.message"><div class="error">{{error.message}}</div></div><form name="newPasswordForm" class="form-horizontal" ng-submit="newPassword(credentials)" role="form"><div style="margin-bottom: 25px"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span> <input id="login-password" type="password" class="form-control" tabindex="1" ng-model="credentials.password" name="password" placeholder="Password" required="" ng-minlength="8" ng-maxlength="16"></div><span class="error input-error" ng-show="newPasswordForm.password.$touched && (newPasswordForm.password.$error.required || newPasswordForm.password.$error.minLength || newPasswordForm.password.$error.maxLength)">The password should be between 8 and 16 characters long.</span></div><div style="margin-top:10px" class="form-group"><div class="col-sm-12 col-md-12"><button type="submit" class="btn btn-primary btn-block btn-lg" tabindex="2" ng-disabled="newPasswordForm.$invalid">Reset</button></div></div><div class="form-group"><div class="col-md-12 control"><div style="border-top: 1px solid#888; padding-top:15px; font-size:85%">Have account already? <a ng-href="/">Back to validation page</a></div></div></div></form></div></div></div></div></div></div>')}])}(),function(e){try{e=angular.module("konikio")}catch(r){e=angular.module("konikio",[])}e.run(["$templateCache",function(e){e.put("partials/users/register.html",'<div class="modal-header"><h2 class="modal-title">Register</h2></div><div class="modal-body"><form name="registerForm" role="form" ng-submit="register(registerUser)"><div class="row" ng-if="error.message"><div class="col-sm-12 col-md-12 error">{{error.message}}</div></div><div class="row"><div class="col-xs-12 col-sm-6 col-md-6"><div class="form-group"><input type="text" name="firstName" ng-model="registerUser.firstName" id="firstName" class="form-control" placeholder="First Name" tabindex="1" required="" ng-minlength="3" ng-maxlength="32"> <span class="error input-error" ng-show="registerForm.firstName.$touched && (registerForm.firstName.$error.required || registerForm.firstName.$error.minLength || registerForm.firstName.$error.maxLength)">The first name should be between 3 and 32 characters long.</span></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class="form-group"><input type="text" name="lastName" ng-model="registerUser.lastName" id="lastName" class="form-control" placeholder="Last Name" tabindex="2" required="" ng-minlength="3" ng-maxlength="32"> <span class="error input-error" ng-show="registerForm.lastName.$touched && (registerForm.lastName.$error.required || registerForm.lastName.$error.minLength || registerForm.lastName.$error.maxLength)">The last name should be between 3 and 32 characters long.</span></div></div></div><div class="row"><div class="col-xs-12 col-md-12"><input type="email" name="email" id="email" ng-model="registerUser.email" class="form-control" placeholder="Email" tabindex="3" required=""> <span class="error input-error" ng-show="registerForm.email.$touched && (registerForm.email.$error.required || registerForm.email.$error.email)">Please provide valid email.</span></div></div><div class="row"><div class="col-xs-12 col-md-12"><input type="password" name="password" id="password" ng-model="registerUser.password" class="form-control" placeholder="Password" tabindex="4" required="" ng-minlength="8" ng-maxlength="16"> <span class="error input-error" ng-show="registerForm.password.$touched && (registerForm.password.$error.required || registerForm.password.$error.minLength || registerForm.password.$error.maxLength)">The password should be between 8 and 16 characters long.</span></div></div><div class="row"><div class="col-xs-12 col-md-12"><input type="text" name="companyName" ng-model="registerUser.company" id="companyName" class="form-control" placeholder="Company Name" tabindex="5" required="" ng-minlength="3" ng-maxlength="32"> <span class="error input-error" ng-show="registerForm.companyName.$touched && (registerForm.companyName.$error.required || registerForm.companyName.$error.minLength || registerForm.companyName.$error.maxLength)">The first name should be between 3 and 32 characters long.</span></div></div><div class="row"><div class="col-xs-12 col-md-12"><button type="submit" class="btn btn-primary btn-block btn-lg" tabindex="6" ng-disabled="registerForm.$invalid">Register</button></div></div></form></div><div class="modal-footer"><div class="form-group"><div class="col-md-12 control">If you already have account please <a ng-click="$parent.openLogin()">Log in</a></div></div></div>')}])}(),function(e){try{e=angular.module("konikio")}catch(r){e=angular.module("konikio",[])}e.run(["$templateCache",function(e){e.put("partials/users/reset.html",'<div class="modal-header"><h2 class="modal-title">Reset password</h2></div><div class="modal-body"><form name="resetForm" class="form-horizontal" ng-submit="reset(credentials)" role="form"><div class="row" ng-if="error.message"><div class="col-sm-12 col-md-12 error">{{error.message}}</div></div><div class="row"><div class="input-group col-sm-12 col-md-12"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span> <input id="login-username" type="email" class="form-control" tabindex="1" ng-model="credentials.email" name="email" placeholder="Email" required=""></div><span class="error input-error" ng-show="resetForm.email.$touched && (resetForm.email.$error.required || resetForm.email.$error.email)">Please provide valid email.</span></div><div class="row"><div class="col-sm-12 col-md-12"><button type="submit" class="btn btn-primary btn-block btn-lg" tabindex="2" ng-disabled="resetForm.$invalid">Reset</button></div></div></form></div><div class="modal-footer"><div class="form-group"><div class="col-md-12 control">Have account already? <a ng-click="$parent.openLogin()">Log in</a></div></div></div>')}])}();