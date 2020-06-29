import path from "path";
import args from "args";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { JSDOM } from "jsdom";
import OgDoc from "./utils/OgDoc";
import { configSample, Config } from "./config";

function main() {
  let argv = [...process.argv];

  let HTMLDIR = "./html";
  let OUTDIR = "./out";

  args
    .command("init", "Generate working environment", (name, sub, options) => {
      // console.debug(name);
      // console.debug(sub);
      // console.debug(options);
      try {
        if (!existsSync(HTMLDIR)) mkdirSync(HTMLDIR);
        if (!existsSync(OUTDIR)) mkdirSync(OUTDIR);

        writeFileSync("./config.json", JSON.stringify(configSample, null, 2));
      } catch (e) {
        console.log(e);
      }
    })
    .option("file", "Path to the HTML file to work with", "")
    .option("out", "Path to the output directory", OUTDIR)
    .option("path", "Path of the file following the root URL", "")
    .option("lang", "Set language code", "")
    .option("gaid", "Google Analytics tracking ID", "")
    .option("thumbnail", "Thumbnail image", "")
    .option("doctype", "Set OG type by force", "")
    .option("config", "Path to the configuration file", "");

  let flag = args.parse(argv);
  // console.debug("flags", flag);

  if (argv.length < 3) {
    args.showHelp();
    return 0;
  }

  if (!flag.f) return 0;

  let og: OgDoc;
  try {
    let text = readFileSync(flag.f, "utf8");
    og = new OgDoc(new JSDOM(text));
  } catch (e) {
    console.log(e);
    console.log(`Failed to load HTML file "${flag.f}"`);
    return 4;
  }

  if (flag.g) {
    og.setGaid(flag.g);
  }

  let siteName: string | undefined;
  let title: string | undefined;
  let description: string | undefined;

  if (flag.c) {
    let conf: Config;
    try {
      let text = readFileSync(flag.c, "utf8");
      conf = JSON.parse(text);
    } catch (e) {
      console.log(e);
      console.log(`Failed to load configuration file "${flag.c}"`);
      return 2;
    }

    // console.debug("config", conf);

    let {
      fbAdmins,
      fbAppId,
      url,
      gaid,
      thumbnail,
      type,
      lang,
      keywords,
    } = conf;

    siteName = conf.siteName;
    title = conf.title;
    description = conf.description;

    if (siteName) {
      og.setOgMeta("og:site_name", siteName);
      title = siteName;
    }

    if (gaid) og.setGaid(gaid);
    if (lang) og.setLang(lang);
    if (fbAdmins) og.setOgMeta("fb:admins", fbAdmins);
    if (fbAppId) og.setOgMeta("fb:app_id", fbAppId);
    if (url) og.setOgMeta("og:url", url + (flag.p || ""));
    if (thumbnail) og.setOgMeta("og:image", url + thumbnail);
    if (type) og.setOgMeta("og:type", type);

    if (keywords) og.setKeywords(keywords);
  }

  if (flag.l) og.setLang(flag.l);
  if (flag.d) og.setOgMeta("og:type", flag.d);
  if (flag.t) og.setOgMeta("og:image", flag.t);

  try {
    let titleValue = og.uniqueTag("title").innerHTML || title;

    if (titleValue) {
      if (siteName) {
        titleValue += " - " + siteName;
      }
      og.setTitle(titleValue);
    }

    let tag = og.metaOrCreate("name", "description");
    let desc = tag.getAttribute("content") || description;
    og.setDescription(desc || "");
  } catch (e) {
    console.log(e);
  }

  try {
    let output = og.serialize();
    let f = `${flag.o}/${path.basename(flag.f)}`;
    if (!existsSync(flag.o)) {
      mkdirSync(flag.o, { recursive: true });
    }
    writeFileSync(f, output);
    console.log(`Success.`);
    console.log(`New file: ${f}`);
  } catch (e) {
    console.log(e);
    console.log("Failed to output.");
    return 5;
  }

  return 0;
}

export = main;
