import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlerware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id",authorize, getUser);
userRouter.post("/", (req, res) => {
    res.send({
        title: "create User",
    });
});
userRouter.put("/:id", (req, res) => {
    res.send({
        title: "update User",
    });
});
userRouter.delete("/:id", (req, res) => {
    res.send({
        title: "delete User",
    });
});

export default userRouter;