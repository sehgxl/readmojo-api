import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import getSummary from "./getSummary.js";

const router = Router();
const primsa = new PrismaClient();

//Articles
router.get("/article", async (req, res) => {
  try {
    const articles = await primsa.article.findMany();
    res.json({
      message: "hello here are all your articles",
      allarticles: articles,
    });
  } catch (error) {
    res.json({
      message: "Sorry something went wrong, please try again :(",
      error: error,
      path: "get/article",
    });
  }
});

router.post("/article/:url", async (req, res) => {
  try {
    const { url } = req.params;
    let article = await primsa.article.findUnique({
      where: {
        url: url,
      },
    });
    if (article === null) {
      // const summary = await getSummary(req.body.body);
      const summary = await getSummary(req.body.body);
      // console.log("herree is the summary =>", summary);
      article = await primsa.article.create({
        data: {
          title: req.body.title,
          url: req.body.url,
          body: req.body.body,
          summary: summary,
        },
      });
    }
    res.json({ article });
  } catch (error) {
    res.json({
      message: "Sorry something went wrong, please try again :(",
      error: error,
      path: "get/article/url",
    });
  }
});

export default router;
