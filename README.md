# **Gimme: A Personalized Catalog**

A webapp prototype for creating custom wishlists. A social platform for generous friends and gifters.

___

## Background

This project was created primarily as practice using React and the MERN stack. The project may or may not be continued or supported. Any major issues/bugs may be resolved in the future. No personal information will be used for malicious intent.

___

## The Web App

As a web app, users are given different permissions based on two browsing types: **Public Browsing** or **Authorized Browsing** (sections marked with ** apply to authorized users)

#### Public Browsing

A user browsing publicly, is able to view other users' catalogs/wishlists, as long as those users have made their catalogs/wishlists public. Any private catalog/wishlist is only viewable by the owner of such catalog/wishlist.

Public Browsing all permits users to view the following/followers of users, connecting individuals to other users.

#### ** Authorized Browsing

An authorized user, meaning one that is logged in with a registered account, can do all that of public browsing, and more. An authorized user is able to create their own catalogs/wishlists/items, all of which are viewable by others, if desired. (see Content Creation for Authorized Users)

Additionally, authorized users are able to modify their accounts, such as changing their display name, user handle, and password.

#### Content Creation for Authorized Users

To create content (i.e. wishlists & items), an authorized user simply navigates to their catalog page by clicking the 'Catalog' tab on navigation bar at the top of the page.

**** Creating A List**

Once on the catalog page, using the left side panel, the user clicks on the button that says 'Create New List'. This reveals an input line where the user can give an initial name for the list (this can be changed later).

**** Modifying List Information**

After a list is created, users can change the name of the list by clicking the title displayed above. List names, however, must be unique to the user (e.g. you can not have two lists with the name 'Birthday Wishes').

Users can also change the privacy settings on the list using the drop down menu in the top right corner, that says 'set privacy'. Private lists will not be viewable or known to other users.
  - **public**: all users can view the list
  - **private**: only the owner can view the list

An authorized user can also delete the list, if needed, by clicking the button in the top right that says 'delete list'. User will be prompted with a warning box before finally deleting list.

#### Viewing The Item Table

Users, by default, have one public list named 'All Items' which displays every item in every **public** list for that user (e.g. if item A is in public list AA and item B is in private BB, only item A will be shown in the All Items list).

Each list also has a table of tags, provided by the items in the list. These tags can be used to filter the displayed items. By clicking one or more tags, only items that have BOTH/ALL selected tags will be displayed.

Each item in the list is represented by an item card, which when clicked displays the item details, provided by the item owner. A link is also displayed on the card, which opens a tab to the directed url.

#### Viewing Items In Detail

If an item card is clicked, users can see the following information, each provided by the user:
  - **name**
  - **pictures**
  - **tags**
  - **notes**
  - **links**

Note: if the user does not provide pictures, tags, notes, or links, these details will not be displayed to the viewers.

If the owner had provided multiple pictures, to navigate through the pictures, simply use the navigation arrows to skim through. Clicking on the navigation tiles will also change the displayed picture.

Viewing items in detail also gives users a button that says 'view in list' which directs users to the corresponding list, if perhaps the item was viewed from the 'All Items' list.

#### ** Modifying Item Details

Authorized users can edit all the item details by clicking on the provided button that says 'edit'. This button is only provided to the owners of the item being viewed.

***Editing Name:*** To edit the name of the item, simply click the title of the item, displaying the item's name. The color will fade, and the user will be able to type a new name. Clicking away will preserve the inputted name until saved. Pressing the enter key will save all changes.

***Editing Pictures***: This web app doesn't support image hosting, so to add pictures, users would simply take an image url and paste it into the line above on the top left side that says '`+ add image url`'. If there were no issues retrieving the image from the url, it will be displayed. To delete pictures, simply click the 'x' button on the top right of the navigation tile for the corresponding image. Image urls cannot be modified once entered, only added or deleted.

