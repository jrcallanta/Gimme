module.exports = (data) => {
    console.log("requiring filtered item routes...");

    const express = require("express");
    const app = express.Router();

    app.route("/users/:userId/items/filtered/").post(async (req, res) => {
        console.log("api: USERS/USER.ID/ITEMS-FILTERED -> POST");
        const { userId } = req.params;
        const { tags } = req.body;

        const user = await data.User.findById(userId);
        if (!user)
            res.status(400).send({
                message: `Could not find user ${userId}`,
                error: {},
            });
        else {
            const allItemsFiltered = [];
            const listsQuery = await data.ItemList.find({
                userId: user._id,
            }).exec();

            await Promise.all(
                listsQuery.map(async (list) => {
                    await Promise.all(
                        list.listItems.map(async (itemId) => {
                            const item = await data.Item.find({
                                _id: itemId,
                                tags: { $all: tags },
                            }).exec();

                            if (item.length) allItemsFiltered.push(item[0]);
                        })
                    );
                })
            );

            res.status(200).send({
                message: `Succesfully retrieved ${allItemsFiltered.length} items`,
                items: allItemsFiltered,
            });
        }
    });

    app.route("/users/handle/:userHandle/items/filtered/").post(
        async (req, res) => {
            console.log("api: USERS/HANDLE/USER.HANDLE/ITEMS/FILTERED -> POST");
            const { userHandle } = req.params;
            const { tags } = req.body;

            const userQuery = await data.User.find({
                handle: userHandle,
            }).exec();
            if (!userQuery.length)
                res.status(400).send({
                    message: `Could not find user @${userHandle}`,
                    error: {},
                });
            else {
                const user = userQuery[0];
                const allPublicItemsFiltered = [];
                const publicListQuery = await data.ItemList.find({
                    userId: user._id,
                    privacy: "PUBLIC",
                }).exec();

                await Promise.all(
                    publicListQuery.map(async (list) => {
                        await Promise.all(
                            list.listItems.map(async (itemId) => {
                                const item = await data.Item.find({
                                    _id: itemId,
                                    tags: { $all: tags },
                                })
                                    .select("-_userId")
                                    .exec();

                                if (item.length)
                                    allPublicItemsFiltered.push(item[0]);
                            })
                        );
                    })
                );

                res.status(200).send({
                    message: `Succesfully retrieved ${allPublicItemsFiltered} items`,
                    items: allPublicItemsFiltered,
                });
            }
        }
    );

    app.route("/lists/:listId/items/filtered/").post(async (req, res) => {
        console.log("api: LISTS/LIST.ID/ITEMS/FILTERED -> POST");
        const { listId } = req.params;
        const { tags } = req.body;

        const list = await data.ItemList.findById(listId);
        if (!list)
            res.status(400).send({
                message: `Could not find list ${listId}`,
                error: {},
            });
        else {
            const itemsFiltered = [];
            await Promise.all(
                list.listItems.map(async (itemId) => {
                    const item = await data.Item.find({
                        _id: itemId,
                        tags: { $all: tags },
                    }).exec();

                    if (item.length) itemsFiltered.push(item[0]);
                })
            );

            res.status(200).send({
                message: `Succesfully retrieved ${itemsFiltered.length} items`,
                items: itemsFiltered,
            });
        }
    });

    return app;
};
