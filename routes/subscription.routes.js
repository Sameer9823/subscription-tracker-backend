import {Router} from "express";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlerware/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
    res.send({
        title: "all Subscription",
    });
});
subscriptionRouter.get("/:id", (req, res) => {
    res.send({
        title: "individual Subscription",
    });
});
subscriptionRouter.post("/", authorize ,createSubscription);
subscriptionRouter.put("/", (req, res) => {
    res.send({
        title: "update Subscription",
    });
});
subscriptionRouter.delete("/:id", (req, res) => {
    res.send({
        title: "delete Subscription",
    });
});
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", (req, res) => {
    res.send({
        title: "cancel Subscription",
    });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    res.send({
        title: "Renewals Subscription",
    });
});

export default subscriptionRouter