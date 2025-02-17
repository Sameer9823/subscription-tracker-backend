import { NODE_ENV, SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id, 
        });

        // 🔥 Fix: Corrected URL typo
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
            body: { subscriptionId: subscription.id },
            headers: { "Content-Type": "application/json" },
            retries: 0,
        });

        console.log(`Workflow triggered: ${workflowRunId}`);

        res.status(201).json({
            success: true,
            data: subscription,
            workflowRunId,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        
        if (req.user._id.toString() !== req.params.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: You do not own this subscription" });
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
        
    } catch (error) {
        next(error);
    }
};
