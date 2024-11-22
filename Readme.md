1.created project structure 
2.create auth controller and routes

------>lecture 1
learn how to use github using vscode


------>Learning -3 (0 to 27:00)
-create mongodb connection inside lib>db.js and connected to server
-created userModel inside model>user.model.js

-->Learning -4 (27 to 31)
->create static function to generate hash password(inside usermodel)<userSchema.pre>.
->also create a logic to compare the password(inside usermodel)<comparePassword>.


----->learning -5 (31:00 to 1:00:00 )
->get date form request body <signup>and if data not exist then store it into the database with hashed password and return response(inside authController).

->created upstash account and connect with redis inside (lib>redis.js) upstash_redis_key.

->created keys for token in .env
->created function <generateToken> for accesstoken and refresh token using jsonwebtoken inside(controller->auth.controller).

->creating function to store refreshtoken inside redis<storeRefreshToken>

->created function <setCookies> to store tokens.