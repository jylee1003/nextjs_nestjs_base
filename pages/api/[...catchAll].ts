import { NextApiRequest, NextApiResponse } from "next";
import { Main } from "@/server/main";

const catchAll = (req: NextApiRequest, res: NextApiResponse) =>
    new Promise(async (resolve) => {
        const listener = await Main.getListener();
        listener(req, res);
        res.on("finish", resolve);
    });

export default catchAll;