***Editing Tags***: To add a tag, click on the provided tag below the item name that says '`+ new tag`'. Type a tag name and press the enter key to preserve it. User can swiftly add multiple tags since pressing the enter key keeps the new tag input in focus. Tags are case sensitive and must be unique to the item. Duplicate tags will not be preserved upon enter key press.

***Editing Notes***: To add/edit notes, click on pre-existing notes, or the 'Add notes' text, to put area in focus. Once in focus, provide any notes that you want your viewers to see. Clicking away will preserve text until saved. Pressing enter will save all changes.

***Editing Links***: To add a link, click on the text that says '`+ add link`', at the bottom of the right panel. Once in focus, users can copy and paste website urls and press the enter key to preserve the link. To delete a link, click on the text that says 'remove' next to the corresponding link.

***Saving State***: Unless the user saves the changes, any modifications will only be preserved, NOT SAVED. By leaving the page, or clicking outside of the modal, any changes will be lost. Clicking the button that says '`cancel`' will also discard any changes. To save any/all changes made, click on the button that says '`save changes`' at the top left of the right panel. Users can also save changes by pressing the enter key when changing the item `name` or `notes`.

***Deleting Item***: To delete an item, click on the button that says '`delete item`' in the top right corner of the right panel. The user will be prompted with a warning before finally deleting the item.

---

### ** Account Details

Authorized users can update the account information by clicking on the tab that says 'Account' in the top right of the navigation bar.

Once on the Account page, use the side navigation on the left panel to reveal change forms.

#### Account Settings

In the **account settings** form, users can change the following:

- ***Change Name***: This is the users display name. It can be anything the user wants, as long as it doesn't begin or end with whitespace. Input with trailing whitespace will be trimmed.

- ***Request New Handle***: This is the users handle, or the name used to find the user. This is a name unique to all users (i.e. no two users can have the same handle). Users can attempt to change their user handle by typing it in the input field and clicking the button that says '`change`', or by pressing the enter key. If the submitted handle is not in use, the user's handle will be changed.

*Note: User handles are case insensitive and can only consist of letters, numbers, and underscores.

#### Change Password

In the **change password** form, users can change their password by inputting their current password, followed by a new password. The new password is entered twice for confirmation. If the current password is entered correctly, the password will be changed to the newly inputted one.

*Notes: Passwords cannot have trailing whitespace and must be at least 8 characters long.


### Logout

Finally, authorized users are given ability to log out.

___

## The Stack

This project was built using the MERN stack.

- **MongoDB**
- **Express**
- **React**
- **Node**

#### MongoDB, Mongo Atlas, and Mongoose

The backend is supported by Mongo Atlas under a free tier. The database consists of 4 collections: **Sessions**, **Users**, **Lists**, and **Items**.

- **Sessions**: used primarily to track authorized users, providing tokens from scratch that expire after 7 days of inactivity.

- **Users**: used to allow content creation and overall app usage

- **Lists**: exists outside of ***Users*** documents to prevent necessity of user access, keeping information distant and safe.

- **Items**: exists outside of ***Lists*** document to allow future implementations, such as 'new item' notifications.

#### Express.js

The middleware is supported by Express.js and api routes that follow the REST protocols. API Routes can be reached using the `/api/routes/` prefix followed by the fields below:

** THESE FIELDS HAVE BEEN REMOVED FOR PRIVACY REASONS **

*Note: The API backend is not secure and may or may not be made secure in the future. Don't store any valuable or personal information that you would mind being public.

Both the Frontend and Backend are hosted on the same server.

#### React

The frontend is built and supported by React library, with frequent use of functional components and react hooks. Styling is supported by node-sass and modularized scss.


#### Node.js

The package management is supported by Node.js, using the following packages and their dependencies:

- **`express ^4.17.3`**

- **`mongoose ^6.2.10`**

- **`bcrypt ^5.0.1`**

- **`dotenv ^16.0.0`**

- **`node-sass ^7.0.1`**
