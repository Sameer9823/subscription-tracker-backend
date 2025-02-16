import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";
import { createRequire } from "module";
import { sendReminderEmail } from "../utils/sendemail.js";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

// ✅ Define fetchSubscription before using it
const fetchSubscription = async (context, subscriptionId) => {
    return await context.run("get subscription", async () => {
        const subscription = await Subscription.findById(subscriptionId)
            .populate("user", "name email")
            .lean();  // ✅ Convert to a plain JavaScript object to prevent circular JSON issue

        return subscription;
    });
};


export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);  // ✅ Now it will work

    if (!subscription || subscription.status !== "active") {
        console.log(`Subscription ${subscriptionId} not found or inactive.`);
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}, stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, "day");

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate.toDate());
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date);
};

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
            
        })
    });
};
