export interface Config {
  fbAppId?: string;
  fbAdmins?: string;
  siteName?: string;
  url?: string;
  gaid?: string;
  lang?: string;
  title?: string;
  type?: string;
  thumbnail?: string;
  description?: string;
  keywords?: string;
}

export let configSample: Config = {
  fbAdmins: "admin.one,admin.two",
  fbAppId: "00000000",
  gaid: "UA-000000000-1",
  siteName: "Your Website",
  lang: "en-GB",
  type: "website",
  url: "https://yourwebsite.kom",
  thumbnail: "/public/thumb.jpg",
  title: "",
  description: "",
  keywords: "",
};
