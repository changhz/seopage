import { DOMWindow, JSDOM } from "jsdom";
import { isUndefined } from "util";
import { ga } from "../templates";

let ogProps = [
  "fb:app_id",
  "fb:admins",
  "og:site_name",
  "og:title",
  "og:type",
  "og:url",
  "og:image",
  "og:image:width",
  "og:image:height",
  "og:description",
  "og:locale",
  "og:locale:alternate",
] as const;

type OgProp = typeof ogProps[number];

export default class OgDoc {
  setGaid(id: string) {
    let elm = this.makeTag("div");
    elm.innerHTML = ga(id);
    Array.from(elm.childNodes)
      .reverse()
      .forEach((c) => {
        this.head.prepend(c.cloneNode(true));
      });
  }

  setKeywords(v: string) {
    let elm = this.metaOrCreate("name", "keywords");
    elm.setAttribute("content", v);
  }

  metaOrCreate(key: string, val: string) {
    let elm = this.tagsWithAttr("meta", key, val)[0];
    if (!elm) {
      elm = this.makeTag("meta");
      elm.setAttribute(key, val);
      this.head.appendChild(elm);
    }
    return elm;
  }

  setDescription(text: string) {
    let elm = this.metaOrCreate("name", "description");
    elm.setAttribute("content", text);

    this.setOgMeta("og:description", text);
    this.hasDesc = true;
  }

  setOgMeta(p: OgProp, value: string) {
    let tag = this.findOgTag(p);

    if (!tag) {
      tag = this.createOgMeta(p, value);
      this.head.appendChild(tag);
      return;
    }

    tag.setAttribute("content", value);
  }

  uniqueTag(name: string) {
    let elm = this.tags(name).item(0);
    if (!elm) {
      elm = this.makeTag(name);
    }
    return elm;
  }

  makeTag(name: string) {
    return this.doc.createElement(name);
  }

  tags(name: string) {
    return this.doc.getElementsByTagName(name);
  }

  serialize() {
    return this.dom.serialize();
  }

  createOgMeta(p: OgProp, content = "") {
    let elm = this.makeTag("meta");
    elm.setAttribute("property", p);
    elm.setAttribute("content", content);
    return elm;
  }

  createMeta(name: string, content = "") {
    let elm = this.makeTag("meta");
    elm.setAttribute("name", name);
    elm.setAttribute("content", content);
    return elm;
  }

  setOgTitle() {
    let elm = this.uniqueTag("title") as HTMLTitleElement;
    this.setOgMeta("og:title", elm.innerHTML);
  }

  setTitle(text: string) {
    let elm = this.uniqueTag("title") as HTMLTitleElement;
    if (!this.head.getElementsByTagName("title").length) {
      this.head.appendChild(elm);
    }

    elm.innerHTML = text;

    this.setOgMeta("og:title", text);
  }

  findOgTag(p: OgProp) {
    let list = this.tagsWithAttr("meta", "property", p);
    if (!list.length) return null;
    return list[0];
  }

  tagsWithAttr(name: string, attr: string, val?: string) {
    let res = Array.from(this.tags(name)).filter((t) => t.hasAttribute(attr));
    if (!isUndefined(val)) {
      res = res.filter((t) => t.getAttribute(attr) === val);
    }
    return res;
  }

  setLang(value: string) {
    this.html.setAttribute("lang", value);
  }

  dom: JSDOM;
  doc: Document;
  win: DOMWindow;

  html: HTMLHtmlElement;
  head: HTMLHeadElement;
  body: HTMLBodyElement;

  hasDesc = false;

  constructor(dom: JSDOM) {
    this.dom = dom;
    this.win = dom.window;
    this.doc = this.win.document;

    this.body = this.uniqueTag("body") as HTMLBodyElement;
    this.head = this.uniqueTag("head") as HTMLHeadElement;
    this.html = this.uniqueTag("html") as HTMLHtmlElement;

    this.html.setAttribute("prefix", "og: http://ogp.me/ns#");

    this.metaOrCreate("charset", "utf-8");

    let manifest = this.makeTag("link");
    manifest.setAttribute("rel", "manifest");
    manifest.setAttribute("href", "/manifest.webmanifest");
    this.head.appendChild(manifest);

    let elm;
    elm = this.metaOrCreate("name", "viewport");
    elm.setAttribute("content", "width=device-width, initial-scale=1");

    elm = this.metaOrCreate("http-equiv", "X-UA-Compatible");
    elm.setAttribute("content", "IE=edge");
  }
}
