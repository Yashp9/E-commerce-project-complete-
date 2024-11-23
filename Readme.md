image explaination
#1> 41:44 signup Auth.
#2> 1:00:00 logout functionality.
#3> 1:04:00 login functionality.
#4> 1:12:00 refresh token

<----------------------------->

1.created project structure 
2.create auth controller and routes

##------>lecture 1
learn how to use github using vscode


##------>Learning -3 (0 to 27:00)
-create mongodb connection inside lib>db.js and connected to server
-created userModel inside model>user.model.js

##-->Learning -4 (27 to 31)
->create static function to generate hash password(inside usermodel)<userSchema.pre>.
->also create a logic to compare the password(inside usermodel)<comparePassword>.


##----->learning -5 (31:00 to 1:00:00 )
->get date form request body <signup>and if data not exist then store it into the database with hashed password and return response(inside authController).
->created upstash account and connect with redis inside (lib>redis.js) upstash_redis_key.
->created keys for token in .env
->created function <generateToken> for accesstoken and refresh token using    jsonwebtoken inside(controller->auth.controller).
->creating function to store refreshtoken inside redis<storeRefreshToken>
->created function <setCookies> to store tokens.


##----->Learning-6 (1:00:00-)
->learn {cookies & cookie-parser} form express website
->write logout controller.
->get refreshToken from cookies.
->verify token and get the payload date into <decoded>
->delete the redis data of that ID.
->clear cookies.

->create a login controller.(inside authcontroller)
->get data form req.body and then whole data from mongoose.
->comparingPassword and if both user && comparing password is true then exicute
->generate token and get the tokens<generateToken>
-> <storeRefreshToken> store refresh token in redis.
->sending response.