import { Router } from "express";
import prisma from "./prismaClinet.js";
import getSummary from "./getSummary.js";

const router = Router();

//Articles
router.get("/article", async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
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

router.post("/article/", async (req, res) => {
  try {
    let article = await prisma.article.findUnique({
      where: {
        url: req.body.url,
      },
    });
    if (article === null) {
      // const summary = await getSummary(req.body.body);
      const summary = await getSummary(req.body.body);
      // console.log("herree is the summary =>", summary);
      article = await prisma.article.create({
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
