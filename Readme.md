image explaination

<----------------------------->

1.created project structure 
2.create auth controller and routes

##------>lecture 1
learn how to use github using vscode


##------>Learning -3
-create mongodb connection inside lib>db.js and connected to server
-created userModel inside model>user.model.js

##-->Learning -4 
->create static function to generate hash password(inside usermodel)<userSchema.pre>.
->also create a logic to compare the password(inside usermodel)<comparePassword>.


##----->learning -5 
->get date form request body <signup>and if data not exist then store it into the database with hashed password and return response(inside authController).
->created upstash account and connect with redis inside (lib>redis.js) upstash_redis_key.
->created keys for token in .env
->created function <generateToken> for accesstoken and refresh token using    jsonwebtoken inside(controller->auth.controller).
->creating function to store refreshtoken inside redis<storeRefreshToken>
->created function <setCookies> to store tokens.


##----->Learning-6 
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


##----->Learning-7 
->wrote refreshToken logic inside authcontroller{details are in comments easily understandable}.
->create product route/controller/model and connected with each other.
->create <protectRoute>,<adminRoute> <getAllProducts> in middleware->auth.middleware.js and import it in Product.routes
->create <getFeaturedProducts> and calling it from productRoutes.

##----->Learning-8
->connect cloudinary inside the lib folder.
->create product in <createProducts> inside controller and then added it to productRouter.
->create  <deleteProduct> inside controller and then added it to productRouter.
