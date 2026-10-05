In 

auth.controller.js
, existing_user is getting data because await is missing:

javascript
// Line 17 (Current)
const existing_user = User.findOne({ email });
Why this happens
Without await, User.findOne(...) returns an unexecuted Mongoose Query object, not the actual user document or null.
In JavaScript, an object is always truthy, so if (existing_user) evaluates to true every time, triggering the "User already exists." error even if no user exists.
Fix
Add await to wait for the query to resolve:

javascript
const existing_user = await User.findOne({ email });
⚠️ Additional issues in 

auth.controller.js
 you will run into right after:
User.create with sessions requires an array of documents (

Line 31
): When passing options like { session } to Model.create, Mongoose expects the documents in an array [{ ... }]. Otherwise, it treats { session } as a second document and does not return an array:

javascript
const newUsers = await User.create([{
    name: name,
    email: email,
    password: hashedPassword,
}], { session: session });
Using req instead of res for the response (

Line 42
): req.status(201) will throw an error (req.status is not a function). Change it to res:

javascript
res.status(201).json({
    success: true,
    message: 'User created',
    data: {
        token: token,
        user: newUsers[0]
    }
});
12:36 PM
okay tell me what happen if we put await or not and why
5:34 PM
Here is exactly what happens with and without await, and why:

1. Without await
javascript
const existing_user = User.findOne({ email });
What findOne() returns immediately: It does not execute the query or wait for the database. Instead, Mongoose synchronously returns a Mongoose Query object (an internal object containing query configurations, models, options, etc.).
How JavaScript evaluates it: In JavaScript, all objects are truthy (Boolean({}) === true).
The consequence:
javascript
if (existing_user) { ... } // Evaluates: if (QueryObject) -> ALWAYS TRUE!
Even if the user does not exist in the database, existing_user holds the Query object. As a result, the code always enters the if block and throws "User already exists.".
2. With await
javascript
const existing_user = await User.findOne({ email });
What happens behind the scenes: await tells JavaScript: "Pause this function until MongoDB finishes executing the query across the network and returns the result."
What existing_user receives:
If a user exists: MongoDB returns the User document (truthy).
If no user exists: MongoDB returns null (falsy).
The consequence:
javascript
if (existing_user) { ... } 
// If user found:     if (UserDocument) -> TRUE  -> Throws 409
// If user NOT found: if (null)         -> FALSE -> Skips block and proceeds to sign up!
💡 Quick note on 

lines 31–37
Keep in mind that on line 31:

javascript
const newUsers = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
}, { session });
const token = jwt.sign({ userId: newUsers[0]._id }, ...);
When passing transaction options like { session } to User.create, Mongoose requires the document to be passed inside an array:

javascript
const newUsers = await User.create([{
    name: name,
    email: email,
    password: hashedPassword,
}], { session });
Without the [ ], Mongoose treats { session } as a second user document to insert, and newUsers[0] will be undefined, causing jwt.sign to fail on newUsers[0]._id.