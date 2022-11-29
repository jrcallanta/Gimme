const e = require("express");
const { validateSession } = require("../dataSchemas/data");

module.exports = (data) => {
    console.log("requiring buyerList routes...");

    const express = require("express");
    const router = express.Router();

    // Helper Function
    const getBuyerList = async (itemId) => {
        // Check item exists
        const itemQuery = await data.Item.findById(itemId).exec();
        if (!itemQuery)
            return res.status(400).send({
                message: `Could not find item ${itemId}`,
                error: {},
            });

        // Check if user is following item owner

        // Look for buyerlist
        const buyerListQuery = await data.BuyerList.find({
            itemId: itemId,
        }).exec();
        console.log(buyerListQuery);

        return buyerListQuery.length ? buyerListQuery[0] : null;
    };

    const resolveBuyerIDs = async (buyers) => {
        if (!buyers || buyers.length === 0) return [];

        const resolved = await Promise.all(
            buyers.map(async (buyer) => {
                const user = await data.User.findById(buyer.userId);
                console.log(`searching for ${buyer.userId}...`, user);
                if (user)
                    return {
                        userId: user._id.toString(),
                        name: user.name,
                        handle: user.handle,
                        status: buyer.status,
                        lastUpdate: buyer.lastUpdate,
                    };
            })
        );

        console.log(resolved);
        return resolved;
    };

    // Retrieve Buyer List
    router.post("/buyerlist", async (req, res, next) => {
        console.log("api: BUYERLISTS -> POST");

        const { validation, userId, itemId } = req.body;
        const validSession = await validateSession(validation);
        if (!validSession) {
            res.status(400).send({
                message: `You must be signed in to perform this command`,
                error: {},
            });
            return;
        }

        const buyerList = await getBuyerList(itemId);

        if (buyerList) {
            const resolvedList = await resolveBuyerIDs(buyerList.buyers);
            res.status(200).send({
                message: "Buyer list retrieved.",
                buyerList: buyerList,
                buyers: resolvedList,
            });
        } else
            res.status(200).send({
                message: "Buyer list currently empty.",
                buyers: [],
            });
    });

    // Join Buyer List
    router.post("/buyerlist/join", async (req, res, next) => {
        const { validation, userId, itemId } = req.body;
        const validSession = await validateSession(validation);
        if (!validSession) {
            res.status(400).send({
                message: `You must be signed in to perform this command`,
                error: {},
            });
            return;
        }

        const newBuyer = {
            userId: userId,
            status: "interested",
        };

        const buyerList = await getBuyerList(itemId);

        if (buyerList) {
            if (
                buyerList.buyers
                    .map(({ userId }) => userId.toString())
                    .includes(userId)
            )
                res.status(400).send({
                    message: `You're already in the buyer list for item ${itemId}.`,
                });
            else {
                buyerList.buyers.push(newBuyer);
                const resolvedList = await resolveBuyerIDs(buyerList.buyers);

                await buyerList.save((saveError) => {
                    if (saveError)
                        res.status(400).send({
                            message: `Could not join buyer list for item ${itemId}. Try again.`,
                            error: saveError,
                        });
                    else
                        res.status(200).send({
                            message: "Joined buyer list.",
                            buyerlist: buyerList,
                            buyers: resolvedList,
                        });
                });
            }
        } else {
            const newBuyerList = new data.BuyerList({
                itemId: itemId,
                buyers: [newBuyer],
            });

            await newBuyerList.save(async (saveError) => {
                if (saveError)
                    res.status(400).send({
                        message: `Could not join buyer list for item ${itemId}. Try again.`,
                        error: saveError,
                    });
                else {
                    const resolvedList = await resolveBuyerIDs(
                        newBuyerList.buyers
                    );
                    res.status(200).send({
                        message: `New buyer list created and joined.`,
                        buyersList: newBuyerList,
                        buyers: resolvedList,
                    });
                }
            });
        }
    });

    router.post("/buyerlist/update", async (req, res, next) => {
        const { validation, userId, itemId, status } = req.body;
        const validSession = await validateSession(validation);
        if (!validSession) {
            res.status(400).send({
                message: `You must be signed in to perform this command`,
                error: {},
            });
            return;
        }

        const buyerList = await getBuyerList(itemId);
        const target = buyerList.buyers.filter((buyer) => {
            return buyer.userId.toString() === userId;
        });

        if (target.length) {
            const [newBuyer] = target;
            newBuyer.status = status;
            console.log("here");
            console.log(status);
            console.log(target);
            console.log(newBuyer);

            await buyerList.save(async (saveError) => {
                if (saveError)
                    res.status(400).send({
                        message: `Could not update your status for item ${itemId}`,
                        error: saveError,
                    });
                else {
                    const resolvedList = await resolveBuyerIDs(
                        buyerList.buyers
                    );
                    res.status(200).send({
                        message: `Updated your status for item ${itemId}`,
                        buyerList: buyerList,
                        buyers: resolvedList,
                    });
                }
            });
        } else
            res.status(400).send({
                message: `Could not find you in buyer list.`,
                error: {},
            });
    });

    router.post("/buyerlist/leave", async (req, res, next) => {
        const { validation, userId, itemId } = req.body;
        const validSession = await validateSession(validation);
        if (!validSession) {
            res.status(400).send({
                message: `You must be signed in to perform this command`,
                error: {},
            });
            return;
        }

        const buyerList = await getBuyerList(itemId);
        if (buyerList) {
            const newList = buyerList.buyers.filter(
                (buyer) => buyer.userId.toString() !== userId
            );
            buyerList.buyers = newList;
            const resolvedList = await resolveBuyerIDs(newList);
            buyerList.save((saveError) => {
                if (saveError)
                    res.status(400).send({
                        message: `Could not remove you from buyer list for ${itemId}. Try again.`,
                        error: saveError,
                    });
                else
                    res.status(200).send({
                        message: `You left the buyer list for item ${itemId}.`,
                        buyerList: buyerList,
                        buyers: resolvedList,
                    });
            });
        } else
            res.status(400).send({
                message: `Buyer list for the item ${itemId} is already empty.`,
                buyers: [],
            });
    });

    return router;
};
